"""
QueryMind - A modular framework for building LLM-powered SQL query agents.

This package provides a flexible framework for creating AI agents specialized
in natural language to SQL translation with RAG (using Vector and Graph-based approaches), tool execution,
and visualization capabilities.
"""

# Version information
__version__ = "0.1.0"

# =============================================================================
# Core Framework - Interfaces, Models, and Base Classes
# =============================================================================
from .core import (
    # === Interfaces ===
    Agent,
    Tool,
    LlmService,
    ConversationStore,
    UserService,
    SystemPromptBuilder,
    LifecycleHook,
    LlmMiddleware,
    WorkflowHandler,
    DefaultWorkflowHandler,
    CompositeWorkflowHandler,
    ErrorRecoveryStrategy,
    ExponentialBackoffStrategy,
    ToolContextEnricher,
    LlmContextEnhancer,
    DefaultLlmContextEnhancer,
    CompositeLlmContextEnhancer,
    ConversationFilter,
    ObservabilityProvider,
    # Type variables
    T,
    # === Models ===
    User,
    Message,
    Conversation,
    ToolCall,
    ToolResult,
    ToolContext,
    ToolSchema,
    LlmMessage,
    LlmRequest,
    LlmResponse,
    LlmStreamChunk,
    WorkflowResult,
    RecoveryAction,
    RecoveryActionType,
    Span,
    Metric,
    AgentConfig,
    # === Registry ===
    ToolRegistry,
    # === Audit ===
    AuditLogger,
    AuditEvent,
    AuditEventType,
    ToolAccessCheckEvent,
    ToolInvocationEvent,
    ToolResultEvent,
    UiFeatureAccessCheckEvent,
    AiResponseEvent,
    # === Exceptions ===
    AgentError,
    ConversationNotFoundError,
    LlmServiceError,
    PermissionError,
    ToolExecutionError,
    ToolNotFoundError,
    ValidationError,
)

# =============================================================================
# UI Components - Simple and Rich Components
# =============================================================================
from .components import (
    # Base
    UiComponent,
    RichComponent,
    ComponentType,
    ComponentLifecycle,
    # Simple Components
    SimpleComponent,
    SimpleComponentType,
    SimpleTextComponent,
    SimpleImageComponent,
    SimpleLinkComponent,
    # Rich Components - Text
    RichTextComponent,
    # Rich Components - Data
    DataFrameComponent,
    ChartComponent,
    # Rich Components - Feedback
    NotificationComponent,
    StatusCardComponent,
    ProgressBarComponent,
    ProgressDisplayComponent,
    StatusIndicatorComponent,
    LogViewerComponent,
    LogEntry,
    BadgeComponent,
    IconTextComponent,
    # Rich Components - Interactive
    TaskListComponent,
    Task,
    StatusBarUpdateComponent,
    TaskTrackerUpdateComponent,
    ChatInputUpdateComponent,
    TaskOperation,
    ButtonComponent,
    ButtonGroupComponent,
    # Rich Components - Containers
    CardComponent,
    # Rich Components - Specialized
    ArtifactComponent,
    # Schema Management Components
    SchemaListComponent,
    SchemaDetailComponent,
)

# =============================================================================
# Tools - Built-in Tool Implementations
# =============================================================================
from .tools import (
    # File System
    FileSystem,
    LocalFileSystem,
    ListFilesTool,
    SearchFilesTool,
    ReadFileTool,
    WriteFileTool,
    create_file_system_tools,
    CommandResult,
    # Python Execution
    RunPythonFileTool,
    PipInstallTool,
    create_python_tools,
    # SQL Execution
    RunSqlTool,
    # Visualization
    PlotlyChartGenerator,
    VisualizeDataTool,
    # Agent Memory
    SaveQuestionToolArgsTool, 
    SearchSavedCorrectToolUsesTool, 
    SaveTextMemoryTool,
    # Schema
    SchemaRetrieveTool,
    SchemaRetrieveToolArgs,
    SearchMode,
)

# =============================================================================
# Capabilities - Tool Capability Abstractions
# =============================================================================
from .capabilities import (
    FileSystem,
    FileSearchMatch,
    CommandResult,
    SqlRunner,
    RunSqlToolArgs,
    SchemaMemory,
    SchemaExtractor,
    SchemaSyncEngine,
    SchemaManagementService,
)

