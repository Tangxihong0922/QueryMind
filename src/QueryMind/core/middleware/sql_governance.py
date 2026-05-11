from __future__ import annotations
"""
LLM middleware that tracks SQL strategy state and injects runtime advisories
without mutating the system prompt.
"""

from typing import TYPE_CHECKING, Any, Optional

from .base import LlmMiddleware
from ..agent.sql_governance import (
    SqlGovernanceManager,
    infer_profile_from_message,
    parse_sql_governance_profile,
)

if TYPE_CHECKING:
    from ..llm.models import LlmMessage
    from ..llm.models import LlmRequest, LlmResponse


def _extract_user_message(request: "LlmRequest") -> str:
    for message in reversed(request.messages):
        if message.role == "user" and message.content.strip():
            return message.content
    return ""


def _coerce_meaningful_profile(data: Any):
    profile = parse_sql_governance_profile(data)
    if profile is None:
        return None
    if not (profile.categories or profile.notes or profile.allow_metadata_query):
        return None
    return profile


def _collapse_lines(*parts: str) -> str:
    return "\n".join(part for part in parts if part).strip()


def _summarize_sql_shape(shape: dict[str, Any]) -> str:
    if not isinstance(shape, dict):
        return ""

    bits: list[str] = []
    cte_count = int(shape.get("cte_count") or 0)
    if cte_count:
        bits.append(f"cte_count={cte_count}")

    if shape.get("has_group_by"):
        bits.append("has_group_by=yes")
    if shape.get("has_rollup"):
        bits.append("has_rollup=yes")
    if shape.get("has_grouping_sets"):
        bits.append("has_grouping_sets=yes")
    if shape.get("has_grouping"):
        bits.append("has_grouping=yes")

    group_by_items = [
        str(item).strip()
        for item in (shape.get("group_by_items") or [])
        if str(item).strip()
    ]
    if group_by_items:
        preview = ", ".join(group_by_items[:3])
        if len(group_by_items) > 3:
            preview += f" (+{len(group_by_items) - 3})"
        bits.append(f"group_by_items={preview}")

    aggregate_projection_count = int(shape.get("aggregate_projection_count") or 0)
    non_aggregate_projection_count = int(
        shape.get("non_aggregate_projection_count") or 0
    )
    if aggregate_projection_count or non_aggregate_projection_count:
        bits.append(
            "aggregate_projection_count="
            f"{aggregate_projection_count}, non_aggregate_projection_count="
            f"{non_aggregate_projection_count}"
        )

    return ", ".join(bits)


