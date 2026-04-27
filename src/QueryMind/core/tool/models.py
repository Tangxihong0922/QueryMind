from __future__ import annotations
"""
Tool domain models.

This module contains data models for tool execution.
"""

from typing import TYPE_CHECKING, Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field

# Import AgentMemory at runtime for Pydantic model resolution
from QueryMind.capabilities.agent_memory import AgentMemory

# Import all types used in field annotations at runtime
# This ensures Pydantic can resolve types correctly during model creation
from ..user.models import User
from ..observability import ObservabilityProvider
from ...capabilities.schema_memory import SchemaMemory
from ...capabilities.schema_management import SchemaManagementService


# For types with circular dependencies, import lazily in methods
if TYPE_CHECKING:
    from ..components import UiComponent


class ToolCall(BaseModel):
    """Represents a tool call from the LLM."""

    id: str = Field(description="Unique identifier for this tool call")
    name: str = Field(description="Name of the tool to execute")
    arguments: Dict[str, Any] = Field(description="Raw arguments from LLM")


class ToolContext(BaseModel):
    """Context passed to all tool executions."""

    # Allow arbitrary types (like ABC subclasses AgentMemory) to be used
    model_config = ConfigDict(arbitrary_types_allowed=True)

    user: User
    conversation_id: str
    request_id: str = Field(description="Unique request identifier for tracing")
    raw_user_message: Optional[str] = Field(
        default=None,
        description="Original user message for the current turn, if available",
    )
    agent_memory: AgentMemory = Field(
        description="Agent memory for tool usage learning"
    )
    metadata: Dict[str, Any] = Field(default_factory=dict)
    observability_provider: Optional[ObservabilityProvider] = Field(
        default=None,
        description="Optional observability provider for metrics and spans",
    )
    # Schema capabilities for table schema retrieval and management
    schema_memory: Optional[SchemaMemory] = Field(
        default=None,
        description="Schema memory for table schema storage and retrieval",
    )
    schema_management_service: Optional[SchemaManagementService] = Field(
        default=None,
        description="Schema management service for admin operations",
    )
    # Schema search default parameters (used for UI rendering)
    schema_search_default_limit: int = Field(
        default=10,
        description="Default maximum number of tables to return in schema search",
    )
    schema_search_default_threshold: float = Field(
        default=0.4,
        description="Default vector similarity threshold for schema search",
    )
    schema_search_default_mode: str = Field(
        default="hybrid",
        description="Default search mode: hybrid, vector, graph, or expand",
    )


class ToolResult(BaseModel):
    """Result from tool execution.

    Changes:
    - `result_for_llm`: string that will be sent back to the LLM.
    - `ui_component`: optional UI payload for rendering in clients.
    """

    success: bool = Field(description="Whether execution succeeded")
    result_for_llm: str = Field(description="String content to send back to the LLM")
    ui_component: Optional["UiComponent"] = Field(
        default=None, description="Optional UI component for rendering"
    )
    error: Optional[str] = Field(default=None, description="Error message if failed")
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ToolSchema(BaseModel):
    """Schema describing a tool for LLM consumption."""

    name: str = Field(description="Tool name")
    description: str = Field(description="What this tool does")
    parameters: Dict[str, Any] = Field(description="JSON Schema of parameters")
    access_groups: List[str] = Field(
        default_factory=list, description="Groups permitted to access this tool"
    )


class ToolRejection(BaseModel):
    """Indicates tool execution should be rejected with a message.

    Used by transform_args to reject tool execution when arguments
    cannot be appropriately transformed for the user's context.
    """

    reason: str = Field(
        description="Explanation of why the tool execution was rejected"
    )


# Resolve forward references eagerly so runtime ToolResult construction works
# even when modules are imported through different package paths.
from ..components import UiComponent  # noqa: E402

ToolResult.model_rebuild(_types_namespace={"UiComponent": UiComponent})
