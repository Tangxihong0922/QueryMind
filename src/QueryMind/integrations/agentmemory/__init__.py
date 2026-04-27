"""
AgentMemory integrations for QueryMind.

This package provides various AgentMemory implementations for different backends.

Available implementations:
    - mem0.oss: Mem0 OSS self-hosted deployment (LLM, Embedder, Vector DB, Reranker configurable)

Example:
    >>> from QueryMind.integrations.agentmemory import Mem0AgentMemory
    >>> from QueryMind.integrations.agentmemory.config import Mem0OSSConfig
    >>>
    >>> # Using Mem0 OSS with PostgreSQL/pgvector
    >>> config = Mem0OSSConfig(
    ...     embedder={"provider": "openai", "model": "text-embedding-3-small"},
    ...     llm={"provider": "openai", "model": "gpt-4o-mini"},
    ...     vector_store={"provider": "pgvector", "host": "localhost", "port": 5432}
    ... )
    >>> memory = Mem0AgentMemory(config=config)
"""

from .mem0 import (
    Mem0AgentMemory,
    MemoryType,
    Mem0OSSConfig,
    EmbedderConfig,
    LLMConfig,
    VectorStoreConfig,
    RerankerConfig,
    GraphStoreConfig,
    create_config_from_env,
)

__all__ = [
    # Mem0 OSS
    "Mem0AgentMemory",
    "MemoryType",
    "Mem0OSSConfig",
    "EmbedderConfig",
    "LLMConfig",
    "VectorStoreConfig",
    "RerankerConfig",
    "GraphStoreConfig",
    "create_config_from_env",
]
