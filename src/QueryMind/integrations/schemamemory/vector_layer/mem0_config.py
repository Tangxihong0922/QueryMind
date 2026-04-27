"""
Mem0 configuration for Schema Memory Vector Store.

Simplified configuration for Mem0 connections used in Schema Memory.
Unified with agentmemory/mem0/config.py for consistent API.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from typing import Optional, Dict, Any


@dataclass
class EmbedderConfig:
    """Configuration for embedding service (unified with agentmemory)."""
    
    provider: str = "openai"
    model: str = "text-embedding-3-small"
    api_key: Optional[str] = None
    base_url: Optional[str] = None
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
        """Convert to Mem0 embedder config format (unified method name)."""
        config = {"model": self.model}
        if self.api_key:
            config["api_key"] = self.api_key
        if self.base_url:
            # Use openai_base_url for OpenAI-compatible APIs (ModelScope, Ollama, etc.)
            config["openai_base_url"] = self.base_url
        if self.embedding_dims:
            config["embedding_dims"] = self.embedding_dims
        config.update(self.additional_config)
        return {"provider": self.provider, "config": config}


@dataclass
class LLMConfig:
    """
    Configuration for LLM service (unified with agentmemory).
    
    Used for memory inference/deduplication when infer=True.
    """
    
    provider: str = "openai"
    model: str = "gpt-4o-mini"
    api_key: Optional[str] = None
    base_url: Optional[str] = None
    additional_config: Dict[str, Any] = field(default_factory=dict)
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "LLMConfig":
        """Create config from dictionary."""
        if isinstance(data, cls):
            return data
        return cls(
            provider=data.get("provider", "openai"),
            model=data.get("model", "gpt-4o-mini"),
            api_key=data.get("api_key"),
            base_url=data.get("base_url"),
            additional_config=data.get("additional_config", {}),
        )
    
    def to_mem0_config(self) -> Dict[str, Any]:
        """
        Convert to Mem0 LLM config format.
        
        For minimax and vllm providers, the base_url is mapped to the provider-specific
        field name (minimax_base_url / vllm_base_url) as expected by Mem0's LLM classes.
        """
        config = {"model": self.model}
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
        return {"provider": self.provider, "config": config}


@dataclass
class VectorStoreConfig:
    """
    Configuration for vector store backend (unified with agentmemory).
    
    Supports pgvector (PostgreSQL), chroma, and qdrant.
    Default is pgvector, consistent with Agent Memory.
    """
    
    provider: str = "pgvector"
    collection_name: str = "schema_memories"
    
    # PostgreSQL/pgvector
    host: str = "localhost"
    port: int = 5432
    database: str = "mem0"
    username: str = "postgres"
    password: Optional[str] = None
    
    # Chroma specific
    persist_directory: Optional[str] = None
    
    # Qdrant specific
    qdrant_url: Optional[str] = None
    qdrant_api_key: Optional[str] = None

    # Embedding dimensions for pgvector/similar stores
    embedding_model_dims: Optional[int] = None
    
    additional_config: Dict[str, Any] = field(default_factory=dict)
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "VectorStoreConfig":
        """Create config from dictionary."""
        if isinstance(data, cls):
            return data
        return cls(
            provider=data.get("provider", "pgvector"),
            collection_name=data.get("collection_name", "schema_memories"),
            host=data.get("host", "localhost"),
            port=data.get("port", 5432),
            database=data.get("database", "mem0"),
            username=data.get("username", "postgres"),
            password=data.get("password"),
            qdrant_url=data.get("qdrant_url"),
            qdrant_api_key=data.get("qdrant_api_key"),
            embedding_model_dims=data.get("embedding_model_dims", data.get("embedding_dim")),
            additional_config=data.get("additional_config", {}),
        )
    
    def to_mem0_config(self) -> Dict[str, Any]:
        """Convert to Mem0 vector_store config format (unified method name)."""
        if self.provider == "pgvector":
            config = {
                "collection_name": self.collection_name,
                "host": self.host,
                "port": self.port,
                "dbname": self.database,
                "user": self.username,
            }
            if self.password:
                config["password"] = self.password
        elif self.provider == "qdrant":
            config = {"collection_name": self.collection_name}
            if self.qdrant_url:
                config["url"] = self.qdrant_url
            if self.qdrant_api_key:
                config["api_key"] = self.qdrant_api_key
        elif self.provider == "chroma":
            config = {"collection_name": self.collection_name}
            if self.persist_directory:
                config["persist_directory"] = self.persist_directory
        else:
            config = {}

        if self.provider == "pgvector" and self.embedding_model_dims is not None:
            config["embedding_model_dims"] = self.embedding_model_dims
        
        config.update(self.additional_config)
        return {"provider": self.provider, "config": config}


@dataclass
class Mem0VectorConfig:
    """
    Simplified Mem0 configuration for Schema Memory.
    
    Unified with agentmemory/mem0/config.py for consistent API.
    
    Example:
        >>> # Using Ollama (local) embedder + LLM with pgvector
        >>> config = Mem0VectorConfig.pgvector(
        ...     embedder_base_url="http://localhost:11434",
        ...     embedder_model="mxbai-embed-large",
        ...     llm_base_url="http://localhost:11434",
        ... )
        >>> 
        >>> # From environment variables
        >>> config = Mem0VectorConfig.from_env()
    """
    
    embedder: EmbedderConfig = field(default_factory=lambda: EmbedderConfig())
    llm: Optional[LLMConfig] = None  # For intelligent deduplication
    vector_store: VectorStoreConfig = field(default_factory=lambda: VectorStoreConfig())
    
    # Default entity IDs for Schema Memory
    default_user_id: str = "system"
    default_agent_id: str = "schema_agent"
    
    def to_mem0_config(self) -> Dict[str, Any]:
        """Convert to Mem0 Memory.from_config() dictionary (unified method name)."""
        vector_store = self.vector_store.to_mem0_config()
        if self.vector_store.provider == "pgvector":
            vector_store["config"]["embedding_model_dims"] = (
                self.vector_store.embedding_model_dims
                if self.vector_store.embedding_model_dims is not None
                else self.embedder.embedding_dims
            )

        config = {
            "embedder": self.embedder.to_mem0_config(),
            "vector_store": vector_store,
        }
        
        if self.llm:
            config["llm"] = self.llm.to_mem0_config()
        
        return config
    
    @classmethod
    def from_env(cls) -> "Mem0VectorConfig":
        """Create config from environment variables.
        
        Environment variables:
            # Embedder (LLM)
            - OPENAI_API_KEY: API key (optional)
            - EMBEDDING_PROVIDER: Embedder provider (default: openai)
            - EMBEDDING_MODEL: Embedder model (default: text-embedding-3-small)
            - EMBEDDING_BASE_URL: Custom embedder base URL (for Ollama, etc.)
            
            # LLM (for intelligent deduplication)
            - LLM_PROVIDER: LLM provider (default: openai)
            - LLM_MODEL: LLM model (default: gpt-4o-mini)
            - LLM_BASE_URL: Custom LLM base URL
            
            # Vector store
            - VECTOR_STORE_PROVIDER: Vector store provider (default: pgvector)
            - PGVECTOR_HOST/PGVECTOR_PORT/PGVECTOR_DATABASE/PGVECTOR_USERNAME/PGVECTOR_PASSWORD
        """
        return cls(
            embedder=EmbedderConfig(
                provider=os.getenv("EMBEDDING_PROVIDER", "openai"),
                model=os.getenv("EMBEDDING_MODEL", "text-embedding-3-small"),
                api_key=os.getenv("OPENAI_API_KEY"),
                base_url=os.getenv("EMBEDDING_BASE_URL"),
                embedding_dims=int(os.getenv("EMBEDDING_DIM", "1536")),
            ),
            llm=LLMConfig(
                provider=os.getenv("LLM_PROVIDER", "openai"),
                model=os.getenv("LLM_MODEL", "gpt-4o-mini"),
                api_key=os.getenv("OPENAI_API_KEY"),
                base_url=os.getenv("LLM_BASE_URL"),
            ) if os.getenv("LLM_PROVIDER") or os.getenv("LLM_BASE_URL") or os.getenv("LLM_MODEL") else None,
            vector_store=VectorStoreConfig(
                provider=os.getenv("VECTOR_STORE_PROVIDER", "pgvector"),
                host=os.getenv("PGVECTOR_HOST", "localhost"),
                port=int(os.getenv("PGVECTOR_PORT", "5432")),
                database=os.getenv("PGVECTOR_DATABASE", "mem0"),
                username=os.getenv("PGVECTOR_USERNAME", "postgres"),
                password=os.getenv("PGVECTOR_PASSWORD"),
                embedding_model_dims=int(os.getenv("EMBEDDING_DIM", "1536")),
            ),
        )
    
    @classmethod
    def pgvector(
        cls,
        *,
        host: str = "localhost",
        port: int = 5432,
        database: str = "mem0",
        username: str = "postgres",
        password: Optional[str] = None,
        collection_name: str = "schema_memories",
        # Embedder config
        embedder_provider: str = "openai",
        embedder_model: str = "text-embedding-3-small",
        embedder_api_key: Optional[str] = None,
        embedder_base_url: Optional[str] = None,
        # LLM config (for intelligent deduplication)
        llm_provider: Optional[str] = None,
        llm_model: Optional[str] = None,
        llm_api_key: Optional[str] = None,
        llm_base_url: Optional[str] = None,
    ) -> "Mem0VectorConfig":
        """
        Create pgvector config with flexible embedder and LLM settings.
        
        Args:
            host: PostgreSQL host
            port: PostgreSQL port
            database: Database name
            username: Username
            password: Password
            collection_name: Collection name
            
            # Embedder config
            embedder_provider: Embedder provider (default: openai)
            embedder_model: Embedder model (default: text-embedding-3-small)
            embedder_api_key: API key (optional)
            embedder_base_url: Custom base URL (e.g., http://localhost:11434)
            
            # LLM config (for intelligent deduplication)
            llm_provider: LLM provider
            llm_model: LLM model
            llm_api_key: LLM API key
            llm_base_url: LLM base URL
        """
        return cls(
            embedder=EmbedderConfig(
                provider=embedder_provider,
                model=embedder_model,
                api_key=embedder_api_key,
                base_url=embedder_base_url,
            ),
            llm=LLMConfig(
                provider=llm_provider,
                model=llm_model,
                api_key=llm_api_key,
                base_url=llm_base_url,
            ) if any([llm_provider, llm_model, llm_api_key, llm_base_url]) else None,
            vector_store=VectorStoreConfig(
                host=host, port=port, database=database,
                username=username, password=password,
                collection_name=collection_name,
            ),
        )
    
    @classmethod
    def chroma(
        cls,
        *,
        host: str = "localhost",
        port: int = 8000,
        persist_directory: Optional[str] = None,
        collection_name: str = "schema_memories",
        # Embedder config
        embedder_provider: str = "openai",
        embedder_model: str = "text-embedding-3-small",
        embedder_api_key: Optional[str] = None,
        embedder_base_url: Optional[str] = None,
        # LLM config
        llm_provider: Optional[str] = None,
        llm_model: Optional[str] = None,
        llm_api_key: Optional[str] = None,
        llm_base_url: Optional[str] = None,
    ) -> "Mem0VectorConfig":
        """Create Chroma config with flexible embedder and LLM settings."""
        return cls(
            embedder=EmbedderConfig(
                provider=embedder_provider,
                model=embedder_model,
                api_key=embedder_api_key,
                base_url=embedder_base_url,
            ),
            llm=LLMConfig(
                provider=llm_provider,
                model=llm_model,
                api_key=llm_api_key,
                base_url=llm_base_url,
            ) if any([llm_provider, llm_model, llm_api_key, llm_base_url]) else None,
            vector_store=VectorStoreConfig(
                provider="chroma",
                host=host, port=port,
                persist_directory=persist_directory,
                collection_name=collection_name,
            ),
        )
    
    @classmethod
    def qdrant(
        cls,
        *,
        host: str = "localhost",
        port: int = 6333,
        collection_name: str = "schema_memories",
        api_key: Optional[str] = None,
        # Embedder config
        embedder_provider: str = "openai",
        embedder_model: str = "text-embedding-3-small",
        embedder_api_key: Optional[str] = None,
        embedder_base_url: Optional[str] = None,
        # LLM config
        llm_provider: Optional[str] = None,
        llm_model: Optional[str] = None,
        llm_api_key: Optional[str] = None,
        llm_base_url: Optional[str] = None,
    ) -> "Mem0VectorConfig":
        """Create Qdrant config with flexible embedder and LLM settings."""
        return cls(
            embedder=EmbedderConfig(
                provider=embedder_provider,
                model=embedder_model,
                api_key=embedder_api_key,
                base_url=embedder_base_url,
            ),
            llm=LLMConfig(
                provider=llm_provider,
                model=llm_model,
                api_key=llm_api_key,
                base_url=llm_base_url,
            ) if any([llm_provider, llm_model, llm_api_key, llm_base_url]) else None,
            vector_store=VectorStoreConfig(
                provider="qdrant",
                host=host, port=port,
                qdrant_url=f"http://{host}:{port}" if host != "localhost" else None,
                qdrant_api_key=api_key,
                collection_name=collection_name,
            ),
        )
    
    @classmethod
    def in_memory(cls) -> "Mem0VectorConfig":
        """Create an in-memory config for testing."""
        return cls()
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Mem0VectorConfig":
        """Create config from dictionary."""
        embedder_data = data.get("embedder", {})
        llm_data = data.get("llm")
        vector_store_data = data.get("vector_store", {})
        
        return cls(
            embedder=EmbedderConfig.from_dict(embedder_data),
            llm=LLMConfig.from_dict(llm_data) if llm_data else None,
            vector_store=VectorStoreConfig.from_dict(vector_store_data),
            default_user_id=data.get("default_user_id", "system"),
            default_agent_id=data.get("default_agent_id", "schema_agent"),
        )


# Unified factory function (matching agentmemory's create_config_from_env)
def create_config_from_env() -> Mem0VectorConfig:
    """Create Mem0VectorConfig from environment variables."""
    return Mem0VectorConfig.from_env()
