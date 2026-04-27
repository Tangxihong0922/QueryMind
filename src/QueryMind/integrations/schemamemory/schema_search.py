"""
Schema Search Engine - Combines vector and graph search.

This module provides 3 retrieval methods:
- Vector search only (semantic similarity from Mem0)
- Graph search only (FK traversal, domain filtering from Neo4j)
- Hybrid search (combination of both)

Hybrid search results are fused using RRF (Reciprocal Rank Fusion) algorithm.

Scoring Strategy:
    hybrid_score = vector_weight * (1 / (k + vector_rank + 1)) 
                 + graph_weight * (1 / (k + graph_rank + 1))
    
    Default weights: vector=0.6, graph=0.4
    Default k=60 (RRF parameter)
"""

from __future__ import annotations

import asyncio
from typing import List, Optional, Dict, Any, TYPE_CHECKING
from dataclasses import dataclass
from collections import defaultdict

from .graph_layer import Neo4jGraphStore
from .vector_layer import Mem0VectorStore, VectorSearchResult

if TYPE_CHECKING:
    from QueryMind.capabilities.schema_memory.models import SchemaSearchResult


@dataclass
class HybridSearchConfig:
    """Configuration for hybrid search."""
    vector_weight: float = 0.6
    graph_weight: float = 0.4
    rrf_k: int = 60
    max_vector_results: int = 50
    max_graph_results: int = 50
    min_fusion_score: float = 0.0


@dataclass
class FusionResult:
    """Result from the fusion algorithm."""
    table_name: str
    schema_name: str
    vector_score: Optional[float]
    graph_score: Optional[float]
    fusion_score: float
    rank: int
    source: str  # "vector", "graph", or "both"


