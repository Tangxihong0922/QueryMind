from __future__ import annotations

import asyncio
import logging
from pathlib import Path
import sys
from types import SimpleNamespace

from pydantic import BaseModel

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from QueryMind.core.agent.governance import (  # noqa: E402
    SchemaGovernanceManager,
    SchemaGovernancePolicy,
)
from QueryMind.core.agent.sql_governance import (  # noqa: E402
    SqlGovernanceManager,
)
from QueryMind.core.agent.agent import (  # noqa: E402
    _build_live_schema_snapshot,
)
from QueryMind.core.enhancer.schema_retrieve import SchemaContextEnhancer  # noqa: E402
from QueryMind.core.enricher.schema_retrieve import (  # noqa: E402
    SchemaRetrieveContextEnricher,
)
from QueryMind.core.hook.schema_governance import SchemaGovernanceHook  # noqa: E402
from QueryMind.core.middleware.schema_governance import (  # noqa: E402
    SchemaGovernanceMiddleware,
)
from QueryMind.core.middleware.sql_governance import (  # noqa: E402
    SqlGovernanceMiddleware,
)
from QueryMind.core.llm import LlmMessage, LlmRequest  # noqa: E402
from QueryMind.core.registry import ToolRegistry  # noqa: E402
from QueryMind.core.tool import Tool, ToolCall, ToolContext  # noqa: E402
from QueryMind.core.tool import ToolSchema  # noqa: E402
from QueryMind.core.tool.models import ToolResult  # noqa: E402
from QueryMind.core.user import User  # noqa: E402
from QueryMind.capabilities.agent_memory.base import AgentMemory  # noqa: E402
from QueryMind.tools.schema_retrieve import SchemaRetrieveTool, SchemaRetrieveToolArgs  # noqa: E402


def _make_user() -> User:
    return User(
        id="u1",
        username="tester",
        email="tester@example.com",
        group_memberships=["user"],
    )


class _DummyArgs(BaseModel):
    value: int


class _DummyTool(Tool[_DummyArgs]):
    @property
    def name(self) -> str:
        return "dummy_tool"

    @property
    def description(self) -> str:
        return "dummy"

    def get_args_schema(self):
        return _DummyArgs

    async def execute(self, context: ToolContext, args: _DummyArgs) -> ToolResult:
        return ToolResult(success=True, result_for_llm="ok", metadata={"value": args.value})


class _DummyAgentMemory(AgentMemory):
    async def save_tool_usage(self, *args, **kwargs):
        return None

    async def save_text_memory(self, *args, **kwargs):
        return None

    async def search_similar_usage(self, *args, **kwargs):
        return []

    async def search_text_memories(self, *args, **kwargs):
        return []

    async def get_recent_memories(self, *args, **kwargs):
        return []

    async def get_recent_text_memories(self, *args, **kwargs):
        return []

    async def delete_by_id(self, *args, **kwargs):
        return False

    async def delete_text_memory(self, *args, **kwargs):
        return False

    async def clear_memories(self, *args, **kwargs):
        return 0


class _FailingSchemaMemory:
    async def search_schema(self, *args, **kwargs):
        raise RuntimeError("boom")


class _NoopConversationStore:
    async def get_recent(self, *args, **kwargs):
        return []


class _SchemaCallHistoryStore:
    def __init__(self, history):
        self._history = history

    async def get_recent(self, *args, **kwargs):
        return self._history


def test_schema_governance_hook_records_schema_state_and_locks() -> None:
    policy = SchemaGovernancePolicy(schema_retrieve_successes_to_lock=1)
    manager = SchemaGovernanceManager(policy)
    hook = SchemaGovernanceHook(manager)

    result = ToolResult(
        success=True,
        result_for_llm="schema ok",
        metadata={
            "tool_name": "schema_retrieve",
            "conversation_id": "conv-1",
            "request_id": "req-1",
            "query": "product",
            "selected_tables": ["production.product"],
        },
    )

    asyncio.run(hook.after_tool(result))
    state = asyncio.run(manager.get_state("conv-1"))

    assert state.schema_retrieve_calls == 1
    assert state.schema_retrieve_successes == 1
    assert state.schema_locked is True
    assert state.lock_reason == "enough_schema"
    assert result.metadata["schema_governance"]["schema_locked"] is True
    assert result.metadata["last_schema_summary"]["lock_reason"] == "enough_schema"


