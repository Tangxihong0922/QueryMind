"""
Schema Management Service base class.

This module provides the abstract base class for SchemaManagementService,
defining the interface for managing SchemaMemory with visualization and AI enrichment.
"""

from __future__ import annotations

import logging
from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any, TYPE_CHECKING

from .models import SchemaListItem, EnrichResult, EnrichBatchResult

if TYPE_CHECKING:
    from ..schema_memory.base import SchemaMemory
    from ..schema_memory.models import TableSchema
    from ...core.tool import ToolContext
    from ...core.llm import LlmService

logger = logging.getLogger(__name__)


class SchemaManagementService(ABC):
    """
    Abstract base class for managing SchemaMemory with visualization and AI enrichment.
    
    This class provides:
    - List tables with completeness checking
    - Edit BusinessContext and field meanings
    - AI-powered enrichment for incomplete schemas
    - Statistics and metrics
    
    Architecture:
        capabilities/schema_management/     - Abstract base class (this module)
        integrations/schemamanagement/    - Backend-specific implementations
        
    Example:
        >>> from QueryMind.capabilities.schema_management import SchemaManagementService
        >>> from QueryMind.integrations.schemamanagement import Neo4jMem0SchemaManagementService
        >>> 
        >>> service: SchemaManagementService = Neo4jMem0SchemaManagementService(
        ...     schema_memory=schema_memory,
        ...     llm_service=llm_service
        ... )
        >>> 
        >>> # List tables with completeness check
        >>> items = await service.list_tables(context)
        >>> 
        >>> # Get incomplete tables
        >>> incomplete = await service.list_tables(context, incomplete_only=True)
        >>> 
        >>> # AI enrich incomplete schemas
        >>> enriched = await service.enrich_with_llm(incomplete, context)
    """
    
    # Completeness thresholds
    COMPLETENESS_THRESHOLD: float = 0.9  # 90% is considered complete

    def __init__(
        self,
        schema_memory: "SchemaMemory",
        llm_service: Optional["LlmService"] = None,
    ):
        """
        Initialize the schema management service.
        
        Args:
            schema_memory: SchemaMemory instance for storage (abstract interface)
            llm_service: Optional LLM service for AI enrichment
        """
        self._memory = schema_memory
        self._llm = llm_service

    @property
    def schema_memory(self) -> "SchemaMemory":
        """Get the underlying SchemaMemory instance."""
        return self._memory
    
    def set_llm_service(self, llm_service: "LlmService") -> None:
        """
        Set or update the LLM service.
        
        Args:
            llm_service: LLM service instance for AI enrichment
        """
        self._llm = llm_service
    
    @property
    def llm_service(self) -> Optional["LlmService"]:
        """Get the current LLM service."""
        return self._llm

    # ==================== Public API ====================

    @abstractmethod
    async def list_tables(
        self,
        context: "ToolContext",
        *,
        domain_filter: Optional[str] = None,
        incomplete_only: bool = False,
        search_query: Optional[str] = None,
        limit: int = 100,
        offset: int = 0,
    ) -> List[SchemaListItem]:
        """
        List tables with completeness metadata.
        
        Args:
            context: Tool context
            domain_filter: Optional domain filter
            incomplete_only: Only return incomplete tables
            search_query: Optional search query
            limit: Maximum results
            offset: Pagination offset
            
        Returns:
            List of SchemaListItem with completeness info
        """
        pass

    @abstractmethod
    async def get_statistics(
        self,
        context: "ToolContext",
    ) -> Dict[str, Any]:
        """
        Get SchemaMemory statistics.
        
        Args:
            context: Tool context
            
        Returns:
            Dictionary with statistics
        """
        pass

    @abstractmethod
    async def get_table(
        self,
        table_name: str,
        context: "ToolContext",
        schema_name: str = "public",
    ) -> Optional["TableSchema"]:
        """
        Get a single table schema.
        
        Args:
            table_name: Table name
            context: Tool context
            schema_name: Schema name
            
        Returns:
            TableSchema or None if not found
        """
        pass

    @abstractmethod
    async def update_table(
        self,
        table_name: str,
        context: "ToolContext",
        *,
        domain: Optional[str] = None,
        description: Optional[str] = None,
        keywords: Optional[List[str]] = None,
        field_updates: Optional[Dict[str, Dict[str, str]]] = None,
        schema_name: str = "public",
    ) -> bool:
        """
        Update a table's BusinessContext and field meanings.
        
        Args:
            table_name: Table name
            context: Tool context
            domain: New domain value
            description: New description
            keywords: New keywords list
            field_updates: Dict of {field_name: {business_meaning, description}}
            schema_name: Schema name
            
        Returns:
            True if updated successfully
        """
        pass

    @abstractmethod
    async def delete_table(
        self,
        table_name: str,
        context: "ToolContext",
        schema_name: str = "public",
    ) -> bool:
        """Delete a table schema from both vector and graph stores."""
        pass

    async def delete_tables(
        self,
        full_names: List[str],
        context: "ToolContext",
    ) -> List[bool]:
        """Delete multiple table schemas by full name."""
        results: List[bool] = []
        for full_name in full_names:
            parts = full_name.rsplit(".", 1)
            if len(parts) != 2:
                results.append(False)
                continue

            schema_name, table_name = parts
            results.append(
                await self.delete_table(
                    table_name=table_name,
                    context=context,
                    schema_name=schema_name,
                )
            )
        return results

    @abstractmethod
    async def enrich_with_llm(
        self,
        tables: List["TableSchema"],
        context: "ToolContext",
        *,
        auto_save: bool = True,
    ) -> EnrichBatchResult:
        """
        Enrich incomplete schemas using LLM.
        
        This method generates business context and field meanings
        for tables using AI.
        
        Args:
            tables: List of tables to enrich
            context: Tool context
            auto_save: Whether to save enriched schemas automatically
            
        Returns:
            EnrichBatchResult with enrichment results
        """
        pass

    # ==================== Protected Methods ====================
    
    def _calculate_completeness(self, table: "TableSchema") -> SchemaListItem:
        """
        Calculate completeness score for a table.
        
        Score breakdown:
        - BusinessContext.domain: 15%
        - BusinessContext.description: 25%
        - Field.business_meaning: 40% (per field)
        - Keywords: 20%
        
        Args:
            table: TableSchema to evaluate
            
        Returns:
            SchemaListItem with completeness metadata
        """
        scores = []
        
        # Domain (15%)
        domain_score = 1.0 if (
            table.business_context.domain and 
            table.business_context.domain != "public" and
            table.business_context.domain != "Unknown"
        ) else 0.0
        scores.append(("domain", domain_score))
        
        # Description (25%)
        desc_score = 1.0 if (
            table.business_context.description and 
            len(table.business_context.description) > 10
        ) else 0.0
        scores.append(("description", desc_score))
        
        # Field meanings (40% total, weighted by field count)
        total_fields = len(table.field_definitions)
        fields_with_meaning = 0
        
        for field in table.field_definitions:
            if field.business_meaning and len(field.business_meaning) > 0:
                fields_with_meaning += 1
        
        field_score = fields_with_meaning / total_fields if total_fields > 0 else 0.0
        scores.append(("fields", field_score))
        
        # Keywords (20%)
        keywords_score = 1.0 if (
            table.business_context.keywords and 
            len(table.business_context.keywords) >= 2
        ) else 0.0
        scores.append(("keywords", keywords_score))
        
        # Calculate weighted total
        total_score = (
            domain_score * 0.15 +
            desc_score * 0.25 +
            field_score * 0.40 +
            keywords_score * 0.20
        ) * 100
        
        # Find missing fields
        missing = []
        
        if domain_score == 0:
            missing.append("domain")
        if desc_score == 0:
            missing.append("description")
        if keywords_score == 0:
            missing.append("keywords")
        
        for field in table.field_definitions:
            if not field.business_meaning:
                missing.append(f"field:{field.field_name}")
        
        return SchemaListItem(
            table_schema=table,
            is_complete=total_score >= (self.COMPLETENESS_THRESHOLD * 100),
            missing_fields=missing,
            field_count=total_fields,
            complete_field_count=fields_with_meaning,
            fk_count=len(table.relationships),
            completeness_score=total_score,
        )
