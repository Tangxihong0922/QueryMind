"""
Agent memory tools.

This module provides agent memory operations through an abstract AgentMemory interface,
allowing for different implementations (local vector DB, remote cloud service, etc.).
The tools access AgentMemory via ToolContext, which is populated by the Agent.
"""

import logging
from typing import Any, Dict, List, Optional, Type
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

from QueryMind.core.tool import Tool, ToolContext, ToolResult
from QueryMind.core.agent.config import UiFeature
from QueryMind.capabilities.agent_memory import AgentMemory
from QueryMind.components import (
    UiComponent,
    StatusBarUpdateComponent,
    CardComponent,
)


def _agent_memory_is_degraded(agent_memory: Any) -> bool:
    """Return True when the agent memory backend has fallen back to no-op mode."""
    return bool(getattr(agent_memory, "is_degraded", False))


def _get_canonical_question(context: ToolContext, fallback: str) -> str:
    """Prefer the original user message when it is available."""
    raw_user_message = getattr(context, "raw_user_message", None)
    if isinstance(raw_user_message, str):
        raw_user_message = raw_user_message.strip()
        if raw_user_message:
            return raw_user_message
    return fallback


class SaveQuestionToolArgsParams(BaseModel):
    """Parameters for saving question-tool-argument combinations."""

    question: str = Field(description="The original question that was asked")
    tool_name: str = Field(
        description="The name of the tool that was used successfully"
    )
    args: Dict[str, Any] = Field(
        description="The arguments that were passed to the tool"
    )


class SearchSavedCorrectToolUsesParams(BaseModel):
    """Parameters for searching saved tool usage patterns."""

    question: str = Field(
        description="The question to find similar tool usage patterns for"
    )
    limit: Optional[int] = Field(
        default=10, description="Maximum number of results to return"
    )
    similarity_threshold: Optional[float] = Field(
        default=0.7, description="Minimum similarity score for results (0.0-1.0)"
    )
    tool_name_filter: Optional[str] = Field(
        default=None, description="Filter results to specific tool name"
    )


class SaveTextMemoryParams(BaseModel):
    """Parameters for saving free-form text memories."""

    content: str = Field(description="The text content to save as a memory")


class SaveQuestionToolArgsTool(Tool[SaveQuestionToolArgsParams]):
    """Tool for saving successful question-tool-argument combinations."""

    @property
    def name(self) -> str:
        return "save_question_tool_args"

    @property
    def description(self) -> str:
        return (
            "Save a successful question-tool-argument combination for future reference"
        )
    
    @property
    def access_groups(self) -> List[str]:
        return []
    
    def get_args_schema(self) -> Type[SaveQuestionToolArgsParams]:
        return SaveQuestionToolArgsParams

    async def execute(
        self, context: ToolContext, args: SaveQuestionToolArgsParams
    ) -> ToolResult:
        """Save the tool usage pattern to agent memory."""
        try:
            question = _get_canonical_question(context, args.question)
            await context.agent_memory.save_tool_usage(
                question=question,
                tool_name=args.tool_name,
                args=args.args,
                context=context,
                success=True,
            )

            if _agent_memory_is_degraded(context.agent_memory):
                return ToolResult(
                    success=True,
                    result_for_llm=(
                        "Agent memory is unavailable, so this usage pattern was not saved."
                    ),
                    ui_component=UiComponent(
                        rich_component=StatusBarUpdateComponent(
                            status="idle",
                            message="Memory unavailable",
                            detail="Skipped saving usage pattern",
                        ),
                        simple_component=None,
                    ),
                )

            success_msg = (
                f"Successfully saved usage pattern for '{args.tool_name}' tool"
            )
            return ToolResult(
                success=True,
                result_for_llm=success_msg,
                ui_component=UiComponent(
                    rich_component=StatusBarUpdateComponent(
                        status="success",
                        message="Saved to memory",
                        detail=f"Saved pattern for '{args.tool_name}'",
                    ),
                    simple_component=None,
                ),
            )

        except Exception as e:
            error_message = f"Failed to save memory: {str(e)}"
            return ToolResult(
                success=False,
                result_for_llm=error_message,
                ui_component=UiComponent(
                    rich_component=StatusBarUpdateComponent(
                        status="error", message="Failed to save memory", detail=str(e)
                    ),
                    simple_component=None,
                ),
                error=str(e),
            )