def test_schema_governance_manager_builds_locked_prompt_block() -> None:
    manager = SchemaGovernanceManager(SchemaGovernancePolicy())
    state = asyncio.run(manager.get_state("conv-locked"))
    state.schema_locked = True
    state.lock_reason = "schema_retrieve_empty_results"
    state.last_schema_summary = {
        "summary_text": "schema_retrieve[hybrid] query='product' -> 0 table(s)",
    }

    block = asyncio.run(manager.build_prompt_block(conversation_id="conv-locked"))

    assert "schema_locked: true" in block
    assert "`schema_retrieve` is locked for this turn" in block
    assert "Enter SQL draft mode now" in block
    assert "Latest schema snapshot" in block
    assert "read-only metadata discovery is allowed" in block
    assert "candidate tables and join paths" in block


def test_schema_governance_empty_lock_enables_metadata_query_flag() -> None:
    manager = SchemaGovernanceManager(SchemaGovernancePolicy())
    state = asyncio.run(manager.get_state("conv-empty-lock"))
    state.schema_locked = True
    state.lock_reason = "schema_retrieve_empty_results"
    state.last_schema_summary = {
        "summary_text": "schema_retrieve[hybrid] query='product' -> 0 table(s)",
    }

    snapshot = asyncio.run(manager.build_request_metadata(conversation_id="conv-empty-lock"))

    assert snapshot["allow_metadata_query"] is True
    assert snapshot["schema_governance"]["allow_metadata_query"] is True


def test_schema_governance_locks_after_two_empty_results() -> None:
    policy = SchemaGovernancePolicy(schema_retrieve_empty_results_limit=2)
    manager = SchemaGovernanceManager(policy)
    hook = SchemaGovernanceHook(manager)

    for request_id in ("req-1", "req-2"):
        result = ToolResult(
            success=False,
            result_for_llm="no schema",
            metadata={
                "tool_name": "schema_retrieve",
                "conversation_id": "conv-empty",
                "request_id": request_id,
                "query": "product",
                "total_results": 0,
                "selected_tables": [],
            },
        )
        asyncio.run(hook.after_tool(result))

    state = asyncio.run(manager.get_state("conv-empty"))
    snapshot = asyncio.run(manager.build_request_metadata(conversation_id="conv-empty"))

    assert state.consecutive_empty_results == 2
    assert state.schema_locked is True
    assert state.lock_reason == "schema_retrieve_empty_results"
    assert snapshot["last_schema_summary"]["lock_reason"] == "schema_retrieve_empty_results"


def test_schema_governance_locks_after_two_no_new_table_results() -> None:
    policy = SchemaGovernancePolicy(
        schema_retrieve_successes_to_lock=99,
        schema_retrieve_max_calls=99,
    )
    manager = SchemaGovernanceManager(policy)
    hook = SchemaGovernanceHook(manager)

    first = ToolResult(
        success=True,
        result_for_llm="schema ok",
        metadata={
            "tool_name": "schema_retrieve",
            "conversation_id": "conv-repeat",
            "request_id": "req-1",
            "query": "product",
            "total_results": 1,
            "selected_tables": ["production.product"],
        },
    )
    repeated = ToolResult(
        success=True,
        result_for_llm="schema ok again",
        metadata={
            "tool_name": "schema_retrieve",
            "conversation_id": "conv-repeat",
            "request_id": "req-2",
            "query": "product details",
            "total_results": 1,
            "selected_tables": ["production.product"],
        },
    )
    repeated_again = ToolResult(
        success=True,
        result_for_llm="schema ok once more",
        metadata={
            "tool_name": "schema_retrieve",
            "conversation_id": "conv-repeat",
            "request_id": "req-3",
            "query": "product attributes",
            "total_results": 1,
            "selected_tables": ["production.product"],
        },
    )

    asyncio.run(hook.after_tool(first))
    asyncio.run(hook.after_tool(repeated))
    asyncio.run(hook.after_tool(repeated_again))

    state = asyncio.run(manager.get_state("conv-repeat"))
    snapshot = asyncio.run(manager.build_request_metadata(conversation_id="conv-repeat"))

    assert state.consecutive_no_new_tables == 2
    assert state.schema_locked is True
    assert state.lock_reason == "schema_retrieve_no_new_tables"
    assert snapshot["last_schema_summary"]["summary_text"].endswith(
        "lock=schema_retrieve_no_new_tables"
    )


