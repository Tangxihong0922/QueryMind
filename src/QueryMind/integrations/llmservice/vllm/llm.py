"""
vLLM LLM service implementation.

This module provides an implementation of the LlmService interface backed by
vLLM's OpenAI-compatible API. It supports non-streaming and streaming text
output. Tool/function calling is passed through when tools are provided.
"""

from __future__ import annotations

import json
import os
from typing import Any, AsyncGenerator, Dict, List, Optional

from QueryMind.core.llm import (
    LlmService,
    LlmRequest,
    LlmResponse,
    LlmStreamChunk,
)
from QueryMind.core.tool import ToolCall, ToolSchema


class VllmLlmService(LlmService):
    """vLLM-backed LLM service for local model inference.

    vLLM provides an OpenAI-compatible API, so this implementation is similar
    to OpenAILlmService but configured for local vLLM deployments.

    Args:
        model: vLLM model name (e.g., "meta-llama/Llama-3.1-8B-Instruct").
        host: vLLM server URL; defaults to "http://localhost:8000" or env `VLLM_HOST`.
        api_key: Optional API key for authentication; env `VLLM_API_KEY` if unset.
        timeout: Request timeout in seconds; defaults to 60.
        temperature: Sampling temperature; defaults to 0.7.
        max_tokens: Maximum tokens to generate; defaults to 512.
        extra_client_kwargs: Extra kwargs forwarded to the HTTP client.
    """

    def __init__(
        self,
        model: Optional[str] = None,
        host: Optional[str] = None,
        api_key: Optional[str] = None,
        timeout: float = 60.0,
        temperature: float = 0.7,
        max_tokens: int = 512,
        **extra_client_kwargs: Any,
    ) -> None:
        try:
            import httpx
        except Exception as e:  # pragma: no cover
            raise ImportError(
                "httpx package is required. Install with: pip install httpx"
            ) from e

        if not model:
            raise ValueError("model parameter is required for vLLM")

        self.model = model
        self.host = host or os.getenv("VLLM_HOST", "http://localhost:8000")
        self.api_key = api_key or os.getenv("VLLM_API_KEY")
        self.timeout = timeout
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.extra_client_kwargs = extra_client_kwargs

        # Create httpx client
        client_kwargs: Dict[str, Any] = {
            "timeout": httpx.Timeout(timeout),
            **extra_client_kwargs,
        }
        self._client = httpx.Client(**client_kwargs)

    def _get_headers(self) -> Dict[str, str]:
        """Build request headers."""
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        return headers

    async def send_request(self, request: LlmRequest) -> LlmResponse:
        """Send a non-streaming request to vLLM and return the response."""
        payload = self._build_payload(request, stream=False)

        url = f"{self.host}/v1/chat/completions"
        headers = self._get_headers()

        # Synchronous HTTP call in async context
        resp = self._client.post(url, json=payload, headers=headers)
        resp.raise_for_status()

        resp_data = resp.json()

        if not resp_data.get("choices"):
            return LlmResponse(content=None, tool_calls=None, finish_reason=None)

        choice = resp_data["choices"][0]
        message = choice.get("message", {})
        content = message.get("content")
        tool_calls = self._extract_tool_calls_from_message(message)

        usage: Dict[str, int] = {}
        if "usage" in resp_data:
            usage = {
                k: int(v) for k, v in resp_data["usage"].items() if v is not None
            }

        return LlmResponse(
            content=content,
            tool_calls=tool_calls or None,
            finish_reason=choice.get("finish_reason"),
            usage=usage or None,
        )

    async def stream_request(
        self, request: LlmRequest
    ) -> AsyncGenerator[LlmStreamChunk, None]:
        """Stream a request to vLLM.

        Emits `LlmStreamChunk` for textual deltas as they arrive. Tool-calls are
        accumulated and emitted in a final chunk when the stream ends.
        """
        payload = self._build_payload(request, stream=True)

        url = f"{self.host}/v1/chat/completions"
        headers = self._get_headers()

        # Use httpx streaming client
        with self._client.stream("POST", url, json=payload, headers=headers) as resp:
            resp.raise_for_status()

            tc_builders: Dict[int, Dict[str, Optional[str]]] = {}
            last_finish: Optional[str] = None

            # Process SSE stream line by line
            for line in resp.iter_lines():
                if not line:
                    continue
                if line.startswith("data: "):
                    line = line[6:]
                if line == "[DONE]":
                    break

                try:
                    chunk_data = json.loads(line)
                except json.JSONDecodeError:
                    continue

                # Check for no choices
                if not chunk_data.get("choices"):
                    continue

                choice = chunk_data["choices"][0]
                delta = choice.get("delta", {})
                if delta is None:
                    last_finish = choice.get("finish_reason", last_finish)
                    continue

                # Text content
                content_piece = delta.get("content")
                if content_piece:
                    yield LlmStreamChunk(content=content_piece)

                # Tool calls (streamed)
                streamed_tool_calls = delta.get("tool_calls")
                if streamed_tool_calls:
                    for tc in streamed_tool_calls:
                        idx = tc.get("index", 0) or 0
                        b = tc_builders.setdefault(
                            idx, {"id": None, "name": None, "arguments": ""}
                        )
                        if tc.get("id"):
                            b["id"] = tc["id"]
                        fn = tc.get("function", {})
                        if fn:
                            if fn.get("name"):
                                b["name"] = fn["name"]
                            if fn.get("arguments"):
                                b["arguments"] = (b["arguments"] or "") + fn["arguments"]

                last_finish = choice.get("finish_reason", last_finish)

        # Emit final tool-calls chunk if any
        final_tool_calls: List[ToolCall] = []
        for b in tc_builders.values():
            if not b.get("name"):
                continue
            args_raw = b.get("arguments") or "{}"
            try:
                loaded = json.loads(args_raw)
                if isinstance(loaded, dict):
                    args_dict: Dict[str, Any] = loaded
                else:
                    args_dict = {"args": loaded}
            except Exception:
                args_dict = {"_raw": args_raw}
            final_tool_calls.append(
                ToolCall(
                    id=b.get("id") or "tool_call",
                    name=b["name"] or "tool",
                    arguments=args_dict,
                )
            )

        if final_tool_calls:
            yield LlmStreamChunk(tool_calls=final_tool_calls, finish_reason=last_finish)
        else:
            yield LlmStreamChunk(finish_reason=last_finish or "stop")

    async def validate_tools(self, tools: List[ToolSchema]) -> List[str]:
        """Validate tool schemas. Returns a list of error messages."""
        errors: List[str] = []
        for t in tools:
            if not t.name:
                errors.append("Tool name is required")
            if len(t.name) > 64:
                errors.append(f"Tool name '{t.name}' exceeds 64 character limit")
        return errors

    # Internal helpers
    def _build_payload(self, request: LlmRequest, stream: bool = False) -> Dict[str, Any]:
        messages: List[Dict[str, Any]] = []

        # Add system prompt as first message if provided
        if request.system_prompt:
            messages.append({"role": "system", "content": request.system_prompt})

        for m in request.messages:
            msg: Dict[str, Any] = {"role": m.role, "content": m.content or ""}
            if m.role == "tool" and m.tool_call_id:
                msg["tool_call_id"] = m.tool_call_id
            elif m.role == "assistant" and m.tool_calls:
                # Convert tool calls to OpenAI format
                tool_calls_payload = []
                for tc in m.tool_calls:
                    tool_calls_payload.append(
                        {
                            "id": tc.id,
                            "type": "function",
                            "function": {
                                "name": tc.name,
                                "arguments": json.dumps(tc.arguments),
                            },
                        }
                    )
                msg["tool_calls"] = tool_calls_payload
            messages.append(msg)

        tools_payload: Optional[List[Dict[str, Any]]] = None
        if request.tools:
            tools_payload = [
                {
                    "type": "function",
                    "function": {
                        "name": t.name,
                        "description": t.description,
                        "parameters": t.parameters,
                    },
                }
                for t in request.tools
            ]

        payload: Dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            "temperature": request.temperature if request.temperature is not None else self.temperature,
            "stream": stream,
        }

        # Use max_tokens from request or fall back to instance default
        max_tokens = request.max_tokens if request.max_tokens is not None else self.max_tokens
        payload["max_tokens"] = max_tokens

        if tools_payload:
            payload["tools"] = tools_payload
            payload["tool_choice"] = "auto"

        return payload

    def _extract_tool_calls_from_message(self, message: Dict[str, Any]) -> List[ToolCall]:
        tool_calls: List[ToolCall] = []
        raw_tool_calls = message.get("tool_calls") or []
        for tc in raw_tool_calls:
            fn = tc.get("function", {})
            if not fn:
                continue
            args_raw = fn.get("arguments", "{}")
            try:
                loaded = json.loads(args_raw)
                if isinstance(loaded, dict):
                    args_dict: Dict[str, Any] = loaded
                else:
                    args_dict = {"args": loaded}
            except Exception:
                args_dict = {"_raw": args_raw}
            tool_calls.append(
                ToolCall(
                    id=tc.get("id", "tool_call"),
                    name=fn.get("name", "tool"),
                    arguments=args_dict,
                )
            )
        return tool_calls
