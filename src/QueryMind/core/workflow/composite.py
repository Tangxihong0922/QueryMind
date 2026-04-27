"""
Composite Workflow Handler.

This module provides a CompositeWorkflowHandler that combines multiple
WorkflowHandler instances, allowing them to be used together as a single handler.
"""

from typing import TYPE_CHECKING, List, Optional

from .base import WorkflowHandler, WorkflowResult

if TYPE_CHECKING:
    from ..agent.agent import Agent
    from ..user.models import User
    from ..storage import Conversation
    from ...components import UiComponent


class CompositeWorkflowHandler(WorkflowHandler):
    """
    A WorkflowHandler that combines multiple handlers into one.
    
    The composite handler processes handlers in order, returning the result
    from the first handler that handles the message (returns should_skip_llm=True).
    
    For get_starter_ui, all handlers' UI components are collected and merged.
    
    Example:
        # Simple list initialization
        agent = Agent(
            workflow_handler=CompositeWorkflowHandler([
                DefaultWorkflowHandler(),
                SchemaInitWorkflow(engine=...),
                SchemaManagementWorkflow(service=...),
            ])
        )
        
        # Or use chainable add() method
        agent = Agent(
            workflow_handler=(
                CompositeWorkflowHandler()
                .add(DefaultWorkflowHandler())
                .add(SchemaInitWorkflow(engine=...))
                .add(SchemaManagementWorkflow(service=...))
            )
        )
    """

    def __init__(self, handlers: List[WorkflowHandler] = None):
        """
        Initialize the composite handler.
        
        Args:
            handlers: Optional list of WorkflowHandler instances to add initially.
        """
        self._handlers: List[WorkflowHandler] = handlers or []

    def add(self, handler: WorkflowHandler) -> "CompositeWorkflowHandler":
        """
        Add a handler to the composite.
        
        Args:
            handler: WorkflowHandler instance to add.
            
        Returns:
            Self for method chaining.
        """
        self._handlers.append(handler)
        return self

    async def try_handle(
        self,
        agent: "Agent",
        user: "User",
        conversation: "Conversation",
        message: str,
    ) -> WorkflowResult:
        """
        Attempt to handle the message using registered handlers in order.
        
        The first handler that returns should_skip_llm=True will have its
        result returned. If no handler handles the message, returns
        WorkflowResult(should_skip_llm=False).
        
        Args:
            agent: Agent instance
            user: Current user
            conversation: Current conversation
            message: User message
            
        Returns:
            WorkflowResult from the first handler that handles the message,
            or WorkflowResult(should_skip_llm=False) if no handler handles it.
        """
        for handler in self._handlers:
            result = await handler.try_handle(agent, user, conversation, message)
            if result.should_skip_llm:
                return result
        return WorkflowResult(should_skip_llm=False)

    async def get_starter_ui(
        self,
        agent: "Agent",
        user: "User",
        conversation: "Conversation",
    ) -> Optional[List["UiComponent"]]:
        """
        Get starter UI from all registered handlers.
        
        Components from all handlers are collected and returned as a combined list.
        If no handler returns components, returns None.
        
        Args:
            agent: Agent instance
            user: Current user
            conversation: Current conversation
            
        Returns:
            Combined list of UI components from all handlers, or None if no components.
        """
        all_components: List["UiComponent"] = []
        
        for handler in self._handlers:
            try:
                components = await handler.get_starter_ui(agent, user, conversation)
                if components:
                    all_components.extend(components)
            except Exception:
                # Skip handlers that fail to provide starter UI
                pass
        
        return all_components if all_components else None