def _build_runtime_context_notice(
    *,
    schema_snapshot: dict[str, Any],
    sql_snapshot: dict[str, Any],
) -> Optional["LlmMessage"]:
    from ..llm import LlmMessage

    schema_governance = schema_snapshot.get("schema_governance") or {}
    last_schema_summary = schema_snapshot.get("last_schema_summary") or {}
    if not isinstance(schema_governance, dict):
        schema_governance = {}
    if not isinstance(last_schema_summary, dict):
        last_schema_summary = {}

    sql_governance = sql_snapshot.get("sql_governance") or {}
    runtime_profile = sql_snapshot.get("runtime_profile") or {}
    last_sql_summary = sql_snapshot.get("last_sql_summary") or {}
    if not isinstance(sql_governance, dict):
        sql_governance = {}
    if not isinstance(runtime_profile, dict):
        runtime_profile = {}
    if not isinstance(last_sql_summary, dict):
        last_sql_summary = {}

    schema_locked = bool(schema_governance.get("schema_locked"))
    schema_lock_reason = str(schema_governance.get("lock_reason") or "").strip()
    schema_summary_text = str(last_schema_summary.get("summary_text") or "").strip()

    anchor_tier = str(runtime_profile.get("anchor_tier") or "").strip()
    sql_family = str(
        runtime_profile.get("sql_family") or sql_governance.get("sql_family") or ""
    ).strip()
    repair_strategy = str(sql_governance.get("repair_strategy") or "").strip()
    repair_reason = str(sql_governance.get("repair_reason") or "").strip()
    repair_signals = [
        str(bit).strip()
        for bit in (sql_governance.get("repair_signals") or [])
        if str(bit).strip()
    ]
    freeze_reason = str(sql_governance.get("freeze_reason") or "").strip()
    best_sql_preview = str(runtime_profile.get("best_sql_preview") or "").strip()
    sql_summary_text = str(last_sql_summary.get("summary_text") or "").strip()
    schema_runtime_recap = str(sql_snapshot.get("schema_runtime_recap") or "").strip()
    sql_runtime_recap = str(sql_snapshot.get("sql_runtime_recap") or "").strip()
    row_grain_state = sql_governance.get("row_grain_state") or {}
    if not isinstance(row_grain_state, dict):
        row_grain_state = {}
    active_shape = (
        sql_governance.get("last_sql_shape")
        or sql_governance.get("best_sql_shape")
        or sql_governance.get("frozen_sql_shape")
        or {}
    )
    shape_summary = _summarize_sql_shape(active_shape)

    lines = ["## Runtime Context Notice"]
    if schema_locked or schema_summary_text or str(schema_snapshot.get("schema_runtime_recap") or "").strip():
        lines.extend(
            [
                "",
                "Schema governance:",
                f"- schema_retrieve unavailable this turn: {'yes' if schema_locked else 'no'}",
            ]
        )
        if schema_lock_reason:
            lines.append(f"- lock reason: {schema_lock_reason}")
        if schema_summary_text:
            lines.append(f"- live summary: {schema_summary_text}")

    if schema_runtime_recap:
        lines.extend(["", "Schema recap:", schema_runtime_recap])

    if anchor_tier or sql_summary_text or best_sql_preview or freeze_reason or sql_family or row_grain_state or repair_strategy or repair_signals or sql_runtime_recap:
        lines.extend(
            [
                "",
                "SQL governance:",
            ]
        )
        if anchor_tier:
            lines.append(f"- anchor tier: {anchor_tier}")
        if sql_family:
            lines.append(f"- sql family: {sql_family}")
        if sql_summary_text:
            lines.append(f"- live summary: {sql_summary_text}")
        if repair_strategy:
            lines.append(f"- repair strategy: {repair_strategy}")
        if repair_reason:
            lines.append(f"- repair reason: {repair_reason}")
        if repair_signals:
            lines.append(f"- repair signals: {', '.join(repair_signals)}")
        if repair_strategy == "structural_rewrite" and shape_summary:
            lines.append(f"- structural shape: {shape_summary}")
        if best_sql_preview:
            lines.append(f"- anchor preview: {best_sql_preview}")
        if freeze_reason:
            lines.append(f"- freeze reason: {freeze_reason}")
        if row_grain_state:
            expected = str(row_grain_state.get("expected") or "").strip()
            observed = str(row_grain_state.get("observed") or "").strip()
            status = str(row_grain_state.get("status") or "").strip()
            grain_bits = ", ".join(
                bit
                for bit in [
                    f"expected={expected}" if expected else "",
                    f"observed={observed}" if observed else "",
                    f"status={status}" if status else "",
                ]
                if bit
            )
            if grain_bits:
                lines.append(f"- row grain: {grain_bits}")

    if sql_runtime_recap:
        lines.extend(["", "SQL recap:", sql_runtime_recap])

    if len(lines) == 1:
        return None

    return LlmMessage(
        role="user",
        content=_collapse_lines(*lines),
        metadata={
            "advisory_type": "runtime_context_notice",
            "schema_locked": schema_locked,
            "schema_lock_reason": schema_lock_reason or None,
            "anchor_tier": anchor_tier or None,
            "freeze_reason": freeze_reason or None,
            "sql_family": sql_family or None,
            "repair_strategy": repair_strategy or None,
            "repair_reason": repair_reason or None,
            "repair_signals": repair_signals or None,
        },
    )


class SqlGovernanceMiddleware(LlmMiddleware):
    """Track SQL governance state and inject runtime notices."""

    def __init__(self, manager: SqlGovernanceManager):
        self._manager = manager

    async def before_llm_request(self, request: "LlmRequest") -> "LlmRequest":
        metadata = dict(request.metadata or {})
        conversation_id = str(metadata.get("conversation_id") or "unknown")
        request_id = metadata.get("request_id")

        profile = _coerce_meaningful_profile(
            metadata.pop("sql_governance_profile", None)
            or metadata.pop("sql_profile", None)
        )
        if profile is None:
            profile = _coerce_meaningful_profile(
                metadata.get("runtime_profile")
                or metadata.get("sql_runtime_profile")
                or metadata.get("sql_governance")
            )
        if profile is None:
            profile = infer_profile_from_message(_extract_user_message(request))

        await self._manager.register_request_profile(
            conversation_id=conversation_id,
            request_id=request_id,
            profile=profile,
            user_message=_extract_user_message(request),
        )

        snapshot = await self._manager.build_request_metadata(
            conversation_id=conversation_id
        )
        if snapshot:
            metadata.update(snapshot)

        if await self._manager.should_inject_recap(
            conversation_id=conversation_id,
            request_id=request_id,
        ):
            recap_block = str(
                await self._manager.build_recap_block(
                    conversation_id=conversation_id,
                    fallback_profile=profile,
                )
            ).strip()
            if recap_block:
                metadata["sql_runtime_recap"] = recap_block

        request.metadata = metadata

        notice = _build_runtime_context_notice(
            schema_snapshot=metadata,
            sql_snapshot=metadata,
        )
        if notice is not None:
            request.messages = [notice, *request.messages]

        return request

    async def after_llm_response(
        self, request: "LlmRequest", response: "LlmResponse"
    ) -> "LlmResponse":
        return response
