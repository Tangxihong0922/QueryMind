"""
Schema Management capability package.

This module provides the SchemaManagementService abstract class for managing 
SchemaMemory with features like listing, editing, and AI-powered enrichment.

Architecture:
    capabilities/schema_management/  - Abstract base class and models
    integrations/schemamanagement/  - Backend-specific implementations

Example:
    >>> from QueryMind.capabilities.schema_management import SchemaManagementService
    >>> from QueryMind.integrations.schemamanagement import Neo4jMem0SchemaManagementService
    >>> 
    >>> # Use the concrete implementation
    >>> service: SchemaManagementService = Neo4jMem0SchemaManagementService(
    ...     schema_memory=schema_memory,
    ...     llm_service=llm_service
    ... )
    >>> 
    >>> # List tables with completeness check
    >>> items = await service.list_tables(context)
    >>> 
    >>> # AI enrich incomplete schemas
    >>> enriched = await service.enrich_with_llm(incomplete_tables, context)
"""

from .base import SchemaManagementService
from .models import (
    SchemaListItem,
    EnrichPrompt,
    EnrichResult,
    EnrichBatchResult,
    build_enrich_output_config,
    build_enrich_response_format,
    ENRICH_OUTPUT_SCHEMA,
)

__all__ = [
    # Abstract base class
    "SchemaManagementService",
    # Data models
    "SchemaListItem",
    "EnrichPrompt",
    "EnrichResult",
    "EnrichBatchResult",
    "build_enrich_output_config",
    "build_enrich_response_format",
    "ENRICH_OUTPUT_SCHEMA",
]
