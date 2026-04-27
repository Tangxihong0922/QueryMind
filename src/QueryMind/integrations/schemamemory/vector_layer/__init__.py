"""
Vector Layer - Mem0-based vector store for schema semantic search.

This layer handles:
- Vector embedding storage (using Mem0 OSS)
- Semantic search by natural language queries
- Metadata filtering (domain, table_name, etc.)

Configuration:
    - mem0_config: Config classes for Mem0 connections
"""

from .mem0_config import (
    Mem0VectorConfig,
    EmbedderConfig,
    VectorStoreConfig,
)
from .vector_store import Mem0VectorStore, VectorSearchResult

__all__ = [
    # Config
    "Mem0VectorConfig",
    "EmbedderConfig",
    "VectorStoreConfig",
    # Store
    "Mem0VectorStore",
    "VectorSearchResult",
]
