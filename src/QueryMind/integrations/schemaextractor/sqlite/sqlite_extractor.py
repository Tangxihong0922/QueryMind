"""
SQLite implementation of SchemaExtractor.

This module extracts table schemas from SQLite databases using
sqlite_master and PRAGMA queries.
"""

import logging
import sqlite3
from typing import List, Optional, Dict, Any

from QueryMind.capabilities.schema_extracter.base import SchemaExtractor
from QueryMind.capabilities.schema_memory.models import (
    TableSchema,
    FieldDefinition,
    BusinessContext,
    ForeignKeyReference,
    TableRelationship,
)

logger = logging.getLogger(__name__)


class SqliteSchemaExtractor(SchemaExtractor):
    """
    SQLite implementation of SchemaExtractor.
    
    Extracts table schemas from SQLite using:
    - sqlite_master (table metadata)
    - PRAGMA table_info (column details)
    - PRAGMA foreign_key_list (foreign keys)
    
    Example:
        >>> extractor = SqliteSchemaExtractor(database_path="/path/to/db.sqlite")
        >>> tables = await extractor.extract_all_tables()
    """

    def __init__(self, database_path: str):
        """
        Initialize SQLite schema extractor.
        
        Args:
            database_path: Path to the SQLite database file
        """
        self.database_path = database_path
        self._conn: Optional[sqlite3.Connection] = None

    def _get_connection(self) -> sqlite3.Connection:
        """Get or create database connection."""
        if self._conn is None:
            self._conn = sqlite3.connect(self.database_path)
            self._conn.row_factory = sqlite3.Row
        return self._conn

    @property
    def source_info(self) -> str:
        """Get SQLite source information."""
        return f"SQLite: {self.database_path}"

    async def list_tables(self, schema_name: str = "main") -> List[str]:
        """List all tables in a schema (database)."""
        conn = self._get_connection()
        cursor = conn.cursor()
        
        try:
            # For SQLite, schema is typically "main" or attached database name
            cursor.execute("""
                SELECT name
                FROM sqlite_master
                WHERE type = 'table'
                AND name NOT LIKE 'sqlite_%'
                AND (schema IS NULL OR schema = ?)
                ORDER BY name
            """, (schema_name,))
            
            rows = cursor.fetchall()
            return [row[0] for row in rows]
        finally:
            cursor.close()

    async def extract_table(
        self,
        table_name: str,
        schema_name: str = "main"
    ) -> Optional[TableSchema]:
        """Extract schema for a specific table."""
        tables = await self.extract_all_tables()
        
        for table in tables:
            if table.table_name == table_name:
                return table
        return None

    async def extract_all_tables(self) -> List[TableSchema]:
        """
        Extract schemas for all tables in the database.
        
        Returns:
            List of TableSchema objects
        """
        conn = self._get_connection()
        cursor = conn.cursor()
        
        try:
            tables = []
            
            # Step 1: Get all tables
            cursor.execute("""
                SELECT 
                    name,
                    sql,
                    type
                FROM sqlite_master
                WHERE type IN ('table', 'view')
                AND name NOT LIKE 'sqlite_%'
                ORDER BY name
            """)
            
            table_rows = cursor.fetchall()
            table_names = [row['name'] for row in table_rows]
            
            logger.info(f"Found {len(table_rows)} tables to process")
            
            # Step 2: Get column info for all tables
            columns_by_table: Dict[str, List[Dict]] = {}
            for table_name in table_names:
                cursor.execute(f"PRAGMA table_info('{table_name}')")
                columns = cursor.fetchall()
                columns_by_table[table_name] = [
                    {
                        'cid': col[0],
                        'name': col[1],
                        'type': col[2],
                        'notnull': col[3],
                        'dflt_value': col[4],
                        'pk': col[5],
                    }
                    for col in columns
                ]
            
            # Step 3: Get foreign keys for all tables
            fk_by_table: Dict[str, List[Dict]] = {}
            for table_name in table_names:
                cursor.execute(f"PRAGMA foreign_key_list('{table_name}')")
                fks = cursor.fetchall()
                fk_by_table[table_name] = [
                    {
                        'id': fk[0],
                        'seq': fk[1],
                        'table': fk[2],
                        'from': fk[3],
                        'to': fk[4],
                    }
                    for fk in fks
                ]
            
            # Step 4: Build TableSchema objects
            for table_row in table_rows:
                table_name = table_row['name']
                table_sql = table_row['sql'] or ""
                
                # Get columns for this table
                table_columns = columns_by_table.get(table_name, [])
                table_fks = fk_by_table.get(table_name, [])
                fk_column_map = {fk['from']: fk for fk in table_fks}
                
                # Build field definitions
                field_definitions = []
                for col in table_columns:
                    fk_info = fk_column_map.get(col['name'])
                    fk_ref = None
                    
                    if fk_info:
                        fk_ref = ForeignKeyReference(
                            table_name=fk_info['table'],
                            schema_name="main",
                            column_name=fk_info['to'],
                        )
                    
                    field = FieldDefinition(
                        field_name=col['name'],
                        data_type=col['type'] or "TEXT",
                        ordinal_position=col['cid'],
                        is_primary_key=bool(col['pk']),
                        is_foreign_key=fk_info is not None,
                        is_nullable=not bool(col['notnull']),
                        foreign_key=fk_ref,
                    )
                    field_definitions.append(field)
                
                # Build relationships
                relationships = []
                for fk in table_fks:
                    rel = TableRelationship(
                        from_table=table_name,
                        from_field=fk['from'],
                        to_table=fk['table'],
                        to_field=fk['to'],
                        description=f"{fk['from']} references {fk['table']}.{fk['to']}",
                    )
                    relationships.append(rel)
                
                # Build table schema
                table_schema = TableSchema(
                    table_name=table_name,
                    schema_name="main",
                    database_name=self.database_path,
                    ddl=table_sql,
                    field_definitions=field_definitions,
                    relationships=relationships,
                    business_context=BusinessContext(
                        domain="main",
                        description=f"{table_name} table",
                    ),
                )
                tables.append(table_schema)
            
            logger.info(f"Extracted {len(tables)} table schemas")
            return tables
            
        finally:
            cursor.close()

    def close(self) -> None:
        """Close the database connection."""
        if self._conn:
            self._conn.close()
            self._conn = None
