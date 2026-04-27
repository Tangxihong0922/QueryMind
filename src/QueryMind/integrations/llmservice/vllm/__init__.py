"""
vLLM integration.

This module provides vLLM LLM service implementation for local model inference.
vLLM provides an OpenAI-compatible API for high-throughput LLM serving.
"""

from .llm import VllmLlmService

__all__ = ["VllmLlmService"]
