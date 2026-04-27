"""
Core components of the QueryMind Agents framework.

This package contains the fundamental abstractions and implementations
that form the foundation of the agent framework.
"""

# Core domains - re-export from new structure
from .tool import T, Tool, ToolCall, ToolContext, ToolResult, ToolSchema
from .llm import LlmMessage, LlmRequest, LlmResponse, LlmService, LlmStreamChunk
from .storage import Conversation, ConversationStore, Message
from .user import User, UserService
from .agent import Agent, AgentConfig
from .agent import (
    SchemaGovernanceManager,
    SchemaGovernancePolicy,
    SchemaGovernanceStack,
    build_schema_governance_stack,
    SqlGovernanceManager,
    SqlGovernancePolicy,
    SqlGovernanceProfile,
    SqlGovernanceStack,
    analyze_sql_text,
    analyze_sql_shape,
    build_sql_governance_profile,
    build_sql_governance_prompt_block,
    build_sql_governance_recap_block,
    build_sql_governance_stack,
    infer_profile_from_message,
    parse_sql_governance_profile,
    sql_governance_rejection_reason,
    sql_semantics_rejection_reason,
)
from .system_prompt import DefaultSystemPromptBuilder, SystemPromptBuilder
from .hook import LifecycleHook
from .hook import SchemaGovernanceHook
from .hook import SqlGovernanceHook
from .middleware import LlmMiddleware
from .middleware import SchemaGovernanceMiddleware
from .middleware import SqlGovernanceMiddleware
from .workflow import WorkflowHandler, WorkflowResult, DefaultWorkflowHandler, CompositeWorkflowHandler
from .recovery import ErrorRecoveryStrategy, RecoveryAction, RecoveryActionType, ExponentialBackoffStrategy
from .enricher import ToolContextEnricher
from .enhancer import (
    LlmContextEnhancer,
    DefaultLlmContextEnhancer,
    CompositeLlmContextEnhancer,
    SchemaContextEnhancer,
    SchemaGovernanceEnhancer,
)
from .filter import ConversationFilter
from .observability import ObservabilityProvider, Span, Metric
from .audit import (
    AuditLogger,
    AuditEvent,
    AuditEventType,
    ToolAccessCheckEvent,
    ToolInvocationEvent,
    ToolResultEvent,
    UiFeatureAccessCheckEvent,
    AiResponseEvent,
)

# UI Components
from .components import UiComponent
from .rich_component import RichComponent
from ..components import (
    SimpleComponent,
    SimpleComponentType,
    SimpleImageComponent,
    SimpleLinkComponent,
    SimpleTextComponent,
    ArtifactComponent,
    BadgeComponent,
    CardComponent,
    DataFrameComponent,
    IconTextComponent,
    LogViewerComponent,
    NotificationComponent,
    ProgressBarComponent,
    ProgressDisplayComponent,
    RichTextComponent,
    StatusCardComponent,
    TaskListComponent,
)

# Exceptions
from .errors import (
    AgentError,
    ConversationNotFoundError,
    LlmServiceError,
    PermissionError,
    ToolExecutionError,
    ToolNotFoundError,
    ValidationError,
)

# Core implementations
from .registry import ToolRegistry

# # Evaluation framework
# from .evaluation import (
#     Evaluator,
#     TestCase,
#     ExpectedOutcome,
#     AgentResult,
#     EvaluationResult,
#     TestCaseResult,
#     AgentVariant,
#     EvaluationRunner,
#     TrajectoryEvaluator,
#     OutputEvaluator,
#     LLMAsJudgeEvaluator,
#     EfficiencyEvaluator,
#     EvaluationReport,
#     ComparisonReport,
#     EvaluationDataset,
# )

__all__ = [
    # Models
    "User",
    "Message",
    "Conversation",
    "ToolCall",
    "ToolResult",
    "ToolContext",
    "ToolSchema",
    "LlmMessage",
    "LlmRequest",
    "LlmResponse",
    "LlmStreamChunk",
    "RecoveryAction",
    "RecoveryActionType",
    "Span",
    "Metric",
    # Interfaces
    "Tool",
    "Agent",
    "LlmService",
    "ConversationStore",
    "UserService",
    "SystemPromptBuilder",
    "LifecycleHook",
    "SchemaGovernanceHook",
    "SqlGovernanceHook",
    "LlmMiddleware",
    "SchemaGovernanceMiddleware",
    "SqlGovernanceMiddleware",
    "WorkflowHandler",
    "DefaultWorkflowHandler",
    "WorkflowResult",
    "CompositeWorkflowHandler",
    "ErrorRecoveryStrategy",
    "ExponentialBackoffStrategy",
    "ToolContextEnricher",
    "LlmContextEnhancer",
    "DefaultLlmContextEnhancer",
    "CompositeLlmContextEnhancer",
    "SchemaContextEnhancer",
    "SchemaGovernanceEnhancer",
    "SchemaGovernancePolicy",
    "SchemaGovernanceManager",
    "SchemaGovernanceStack",
    "build_schema_governance_stack",
    "SqlGovernancePolicy",
    "SqlGovernanceManager",
    "SqlGovernanceProfile",
    "SqlGovernanceStack",
    "analyze_sql_text",
    "analyze_sql_shape",
    "build_sql_governance_profile",
    "build_sql_governance_prompt_block",
    "build_sql_governance_recap_block",
    "build_sql_governance_stack",
    "infer_profile_from_message",
    "parse_sql_governance_profile",
    "sql_governance_rejection_reason",
    "sql_semantics_rejection_reason",
    "ConversationFilter",
    "ObservabilityProvider",
    "AuditLogger",
    "T",
    # Audit
    "AuditEvent",
    "AuditEventType",
    "ToolAccessCheckEvent",
    "ToolInvocationEvent",
    "ToolResultEvent",
    "UiFeatureAccessCheckEvent",
    "AiResponseEvent",
    # UI Components
    "UiComponent",
    # Simple Components
    "SimpleComponent",
    "SimpleComponentType",
    "SimpleTextComponent",
    "SimpleImageComponent",
    "SimpleLinkComponent",
    # Rich Components
    "RichComponent",
    "ArtifactComponent",
    "BadgeComponent",
    "CardComponent",
    "DataFrameComponent",
    "IconTextComponent",
    "LogViewerComponent",
    "NotificationComponent",
    "ProgressBarComponent",
    "ProgressDisplayComponent",
    "RichTextComponent",
    "StatusCardComponent",
    "TaskListComponent",
    # Core implementations
    "ToolRegistry",
    "Agent",
    "AgentConfig",
    "DefaultSystemPromptBuilder",
    # # Evaluation
    # "Evaluator",
    # "TestCase",
    # "ExpectedOutcome",
    # "AgentResult",
    # "EvaluationResult",
    # "TestCaseResult",
    # "AgentVariant",
    # "EvaluationRunner",
    # "TrajectoryEvaluator",
    # "OutputEvaluator",
    # "LLMAsJudgeEvaluator",
    # "EfficiencyEvaluator",
    # "EvaluationReport",
    # "ComparisonReport",
    # "EvaluationDataset",
    # Exceptions
    "AgentError",
    "ToolExecutionError",
    "ToolNotFoundError",
    "PermissionError",
    "ConversationNotFoundError",
    "LlmServiceError",
    "ValidationError",
]
