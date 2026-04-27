"""
Schema retrieve context enricher for injecting expand mode context.

This enricher retrieves conversation history from ConversationStore and
injects seed_tables into the ToolContext for expand mode retrieval.
"""

import logging
from typing import TYPE_CHECKING, Optional, List

from .base import ToolContextEnricher

if TYPE_CHECKING:
    from ...core.tool.models import ToolContext

logger = logging.getLogger(__name__)


class SchemaRetrieveContextEnricher(ToolContextEnricher):
    """Enricher for injecting expand mode context into ToolContext.

    This enricher:
    1. Prefers turn-local schema snapshot already present in context metadata
    2. Falls back to ConversationStore history when needed
    3. Identifies previous SchemaRetrieveTool call results
    4. Extracts seed_tables from metadata
    5. Injects expand context into context.metadata

    The LLM can then use this context to decide whether to use expand mode.

    Example:
        >>> enricher = SchemaRetrieveContextEnricher(conversation_store)
        >>> enriched_context = await enricher.enrich_context(context)
    """

    def __init__(
        self,
        conversation_store: Optional["ConversationStore"] = None,
        tool_name: str = "schema_retrieve"
    ):
        """Initialize the enricher.

        Args:
            conversation_store: Optional conversation storage for retrieving history.
                               If not provided, enricher will skip injection.
            tool_name: Name of the schema retrieve tool to track (default: "schema_retrieve")
        """
        self._conversation_store = conversation_store
        self._tool_name = tool_name

    def _extract_explicit_schema_summary(self, metadata: dict) -> Optional[dict]:
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

    def _write_schema_context(
        self,
        context: "ToolContext",
        summary: dict,
    ) -> None:
        selected_tables = list(summary.get("selected_tables", []) or [])
        selected_table_refs = list(summary.get("selected_table_refs", []) or [])
        previous_query = summary.get("query", "")
        graph_hint = summary.get("graph_hint", "none")
        required_fields = summary.get("required_fields", [])
        domain_filter = summary.get("domain_filter")
        lock_reason = summary.get("lock_reason")
        context.metadata["last_schema_summary"] = dict(summary)

        if selected_tables:
            logger.info(
                "Injecting expand context with %s seed tables", len(selected_tables)
            )
            context.metadata["schema_retrieve_context"] = {
                "seed_tables": selected_tables,
                "seed_table_refs": selected_table_refs,
                "expand_mode": True,
                "last_query": previous_query,
                "graph_hint": graph_hint,
                "required_fields": required_fields,
                "domain_filter": domain_filter,
                "summary_text": summary.get("summary_text"),
                "schema_locked": summary.get("schema_locked", False),
                "lock_reason": lock_reason,
            }
        else:
            context.metadata["schema_retrieve_context"] = {
                "seed_tables": [],
                "seed_table_refs": [],
                "expand_mode": False,
                "last_query": previous_query,
                "last_search_mode": summary.get("search_mode"),
                "graph_hint": graph_hint,
                "required_fields": required_fields,
                "domain_filter": domain_filter,
                "summary_text": summary.get("summary_text"),
                "schema_locked": summary.get("schema_locked", False),
                "lock_reason": lock_reason,
            }

    async def enrich_context(self, context: "ToolContext") -> "ToolContext":
        """Enrich the tool context with schema retrieve expand context.

        Args:
            context: The tool context to enrich

        Returns:
            Enriched context with schema_retrieve_context in metadata
        """
        if not self._conversation_store:
            logger.debug("No conversation store configured, skipping enrich")
            return context

        try:
            # Prefer the turn-local snapshot first; only fall back to history if
            # the current context does not already carry schema retrieval state.
            explicit_summary = self._extract_explicit_schema_summary(context.metadata or {})
            if explicit_summary:
                self._write_schema_context(context, explicit_summary)
                return context

            # Get recent conversation history
            history = await self._conversation_store.get_recent(
                conversation_id=context.conversation_id,
                limit=10
            )

            if not history:
                logger.debug("No conversation history found")
                return context

            # Find the last SchemaRetrieveTool call result
            last_schema_result = None
            saw_schema_retrieve_signal = False
            for msg in reversed(history):
                metadata = {}
                if hasattr(msg, "metadata") and msg.metadata:
                    metadata = msg.metadata or {}
                    explicit_summary = self._extract_explicit_schema_summary(metadata)
                    if explicit_summary:
                        last_schema_result = explicit_summary
                        break

                # Check if this is a tool result message
                if hasattr(msg, 'tool_result') and msg.tool_result:
                    metadata = (
                        msg.tool_result
                        if isinstance(msg.tool_result, dict)
                        else getattr(msg.tool_result, "metadata", {}) or {}
                    )
                    if not metadata and hasattr(msg, "metadata"):
                        metadata = msg.metadata or {}
                    explicit_summary = self._extract_explicit_schema_summary(metadata)
                    if explicit_summary:
                        last_schema_result = explicit_summary
                        break
                    if metadata.get("tool_name") == self._tool_name:
                        last_schema_result = metadata
                        saw_schema_retrieve_signal = True
                        break
                # Also check for tool_calls in assistant messages
                elif hasattr(msg, 'tool_calls') and msg.tool_calls:
                    for tc in msg.tool_calls:
                        tc_name = getattr(tc, "name", None)
                        if tc_name is None and isinstance(tc, dict):
                            tc_name = tc.get("name")

                        if tc_name == self._tool_name:
                            saw_schema_retrieve_signal = True
                            # Found a schema_retrieve call, check if we have results
                            # from subsequent messages
                            pass

            if not last_schema_result:
                if saw_schema_retrieve_signal:
                    logger.debug(
                        "No previous schema_retrieve result found in history"
                    )
                return context

            self._write_schema_context(context, last_schema_result)

        except Exception as e:
            logger.warning(f"Failed to enrich context with schema retrieve data: {e}")

        return context


# Type hint for ConversationStore (to be provided by storage layer)
class ConversationStore:
    """Placeholder for conversation storage interface.

    This should be implemented by the storage layer to provide
    conversation history retrieval.
    """

    async def get_recent(
        self,
        conversation_id: str,
        limit: int = 10
    ) -> List:
        """Get recent messages from a conversation.

        Args:
            conversation_id: The conversation identifier
            limit: Maximum number of messages to retrieve

        Returns:
            List of conversation messages
        """
        raise NotImplementedError("ConversationStore must be implemented by storage layer")
