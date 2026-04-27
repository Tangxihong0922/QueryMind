"""Runtime assembly helpers for QueryMind evaluation."""

from __future__ import annotations

import asyncio
import os
import logging
import uuid
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Protocol

from QueryMind.capabilities.agent_memory import AgentMemory
from QueryMind.capabilities.schema_extracter import SchemaExtractor, SchemaSyncEngine
from QueryMind.capabilities.sql_runner import SqlRunner
from QueryMind.core.agent import (
    Agent,
    AgentConfig,
    build_schema_governance_stack,
    build_sql_governance_stack,
)
from QueryMind.core.enhancer import (
    CompositeLlmContextEnhancer,
    DefaultLlmContextEnhancer,
    SchemaContextEnhancer,
)
from QueryMind.core.enricher import SchemaRetrieveContextEnricher
from QueryMind.core.llm import LlmService
from QueryMind.core.registry import ToolRegistry
from QueryMind.core.storage import Conversation, ConversationStore, Message
from QueryMind.core.user import RequestContext, User, UserResolver
from QueryMind.tools import RunSqlTool, SchemaRetrieveTool
from rls_registry import RLSToolRegistry

from .base import SqlTestCase
from .sql_policy import is_read_only_sql

logger = logging.getLogger(__name__)


def _env_bool(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


class EvaluationConversationStore(ConversationStore):
    """In-memory conversation store with a get_recent helper."""

    def __init__(self) -> None:
        self._conversations: Dict[str, Conversation] = {}

    async def create_conversation(
        self, conversation_id: str, user: User, initial_message: str
    ) -> Conversation:
        conversation = Conversation(
            id=conversation_id,
            user=user,
            messages=[Message(role="user", content=initial_message)],
        )
        self._conversations[conversation_id] = conversation
        return conversation

    async def get_conversation(
        self, conversation_id: str, user: User
    ) -> Optional[Conversation]:
        conversation = self._conversations.get(conversation_id)
        if conversation and conversation.user.id == user.id:
            return conversation
        return None

    async def update_conversation(self, conversation: Conversation) -> None:
        self._conversations[conversation.id] = conversation

    async def delete_conversation(self, conversation_id: str, user: User) -> bool:
        conversation = await self.get_conversation(conversation_id, user)
        if conversation:
            del self._conversations[conversation_id]
            return True
        return False

    async def list_conversations(
        self, user: User, limit: int = 50, offset: int = 0
    ) -> List[Conversation]:
        conversations = [
            conversation
            for conversation in self._conversations.values()
            if conversation.user.id == user.id
        ]
        conversations.sort(key=lambda item: item.updated_at, reverse=True)
        return conversations[offset : offset + limit]

    async def get_recent(
        self, conversation_id: str, limit: int = 10
    ) -> List[Message]:
        conversation = self._conversations.get(conversation_id)
        if not conversation:
            return []
        return conversation.messages[-limit:]


class NoOpAgentMemory(AgentMemory):
    """Minimal AgentMemory implementation for evaluation sessions."""

    async def save_tool_usage(
        self,
        question: str,
        tool_name: str,
        args: Dict[str, Any],
        context: Any,
        success: bool = True,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> None:
        return None

    async def save_text_memory(self, content: str, context: Any) -> Any:
        return None

    async def search_similar_usage(
        self,
        question: str,
        context: Any,
        *,
        limit: int = 10,
        similarity_threshold: float = 0.7,
        tool_name_filter: Optional[str] = None,
    ) -> List[Any]:
        return []

    async def search_text_memories(
        self,
        query: str,
        context: Any,
        *,
        limit: int = 10,
        similarity_threshold: float = 0.7,
    ) -> List[Any]:
        return []

    async def get_recent_memories(self, context: Any, limit: int = 10) -> List[Any]:
        return []

    async def get_recent_text_memories(self, context: Any, limit: int = 10) -> List[Any]:
        return []

    async def delete_by_id(self, context: Any, memory_id: str) -> bool:
        return False

    async def delete_text_memory(self, context: Any, memory_id: str) -> bool:
        return False

    async def clear_memories(
        self,
        context: Any,
        tool_name: Optional[str] = None,
        before_date: Optional[str] = None,
    ) -> int:
        return 0


class EvaluationSqlRunner(SqlRunner):
    """Wrap a SqlRunner with evaluation-time SQL policy enforcement."""

    def __init__(self, inner: SqlRunner, *, allow_write_sql: bool = False) -> None:
        self._inner = inner
        self._allow_write_sql = allow_write_sql

    async def run_sql(self, args: Any, context: Any) -> Any:
        if not self._allow_write_sql and not is_read_only_sql(args.sql):
            raise ValueError("Non-read-only SQL blocked during evaluation")
        return await self._inner.run_sql(args, context)


class StaticUserResolver(UserResolver):
    """Resolve every request to a fixed user."""

    def __init__(self, user: User):
        self._user = user

    async def resolve_user(self, request_context: RequestContext) -> User:
        return self._user


@dataclass
class EvaluationSession:
    """Per-testcase runtime state."""

    runtime: "EvaluationRuntime"
    test_case: SqlTestCase
    user: User
    conversation_id: str
    conversation_store: EvaluationConversationStore
    agent_memory: AgentMemory
    request_context: RequestContext
    agent: Agent


@dataclass
class EvaluationRuntime:
    """Shared runtime for one database profile."""

    database_id: str
    dialect: str
    sql_runner: SqlRunner
    schema_extractor: Optional[SchemaExtractor]
    agent_llm_service: LlmService
    schema_memory: Any
    schema_sync_mode: str = "sync"
    allow_write_sql: bool = False
    default_user: User = field(
        default_factory=lambda: User(
            id="evaluation",
            username="evaluation",
            email="evaluation@example.com",
            group_memberships=["admin", "user"],
        )
    )
    agent_config: AgentConfig = field(
        default_factory=lambda: AgentConfig(
            stream_responses=False,
            auto_save_conversations=True,
            include_thinking_indicators=False,
            temperature=0.0,
        )
    )
    schema_management_service: Any = None
    observability_provider: Any = None
    _initialized: bool = field(default=False, init=False, repr=False)
    schema_init_result: Any = field(default=None, init=False, repr=False)
    _init_lock: Any = field(default=None, init=False, repr=False)

    async def ensure_initialized(self, *, force: bool = False) -> None:
        """Initialize schema memory and optionally sync schemas from the database."""
        if self._initialized and not force:
            return

        if self._init_lock is None:
            self._init_lock = asyncio.Lock()

        async with self._init_lock:
            if self._initialized and not force:
                return

            sync_mode = self.schema_sync_mode.strip().lower()
            if sync_mode not in {"sync", "reuse_existing"}:
                raise ValueError(
                    "schema_sync_mode must be either 'sync' or 'reuse_existing'"
                )

            if hasattr(self.schema_memory, "initialize"):
                await self.schema_memory.initialize()

            if sync_mode == "reuse_existing":
                self.schema_init_result = {
                    "success": True,
                    "mode": sync_mode,
                    "schema_sync_skipped": True,
                }
                logger.info(
                    "Evaluation schema memory initialized in reuse_existing mode; "
                    "schema sync skipped."
                )
            else:
                if self.schema_extractor is None:
                    raise ValueError(
                        "schema_extractor is required when schema_sync_mode='sync'"
                    )

                engine = SchemaSyncEngine(
                    self.schema_memory,
                    NoOpAgentMemory(),
                    request_delay=1.0,
                    save_retry_attempts=3,
                    save_retry_delay=1.0,
                    max_consecutive_failures=5,
                    max_consecutive_same_errors=3,
                    max_consecutive_transient_failures=8,
                    resume_existing_tables=True,
                )
                self.schema_init_result = await engine.initialize(
                    self.schema_extractor,
                    force=force,
                )
                logger.info(
                    "Evaluation schema sync completed: %s",
                    getattr(self.schema_init_result, "summary", self.schema_init_result),
                )
            self._initialized = True

    def _build_tool_registry(self) -> ToolRegistry:
        registry = RLSToolRegistry(config_path="rls_config.yaml")
        registry.register_local_tool(
            RunSqlTool(
                sql_runner=EvaluationSqlRunner(
                    self.sql_runner,
                    allow_write_sql=self.allow_write_sql,
                )
            ),
            [],
        )
        registry.register_local_tool(SchemaRetrieveTool(schema_memory=self.schema_memory), [])
        return registry

    def _build_llm_context_enhancer(
        self,
        agent_memory: Optional[AgentMemory],
        governance_enhancer: Optional[Any] = None,
    ) -> CompositeLlmContextEnhancer:
        enhancers = []
        if governance_enhancer is not None:
            enhancers.append(governance_enhancer)
        enhancers.append(SchemaContextEnhancer())
        if agent_memory is not None:
            enhancers.append(DefaultLlmContextEnhancer(agent_memory))
        return CompositeLlmContextEnhancer(enhancers)

    async def create_session(self, test_case: SqlTestCase) -> EvaluationSession:
        """Create an isolated agent session for one testcase."""
        await self.ensure_initialized()

        user = test_case.build_user(self.default_user)
        conversation_id = test_case.effective_conversation_id
        conversation_store = EvaluationConversationStore()
        agent_memory: AgentMemory = NoOpAgentMemory()
        user_resolver = StaticUserResolver(user)
        request_context = RequestContext(
            cookies={"user_id": user.id},
            headers={},
            metadata={
                "evaluation": True,
                "database_id": test_case.database_id,
                "dialect": test_case.dialect,
                "test_case_id": test_case.id,
                "allow_metadata_query": _env_bool("ALLOW_METADATA_QUERY", False),
            },
        )

        governance_stack = build_schema_governance_stack()
        sql_governance_stack = build_sql_governance_stack()
        agent = Agent(
            llm_service=self.agent_llm_service,
            tool_registry=self._build_tool_registry(),
            user_resolver=user_resolver,
            agent_memory=agent_memory,
            conversation_store=conversation_store,
            config=self.agent_config,
            hooks=[governance_stack.hook, sql_governance_stack.hook],
            llm_middlewares=[governance_stack.middleware, sql_governance_stack.middleware],
            llm_context_enhancer=CompositeLlmContextEnhancer(
                [
                    governance_stack.enhancer,
                    SchemaContextEnhancer(),
                    DefaultLlmContextEnhancer(agent_memory),
                ]
            ),
            context_enrichers=[
                SchemaRetrieveContextEnricher(conversation_store=conversation_store)
            ],
            observability_provider=self.observability_provider,
            schema_memory=self.schema_memory,
            schema_management_service=self.schema_management_service,
            schema_governance_manager=governance_stack.manager,
        )

        return EvaluationSession(
            runtime=self,
            test_case=test_case,
            user=user,
            conversation_id=conversation_id,
            conversation_store=conversation_store,
            agent_memory=agent_memory,
            request_context=request_context,
            agent=agent,
        )


class EvaluationRuntimeResolver(Protocol):
    """Resolve the runtime for a testcase."""

    async def resolve(self, test_case: SqlTestCase) -> EvaluationRuntime:
        raise NotImplementedError


class DictEvaluationRuntimeResolver:
    """Dictionary-backed runtime resolver."""

    def __init__(self, runtimes: Dict[str, EvaluationRuntime]):
        self._runtimes = runtimes

    async def resolve(self, test_case: SqlTestCase) -> EvaluationRuntime:
        try:
            return self._runtimes[test_case.database_id]
        except KeyError as exc:
            raise KeyError(
                f"No evaluation runtime configured for database_id='{test_case.database_id}'"
            ) from exc
