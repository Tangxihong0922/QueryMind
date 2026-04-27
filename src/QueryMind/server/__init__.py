"""
QueryMind Server - FastAPI server implementation for QueryMind Agents.

This module provides the FastAPI server factory for serving
QueryMind agents over HTTP with SSE, WebSocket, and polling endpoints.

Example:
    >>> from QueryMind.core.agent import Agent
    >>> from QueryMind.server.fastapi import QueryMindFastAPIServer
    >>> 
    >>> server = QueryMindFastAPIServer(agent)
    >>> server.run()
"""

from .base import ChatRequest, ChatStreamChunk, ChatResponse, ChatHandler
from .fastapi import QueryMindFastAPIServer

__all__ = [
    "ChatHandler",
    "ChatRequest", 
    "ChatStreamChunk",
    "ChatResponse",
    "QueryMindFastAPIServer",
]
