from __future__ import annotations
"""
LLM middleware that narrows schema_retrieve visibility once governance says so.
"""

from typing import TYPE_CHECKING

from .base import LlmMiddleware
from ..agent.governance import SchemaGovernanceManager

if TYPE_CHECKING:
    from ..llm.models import LlmRequest, LlmResponse


class SchemaGovernanceMiddleware(LlmMiddleware):
    """Enforce schema governance at request time and surface metadata."""

    def __init__(self, manager: SchemaGovernanceManager):
        self._manager = manager

    def _build_recap_block(self, snapshot: dict[str, object]) -> str:
        summary = snapshot.get("last_schema_summary") or {}
        governance = snapshot.get("schema_governance") or {}
        lines = [self._manager.policy.recap_message.strip()]
        summary_text = summary.get("summary_text") if isinstance(summary, dict) else None
        if summary_text:
            lines.append("")
            lines.append("Latest schema snapshot:")
            lines.append(f"- {summary_text}")
        elif governance:
            lines.append("")
            lines.append("Latest schema snapshot:")
            lines.append(
                "- calls={calls}, successes={successes}, failures={failures}, "
                "empty_streak={empty}, no_new_streak={new}, lock={lock}".format(
                    calls=governance.get("schema_retrieve_calls", 0),
                    successes=governance.get("schema_retrieve_successes", 0),
                    failures=governance.get("schema_retrieve_failures", 0),
                    empty=governance.get("consecutive_empty_results", 0),
                    new=governance.get("consecutive_no_new_tables", 0),
                    lock=governance.get("lock_reason") or "none",
                )
            )
        return "\n".join(line for line in lines if line is not None)

    async def before_llm_request(self, request: "LlmRequest") -> "LlmRequest":
        metadata = dict(request.metadata or {})
        conversation_id = str(metadata.get("conversation_id") or "unknown")
        request_id = metadata.get("request_id")
        tool_iterations = int(metadata.get("tool_iterations") or 0)
        max_tool_iterations = int(metadata.get("max_tool_iterations") or 0)

        snapshot = await self._manager.build_request_metadata(
            conversation_id=conversation_id
        )
        if snapshot:
            metadata.update(snapshot)

        if await self._manager.should_inject_recap(
            conversation_id=conversation_id,
            request_id=request_id,
            tool_iterations=tool_iterations,
            max_tool_iterations=max_tool_iterations,
        ):
            recap_block = self._build_recap_block(snapshot).strip()
            if recap_block:
                metadata["schema_runtime_recap"] = recap_block

        request.metadata = metadata

        hide_schema_tool, _ = await self._manager.should_hide_schema_tool(
            conversation_id=conversation_id
        )
        if hide_schema_tool and request.tools:
            request.tools = [
                tool
                for tool in request.tools
                if getattr(tool, "name", None) != self._manager.policy.schema_tool_name
            ]
            if not request.tools:
                request.tools = None

        return request

    async def after_llm_response(
        self, request: "LlmRequest", response: "LlmResponse"
    ) -> "LlmResponse":
        return response