def test_schema_governance_middleware_hides_schema_tool_once_locked() -> None:
    policy = SchemaGovernancePolicy()
    manager = SchemaGovernanceManager(policy)
    state = asyncio.run(manager.get_state("conv-1"))
    state.schema_locked = True
    state.lock_reason = "enough_schema"
    state.last_schema_summary = {
        "summary_text": "schema_retrieve[hybrid] query='product' -> 1 table(s): production.product",
        "query": "product",
        "total_results": 1,
        "selected_tables": ["production.product"],
        "schema_locked": True,
        "lock_reason": "enough_schema",
    }

    middleware = SchemaGovernanceMiddleware(manager)
    request = LlmRequest(
        messages=[LlmMessage(role="user", content="need sql")],
        tools=[
            ToolSchema(name="schema_retrieve", description="schema", parameters={}),
            ToolSchema(name="run_sql", description="sql", parameters={}),
        ],
        user=_make_user(),
        metadata={
            "conversation_id": "conv-1",
            "request_id": "req-1",
            "tool_iterations": 2,
            "max_tool_iterations": 10,
        },
    )

    updated = asyncio.run(middleware.before_llm_request(request))

    assert [tool.name for tool in updated.tools or []] == ["run_sql"]
    assert updated.system_prompt is None
    assert updated.metadata["last_schema_summary"]["query"] == "product"
    assert updated.metadata["schema_governance"]["lock_reason"] == "enough_schema"
    assert updated.metadata["schema_runtime_recap"]


def test_schema_governance_runtime_notice_is_emitted_via_sql_middleware() -> None:
    schema_manager = SchemaGovernanceManager(SchemaGovernancePolicy())
    schema_state = asyncio.run(schema_manager.get_state("conv-1"))
    schema_state.schema_locked = True
    schema_state.lock_reason = "enough_schema"
    schema_state.last_schema_summary = {
        "summary_text": "schema_retrieve[hybrid] query='product' -> 1 table(s): production.product",
        "query": "product",
        "total_results": 1,
        "selected_tables": ["production.product"],
        "schema_locked": True,
        "lock_reason": "enough_schema",
    }

    schema_middleware = SchemaGovernanceMiddleware(schema_manager)
    sql_middleware = SqlGovernanceMiddleware(SqlGovernanceManager())
    request = LlmRequest(
        messages=[LlmMessage(role="user", content="need sql")],
        tools=[
            ToolSchema(name="schema_retrieve", description="schema", parameters={}),
            ToolSchema(name="run_sql", description="sql", parameters={}),
        ],
        user=_make_user(),
        system_prompt="base prompt",
        metadata={
            "conversation_id": "conv-1",
            "request_id": "req-1",
            "tool_iterations": 2,
            "max_tool_iterations": 10,
        },
    )

    updated = asyncio.run(schema_middleware.before_llm_request(request))
    updated = asyncio.run(sql_middleware.before_llm_request(updated))

    assert any(
        msg.role == "user"
        and "## Runtime Context Notice" in msg.content
        and "schema_retrieve unavailable this turn: yes" in msg.content
        and "lock reason: enough_schema" in msg.content
        for msg in updated.messages
    )
    assert any(
        msg.role == "user"
        and "Schema recap:" in msg.content
        and "schema_retrieve[hybrid] query='product'" in msg.content
        for msg in updated.messages
    )


def test_schema_context_enhancer_skips_search_rules_when_locked() -> None:
    enhancer = SchemaContextEnhancer()
    prompt = asyncio.run(
        enhancer.enhance_system_prompt(
            (
                "base prompt\n\n"
                "## Schema Governance\n\n"
                "- schema_locked: true\n"
                "- `schema_retrieve` is locked for this turn.\n"
                "- Draft SQL directly from the schema already discovered.\n"
            ),
            "need sql",
            _make_user(),
        )
    )

    assert "Search Mode Selection Rules" not in prompt


