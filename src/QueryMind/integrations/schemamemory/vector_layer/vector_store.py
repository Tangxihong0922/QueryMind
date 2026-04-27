"""
Mem0 Vector Store - Semantic search for table schemas.

This module provides vector-based semantic search for table schemas
using Mem0 OSS's Memory class. The vector text is generated from
TableSchema.to_vector_text() method.

Usage:
    - Store table schemas as vector embeddings
    - Search by natural language business queries
    - Filter by domain, table name, or metadata
"""

from __future__ import annotations

import asyncio
import logging
from concurrent.futures import ThreadPoolExecutor
from typing import List, Optional, Dict, Any, TYPE_CHECKING
from dataclasses import dataclass

try:
    from mem0 import Memory
    MEM0_AVAILABLE = True
except ImportError:
    MEM0_AVAILABLE = False

from QueryMind.capabilities.schema_memory.models import (
    TableSchema,
    SchemaSearchResult,
)

from .mem0_config import Mem0VectorConfig


logger = logging.getLogger(__name__)


@dataclass
class VectorSearchResult:
    """Result from vector search with metadata."""
    table_name: str
    schema_name: str
    memory_id: str
    score: float
    metadata: Dict[str, Any]


class Mem0VectorStore:
    """
    Mem0-based vector store for table schema semantic search.
    
    This store uses Mem0 OSS Memory to:
    - Store table schema embeddings
    - Search by natural language queries
    - Filter by metadata (domain, table_name, etc.)
    
    Attributes:
        config: Mem0OSSConfig for connection settings
        memory: Mem0 Memory instance (lazy initialized)
        collection_name: Name of the vector collection
        
    Example:
        >>> from QueryMind.integrations.schemamemory.vector_layer import Mem0VectorConfig
        >>> config = Mem0VectorConfig.simple_openai(api_key="sk-...")
        >>> store = Mem0VectorStore(config=config)
        >>> await store.save_table_schema(schema)
        >>> results = await store.search_by_query("order analytics")
    """
    
    # Memory category for schema memories
    MEMORY_CATEGORY = "table_schema"
    
    def __init__(
        self,
        config: Optional[Mem0VectorConfig] = None,
        collection_name: str = "schema_memories",
        default_user_id: str = "system",
        default_agent_id: str = "schema_agent",
    ):
        if not MEM0_AVAILABLE:
            raise ImportError(
                "Mem0 is required for Mem0VectorStore. Install with: pip install mem0ai"
            )
        
        self._config = config
        self._memory = None
        self._executor = ThreadPoolExecutor(max_workers=4)
        
        self._collection_name = collection_name
        if self._config is not None:
            self._default_user_id = self._config.default_user_id
            self._default_agent_id = self._config.default_agent_id
        else:
            self._default_user_id = default_user_id
            self._default_agent_id = default_agent_id
    
    def _get_memory(self) -> Memory:
        """Get or initialize the Mem0 Memory instance."""
        if self._memory is None:
            if self._config is None:
                # Use default in-memory config
                self._memory = Memory()
            else:
                config_dict = self._config.to_mem0_config()
                if config_dict:
                    self._memory = Memory.from_config(config_dict)
                else:
                    self._memory = Memory()
        return self._memory
    
    def _build_vector_text(self, schema: TableSchema) -> str:
        """
        Build vector search text from TableSchema.
        
        This combines all searchable fields into a single text
        that will be embedded for vector search.
        """
        return schema.to_vector_text()

    def _build_simple_filters(
        self,
        *,
        domain_filter: Optional[str] = None,
        table_name_filter: Optional[str] = None,
        schema_name_filter: Optional[str] = None,
        database_name_filter: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Build pgvector-compatible flat metadata filters."""
        filters: Dict[str, Any] = {"category": self.MEMORY_CATEGORY}
        if domain_filter:
            filters["domain"] = domain_filter
        if table_name_filter:
            filters["table_name"] = table_name_filter
        if schema_name_filter:
            filters["schema_name"] = schema_name_filter
        if database_name_filter:
            filters["database_name"] = database_name_filter
        return filters
    
    def _build_metadata(self, schema: TableSchema) -> Dict[str, Any]:
        """Build metadata for Mem0 storage."""
        return {
            "category": self.MEMORY_CATEGORY,
            "table_name": schema.table_name,
            "schema_name": schema.schema_name,
            "database_name": schema.database_name,
            "domain": schema.business_context.domain,
            "keywords": schema.business_context.keywords or [],
            "full_name": schema.full_name,
            "primary_keys": schema.primary_key_fields,
            "field_count": len(schema.field_definitions),
            "relationship_count": len(schema.relationships),
        }
    
    # ==================== CRUD Operations ====================
    
    async def save_table_schema(
        self,
        schema: TableSchema,
        user_id: Optional[str] = None,
        agent_id: Optional[str] = None,
        infer: bool = False,  # Don't use LLM inference for structured data
    ) -> str:
        """
        Save a table schema as a vector embedding.
        
        Args:
            schema: TableSchema to save
            user_id: Optional user ID (defaults to system)
            agent_id: Optional agent ID
            infer: Whether to use LLM inference (False for structured data)
            
        Returns:
            Mem0 memory ID
        """
        vector_text = self._build_vector_text(schema)
        metadata = self._build_metadata(schema)
        
        def _save() -> str:
            try:
                memory = self._get_memory()

                result = memory.add(
                    messages=[{"role": "user", "content": vector_text}],
                    user_id=user_id or self._default_user_id,
                    agent_id=agent_id or self._default_agent_id,
                    metadata=metadata,
                    infer=infer,
                )

                if result and "results" in result and len(result["results"]) > 0:
                    return result["results"][0].get("id", "")
                return ""
            except Exception as exc:
                logger.warning(
                    "Schema vector save skipped for %s: %s",
                    schema.full_name,
                    exc,
                )
                return ""
        
        return await asyncio.get_event_loop().run_in_executor(self._executor, _save)
    
    async def update_table_schema(
        self,
        schema: TableSchema,
        memory_id: str,
        user_id: Optional[str] = None,
    ) -> bool:
        """
        Update a table schema vector.
        
        Args:
            schema: Updated TableSchema
            memory_id: Mem0 memory ID to update
            user_id: User ID for authentication
            
        Returns:
            True if updated successfully
        """
        vector_text = self._build_vector_text(schema)
        metadata = self._build_metadata(schema)
        
        def _update() -> bool:
            memory = self._get_memory()
            try:
                memory.update(
                    memory_id=memory_id,
                    text=vector_text,
                    metadata=metadata,
                )
                return True
            except Exception:
                return False
        
        return await asyncio.get_event_loop().run_in_executor(self._executor, _update)
    
    async def delete_table_schema(
        self,
        memory_id: str,
        user_id: Optional[str] = None,
    ) -> bool:
        """
        Delete a table schema vector.
        
        Args:
            memory_id: Mem0 memory ID to delete
            user_id: User ID for authentication
            
        Returns:
            True if deleted successfully
        """
        def _delete() -> bool:
            memory = self._get_memory()
            try:
                memory.delete(memory_id)
                return True
            except Exception:
                return False
        
        return await asyncio.get_event_loop().run_in_executor(self._executor, _delete)

    async def clear_all(self) -> None:
        """
        Clear all stored schema vectors by resetting the underlying Mem0 collection.

        For pgvector-backed stores, this drops and recreates the collection table so the
        next insert uses the current embedding dimension.
        """
        def _clear() -> None:
            memory = self._get_memory()
            vector_store = getattr(memory, "vector_store", None)

            if vector_store is None:
                return

            if hasattr(vector_store, "reset"):
                vector_store.reset()
                return

            if hasattr(vector_store, "delete_col") and hasattr(vector_store, "create_col"):
                vector_store.delete_col()
                vector_store.create_col()
                return

            raise AttributeError("Mem0 vector store does not support collection reset")

        loop = asyncio.get_running_loop()
        await loop.run_in_executor(self._executor, _clear)
    
    async def get_memory_id(
        self,
        table_name: str,
        schema_name: str = "public",
        database_name: Optional[str] = None,
        user_id: Optional[str] = None,
    ) -> Optional[str]:
        """
        Get the Mem0 memory ID for a table.
        
        Args:
            table_name: Table name
            schema_name: Schema name
            database_name: Optional database name
            user_id: User ID for filtering
            
        Returns:
            Memory ID or None if not found
        """
        full_name = ".".join(filter(None, [database_name, schema_name, table_name]))
        
        def _get() -> Optional[str]:
            memory = self._get_memory()
            filters = self._build_simple_filters(
                table_name_filter=table_name,
                schema_name_filter=schema_name,
                database_name_filter=database_name,
            )
            
            results = memory.get_all(
                user_id=user_id or self._default_user_id,
                filters=filters,
                limit=1,
            )
            
            if results and "results" in results and len(results["results"]) > 0:
                return results["results"][0].get("id")
            return None
        
        return await asyncio.get_event_loop().run_in_executor(self._executor, _get)
    
    # ==================== Search Operations ====================
    
    async def search_by_query(
        self,
        query: str,
        *,
        user_id: Optional[str] = None,
        agent_id: Optional[str] = None,
        limit: int = 10,
        threshold: float = 0.3,
        domain_filter: Optional[str] = None,
        table_name_filter: Optional[str] = None,
        rerank: bool = False,
    ) -> List[VectorSearchResult]:
        """
        Search for tables by natural language query.
        
        Args:
            query: Natural language search query
            user_id: Optional user ID for filtering
            agent_id: Optional agent ID for filtering
            limit: Maximum number of results
            threshold: Minimum similarity score (0-1)
            domain_filter: Optional domain to filter by
            table_name_filter: Optional table name to filter by
            rerank: Whether to use reranking
            
        Returns:
            List of VectorSearchResult sorted by similarity
        """
        def _search() -> List[VectorSearchResult]:
            try:
                memory = self._get_memory()

                filters = self._build_simple_filters(
                    domain_filter=domain_filter,
                    table_name_filter=table_name_filter,
                )

                search_params = {
                    "query": query,
                    "user_id": user_id or self._default_user_id,
                    "limit": limit,
                    "threshold": threshold,
                    "filters": filters,
                }

                if agent_id:
                    search_params["agent_id"] = agent_id

                if rerank:
                    search_params["rerank"] = True

                results = memory.search(**search_params)

                vector_results = []
                if results and "results" in results:
                    for rank, item in enumerate(results["results"]):
                        metadata = item.get("metadata", {})
                        vector_results.append(VectorSearchResult(
                            table_name=metadata.get("table_name", ""),
                            schema_name=metadata.get("schema_name", "public"),
                            memory_id=item.get("id", ""),
                            score=item.get("score", 0.0),
                            metadata=metadata,
                        ))

                if vector_results:
                    top_scores = [round(result.score, 4) for result in vector_results[:5]]
                else:
                    top_scores = []
                logger.info(
                    "Schema vector search query=%r user_id=%s agent_id=%s threshold=%.3f "
                    "domain_filter=%s table_name_filter=%s hits=%d top_scores=%s",
                    query,
                    search_params["user_id"],
                    search_params.get("agent_id"),
                    threshold,
                    domain_filter,
                    table_name_filter,
                    len(vector_results),
                    top_scores,
                )

                return vector_results
            except Exception as exc:
                logger.warning(
                    "Schema vector search skipped for query=%r: %s",
                    query,
                    exc,
                )
                return []
        
        return await asyncio.get_event_loop().run_in_executor(self._executor, _search)
    
    async def search_by_field_names(
        self,
        field_names: List[str],
        *,
        user_id: Optional[str] = None,
        limit: int = 10,
        exact_match: bool = False,
    ) -> List[VectorSearchResult]:
        """
        Search for tables by field/column names.
        
        Args:
            field_names: List of field names to search for
            user_id: Optional user ID
            limit: Maximum results
            exact_match: Whether to require exact field name match
            
        Returns:
            List of tables containing the specified fields
        """
        # Build search query from field names
        if exact_match:
            query = " ".join([f"`{fn}`" for fn in field_names])
        else:
            query = " ".join(field_names)
        
        return await self.search_by_query(
            query=query,
            user_id=user_id,
            limit=limit,
        )
    
    async def get_all_schemas(
        self,
        *,
        user_id: Optional[str] = None,
        limit: int = 100,
        offset: int = 0,
        domain_filter: Optional[str] = None,
    ) -> List[VectorSearchResult]:
        """
        Get all stored table schemas.
        
        Args:
            user_id: Optional user ID
            limit: Maximum results
            offset: Pagination offset
            domain_filter: Optional domain filter
            
        Returns:
            List of all stored schemas
        """
        def _get_all() -> List[VectorSearchResult]:
            memory = self._get_memory()
            filters = self._build_simple_filters(domain_filter=domain_filter)
            
            results = memory.get_all(
                user_id=user_id or self._default_user_id,
                filters=filters,
                limit=limit,
            )
            
            schemas = []
            if results and "results" in results:
                for item in results["results"]:
                    metadata = item.get("metadata", {})
                    schemas.append(VectorSearchResult(
                        table_name=metadata.get("table_name", ""),
                        schema_name=metadata.get("schema_name", "public"),
                        memory_id=item.get("id", ""),
                        score=1.0,  # No score for get_all
                        metadata=metadata,
                    ))
            
            return schemas[offset:offset + limit]
        
        return await asyncio.get_event_loop().run_in_executor(self._executor, _get_all)
    
    # ==================== Utility Methods ====================
    
    async def get_statistics(self) -> Dict[str, int]:
        """Get statistics about stored vector embeddings."""
        def _stats() -> Dict[str, int]:
            memory = self._get_memory()
            filters = self._build_simple_filters()
            
            results = memory.get_all(
                user_id=self._default_user_id,
                filters=filters,
                limit=10000,
            )
            
            count = 0
            domains = set()
            if results and "results" in results:
                count = len(results["results"])
                for item in results["results"]:
                    domain = item.get("metadata", {}).get("domain")
                    if domain:
                        domains.add(domain)
            
            return {
                "total_schemas": count,
                "unique_domains": len(domains),
            }
        
        return await asyncio.get_event_loop().run_in_executor(self._executor, _stats)
    
    def close(self) -> None:
        """Close the Memory instance."""
        if self._memory is not None:
            try:
                self._memory.close()
            except Exception:
                pass
            self._memory = None
    
    def __enter__(self):
        """Context manager entry."""
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.close()
        return False
