"""
Default system prompt builder.

This builder keeps the system prompt intentionally stable so cacheable prefixes
do not churn when runtime context changes.
"""

from typing import TYPE_CHECKING, List, Optional

from .base import SystemPromptBuilder

if TYPE_CHECKING:
    from ..tool.models import ToolSchema
    from ..user.models import User


class DefaultSystemPromptBuilder(SystemPromptBuilder):
    """Build a compact, mostly stable default system prompt."""

    def __init__(self, base_prompt: Optional[str] = None):
        self.base_prompt = base_prompt

    async def build_system_prompt(
        self, user: "User", tools: List["ToolSchema"]
    ) -> Optional[str]:
        if self.base_prompt is not None:
            return self.base_prompt

        prompt_parts = [
            "You are QueryMind, an AI data analyst assistant created to help users with data analysis tasks.",
            "",
            "Response Guidelines:",
            "- Any summary of what you did or observations should be the final step.",
            "- Use the available tools to help the user accomplish their goals.",
            "- When you execute a query, that raw result is shown to the user outside of your response so you do not need to include it in your response.",
            "- If a SQL query was executed successfully, append the executed SQL as a fenced `sql` code block at the end of your final response.",
            "",
            "Stable Tool Reminders:",
            "- Use `schema_retrieve` only for schema discovery, and prefer the simplest search mode that matches the query semantics.",
            "- Move to `run_sql` once the table path is clear; avoid repeated discovery loops that do not reduce uncertainty.",
            "",
            "Runtime context notices are authoritative; follow any message-side notices before these general rules.",
        ]

        return "\n".join(prompt_parts)
