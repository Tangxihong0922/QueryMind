"""
Framework-agnostic chat handling logic for QueryMind.
"""

import os
import uuid
from typing import AsyncGenerator, List, Optional, TYPE_CHECKING

from .models import ChatRequest, ChatResponse, ChatStreamChunk

if TYPE_CHECKING:
    from ...core.agent.agent import Agent
    from ...core.user.request_context import RequestContext


def _env_bool(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


class ChatHandler:
    """Core chat handling logic - framework agnostic."""

    def __init__(
        self,
        agent: "Agent",
    ):
        """Initialize chat handler.

        Args:
            agent: The agent to handle chat requests
        """
        self.agent = agent

    def _create_request_context(
        self,
        conversation_id: str,
        request_id: str,
        metadata: Optional[dict] = None,
    ) -> "RequestContext":
        """Create RequestContext from metadata.
        
        Args:
            conversation_id: Conversation ID
            request_id: Request ID
            metadata: Optional metadata dict
            
        Returns:
            RequestContext instance
        """
        from ...core.user.request_context import RequestContext
        
        metadata = dict(metadata or {})
        metadata["allow_metadata_query"] = _env_bool("ALLOW_METADATA_QUERY", False)
        user_info = metadata.get("user") if metadata else None
        
        return RequestContext(
            metadata=metadata,
            user=user_info,
            conversation_id=conversation_id,
            request_id=request_id,
        )

    async def handle_stream(
        self, request: ChatRequest
    ) -> AsyncGenerator[ChatStreamChunk, None]:
        """Stream chat responses.

        Args:
            request: Chat request

        Yields:
            Chat stream chunks
        """
        conversation_id = request.conversation_id or self._generate_conversation_id()
        request_id = request.request_id or str(uuid.uuid4())

        # Create RequestContext from metadata
        request_context = self._create_request_context(
            conversation_id=conversation_id,
            request_id=request_id,
            metadata=request.metadata,
        )

        # Call agent.send_message with correct interface
        async for component in self.agent.send_message(
            request_context=request_context,
            message=request.message,
            conversation_id=conversation_id,
        ):
            yield ChatStreamChunk.from_component(component, conversation_id, request_id)

    async def handle_poll(self, request: ChatRequest) -> ChatResponse:
        """Handle polling-based chat.

        Args:
            request: Chat request

        Returns:
            Complete chat response
        """
        chunks = []
        async for chunk in self.handle_stream(request):
            chunks.append(chunk)

        return ChatResponse.from_chunks(chunks)

    def _generate_conversation_id(self) -> str:
        """Generate new conversation ID."""
        return f"conv_{uuid.uuid4().hex[:8]}"
