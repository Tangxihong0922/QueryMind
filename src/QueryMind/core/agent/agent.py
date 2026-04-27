"""
Agent implementation for the QueryMind Agents framework.

This module provides the main Agent class that orchestrates the interaction
between LLM services, tools, and conversation storage.
"""

import traceback
import uuid
import re
from typing import TYPE_CHECKING, Any, AsyncGenerator, Dict, List, Optional

from QueryMind.components import (
    UiComponent,
    SimpleTextComponent,
    RichTextComponent,
    StatusBarUpdateComponent,
    TaskTrackerUpdateComponent,
    ChatInputUpdateComponent,
    StatusCardComponent,
    Task,
)
from .config import AgentConfig
from QueryMind.core.storage import ConversationStore
from QueryMind.core.llm import LlmService
from QueryMind.core.system_prompt import SystemPromptBuilder
from QueryMind.core.storage import Conversation, Message
from QueryMind.core.llm import LlmMessage, LlmRequest, LlmResponse
from QueryMind.core.tool import ToolCall, ToolContext, ToolResult, ToolSchema
from QueryMind.core.user import User
from QueryMind.core.registry import ToolRegistry
from QueryMind.core.system_prompt import DefaultSystemPromptBuilder
from QueryMind.core.hook import LifecycleHook
from QueryMind.core.middleware import LlmMiddleware
from QueryMind.core.workflow import WorkflowHandler, DefaultWorkflowHandler
from QueryMind.core.recovery import ErrorRecoveryStrategy, RecoveryActionType
from QueryMind.core.enricher import ToolContextEnricher
from QueryMind.core.enhancer import LlmContextEnhancer, DefaultLlmContextEnhancer
from QueryMind.core.filter import ConversationFilter
from QueryMind.core.observability import ObservabilityProvider
from QueryMind.core.user.resolver import UserResolver
from QueryMind.core.user.request_context import RequestContext
from QueryMind.core.agent.config import UiFeature
from QueryMind.core.agent.governance import SchemaGovernanceManager
from QueryMind.core.audit import AuditLogger
from QueryMind.capabilities.agent_memory import AgentMemory
from QueryMind.capabilities.schema_memory import SchemaMemory
from QueryMind.capabilities.schema_management import SchemaManagementService

import logging

logger = logging.getLogger(__name__)

logger.info("Loaded QueryMind.core.agent.agent module")

if TYPE_CHECKING:
    pass


_SQL_WHITESPACE_RE = re.compile(r"\s+")


def _normalize_sql_text(sql: str) -> str:
    return _SQL_WHITESPACE_RE.sub(" ", sql.strip()).lower()


def _find_last_successful_run_sql(tool_results: List[Dict[str, Any]]) -> Optional[str]:
    for tool_result in reversed(tool_results):
        metadata = tool_result.get("metadata") or {}
        tool_name = tool_result.get("tool_name") or metadata.get("tool_name")
        if tool_name != "run_sql" or not tool_result.get("success"):
            continue

        executed_sql = metadata.get("executed_sql")
        if isinstance(executed_sql, str) and executed_sql.strip():
            return executed_sql.strip()

    return None


def _normalize_schema_table_refs(
    raw_table_refs: Any,
) -> List[Dict[str, Any]]:
    normalized: List[Dict[str, Any]] = []
    seen_full_names = set()

    for ref in raw_table_refs or []:
        if isinstance(ref, dict):
            full_name = str(ref.get("full_name") or "").strip()
            database_name = str(ref.get("database_name") or "").strip() or None
            schema_name = str(ref.get("schema_name") or "").strip() or None
            table_name = str(ref.get("table_name") or "").strip() or None
            if not full_name:
                parts = [part for part in [database_name, schema_name, table_name] if part]
                full_name = ".".join(parts)
        else:
            full_name = str(ref).strip()
            database_name = None
            schema_name = None
            table_name = None

        if not full_name or full_name in seen_full_names:
            continue

        seen_full_names.add(full_name)

        if not schema_name or not table_name:
            parts = [part for part in full_name.split(".") if part]
            if len(parts) >= 3:
                database_name = database_name or parts[-3]
                schema_name = schema_name or parts[-2]
                table_name = table_name or parts[-1]
            elif len(parts) == 2:
                schema_name = schema_name or parts[-2]
                table_name = table_name or parts[-1]
            elif len(parts) == 1:
                schema_name = schema_name or "public"
                table_name = table_name or parts[0]

        normalized.append(
            {
                "full_name": full_name,
                "database_name": database_name,
                "schema_name": schema_name,
                "table_name": table_name,
            }
        )

    return normalized


def _build_live_schema_snapshot(
    result_metadata: Dict[str, Any],
    *,
    success: bool,
) -> Dict[str, Any]:
    """Build a same-turn schema snapshot from the latest tool result."""
    metadata = dict(result_metadata or {})
    if metadata.get("tool_name") != "schema_retrieve":
        return {}

    raw_selected_tables = metadata.get("selected_tables") or []
    selected_tables: List[str] = []
    seen_tables = set()
    for table in raw_selected_tables:
        table_name = str(table).strip()
        if not table_name or table_name in seen_tables:
            continue
        seen_tables.add(table_name)
        selected_tables.append(table_name)

    selected_table_refs = _normalize_schema_table_refs(
        metadata.get("selected_table_refs") or []
    )
    query = str(metadata.get("query") or "")
    search_mode = str(metadata.get("search_mode") or "unknown")
    graph_hint = str(metadata.get("graph_hint") or "none")
    required_fields = [
        str(field).strip()
        for field in (metadata.get("required_fields") or [])
        if str(field).strip()
    ]
    domain_filter = metadata.get("domain_filter")
    total_results = int(metadata.get("total_results") or len(selected_tables) or 0)
    governance = metadata.get("schema_governance")
    if not isinstance(governance, dict):
        governance = {}
    schema_locked = bool(governance.get("schema_locked", False))
    lock_reason = governance.get("lock_reason")

    if selected_tables:
        preview_tables = selected_tables[:4]
        preview = ", ".join(preview_tables)
        if len(selected_tables) > len(preview_tables):
            preview = f"{preview}, ... (+{len(selected_tables) - len(preview_tables)})"
        summary_text = (
            f"schema_retrieve[{search_mode}] query='{query}' -> "
            f"{len(selected_tables)} table(s): {preview}"
        )
    else:
        summary_text = f"schema_retrieve[{search_mode}] query='{query}' -> 0 table(s)"

    schema_summary = {
        "tool_name": "schema_retrieve",
        "query": query,
        "search_mode": search_mode,
        "graph_hint": graph_hint,
        "success": success,
        "total_results": total_results,
        "selected_tables": selected_tables,
        "selected_table_refs": selected_table_refs,
        "required_fields": required_fields,
        "domain_filter": domain_filter,
        "schema_locked": schema_locked,
        "lock_reason": lock_reason,
        "summary_text": summary_text,
    }

    schema_context = {
        "seed_tables": selected_tables,
        "seed_table_refs": selected_table_refs,
        "expand_mode": bool(selected_tables),
        "last_query": query,
        "last_search_mode": search_mode,
        "graph_hint": graph_hint,
        "required_fields": required_fields,
        "domain_filter": domain_filter,
        "summary_text": summary_text,
        "schema_locked": schema_locked,
        "lock_reason": lock_reason,
    }

    return {
        "schema_governance": dict(governance),
        "last_schema_summary": schema_summary,
        "schema_retrieve_context": schema_context,
    }


