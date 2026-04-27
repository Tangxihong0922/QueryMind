"""
Mem0 OSS Configuration for AgentMemory.

This module provides configuration management for Mem0 self-hosted deployments
with support for custom LLM, Embedder, and Reranker services.
"""

from __future__ import annotations
from typing import Any, Dict, Optional
from dataclasses import dataclass, field


@dataclass
class EmbedderConfig:
    """Configuration for embedding service."""
    
    provider: str = "openai"  # openai, ollama, azure, lmstudio, google, huggingface
    model: str = "text-embedding-3-small"
    api_key: Optional[str] = None
    base_url: Optional[str] = None  # For custom endpoints (Ollama, etc.)
    embedding_dims: int = 1536  # Renamed to match Mem0's BaseEmbedderConfig
    additional_config: Dict[str, Any] = field(default_factory=dict)
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "EmbedderConfig":
        """Create config from dictionary."""
        if isinstance(data, cls):
            return data
        return cls(
            provider=data.get("provider", "openai"),
            model=data.get("model", "text-embedding-3-small"),
            api_key=data.get("api_key"),
            base_url=data.get("base_url"),
            embedding_dims=data.get("embedding_dims", data.get("embedding_dim", 1536)),
            additional_config=data.get("additional_config", {}),
        )
    
    def to_mem0_config(self) -> Dict[str, Any]:
        """Convert to Mem0 embedder config format."""
        config = {
            "model": self.model,
        }
        if self.api_key:
            config["api_key"] = self.api_key
        if self.base_url:
            # Use openai_base_url for OpenAI-compatible APIs (ModelScope, Ollama, etc.)
            config["openai_base_url"] = self.base_url
        if self.embedding_dims:
            config["embedding_dims"] = self.embedding_dims
        config.update(self.additional_config)
        
        return {
            "provider": self.provider,
            "config": config
        }


@dataclass
class LLMConfig:
    """Configuration for LLM service (used for memory inference/deduplication)."""
    
    provider: str = "openai"  # openai, groq, azure, ollama, lmstudio, google, anthropic, mistral, minimax, vllm
    model: str = "gpt-4o-mini"
    api_key: Optional[str] = None
    base_url: Optional[str] = None  # For custom endpoints (Ollama, etc.)
    additional_config: Dict[str, Any] = field(default_factory=dict)
    
    def to_mem0_config(self) -> Dict[str, Any]:
        """
        Convert to Mem0 LLM config format.
        
        For minimax and vllm providers, the base_url is mapped to the provider-specific
        field name (minimax_base_url / vllm_base_url) as expected by Mem0's LLM classes.
        """
        config = {
            "model": self.model,
        }
        if self.api_key:
            config["api_key"] = self.api_key
        if self.base_url:
            # Map base_url to provider-specific field name for minimax/vllm
            if self.provider == "minimax":
                config["minimax_base_url"] = self.base_url
            elif self.provider == "vllm":
                config["vllm_base_url"] = self.base_url
            else:
                config["base_url"] = self.base_url
        config.update(self.additional_config)
        
        return {
            "provider": self.provider,
            "config": config
        }


@dataclass
class RerankerConfig:
    """Configuration for Reranker service (optional, for enhanced search)."""
    
    provider: str = "cohere"  # cohere, openai, etc.
    model: str = "rerank-english-v2.0"
    api_key: Optional[str] = None
    base_url: Optional[str] = None
    additional_config: Dict[str, Any] = field(default_factory=dict)
    
    def to_mem0_config(self) -> Dict[str, Any] | None:
        """Convert to Mem0 reranker config format if configured."""
        if not self.api_key and not self.base_url:
            return None
            
        config = {
            "model": self.model,
        }
        if self.api_key:
            config["api_key"] = self.api_key
        if self.base_url:
            config["base_url"] = self.base_url
        config.update(self.additional_config)
        
        return {
            "provider": self.provider,
            "config": config
        }


