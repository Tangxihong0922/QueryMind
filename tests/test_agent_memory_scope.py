from __future__ import annotations

from pathlib import Path
import sys
from concurrent.futures import ThreadPoolExecutor

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from QueryMind.integrations.agentmemory.mem0.agent_memory import (  # noqa: E402
    Mem0AgentMemory,
)
from QueryMind.integrations.agentmemory.mem0.config import (  # noqa: E402
    Mem0OSSConfig,
    VectorStoreConfig,
)
from QueryMind.capabilities.agent_memory import AgentMemory  # noqa: E402
from QueryMind.core.tool import ToolContext  # noqa: E402
from QueryMind.core.user import User  # noqa: E402
from QueryMind.tools.agent_memory import (  # noqa: E402
    SaveQuestionToolArgsParams,
    SaveQuestionToolArgsTool,
    SearchSavedCorrectToolUsesParams,
    SearchSavedCorrectToolUsesTool,
)


class _DummyMemory:
    def __init__(self):
        self.add_calls = []
        self.search_calls = []
        self.get_all_calls = []
        self.delete_all_calls = []

    def add(self, *args, **kwargs):
        self.add_calls.append({"args": args, "kwargs": kwargs})
        return {"results": [{"id": "mem-1"}]}

    def search(self, **kwargs):
        self.search_calls.append(kwargs)
        return {"results": []}

    def get_all(self, **kwargs):
        self.get_all_calls.append(kwargs)
        return {"results": []}

    def delete(self, *args, **kwargs):
        return None

    def delete_all(self, **kwargs):
        self.delete_all_calls.append(kwargs)
        return None

    def close(self):
        return None


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


class _SearchMemory:
    def __init__(self, results):
        self.results = results
        self.search_calls = []

    def search(self, **kwargs):
        self.search_calls.append(kwargs)
        return {"results": self.results}


class _RecordingAgentMemory(_DummyAgentMemory):
    def __init__(self):
        self.save_calls = []
        self.search_calls = []

    async def save_tool_usage(self, *args, **kwargs):
        self.save_calls.append(kwargs)
        return None

    async def search_similar_usage(self, *args, **kwargs):
        self.search_calls.append(kwargs)
        return []


def _build_context(
    session_isolated: bool,
    *,
    raw_user_message: str | None = None,
    agent_memory: AgentMemory | None = None,
) -> ToolContext:
    return ToolContext(
        user=User(id="u1", username="tester", email="tester@example.com"),
        conversation_id="conv-1",
        request_id="req-1",
        raw_user_message=raw_user_message,
        agent_memory=agent_memory or _DummyAgentMemory(),
        metadata={
            "agent_id": "agent-1",
            "tool_memory_session_isolated": session_isolated,
        },
    )


def test_tool_memory_is_cross_session_by_default(monkeypatch):
    memory = Mem0AgentMemory.__new__(Mem0AgentMemory)
    memory._memory_unavailable = False
    memory._memory = _DummyMemory()
    memory._default_user_id = "default_user"
    memory._default_agent_id = "default_agent"
    memory._enable_reranker = False
    memory._executor = None

    ctx = _build_context(session_isolated=False)

    entities = memory._get_entity_ids(ctx)
    assert entities["user_id"] == "u1"
    assert entities["agent_id"] == "agent-1"
    assert memory._is_tool_memory_session_isolated(ctx) is False

    scoped = memory._apply_tool_memory_scope({"user_id": "u1", "agent_id": "agent-1"}, ctx)
    assert "run_id" not in scoped


def test_tool_memory_can_be_session_isolated(monkeypatch):
    memory = Mem0AgentMemory.__new__(Mem0AgentMemory)
    memory._memory_unavailable = False
    memory._memory = _DummyMemory()
    memory._default_user_id = "default_user"
    memory._default_agent_id = "default_agent"
    memory._enable_reranker = False
    memory._executor = None

    ctx = _build_context(session_isolated=True)

    assert memory._is_tool_memory_session_isolated(ctx) is True
    scoped = memory._apply_tool_memory_scope({"user_id": "u1", "agent_id": "agent-1"}, ctx)
    assert scoped["run_id"] == "conv-1"


def test_search_saved_tool_uses_original_user_message_when_available():
    agent_memory = _RecordingAgentMemory()
    ctx = _build_context(
        session_isolated=False,
        raw_user_message="查询locationID在3到4之间的库存产品，按其数量进行排名。",
        agent_memory=agent_memory,
    )
    tool = SearchSavedCorrectToolUsesTool()
    args = SearchSavedCorrectToolUsesParams(
        question="库存产品查询 locationID 窗口函数排名",
        limit=5,
        similarity_threshold=0.7,
        tool_name_filter=None,
    )

    import asyncio

    asyncio.run(tool.execute(ctx, args))

    assert agent_memory.search_calls[0]["question"] == (
        "查询locationID在3到4之间的库存产品，按其数量进行排名。"
    )


def test_save_question_tool_uses_original_user_message_when_available():
    agent_memory = _RecordingAgentMemory()
    ctx = _build_context(
        session_isolated=False,
        raw_user_message="查询locationID在3到4之间的库存产品，按其数量进行排名。",
        agent_memory=agent_memory,
    )
    tool = SaveQuestionToolArgsTool()
    args = SaveQuestionToolArgsParams(
        question="库存产品查询 locationID 窗口函数排名",
        tool_name="run_sql",
        args={"sql": "SELECT 1"},
    )

    import asyncio

    asyncio.run(tool.execute(ctx, args))

    assert agent_memory.save_calls[0]["question"] == (
        "查询locationID在3到4之间的库存产品，按其数量进行排名。"
    )


def test_search_similar_usage_uses_flat_filters_and_similarity_scores():
    memory = Mem0AgentMemory.__new__(Mem0AgentMemory)
    memory._memory_unavailable = False
    memory._memory = _SearchMemory(
        [
            {
                "id": "mem-1",
                "memory": "first",
                "score": 0.2,
                "metadata": {
                    "memory_type": "tool_usage",
                    "tool_name": "run_sql",
                    "args_json": '{"sql": "SELECT 1"}',
                    "success": True,
                },
            },
            {
                "id": "mem-2",
                "memory": "second",
                "score": 0.4,
                "metadata": {
                    "memory_type": "tool_usage",
                    "tool_name": "run_sql",
                    "args_json": '{"sql": "SELECT 2"}',
                    "success": True,
                },
            },
        ]
    )
    memory._default_user_id = "default_user"
    memory._default_agent_id = "default_agent"
    memory._enable_reranker = False
    memory._config = Mem0OSSConfig(
        vector_store=VectorStoreConfig(provider="pgvector")
    )
    memory._executor = ThreadPoolExecutor(max_workers=1)

    ctx = _build_context(session_isolated=False)

    import asyncio

    try:
        results = asyncio.run(
            memory.search_similar_usage(
                question="find sql",
                context=ctx,
                limit=10,
                similarity_threshold=0.7,
                tool_name_filter="run_sql",
            )
        )
    finally:
        memory._executor.shutdown(wait=True)

    assert memory._memory.search_calls[0]["threshold"] == 0.0
    assert memory._memory.search_calls[0]["filters"] == {
        "memory_type": "tool_usage",
        "tool_name": "run_sql",
    }
    assert len(results) == 1
    assert results[0].memory.tool_name == "run_sql"
    assert results[0].similarity_score == 0.8