def test_schema_context_enhancer_prefers_explicit_last_schema_summary() -> None:
    enhancer = SchemaContextEnhancer()
    messages = [
        LlmMessage(
            role="assistant",
            content="previous",
            metadata={
                "last_schema_summary": {
                    "search_mode": "hybrid",
                    "query": "product",
                    "total_results": 0,
                    "selected_tables": [],
                    "summary_text": "schema_retrieve[hybrid] query='product' -> 0 table(s)",
                    "lock_reason": "schema_retrieve_empty_results",
                }
            },
        )
    ]

    updated = asyncio.run(enhancer.enhance_user_messages(messages, _make_user()))

    assert updated[0].role == "user"
    assert "## Schema Context" in updated[0].content
    assert "Results: 0 table(s)" in updated[0].content
    assert "lock_reason" not in updated[0].content


def test_schema_context_enhancer_prefers_schema_retrieve_context_snapshot() -> None:
    enhancer = SchemaContextEnhancer()
    messages = [
        LlmMessage(
            role="assistant",
            content="previous",
            metadata={
                "schema_retrieve_context": {
                    "seed_tables": ["production.product"],
                    "seed_table_refs": [
                        {
                            "full_name": "production.product",
                            "schema_name": "production",
                            "table_name": "product",
                        }
                    ],
                    "last_query": "product",
                    "last_search_mode": "expand",
                    "graph_hint": "expand",
                    "required_fields": ["productid"],
                    "domain_filter": "sales",
                    "summary_text": "schema_retrieve[expand] query='product' -> 1 table(s): production.product",
                    "schema_locked": True,
                    "lock_reason": "enough_schema",
                }
            },
        )
    ]

    updated = asyncio.run(enhancer.enhance_user_messages(messages, _make_user()))

    assert updated[0].role == "user"
    assert "## Schema Context" in updated[0].content
    assert "Search Mode: expand" in updated[0].content
    assert "Results: 1 table(s)" in updated[0].content
    assert "production.product" in updated[0].content
    assert "Lock: enough_schema" in updated[0].content


def test_schema_retrieve_context_enricher_prefers_explicit_last_schema_summary() -> None:
    enricher = SchemaRetrieveContextEnricher(
        conversation_store=_NoopConversationStore()
    )
    context = ToolContext(
        user=_make_user(),
        conversation_id="conv-ctx",
        request_id="req-ctx",
        agent_memory=_DummyAgentMemory(),
        metadata={
            "last_schema_summary": {
                "search_mode": "hybrid",
                "query": "product",
                "selected_tables": ["production.product"],
                "selected_table_refs": [
                    {
                        "full_name": "production.product",
                        "schema_name": "production",
                        "table_name": "product",
                    }
                ],
                "total_results": 1,
                "summary_text": "schema_retrieve[hybrid] query='product' -> 1 table(s): production.product | new=1",
                "schema_locked": True,
                "lock_reason": "enough_schema",
            }
        },
    )

    updated = asyncio.run(enricher.enrich_context(context))

    assert updated.metadata["schema_retrieve_context"]["seed_tables"] == [
        "production.product"
    ]
    assert updated.metadata["schema_retrieve_context"]["lock_reason"] == "enough_schema"


def test_schema_retrieve_context_enricher_suppresses_history_miss_log_without_schema_history(
    caplog,
) -> None:
    enricher = SchemaRetrieveContextEnricher(
        conversation_store=_NoopConversationStore()
    )
    context = ToolContext(
        user=_make_user(),
        conversation_id="conv-empty",
        request_id="req-empty",
        agent_memory=_DummyAgentMemory(),
        metadata={},
    )

    with caplog.at_level(logging.DEBUG):
        asyncio.run(enricher.enrich_context(context))

    assert not any(
        "No previous schema_retrieve result found in history" in record.message
        for record in caplog.records
    )


def test_schema_retrieve_context_enricher_logs_history_miss_after_schema_call_signal(
    caplog,
) -> None:
    enricher = SchemaRetrieveContextEnricher(
        conversation_store=_SchemaCallHistoryStore(
            [
                SimpleNamespace(
                    role="assistant",
                    content="tool call",
                    metadata={},
                    tool_calls=[SimpleNamespace(name="schema_retrieve")],
                    tool_result=None,
                )
            ]
        )
    )
    context = ToolContext(
        user=_make_user(),
        conversation_id="conv-history",
        request_id="req-history",
        agent_memory=_DummyAgentMemory(),
        metadata={},
    )

    with caplog.at_level(logging.DEBUG):
        asyncio.run(enricher.enrich_context(context))

    assert any(
        "No previous schema_retrieve result found in history" in record.message
        for record in caplog.records
    )