# =============================================================================
# Integrations - Concrete Implementations
# =============================================================================
from .integrations import (
    AnthropicLlmService,
    MemoryConversationStore,
    MockLlmService,
    PlotlyChartGenerator,
    PostgresRunner,
    Neo4jMem0SchemaMemory,
    PostgresSchemaExtractor,
    Neo4jMem0SchemaManagementService,
)

# =============================================================================
# Server - FastAPI Server Implementation
# =============================================================================
from .server import (
    ChatHandler,
    ChatRequest,
    ChatStreamChunk,
    ChatResponse,
    QueryMindFastAPIServer,
)

# =============================================================================
# Public API
# =============================================================================
__all__ = [
    # Version
    "__version__",
    # === Core Interfaces ===
    "Agent",
    "Tool",
    "LlmService",
    "ConversationStore",
    "UserService",
    "SystemPromptBuilder",
    "LifecycleHook",
    "LlmMiddleware",
    "WorkflowHandler",
    "DefaultWorkflowHandler",
    "CompositeWorkflowHandler",
    "ErrorRecoveryStrategy",
    "ExponentialBackoffStrategy",
    "ToolContextEnricher",
    "LlmContextEnhancer",
    "DefaultLlmContextEnhancer",
    "CompositeLlmContextEnhancer",
    "ConversationFilter",
    "ObservabilityProvider",
    "T",
    # === Core Models ===
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
    "WorkflowResult",
    "RecoveryAction",
    "RecoveryActionType",
    "Span",
    "Metric",
    "AgentConfig",
    # === Registry ===
    "ToolRegistry",
    # === Audit ===
    "AuditLogger",
    "AuditEvent",
    "AuditEventType",
    "ToolAccessCheckEvent",
    "ToolInvocationEvent",
    "ToolResultEvent",
    "UiFeatureAccessCheckEvent",
    "AiResponseEvent",
    # === UI Components - Base ===
    "UiComponent",
    "RichComponent",
    "ComponentType",
    "ComponentLifecycle",
    # === UI Components - Simple ===
    "SimpleComponent",
    "SimpleComponentType",
    "SimpleTextComponent",
    "SimpleImageComponent",
    "SimpleLinkComponent",
    # === UI Components - Rich ===
    "RichTextComponent",
    "DataFrameComponent",
    "ChartComponent",
    "NotificationComponent",
    "StatusCardComponent",
    "ProgressBarComponent",
    "ProgressDisplayComponent",
    "StatusIndicatorComponent",
    "LogViewerComponent",
    "LogEntry",
    "BadgeComponent",
    "IconTextComponent",
    "TaskListComponent",
    "Task",
    "StatusBarUpdateComponent",
    "TaskTrackerUpdateComponent",
    "ChatInputUpdateComponent",
    "TaskOperation",
    "ButtonComponent",
    "ButtonGroupComponent",
    "CardComponent",
    "ArtifactComponent",
    # === UI Components - Schema Management ===
    "SchemaListComponent",
    "SchemaDetailComponent",
    # === Tools ===
    "FileSystem",
    "LocalFileSystem",
    "ListFilesTool",
    "SearchFilesTool",
    "ReadFileTool",
    "WriteFileTool",
    "create_file_system_tools",
    "CommandResult",
    "RunPythonFileTool",
    "PipInstallTool",
    "create_python_tools",
    "RunSqlTool",
    "PlotlyChartGenerator",
    "VisualizeDataTool",
    "SaveQuestionToolArgsTool",
    "SearchSavedCorrectToolUsesTool",
    "SaveTextMemoryTool",
    "SchemaRetrieveTool",
    "SchemaRetrieveToolArgs",
    "SearchMode",
    # === Capabilities ===
    "FileSearchMatch",
    "SqlRunner",
    "RunSqlToolArgs",
    "SchemaMemory",
    "SchemaExtractor",
    "SchemaSyncEngine",
    "SchemaManagementService",
    # === Integrations ===
    "AnthropicLlmService",
    "MemoryConversationStore",
    "MockLlmService",
    "PostgresRunner",
    "Neo4jMem0SchemaMemory",
    "PostgresSchemaExtractor",
    "Neo4jMem0SchemaManagementService",
    # === Server ===
    "ChatHandler",
    "ChatRequest",
    "ChatStreamChunk",
    "ChatResponse",
    "QueryMindFastAPIServer",
    # === Exceptions ===
    "AgentError",
    "ToolExecutionError",
    "ToolNotFoundError",
    "PermissionError",
    "ConversationNotFoundError",
    "LlmServiceError",
    "ValidationError",
]
