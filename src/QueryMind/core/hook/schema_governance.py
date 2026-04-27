from __future__ import annotations
"""
Lifecycle hook that records schema_retrieve outcomes for governance.
"""

import logging
from typing import TYPE_CHECKING, Any, Optional

from .base import LifecycleHook
from ..agent.governance import SchemaGovernanceManager

if TYPE_CHECKING:
    from ..tool import Tool
    from ..tool.models import ToolContext, ToolResult

logger = logging.getLogger(__name__)


class SchemaGovernanceHook(LifecycleHook):
    """Record schema_retrieve outcomes so later requests can be constrained."""

    def __init__(self, manager: SchemaGovernanceManager):
        self._manager = manager

    async def before_tool(self, tool: "Tool[Any]", context: "ToolContext") -> None:
        return None

    async def after_tool(self, result: "ToolResult") -> Optional["ToolResult"]:
        metadata = result.metadata or {}
        tool_name = metadata.get("tool_name")
        if tool_name != self._manager.policy.schema_tool_name:
            return None

        conversation_id = str(metadata.get("conversation_id") or "unknown")
        request_id = metadata.get("request_id")
        state = await self._manager.observe_schema_result(
            conversation_id=conversation_id,
            request_id=request_id,
            result_metadata=metadata,
            success=bool(result.success),
        )
        snapshot = await self._manager.build_request_metadata(
            conversation_id=conversation_id
        )
        if snapshot:
            result.metadata.update(snapshot)
        governance = snapshot.get("schema_governance", {}) if snapshot else {}
        logger.info(
            "Schema governance update: conversation_id=%s calls=%s successes=%s failures=%s empty_streak=%s no_new_streak=%s locked=%s lock_reason=%s",
            conversation_id,
            governance.get("schema_retrieve_calls", state.schema_retrieve_calls),
            governance.get("schema_retrieve_successes", state.schema_retrieve_successes),
            governance.get("schema_retrieve_failures", state.schema_retrieve_failures),
            governance.get("consecutive_empty_results", state.consecutive_empty_results),
            governance.get("consecutive_no_new_tables", state.consecutive_no_new_tables),
            governance.get("schema_locked", state.schema_locked),
            governance.get("lock_reason", state.lock_reason),
        )
        logger.debug(
            "Recorded schema governance summary for conversation_id=%s tool=%s success=%s summary=%s",
            conversation_id,
            tool_name,
            result.success,
            snapshot.get("last_schema_summary", {}).get("summary_text") if snapshot else None,
        )
        return None
