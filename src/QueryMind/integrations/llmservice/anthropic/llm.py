"""
Anthropic LLM service implementation.

Implements the LlmService interface using Anthropic's Messages API
(anthropic>=0.8.0). Supports non-streaming and streaming text output.
Tool-calls (tool_use blocks) are surfaced at the end of a stream or after a
non-streaming call as ToolCall entries.
"""

from __future__ import annotations

import asyncio
import logging
import os
from typing import Any, AsyncGenerator, Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)

from QueryMind.core.llm import (
    LlmService,
    LlmRequest,
    LlmResponse,
    LlmStreamChunk,
)
from QueryMind.core.recovery.base import ErrorRecoveryStrategy
from QueryMind.core.recovery.models import RecoveryActionType
from QueryMind.core.tool import ToolCall, ToolSchema


class AnthropicLlmService(LlmService):
    """Anthropic Messages-backed LLM service.

    Args:
        model: Anthropic model name (e.g., "claude-sonnet-4-5", "claude-opus-4").
            Defaults to "claude-sonnet-4-5". Can also be set via ANTHROPIC_MODEL env var.
        api_key: API key; falls back to env `ANTHROPIC_API_KEY`.
        base_url: Optional custom base URL; env `ANTHROPIC_BASE_URL` if unset.
        extra_client_kwargs: Extra kwargs forwarded to `anthropic.Anthropic()`.
    """

    def __init__(
        self,
        model: Optional[str] = None,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
        error_recovery_strategy: Optional[ErrorRecoveryStrategy] = None,
        default_output_config: Optional[Dict[str, Any]] = None,
        **extra_client_kwargs: Any,
    ) -> None:
        try:
            import anthropic
        except Exception as e:  # pragma: no cover
            raise ImportError(
                "anthropic package is required. Install with: pip install 'vanna[anthropic]'"
            ) from e

        # Model selection - use environment variable or default
        self.model = model or os.getenv("ANTHROPIC_MODEL", "MiniMax-M2.7")
        api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        base_url = base_url or os.getenv("ANTHROPIC_BASE_URL", "https://api.minimaxi.com/anthropic")
        self._error_recovery_strategy = error_recovery_strategy
        self.default_output_config = default_output_config

        client_kwargs: Dict[str, Any] = {**extra_client_kwargs}
        if api_key:
            client_kwargs["api_key"] = api_key
        if base_url:
            client_kwargs["base_url"] = base_url

        self._client = anthropic.Anthropic(**client_kwargs)

    async def send_request(self, request: LlmRequest) -> LlmResponse:
        """Send a non-streaming request to Anthropic and return the response."""
        payload = self._build_payload(request)
        resp = await self._create_message_with_recovery(payload, request)

        text_content, tool_calls = self._parse_message_content(resp)

        usage: Dict[str, int] = {}
        if getattr(resp, "usage", None):
            try:
                usage = {
                    "input_tokens": int(resp.usage.input_tokens),
                    "output_tokens": int(resp.usage.output_tokens),
                }
            except Exception:
                pass

        logger.debug(
            "Anthropic response received: model=%s stop_reason=%s input_tokens=%s output_tokens=%s tool_calls=%s",
            getattr(resp, "model", self.model),
            getattr(resp, "stop_reason", None),
            usage.get("input_tokens"),
            usage.get("output_tokens"),
            len(tool_calls or []),
        )
        logger.debug("Anthropic raw response: %s", resp)

        return LlmResponse(
            content=text_content or None,
            tool_calls=tool_calls or None,
            finish_reason=getattr(resp, "stop_reason", None),
            usage=usage or None,
        )

    async def _create_message_with_recovery(
        self,
        payload: Dict[str, Any],
        request: LlmRequest,
    ) -> Any:
        """Create a message with optional strategy-driven retries."""
        if self._error_recovery_strategy is None:
            return await asyncio.to_thread(self._client.messages.create, **payload)

        attempt = 1
        while True:
            try:
                return await asyncio.to_thread(self._client.messages.create, **payload)
            except Exception as exc:
                action = await self._error_recovery_strategy.handle_llm_error(
                    exc,
                    request,
                    attempt=attempt,
                )
                if action.action != RecoveryActionType.RETRY:
                    logger.warning(
                        "Anthropic request failed after %s attempt(s): %s",
                        attempt,
                        exc,
                    )
                    raise

                delay_ms = max(0, int(action.retry_delay_ms or 0))
                logger.debug(
                    "Anthropic transient error (attempt %s): %s; retrying in %.2fs",
                    attempt,
                    exc,
                    delay_ms / 1000.0,
                )
                if delay_ms > 0:
                    await asyncio.sleep(delay_ms / 1000.0)
                attempt += 1

    async def stream_request(
        self, request: LlmRequest
    ) -> AsyncGenerator[LlmStreamChunk, None]:
        """Stream a request to Anthropic.

        Yields text chunks as they arrive. Emits tool-calls at the end by
        inspecting the final message.
        """
        payload = self._build_payload(request)

        logger.debug("Anthropic streaming payload prepared")

        # SDK provides a streaming context manager with a text_stream iterator.
        with self._client.messages.stream(**payload) as stream:
            for text in stream.text_stream:
                if text:
                    yield LlmStreamChunk(content=text)

            final = stream.get_final_message()
            _, tool_calls = self._parse_message_content(final)
            logger.info(
                "Anthropic stream completed: model=%s stop_reason=%s tool_calls=%s",
                getattr(final, "model", self.model),
                getattr(final, "stop_reason", None),
                len(tool_calls or []),
            )
            logger.debug("Anthropic raw stream response: %s", final)
            if tool_calls:
                yield LlmStreamChunk(
                    tool_calls=tool_calls,
                    finish_reason=getattr(final, "stop_reason", None),
                )
            else:
                yield LlmStreamChunk(
                    finish_reason=getattr(final, "stop_reason", None) or "stop"
                )

    async def validate_tools(self, tools: List[ToolSchema]) -> List[str]:
        """Basic validation of tool schemas for Anthropic."""
        errors: List[str] = []
        for t in tools:
            if not t.name:
                errors.append("Tool name is required")
        return errors

    # Internal helpers
    def _build_payload(self, request: LlmRequest) -> Dict[str, Any]:
        # Anthropic requires messages content as list of content blocks per message
        # We need to group consecutive tool messages into single user messages
        messages: List[Dict[str, Any]] = []
        i = 0

        while i < len(request.messages):
            m = request.messages[i]

            if m.role == "tool":
                # Group consecutive tool messages into one user message
                tool_content_blocks = []
                while i < len(request.messages) and request.messages[i].role == "tool":
                    tool_msg = request.messages[i]
                    if tool_msg.tool_call_id:
                        tool_content_blocks.append(
                            {
                                "type": "tool_result",
                                "tool_use_id": tool_msg.tool_call_id,
                                "content": tool_msg.content,
                            }
                        )
                    i += 1

                if tool_content_blocks:
                    messages.append(
                        {
                            "role": "user",
                            "content": tool_content_blocks,
                        }
                    )
            else:
                # Handle non-tool messages normally
                content_blocks = []

                # Handle text content - only add if not empty
                if m.content and m.content.strip():
                    content_blocks.append({"type": "text", "text": m.content})

                # Handle tool_calls for assistant messages (convert to tool_use blocks)
                if m.role == "assistant" and m.tool_calls:
                    for tc in m.tool_calls:
                        content_blocks.append(
                            {
                                "type": "tool_use",
                                "id": tc.id,
                                "name": tc.name,
                                "input": tc.arguments,  # type: ignore[dict-item]
                            }
                        )

                # Ensure we have at least one content block for text messages
                if not content_blocks and m.role in {"user", "assistant"}:
                    content_blocks.append({"type": "text", "text": m.content or ""})

                if content_blocks:
                    role = m.role if m.role in {"user", "assistant"} else "user"
                    messages.append(
                        {
                            "role": role,
                            "content": content_blocks,
                        }
                    )

                i += 1

        tools_payload: Optional[List[Dict[str, Any]]] = None
        if request.tools:
            tools_payload = [
                {
                    "name": t.name,
                    "description": t.description,
                    "input_schema": t.parameters,
                }
                for t in request.tools
            ]

        payload: Dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            # Anthropic requires max_tokens; default if not provided
            "max_tokens": request.max_tokens if request.max_tokens is not None else 512,
            "temperature": request.temperature,
        }
        if tools_payload:
            payload["tools"] = tools_payload
            payload["tool_choice"] = {"type": "auto"}

        # Add system prompt if provided
        if request.system_prompt:
            payload["system"] = request.system_prompt

        if self.default_output_config:
            payload["output_config"] = self.default_output_config

        return payload

    def _parse_message_content(self, msg: Any) -> Tuple[str, List[ToolCall]]:
        text_parts: List[str] = []
        tool_calls: List[ToolCall] = []

        content_list = getattr(msg, "content", []) or []
        for block in content_list:
            btype = getattr(block, "type", None) or (
                block.get("type") if isinstance(block, dict) else None
            )
            if btype == "text":
                # SDK returns block.text for typed object; dict uses {"text": ...}
                text = getattr(block, "text", None)
                if text is None and isinstance(block, dict):
                    text = block.get("text")
                if text:
                    text_parts.append(str(text))
            elif btype == "tool_use":
                # Tool call with name and input
                name = getattr(block, "name", None) or (
                    block.get("name") if isinstance(block, dict) else None
                )
                tc_id = getattr(block, "id", None) or (
                    block.get("id") if isinstance(block, dict) else None
                )
                input_data = getattr(block, "input", None) or (
                    block.get("input") if isinstance(block, dict) else None
                )
                if name:
                    try:
                        # input_data should be a dict already
                        args = (
                            input_data
                            if isinstance(input_data, dict)
                            else {"_raw": input_data}
                        )
                    except Exception:
                        args = {"_raw": str(input_data)}
                    tool_calls.append(
                        ToolCall(
                            id=str(tc_id or "tool_call"), name=str(name), arguments=args
                        )
                    )

        text_content = "".join(text_parts)
        return text_content, tool_calls