class SearchSavedCorrectToolUsesTool(Tool[SearchSavedCorrectToolUsesParams]):
    """Tool for searching saved tool usage patterns."""

    @property
    def name(self) -> str:
        return "search_saved_correct_tool_uses"

    @property
    def description(self) -> str:
        return "Search for similar tool usage patterns based on a question"
    
    @property
    def access_groups(self) -> List[str]:
        return []

    def get_args_schema(self) -> Type[SearchSavedCorrectToolUsesParams]:
        return SearchSavedCorrectToolUsesParams

    async def execute(
        self, context: ToolContext, args: SearchSavedCorrectToolUsesParams
    ) -> ToolResult:
        """Search for similar tool usage patterns."""
        try:
            question = _get_canonical_question(context, args.question)
            results = await context.agent_memory.search_similar_usage(
                question=question,
                context=context,
                limit=args.limit or 10,
                similarity_threshold=args.similarity_threshold or 0.7,
                tool_name_filter=args.tool_name_filter,
            )

            if not results:
                if _agent_memory_is_degraded(context.agent_memory):
                    no_results_msg = (
                        "Agent memory is unavailable, so no historical tool usage patterns were searched."
                    )
                    ui_component = UiComponent(
                        rich_component=StatusBarUpdateComponent(
                            status="idle",
                            message="Memory unavailable",
                            detail="Skipped memory search",
                        ),
                        simple_component=None,
                    )
                    return ToolResult(
                        success=True,
                        result_for_llm=no_results_msg,
                        ui_component=ui_component,
                    )

                no_results_msg = (
                    "No similar tool usage patterns found for this question."
                )

                # Check if user has access to detailed memory results
                ui_features_available = context.metadata.get(
                    "ui_features_available", []
                )
                show_detailed_results = (
                    UiFeature.UI_FEATURE_SHOW_MEMORY_DETAILED_RESULTS
                    in ui_features_available
                )

                # Create UI component based on access level
                if show_detailed_results:
                    # Admin view: Show card indicating 0 results
                    ui_component = UiComponent(
                        rich_component=CardComponent(
                            title="🧠 Memory Search: 0 Results",
                            content="No similar tool usage patterns found for this question.\n\nSearched agent memory with no matches.",
                            icon="🔍",
                            status="info",
                            collapsible=True,
                            collapsed=True,
                            markdown=True,
                        ),
                        simple_component=None,
                    )
                else:
                    # Non-admin view: Simple status message
                    ui_component = UiComponent(
                        rich_component=StatusBarUpdateComponent(
                            status="idle",
                            message="No similar patterns found",
                            detail="Searched agent memory",
                        ),
                        simple_component=None,
                    )

                return ToolResult(
                    success=True,
                    result_for_llm=no_results_msg,
                    ui_component=ui_component,
                )

            # Format results for LLM
            results_text = f"Found {len(results)} similar tool usage pattern(s):\n\n"
            for i, result in enumerate(results, 1):
                memory = result.memory
                results_text += f"{i}. {memory.tool_name} (similarity: {result.similarity_score:.2f})\n"
                results_text += f"   Question: {memory.question}\n"
                results_text += f"   Args: {memory.args}\n\n"

            logger.info(f"Agent memory search results: {results_text.strip()}")

            # Check if user has access to detailed memory results
            ui_features_available = context.metadata.get("ui_features_available", [])
            show_detailed_results = (
                UiFeature.UI_FEATURE_SHOW_MEMORY_DETAILED_RESULTS
                in ui_features_available
            )

            # Create UI component based on access level
            if show_detailed_results:
                # Admin view: Show detailed results in collapsible card
                detailed_content = "**Retrieved memories passed to LLM:**\n\n"
                for i, result in enumerate(results, 1):
                    memory = result.memory
                    detailed_content += f"**{i}. {memory.tool_name}** (similarity: {result.similarity_score:.2f})\n"
                    detailed_content += f"- **Question:** {memory.question}\n"
                    detailed_content += f"- **Arguments:** `{memory.args}`\n"
                    if memory.timestamp:
                        detailed_content += f"- **Timestamp:** {memory.timestamp}\n"
                    if memory.memory_id:
                        detailed_content += f"- **ID:** `{memory.memory_id}`\n"
                    detailed_content += "\n"

                ui_component = UiComponent(
                    rich_component=CardComponent(
                        title=f"🧠 Memory Search: {len(results)} Result(s)",
                        content=detailed_content.strip(),
                        icon="🔍",
                        status="info",
                        collapsible=True,
                        collapsed=True,  # Start collapsed to avoid clutter
                        markdown=True,  # Render content as markdown
                    ),
                    simple_component=None,
                )
            else:
                # Non-admin view: Simple status message
                ui_component = UiComponent(
                    rich_component=StatusBarUpdateComponent(
                        status="success",
                        message=f"Found {len(results)} similar pattern(s)",
                        detail="Retrieved from agent memory",
                    ),
                    simple_component=None,
                )

            return ToolResult(
                success=True,
                result_for_llm=results_text.strip(),
                ui_component=ui_component,
            )

        except Exception as e:
            error_message = f"Failed to search memories: {str(e)}"
            return ToolResult(
                success=False,
                result_for_llm=error_message,
                ui_component=UiComponent(
                    rich_component=StatusBarUpdateComponent(
                        status="error", message="Failed to search memory", detail=str(e)
                    ),
                    simple_component=None,
                ),
                error=str(e),
            )


