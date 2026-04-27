"""
Schema Management integrations for various storage backends.

This module provides backend-specific implementations of SchemaManagementService.

Architecture (following schemaextractor pattern):
    schemamanagement/
        __init__.py           - Factory and exports
        neo4j_mem0/
            __init__.py
            neo4j_mem0_schema_management.py

Example:
    >>> from QueryMind.integrations.schemamanagement import Neo4jMem0SchemaManagementService
    >>> from QueryMind.integrations.schemamemory import Neo4jMem0SchemaMemory
    >>> 
    >>> schema_memory = Neo4jMem0SchemaMemory(config=neo4j_config)
    >>> service = Neo4jMem0SchemaManagementService(
    ...     schema_memory=schema_memory,
    ...     llm_service=llm_service
    ... )
"""

from .neo4j_mem0 import Neo4jMem0SchemaManagementService

__all__ = [
    "Neo4jMem0SchemaManagementService",
]