def _build_live_sql_snapshot(
    result_metadata: Dict[str, Any],
    *,
    success: bool,
) -> Dict[str, Any]:
    """Build a same-turn SQL snapshot from the latest tool result."""
    metadata = dict(result_metadata or {})
    if metadata.get("tool_name") != "run_sql":
        return {}

    sql_governance = metadata.get("sql_governance")
    last_sql_summary = metadata.get("last_sql_summary")
    last_sql_shape = metadata.get("last_sql_shape")

    snapshot: Dict[str, Any] = {}
    if isinstance(sql_governance, dict) and sql_governance:
        snapshot["sql_governance"] = dict(sql_governance)
    if isinstance(last_sql_summary, dict) and last_sql_summary:
        snapshot["last_sql_summary"] = dict(last_sql_summary)
    if isinstance(last_sql_shape, dict) and last_sql_shape:
        snapshot["last_sql_shape"] = dict(last_sql_shape)

    if snapshot:
        return snapshot

    executed_sql = str(metadata.get("executed_sql") or metadata.get("sql") or "").strip()
    if not executed_sql:
        return {}

    summary_text = executed_sql
    if len(summary_text) > 180:
        summary_text = f"{summary_text[:177]}..."

    return {
        "sql_governance": {
            "last_sql_result_success": success,
            "last_sql_text": executed_sql,
            "last_gap_categories": [],
        },
        "last_sql_summary": {
            "summary_text": f"run_sql[{ 'success' if success else 'failure' }] sql='{summary_text}'",
            "sql_text": executed_sql,
            "feature_names": [],
            "gap_categories": [],
            "success": success,
        },
        "last_sql_shape": {},
    }


def _compose_final_response_content(
    response_content: Optional[str],
    tool_results: List[Dict[str, Any]],
) -> str:
    """Append the executed SQL to the final assistant response when available."""
    summary_content = (response_content or "").rstrip()
    executed_sql = _find_last_successful_run_sql(tool_results)
    if not executed_sql:
        return summary_content

    if not summary_content:
        summary_content = "SQL execution completed successfully."

    normalized_summary = _normalize_sql_text(summary_content)
    normalized_sql = _normalize_sql_text(executed_sql)
    if normalized_sql and normalized_sql in normalized_summary:
        return summary_content

    sql_block = f"**Executed SQL**\n```sql\n{executed_sql}\n```"
    return f"{summary_content}\n\n{sql_block}"


def _append_prompt_block(existing: Optional[str], block: str) -> str:
    existing = (existing or "").rstrip()
    block = block.strip()
    if not block:
        return existing
    if block in existing:
        return existing
    if not existing:
        return block
    return f"{existing}\n\n{block}"


