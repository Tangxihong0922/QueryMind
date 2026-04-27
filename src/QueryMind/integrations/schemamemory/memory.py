"""
Neo4j-based Schema Memory implementation.

This module provides the main SchemaMemory implementation that combines
Neo4j graph storage and Mem0 vector search with hybrid retrieval.

Architecture:
    Neo4j层：图结构存储（表、字段、关系）
    Mem0层：向量语义检索
    Hybrid层：RRF融合排序

Usage:
    >>> from QueryMind.integrations.schemamemory import Neo4jMem0SchemaMemory, Neo4jConfig
    >>> config = Neo4jConfig(uri="bolt://localhost:7687", username="neo4j", password="secret")
    >>> memory = Neo4jMem0SchemaMemory(config=config)
    >>> 
    >>> # Save a table schema
    >>> schema = TableSchema(...)
    >>> await memory.save_table_schema(schema, context)
    >>> 
    >>> # Schema search (supports: vector, graph, hybrid, expand modes)
    >>> results = await memory.search_schema("order analytics", context, search_mode="hybrid", limit=10)
"""

from __future__ import annotations

import asyncio
from typing import List, Optional, Dict, Any, TYPE_CHECKING

from QueryMind.capabilities.schema_memory.base import SchemaMemory

from .graph_layer import Neo4jConfig, Neo4jGraphStore
from .vector_layer import Mem0VectorStore, Mem0VectorConfig
from .schema_search import SchemaSearch, HybridSearchConfig, FusionResult

if TYPE_CHECKING:
    from QueryMind.capabilities.schema_memory.models import (
        TableSchema,
        SchemaSearchResult,
    )
    from QueryMind.core.tool import ToolContext


