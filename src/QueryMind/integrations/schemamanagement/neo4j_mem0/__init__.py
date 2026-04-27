"""
Neo4j Mem0 Schema Management implementation.

This module provides the concrete implementation of SchemaManagementService
using Neo4jMem0SchemaMemory as the storage backend.
"""

from .neo4j_mem0_schema_management import Neo4jMem0SchemaManagementService

__all__ = [
    "Neo4jMem0SchemaManagementService",
]
