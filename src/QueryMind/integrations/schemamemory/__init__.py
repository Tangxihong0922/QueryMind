"""
Schema Memory integrations for QueryMind.

This package provides SchemaMemory implementations using Mem0 + Neo4j.

Architecture:
    graph_layer/    - Neo4j graph storage (Table, Field, BusinessDomain nodes)
    vector_layer/   - Mem0 vector store (semantic search)
    schema_search.py - RRF fusion for combined retrieval
    memory.py       - Main SchemaMemory implementation

Graph Schema (Neo4j):
    Nodes:
        - (:Table {table_name, schema_name, database_name, domain, description})
        - (:Field {field_name, data_type, business_meaning})
        - (:BusinessDomain {domain})
    
    Relationships:
        - (:Table)-[:HAS_FIELD]->(:Field)
        - (:Table)-[:BELONGS_TO_DOMAIN]->(:BusinessDomain)
        - (:Table)-[:FK_TO {relationship_type}]->(:Table)
        - (:Field)-[:REFERENCES]->(:Field)

Search Modes:
    - vector: Semantic search by vector similarity (Mem0)
    - graph: Graph traversal by FK relationships (Neo4j)
    - hybrid: RRF fusion of vector + graph (default)
    - expand: Seed-based graph expansion

Example:
    >>> from QueryMind.integrations.schemamemory import Neo4jMem0SchemaMemory
    >>> from QueryMind.integrations.schemamemory.graph_layer import Neo4jConfig
    >>>
    >>> # Basic usage
    >>> config = Neo4jConfig(uri="bolt://localhost:7687", username="neo4j", password="secret")
    >>> memory = Neo4jMem0SchemaMemory(config=config)
    >>> await memory.initialize()
    >>>
    >>> # Save schema
    >>> schema = TableSchema(...)
    >>> await memory.save_table_schema(schema, context)
    >>>
    >>> # Search with different modes
    >>> results = await memory.hybrid_search("order analytics", context, search_mode="hybrid", limit=10)
"""

from .memory import Neo4jMem0SchemaMemory
from .schema_search import SchemaSearch, HybridSearchConfig, FusionResult

# Re-export for convenience
from .graph_layer import Neo4jGraphStore, Neo4jConfig, Neo4jConfigFactory
from .vector_layer import Mem0VectorStore, VectorSearchResult, Mem0VectorConfig

__all__ = [
    # Main implementation
    "Neo4jMem0SchemaMemory",
    # Schema search engine
    "SchemaSearch",
    "HybridSearchConfig",
    "FusionResult",
    # Graph layer
    "Neo4jGraphStore",
    "Neo4jConfig",
    "Neo4jConfigFactory",
    # Vector layer
    "Mem0VectorStore",
    "Mem0VectorConfig",
    "VectorSearchResult",
]
