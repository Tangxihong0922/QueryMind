"""
Schema Extractor integrations for various databases.

This module provides database-specific implementations of SchemaExtractor.

Architecture (following sqlrunner pattern):
    schemaextractor/
        __init__.py           - Factory and exports
        postgres/
            postgres_extractor.py
        sqlite/
            sqlite_extractor.py
        mssql/
            mssql_extractor.py

Example:
    >>> from QueryMind.integrations.schemaextractor import PostgresSchemaExtractor
    >>> 
    >>> extractor = PostgresSchemaExtractor(connection_string="postgresql://...")
    >>> tables = await extractor.extract_all_tables()
"""

from .postgres import PostgresSchemaExtractor
from .sqlite import SqliteSchemaExtractor
from .mssql import MSSQLSchemaExtractor

__all__ = [
    "PostgresSchemaExtractor",
    "SqliteSchemaExtractor",
    "MSSQLSchemaExtractor",
]
