from __future__ import annotations
"""
Default LLM context enhancer implementation using AgentMemory.

This implementation surfaces relevant memories as message-side advisory
context instead of appending them to the system prompt.
"""

from typing import TYPE_CHECKING, List, Optional

from .base import LlmContextEnhancer

if TYPE_CHECKING:
    from ..user.models import User
    from ..llm.models import LlmMessage
    from ...capabilities.agent_memory import AgentMemory, TextMemorySearchResult


_MEMORY_ADVISORY_HEADER = "## Memory Advisory"


def _find_last_user_message(messages: List["LlmMessage"]) -> str:
    for message in reversed(messages):
        if message.role == "user" and message.content.strip():
            return message.content.strip()
    return ""


class DefaultLlmContextEnhancer(LlmContextEnhancer):
    """Default enhancer that uses AgentMemory to add relevant context."""

    def __init__(self, agent_memory: Optional["AgentMemory"] = None):
        """Initialize with optional agent memory.

        Args:
            agent_memory: Optional AgentMemory instance. If not provided,
                         enhancement will be skipped.
        """
        self.agent_memory = agent_memory

    async def enhance_system_prompt(
        self, system_prompt: str, user_message: str, user: "User"
    ) -> str:
        return system_prompt

    async def enhance_user_messages(
        self, messages: list["LlmMessage"], user: "User"
    ) -> list["LlmMessage"]:
        """Inject relevant memories as a user-side advisory message."""
        if not self.agent_memory or getattr(self.agent_memory, "is_degraded", False):
            return messages

        user_message = _find_last_user_message(messages)
        if not user_message:
            return messages

        try:
            from ..llm import LlmMessage
            from ..tool import ToolContext
            import uuid

            context = ToolContext(
                user=user,
                conversation_id="temp",
                request_id=str(uuid.uuid4()),
                agent_memory=self.agent_memory,
            )

            memories: List["TextMemorySearchResult"] = await self.agent_memory.search_text_memories(
                query=user_message,
                context=context,
                limit=5,
            )
            if not memories:
                return messages

            lines = [
                _MEMORY_ADVISORY_HEADER,
                "",
                "Use these snippets only if they are relevant to the current turn:",
            ]
            for index, result in enumerate(memories, start=1):
                memory = result.memory
                content = " ".join(str(memory.content or "").split()).strip()
                if not content:
                    continue
                lines.append(f"{index}. {content}")

            if len(lines) <= 3:
                return messages

            advisory = LlmMessage(
                role="user",
                content="\n".join(lines).strip(),
                metadata={
                    "advisory_type": "memory",
                    "memory_result_count": sum(
                        1 for result in memories if str(getattr(result.memory, "content", "")).strip()
                    ),
                },
            )
            return [advisory, *messages]
        except Exception as e:
            import logging

            logger = logging.getLogger(__name__)
            logger.warning("Failed to enhance user messages with memories: %s", e)
            return messages