@dataclass
class VectorStoreConfig:
    """Configuration for vector store backend."""
    
    provider: str = "pgvector"  # faiss, qdrant, pgvector, redis, supabase, azure_ai_search
    collection_name: str = "agent_memories"
    
    # PostgreSQL/pgvector specific
    host: str = "localhost"
    port: int = 5432
    database: str = "mem0"
    username: str = "postgres"
    password: Optional[str] = None
    
    # Alternative: Qdrant
    qdrant_url: Optional[str] = None
    qdrant_api_key: Optional[str] = None
    
    # Alternative: ChromaDB local
    persist_directory: Optional[str] = None

    # Embedding dimensions for pgvector/similar stores
    embedding_model_dims: Optional[int] = None
    
    additional_config: Dict[str, Any] = field(default_factory=dict)
    
    def to_mem0_config(self) -> Dict[str, Any]:
        """Convert to Mem0 vector_store config format."""
        if self.provider == "pgvector":
            config = {
                "collection_name": self.collection_name,
                "host": self.host,
                "port": self.port,
                "dbname": self.database,  # Mem0 expects dbname, not database
                "user": self.username,  # Mem0 expects user, not username
            }
            if self.password:
                config["password"] = self.password
            if self.embedding_model_dims is not None:
                config["embedding_model_dims"] = self.embedding_model_dims
            config.update(self.additional_config)
            
        elif self.provider == "qdrant":
            config = {
                "collection_name": self.collection_name,
            }
            if self.qdrant_url:
                config["url"] = self.qdrant_url
            if self.qdrant_api_key:
                config["api_key"] = self.qdrant_api_key
            config.update(self.additional_config)
            
        elif self.provider == "chroma":
            config = {
                "collection_name": self.collection_name,
            }
            if self.persist_directory:
                config["persist_directory"] = self.persist_directory
            config.update(self.additional_config)
            
        else:
            config = self.additional_config
            
        return {
            "provider": self.provider,
            "config": config
        }


@dataclass
class GraphStoreConfig:
    """Configuration for graph store (optional, for knowledge graph features)."""
    
    provider: str = "neo4j"  # neo4j
    url: str = "neo4j://localhost:7687"
    username: str = "neo4j"
    password: str = "password"
    database: str = "neo4j"
    
    def to_mem0_config(self) -> Dict[str, Any] | None:
        """Convert to Mem0 graph_store config format."""
        if not self.password or self.password == "password":
            return None  # Skip if not properly configured
            
        return {
            "provider": self.provider,
            "config": {
                "url": self.url,
                "username": self.username,
                "password": self.password,
                "database": self.database,
            }
        }


@dataclass
class Mem0OSSConfig:
    """
    Complete configuration for Mem0 OSS deployment.
    
    Example:
        >>> config = Mem0OSSConfig(
        ...     embedder=EmbedderConfig(
        ...         provider="openai",
        ...         model="text-embedding-3-small",
        ...         api_key="sk-xxx"
        ...     ),
        ...     llm=LLMConfig(
        ...         provider="openai",
        ...         model="gpt-4o-mini",
        ...         api_key="sk-xxx"
        ...     ),
        ...     vector_store=VectorStoreConfig(
        ...         provider="pgvector",
        ...         host="localhost",
        ...         port=5432,
        ...         database="mem0",
        ...         password="secret"
        ...     )
        ... )
        >>> config_dict = config.to_mem0_dict()
    """
    
    embedder: EmbedderConfig = field(default_factory=lambda: EmbedderConfig())
    llm: LLMConfig = field(default_factory=lambda: LLMConfig())
    vector_store: VectorStoreConfig = field(default_factory=lambda: VectorStoreConfig())
    reranker: Optional[RerankerConfig] = None
    graph_store: Optional[GraphStoreConfig] = None
    
    # History database path for SQLite (stores change history)
    history_db_path: str = "mem0_history.db"
    
    # Memory inference settings
    enable_graph: bool = False  # Enable knowledge graph extraction
    custom_fact_extraction_prompt: Optional[str] = None
    custom_update_memory_prompt: Optional[str] = None
    
    # Default entity IDs
    default_user_id: str = "default_user"
    default_agent_id: str = "default_agent"
    
    def to_mem0_dict(self) -> Dict[str, Any]:
        """
        Convert to Mem0-compatible configuration dictionary.
        
        Returns:
            Dict compatible with Memory.from_config()
        """
        vector_store = self.vector_store.to_mem0_config()
        if self.vector_store.provider == "pgvector":
            vector_store["config"]["embedding_model_dims"] = (
                self.vector_store.embedding_model_dims
                if self.vector_store.embedding_model_dims is not None
                else self.embedder.embedding_dims
            )

        config = {
            "llm": self.llm.to_mem0_config(),
            "embedder": self.embedder.to_mem0_config(),
            "vector_store": vector_store,
            "history_db_path": self.history_db_path,
            "enable_graph": self.enable_graph,
        }
        
        if self.reranker:
            reranker_config = self.reranker.to_mem0_config()
            if reranker_config:
                config["reranker"] = reranker_config
                
        if self.graph_store:
            graph_config = self.graph_store.to_mem0_config()
            if graph_config:
                config["graph_store"] = graph_config
                
        if self.custom_fact_extraction_prompt:
            config["custom_fact_extraction_prompt"] = self.custom_fact_extraction_prompt
            
        if self.custom_update_memory_prompt:
            config["custom_update_memory_prompt"] = self.custom_update_memory_prompt
            
        return config


