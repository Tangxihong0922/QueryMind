"""
Workflow handler system for deterministic workflow execution.

This module provides the WorkflowHandler interface for intercepting user messages
and executing deterministic workflows before they reach the LLM. This is useful
for command handling, pattern-based routing, and state-based workflows.
"""

from .base import WorkflowHandler, WorkflowResult
from .default import DefaultWorkflowHandler
from .schema_init_workflow import SchemaInitWorkflow
from .schema_management_workflow import SchemaManagementWorkflow
from .composite import CompositeWorkflowHandler

__all__ = [
    "WorkflowHandler", 
    "WorkflowResult", 
    "DefaultWorkflowHandler",
    "SchemaInitWorkflow",
    "SchemaManagementWorkflow",
    "CompositeWorkflowHandler",
]
