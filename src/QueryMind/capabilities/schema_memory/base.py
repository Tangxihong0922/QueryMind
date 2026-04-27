"""
Schema memory capability interface.

This module contains the abstract base class for table schema operations.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any, TYPE_CHECKING
from pydantic import BaseModel
from datetime import datetime
from enum import Enum

if TYPE_CHECKING:
    from QueryMind.core.tool import ToolContext
    from .models import (
        TableSchema,
        SchemaSearchResult,
    )

class SchemaSearchMode(str, Enum):
    """Schema Search Mode"""
    VECTOR_ONLY = "vector_only"         # Vector search only
    GRAPH_ONLY = "graph_only"           # Graph walk only
    HYBRID = "hybrid"                   # Vector + graph
    GRAPH_EXPAND = "graph_expand"       # Seed node expansion


class SchemaMemory(ABC):
    """Abstract base class for schema memory operations."""

    @abstractmethod
    async def save_table_schema(
        self,
        schema: "TableSchema",
        context: "ToolContext",
    ) -> str:
        """Save a table schema to memory and return its unique ID."""
        pass
    
    @abstractmethod
    async def save_schema_batch(
        self,
        schemas: List["TableSchema"],
        context: "ToolContext",
    ) -> List[str]:
        """Batch save table schemas to memory and return their unique IDs."""
        pass
    
    @abstractmethod
    async def update_table_schema(
        self,
        schema_id: str,
        schema: "TableSchema",
        context: "ToolContext",
    ) -> bool:
        """Update Schema (through DB or upload file)"""
        pass
    
    # ==================== Vector Search ====================
    
    @abstractmethod
    async def search_by_business_query(
        self,
        query: str,
        context: "ToolContext",
        *,
        limit: int = 10,
        similarity_threshold: float = 0.4,
        domain_filter: Optional[str] = None,
    ) -> List[SchemaSearchResult]:
        """Search for relevant tables based on a business-level query (using vector search)."""
        pass
    
    @abstractmethod
    async def search_by_field_names(
        self,
        field_names: List[str],
        context: "ToolContext",
        *,
        limit: int = 10,
        exact_match: bool = False,
    ) -> List[SchemaSearchResult]:
        """Search for tables by field names."""
        pass
    
    # ==================== Graph Search ====================
    
    @abstractmethod
    async def find_related_tables(
        self,
        table_name: str,
        context: "ToolContext",
        *,
        max_hops: int = 2,
        relationship_types: Optional[List[str]] = None,
    ) -> List[SchemaSearchResult]:
        """Find tables related to the given table through foreign key relationships (graph search)."""
        pass
    
    @abstractmethod
    async def find_tables_by_foreign_key(
        self,
        from_table: str,
        from_field: str,
        context: "ToolContext",
        *,
        direction: str = "outgoing",  # "outgoing" | "incoming" | "both"
    ) -> List[SchemaSearchResult]:
        """Find tables connected by a foreign key relationship."""
        pass
    
    # ==================== Hybrid Search ====================
    
    @abstractmethod
    async def hybrid_search(
        self,
        query: str,
        context: "ToolContext",
        *,
        search_mode: SchemaSearchMode = SchemaSearchMode.HYBRID,
        limit: int = 10,
        similarity_threshold: float = 0.3,
        domain_filter: Optional[str] = None,
        required_fields: Optional[List[str]] = None,
    ) -> List[SchemaSearchResult]:
        """Perform a hybrid search combining vector similarity and graph relationships."""
        pass
    
    # ==================== Management ====================
    
    @abstractmethod
    async def get_table_schema(
        self,
        table_name: str,
        context: "ToolContext",
        schema_name: str = "public",
        database_name: Optional[str] = None,
    ) -> Optional["TableSchema"]:
        """Get the full schema for a specified table."""
        pass
    
    @abstractmethod
    async def list_tables(
        self,
        context: "ToolContext",
        *,
        domain_filter: Optional[str] = None,
        limit: int = 100,
        offset: int = 0,
    ) -> List["TableSchema"]:
        """List tables in memory, optionally filtered by domain."""
        pass
    
    @abstractmethod
    async def delete_table_schema(
        self,
        table_name: str,
        context: "ToolContext",
        schema_name: str = "public",
    ) -> bool:
        """Delete a table schema."""
        pass
