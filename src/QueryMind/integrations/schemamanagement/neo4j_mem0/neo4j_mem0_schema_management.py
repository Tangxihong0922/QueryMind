"""
Neo4j Mem0 Schema Management Service implementation.

This module provides the concrete implementation of SchemaManagementService
using Neo4jMem0SchemaMemory as the storage backend.
"""

from __future__ import annotations

import asyncio
import logging
import ast
import json
import re
from typing import List, Optional, Dict, Any, TYPE_CHECKING

from QueryMind.capabilities.schema_management.base import SchemaManagementService
from QueryMind.capabilities.schema_management.models import (
    SchemaListItem, 
    EnrichPrompt, 
    EnrichResult, 
    EnrichBatchResult
)

if TYPE_CHECKING:
    from QueryMind.integrations.schemamemory import Neo4jMem0SchemaMemory
    from QueryMind.capabilities.schema_memory.models import TableSchema
    from QueryMind.core.tool import ToolContext
    from QueryMind.core.llm import LlmService, LlmRequest

logger = logging.getLogger(__name__)


class Neo4jMem0SchemaManagementService(SchemaManagementService):
    """
    Concrete implementation of SchemaManagementService using Neo4jMem0SchemaMemory.
    
    This service provides full schema management capabilities:
    - List tables with completeness checking
    - Edit BusinessContext and field meanings
    - AI-powered enrichment for incomplete schemas
    - Statistics and metrics
    
    Example:
        >>> from QueryMind.integrations.schemamanagement import Neo4jMem0SchemaManagementService
        >>> from QueryMind.integrations.schemamemory import Neo4jMem0SchemaMemory
        >>> 
        >>> schema_memory = Neo4jMem0SchemaMemory(config=neo4j_config)
        >>> service = Neo4jMem0SchemaManagementService(
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

    def __init__(
        self,
        schema_memory: "Neo4jMem0SchemaMemory",
        llm_service: Optional["LlmService"] = None,
        structured_llm_service: Optional["LlmService"] = None,
    ):
        """
        Initialize the Neo4j-based schema management service.
        
        Args:
            schema_memory: Neo4jMem0SchemaMemory instance for storage
            llm_service: Optional LLM service for AI enrichment
        """
        super().__init__(schema_memory=schema_memory, llm_service=llm_service)
        self._structured_llm = structured_llm_service
        self._structured_output_supported: Optional[bool] = None

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
        # Get all tables from SchemaMemory
        tables = await self._memory.list_tables(
            context,
            domain_filter=domain_filter,
            limit=limit * 2,  # Get more for filtering
            offset=0,
        )
        
        items = []
        for table in tables:
            # Calculate completeness
            item = self._calculate_completeness(table)
            
            # Apply filters
            if incomplete_only and item.is_complete:
                continue
            
            if search_query:
                # Search in table name, domain, description
                query = search_query.lower()
                matches = (
                    query in table.table_name.lower() or
                    query in table.business_context.domain.lower() or
                    query in table.business_context.description.lower()
                )
                if not matches:
                    continue
            
            items.append(item)
        
        # Apply pagination
        return items[offset:offset + limit]

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
        # Get all tables
        tables = await self._memory.list_tables(context, limit=10000)
        
        # Calculate stats
        total = len(tables)
        complete = 0
        partial = 0
        incomplete = 0
        total_fields = 0
        fields_with_meaning = 0
        
        for table in tables:
            item = self._calculate_completeness(table)
            
            if item.completeness_score >= 90:
                complete += 1
            elif item.completeness_score >= 50:
                partial += 1
            else:
                incomplete += 1
            
            total_fields += len(table.field_definitions)
            fields_with_meaning += item.complete_field_count
        
        # Get memory stats if available
        memory_stats = {}
        if hasattr(self._memory, 'get_statistics'):
            try:
                memory_stats = await self._memory.get_statistics()
            except Exception:
                pass
        
        return {
            "total_tables": total,
            "complete_tables": complete,
            "partial_tables": partial,
            "incomplete_tables": incomplete,
            "completeness_rate": (complete / total * 100) if total > 0 else 0,
            "total_fields": total_fields,
            "fields_with_meaning": fields_with_meaning,
            "field_meaning_rate": (fields_with_meaning / total_fields * 100) if total_fields > 0 else 0,
            "memory_stats": memory_stats,
        }

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
        return await self._memory.get_table_schema(
            table_name=table_name,
            context=context,
            schema_name=schema_name,
        )

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
        # Get current table
        table = await self._memory.get_table_schema(
            table_name=table_name,
            context=context,
            schema_name=schema_name,
        )
        
        if not table:
            logger.warning(f"Table not found: {schema_name}.{table_name}")
            return False

        normalized_field_updates: Dict[str, Dict[str, str]] = {}
        if field_updates:
            for field_name, updates in field_updates.items():
                if isinstance(updates, dict):
                    normalized: Dict[str, str] = {}
                    business_meaning = updates.get("business_meaning")
                    if business_meaning is not None:
                        normalized["business_meaning"] = business_meaning
                    description = updates.get("description")
                    if description is not None:
                        normalized["description"] = description
                    if normalized:
                        normalized_field_updates[field_name] = normalized
                else:
                    normalized_field_updates[field_name] = {
                        "business_meaning": "" if updates is None else str(updates),
                    }

        # Update immutable BusinessContext via copies instead of in-place mutation.
        business_updates: Dict[str, Any] = {}
        if domain is not None:
            business_updates["domain"] = domain
        if description is not None:
            business_updates["description"] = description
        if keywords is not None:
            business_updates["keywords"] = keywords

        updated_business_context = (
            table.business_context.model_copy(update=business_updates)
            if business_updates
            else table.business_context
        )

        # Update field definitions by copying each field model.
        updated_fields = []
        for field in table.field_definitions:
            if normalized_field_updates and field.field_name in normalized_field_updates:
                updates = normalized_field_updates[field.field_name]
                field_update: Dict[str, Any] = {}
                if "business_meaning" in updates:
                    field_update["business_meaning"] = updates["business_meaning"]
                if "description" in updates:
                    field_update["description"] = updates["description"]
                updated_fields.append(field.model_copy(update=field_update))
            else:
                updated_fields.append(field)

        updated_table = table.model_copy(
            update={
                "business_context": updated_business_context,
                "field_definitions": updated_fields,
            }
        )

        # Save back to SchemaMemory
        await self._memory.update_table_schema(
            schema_id=f"{schema_name}.{table_name}",
            schema=updated_table,
            context=context,
        )
        
        return True

    async def delete_table(
        self,
        table_name: str,
        context: "ToolContext",
        schema_name: str = "public",
    ) -> bool:
        """Delete a table from schema memory."""
        return await self._memory.delete_table_schema(
            table_name=table_name,
            context=context,
            schema_name=schema_name,
        )

    async def enrich_with_llm(
        self,
        tables: List["TableSchema"],
        context: "ToolContext",
        *,
        auto_save: bool = True,
    ) -> EnrichBatchResult:
        """
        Enrich incomplete schemas using LLM.
        
        Args:
            tables: List of tables to enrich
            context: Tool context
            auto_save: Whether to save enriched schemas automatically
            
        Returns:
            EnrichBatchResult with enrichment results
        """
        if not self._llm:
            return EnrichBatchResult(
                total=len(tables),
                successful=0,
                failed=len(tables),
                results=[EnrichResult(
                    table_name=t.table_name,
                    success=False,
                    error="LLM service not configured"
                ) for t in tables]
            )
        
        results = []
        
        for table in tables:
            try:
                result = await self._enrich_single_table(table, context, auto_save)
                results.append(result)
            except Exception as e:
                logger.error(f"Failed to enrich {table.table_name}: {e}", exc_info=True)
                results.append(EnrichResult(
                    table_name=table.table_name,
                    success=False,
                    error=str(e)
                ))
        
        # Calculate summary
        successful = sum(1 for r in results if r.success)
        
        return EnrichBatchResult(
            total=len(tables),
            successful=successful,
            failed=len(tables) - successful,
            results=results,
        )

    # ==================== Private Methods ====================

    async def _enrich_single_table(
        self,
        table: "TableSchema",
        context: "ToolContext",
        auto_save: bool,
    ) -> EnrichResult:
        """Enrich a single table using LLM."""
        
        # Build prompt
        field_names = [f.field_name for f in table.field_definitions]
        field_types = {f.field_name: f.data_type for f in table.field_definitions}
        missing_field_names = [
            f.field_name for f in table.field_definitions if not f.business_meaning
        ]
        
        prompt = EnrichPrompt(
            table_name=table.table_name,
            schema_name=table.schema_name,
            field_names=field_names,
            field_types=field_types,
            existing_description=table.business_context.description,
            missing_field_names=missing_field_names,
        )
        
        # Call LLM
        from ....core.llm import LlmRequest, LlmMessage
        
        request = LlmRequest(
            user=context.user,
            system_prompt=(
                "You are a schema enrichment engine. "
                "Return exactly one valid JSON object and nothing else. "
                "Do not use markdown, code fences, commentary, or trailing text."
            ),
            temperature=0.5,
            # Keep the response budget compact so the Minimax-compatible backend
            # does not spend unnecessary capacity on this strictly-structured task.
            max_tokens=2048,
            messages=[LlmMessage(
                role="user",
                content=prompt.to_prompt()
            )],
        )
        
        result = None
        if self._structured_llm and self._structured_output_supported is not False:
            result = await self._try_structured_enrich(request, table)

        if result is None:
            response = await self._send_enrich_request_with_retry(request, table)
            
            # Parse response
            result = self._parse_enrich_response(
                response.content or "",
                table
            )

        # Auto-save if enabled
        if auto_save and result.success:
            await self.update_table(
                table_name=table.table_name,
                context=context,
                domain=result.domain,
                description=result.description,
                keywords=result.keywords,
                field_updates={name: {"business_meaning": meaning} 
                              for name, meaning in result.field_meanings.items()},
                schema_name=table.schema_name,
            )

        return result

    async def _try_structured_enrich(
        self,
        request: "LlmRequest",
        table: "TableSchema",
    ) -> Optional[EnrichResult]:
        """Try structured output first and fall back on failure."""
        if not self._structured_llm:
            return None

        try:
            response = await self._structured_llm.send_request(request)
            result = self._parse_enrich_response(response.content or "", table)

            if result.success:
                self._structured_output_supported = True
                return result

            logger.warning(
                "Structured enrichment parse failed for %s.%s: %s",
                table.schema_name,
                table.table_name,
                result.error,
            )
        except Exception as e:
            logger.warning(
                "Structured enrichment failed for %s.%s, falling back to prompt mode: %s",
                table.schema_name,
                table.table_name,
                e,
                exc_info=True,
            )

        self._structured_output_supported = False
        return None

    async def _send_enrich_request_with_retry(
        self,
        request: "LlmRequest",
        table: "TableSchema",
        *,
        max_attempts: int = 2,
        initial_delay: float = 1.0,
    ):
        """Send the enrichment request with a tiny retry window for transient 529/429 errors."""
        delay = initial_delay
        last_error: Optional[Exception] = None

        for attempt in range(1, max_attempts + 1):
            try:
                return await self._llm.send_request(request)
            except Exception as exc:
                last_error = exc
                if attempt >= max_attempts or not self._is_transient_llm_error(exc):
                    raise

                logger.warning(
                    "Transient enrichment LLM error for %s.%s (attempt %s/%s): %s; retrying in %.1fs",
                    table.schema_name,
                    table.table_name,
                    attempt,
                    max_attempts,
                    exc,
                    delay,
                )
                await asyncio.sleep(delay)
                delay *= 2

        if last_error is not None:
            raise last_error
        raise RuntimeError("Enrichment request failed unexpectedly")

    def _is_transient_llm_error(self, exc: Exception) -> bool:
        """Return True for transient provider-side overload/rate-limit errors."""
        status_code = getattr(exc, "status_code", None)
        if status_code in {429, 529}:
            return True

        response = getattr(exc, "response", None)
        if response is not None and getattr(response, "status_code", None) in {429, 529}:
            return True

        text = str(exc).lower()
        return any(
            token in text
            for token in (
                "529",
                "429",
                "overloaded_error",
                "overloaded",
                "rate limit",
                "too many requests",
            )
        )

    def _parse_enrich_response(
        self,
        content: str,
        table: "TableSchema",
    ) -> EnrichResult:
        """Parse LLM enrichment response."""
        
        json_payload = self._extract_json_payload(content)

        if not json_payload:
            logger.warning(
                "Failed to parse enrichment response for %s.%s. Raw content snippet: %r",
                table.schema_name,
                table.table_name,
                content[:500] if content else "",
            )
            return EnrichResult(
                table_name=table.table_name,
                success=False,
                error="Failed to parse LLM response"
            )
        
        try:
            data = self._load_json_like(json_payload)
            if not isinstance(data, dict):
                raise ValueError("LLM response did not contain a JSON object")

            keywords = data.get("keywords", [])
            if isinstance(keywords, str):
                keywords = [k.strip() for k in re.split(r"[,，\n]", keywords) if k.strip()]
            elif not isinstance(keywords, list):
                keywords = []

            field_meanings = data.get("field_meanings", {})
            if not isinstance(field_meanings, dict):
                field_meanings = {}
            
            return EnrichResult(
                table_name=table.table_name,
                domain=data.get("domain"),
                description=data.get("description"),
                keywords=keywords,
                field_meanings=field_meanings,
                success=True,
            )
        except Exception as e:
            logger.warning(
                "Failed to decode enrichment JSON for %s.%s: %s; snippet=%r",
                table.schema_name,
                table.table_name,
                e,
                json_payload[:500] if json_payload else "",
            )
            return EnrichResult(
                table_name=table.table_name,
                success=False,
                error=f"JSON parse error: {str(e)}"
            )

    def _extract_json_payload(self, content: str) -> Optional[str]:
        """Extract the first balanced JSON object from model output."""
        if not content:
            return None

        text = content.strip()
        if not text:
            return None

        # Prefer fenced JSON blocks if present.
        fence_match = re.search(
            r"```(?:json)?\s*([\s\S]*?)\s*```",
            text,
            re.IGNORECASE,
        )
        if fence_match:
            text = fence_match.group(1).strip()

        if text.startswith("{") and text.endswith("}"):
            return text

        start = text.find("{")
        if start == -1:
            return None

        depth = 0
        in_string = False
        escape = False

        for index in range(start, len(text)):
            char = text[index]
            if escape:
                escape = False
                continue
            if char == "\\":
                escape = True
                continue
            if char == '"':
                in_string = not in_string
                continue
            if in_string:
                continue
            if char == "{":
                depth += 1
            elif char == "}":
                depth -= 1
                if depth == 0:
                    return text[start:index + 1]

        return None

    def _load_json_like(self, payload: str) -> Any:
        """Load JSON payload with a couple of fallback normalizations."""
        candidates = [payload]
        cleaned = re.sub(r",\s*([}\]])", r"\1", payload)
        if cleaned != payload:
            candidates.append(cleaned)

        for candidate in candidates:
            try:
                return json.loads(candidate)
            except json.JSONDecodeError:
                pass

            try:
                return ast.literal_eval(candidate)
            except (ValueError, SyntaxError):
                pass

        raise json.JSONDecodeError("Unable to parse JSON-like payload", payload, 0)