def create_config_from_env() -> Mem0OSSConfig:
    """
    Create Mem0OSSConfig from environment variables.
    
    Environment variables:
        - OPENAI_API_KEY: OpenAI API key (for both LLM and embedder)
        - MEM0_LLM_PROVIDER: LLM provider (default: openai)
        - MEM0_LLM_MODEL: LLM model (default: gpt-4o-mini)
        - MEM0_LLM_BASE_URL: LLM base URL (for minimax/vllm/ollama etc.)
        - MEM0_EMBEDDER_PROVIDER: Embedder provider (default: openai)
        - MEM0_EMBEDDER_MODEL: Embedder model (default: text-embedding-3-small)
        - MEM0_VECTOR_STORE_PROVIDER: Vector store provider (default: pgvector)
        - MEM0_PGVECTOR_HOST / PGVECTOR_HOST: pgvector host (default: localhost)
        - MEM0_PGVECTOR_PORT / PGVECTOR_PORT: pgvector port (default: 5432)
        - MEM0_PGVECTOR_DATABASE / PGVECTOR_DATABASE: pgvector database (default: mem0)
        - MEM0_PGVECTOR_USERNAME / PGVECTOR_USERNAME: pgvector username (default: postgres)
        - MEM0_PGVECTOR_PASSWORD / PGVECTOR_PASSWORD: pgvector password
    """
    import os

    def _first_env(*names: str, default: str) -> str:
        for name in names:
            value = os.getenv(name)
            if value not in (None, ""):
                return value
        return default
    
    embedder = EmbedderConfig(
        provider=_first_env("MEM0_EMBEDDER_PROVIDER", "EMBEDDING_PROVIDER", default="openai"),
        model=_first_env("MEM0_EMBEDDER_MODEL", "EMBEDDING_MODEL", default="text-embedding-3-small"),
        api_key=os.getenv("OPENAI_API_KEY"),
        base_url=_first_env("MEM0_EMBEDDER_BASE_URL", "EMBEDDING_BASE_URL", default=""),
        embedding_dims=int(_first_env("MEM0_EMBEDDING_DIM", "EMBEDDING_DIM", default="1536")),
    )
    
    # Determine API key based on provider
    llm_provider = _first_env("MEM0_LLM_PROVIDER", "LLM_PROVIDER", default="openai")
    if llm_provider == "minimax":
        llm_api_key = os.getenv("MINIMAX_API_KEY") or os.getenv("OPENAI_API_KEY")
    elif llm_provider == "vllm":
        llm_api_key = os.getenv("VLLM_API_KEY") or os.getenv("OPENAI_API_KEY") or "vllm-api-key"
    else:
        llm_api_key = os.getenv("OPENAI_API_KEY")
    
    llm = LLMConfig(
        provider=llm_provider,
        model=_first_env("MEM0_LLM_MODEL", "LLM_MODEL", default="gpt-4o-mini"),
        api_key=llm_api_key,
        base_url=_first_env("MEM0_LLM_BASE_URL", "LLM_BASE_URL", default=""),  # Supports minimax, vllm, etc.
    )
    
    vector_store = VectorStoreConfig(
        provider=_first_env("MEM0_VECTOR_STORE_PROVIDER", "VECTOR_STORE_PROVIDER", default="pgvector"),
        host=_first_env("MEM0_PGVECTOR_HOST", "PGVECTOR_HOST", default="localhost"),
        port=int(_first_env("MEM0_PGVECTOR_PORT", "PGVECTOR_PORT", default="5432")),
        database=_first_env("MEM0_PGVECTOR_DATABASE", "PGVECTOR_DATABASE", default="mem0"),
        username=_first_env("MEM0_PGVECTOR_USERNAME", "PGVECTOR_USERNAME", default="postgres"),
        password=_first_env("MEM0_PGVECTOR_PASSWORD", "PGVECTOR_PASSWORD", default=""),
        embedding_model_dims=int(_first_env("MEM0_EMBEDDING_DIM", "EMBEDDING_DIM", default="1536")),
    )
    
    return Mem0OSSConfig(
        embedder=embedder,
        llm=llm,
        vector_store=vector_store,
    )
