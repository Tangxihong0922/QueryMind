"""
Request and response models for QueryMind server endpoints.
"""

import time
import uuid
from typing import Any, Dict, List, Optional, Union

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """Request model for chat endpoints."""

    message: str = Field(description="User message")
    conversation_id: Optional[str] = Field(default=None, description="Conversation ID")
    request_id: Optional[str] = Field(
        default=None, description="Request ID for tracing"
    )
    metadata: Dict[str, Any] = Field(
        default_factory=dict, description="Additional metadata"
    )


class ChatStreamChunk(BaseModel):
    """Single chunk in a streaming chat response."""

    rich: Dict[str, Any] = Field(description="Rich component data for advanced UIs")
    simple: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Simple component data for basic UIs",
        exclude=True,
    )

    # Stream metadata
    conversation_id: str = Field(description="Conversation ID")
    request_id: str = Field(description="Request ID")
    timestamp: float = Field(default_factory=time.time, description="Timestamp")

    @classmethod
    def from_component(
        cls,
        component: Any,
        conversation_id: str,
        request_id: str,
    ) -> "ChatStreamChunk":
        """Create chunk from UI component or rich component.
        
        Handles UiComponent specially by extracting the nested rich_component
        and serializing it correctly for the frontend.
        """
        
        # Special handling for UiComponent - it wraps rich_component and simple_component
        # We need to extract and serialize the nested components correctly
        if hasattr(component, 'rich_component') and hasattr(component, 'simple_component'):
            # This is UiComponent - extract and serialize the nested components
            rich_comp = component.rich_component
            
            # Serialize the rich component
            if hasattr(rich_comp, 'serialize_for_frontend'):
                rich_data = rich_comp.serialize_for_frontend()
            elif hasattr(rich_comp, 'model_dump'):
                rich_data = rich_comp.model_dump()
            else:
                rich_data = rich_comp if isinstance(rich_comp, dict) else {'data': str(rich_comp)}
            # The current webcomponent chat UI renders the rich component directly.
            # Keeping the legacy simple payload in the stream can produce duplicate
            # fallback cards (often labeled "INFO"), so omit it here.
            simple_data = None
        elif hasattr(component, 'serialize_for_frontend'):
            # Has serialization method (e.g., RichComponent)
            rich_data = component.serialize_for_frontend()
            simple_data = None
        elif hasattr(component, 'model_dump'):
            # Pydantic model without serialize_for_frontend
            rich_data = component.model_dump()
            simple_data = None
        else:
            # Raw dict or object
            rich_data = component if isinstance(component, dict) else {'data': str(component)}
            simple_data = None

        return cls(
            rich=rich_data,
            simple=simple_data,
            conversation_id=conversation_id,
            request_id=request_id,
        )

    @classmethod
    def from_dict(
        cls,
        data: Dict[str, Any],
        conversation_id: str,
        request_id: str,
    ) -> "ChatStreamChunk":
        """Create chunk from dictionary data."""
        return cls(
            rich=data.get('rich', data),
            simple=None,
            conversation_id=conversation_id,
            request_id=request_id,
        )


class ChatResponse(BaseModel):
    """Complete chat response for polling endpoints."""

    chunks: List[ChatStreamChunk] = Field(description="Response chunks")
    conversation_id: str = Field(description="Conversation ID")
    request_id: str = Field(description="Request ID")
    total_chunks: int = Field(description="Total number of chunks")

    @classmethod
    def from_chunks(cls, chunks: List[ChatStreamChunk]) -> "ChatResponse":
        """Create response from chunks."""
        if not chunks:
            return cls(chunks=[], conversation_id="", request_id="", total_chunks=0)

        return cls(
            chunks=chunks,
            conversation_id=chunks[0].conversation_id,
            request_id=chunks[0].request_id,
            total_chunks=len(chunks),
        )
