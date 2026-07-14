"""
PostgreSQL implementation of SchemaExtractor.

This module extracts table schemas from PostgreSQL databases using
information_schema and pg_catalog queries.
"""

import logging
from typing import List, Optional, Dict, Any

import psycopg2
import psycopg2.extras

from QueryMind.capabilities.schema_extracter.base import SchemaExtractor
from QueryMind.capabilities.schema_memory.models import (
    TableSchema,
    FieldDefinition,
    BusinessContext,
    ForeignKeyReference,
    TableRelationship,
)

logger = logging.getLogger(__name__)


class PostgresSchemaExtractor(SchemaExtractor):
    """
    PostgreSQL implementation of SchemaExtractor.
    
    Extracts table schemas from PostgreSQL using:
    - information_schema.tables
    - information_schema.columns
    - pg_catalog.pg_constraint (primary and foreign keys for read-only users)
    - pg_catalog.pg_indexes (for index info)
    
    Example:
        >>> extractor = PostgresSchemaExtractor(
        ...     connection_string="postgresql://user:pass@localhost:5432/mydb"
        ... )
        >>> tables = await extractor.extract_all_tables()
    """

    DEFAULT_ALLOWED_SCHEMAS = [
        "person",
        "humanresources",
        "production",
        "purchasing",
        "sales",
    ]

    def __init__(
        self,
        connection_string: Optional[str] = None,
        host: Optional[str] = None,
        port: int = 5432,
        database: Optional[str] = None,
        user: Optional[str] = None,
        password: Optional[str] = None,
        allowed_schemas: Optional[List[str]] = None,
        **kwargs,
    ):
        """
        Initialize PostgreSQL schema extractor.
        
        Args:
            connection_string: Full PostgreSQL connection string
            host: Database host
            port: Database port (default: 5432)
            database: Database name
            user: Database user
            password: Database password
            allowed_schemas: Optional whitelist of schemas to include
            **kwargs: Additional psycopg2 parameters
        """
        try:
            import psycopg2
            import psycopg2.extras
            self.psycopg2 = psycopg2
            self.extras = psycopg2.extras
        except ImportError:
            raise ImportError(
                "psycopg2 is required. Install with: pip install psycopg2-binary"
            )
        
        if connection_string:
            self.connection_string = connection_string
            self.connection_params = None
            # Extract database name from connection string for source_info
            self._db_name = self._parse_db_name(connection_string)
        elif host and database and user:
            self.connection_params = {
                "host": host,
                "port": port,
                "database": database,
                "user": user,
                "password": password,
                **kwargs,
            }
            self.connection_string = None
            self._db_name = database
        else:
            raise ValueError(
                "Provide either connection_string OR (host, database, user) parameters"
            )

        self._allowed_schemas = self._normalize_allowed_schemas(
            allowed_schemas or self.DEFAULT_ALLOWED_SCHEMAS
        )
    
    def _parse_db_name(self, conn_str: str) -> str:
        """Extract database name from connection string."""
        import re
        match = re.search(r'/([^/?]+)', conn_str)
        return match.group(1) if match else "unknown"

    def _get_connection(self):
        """Create a new database connection."""
        if self.connection_string:
            return self.psycopg2.connect(self.connection_string)
        return self.psycopg2.connect(**self.connection_params)

    @staticmethod
    def _normalize_allowed_schemas(
        allowed_schemas: Optional[List[str]],
    ) -> Optional[List[str]]:
        """Normalize schema allowlist to lower-case unique values."""
        if not allowed_schemas:
            return None

        normalized = []
        seen = set()
        for schema in allowed_schemas:
            value = str(schema).strip().lower()
            if not value or value in seen:
                continue
            seen.add(value)
            normalized.append(value)

        return normalized or None

    @property
    def source_info(self) -> str:
        """Get PostgreSQL source information."""
        if self.connection_string:
            return f"PostgreSQL: {self._db_name}"
        elif self.connection_params:
            host = self.connection_params.get("host", "localhost")
            port = self.connection_params.get("port", 5432)
            return f"PostgreSQL: {self._db_name}@{host}:{port}"
        return "PostgreSQL: unknown"

    async def list_tables(self, schema_name: str = "public") -> List[str]:
        """List all tables in a schema."""
        if self._allowed_schemas and schema_name.strip().lower() not in self._allowed_schemas:
            logger.info("Skipping schema %s because it is not in the allowed schema list", schema_name)
            return []

        conn = self._get_connection()
        cursor = conn.cursor(cursor_factory=self.extras.RealDictCursor)
        
        try:
            schema_name = schema_name.strip().lower()
            cursor.execute("""
                SELECT table_name
                FROM information_schema.tables
                WHERE lower(table_schema) = %s
                AND table_type = 'BASE TABLE'
                ORDER BY table_name
            """, (schema_name,))
            
            rows = cursor.fetchall()
            return [row['table_name'] for row in rows]
        finally:
            cursor.close()
            conn.close()

    async def extract_table(
        self,
        table_name: str,
        schema_name: str = "public"
    ) -> Optional[TableSchema]:
        """Extract schema for a specific table."""
        tables = await self.extract_all_tables(
            schema_filter=schema_name,
            table_filter=table_name
        )
        
        for table in tables:
            if table.table_name == table_name and table.schema_name == schema_name:
                return table
        return None

    async def extract_all_tables(
        self,
        schema_filter: Optional[str] = None,
        table_filter: Optional[str] = None,
    ) -> List[TableSchema]:
        """
        Extract schemas for all tables in the database.
        
        Args:
            schema_filter: Optional schema name to filter (for testing)
            table_filter: Optional table name to filter (for testing)
            
        Returns:
            List of TableSchema objects
        """
        conn = self._get_connection()
        cursor = conn.cursor(cursor_factory=self.extras.RealDictCursor)
        
        try:
            tables = []
            
            # Step 1: Get all tables
            query = """
                SELECT 
                    t.table_schema,
                    t.table_name,
                    obj_description((t.table_schema || '.' || t.table_name)::regclass, 'pg_class') as description
                FROM information_schema.tables t
                WHERE t.table_type = 'BASE TABLE'
            """
            params = []

            if self._allowed_schemas:
                query += " AND lower(t.table_schema) = ANY(%s)"
                params.append(self._allowed_schemas)
            
            if schema_filter:
                schema_filter = schema_filter.strip().lower()
                query += " AND lower(t.table_schema) = %s"
                params.append(schema_filter)
            
            if table_filter:
                query += " AND t.table_name = %s"
                params.append(table_filter)
            
            query += " ORDER BY t.table_schema, t.table_name"
            
            cursor.execute(query, params)
            table_rows = cursor.fetchall()
            
            logger.info(f"Found {len(table_rows)} tables to process")
            
            # Step 2: Get all columns for these tables
            schema_names = list(set(r['table_schema'] for r in table_rows))
            table_names = [r['table_name'] for r in table_rows]
            
            # Get columns
            cursor.execute("""
                SELECT 
                    c.table_schema,
                    c.table_name,
                    c.column_name,
                    c.data_type,
                    c.is_nullable,
                    c.column_default,
                    c.character_maximum_length,
                    c.numeric_precision,
                    c.numeric_scale,
                    c.ordinal_position,
                    col_description(
                        (c.table_schema || '.' || c.table_name)::regclass, 
                        c.ordinal_position
                    ) as description,
                    c.domain_name
                FROM information_schema.columns c
                WHERE c.table_schema = ANY(%s)
                AND c.table_name = ANY(%s)
                ORDER BY c.table_schema, c.table_name, c.ordinal_position
            """, (schema_names, table_names))
            
            columns_by_table: Dict[str, List[Dict]] = {}
            for row in cursor.fetchall():
                key = f"{row['table_schema']}.{row['table_name']}"
                if key not in columns_by_table:
                    columns_by_table[key] = []
                columns_by_table[key].append(dict(row))
            
            # Step 3: Get primary keys
            cursor.execute("""
                SELECT
                    ns.nspname AS table_schema,
                    tbl.relname AS table_name,
                    att.attname AS column_name,
                    key_col.ordinality AS ordinal_position
                FROM pg_catalog.pg_constraint con
                JOIN pg_catalog.pg_class tbl ON tbl.oid = con.conrelid
                JOIN pg_catalog.pg_namespace ns ON ns.oid = tbl.relnamespace
                JOIN LATERAL unnest(con.conkey) WITH ORDINALITY
                    AS key_col(attnum, ordinality) ON TRUE
                JOIN pg_catalog.pg_attribute att
                    ON att.attrelid = tbl.oid AND att.attnum = key_col.attnum
                WHERE con.contype = 'p'
                AND ns.nspname = ANY(%s)
                AND tbl.relname = ANY(%s)
                ORDER BY ns.nspname, tbl.relname, key_col.ordinality
            """, (schema_names, table_names))
            
            pk_columns: Dict[str, set] = {}
            for row in cursor.fetchall():
                key = f"{row['table_schema']}.{row['table_name']}"
                if key not in pk_columns:
                    pk_columns[key] = set()
                pk_columns[key].add(row['column_name'])
            
            # Step 4: Get foreign keys
            cursor.execute("""
                SELECT
                    src_ns.nspname AS table_schema,
                    src_tbl.relname AS table_name,
                    src_att.attname AS column_name,
                    ref_ns.nspname AS foreign_table_schema,
                    ref_tbl.relname AS foreign_table_name,
                    ref_att.attname AS foreign_column_name
                FROM pg_catalog.pg_constraint con
                JOIN pg_catalog.pg_class src_tbl ON src_tbl.oid = con.conrelid
                JOIN pg_catalog.pg_namespace src_ns ON src_ns.oid = src_tbl.relnamespace
                JOIN pg_catalog.pg_class ref_tbl ON ref_tbl.oid = con.confrelid
                JOIN pg_catalog.pg_namespace ref_ns ON ref_ns.oid = ref_tbl.relnamespace
                JOIN LATERAL unnest(con.conkey) WITH ORDINALITY
                    AS src_key(attnum, ordinality) ON TRUE
                JOIN LATERAL unnest(con.confkey) WITH ORDINALITY
                    AS ref_key(attnum, ordinality)
                    ON ref_key.ordinality = src_key.ordinality
                JOIN pg_catalog.pg_attribute src_att
                    ON src_att.attrelid = src_tbl.oid AND src_att.attnum = src_key.attnum
                JOIN pg_catalog.pg_attribute ref_att
                    ON ref_att.attrelid = ref_tbl.oid AND ref_att.attnum = ref_key.attnum
                WHERE con.contype = 'f'
                AND src_ns.nspname = ANY(%s)
                AND src_tbl.relname = ANY(%s)
                ORDER BY src_ns.nspname, src_tbl.relname, src_key.ordinality
            """, (schema_names, table_names))
            
            fk_by_table: Dict[str, List[Dict]] = {}
            for row in cursor.fetchall():
                key = f"{row['table_schema']}.{row['table_name']}"
                if key not in fk_by_table:
                    fk_by_table[key] = []
                fk_by_table[key].append(dict(row))
            
            # Step 5: Build TableSchema objects
            for table_row in table_rows:
                schema_name = table_row['table_schema']
                table_name = table_row['table_name']
                key = f"{schema_name}.{table_name}"
                
                # Get columns for this table
                table_columns = columns_by_table.get(key, [])
                pk_set = pk_columns.get(key, set())
                fk_list = fk_by_table.get(key, [])
                fk_column_set = {fk['column_name'] for fk in fk_list}
                
                # Build field definitions
                field_definitions = []
                for col in table_columns:
                    fk_ref = None
                    for fk in fk_list:
                        if fk['column_name'] == col['column_name']:
                            fk_ref = ForeignKeyReference(
                                table_name=fk['foreign_table_name'],
                                schema_name=fk['foreign_table_schema'],
                                column_name=fk['foreign_column_name'],
                            )
                            break
                    
                    # Format data type
                    data_type = col['data_type']
                    if col.get('character_maximum_length'):
                        data_type = f"{data_type}({col['character_maximum_length']})"
                    elif col.get('numeric_precision') is not None:
                        if col.get('numeric_scale') is not None:
                            data_type = f"{data_type}({col['numeric_precision']},{col['numeric_scale']})"
                        else:
                            data_type = f"{data_type}({col['numeric_precision']})"
                    
                    field = FieldDefinition(
                        field_name=col['column_name'],
                        data_type=data_type,
                        ordinal_position=col['ordinal_position'],
                        is_primary_key=col['column_name'] in pk_set,
                        is_foreign_key=col['column_name'] in fk_column_set,
                        is_nullable=(col['is_nullable'] == 'YES'),
                        foreign_key=fk_ref,
                        description=col.get('description'),
                    )
                    field_definitions.append(field)
                
                # Build relationships
                relationships = []
                for fk in fk_list:
                    rel = TableRelationship(
                        from_table=table_name,
                        from_field=fk['column_name'],
                        from_schema=schema_name,
                        to_table=fk['foreign_table_name'],
                        to_field=fk['foreign_column_name'],
                        to_schema=fk['foreign_table_schema'],
                        description=f"{fk['column_name']} references {fk['foreign_table_schema']}.{fk['foreign_table_name']}.{fk['foreign_column_name']}",
                    )
                    relationships.append(rel)
                
                # Build table schema
                table_schema = TableSchema(
                    table_name=table_name,
                    schema_name=schema_name,
                    database_name=self._db_name,
                    ddl="",  # DDL not extracted in this implementation
                    field_definitions=field_definitions,
                    relationships=relationships,
                    business_context=BusinessContext(
                        domain=schema_name,
                        description=table_row.get('description') or f"{table_name} table",
                    ),
                )
                tables.append(table_schema)
            
            logger.info(f"Extracted {len(tables)} table schemas")
            return tables
            
        finally:
            cursor.close()
            conn.close()
