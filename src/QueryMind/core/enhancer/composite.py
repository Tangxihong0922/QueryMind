from __future__ import annotations
"""
Composite LLM Context Enhancer.

This module provides a CompositeLlmContextEnhancer that combines multiple
LlmContextEnhancer instances, allowing them to be used together as a single enhancer.
"""

from typing import TYPE_CHECKING, List

from .base import LlmContextEnhancer

import logging

logger = logging.getLogger(__name__)

if TYPE_CHECKING:
    from ..user.models import User
    from ..llm.models import LlmMessage


class CompositeLlmContextEnhancer(LlmContextEnhancer):
    """
    A LlmContextEnhancer that combines multiple enhancers into one.
    
    The composite enhancer processes enhancers in order, passing the output
    of each enhancer to the next one as input.
    
    Example:
        # Simple list initialization
        agent = Agent(
            llm_context_enhancer=CompositeLlmContextEnhancer([
                SchemaContextEnhancer(),
                DefaultLlmContextEnhancer(agent_memory),
            ])
        )
        
        # Or use chainable add() method
        agent = Agent(
            llm_context_enhancer=(
                CompositeLlmContextEnhancer()
                .add(SchemaContextEnhancer())
                .add(DefaultLlmContextEnhancer(agent_memory))
            )
        )
    """

    def __init__(self, enhancers: List[LlmContextEnhancer] = None):
        """
        Initialize the composite enhancer.
        
        Args:
            enhancers: Optional list of LlmContextEnhancer instances to add initially.
        """
        self._enhancers: List[LlmContextEnhancer] = enhancers or []

    def add(self, enhancer: LlmContextEnhancer) -> "CompositeLlmContextEnhancer":
        """
        Add an enhancer to the composite.
        
        Args:
            enhancer: LlmContextEnhancer instance to add.
            
        Returns:
            Self for method chaining.
        """
        self._enhancers.append(enhancer)
        return self

    async def enhance_system_prompt(
        self,
        system_prompt: str,
        user_message: str,
        user: "User",
    ) -> str:
        """
        Enhance system prompt using all registered enhancers in order.
        
        Each enhancer's output is passed to the next enhancer as input.
        
        Args:
            system_prompt: The original system prompt
            user_message: The initial user message
            user: The user making the request
            
        Returns:
            Enhanced system prompt after all enhancers have processed it
        """
        result = system_prompt
        for enhancer in self._enhancers:
            try:
                result = await enhancer.enhance_system_prompt(result, user_message, user)
            except Exception as exc:
                logger.warning(
                    "Skipping system-prompt enhancer %s after error: %s",
                    enhancer.__class__.__name__,
                    exc,
                )
        return result

    async def enhance_user_messages(
        self,
        messages: List["LlmMessage"],
        user: "User",
    ) -> List["LlmMessage"]:
        """
        Enhance user messages using all registered enhancers in order.
        
        Each enhancer's output is passed to the next enhancer as input.
        
        Args:
            messages: The list of messages to enhance
            user: The user making the request
            
        Returns:
            Enhanced list of messages after all enhancers have processed it
        """
        result = messages
        for enhancer in self._enhancers:
            try:
                result = await enhancer.enhance_user_messages(result, user)
            except Exception as exc:
                logger.warning(
                    "Skipping message enhancer %s after error: %s",
                    enhancer.__class__.__name__,
                    exc,
                )
        return result