def test_tool_registry_adds_governance_metadata_for_hooks() -> None:
    registry = ToolRegistry()
    registry.register_local_tool(_DummyTool(), [])
    context = ToolContext(
        user=_make_user(),
        conversation_id="conv-1",
        request_id="req-1",
        agent_memory=_DummyAgentMemory(),
        metadata={
            "tool_iterations": 3,
            "max_tool_iterations": 10,
            "dialect": "postgres",
        },
    )
    result = asyncio.run(
        registry.execute(
            ToolCall(id="call-1", name="dummy_tool", arguments={"value": 7}),
            context,
        )
    )

    assert result.metadata["tool_name"] == "dummy_tool"
    assert result.metadata["conversation_id"] == "conv-1"
    assert result.metadata["request_id"] == "req-1"
    assert result.metadata["tool_iterations"] == 3
    assert result.metadata["max_tool_iterations"] == 10


def test_schema_retrieve_failure_preserves_tool_metadata() -> None:
    tool = SchemaRetrieveTool(schema_memory=_FailingSchemaMemory())
    context = ToolContext(
        user=_make_user(),
        conversation_id="conv-1",
        request_id="req-1",
        agent_memory=_DummyAgentMemory(),
    )
    args = SchemaRetrieveToolArgs(query="product")

    result = asyncio.run(tool.execute(context, args))

    assert result.success is False
    assert result.metadata["tool_name"] == "schema_retrieve"
    assert result.metadata["query"] == "product"
    assert result.metadata["selected_tables"] == []


def test_live_schema_snapshot_is_written_back_into_tool_context() -> None:
    context = ToolContext(
        user=_make_user(),
        conversation_id="conv-live",
        request_id="req-live",
        agent_memory=_DummyAgentMemory(),
        metadata={},
    )

    snapshot = _build_live_schema_snapshot(
        {
            "tool_name": "schema_retrieve",
            "query": "customer orders",
            "search_mode": "expand",
            "graph_hint": "expand",
            "domain_filter": "sales",
            "required_fields": ["customer_id", "order_id"],
            "total_results": 1,
            "selected_tables": ["sales.orders"],
            "selected_table_refs": [
                {
                    "full_name": "sales.orders",
                    "schema_name": "sales",
                    "table_name": "orders",
                }
            ],
        },
        success=True,
    )

    context.metadata.update(snapshot)

    assert context.metadata["last_schema_summary"]["selected_tables"] == [
        "sales.orders"
    ]
    assert context.metadata["schema_retrieve_context"]["seed_tables"] == [
        "sales.orders"
    ]
    assert context.metadata["schema_retrieve_context"]["expand_mode"] is True

    locked_snapshot = _build_live_schema_snapshot(
        {
            "tool_name": "schema_retrieve",
            "query": "customer orders",
            "search_mode": "hybrid",
            "graph_hint": "domain",
            "selected_tables": ["sales.orders"],
            "selected_table_refs": [],
            "total_results": 1,
            "schema_governance": {
                "schema_locked": True,
                "lock_reason": "schema_retrieve_no_new_tables",
            },
        },
        success=True,
    )

    context.metadata.update(locked_snapshot)

    assert context.metadata["last_schema_summary"]["schema_locked"] is True
    assert context.metadata["schema_retrieve_context"]["schema_locked"] is True
    assert context.metadata["schema_retrieve_context"]["lock_reason"] == (
        "schema_retrieve_no_new_tables"
    )

    empty_snapshot = _build_live_schema_snapshot(
        {
            "tool_name": "schema_retrieve",
            "query": "customer orders",
            "search_mode": "expand",
            "graph_hint": "expand",
            "selected_tables": [],
            "selected_table_refs": [],
            "total_results": 0,
        },
        success=False,
    )

    context.metadata.update(empty_snapshot)

    assert context.metadata["schema_retrieve_context"]["seed_tables"] == []
    assert context.metadata["schema_retrieve_context"]["expand_mode"] is False
