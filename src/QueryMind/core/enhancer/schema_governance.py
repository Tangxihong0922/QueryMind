from __future__ import annotations
"""
Compatibility enhancer for schema-governance context.

Runtime schema-governance guidance is now injected as message-side advisories
by middleware. This enhancer remains for API compatibility and performs no
prompt mutation.
"""

from typing import TYPE_CHECKING

from .base import LlmContextEnhancer
from ..agent.governance import SchemaGovernanceManager

if TYPE_CHECKING:
    from ..user.models import User
    from ..llm.models import LlmMessage


class SchemaGovernanceEnhancer(LlmContextEnhancer):
    """No-op compatibility enhancer."""

    def __init__(self, manager: SchemaGovernanceManager):
        self._manager = manager

    async def enhance_system_prompt(
        self, system_prompt: str, user_message: str, user: "User"
    ) -> str:
        return system_prompt

    async def enhance_user_messages(
        self, messages: list["LlmMessage"], user: "User"
    ) -> list["LlmMessage"]:
        return messages
