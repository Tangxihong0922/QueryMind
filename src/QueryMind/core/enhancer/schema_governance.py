from __future__ import annotations
"""
Prompt enhancer that adds stable schema-governance guidance.
"""

from typing import TYPE_CHECKING

from .base import LlmContextEnhancer
from ..agent.governance import SchemaGovernanceManager

if TYPE_CHECKING:
    from ..user.models import User
    from ..llm.models import LlmMessage


class SchemaGovernanceEnhancer(LlmContextEnhancer):
    """Append a stable schema-governance instruction block to the system prompt."""

    def __init__(self, manager: SchemaGovernanceManager):
        self._manager = manager

    async def enhance_system_prompt(
        self, system_prompt: str, user_message: str, user: "User"
    ) -> str:
        if "## Schema Governance" in system_prompt:
            return system_prompt

        block = self._manager.policy.system_prompt_block.strip()
        if not block:
            return system_prompt
        if block in system_prompt:
            return system_prompt
        if system_prompt.strip():
            return f"{system_prompt.rstrip()}\n\n{block}"
        return block

    async def enhance_user_messages(
        self, messages: list["LlmMessage"], user: "User"
    ) -> list["LlmMessage"]:
        return messages
