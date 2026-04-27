"""
Default error recovery strategy implementations.

This module provides common error recovery strategies such as
exponential backoff for retries.
"""

import random
from typing import TYPE_CHECKING

from .base import ErrorRecoveryStrategy
from .models import RecoveryAction, RecoveryActionType

if TYPE_CHECKING:
    from ..tool.models import ToolContext
    from ..llm import LlmRequest


class ExponentialBackoffStrategy(ErrorRecoveryStrategy):
    """Error recovery strategy with exponential backoff for retries.

    This strategy implements exponential backoff for handling transient failures:
    - Attempt 1: Wait 1s before retry
    - Attempt 2: Wait 2s before retry
    - Attempt 3: Wait 4s before retry
    - ... and so on

    The strategy includes optional jitter to prevent thundering herd
    when multiple clients retry simultaneously.

    Example:
        # Basic usage
        strategy = ExponentialBackoffStrategy()

        # Custom configuration
        strategy = ExponentialBackoffStrategy(
            max_retries=5,
            base_delay_ms=500,
            max_delay_ms=30000,
            include_jitter=True,
        )

        agent = Agent(
            error_recovery_strategy=strategy,
            ...
        )
    """

    def __init__(
        self,
        max_retries: int = 3,
        base_delay_ms: int = 1000,
        max_delay_ms: int = 30000,
        include_jitter: bool = True,
    ):
        """Initialize the exponential backoff strategy.

        Args:
            max_retries: Maximum number of retry attempts before failing.
                        Default is 3.
            base_delay_ms: Base delay in milliseconds for the first retry.
                          The delay doubles with each attempt: base * 2^attempt.
                          Default is 1000ms (1 second).
            max_delay_ms: Maximum delay cap in milliseconds. Prevents excessively
                         long waits. Default is 30000ms (30 seconds).
            include_jitter: If True, adds random jitter to the delay to prevent
                          thundering herd problems. Default is True.
        """
        self.max_retries = max_retries
        self.base_delay_ms = base_delay_ms
        self.max_delay_ms = max_delay_ms
        self.include_jitter = include_jitter

    def _calculate_delay(self, attempt: int) -> int:
        """Calculate the delay for a given attempt number.

        Args:
            attempt: The current attempt number (1-indexed)

        Returns:
            Delay in milliseconds before the next retry
        """
        # Calculate exponential delay
        delay = self.base_delay_ms * (2 ** attempt)

        # Cap at max delay
        delay = min(delay, self.max_delay_ms)

        # Add jitter if enabled (random value between 50% and 100% of delay)
        if self.include_jitter:
            jitter_range = delay // 2
            if jitter_range > 0:
                delay = delay - random.randint(0, jitter_range)

        return delay

    async def handle_tool_error(
        self, error: Exception, context: "ToolContext", attempt: int = 1
    ) -> RecoveryAction:
        """Handle errors during tool execution with exponential backoff.

        Args:
            error: The exception that occurred
            context: Tool execution context
            attempt: Current attempt number (1-indexed)

        Returns:
            RecoveryAction indicating whether to retry or fail
        """
        if attempt >= self.max_retries:
            return RecoveryAction(
                action=RecoveryActionType.FAIL,
                message=f"Tool error after {attempt} attempts: {str(error)}",
            )

        delay = self._calculate_delay(attempt)

        return RecoveryAction(
            action=RecoveryActionType.RETRY,
            retry_delay_ms=delay,
            message=f"Retrying tool after {delay}ms (attempt {attempt + 1}/{self.max_retries})",
        )

    async def handle_llm_error(
        self, error: Exception, request: "LlmRequest", attempt: int = 1
    ) -> RecoveryAction:
        """Handle errors during LLM communication with exponential backoff.

        Args:
            error: The exception that occurred
            request: The LLM request that failed
            attempt: Current attempt number (1-indexed)

        Returns:
            RecoveryAction indicating whether to retry or fail
        """
        if attempt >= self.max_retries:
            return RecoveryAction(
                action=RecoveryActionType.FAIL,
                message=f"LLM error after {attempt} attempts: {str(error)}",
            )

        delay = self._calculate_delay(attempt)

        return RecoveryAction(
            action=RecoveryActionType.RETRY,
            retry_delay_ms=delay,
            message=f"Retrying LLM request after {delay}ms (attempt {attempt + 1}/{self.max_retries})",
        )
