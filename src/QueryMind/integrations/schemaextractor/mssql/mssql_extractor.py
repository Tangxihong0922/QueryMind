"""
Microsoft SQL Server implementation of SchemaExtractor.

This module extracts table schemas from MSSQL databases using
information_schema and sys views.
"""

import logging
from typing import List, Optional, Dict, Any

import pandas as pd

from QueryMind.capabilities.schema_extracter.base import SchemaExtractor
from QueryMind.capabilities.schema_memory.models import (
    TableSchema,
    FieldDefinition,
    BusinessContext,
    ForeignKeyReference,
    TableRelationship,
)

logger = logging.getLogger(__name__)


class MSSQLSchemaExtractor(SchemaExtractor):
    """
    Microsoft SQL Server implementation of SchemaExtractor.
    
    Extracts table schemas from MSSQL using:
    - information_schema.tables
    - information_schema.columns
    - information_schema.table_constraints
    - information_schema.referential_constraints
    
    Example:
        >>> extractor = MSSQLSchemaExtractor(
        ...     odbc_conn_str="DRIVER={ODBC Driver 17};SERVER=localhost;DATABASE=mydb;UID=user;PWD=pass"
        ... )
        >>> tables = await extractor.extract_all_tables()
    """

    def __init__(
        self,
        odbc_conn_str: str,
        **kwargs,
    ):
        """
        Initialize MSSQL schema extractor.
        
        Args:
            odbc_conn_str: ODBC connection string for SQL Server
            **kwargs: Additional SQLAlchemy parameters
        """
        try:
            import pyodbc
            self.pyodbc = pyodbc
        except ImportError:
            raise ImportError(
                "pyodbc is required. Install with: pip install pyodbc"
            )
        
        try:
            import sqlalchemy as sa
            from sqlalchemy.engine import URL
            from sqlalchemy import create_engine
            
            self.sa = sa
            self.URL = URL
            self.create_engine = create_engine
        except ImportError:
            raise ImportError(
                "sqlalchemy is required. Install with: pip install sqlalchemy"
            )
        
        # Parse database name from connection string
        self._db_name = self._parse_db_name(odbc_conn_str)
        
        # Create SQLAlchemy engine
        connection_url = self.URL.create(
            "mssql+pyodbc", query={"odbc_connect": odbc_conn_str}
        )
        self._engine = self.create_engine(connection_url, **kwargs)

    def _parse_db_name(self, conn_str: str) -> str:
        """Extract database name from ODBC connection string."""
        import re
        match = re.search(r'DATABASE=([^;]+)', conn_str, re.IGNORECASE)
        return match.group(1) if match else "unknown"

    @property
    def source_info(self) -> str:
        """Get MSSQL source information."""
        return f"MSSQL: {self._db_name}"

    async def list_tables(self, schema_name: str = "dbo") -> List[str]:
        """List all tables in a schema."""
        query = """
            SELECT TABLE_NAME
            FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_SCHEMA = ?
            AND TABLE_TYPE = 'BASE TABLE'
            ORDER BY TABLE_NAME
        """
        
        with self._engine.begin() as conn:
            df = pd.read_sql_query(self.sa.text(query), conn, params=[schema_name])
            return df['TABLE_NAME'].tolist()

    async def extract_table(
        self,
        table_name: str,
        schema_name: str = "dbo"
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
            schema_filter: Optional schema name to filter
            table_filter: Optional table name to filter
            
        Returns:
            List of TableSchema objects
        """
        with self._engine.begin() as conn:
            tables = []
            
            # Step 1: Get all tables
            query = """
                SELECT 
                    t.TABLE_SCHEMA,
                    t.TABLE_NAME,
                    ep.value AS description
                FROM INFORMATION_SCHEMA.TABLES t
                LEFT JOIN sys.extended_properties ep 
                    ON ep.major_id = OBJECT_ID(t.TABLE_SCHEMA + '.' + t.TABLE_NAME)
                    AND ep.minor_id = 0
                    AND ep.name = 'MS_Description'
                WHERE t.TABLE_TYPE = 'BASE TABLE'
            """
            params = []
            
            if schema_filter:
                query += " AND t.TABLE_SCHEMA = ?"
                params.append(schema_filter)
            
            if table_filter:
                query += " AND t.TABLE_NAME = ?"
                params.append(table_filter)
            
            query += " ORDER BY t.TABLE_SCHEMA, t.TABLE_NAME"
            
            df_tables = pd.read_sql_query(self.sa.text(query), conn, params=params or None)
            table_rows = df_tables.to_dict('records')
            
            logger.info(f"Found {len(table_rows)} tables to process")
            
            if not table_rows:
                return []
            
            # Get unique schemas and tables for subsequent queries
            schema_names = list(set(r['TABLE_SCHEMA'] for r in table_rows))
            table_names = [r['TABLE_NAME'] for r in table_rows]
            
            # Step 2: Get all columns
            # Build query with schema/table filters
            placeholders = ','.join(['?' for _ in schema_names])
            columns_query = f"""
                SELECT 
                    c.TABLE_SCHEMA,
                    c.TABLE_NAME,
                    c.COLUMN_NAME,
                    c.DATA_TYPE,
                    c.IS_NULLABLE,
                    c.COLUMN_DEFAULT,
                    c.CHARACTER_MAXIMUM_LENGTH,
                    c.NUMERIC_PRECISION,
                    c.NUMERIC_SCALE,
                    c.ORDINAL_POSITION,
                    ep.value AS description
                FROM INFORMATION_SCHEMA.COLUMNS c
                LEFT JOIN sys.extended_properties ep 
                    ON ep.major_id = OBJECT_ID(c.TABLE_SCHEMA + '.' + c.TABLE_NAME)
                    AND ep.minor_id = c.ORDINAL_POSITION
                    AND ep.name = 'MS_Description'
                WHERE c.TABLE_SCHEMA IN ({placeholders})
                AND c.TABLE_NAME IN ({','.join(['?' for _ in table_names])})
                ORDER BY c.TABLE_SCHEMA, c.TABLE_NAME, c.ORDINAL_POSITION
            """
            columns_params = schema_names + table_names
            
            df_columns = pd.read_sql_query(self.sa.text(columns_query), conn, params=columns_params)
            
            columns_by_table: Dict[str, List[Dict]] = {}
            for _, row in df_columns.iterrows():
                key = f"{row['TABLE_SCHEMA']}.{row['TABLE_NAME']}"
                if key not in columns_by_table:
                    columns_by_table[key] = []
                columns_by_table[key].append(dict(row))
            
            # Step 3: Get primary keys
            pk_query = f"""
                SELECT 
                    kcu.TABLE_SCHEMA,
                    kcu.TABLE_NAME,
                    kcu.COLUMN_NAME,
                    kcu.ORDINAL_POSITION
                FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
                JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
                    ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
                    AND tc.TABLE_SCHEMA = kcu.TABLE_SCHEMA
                WHERE tc.CONSTRAINT_TYPE = 'PRIMARY KEY'
                AND tc.TABLE_SCHEMA IN ({placeholders})
                AND tc.TABLE_NAME IN ({','.join(['?' for _ in table_names])})
                ORDER BY tc.TABLE_SCHEMA, tc.TABLE_NAME, kcu.ORDINAL_POSITION
            """
            pk_params = schema_names + table_names
            
            df_pk = pd.read_sql_query(self.sa.text(pk_query), conn, params=pk_params)
            
            pk_columns: Dict[str, set] = {}
            for _, row in df_pk.iterrows():
                key = f"{row['TABLE_SCHEMA']}.{row['TABLE_NAME']}"
                if key not in pk_columns:
                    pk_columns[key] = set()
                pk_columns[key].add(row['COLUMN_NAME'])
            
            # Step 4: Get foreign keys
            fk_query = f"""
                SELECT
                    tc.TABLE_SCHEMA,
                    tc.TABLE_NAME,
                    kcu.COLUMN_NAME,
                    rc.UNIQUE_CONSTRAINT_SCHEMA,
                    rc2.TABLE_NAME AS FOREIGN_TABLE_NAME,
                    rc2.TABLE_SCHEMA AS FOREIGN_TABLE_SCHEMA,
                    kcu2.COLUMN_NAME AS FOREIGN_COLUMN_NAME
                FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
                JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc
                    ON tc.CONSTRAINT_NAME = rc.CONSTRAINT_NAME
                JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS rc2
                    ON rc.UNIQUE_CONSTRAINT_NAME = rc2.CONSTRAINT_NAME
                    AND rc.UNIQUE_CONSTRAINT_SCHEMA = rc2.TABLE_SCHEMA
                JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
                    ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
                    AND tc.TABLE_SCHEMA = kcu.TABLE_SCHEMA
                JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu2
                    ON rc.UNIQUE_CONSTRAINT_NAME = kcu2.CONSTRAINT_NAME
                    AND rc.UNIQUE_CONSTRAINT_SCHEMA = kcu2.TABLE_SCHEMA
                WHERE tc.CONSTRAINT_TYPE = 'FOREIGN KEY'
                AND tc.TABLE_SCHEMA IN ({placeholders})
                AND tc.TABLE_NAME IN ({','.join(['?' for _ in table_names])})
            """
            fk_params = schema_names + table_names
            
            df_fk = pd.read_sql_query(self.sa.text(fk_query), conn, params=fk_params)
            
            fk_by_table: Dict[str, List[Dict]] = {}
            for _, row in df_fk.iterrows():
                key = f"{row['TABLE_SCHEMA']}.{row['TABLE_NAME']}"
                if key not in fk_by_table:
                    fk_by_table[key] = []
                fk_by_table[key].append(dict(row))
            
            # Step 5: Build TableSchema objects
            for table_row in table_rows:
                schema_name = table_row['TABLE_SCHEMA']
                table_name = table_row['TABLE_NAME']
                key = f"{schema_name}.{table_name}"
                
                # Get columns for this table
                table_columns = columns_by_table.get(key, [])
                pk_set = pk_columns.get(key, set())
                fk_list = fk_by_table.get(key, [])
                fk_column_set = {fk['COLUMN_NAME'] for fk in fk_list}
                
                # Build field definitions
                field_definitions = []
                for col in table_columns:
                    fk_ref = None
                    for fk in fk_list:
                        if fk['COLUMN_NAME'] == col['COLUMN_NAME']:
                            fk_ref = ForeignKeyReference(
                                table_name=fk['FOREIGN_TABLE_NAME'],
                                schema_name=fk['FOREIGN_TABLE_SCHEMA'],
                                column_name=fk['FOREIGN_COLUMN_NAME'],
                            )
                            break
                    
                    # Format data type
                    data_type = col['DATA_TYPE']
                    if col.get('CHARACTER_MAXIMUM_LENGTH'):
                        data_type = f"{data_type}({col['CHARACTER_MAXIMUM_LENGTH']})"
                    elif col.get('NUMERIC_PRECISION') is not None:
                        if col.get('NUMERIC_SCALE') is not None:
                            data_type = f"{data_type}({col['NUMERIC_PRECISION']},{col['NUMERIC_SCALE']})"
                        else:
                            data_type = f"{data_type}({col['NUMERIC_PRECISION']})"
                    
                    field = FieldDefinition(
                        field_name=col['COLUMN_NAME'],
                        data_type=data_type,
                        ordinal_position=col['ORDINAL_POSITION'],
                        is_primary_key=col['COLUMN_NAME'] in pk_set,
                        is_foreign_key=col['COLUMN_NAME'] in fk_column_set,
                        is_nullable=(col['IS_NULLABLE'] == 'YES'),
                        foreign_key=fk_ref,
                        description=col.get('description'),
                    )
                    field_definitions.append(field)
                
                # Build relationships
                relationships = []
                for fk in fk_list:
                    rel = TableRelationship(
                        from_table=table_name,
                        from_field=fk['COLUMN_NAME'],
                        to_table=fk['FOREIGN_TABLE_NAME'],
                        to_field=fk['FOREIGN_COLUMN_NAME'],
                        description=f"{fk['COLUMN_NAME']} references {fk['FOREIGN_TABLE_SCHEMA']}.{fk['FOREIGN_TABLE_NAME']}.{fk['FOREIGN_COLUMN_NAME']}",
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

    def close(self) -> None:
        """Close the database engine."""
        if self._engine:
            self._engine.dispose()