class SaveTextMemoryTool(Tool[SaveTextMemoryParams]):
    """Tool for saving free-form text memories."""

    @property
    def name(self) -> str:
        return "save_text_memory"

    @property
    def description(self) -> str:
        return "Save free-form text memory for important insights, observations, or context"
    
    @property
    def access_groups(self) -> List[str]:
        return []

    def get_args_schema(self) -> Type[SaveTextMemoryParams]:
        return SaveTextMemoryParams

    async def execute(
        self, context: ToolContext, args: SaveTextMemoryParams
    ) -> ToolResult:
        """Save a text memory to agent memory."""
        try:
            text_memory = await context.agent_memory.save_text_memory(
                content=args.content, context=context
            )

            text_memory_id = getattr(text_memory, "memory_id", None)
            if _agent_memory_is_degraded(context.agent_memory) or not text_memory_id:
                return ToolResult(
                    success=True,
                    result_for_llm=(
                        "Agent memory is unavailable, so this text memory was not saved."
                    ),
                    ui_component=UiComponent(
                        rich_component=StatusBarUpdateComponent(
                            status="idle",
                            message="Memory unavailable",
                            detail="Skipped saving text memory",
                        ),
                        simple_component=None,
                    ),
                )

            success_msg = (
                f"Successfully saved text memory with ID: {text_memory.memory_id}"
            )
            return ToolResult(
                success=True,
                result_for_llm=success_msg,
                ui_component=UiComponent(
                    rich_component=StatusBarUpdateComponent(
                        status="success",
                        message="Saved text memory",
                        detail=f"ID: {text_memory.memory_id}",
                    ),
                    simple_component=None,
                ),
            )

        except Exception as e:
            error_message = f"Failed to save text memory: {str(e)}"
            return ToolResult(
                success=False,
                result_for_llm=error_message,
                ui_component=UiComponent(
                    rich_component=StatusBarUpdateComponent(
                        status="error",
                        message="Failed to save text memory",
                        detail=str(e),
                    ),
                    simple_component=None,
                ),
                error=str(e),
            )
