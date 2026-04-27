"""
Mem0 OSS AgentMemory implementation.

This module provides the Mem0AgentMemory class that implements the AgentMemory
interface using Mem0's self-hosted deployment with support for custom LLM,
Embedder, and Reranker services.
"""

from __future__ import annotations

import logging
import json
import asyncio
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from typing import Any, Dict, List, Optional, TYPE_CHECKING
from enum import Enum

try:
    from mem0 import Memory
    
    MEM0_AVAILABLE = True
except ImportError:
    MEM0_AVAILABLE = False

from QueryMind.capabilities.agent_memory import (
    AgentMemory,
    TextMemory,
    TextMemorySearchResult,
    ToolMemory,
    ToolMemorySearchResult,
)
from QueryMind.core.tool import ToolContext

from .config import (
    Mem0OSSConfig,
    EmbedderConfig,
    LLMConfig,
    VectorStoreConfig,
    RerankerConfig,
    GraphStoreConfig,
    create_config_from_env,
)

logger = logging.getLogger(__name__)


class MemoryType(Enum):
    """Memory type indicators for Mem0 metadata."""

    TOOL_USAGE = "tool_usage"
    TEXT_MEMORY = "text_memory"


class Mem0AgentMemory(AgentMemory):
    """
    Mem0 OSS-based implementation of AgentMemory.
    
    This implementation uses Mem0's self-hosted Memory class with support for
    custom LLM, Embedder, and Reranker services. It provides:
    
    - LLM-driven memory deduplication and automatic updates
    - User/Agent level memory isolation
    - Advanced semantic search (rerank, threshold, filters)
    - Knowledge graph support (optional)
    - Full async support
    
    Args:
        config: Mem0OSSConfig instance with all service configurations.
                If None, reads from environment variables.
        default_user_id: Default user ID for memories.
        default_agent_id: Default agent ID for memories.
        enable_reranker: Enable reranker for enhanced search results.
        default_similarity_threshold: Default minimum similarity score (0.0-1.0).
        default_limit: Default number of results to return.
    
    Example:
        >>> from QueryMind.integrations.agentmemory.mem0 import Mem0AgentMemory
        >>> from QueryMind.integrations.agentmemory.mem0.config import Mem0OSSConfig, EmbedderConfig, LLMConfig, VectorStoreConfig
        >>>
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
        >>> memory = Mem0AgentMemory(config=config)
        >>>
        >>> # Or use environment variables:
        >>> # memory = Mem0AgentMemory()  # Reads from env
        
        >>> # Save tool usage
        >>> context = ToolContext(user_id="user1", agent_id="agent1", session_id="session1")
        >>> await memory.save_tool_usage(
        ...     question="Show me all orders from last month",
        ...     tool_name="sql_query",
        ...     args={"sql": "SELECT * FROM orders WHERE ..."},
        ...     context=context
        ... )
        >>>
        >>> # Search similar usage
        >>> results = await memory.search_similar_usage(
        ...     question="order statistics",
        ...     context=context,
        ...     limit=5
        ... )
    """
    
    def __init__(
        self,
        config: Optional[Mem0OSSConfig] = None,
        default_user_id: str = "default_user",
        default_agent_id: str = "default_agent",
        enable_reranker: bool = False,
        default_similarity_threshold: float = 0.7,
        default_limit: int = 10,
    ):
        if not MEM0_AVAILABLE:
            raise ImportError(
                "Mem0 is required for Mem0AgentMemory. Install with: pip install mem0ai"
            )
        
        # Use provided config or create from environment
        self._config = config or create_config_from_env()
        self._memory = None
        self._memory_unavailable = False
        self._memory_unavailable_reason: Optional[str] = None
        self._executor = ThreadPoolExecutor(max_workers=4)
        
        # Default entity IDs
        self._default_user_id = default_user_id
        self._default_agent_id = default_agent_id
        
        # Search settings
        self._enable_reranker = enable_reranker or (self._config.reranker is not None)
        self._default_similarity_threshold = default_similarity_threshold
        self._default_limit = default_limit
    
    @property
    def is_degraded(self) -> bool:
        """Whether the backend has fallen back to no-op mode."""
        return self._memory_unavailable

    @property
    def unavailable_reason(self) -> Optional[str]:
        """Reason why the backend was degraded, if known."""
        return self._memory_unavailable_reason

    def _disable_memory(self, exc: Exception) -> None:
        """Mark the backend as unavailable and switch to no-op mode."""
        self._memory_unavailable = True
        self._memory_unavailable_reason = str(exc)
        self._memory = None
        logger.warning(
            "Mem0 agent memory unavailable; switching to no-op mode: %s",
            exc,
            exc_info=True,
        )

    def _get_memory(self) -> Optional[Memory]:
        """Get or initialize the Mem0 Memory instance."""
        if self._memory_unavailable:
            return None
        if self._memory is None:
            try:
                config_dict = self._config.to_mem0_dict()
                self._memory = Memory.from_config(config_dict)
            except Exception as exc:
                self._disable_memory(exc)
                return None
        return self._memory
    
    def _get_entity_ids(self, context: ToolContext) -> Dict[str, Optional[str]]:
        """
        Extract entity IDs from QueryMind ToolContext.
        
        QueryMind ToolContext structure:
        - context.user: User object with id, username, email, metadata, etc.
        - context.conversation_id: Session/conversation identifier
        - context.metadata: Dict containing optional agent_id and other metadata
        
        Args:
            context: QueryMind ToolContext instance
            
        Returns:
            Dict with user_id and agent_id
        """
        # Extract user_id from User object
        user_id = None
        if context.user is not None:
            user_id = context.user.id if hasattr(context.user, 'id') else str(context.user)
        
        # Extract agent_id from metadata if available
        agent_id = context.metadata.get("agent_id") if context.metadata else None
        
        return {
            "user_id": user_id or self._default_user_id,
            "agent_id": agent_id or self._default_agent_id,
        }

    def _is_tool_memory_session_isolated(self, context: ToolContext) -> bool:
        """Whether tool memories should be scoped to the current conversation."""
        return bool(context.metadata.get("tool_memory_session_isolated", False))
    
    def _build_metadata(
        self,
        memory_type: MemoryType,
        tool_name: Optional[str] = None,
        args: Optional[Dict[str, Any]] = None,
        success: bool = True,
        additional_metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Build metadata dict for Mem0.
        
        Args:
            memory_type: Type of memory (tool_usage or text_memory)
            tool_name: Name of the tool (for tool_usage)
            args: Tool arguments (for tool_usage)
            success: Whether the operation was successful
            additional_metadata: Additional metadata to include
            
        Returns:
            Metadata dict for Mem0
        """
        metadata = {
            "memory_type": memory_type.value,
            "success": success,
        }
        
        if tool_name:
            metadata["tool_name"] = tool_name
            
        if args:
            # Serialize complex objects to JSON
            metadata["args_json"] = json.dumps(args)
            
        if additional_metadata:
            metadata.update(additional_metadata)
            
        return metadata
    
    def _parse_metadata(self, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """
        Parse metadata from Mem0 results.
        
        Args:
            metadata: Raw metadata from Mem0
            
        Returns:
            Parsed metadata with deserialized JSON fields
        """
        if not metadata:
            return {}
            
        parsed = dict(metadata)
        
        # Deserialize JSON fields
        if "args_json" in parsed:
            try:
                parsed["args"] = json.loads(parsed.pop("args_json"))
            except (json.JSONDecodeError, TypeError):
                parsed["args"] = {}
                parsed.pop("args_json", None)
        else:
            parsed["args"] = {}
            
        return parsed
    
    def _convert_to_tool_memory(self, mem0_result: Dict[str, Any]) -> ToolMemory:
        """
        Convert Mem0 result to ToolMemory.
        
        Args:
            mem0_result: Raw result from Mem0 search/get
            
        Returns:
            ToolMemory instance
        """
        metadata = self._parse_metadata(mem0_result.get("metadata", {}))
        
        return ToolMemory(
            memory_id=mem0_result.get("id", ""),
            question=mem0_result.get("memory", ""),
            tool_name=metadata.get("tool_name", ""),
            args=metadata.get("args", {}),
            timestamp=mem0_result.get("created_at"),
            success=metadata.get("success", True),
            metadata=metadata,
        )
    
    def _convert_to_text_memory(self, mem0_result: Dict[str, Any]) -> TextMemory:
        """
        Convert Mem0 result to TextMemory.
        
        Args:
            mem0_result: Raw result from Mem0 search/get
            
        Returns:
            TextMemory instance
        """
        return TextMemory(
            memory_id=mem0_result.get("id", ""),
            content=mem0_result.get("memory", ""),
            timestamp=mem0_result.get("created_at"),
        )

    def _apply_tool_memory_scope(
        self,
        params: Dict[str, Any],
        context: ToolContext,
    ) -> Dict[str, Any]:
        """Apply conversation scope only when tool memory isolation is enabled."""
        scoped_params = dict(params)
        if self._is_tool_memory_session_isolated(context) and context.conversation_id:
            scoped_params["run_id"] = context.conversation_id
        return scoped_params

    def _build_memory_filters(
        self,
        memory_type: MemoryType,
        tool_name_filter: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Build pgvector-compatible flat metadata filters."""
        filters: Dict[str, Any] = {"memory_type": memory_type.value}
        if tool_name_filter:
            filters["tool_name"] = tool_name_filter
        return filters

    def _score_to_similarity(self, score: Optional[float]) -> float:
        """Normalize a backend score to cosine similarity."""
        if score is None:
            return 0.0

        value = float(score)
        if self._config.vector_store.provider == "pgvector":
            value = 1.0 - value

        return max(0.0, min(1.0, value))
    
    async def save_tool_usage(
        self,
        question: str,
        tool_name: str,
        args: Dict[str, Any],
        context: ToolContext,
        success: bool = True,
        memory_metadata: Optional[Dict[str, Any]] = None,
    ) -> None:
        """
        Save a tool usage pattern.
        
        The question is stored as a memory in Mem0 with tool metadata.
        Mem0 will automatically deduplicate and update similar memories.
        
        Note on metadata:
            - ToolContext.metadata: Contains context info injected by ToolContextEnricher
              (e.g., timezone, preferences, agent_id). Used for isolation via _get_entity_ids().
            - memory_metadata: Custom fields to store WITH the memory in Mem0 for retrieval.
              (e.g., database_name, query_category, tags)
        
        Args:
            question: The user's question that triggered this tool usage
            tool_name: Name of the tool that was used
            args: Arguments passed to the tool
            context: ToolContext with user/agent/session info
            success: Whether the tool execution was successful
            memory_metadata: Additional metadata fields to store with the memory record
        """
        entities = self._get_entity_ids(context)
        tool_memory_session_isolated = self._is_tool_memory_session_isolated(context)
        
        def _save():
            memory = self._get_memory()
            if memory is None:
                return

            try:
                # Build messages in Mem0 format
                messages = [{"role": "user", "content": question}]

                # Build metadata for Mem0 (distinct from ToolContext.metadata)
                meta = self._build_metadata(
                    memory_type=MemoryType.TOOL_USAGE,
                    tool_name=tool_name,
                    args=args,
                    success=success,
                    additional_metadata=memory_metadata,
                )

                # Add timestamp
                meta["timestamp"] = datetime.now().isoformat()

                # Add to Mem0
                memory.add(
                    messages,
                    user_id=entities["user_id"],
                    agent_id=entities["agent_id"],
                    run_id=context.conversation_id if tool_memory_session_isolated else None,
                    metadata=meta,
                    infer=False,  # Disable inference for tool usage patterns to preserve original question
                )
            except Exception as exc:
                self._disable_memory(exc)
        
        await asyncio.get_event_loop().run_in_executor(self._executor, _save)
    
    async def save_text_memory(
        self, content: str, context: ToolContext
    ) -> TextMemory:
        """
        Save a free-form text memory.
        
        Args:
            content: Text content to remember
            context: ToolContext with user/agent/session info
            
        Returns:
            The created TextMemory instance
        """
        entities = self._get_entity_ids(context)
        memory_id: Optional[str] = None
        
        def _save():
            nonlocal memory_id
            memory = self._get_memory()
            if memory is None:
                return memory_id

            try:
                # Build metadata
                meta = self._build_metadata(
                    memory_type=MemoryType.TEXT_MEMORY,
                )
                meta["timestamp"] = datetime.now().isoformat()

                # Add to Mem0
                result = memory.add(
                    content,
                    user_id=entities["user_id"],
                    agent_id=entities["agent_id"],
                    run_id=None,
                    metadata=meta,
                    infer=False,  # No need for inference on free-form text memories
                )

                # Extract memory ID from result
                if result and "results" in result and len(result["results"]) > 0:
                    memory_id = result["results"][0].get("id") or None
            except Exception as exc:
                self._disable_memory(exc)

            return memory_id
        
        await asyncio.get_event_loop().run_in_executor(self._executor, _save)
        
        return TextMemory(
            memory_id=memory_id,
            content=content,
            timestamp=datetime.now().isoformat(),
        )
    
    async def search_similar_usage(
        self,
        question: str,
        context: ToolContext,
        *,
        limit: int = 10,
        similarity_threshold: float = 0.7,
        tool_name_filter: Optional[str] = None,
    ) -> List[ToolMemorySearchResult]:
        """
        Search for similar tool usage patterns.
        
        Args:
            question: Query to search for
            context: ToolContext with user/agent/session info
            limit: Maximum number of results
            similarity_threshold: Minimum similarity score (0.0-1.0)
            tool_name_filter: Optional tool name to filter results
            
        Returns:
            List of ToolMemorySearchResult sorted by relevance
        """
        entities = self._get_entity_ids(context)
        search_results: List[ToolMemorySearchResult] = []
        rank = 1
        scoped_run_id = context.conversation_id if self._is_tool_memory_session_isolated(context) else None
        
        def _search():
            nonlocal search_results, rank
            memory = self._get_memory()
            if memory is None:
                search_results = []
                return search_results
            
            try:
                # Build Mem0 search params
                search_params = {
                    "query": question,
                    "user_id": entities["user_id"],
                    "agent_id": entities["agent_id"],
                    "limit": limit * 2,  # Get more to filter
                    # Let the backend return candidates; apply similarity filtering locally.
                    "threshold": 0.0,
                }

                if scoped_run_id:
                    search_params["run_id"] = scoped_run_id

                # Enable reranker if configured
                if self._enable_reranker:
                    search_params["rerank"] = True

                search_params["filters"] = self._build_memory_filters(
                    MemoryType.TOOL_USAGE,
                    tool_name_filter=tool_name_filter,
                )

                # Search in Mem0
                results = memory.search(**search_params)

                # Convert to ToolMemorySearchResult
                search_results = []
                rank = 1

                if results and "results" in results:
                    for mem0_result in results["results"]:
                        metadata = self._parse_metadata(mem0_result.get("metadata", {}))

                        # Skip text memories
                        if metadata.get("memory_type") != MemoryType.TOOL_USAGE.value:
                            continue

                        similarity_score = self._score_to_similarity(
                            mem0_result.get("score", 0.0)
                        )
                        if similarity_score < similarity_threshold:
                            continue

                        tool_memory = self._convert_to_tool_memory(mem0_result)

                        search_results.append(
                            ToolMemorySearchResult(
                                memory=tool_memory,
                                similarity_score=similarity_score,
                                rank=rank,
                            )
                        )
                        rank += 1

                        if len(search_results) >= limit:
                            break

                logger.debug(
                    "Agent memory search returned %d raw result(s), %d after similarity filtering",
                    len(results.get("results", [])) if results else 0,
                    len(search_results),
                )
            except Exception as exc:
                self._disable_memory(exc)
                search_results = []

            return search_results
        
        await asyncio.get_event_loop().run_in_executor(self._executor, _search)
        
        return search_results
    
    async def search_text_memories(
        self,
        query: str,
        context: ToolContext,
        *,
        limit: int = 10,
        similarity_threshold: float = 0.7,
    ) -> List[TextMemorySearchResult]:
        """
        Search for similar text memories.
        
        Args:
            query: Query to search for
            context: ToolContext with user/agent/session info
            limit: Maximum number of results
            similarity_threshold: Minimum similarity score (0.0-1.0)
            
        Returns:
            List of TextMemorySearchResult sorted by relevance
        """
        entities = self._get_entity_ids(context)
        search_results: List[TextMemorySearchResult] = []
        rank = 1
        
        def _search():
            nonlocal search_results, rank
            memory = self._get_memory()
            if memory is None:
                search_results = []
                return search_results
            
            try:
                # Build Mem0 search params
                search_params = {
                    "query": query,
                    "user_id": entities["user_id"],
                    "agent_id": entities["agent_id"],
                    "limit": limit * 2,
                    # Let the backend return candidates; apply similarity filtering locally.
                    "threshold": 0.0,
                }

                if self._enable_reranker:
                    search_params["rerank"] = True

                search_params["filters"] = self._build_memory_filters(
                    MemoryType.TEXT_MEMORY,
                )

                # Search in Mem0
                results = memory.search(**search_params)

                # Convert to TextMemorySearchResult
                search_results = []
                rank = 1

                if results and "results" in results:
                    for mem0_result in results["results"]:
                        metadata = self._parse_metadata(mem0_result.get("metadata", {}))

                        # Skip tool memories
                        if metadata.get("memory_type") != MemoryType.TEXT_MEMORY.value:
                            continue

                        similarity_score = self._score_to_similarity(
                            mem0_result.get("score", 0.0)
                        )
                        if similarity_score < similarity_threshold:
                            continue

                        text_memory = self._convert_to_text_memory(mem0_result)

                        search_results.append(
                            TextMemorySearchResult(
                                memory=text_memory,
                                similarity_score=similarity_score,
                                rank=rank,
                            )
                        )
                        rank += 1

                        if len(search_results) >= limit:
                            break

                logger.debug(
                    "Text memory search returned %d raw result(s), %d after similarity filtering",
                    len(results.get("results", [])) if results else 0,
                    len(search_results),
                )
            except Exception as exc:
                self._disable_memory(exc)
                search_results = []

            return search_results
        
        await asyncio.get_event_loop().run_in_executor(self._executor, _search)
        
        return search_results
    
    async def get_recent_memories(
        self, context: ToolContext, limit: int = 10
    ) -> List[ToolMemory]:
        """
        Get recently added tool memories.
        
        Args:
            context: ToolContext with user/agent/session info
            limit: Maximum number of results
            
        Returns:
            List of ToolMemory sorted by timestamp (most recent first)
        """
        entities = self._get_entity_ids(context)
        memories: List[ToolMemory] = []
        scoped_run_id = context.conversation_id if self._is_tool_memory_session_isolated(context) else None
        
        def _get_recent():
            nonlocal memories
            memory = self._get_memory()
            if memory is None:
                memories = []
                return memories
            
            try:
                # Get all memories for user/agent
                params = {
                    "user_id": entities["user_id"],
                    "agent_id": entities["agent_id"],
                    "limit": 100,  # Get more to sort
                }

                if scoped_run_id:
                    params["run_id"] = scoped_run_id

                # Filter for tool memories
                filters = {
                    "AND": [
                        {"memory_type": {"eq": MemoryType.TOOL_USAGE.value}},
                    ]
                }
                params["filters"] = filters

                results = memory.get_all(**params)

                # Convert and sort by timestamp
                memories = []
                if results and "results" in results:
                    tool_memories = []
                    for mem0_result in results["results"]:
                        metadata = self._parse_metadata(mem0_result.get("metadata", {}))
                        if metadata.get("memory_type") == MemoryType.TOOL_USAGE.value:
                            tool_memories.append(mem0_result)

                    # Sort by timestamp descending
                    tool_memories.sort(
                        key=lambda x: x.get("created_at", ""),
                        reverse=True
                    )

                    # Take top N
                    for mem0_result in tool_memories[:limit]:
                        memories.append(self._convert_to_tool_memory(mem0_result))
            except Exception as exc:
                self._disable_memory(exc)
                memories = []

            return memories
        
        await asyncio.get_event_loop().run_in_executor(self._executor, _get_recent)
        
        return memories
    
    async def get_recent_text_memories(
        self, context: ToolContext, limit: int = 10
    ) -> List[TextMemory]:
        """
        Get recently added text memories.
        
        Args:
            context: ToolContext with user/agent/session info
            limit: Maximum number of results
            
        Returns:
            List of TextMemory sorted by timestamp (most recent first)
        """
        entities = self._get_entity_ids(context)
        memories: List[TextMemory] = []
        
        def _get_recent():
            nonlocal memories
            memory = self._get_memory()
            if memory is None:
                memories = []
                return memories
            
            try:
                # Get all memories for user/agent
                params = {
                    "user_id": entities["user_id"],
                    "agent_id": entities["agent_id"],
                    "limit": 100,
                }

                # Filter for text memories
                filters = {
                    "AND": [
                        {"memory_type": {"eq": MemoryType.TEXT_MEMORY.value}},
                    ]
                }
                params["filters"] = filters

                results = memory.get_all(**params)

                # Convert and sort by timestamp
                memories = []
                if results and "results" in results:
                    text_memories = []
                    for mem0_result in results["results"]:
                        metadata = self._parse_metadata(mem0_result.get("metadata", {}))
                        if metadata.get("memory_type") == MemoryType.TEXT_MEMORY.value:
                            text_memories.append(mem0_result)

                    # Sort by timestamp descending
                    text_memories.sort(
                        key=lambda x: x.get("created_at", ""),
                        reverse=True
                    )

                    # Take top N
                    for mem0_result in text_memories[:limit]:
                        memories.append(self._convert_to_text_memory(mem0_result))
            except Exception as exc:
                self._disable_memory(exc)
                memories = []

            return memories
        
        await asyncio.get_event_loop().run_in_executor(self._executor, _get_recent)
        
        return memories
    
    async def delete_by_id(self, context: ToolContext, memory_id: str) -> bool:
        """
        Delete a tool memory by ID.
        
        Args:
            context: ToolContext with user/agent/session info
            memory_id: ID of the memory to delete
            
        Returns:
            True if deleted, False if not found
        """
        def _delete():
            memory = self._get_memory()
            if memory is None:
                return False

            try:
                memory.delete(memory_id)
                return True
            except Exception as exc:
                self._disable_memory(exc)
                return False
        
        return await asyncio.get_event_loop().run_in_executor(self._executor, _delete)
    
    async def delete_text_memory(self, context: ToolContext, memory_id: str) -> bool:
        """
        Delete a text memory by ID.
        
        Args:
            context: ToolContext with user/agent/session info
            memory_id: ID of the memory to delete
            
        Returns:
            True if deleted, False if not found
        """
        # Same implementation as delete_by_id
        return await self.delete_by_id(context, memory_id)
    
    async def clear_memories(
        self,
        context: ToolContext,
        tool_name: Optional[str] = None,
        before_date: Optional[str] = None,
    ) -> int:
        """
        Clear memories based on filters.
        
        Note: Mem0's delete_all doesn't support date-based filtering.
        If before_date is specified, we delete all and return 0.
        
        Args:
            context: ToolContext with user/agent/session info
            tool_name: Optional tool name filter
            before_date: Optional date filter (YYYY-MM-DD or ISO format)
            
        Returns:
            Number of memories deleted (approximate, Mem0 may not return count)
        """
        entities = self._get_entity_ids(context)
        deleted_count = 0
        scoped_run_id = context.conversation_id if self._is_tool_memory_session_isolated(context) else None
        
        def _clear():
            nonlocal deleted_count
            memory = self._get_memory()
            if memory is None:
                deleted_count = 0
                return deleted_count
            
            try:
                # Build delete params
                params = {
                    "user_id": entities["user_id"],
                    "agent_id": entities["agent_id"],
                }

                if scoped_run_id:
                    params["run_id"] = scoped_run_id

                # If tool_name filter, we need to get all and filter manually
                # Mem0 doesn't support arbitrary metadata filters in delete_all
                if tool_name or before_date:
                    # Get all memories and filter
                    all_params = dict(params)
                    all_params["limit"] = 1000

                    results = memory.get_all(**all_params)

                    if results and "results" in results:
                        to_delete = []
                        for mem0_result in results["results"]:
                            metadata = self._parse_metadata(
                                mem0_result.get("metadata", {})
                            )

                            # Apply filters
                            if tool_name and metadata.get("tool_name") != tool_name:
                                continue

                            if before_date:
                                timestamp = metadata.get("timestamp", "")
                                if timestamp and timestamp >= before_date:
                                    continue

                            to_delete.append({"memory_id": mem0_result.get("id")})

                        # Delete individually (Mem0 supports batch delete)
                        if to_delete:
                            for chunk in _chunk_list(to_delete, 100):
                                try:
                                    memory.delete_all(**{**params, "filters": {"memory_id": {"in": [t["memory_id"] for t in chunk]}}})
                                except Exception:
                                    # Fallback to individual deletion
                                    for t in chunk:
                                        try:
                                            memory.delete(t["memory_id"])
                                        except Exception:
                                            pass

                        deleted_count = len(to_delete)
                else:
                    # Clear all for user/agent
                    try:
                        memory.delete_all(**params)
                    except Exception:
                        pass
            except Exception as exc:
                self._disable_memory(exc)
                deleted_count = 0
            
            return deleted_count
        
        await asyncio.get_event_loop().run_in_executor(self._executor, _clear)
        
        return deleted_count
    
    def close(self):
        """Close the Memory instance and release resources."""
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


def _chunk_list(lst: List[Any], chunk_size: int) -> List[List[Any]]:
    """Split a list into chunks."""
    return [lst[i:i + chunk_size] for i in range(0, len(lst), chunk_size)]