class SchemaSearch:
    """
    Schema search engine.
    
    This class implements multi-search retrieval:
    1. Parallel execution of vector and graph searches
    2. RRF (Reciprocal Rank Fusion) for score combination
    3. Configurable weights and thresholds
    
    Attributes:
        vector_store: Mem0 vector store for semantic search
        graph_store: Neo4j graph store for FK/domain search
        config: Hybrid search configuration
        
    Example:
        >>> schema_search = SchemaSearch(vector_store, graph_store)
        >>> results = await schema_search.search("order analytics", limit=10)
    """
    
    def __init__(
        self,
        vector_store: Mem0VectorStore,
        graph_store: Neo4jGraphStore,
        config: Optional[HybridSearchConfig] = None,
    ):
        self._vector_store = vector_store
        self._graph_store = graph_store
        self._config = config or HybridSearchConfig()
    def _rrf_fusion(
        self,
        vector_results: List[VectorSearchResult],
        graph_results: List[Dict[str, Any]],
    ) -> List[FusionResult]:
        """
        Perform RRF (Reciprocal Rank Fusion) on vector and graph results.
        
        RRF Formula:
            score(r) = Σ (weight / (k + rank(r)))
            
        Where:
            - weight: weight for the source (vector or graph)
            - k: RRF parameter (default 60)
            - rank(r): rank of result r in its source list
            
        Args:
            vector_results: Results from vector search, sorted by similarity
            graph_results: Results from graph search, sorted by relevance
            
        Returns:
            List of FusionResult sorted by fusion score
        """
        scores: Dict[str, Dict[str, Any]] = defaultdict(
            lambda: {"vector_score": None, "graph_score": None, "fusion_score": 0.0}
        )
        
        # Process vector results (already sorted by similarity)
        for rank, vr in enumerate(vector_results):
            key = f"{vr.schema_name}.{vr.table_name}"
            scores[key]["table_name"] = vr.table_name
            scores[key]["schema_name"] = vr.schema_name
            scores[key]["vector_score"] = vr.score
            scores[key]["memory_id"] = vr.memory_id
            
            # RRF contribution from vector
            rrf_contribution = self._config.vector_weight / (self._config.rrf_k + rank + 1)
            scores[key]["fusion_score"] += rrf_contribution
        
        # Process graph results (sorted by hops/relevance)
        for rank, gr in enumerate(graph_results):
            table = gr.get("table", {})
            table_name = table.get("table_name", "")
            schema_name = table.get("schema_name", "public")
            hops = gr.get("hops", 1)
            
            key = f"{schema_name}.{table_name}"
            scores[key]["table_name"] = table_name
            scores[key]["schema_name"] = schema_name
            
            # Convert hops to graph score: 1 / (hops + 1)
            graph_score = 1.0 / (hops + 1)
            scores[key]["graph_score"] = graph_score
            
            # RRF contribution from graph
            rrf_contribution = self._config.graph_weight / (self._config.rrf_k + rank + 1)
            scores[key]["fusion_score"] += rrf_contribution
        
        # Sort by fusion score and assign ranks
        sorted_scores = sorted(
            scores.values(),
            key=lambda x: x["fusion_score"],
            reverse=True
        )
        
        results = []
        for rank, item in enumerate(sorted_scores):
            # Skip items below minimum score only when a positive threshold is configured.
            if self._config.min_fusion_score > 0 and item["fusion_score"] < self._config.min_fusion_score:
                continue
            
            # Determine source
            if item["vector_score"] is not None and item["graph_score"] is not None:
                source = "both"
            elif item["vector_score"] is not None:
                source = "vector"
            else:
                source = "graph"
            
            results.append(FusionResult(
                table_name=item["table_name"],
                schema_name=item["schema_name"],
                vector_score=item["vector_score"],
                graph_score=item["graph_score"],
                fusion_score=item["fusion_score"],
                rank=rank + 1,
                source=source,
            ))
        
        return results
    
    async def search_hybrid(
        self,
        query: str,
        *,
        limit: int = 10,
        threshold: float = 0.3,
        domain_filter: Optional[str] = None,
        required_fields: Optional[List[str]] = None,
    ) -> List[FusionResult]:
        """
        Perform hybrid search by business query.
        
        Args:
            query: Natural language search query
            limit: Maximum number of results
            threshold: Minimum vector similarity threshold
            domain_filter: Optional domain filter
            required_fields: Optional list of required field names
            
        Returns:
            List of FusionResult sorted by fusion score
        """
        # Parallel search: vector and graph.
        # Only run graph search when we have explicit graph hints. Natural
        # language queries are not reliable graph domains and can wipe out recall.
        vector_task = self._vector_store.search_by_query(
            query=query,
            limit=self._config.max_vector_results,
            threshold=threshold,
            domain_filter=domain_filter,
        )

        if required_fields:
            graph_task = self._search_graph_by_fields(
                field_names=required_fields,
                domain_filter=domain_filter,
            )
        elif domain_filter:
            graph_task = self._search_graph_by_domain(domain_filter)
        else:
            graph_task = asyncio.sleep(0, result=[])
        
        vector_results, graph_results = await asyncio.gather(
            vector_task, graph_task
        )
        
        if vector_results and not graph_results:
            return self._rrf_fusion(vector_results, [])[:limit]
        if graph_results and not vector_results:
            return self._rrf_fusion([], graph_results)[:limit]

        # Fusion
        return self._rrf_fusion(vector_results, graph_results)[:limit]
    
    async def search_vector_only(
        self,
        query: str,
        *,
        limit: int = 10,
        threshold: float = 0.3,
        domain_filter: Optional[str] = None,
    ) -> List[FusionResult]:
        """
        Search using vector search only.
        
        Args:
            query: Natural language search query
            limit: Maximum results
            threshold: Minimum similarity threshold
            domain_filter: Optional domain filter
            
        Returns:
            List of FusionResult (only from vector source)
        """
        vector_results = await self._vector_store.search_by_query(
            query=query,
            limit=limit,
            threshold=threshold,
            domain_filter=domain_filter,
        )
        
        return [
            FusionResult(
                table_name=r.table_name,
                schema_name=r.schema_name,
                vector_score=r.score,
                graph_score=None,
                fusion_score=r.score,  # Use vector score directly
                rank=i + 1,
                source="vector",
            )
            for i, r in enumerate(vector_results)
        ]
    
    async def search_graph_only(
        self,
        table_name: Optional[str] = None,
        *,
        schema_name: str = "public",
        max_hops: int = 2,
        domain_filter: Optional[str] = None,
        required_fields: Optional[List[str]] = None,
    ) -> List[FusionResult]:
        """
        Search using graph traversal only.
        
        Args:
            table_name: Starting table for FK traversal
            schema_name: Schema name
            max_hops: Maximum FK traversal depth
            domain_filter: Optional domain filter
            
        Returns:
            List of FusionResult (only from graph source)
        """
        if required_fields:
            graph_results = await self._search_graph_by_fields(
                field_names=required_fields,
                domain_filter=domain_filter,
                limit=self._config.max_graph_results,
            )
        elif table_name:
            graph_results = await self._graph_store.find_related_tables(
                table_name=table_name,
                schema_name=schema_name,
                max_hops=max_hops,
            )
        elif domain_filter:
            graph_results = await self._graph_store.find_tables_by_domain(
                domain=domain_filter,
                limit=self._config.max_graph_results,
            )
        else:
            graph_results = await self._graph_store.list_all_tables(
                limit=self._config.max_graph_results,
            )
        
        # Convert to FusionResult
        results = []
        for rank, gr in enumerate(graph_results):
            table = gr.get("table", {})
            hops = gr.get("hops", 0)
            graph_score = 1.0 / (hops + 1) if hops else 1.0
            
            results.append(FusionResult(
                table_name=table.get("table_name", ""),
                schema_name=table.get("schema_name", "public"),
                vector_score=None,
                graph_score=graph_score,
                fusion_score=graph_score,
                rank=rank + 1,
                source="graph",
            ))
        
        return results
    
    async def expand_by_graph(
        self,
        seed_tables: List[str],
        *,
        schema_name: str = "public",
        max_hops: int = 2,
        limit: int = 20,
    ) -> List[FusionResult]:
        """
        Expand seed tables through graph traversal.
        
        This is useful when you have identified some relevant tables
        and want to find more related tables through FK relationships.
        
        Args:
            seed_tables: List of seed table names
            schema_name: Schema name
            max_hops: Maximum FK traversal depth
            limit: Maximum results
            
        Returns:
            List of expanded tables with fusion scores
        """
        all_graph_results = []

        for table_name in seed_tables:
            seed_schema = schema_name
            seed_table = table_name
            if "." in table_name:
                parts = [part for part in table_name.split(".") if part]
                if len(parts) >= 2:
                    seed_schema = parts[-2]
                    seed_table = parts[-1]
            results = await self._graph_store.find_related_tables(
                table_name=seed_table,
                schema_name=seed_schema,
                max_hops=max_hops,
            )
            all_graph_results.extend(results)
        
        # Deduplicate by table name
        seen = set()
        unique_results = []
        for gr in all_graph_results:
            table = gr.get("table", {})
            key = f"{table.get('schema_name', 'public')}.{table.get('table_name', '')}"
            if key not in seen:
                seen.add(key)
                unique_results.append(gr)
        
        # Sort by hops and limit
        unique_results.sort(key=lambda x: x.get("hops", 0))
        unique_results = unique_results[:limit]
        
        # Convert to FusionResult
        return [
            FusionResult(
                table_name=gr.get("table", {}).get("table_name", ""),
                schema_name=gr.get("table", {}).get("schema_name", "public"),
                vector_score=None,
                graph_score=1.0 / (gr.get("hops", 0) + 1),
                fusion_score=1.0 / (gr.get("hops", 0) + 1),
                rank=i + 1,
                source="graph",
            )
            for i, gr in enumerate(unique_results)
        ]
    
    # ==================== Helper Methods ====================
    
    async def _search_graph_by_fields(
        self,
        field_names: List[str],
        domain_filter: Optional[str] = None,
        limit: int = 10,
    ) -> List[Dict[str, Any]]:
        """Search graph by field names."""
        all_results = []
        
        for field_name in field_names:
            results = await self._graph_store.find_tables_by_field(
                field_name=field_name,
                exact_match=False,
                limit=limit,
            )
            all_results.extend(results)
        
        # Deduplicate
        seen = set()
        unique_results = []
        for r in all_results:
            table = r.get("table", {})
            key = f"{table.get('schema_name', 'public')}.{table.get('table_name', '')}"
            if key not in seen:
                seen.add(key)
                unique_results.append(r)
        if domain_filter:
            filtered_results = []
            for r in unique_results:
                table = r.get("table", {})
                if table.get("domain") == domain_filter:
                    filtered_results.append(r)
            return filtered_results

        return unique_results
    
    async def _search_graph_by_domain(
        self,
        domain: str,
    ) -> List[Dict[str, Any]]:
        """Search graph by domain."""
        results = await self._graph_store.find_tables_by_domain(
            domain=domain,
            limit=self._config.max_graph_results,
        )
        return results
    
    def get_config(self) -> HybridSearchConfig:
        """Get current search configuration."""
        return self._config
    
    def update_config(self, config: HybridSearchConfig) -> None:
        """Update search configuration."""
        self._config = config