class Neo4jMem0SchemaMemory(SchemaMemory):
    """
    Neo4j + Mem0 based SchemaMemory implementation.
    
    This class implements the SchemaMemory interface using:
    - Neo4j for graph-structured storage (Table, Field, BusinessDomain nodes)
    - Mem0 for vector semantic search
    - Hybrid retrieval with RRF fusion
    
    Attributes:
        neo4j_config: Neo4j connection configuration
        mem0_config: Optional Mem0 OSS configuration
        vector_weight: Weight for vector search in hybrid scoring (default: 0.6)
        graph_weight: Weight for graph search in hybrid scoring (default: 0.4)
        
    Example:
        >>> config = Neo4jConfig(uri="bolt://localhost:7687")
        >>> memory = Neo4jMem0SchemaMemory(config=config)
        >>> await memory.initialize()
        >>> 
        >>> # Search (supports: vector, graph, hybrid, expand modes)
        >>> results = await memory.search_schema("customer orders", context, search_mode="hybrid")
    """
    
    def __init__(
        self,
        neo4j_config: Optional[Neo4jConfig] = None,
        mem0_config: Optional[Mem0VectorConfig] = None,
        vector_weight: float = 0.6,
        graph_weight: float = 0.4,
        default_limit: int = 10,
        default_threshold: float = 0.3,
    ):
        # Store configs
        self._neo4j_config = neo4j_config
        self._mem0_config = mem0_config
        
        # Search weights
        self._vector_weight = vector_weight
        self._graph_weight = graph_weight
        
        # Default search params
        self._default_limit = default_limit
        self._default_threshold = default_threshold

        # Schema memory should use a shared namespace instead of the chat user's
        # identity, so writes and reads stay aligned across schema workflows.
        if self._mem0_config:
            self._default_user_id = self._mem0_config.default_user_id
            self._default_agent_id = self._mem0_config.default_agent_id
        else:
            self._default_user_id = "system"
            self._default_agent_id = "schema_agent"
        
        # Initialize stores
        self._neo4j_store: Optional[Neo4jGraphStore] = None
        self._vector_store: Optional[Mem0VectorStore] = None
        self._hybrid_search: Optional[SchemaSearch] = None
        
        # Track vector_id -> table mapping for linking
        self._vector_id_map: Dict[str, str] = {}  # vector_id -> table_full_name
        self._table_vector_id_map: Dict[str, str] = {}  # table_full_name -> vector_id
    
    async def initialize(self) -> None:
        """
        Initialize the schema memory stores.
        
        Creates Neo4j indexes/constraints and initializes connections.
        Should be called once after construction.
        """
        # Initialize Neo4j store
        if self._neo4j_config:
            self._neo4j_store = Neo4jGraphStore(config=self._neo4j_config)
            await self._neo4j_store.initialize()
        
        # Initialize Mem0 vector store
        self._vector_store = Mem0VectorStore(config=self._mem0_config)
        
        # Initialize hybrid search
        if self._neo4j_store and self._vector_store:
            search_config = HybridSearchConfig(
                vector_weight=self._vector_weight,
                graph_weight=self._graph_weight,
            )
            self._hybrid_search = SchemaSearch(
                vector_store=self._vector_store,
                graph_store=self._neo4j_store,
                config=search_config,
            )
    
    def _get_entity_ids(self, context: "ToolContext") -> Dict[str, Optional[str]]:
        """Return the shared schema-memory namespace."""
        return {
            "user_id": self._default_user_id,
            "agent_id": self._default_agent_id,
            "run_id": context.conversation_id if context else None,
        }
    
    def _build_search_result(
        self,
        fusion_result: FusionResult,
        table_data: Optional[Dict[str, Any]] = None,
    ) -> "SchemaSearchResult":
        """Build SchemaSearchResult from FusionResult."""
        from QueryMind.capabilities.schema_memory.models import SchemaSearchResult as SSR
        
        # Build TableSchema from table_data if available
        table_schema = None
        if table_data:
            table_schema = self._neo4j_store_to_table_schema(table_data)
        
        return SSR(
            table_schema=table_schema,
            similarity_score=fusion_result.fusion_score,
            rank=fusion_result.rank,
            match_reason=f"Hybrid: vector={fusion_result.vector_score:.2f}, graph={fusion_result.graph_score:.2f}" 
                        if fusion_result.source == "both" 
                        else f"Source: {fusion_result.source}",
            graph_hops=int(1 / fusion_result.graph_score - 1) if fusion_result.graph_score else None,
        )

    @staticmethod
    def _normalize_domain_name(domain_value: Any, fallback_value: Any = None) -> str:
        """Normalize Neo4j domain payloads into a plain string."""
        for candidate in (domain_value, fallback_value):
            if isinstance(candidate, dict):
                name = candidate.get("domain")
                if name:
                    return str(name)
            elif isinstance(candidate, str):
                if candidate.strip():
                    return candidate
            elif candidate is not None:
                return str(candidate)
        return "Unknown"

    def _neo4j_store_to_table_schema(
        self,
        table_data: Dict[str, Any],
    ) -> Optional["TableSchema"]:
        """Convert Neo4j store data to TableSchema."""
        from QueryMind.capabilities.schema_memory.models import (
            TableSchema,
            FieldDefinition,
            TableRelationship,
            BusinessContext,
            ForeignKeyReference,
            RelationshipType,
        )
        
        table = table_data.get("table", {})
        fields = table_data.get("fields", [])
        domain = table_data.get("domain")
        
        if not table:
            return None
        
        # Build field definitions
        field_defs = []
        for f in fields:
            field_def = FieldDefinition(
                field_name=f.get("field_name", ""),
                data_type=f.get("data_type", "unknown"),
                is_primary_key=f.get("is_primary_key", False),
                is_foreign_key=f.get("is_foreign_key", False),
                business_meaning=f.get("business_meaning"),
                description=f.get("description"),
            )
            field_defs.append(field_def)
        
        # Build business context
        keywords = table.get("keywords")
        if isinstance(keywords, str):
            keywords = [keywords]
        elif isinstance(keywords, list):
            keywords = [str(keyword) for keyword in keywords if keyword is not None]
        else:
            keywords = []

        business_context = BusinessContext(
            domain=self._normalize_domain_name(table.get("domain"), domain),
            description=table.get("description", "") or "",
            keywords=keywords,
        )
        
        # Build TableSchema
        return TableSchema(
            table_name=table.get("table_name", ""),
            schema_name=table.get("schema_name", "public"),
            database_name=table.get("database_name"),
            ddl="",  # DDL not stored in Neo4j
            field_definitions=field_defs,
            relationships=[],  # TODO: Parse FK relations
            business_context=business_context,
        )
    
    # ==================== SchemaMemory Interface Implementation ====================
    
    async def save_table_schema(
        self,
        schema: "TableSchema",
        context: "ToolContext",
    ) -> str:
        """
        Save a table schema to both Neo4j and Mem0.
        
        Args:
            schema: TableSchema to save
            context: ToolContext with user/agent info
            
        Returns:
            Table full name as unique identifier
        """
        entities = self._get_entity_ids(context)
        
        # 1. Save to Mem0 vector store
        vector_id = await self._vector_store.save_table_schema(
            schema=schema,
            user_id=entities.get("user_id"),
            agent_id=entities.get("agent_id"),
            infer=False,  # Don't use LLM inference for structured data
        )
        
        # 2. Save to Neo4j with vector_id link
        if self._neo4j_store:
            full_name = await self._neo4j_store.save_table_schema(
                schema=schema,
                vector_id=vector_id,
            )
        else:
            full_name = schema.full_name
        
        # 3. Update mappings
        if vector_id:
            self._vector_id_map[vector_id] = full_name
            self._table_vector_id_map[full_name] = vector_id
        
        return full_name
    
    async def save_schema_batch(
        self,
        schemas: List["TableSchema"],
        context: "ToolContext",
    ) -> List[str]:
        """
        Batch save table schemas.
        
        Args:
            schemas: List of TableSchema to save
            context: ToolContext
            
        Returns:
            List of table full names
        """
        results = []
        for schema in schemas:
            full_name = await self.save_table_schema(schema, context)
            results.append(full_name)
        return results
    
    async def update_table_schema(
        self,
        schema_id: str,
        schema: "TableSchema",
        context: "ToolContext",
    ) -> bool:
        """
        Update a table schema.
        
        Args:
            schema_id: Table full name or Mem0 memory ID
            schema: Updated TableSchema
            context: ToolContext
            
        Returns:
            True if updated successfully
        """
        # Check if it's a vector_id or table name
        if schema_id in self._vector_id_map:
            table_name = self._vector_id_map[schema_id]
            vector_id = schema_id
        else:
            table_name = schema_id
            vector_id = self._table_vector_id_map.get(table_name)
        
        # Update in vector store
        if vector_id:
            await self._vector_store.update_table_schema(
                schema=schema,
                memory_id=vector_id,
            )
        
        # Update in Neo4j
        if self._neo4j_store:
            await self._neo4j_store.save_table_schema(
                schema=schema,
                vector_id=vector_id,
            )
        
        return True
    
    async def search_by_business_query(
        self,
        query: str,
        context: "ToolContext",
        *,
        limit: int = 10,
        similarity_threshold: float = 0.3,
        domain_filter: Optional[str] = None,
    ) -> List["SchemaSearchResult"]:
        """
        Search tables by business query (vector search only).
        
        Args:
            query: Natural language query
            context: ToolContext
            limit: Maximum results
            similarity_threshold: Minimum similarity score
            domain_filter: Optional domain filter
            
        Returns:
            List of SchemaSearchResult
        """
        entities = self._get_entity_ids(context)
        
        vector_results = await self._vector_store.search_by_query(
            query=query,
            user_id=entities.get("user_id"),
            agent_id=entities.get("agent_id"),
            limit=limit,
            threshold=similarity_threshold,
            domain_filter=domain_filter,
        )
        
        # Convert to SchemaSearchResult
        results = []
        for rank, vr in enumerate(vector_results):
            # Get full table data from Neo4j if available
            table_data = None
            if self._neo4j_store:
                table_data = await self._neo4j_store.get_table_schema(
                    table_name=vr.table_name,
                    schema_name=vr.schema_name,
                )
            
            fusion_result = FusionResult(
                table_name=vr.table_name,
                schema_name=vr.schema_name,
                vector_score=vr.score,
                graph_score=None,
                fusion_score=vr.score,
                rank=rank + 1,
                source="vector",
            )
            
            results.append(self._build_search_result(fusion_result, table_data))
        
        return results
    
    async def search_by_field_names(
        self,
        field_names: List[str],
        context: "ToolContext",
        *,
        limit: int = 10,
        exact_match: bool = False,
    ) -> List["SchemaSearchResult"]:
        """
        Search tables by field names.
        
        Args:
            field_names: List of field names
            context: ToolContext
            limit: Maximum results
            exact_match: Whether to require exact match
            
        Returns:
            List of SchemaSearchResult
        """
        results = await self.search_by_business_query(
            query=" ".join(field_names),
            context=context,
            limit=limit,
        )
        return results
    
    async def find_related_tables(
        self,
        table_name: str,
        context: "ToolContext",
        *,
        max_hops: int = 2,
        relationship_types: Optional[List[str]] = None,
    ) -> List["SchemaSearchResult"]:
        """
        Find tables related through FK relationships.
        
        Args:
            table_name: Starting table name
            context: ToolContext
            max_hops: Maximum FK traversal depth
            relationship_types: Optional relationship type filter
            
        Returns:
            List of SchemaSearchResult
        """
        if not self._neo4j_store:
            return []
        
        graph_results = await self._neo4j_store.find_related_tables(
            table_name=table_name,
            max_hops=max_hops,
            relationship_types=relationship_types,
        )
        
        results = []
        for rank, gr in enumerate(graph_results):
            fusion_result = FusionResult(
                table_name=gr.get("table", {}).get("table_name", ""),
                schema_name=gr.get("table", {}).get("schema_name", "public"),
                vector_score=None,
                graph_score=1.0 / (gr.get("hops", 0) + 1),
                fusion_score=1.0 / (gr.get("hops", 0) + 1),
                rank=rank + 1,
                source="graph",
            )
            
            results.append(self._build_search_result(fusion_result, gr))
        
        return results
    
    async def find_tables_by_foreign_key(
        self,
        from_table: str,
        from_field: str,
        context: "ToolContext",
        *,
        direction: str = "outgoing",
    ) -> List["SchemaSearchResult"]:
        """
        Find tables connected by FK.
        
        Args:
            from_table: Source table name
            from_field: Source field name
            context: ToolContext
            direction: "outgoing", "incoming", or "both"
            
        Returns:
            List of SchemaSearchResult
        """
        # Use graph traversal to find FK-related tables
        results = await self.find_related_tables(
            table_name=from_table,
            context=context,
            max_hops=1,
        )
        return results
    
    async def search_schema(
        self,
        query: str,
        context: "ToolContext",
        *,
        search_mode: str = "hybrid",
        limit: int = 10,
        similarity_threshold: float = 0.3,
        domain_filter: Optional[str] = None,
        required_fields: Optional[List[str]] = None,
        seed_tables: Optional[List[str]] = None,
    ) -> List["SchemaSearchResult"]:
        """
        Search for relevant table schemas using various retrieval modes.
        
        Supported search modes:
            - "vector": Pure vector semantic search (Mem0)
            - "graph": Pure graph traversal (Neo4j FK traversal)
            - "hybrid": RRF fusion of vector + graph (default, balanced)
            - "expand": Seed-based graph expansion (vector seeds → graph expansion)
        
        Args:
            query: Natural language query or domain name
            context: ToolContext
            search_mode: Search mode - "vector", "graph", "hybrid", or "expand"
            limit: Maximum results to return
            similarity_threshold: Minimum vector similarity (for modes using vector)
            domain_filter: Optional domain filter for graph search
            required_fields: Optional required field names for field-based search
            
        Returns:
            List of SchemaSearchResult sorted by relevance score
            
        Example:
            >>> # Hybrid search (default, balanced)
            >>> results = await memory.search_schema("customer orders", context)
            >>> 
            >>> # Pure vector search
            >>> results = await memory.search_schema("sales analytics", context, search_mode="vector")
            >>> 
            >>> # Graph expansion from seed tables
            >>> results = await memory.search_schema("orders", context, search_mode="expand")
        """
        if search_mode == "vector_only":
            return await self.search_by_business_query(
                query=query,
                context=context,
                limit=limit,
                similarity_threshold=similarity_threshold,
                domain_filter=domain_filter,
            )
        
        if search_mode == "graph_only":
            if self._neo4j_store:
                if required_fields:
                    graph_results = await self._hybrid_search._search_graph_by_fields(
                        field_names=required_fields,
                        domain_filter=domain_filter,
                    ) if self._hybrid_search else []
                elif domain_filter:
                    graph_results = await self._neo4j_store.find_tables_by_domain(
                        domain=domain_filter,
                        limit=limit,
                    )
                else:
                    return []
                
                results = []
                for rank, gr in enumerate(graph_results):
                    fusion_result = FusionResult(
                        table_name=gr.get("table", {}).get("table_name", ""),
                        schema_name=gr.get("table", {}).get("schema_name", "public"),
                        vector_score=None,
                        graph_score=1.0,
                        fusion_score=1.0,
                        rank=rank + 1,
                        source="graph",
                    )
                    results.append(self._build_search_result(fusion_result, gr))
                return results
            return []
        
        if search_mode == "graph_expand":
            context_schema_retrieve = (
                context.metadata.get("schema_retrieve_context", {})
                if context.metadata
                else {}
            )
            seed_table_refs = context_schema_retrieve.get("seed_table_refs", [])
            if seed_tables:
                for seed_table in seed_tables:
                    if isinstance(seed_table, str) and seed_table.strip():
                        seed_table_refs.append({"full_name": seed_table.strip()})
            seed_tables = [
                ref.get("full_name")
                or ".".join(filter(None, [ref.get("schema_name"), ref.get("table_name")]))
                for ref in seed_table_refs
                if isinstance(ref, dict)
            ]

            if not seed_tables:
                # Fallback to vector seeds only when no prior seed context exists.
                vector_results = await self.search_by_business_query(
                    query=query,
                    context=context,
                    limit=5,
                    similarity_threshold=similarity_threshold,
                    domain_filter=domain_filter,
                )
                seed_tables = [r.table_schema.full_name for r in vector_results if r.table_schema]
            
            if self._hybrid_search and seed_tables:
                fusion_results = await self._hybrid_search.expand_by_graph(
                    seed_tables=seed_tables,
                    limit=limit,
                )
                
                results = []
                for fr in fusion_results:
                    table_data = await self._neo4j_store.get_table_schema(
                        table_name=fr.table_name,
                        schema_name=fr.schema_name,
                    ) if self._neo4j_store else None
                    results.append(self._build_search_result(fr, table_data))
                return results
            return []
        
        # Default: hybrid search
        if self._hybrid_search:
            fusion_results = await self._hybrid_search.search_hybrid(
                query=query,
                limit=limit,
                threshold=similarity_threshold,
                domain_filter=domain_filter,
                required_fields=required_fields,
            )
            
            results = []
            for fr in fusion_results:
                table_data = await self._neo4j_store.get_table_schema(
                    table_name=fr.table_name,
                    schema_name=fr.schema_name,
                ) if self._neo4j_store else None
                results.append(self._build_search_result(fr, table_data))
            return results
        
        # Fallback to vector-only
        return await self.search_by_business_query(
            query=query,
            context=context,
            limit=limit,
            similarity_threshold=similarity_threshold,
            domain_filter=domain_filter,
        )
    
    async def get_table_schema(
        self,
        table_name: str,
        context: "ToolContext",
        schema_name: str = "public",
        database_name: Optional[str] = None,
    ) -> Optional["TableSchema"]:
        """
        Get full schema for a table.
        
        Args:
            table_name: Table name
            context: ToolContext
            schema_name: Schema name
            database_name: Optional database name
            
        Returns:
            TableSchema or None if not found
        """
        if self._neo4j_store:
            table_data = await self._neo4j_store.get_table_schema(
                table_name=table_name,
                schema_name=schema_name,
                database_name=database_name,
            )
            if table_data:
                return self._neo4j_store_to_table_schema(table_data)
        
        return None
    
    async def list_tables(
        self,
        context: "ToolContext",
        *,
        domain_filter: Optional[str] = None,
        limit: int = 100,
        offset: int = 0,
    ) -> List["TableSchema"]:
        """
        List tables in memory.
        
        Args:
            context: ToolContext
            domain_filter: Optional domain filter
            limit: Maximum results
            offset: Pagination offset
            
        Returns:
            List of TableSchema
        """
        if self._neo4j_store:
            table_list = await self._neo4j_store.list_all_tables(
                domain_filter=domain_filter,
                limit=limit,
                offset=offset,
            )
            
            results = []
            for item in table_list:
                schema = self._neo4j_store_to_table_schema(item)
                if schema:
                    results.append(schema)
            return results
        
        return []
    
    # ==================== Hybrid Search (Abstract method implementation) ====================
    
    async def hybrid_search(
        self,
        query: str,
        context: "ToolContext",
        *,
        limit: int = 10,
        similarity_threshold: float = 0.3,
        domain_filter: Optional[str] = None,
        required_fields: Optional[List[str]] = None,
    ) -> List["SchemaSearchResult"]:
        """
        Perform a hybrid search combining vector similarity and graph relationships.
        
        This method is an alias for search_schema with hybrid mode.
        
        Args:
            query: Natural language query
            context: ToolContext
            limit: Maximum results
            similarity_threshold: Minimum similarity score
            domain_filter: Optional domain filter
            required_fields: Optional required field names
            
        Returns:
            List of SchemaSearchResult
        """
        return await self.search_schema(
            query=query,
            context=context,
            search_mode="hybrid",
            limit=limit,
            similarity_threshold=similarity_threshold,
            domain_filter=domain_filter,
            required_fields=required_fields,
        )
    
    async def delete_table_schema(
        self,
        table_name: str,
        context: "ToolContext",
        schema_name: str = "public",
    ) -> bool:
        """
        Delete a table schema.
        
        Args:
            table_name: Table name
            context: ToolContext
            schema_name: Schema name
            
        Returns:
            True if deleted
        """
        full_name = f"{schema_name}.{table_name}"
        
        # Delete from vector store. Prefer the in-memory map, but fall back to a
        # direct Mem0 lookup so legacy tables created before a restart still work.
        vector_id = self._table_vector_id_map.get(full_name)
        if not vector_id and self._vector_store:
            vector_id = await self._vector_store.get_memory_id(
                table_name=table_name,
                schema_name=schema_name,
                user_id=self._default_user_id,
            )
            if vector_id:
                self._table_vector_id_map[full_name] = vector_id
                self._vector_id_map[vector_id] = full_name

        if vector_id:
            await self._vector_store.delete_table_schema(memory_id=vector_id)
            self._vector_id_map.pop(vector_id, None)
            self._table_vector_id_map.pop(full_name, None)
        
        # Delete from Neo4j
        if self._neo4j_store:
            return await self._neo4j_store.delete_table_schema(
                table_name=table_name,
                schema_name=schema_name,
            )
        
        return True
    
    # ==================== Utility Methods ====================
    
    async def get_statistics(self) -> Dict[str, Any]:
        """
        Get statistics about stored schemas.
        
        Returns:
            Dict with Neo4j and vector store statistics
        """
        stats = {}
        
        if self._neo4j_store:
            try:
                neo4j_stats = await self._neo4j_store.get_statistics()
                stats["neo4j"] = neo4j_stats
            except Exception:
                stats["neo4j"] = {"error": "Failed to get statistics"}
        
        if self._vector_store:
            try:
                vector_stats = await self._vector_store.get_statistics()
                stats["vector"] = vector_stats
            except Exception:
                stats["vector"] = {"error": "Failed to get statistics"}
        
        return stats
    
    async def clear_all(self) -> None:
        """Clear all stored schemas from vector store and Neo4j."""
        if self._vector_store:
            await self._vector_store.clear_all()

        if self._neo4j_store:
            await self._neo4j_store.clear_all()
        
        # Clear mappings
        self._vector_id_map.clear()
        self._table_vector_id_map.clear()
    
    def close(self) -> None:
        """Close all store connections."""
        if self._neo4j_store:
            self._neo4j_store.close()
            self._neo4j_store = None
        
        if self._vector_store:
            self._vector_store.close()
            self._vector_store = None
        
        self._hybrid_search = None
    
    def __enter__(self):
        """Context manager entry."""
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.close()
        return False
