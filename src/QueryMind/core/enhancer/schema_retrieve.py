from __future__ import annotations
"""
Schema context enhancer for injecting schema retrieval results into LLM context.

This enhancer now keeps schema context on the message side only. Search-mode
rules belong in the stable system prompt, while dynamic schema snapshots are
preserved as real tool results or advisory messages.
"""

import logging
from typing import TYPE_CHECKING, List, Optional

from .base import LlmContextEnhancer

if TYPE_CHECKING:
    from ...core.user.models import User
    from ...core.llm.models import LlmMessage

logger = logging.getLogger(__name__)


class SchemaContextEnhancer(LlmContextEnhancer):
    """Enhancer for formatting schema retrieval results into messages."""

    def __init__(
        self,
        tool_name: str = "schema_retrieve",
        max_tables: int = 10,
        max_fields_per_table: int = 15
    ):
        """Initialize the enhancer.

        Args:
            tool_name: Name of the schema retrieve tool (default: "schema_retrieve")
            max_tables: Maximum number of tables to include in context
            max_fields_per_table: Maximum fields per table to include
        """
        self._tool_name = tool_name
        self._max_tables = max_tables
        self._max_fields_per_table = max_fields_per_table

    async def enhance_system_prompt(
        self,
        system_prompt: str,
        user_message: str,
        user: "User"
    ) -> str:
        return system_prompt

    def _extract_schema_summary(self, message: "LlmMessage") -> Optional[dict]:
        metadata = getattr(message, "metadata", {}) or {}
        summary = metadata.get("last_schema_summary")
        if isinstance(summary, dict) and summary:
            return summary

        governance = metadata.get("schema_governance")
        if isinstance(governance, dict):
            summary = governance.get("last_schema_summary")
            if isinstance(summary, dict) and summary:
                return summary

        schema_context = metadata.get("schema_retrieve_context")
        if isinstance(schema_context, dict) and schema_context:
            selected_tables = list(schema_context.get("seed_tables", []) or [])
            selected_table_refs = list(
                schema_context.get("seed_table_refs", []) or []
            )
            if (
                selected_tables
                or selected_table_refs
                or schema_context.get("summary_text")
                or schema_context.get("last_query")
            ):
                return {
                    "tool_name": self._tool_name,
                    "query": schema_context.get("last_query", ""),
                    "search_mode": schema_context.get(
                        "last_search_mode",
                        schema_context.get("search_mode", "unknown"),
                    ),
                    "graph_hint": schema_context.get("graph_hint", "none"),
                    "required_fields": schema_context.get("required_fields", []),
                    "domain_filter": schema_context.get("domain_filter"),
                    "selected_tables": selected_tables,
                    "selected_table_refs": selected_table_refs,
                    "summary_text": schema_context.get("summary_text"),
                    "schema_locked": schema_context.get("schema_locked", False),
                    "lock_reason": schema_context.get("lock_reason"),
                    "success": bool(selected_tables),
                    "total_results": len(selected_tables),
                }

        return None

    def _extract_schema_result_metadata(self, message: "LlmMessage") -> Optional[dict]:
        if hasattr(message, "tool_result") and message.tool_result:
            metadata = (
                message.tool_result
                if isinstance(message.tool_result, dict)
                else getattr(message.tool_result, "metadata", {}) or {}
            )
            if not metadata and hasattr(message, "metadata"):
                metadata = message.metadata or {}
            if metadata.get("tool_name") == self._tool_name:
                return metadata

        metadata = getattr(message, "metadata", {}) or {}
        if metadata.get("tool_name") == self._tool_name:
            return metadata

        return None

    async def enhance_user_messages(
        self,
        messages: List["LlmMessage"],
        user: "User"
    ) -> List["LlmMessage"]:
        """Enhance user messages with schema retrieval results.

        This method looks for schema retrieval results in the conversation
        and injects formatted schema information as context.

        Args:
            messages: The list of messages to enhance
            user: The user making the request

        Returns:
            Enhanced list of messages with schema context
        """
        # Find the most recent explicit schema summary or schema retrieval result.
        schema_summary = None
        schema_result = None
        for msg in reversed(messages):
            schema_summary = self._extract_schema_summary(msg)
            schema_result_metadata = self._extract_schema_result_metadata(msg)
            if schema_summary:
                if schema_result_metadata:
                    schema_result = msg
                break

            if schema_result_metadata:
                schema_result = msg
                break

        if not schema_summary and not schema_result:
            logger.debug("No schema retrieval result found in messages")
            return messages

        # Format schema context
        try:
            schema_context = self._format_schema_context(
                schema_summary=schema_summary,
                tool_result=schema_result,
            )
            if not schema_context:
                return messages

            from ..llm import LlmMessage

            schema_message = LlmMessage(
                role="user",
                content=f"## Schema Context\n\n{schema_context}",
                metadata={
                    "advisory_type": "schema_context",
                    "tool_name": self._tool_name,
                },
            )
            return [schema_message, *messages]

        except Exception as e:
            logger.warning(f"Failed to format schema context: {e}")
            return messages

    def _format_schema_context(
        self,
        schema_summary: Optional[dict] = None,
        tool_result=None,
    ) -> Optional[str]:
        """Format schema retrieval result into readable context.

        Args:
            schema_summary: Explicit schema summary from governance state
            tool_result: ToolResult or metadata dict containing schema information

        Returns:
            Formatted schema context string or None
        """
        metadata = {}
        if schema_summary:
            metadata = schema_summary
        elif isinstance(tool_result, dict):
            metadata = tool_result
        else:
            metadata = getattr(tool_result, "metadata", {}) or {}

        search_mode = metadata.get("search_mode", "unknown")
        query = metadata.get("query", "")
        total_results = int(metadata.get("total_results", 0) or 0)

        if not total_results and not schema_summary:
            return None

        lines = [
            f"Search Mode: {search_mode}",
            f"Query: {query}",
            f"Results: {total_results} table(s)",
        ]

        selected_tables = metadata.get("selected_tables") or []
        if selected_tables:
            preview = ", ".join(str(table) for table in selected_tables[:5])
            if len(selected_tables) > 5:
                preview += f", ... (+{len(selected_tables) - 5})"
            lines.append(f"Tables: {preview}")
        else:
            lines.append("Tables: none")

        summary_text = metadata.get("summary_text")
        if summary_text:
            lines.append(f"Summary: {summary_text}")

        lock_reason = metadata.get("lock_reason")
        if lock_reason:
            lines.append(f"Lock: {lock_reason}")

        # Extract table information from tool result
        if isinstance(tool_result, dict):
            content = tool_result.get("result_for_llm") or tool_result.get("content", "")
        else:
            content = getattr(tool_result, 'result_for_llm', None) or getattr(tool_result, 'content', '')

        if content:
            lines.append(content)

        return "\n".join(lines)
