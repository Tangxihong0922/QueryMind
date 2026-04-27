"""
Mem0 integration for QueryMind AgentMemory.

This package provides Mem0-based AgentMemory implementations.

Example:
    >>> from QueryMind.integrations.agentmemory.mem0 import Mem0AgentMemory
    >>> from QueryMind.integrations.agentmemory.mem0.config import Mem0OSSConfig
    >>>
    >>> config = Mem0OSSConfig(
    ...     embedder={"provider": "openai", "model": "text-embedding-3-small"},
    ...     llm={"provider": "openai", "model": "gpt-4o-mini"},
    ...     vector_store={"provider": "pgvector", "host": "localhost", "port": 5432}
    ... )
    >>> memory = Mem0AgentMemory(config=config)
"""

from .agent_memory import Mem0AgentMemory, MemoryType
from .config import (
    Mem0OSSConfig,
    EmbedderConfig,
    LLMConfig,
    VectorStoreConfig,
    RerankerConfig,
    GraphStoreConfig,
    create_config_from_env,
)

__all__ = [
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
