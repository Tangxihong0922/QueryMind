from __future__ import annotations
"""
Lifecycle hook that records SQL strategy outcomes for governance.
"""

import logging
from typing import TYPE_CHECKING, Any, Optional

from .base import LifecycleHook
from ..agent.sql_governance import SqlGovernanceManager

if TYPE_CHECKING:
    from ..tool import Tool
    from ..tool.models import ToolContext, ToolResult

logger = logging.getLogger(__name__)


class SqlGovernanceHook(LifecycleHook):
    """Record run_sql outcomes so later requests can be guided."""

    def __init__(self, manager: SqlGovernanceManager):
        self._manager = manager

    async def before_tool(self, tool: "Tool[Any]", context: "ToolContext") -> None:
        return None

    async def after_tool(self, result: "ToolResult") -> Optional["ToolResult"]:
        metadata = dict(result.metadata or {})
        tool_name = metadata.get("tool_name")
        if tool_name != "run_sql":
            return None

        conversation_id = str(metadata.get("conversation_id") or "unknown")
        request_id = metadata.get("request_id")
        await self._manager.observe_sql_result(
            conversation_id=conversation_id,
            request_id=request_id,
            result_metadata=metadata,
            success=bool(result.success),
        )
        snapshot = await self._manager.build_request_metadata(
            conversation_id=conversation_id
        )
        if snapshot:
            metadata.update(snapshot)
        result.metadata = metadata
        logger.debug(
            "Recorded SQL governance state for conversation_id=%s success=%s",
            conversation_id,
            result.success,
        )
        return None