class Agent:
    """Main agent implementation.

    The Agent class orchestrates LLM interactions, tool execution, and conversation
    management. It provides 9 extensibility points for customization:

    - hooks: Hook into message and tool execution lifecycle
    - llm_middlewares: Intercept and transform LLM requests/responses
    - error_recovery_strategy: Handle errors with retry logic
    - context_enrichers: Add data to tool execution context
    - llm_context_enhancer: Enhance LLM system prompts and messages with context
    - conversation_filters: Filter conversation history before LLM calls
    - observability_provider: Collect telemetry and monitoring data
    - schema_memory: Table schema storage and retrieval (vector + graph search)
    - schema_management_service: Schema management service for admin operations

    Example:
        agent = Agent(
            llm_service=AnthropicLlmService(api_key="..."),
            tool_registry=registry,
            conversation_store=store,
            hooks=[QuotaCheckHook()],
            llm_middlewares=[CachingMiddleware()],
            llm_context_enhancer=DefaultLlmContextEnhancer(agent_memory),
            observability_provider=LoggingProvider(),
            schema_memory=Neo4jMem0SchemaMemory(config=neo4j_config),
            schema_management_service=Neo4jMem0SchemaManagementService(
                schema_memory=schema_memory,
                llm_service=llm_service
            ),
        )
    """

    def __init__(
        self,
        llm_service: LlmService,
        tool_registry: ToolRegistry,
        user_resolver: UserResolver,
        agent_memory: AgentMemory,
        conversation_store: Optional[ConversationStore] = None,
        config: AgentConfig = AgentConfig(),
        system_prompt_builder: SystemPromptBuilder = DefaultSystemPromptBuilder(),
        hooks: List[LifecycleHook] = [],
        llm_middlewares: List[LlmMiddleware] = [],
        workflow_handler: Optional[WorkflowHandler] = None,
        error_recovery_strategy: Optional[ErrorRecoveryStrategy] = None,
        context_enrichers: List[ToolContextEnricher] = [],
        llm_context_enhancer: Optional[LlmContextEnhancer] = None,
        conversation_filters: List[ConversationFilter] = [],
        observability_provider: Optional[ObservabilityProvider] = None,
        audit_logger: Optional[AuditLogger] = None,
        # Schema capabilities (new extensibility points)
        schema_memory: Optional[SchemaMemory] = None,
        schema_management_service: Optional[SchemaManagementService] = None,
        schema_governance_manager: Optional[SchemaGovernanceManager] = None,
    ):
        self.llm_service = llm_service
        self.tool_registry = tool_registry
        self.user_resolver = user_resolver
        self.agent_memory = agent_memory

        # Import here to avoid circular dependency
        if conversation_store is None:
            from QueryMind.integrations.local import MemoryConversationStore

            conversation_store = MemoryConversationStore()

        self.conversation_store = conversation_store
        self.config = config
        self.system_prompt_builder = system_prompt_builder
        self.hooks = hooks
        self.llm_middlewares = llm_middlewares

        # Use DefaultWorkflowHandler if none provided
        if workflow_handler is None:
            workflow_handler = DefaultWorkflowHandler()
        self.workflow_handler = workflow_handler

        self.error_recovery_strategy = error_recovery_strategy
        self.context_enrichers = context_enrichers

        # Use DefaultLlmContextEnhancer if none provided
        if llm_context_enhancer is None:
            llm_context_enhancer = DefaultLlmContextEnhancer(agent_memory)
        self.llm_context_enhancer = llm_context_enhancer

        self.conversation_filters = conversation_filters
        self.observability_provider = observability_provider
        self.audit_logger = audit_logger

        # Schema capabilities (new extensibility points)
        self.schema_memory = schema_memory
        self.schema_management_service = schema_management_service
        self.schema_governance_manager = schema_governance_manager

        # Wire audit logger into tool registry
        if self.audit_logger and self.config.audit_config.enabled:
            self.tool_registry.audit_logger = self.audit_logger
            self.tool_registry.audit_config = self.config.audit_config

        logger.info("Initialized Agent")

    async def send_message(
        self,
        request_context: RequestContext,
        message: str,
        *,
        conversation_id: Optional[str] = None,
    ) -> AsyncGenerator[UiComponent, None]:
        """
        Process a user message and yield UI components with error handling.

        Args:
            request_context: Request context for user resolution (includes metadata)
            message: User's message content
            conversation_id: Optional conversation ID; if None, creates new conversation

        Yields:
            UiComponent instances for UI updates
        """
        try:
            # Delegate to internal method
            async for component in self._send_message(
                request_context, message, conversation_id=conversation_id
            ):
                yield component
        except Exception as e:
            # Log full stack trace
            stack_trace = traceback.format_exc()
            logger.error(
                f"Error in send_message (conversation_id={conversation_id}): {e}\n{stack_trace}",
                exc_info=True,
            )

            # Log to observability provider if available
            if self.observability_provider:
                try:
                    error_span = await self.observability_provider.create_span(
                        "agent.send_message.error",
                        attributes={
                            "error_type": type(e).__name__,
                            "error_message": str(e),
                            "conversation_id": conversation_id or "none",
                        },
                    )
                    await self.observability_provider.end_span(error_span)
                    await self.observability_provider.record_metric(
                        "agent.error.count",
                        1.0,
                        "count",
                        tags={"error_type": type(e).__name__},
                    )
                except Exception as obs_error:
                    logger.error(
                        f"Failed to log error to observability provider: {obs_error}",
                        exc_info=True,
                    )

            # Yield error component to UI (simple, user-friendly message)
            error_description = "An unexpected error occurred while processing your message. Please try again."
            if conversation_id:
                error_description += f"\n\nConversation ID: {conversation_id}"

            yield UiComponent(
                rich_component=StatusCardComponent(
                    title="Error Processing Message",
                    status="error",
                    description=error_description,
                    icon="⚠️",
                ),
                simple_component=SimpleTextComponent(
                    text=f"Error: An unexpected error occurred. Please try again.{f' (Conversation ID: {conversation_id})' if conversation_id else ''}"
                ),
            )

            # Update status bar to show error state
            yield UiComponent(  # type: ignore
                rich_component=StatusBarUpdateComponent(
                    status="error",
                    message="Error occurred",
                    detail="An unexpected error occurred while processing your message",
                )
            )

            # Re-enable chat input so user can try again
            yield UiComponent(  # type: ignore
                rich_component=ChatInputUpdateComponent(
                    placeholder="Try again...", disabled=False
                )
            )

    async def _send_message(
        self,
        request_context: RequestContext,
        message: str,
        *,
        conversation_id: Optional[str] = None,
    ) -> AsyncGenerator[UiComponent, None]:
        """
        Internal method to process a user message and yield UI components.

        Args:
            request_context: Request context for user resolution (includes metadata)
            message: User's message content
            conversation_id: Optional conversation ID; if None, creates new conversation

        Yields:
            UiComponent instances for UI updates
        """
        # Resolve user from request context with observability
        user_resolution_span = None
        if self.observability_provider:
            user_resolution_span = await self.observability_provider.create_span(
                "agent.user_resolution",
                attributes={"has_context": request_context is not None},
            )

        user = await self.user_resolver.resolve_user(request_context)

        if self.observability_provider and user_resolution_span:
            user_resolution_span.set_attribute("user_id", user.id)
            await self.observability_provider.end_span(user_resolution_span)
            if user_resolution_span.duration_ms():
                await self.observability_provider.record_metric(
                    "agent.user_resolution.duration",
                    user_resolution_span.duration_ms() or 0,
                    "ms",
                )

        # Check if this is a starter UI request (empty message or explicit metadata flag)
        is_starter_request = (not message.strip()) or request_context.metadata.get(
            "starter_ui_request", False
        )

        if is_starter_request and self.workflow_handler:
            # Handle starter UI request with observability
            starter_span = None
            if self.observability_provider:
                starter_span = await self.observability_provider.create_span(
                    "agent.workflow_handler.starter_ui", attributes={"user_id": user.id}
                )

            try:
                # Load or create conversation for context
                if conversation_id is None:
                    conversation_id = str(uuid.uuid4())

                conversation = await self.conversation_store.get_conversation(
                    conversation_id, user
                )
                if not conversation:
                    # Create empty conversation (will be saved if workflow produces components)
                    conversation = Conversation(
                        id=conversation_id, user=user, messages=[]
                    )

                # Get starter UI from workflow handler
                components = await self.workflow_handler.get_starter_ui(
                    self, user, conversation
                )

                if self.observability_provider and starter_span:
                    starter_span.set_attribute("has_components", components is not None)
                    starter_span.set_attribute(
                        "component_count", len(components) if components else 0
                    )

                if components:
                    # Yield the starter UI components
                    for component in components:
                        yield component

                    # Yield finalization components
                    yield UiComponent(  # type: ignore
                        rich_component=StatusBarUpdateComponent(
                            status="idle",
                            message="Ready",
                            detail="Choose an option or type a message",
                        )
                    )
                    yield UiComponent(  # type: ignore
                        rich_component=ChatInputUpdateComponent(
                            placeholder="Ask a question...", disabled=False
                        )
                    )

                if self.observability_provider and starter_span:
                    await self.observability_provider.end_span(starter_span)
                    if starter_span.duration_ms():
                        await self.observability_provider.record_metric(
                            "agent.workflow_handler.starter_ui.duration",
                            starter_span.duration_ms() or 0,
                            "ms",
                        )

                # Save the conversation if it was newly created
                if self.config.auto_save_conversations:
                    await self.conversation_store.update_conversation(conversation)

                return  # Exit without calling LLM

            except Exception as e:
                logger.error(f"Error generating starter UI: {e}", exc_info=True)
                if self.observability_provider and starter_span:
                    starter_span.set_attribute("error", str(e))
                    await self.observability_provider.end_span(starter_span)
                # Fall through to normal processing on error

        # Don't process actual empty messages (that aren't starter requests)
        if not message.strip():
            return

        # Create observability span for entire message processing
        message_span = None
        if self.observability_provider:
            message_span = await self.observability_provider.create_span(
                "agent.send_message",
                attributes={
                    "user_id": user.id,
                    "conversation_id": conversation_id or "new",
                },
            )

        # Run before_message hooks with observability
        modified_message = message
        for hook in self.hooks:
            hook_span = None
            if self.observability_provider:
                hook_span = await self.observability_provider.create_span(
                    "agent.hook.before_message",
                    attributes={"hook": hook.__class__.__name__},
                )

            hook_result = await hook.before_message(user, modified_message)
            if hook_result is not None:
                modified_message = hook_result

            if self.observability_provider and hook_span:
                hook_span.set_attribute("modified_message", hook_result is not None)
                await self.observability_provider.end_span(hook_span)
                if hook_span.duration_ms():
                    await self.observability_provider.record_metric(
                        "agent.hook.duration",
                        hook_span.duration_ms() or 0,
                        "ms",
                        tags={
                            "hook": hook.__class__.__name__,
                            "phase": "before_message",
                        },
                    )

        # Use the potentially modified message
        message = modified_message

        # Generate conversation ID and request ID if not provided
        if conversation_id is None:
            conversation_id = str(uuid.uuid4())

        request_id = str(uuid.uuid4())

        # Update status to working
        yield UiComponent(  # type: ignore
            rich_component=StatusBarUpdateComponent(
                status="working",
                message="Processing your request...",
                detail="Analyzing query",
            )
        )

        # Load or create conversation with observability (but don't add message yet)
        conversation_span = None
        if self.observability_provider:
            conversation_span = await self.observability_provider.create_span(
                "agent.conversation.load",
                attributes={"conversation_id": conversation_id, "user_id": user.id},
            )

        conversation = await self.conversation_store.get_conversation(
            conversation_id, user
        )

        is_new_conversation = conversation is None

        if not conversation:
            # Create empty conversation (will add message after workflow handler check)
            conversation = Conversation(id=conversation_id, user=user, messages=[])

        if self.observability_provider and conversation_span:
            conversation_span.set_attribute("is_new", is_new_conversation)
            conversation_span.set_attribute("message_count", len(conversation.messages))
            await self.observability_provider.end_span(conversation_span)
            if conversation_span.duration_ms():
                await self.observability_provider.record_metric(
                    "agent.conversation.load.duration",
                    conversation_span.duration_ms() or 0,
                    "ms",
                    tags={"is_new": str(is_new_conversation)},
                )

        # Try workflow handler before adding message to conversation
        if self.workflow_handler:
            trigger_span = None
            if self.observability_provider:
                trigger_span = await self.observability_provider.create_span(
                    "agent.workflow_handler.try_handle",
                    attributes={"user_id": user.id, "conversation_id": conversation_id},
                )

            try:
                workflow_result = await self.workflow_handler.try_handle(
                    self, user, conversation, message
                )

                if self.observability_provider and trigger_span:
                    trigger_span.set_attribute(
                        "should_skip_llm", workflow_result.should_skip_llm
                    )

                if workflow_result.should_skip_llm:
                    # Workflow handled the message, short-circuit LLM

                    # Apply conversation mutation if provided
                    if workflow_result.conversation_mutation:
                        await workflow_result.conversation_mutation(conversation)

                    # Stream components
                    if workflow_result.components:
                        if isinstance(workflow_result.components, list):
                            for component in workflow_result.components:
                                yield component
                        else:
                            # AsyncGenerator
                            async for component in workflow_result.components:
                                yield component

                    # Finalize response (status bar + chat input)
                    yield UiComponent(  # type: ignore
                        rich_component=StatusBarUpdateComponent(
                            status="idle",
                            message="Workflow complete",
                            detail="Ready for next message",
                        )
                    )
                    yield UiComponent(  # type: ignore
                        rich_component=ChatInputUpdateComponent(
                            placeholder="Ask a question...", disabled=False
                        )
                    )

                    # Save conversation if auto-save enabled
                    if self.config.auto_save_conversations:
                        await self.conversation_store.update_conversation(conversation)

                    if self.observability_provider and trigger_span:
                        await self.observability_provider.end_span(trigger_span)

                    # Exit without calling LLM
                    return

            except Exception as e:
                logger.error(f"Error in workflow handler: {e}", exc_info=True)
                if self.observability_provider and trigger_span:
                    trigger_span.set_attribute("error", str(e))
                    await self.observability_provider.end_span(trigger_span)
                # Fall through to normal LLM processing on error

            finally:
                if self.observability_provider and trigger_span:
                    await self.observability_provider.end_span(trigger_span)

        # Persist new conversation to store before adding message
        if is_new_conversation:
            await self.conversation_store.update_conversation(conversation)

        # Not triggered, add user message to conversation now
        conversation.add_message(Message(role="user", content=message))

        # Add initial task
        context_task = Task(
            title="Load conversation context",
            description="Reading message history and user context",
            status="pending",
        )
        yield UiComponent(  # type: ignore
            rich_component=TaskTrackerUpdateComponent.add_task(context_task)
        )

        # Collect available UI features for auditing
        ui_features_available = []
        for feature_name in self.config.ui_features.feature_group_access.keys():
            if self.config.ui_features.can_user_access_feature(feature_name, user):
                ui_features_available.append(feature_name)

        tool_memory_session_isolated = bool(
            request_context.metadata.get("tool_memory_session_isolated", False)
        )

        # Create context with observability provider and UI features
        context = ToolContext(
            user=user,
            conversation_id=conversation_id,
            request_id=request_id,
            raw_user_message=message,
            agent_memory=self.agent_memory,
            observability_provider=self.observability_provider,
            metadata={
                **request_context.metadata,
                "ui_features_available": ui_features_available,
                "tool_memory_session_isolated": tool_memory_session_isolated,
            },
            # Schema capabilities (new extensibility points)
            schema_memory=self.schema_memory,
            schema_management_service=self.schema_management_service,
            # Schema search default parameters from config
            schema_search_default_limit=self.config.schema_search_default_limit,
            schema_search_default_threshold=self.config.schema_search_default_threshold,
            schema_search_default_mode=self.config.schema_search_default_mode,
        )

        # Enrich context with additional data with observability
        for enricher in self.context_enrichers:
            enrichment_span = None
            if self.observability_provider:
                enrichment_span = await self.observability_provider.create_span(
                    "agent.context.enrichment",
                    attributes={"enricher": enricher.__class__.__name__},
                )

            context = await enricher.enrich_context(context)

            if self.observability_provider and enrichment_span:
                await self.observability_provider.end_span(enrichment_span)
                if enrichment_span.duration_ms():
                    await self.observability_provider.record_metric(
                        "agent.enrichment.duration",
                        enrichment_span.duration_ms() or 0,
                        "ms",
                        tags={"enricher": enricher.__class__.__name__},
                    )

        # Get available tools for user with observability
        schema_span = None
        if self.observability_provider:
            schema_span = await self.observability_provider.create_span(
                "agent.tool_schemas.fetch", attributes={"user_id": user.id}
            )

        tool_schemas = await self.tool_registry.get_schemas(user)

        if self.observability_provider and schema_span:
            schema_span.set_attribute("schema_count", len(tool_schemas))
            await self.observability_provider.end_span(schema_span)
            if schema_span.duration_ms():
                await self.observability_provider.record_metric(
                    "agent.tool_schemas.duration",
                    schema_span.duration_ms() or 0,
                    "ms",
                    tags={"schema_count": str(len(tool_schemas))},
                )

        # Update task status to completed
        yield UiComponent(  # type: ignore
            rich_component=TaskTrackerUpdateComponent.update_task(
                context_task.id, status="completed"
            )
        )

        tool_iterations = 0
        all_tool_results: List[Dict[str, Any]] = []
        request_metadata = {
            **dict(request_context.metadata or {}),
            "conversation_id": conversation_id,
            "request_id": request_id,
            "tool_iterations": tool_iterations,
            "max_tool_iterations": self.config.max_tool_iterations,
        }

        # Process with tool loop
        while tool_iterations < self.config.max_tool_iterations:
            if self.config.include_thinking_indicators and tool_iterations == 0:
                # TODO: Yield thinking indicator
                pass

            request_metadata["tool_iterations"] = tool_iterations

            # Build system prompt and visible tool list for the current turn.
            prompt_span = None
            if self.observability_provider:
                prompt_span = await self.observability_provider.create_span(
                    "agent.system_prompt.build",
                    attributes={"tool_count": len(tool_schemas)},
                )

            visible_tool_schemas, system_prompt, prepared_metadata = (
                await self._prepare_turn_prompt(
                    user=user,
                    user_message=message,
                    tool_schemas=tool_schemas,
                    request_metadata=request_metadata,
                    conversation_id=conversation_id,
                )
            )
            request_metadata.update(prepared_metadata)

            if self.observability_provider and prompt_span:
                prompt_span.set_attribute(
                    "prompt_length", len(system_prompt) if system_prompt else 0
                )
                await self.observability_provider.end_span(prompt_span)
                if prompt_span.duration_ms():
                    await self.observability_provider.record_metric(
                        "agent.system_prompt.duration",
                        prompt_span.duration_ms() or 0,
                        "ms",
                    )

            # Build LLM request for the current turn
            request = await self._build_llm_request(
                conversation,
                visible_tool_schemas,
                user,
                system_prompt,
                request_metadata=request_metadata,
            )

            # Get LLM response
            if self.config.stream_responses:
                response = await self._handle_streaming_response(request)
            else:
                response = await self._send_llm_request(request)

            if request.metadata:
                request_metadata.update(request.metadata)
                context.metadata.update(request.metadata)

            # Handle tool calls
            if response.is_tool_call():
                tool_iterations += 1

                # First, add the assistant message with tool_calls to the conversation
                # This is required for OpenAI API - tool messages must follow assistant messages with tool_calls
                assistant_message = Message(
                    role="assistant",
                    content=response.content or "",  # Ensure content is not None
                    tool_calls=response.tool_calls,
                )
                conversation.add_message(assistant_message)

                if response.content is not None:
                    # Yield any partial content from the assistant before tool execution
                    has_tool_invocation_message_in_chat = (
                        self.config.ui_features.can_user_access_feature(
                            UiFeature.UI_FEATURE_SHOW_TOOL_INVOCATION_MESSAGE_IN_CHAT,
                            user,
                        )
                    )
                    if has_tool_invocation_message_in_chat:
                        yield UiComponent(
                            rich_component=RichTextComponent(
                                content=response.content, markdown=True
                            ),
                            simple_component=SimpleTextComponent(text=response.content),
                        )

                        # Update status to executing tools
                        yield UiComponent(  # type: ignore
                            rich_component=StatusBarUpdateComponent(
                                status="working",
                                message="Executing tools...",
                                detail=f"Running {len(response.tool_calls or [])} tools",
                            )
                        )
                    else:
                        # Yield as a status update instead
                        yield UiComponent(  # type: ignore
                            rich_component=StatusBarUpdateComponent(
                                status="working", message=response.content, detail=""
                            )
                        )

                # Collect all tool results first
                tool_results = []
                for i, tool_call in enumerate(response.tool_calls or []):
                    # Add task for this tool execution
                    tool_task = Task(
                        title=f"Execute {tool_call.name}",
                        description=f"Running tool with provided arguments",
                        status="in_progress",
                    )

                    has_tool_names_access = (
                        self.config.ui_features.can_user_access_feature(
                            UiFeature.UI_FEATURE_SHOW_TOOL_NAMES, user
                        )
                    )

                    # Audit UI feature access check
                    if (
                        self.audit_logger
                        and self.config.audit_config.enabled
                        and self.config.audit_config.log_ui_feature_checks
                    ):
                        await self.audit_logger.log_ui_feature_access(
                            user=user,
                            feature_name=UiFeature.UI_FEATURE_SHOW_TOOL_NAMES,
                            access_granted=has_tool_names_access,
                            required_groups=self.config.ui_features.feature_group_access.get(
                                UiFeature.UI_FEATURE_SHOW_TOOL_NAMES, []
                            ),
                            conversation_id=conversation.id,
                            request_id=request_id,
                        )

                    if has_tool_names_access:
                        yield UiComponent(  # type: ignore
                            rich_component=TaskTrackerUpdateComponent.add_task(
                                tool_task
                            )
                        )

                    response_str = response.content

                    # Use primitive StatusCard instead of semantic ToolExecutionComponent
                    tool_status_card = StatusCardComponent(
                        title=f"Executing {tool_call.name}",
                        status="running",
                        description=f"Running tool with {len(tool_call.arguments)} arguments",
                        icon="⚙️",
                        metadata=tool_call.arguments,
                    )

                    has_tool_args_access = (
                        self.config.ui_features.can_user_access_feature(
                            UiFeature.UI_FEATURE_SHOW_TOOL_ARGUMENTS, user
                        )
                    )

                    # Audit UI feature access check
                    if (
                        self.audit_logger
                        and self.config.audit_config.enabled
                        and self.config.audit_config.log_ui_feature_checks
                    ):
                        await self.audit_logger.log_ui_feature_access(
                            user=user,
                            feature_name=UiFeature.UI_FEATURE_SHOW_TOOL_ARGUMENTS,
                            access_granted=has_tool_args_access,
                            required_groups=self.config.ui_features.feature_group_access.get(
                                UiFeature.UI_FEATURE_SHOW_TOOL_ARGUMENTS, []
                            ),
                            conversation_id=conversation.id,
                            request_id=request_id,
                        )

                    if has_tool_args_access:
                        yield UiComponent(
                            rich_component=tool_status_card,
                            simple_component=SimpleTextComponent(
                                text=response_str or ""
                            ),
                        )

                    # Run before_tool hooks with observability
                    tool = await self.tool_registry.get_tool(tool_call.name)
                    if tool:
                        for hook in self.hooks:
                            hook_span = None
                            if self.observability_provider:
                                hook_span = (
                                    await self.observability_provider.create_span(
                                        "agent.hook.before_tool",
                                        attributes={
                                            "hook": hook.__class__.__name__,
                                            "tool": tool_call.name,
                                        },
                                    )
                                )

                            await hook.before_tool(tool, context)

                            if self.observability_provider and hook_span:
                                await self.observability_provider.end_span(hook_span)
                                if hook_span.duration_ms():
                                    await self.observability_provider.record_metric(
                                        "agent.hook.duration",
                                        hook_span.duration_ms() or 0,
                                        "ms",
                                        tags={
                                            "hook": hook.__class__.__name__,
                                            "phase": "before_tool",
                                            "tool": tool_call.name,
                                        },
                                    )

                    # Execute tool with observability
                    tool_exec_span = None
                    if self.observability_provider:
                        tool_exec_span = await self.observability_provider.create_span(
                            "agent.tool.execute",
                            attributes={
                                "tool": tool_call.name,
                                "arg_count": len(tool_call.arguments),
                            },
                        )

                    result = await self.tool_registry.execute(tool_call, context)

                    if self.observability_provider and tool_exec_span:
                        tool_exec_span.set_attribute("success", result.success)
                        if not result.success:
                            tool_exec_span.set_attribute(
                                "error", result.error or "unknown"
                            )
                        await self.observability_provider.end_span(tool_exec_span)
                        if tool_exec_span.duration_ms():
                            await self.observability_provider.record_metric(
                                "agent.tool.duration",
                                tool_exec_span.duration_ms() or 0,
                                "ms",
                                tags={
                                    "tool": tool_call.name,
                                    "success": str(result.success),
                                },
                            )

                    # Run after_tool hooks with observability
                    for hook in self.hooks:
                        hook_span = None
                        if self.observability_provider:
                            hook_span = await self.observability_provider.create_span(
                                "agent.hook.after_tool",
                                attributes={
                                    "hook": hook.__class__.__name__,
                                    "tool": tool_call.name,
                                },
                            )

                        modified_result = await hook.after_tool(result)
                        if modified_result is not None:
                            result = modified_result

                        if self.observability_provider and hook_span:
                            hook_span.set_attribute(
                                "modified_result", modified_result is not None
                            )
                            await self.observability_provider.end_span(hook_span)
                            if hook_span.duration_ms():
                                await self.observability_provider.record_metric(
                                    "agent.hook.duration",
                                    hook_span.duration_ms() or 0,
                                    "ms",
                                    tags={
                                        "hook": hook.__class__.__name__,
                                        "phase": "after_tool",
                                        "tool": tool_call.name,
                                    },
                                )

                    if tool_call.name == "schema_retrieve":
                        live_schema_snapshot = _build_live_schema_snapshot(
                            result.metadata,
                            success=result.success,
                        )
                        if live_schema_snapshot:
                            result.metadata.update(live_schema_snapshot)
                            context.metadata.update(live_schema_snapshot)
                            request_metadata.update(live_schema_snapshot)
                    if tool_call.name == "run_sql":
                        live_sql_snapshot = _build_live_sql_snapshot(
                            result.metadata,
                            success=result.success,
                        )
                        if live_sql_snapshot:
                            result.metadata.update(live_sql_snapshot)
                            context.metadata.update(live_sql_snapshot)
                            request_metadata.update(live_sql_snapshot)

                    # Update status card to show completion
                    final_status = "success" if result.success else "error"
                    final_description = (
                        f"Tool completed successfully"
                        if result.success
                        else f"Tool failed: {result.error or 'Unknown error'}"
                    )

                    has_tool_args_access_2 = (
                        self.config.ui_features.can_user_access_feature(
                            UiFeature.UI_FEATURE_SHOW_TOOL_ARGUMENTS, user
                        )
                    )

                    # Audit UI feature access check
                    if (
                        self.audit_logger
                        and self.config.audit_config.enabled
                        and self.config.audit_config.log_ui_feature_checks
                    ):
                        await self.audit_logger.log_ui_feature_access(
                            user=user,
                            feature_name=UiFeature.UI_FEATURE_SHOW_TOOL_ARGUMENTS,
                            access_granted=has_tool_args_access_2,
                            required_groups=self.config.ui_features.feature_group_access.get(
                                UiFeature.UI_FEATURE_SHOW_TOOL_ARGUMENTS, []
                            ),
                            conversation_id=conversation.id,
                            request_id=request_id,
                        )

                    if has_tool_args_access_2:
                        yield UiComponent(
                            rich_component=tool_status_card.set_status(
                                final_status, final_description
                            ),
                            simple_component=SimpleTextComponent(
                                text=final_description
                            ),
                        )

                    has_tool_names_access_2 = (
                        self.config.ui_features.can_user_access_feature(
                            UiFeature.UI_FEATURE_SHOW_TOOL_NAMES, user
                        )
                    )

                    # Audit UI feature access check
                    if (
                        self.audit_logger
                        and self.config.audit_config.enabled
                        and self.config.audit_config.log_ui_feature_checks
                    ):
                        await self.audit_logger.log_ui_feature_access(
                            user=user,
                            feature_name=UiFeature.UI_FEATURE_SHOW_TOOL_NAMES,
                            access_granted=has_tool_names_access_2,
                            required_groups=self.config.ui_features.feature_group_access.get(
                                UiFeature.UI_FEATURE_SHOW_TOOL_NAMES, []
                            ),
                            conversation_id=conversation.id,
                            request_id=request_id,
                        )

                    if has_tool_names_access_2:
                        # Update tool task to completed
                        yield UiComponent(  # type: ignore
                            rich_component=TaskTrackerUpdateComponent.update_task(
                                tool_task.id,
                                status="completed",
                                detail=f"Tool {'completed successfully' if result.success else 'return an error'}",
                            )
                        )

                    # Yield tool result
                    if result.ui_component:
                        # For errors, check if user has access to see error details
                        if not result.success:
                            has_tool_error_access = (
                                self.config.ui_features.can_user_access_feature(
                                    UiFeature.UI_FEATURE_SHOW_TOOL_ERROR, user
                                )
                            )

                            # Audit UI feature access check
                            if (
                                self.audit_logger
                                and self.config.audit_config.enabled
                                and self.config.audit_config.log_ui_feature_checks
                            ):
                                await self.audit_logger.log_ui_feature_access(
                                    user=user,
                                    feature_name=UiFeature.UI_FEATURE_SHOW_TOOL_ERROR,
                                    access_granted=has_tool_error_access,
                                    required_groups=self.config.ui_features.feature_group_access.get(
                                        UiFeature.UI_FEATURE_SHOW_TOOL_ERROR, []
                                    ),
                                    conversation_id=conversation.id,
                                    request_id=request_id,
                                )

                            if has_tool_error_access:
                                yield result.ui_component
                        else:
                            # Success results are always shown if they exist
                            yield result.ui_component

                    # Collect tool result data
                    tool_results.append(
                        {
                            "tool_call_id": tool_call.id,
                            "tool_name": tool_call.name,
                            "success": result.success,
                            "content": (
                                result.result_for_llm
                                if result.success
                                else result.error or "Tool execution failed"
                            ),
                            "metadata": result.metadata,
                        }
                    )

                all_tool_results.extend(tool_results)

                # Add tool responses to conversation
                # For APIs that need all tool results in one message, this helps
                for tool_result in tool_results:
                    tool_response_message = Message(
                        role="tool",
                        content=tool_result["content"],
                        metadata=tool_result.get("metadata", {}),
                        tool_call_id=tool_result["tool_call_id"],
                        tool_result=tool_result.get("metadata", {}),
                    )
                    conversation.add_message(tool_response_message)

                # Rebuild request with tool responses
                request_metadata["tool_iterations"] = tool_iterations
            else:
                # Update status to idle and set completion message
                yield UiComponent(  # type: ignore
                    rich_component=StatusBarUpdateComponent(
                        status="idle",
                        message="Response complete",
                        detail="Ready for next message",
                    )
                )

                # Update chat input placeholder
                yield UiComponent(  # type: ignore
                    rich_component=ChatInputUpdateComponent(
                        placeholder="Ask a follow-up question...", disabled=False
                    )
                )

                # Yield final text response
                final_response_content = _compose_final_response_content(
                    response.content, all_tool_results
                )
                if final_response_content:
                    # Add assistant response to conversation
                    conversation.add_message(
                        Message(role="assistant", content=final_response_content)
                    )
                    yield UiComponent(
                        rich_component=RichTextComponent(
                            content=final_response_content, markdown=True
                        ),
                        simple_component=SimpleTextComponent(
                            text=final_response_content
                        ),
                    )
                break

        # Check if we hit the tool iteration limit
        if tool_iterations >= self.config.max_tool_iterations:
            # The loop exited due to hitting the limit, not due to a natural completion
            logger.warning(
                f"Tool iteration limit reached: {tool_iterations}/{self.config.max_tool_iterations}"
            )

            # Update status bar to show warning
            yield UiComponent(  # type: ignore
                rich_component=StatusBarUpdateComponent(
                    status="warning",
                    message="Tool limit reached",
                    detail=f"Stopped after {tool_iterations} tool executions. The task may be incomplete.",
                )
            )

            # Provide detailed warning message to user
            warning_message = f"""⚠️ **Tool Execution Limit Reached**

The agent stopped after executing {tool_iterations} tools (the configured maximum). The task may not be fully complete.

You can:
- Ask me to continue where I left off
- Adjust the `max_tool_iterations` setting if you need more tool calls
- Break the task into smaller steps"""

            yield UiComponent(
                rich_component=RichTextComponent(
                    content=warning_message, markdown=True
                ),
                simple_component=SimpleTextComponent(
                    text=f"Tool limit reached after {tool_iterations} executions. Task may be incomplete."
                ),
            )

            # Update chat input to suggest follow-up
            yield UiComponent(  # type: ignore
                rich_component=ChatInputUpdateComponent(
                    placeholder="Continue the task or ask me something else...",
                    disabled=False,
                )
            )

        # Save conversation if configured
        if self.config.auto_save_conversations:
            save_span = None
            if self.observability_provider:
                save_span = await self.observability_provider.create_span(
                    "agent.conversation.save",
                    attributes={
                        "conversation_id": conversation_id,
                        "message_count": len(conversation.messages),
                    },
                )

            await self.conversation_store.update_conversation(conversation)

            if self.observability_provider and save_span:
                await self.observability_provider.end_span(save_span)
                if save_span.duration_ms():
                    await self.observability_provider.record_metric(
                        "agent.conversation.save.duration",
                        save_span.duration_ms() or 0,
                        "ms",
                    )

        # Run after_message hooks with observability
        for hook in self.hooks:
            hook_span = None
            if self.observability_provider:
                hook_span = await self.observability_provider.create_span(
                    "agent.hook.after_message",
                    attributes={"hook": hook.__class__.__name__},
                )

            await hook.after_message(conversation)

            if self.observability_provider and hook_span:
                await self.observability_provider.end_span(hook_span)
                if hook_span.duration_ms():
                    await self.observability_provider.record_metric(
                        "agent.hook.duration",
                        hook_span.duration_ms() or 0,
                        "ms",
                        tags={
                            "hook": hook.__class__.__name__,
                            "phase": "after_message",
                        },
                    )

        # End observability span and record metrics
        if self.observability_provider and message_span:
            message_span.set_attribute("tool_iterations", tool_iterations)

            # Track if we hit the tool iteration limit
            hit_tool_limit = tool_iterations >= self.config.max_tool_iterations
            message_span.set_attribute("hit_tool_limit", hit_tool_limit)
            if hit_tool_limit:
                message_span.set_attribute("incomplete_response", True)
                logger.info(
                    f"Tool limit reached - marking response as potentially incomplete"
                )

            await self.observability_provider.end_span(message_span)
            if message_span.duration_ms():
                await self.observability_provider.record_metric(
                    "agent.message.duration",
                    message_span.duration_ms() or 0,
                    "ms",
                    tags={"user_id": user.id, "hit_tool_limit": str(hit_tool_limit)},
                )

    async def get_available_tools(self, user: User) -> List[ToolSchema]:
        """Get tools available to the user."""
        return await self.tool_registry.get_schemas(user)

    async def _prepare_turn_prompt(
        self,
        *,
        user: User,
        user_message: str,
        tool_schemas: List[ToolSchema],
        request_metadata: Dict[str, Any],
        conversation_id: str,
    ) -> tuple[List[ToolSchema], Optional[str], Dict[str, Any]]:
        """Resolve the visible tools and system prompt for the current turn."""
        visible_tool_schemas = list(tool_schemas)
        merged_metadata = dict(request_metadata or {})
        governance_block = ""

        if self.schema_governance_manager is not None:
            governance_snapshot = await self.schema_governance_manager.build_request_metadata(
                conversation_id=conversation_id
            )
            if governance_snapshot:
                merged_metadata.update(governance_snapshot)

            hide_schema_tool, _ = await self.schema_governance_manager.should_hide_schema_tool(
                conversation_id=conversation_id
            )
            if hide_schema_tool:
                visible_tool_schemas = [
                    tool
                    for tool in visible_tool_schemas
                    if tool.name != self.schema_governance_manager.policy.schema_tool_name
                ]

            governance_block = await self.schema_governance_manager.build_prompt_block(
                conversation_id=conversation_id
            )

        system_prompt = await self.system_prompt_builder.build_system_prompt(
            user, visible_tool_schemas
        )
        if governance_block:
            system_prompt = _append_prompt_block(system_prompt, governance_block)

        if self.llm_context_enhancer and system_prompt is not None:
            enhancement_span = None
            if self.observability_provider:
                enhancement_span = await self.observability_provider.create_span(
                    "agent.llm_context.enhance_system_prompt",
                    attributes={
                        "enhancer": self.llm_context_enhancer.__class__.__name__
                    },
                )

            system_prompt = await self.llm_context_enhancer.enhance_system_prompt(
                system_prompt, user_message, user
            )

            if self.observability_provider and enhancement_span:
                await self.observability_provider.end_span(enhancement_span)
                if enhancement_span.duration_ms():
                    await self.observability_provider.record_metric(
                        "agent.llm_context.enhance_system_prompt.duration",
                        enhancement_span.duration_ms() or 0,
                        "ms",
                        tags={"enhancer": self.llm_context_enhancer.__class__.__name__},
                    )

        return visible_tool_schemas, system_prompt, merged_metadata

    async def _build_llm_request(
        self,
        conversation: Conversation,
        tool_schemas: List[ToolSchema],
        user: User,
        system_prompt: Optional[str] = None,
        request_metadata: Optional[Dict[str, Any]] = None,
    ) -> LlmRequest:
        """Build LLM request from conversation and tools."""
        # Apply conversation filters with observability
        filtered_messages = conversation.messages
        for filter in self.conversation_filters:
            filter_span = None
            if self.observability_provider:
                filter_span = await self.observability_provider.create_span(
                    "agent.conversation.filter",
                    attributes={
                        "filter": filter.__class__.__name__,
                        "message_count_before": len(filtered_messages),
                    },
                )

            filtered_messages = await filter.filter_messages(filtered_messages)

            if self.observability_provider and filter_span:
                filter_span.set_attribute("message_count_after", len(filtered_messages))
                await self.observability_provider.end_span(filter_span)
                if filter_span.duration_ms():
                    await self.observability_provider.record_metric(
                        "agent.filter.duration",
                        filter_span.duration_ms() or 0,
                        "ms",
                        tags={"filter": filter.__class__.__name__},
                    )

        messages = []
        for msg in filtered_messages:
            message_metadata = getattr(msg, "metadata", {}) or {}
            tool_result = getattr(msg, "tool_result", None)
            combined_metadata = dict(message_metadata)
            if request_metadata:
                combined_metadata.update(request_metadata)

            llm_msg = LlmMessage(
                role=msg.role,
                content=msg.content,
                tool_calls=msg.tool_calls,
                tool_call_id=msg.tool_call_id,
                metadata=combined_metadata,
                tool_result=tool_result,
            )
            messages.append(llm_msg)

        # Enhance messages with LLM context enhancer
        if self.llm_context_enhancer:
            enhancement_span = None
            if self.observability_provider:
                enhancement_span = await self.observability_provider.create_span(
                    "agent.llm_context.enhance_user_messages",
                    attributes={
                        "enhancer": self.llm_context_enhancer.__class__.__name__,
                        "message_count": len(messages),
                    },
                )

            messages = await self.llm_context_enhancer.enhance_user_messages(
                messages, user
            )

            if self.observability_provider and enhancement_span:
                enhancement_span.set_attribute("message_count_after", len(messages))
                await self.observability_provider.end_span(enhancement_span)
                if enhancement_span.duration_ms():
                    await self.observability_provider.record_metric(
                        "agent.llm_context.enhance_user_messages.duration",
                        enhancement_span.duration_ms() or 0,
                        "ms",
                        tags={"enhancer": self.llm_context_enhancer.__class__.__name__},
                    )

        return LlmRequest(
            messages=messages,
            tools=tool_schemas if tool_schemas else None,
            user=user,
            temperature=self.config.temperature,
            max_tokens=self.config.max_tokens,
            stream=self.config.stream_responses,
            system_prompt=system_prompt,
            metadata=dict(request_metadata or {}),
        )

    async def _send_llm_request(self, request: LlmRequest) -> LlmResponse:
        """Send LLM request with middleware and observability."""
        # Apply before_llm_request middlewares with observability
        for middleware in self.llm_middlewares:
            mw_span = None
            if self.observability_provider:
                mw_span = await self.observability_provider.create_span(
                    "agent.middleware.before_llm",
                    attributes={"middleware": middleware.__class__.__name__},
                )

            request = await middleware.before_llm_request(request)

            if self.observability_provider and mw_span:
                await self.observability_provider.end_span(mw_span)
                if mw_span.duration_ms():
                    await self.observability_provider.record_metric(
                        "agent.middleware.duration",
                        mw_span.duration_ms() or 0,
                        "ms",
                        tags={
                            "middleware": middleware.__class__.__name__,
                            "phase": "before_llm",
                        },
                    )

        # Create observability span for LLM call
        llm_span = None
        if self.observability_provider:
            llm_span = await self.observability_provider.create_span(
                "llm.request",
                attributes={
                    "model": getattr(self.llm_service, "model", "unknown"),
                    "stream": request.stream,
                },
            )

        # Send request
        response = await self.llm_service.send_request(request)

        # End span and record metrics
        if self.observability_provider and llm_span:
            await self.observability_provider.end_span(llm_span)
            if llm_span.duration_ms():
                await self.observability_provider.record_metric(
                    "llm.request.duration", llm_span.duration_ms() or 0, "ms"
                )

        # Apply after_llm_response middlewares with observability
        for middleware in self.llm_middlewares:
            mw_span = None
            if self.observability_provider:
                mw_span = await self.observability_provider.create_span(
                    "agent.middleware.after_llm",
                    attributes={"middleware": middleware.__class__.__name__},
                )

            response = await middleware.after_llm_response(request, response)

            if self.observability_provider and mw_span:
                await self.observability_provider.end_span(mw_span)
                if mw_span.duration_ms():
                    await self.observability_provider.record_metric(
                        "agent.middleware.duration",
                        mw_span.duration_ms() or 0,
                        "ms",
                        tags={
                            "middleware": middleware.__class__.__name__,
                            "phase": "after_llm",
                        },
                    )

        return response

    async def _handle_streaming_response(self, request: LlmRequest) -> LlmResponse:
        """Handle streaming response from LLM."""
        # Apply before_llm_request middlewares with observability
        for middleware in self.llm_middlewares:
            mw_span = None
            if self.observability_provider:
                mw_span = await self.observability_provider.create_span(
                    "agent.middleware.before_llm",
                    attributes={
                        "middleware": middleware.__class__.__name__,
                        "stream": True,
                    },
                )

            request = await middleware.before_llm_request(request)

            if self.observability_provider and mw_span:
                await self.observability_provider.end_span(mw_span)
                if mw_span.duration_ms():
                    await self.observability_provider.record_metric(
                        "agent.middleware.duration",
                        mw_span.duration_ms() or 0,
                        "ms",
                        tags={
                            "middleware": middleware.__class__.__name__,
                            "phase": "before_llm",
                            "stream": "true",
                        },
                    )

        accumulated_content = ""
        accumulated_tool_calls = []

        # Create span for streaming
        stream_span = None
        if self.observability_provider:
            stream_span = await self.observability_provider.create_span(
                "llm.stream",
                attributes={"model": getattr(self.llm_service, "model", "unknown")},
            )

        async for chunk in self.llm_service.stream_request(request):
            if chunk.content:
                accumulated_content += chunk.content
                # Could yield intermediate TextChunk here

            if chunk.tool_calls:
                accumulated_tool_calls.extend(chunk.tool_calls)

        # End streaming span
        if self.observability_provider and stream_span:
            stream_span.set_attribute("content_length", len(accumulated_content))
            stream_span.set_attribute("tool_call_count", len(accumulated_tool_calls))
            await self.observability_provider.end_span(stream_span)
            if stream_span.duration_ms():
                await self.observability_provider.record_metric(
                    "llm.stream.duration", stream_span.duration_ms() or 0, "ms"
                )

        response = LlmResponse(
            content=accumulated_content if accumulated_content else None,
            tool_calls=accumulated_tool_calls if accumulated_tool_calls else None,
        )

        # Apply after_llm_response middlewares with observability
        for middleware in self.llm_middlewares:
            mw_span = None
            if self.observability_provider:
                mw_span = await self.observability_provider.create_span(
                    "agent.middleware.after_llm",
                    attributes={
                        "middleware": middleware.__class__.__name__,
                        "stream": True,
                    },
                )

            response = await middleware.after_llm_response(request, response)

            if self.observability_provider and mw_span:
                await self.observability_provider.end_span(mw_span)
                if mw_span.duration_ms():
                    await self.observability_provider.record_metric(
                        "agent.middleware.duration",
                        mw_span.duration_ms() or 0,
                        "ms",
                        tags={
                            "middleware": middleware.__class__.__name__,
                            "phase": "after_llm",
                            "stream": "true",
                        },
                    )

        return response
