from __future__ import annotations
"""
LLM middleware that tracks SQL strategy state and injects short reactive recaps
without leaking benchmark profiles.
"""

from typing import TYPE_CHECKING, Any, Optional

from .base import LlmMiddleware
from ..agent.sql_governance import (
    SqlGovernanceManager,
    infer_profile_from_message,
    parse_sql_governance_profile,
)

if TYPE_CHECKING:
    from ..llm.models import LlmRequest, LlmResponse


def _extract_user_message(request: "LlmRequest") -> str:
    for message in reversed(request.messages):
        if message.role == "user" and message.content.strip():
            return message.content
    return ""


def _append_prompt_block(existing: Optional[str], block: str) -> str:
    existing = (existing or "").rstrip()
    block = block.strip()
    if not block:
        return existing
    if block in existing:
        return existing
    if not existing:
        return block
    return f"{existing}\n\n{block}"


def _coerce_meaningful_profile(data: Any):
    profile = parse_sql_governance_profile(data)
    if profile is None:
        return None
    if not (profile.categories or profile.notes or profile.allow_metadata_query):
        return None
    return profile


class SqlGovernanceMiddleware(LlmMiddleware):
    """Track SQL governance state and inject reactive recap prompts."""

    def __init__(self, manager: SqlGovernanceManager):
        self._manager = manager

    async def before_llm_request(self, request: "LlmRequest") -> "LlmRequest":
        metadata = dict(request.metadata or {})
        conversation_id = str(metadata.get("conversation_id") or "unknown")
        request_id = metadata.get("request_id")
        turn_snapshot = await self._manager.build_request_metadata(
            conversation_id=conversation_id
        )

        profile = _coerce_meaningful_profile(
            metadata.pop("sql_governance_profile", None)
            or metadata.pop("sql_profile", None)
        )
        if profile is None:
            profile = _coerce_meaningful_profile(
                turn_snapshot.get("runtime_profile")
                or metadata.get("runtime_profile")
                or metadata.get("sql_runtime_profile")
            )
        if profile is None:
            profile = _coerce_meaningful_profile(metadata.pop("sql_governance", None))
        if profile is None:
            profile = infer_profile_from_message(_extract_user_message(request))

        await self._manager.register_request_profile(
            conversation_id=conversation_id,
            request_id=request_id,
            profile=profile,
            user_message=_extract_user_message(request),
        )

        governance_block = await self._manager.build_prompt_block(
            conversation_id=conversation_id,
            request_id=request_id,
            fallback_profile=profile,
        )
        if governance_block:
            request.system_prompt = _append_prompt_block(
                request.system_prompt,
                governance_block,
            )

        snapshot = await self._manager.build_request_metadata(conversation_id=conversation_id)
        if snapshot:
            metadata.update(snapshot)

        request.metadata = metadata

        if await self._manager.should_inject_recap(
            conversation_id=conversation_id,
            request_id=request_id,
        ):
            recap_block = await self._manager.build_recap_block(
                conversation_id=conversation_id,
                fallback_profile=profile,
            )
            request.system_prompt = _append_prompt_block(
                request.system_prompt,
                recap_block,
            )

        return request

    async def after_llm_response(
        self, request: "LlmRequest", response: "LlmResponse"
    ) -> "LlmResponse":
        return response
