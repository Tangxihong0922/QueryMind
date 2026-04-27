"""
Schema Extractor capability package.

This module provides the abstract base class for extracting database schemas
and the SchemaSyncEngine for initialization and lifecycle management.

Architecture:
    capabilities/schema_extracter/   - Abstract base and models
    integrations/schemaextractor/   - Database-specific implementations

Example:
    >>> from QueryMind.capabilities.schema_extracter import SchemaExtractor, SchemaSyncEngine
    >>> from QueryMind.integrations.schemaextractor import PostgresSchemaExtractor
    >>> from QueryMind.integrations.schemamemory import Neo4jMem0SchemaMemory
    >>> 
    >>> extractor = PostgresSchemaExtractor(connection_string="...")
    >>> schema_memory = Neo4jMem0SchemaMemory(config=neo4j_config)
    >>> engine = SchemaSyncEngine(schema_memory)
    >>> 
    >>> # Initialize schema memory
    >>> result = await engine.initialize(extractor)
"""

from .base import SchemaExtractor, SchemaSyncEngine
from .models import SchemaExtractResult, InitResult

__all__ = [
    "SchemaExtractor",
    "SchemaSyncEngine",
    "SchemaExtractResult",
    "InitResult",
]
