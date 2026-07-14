from __future__ import annotations

import asyncio

from QueryMind.components import RichTextComponent, UiComponent
from QueryMind.core.agent import Agent
from QueryMind.core.agent.conversation_title import (
    clean_conversation_title,
    ensure_conversation_title,
)
from QueryMind.core.llm import LlmResponse
from QueryMind.core.registry import ToolRegistry
from QueryMind.core.storage import Conversation, Message
from QueryMind.core.user import RequestContext, User
from QueryMind.core.workflow import WorkflowResult
from QueryMind.integrations.local import FileSystemConversationStore, MemoryConversationStore


def _user() -> User:
    return User(
        id="admin",
        username="admin",
        email="admin@local",
        group_memberships=["admin"],
    )


class _StubLlmService:
    def __init__(self, title: str = "销售订单趋势分析") -> None:
        self.title = title
        self.calls = 0

    async def send_request(self, request):
        self.calls += 1
        assert request.metadata["purpose"] == "conversation_title"
        return LlmResponse(content=self.title)


class _UserResolver:
    async def resolve_user(self, request_context):
        return _user()


class _HelpWorkflow:
    async def try_handle(self, agent, user, conversation, message):
        return WorkflowResult(
            should_skip_llm=True,
            components=[
                UiComponent(
                    rich_component=RichTextComponent(
                        content="Available commands", markdown=True
                    )
                )
            ],
        )

    async def get_starter_ui(self, agent, user, conversation):
        return None


def test_clean_conversation_title_removes_model_wrappers() -> None:
    assert clean_conversation_title('<think>draft</think>\nTitle: "销售订单趋势分析。"') == (
        "销售订单趋势分析。"
    )


def test_generate_conversation_title_only_once() -> None:
    conversation = Conversation(
        id="conv-title",
        user=_user(),
        messages=[
            Message(role="user", content="分析最近一年的销售订单趋势"),
            Message(role="assistant", content="下面是趋势分析。"),
        ],
    )
    llm = _StubLlmService()

    async def _run() -> None:
        first = await ensure_conversation_title(conversation, llm)
        second = await ensure_conversation_title(conversation, llm)
        assert first == "销售订单趋势分析"
        assert second == first

    asyncio.run(_run())

    assert llm.calls == 1
    assert conversation.metadata == {
        "title": "销售订单趋势分析",
        "title_source": "llm",
    }


def test_file_store_persists_conversation_title(tmp_path) -> None:
    store = FileSystemConversationStore(str(tmp_path / "conversations"))

    async def _run() -> None:
        conversation = await store.create_conversation("conv-file", _user(), "查询销售额")
        conversation.metadata["title"] = "销售额查询"
        conversation.metadata["title_source"] = "llm"
        await store.update_conversation(conversation)

        reloaded = await store.get_conversation("conv-file", _user())
        assert reloaded is not None
        assert reloaded.metadata["title"] == "销售额查询"

        listed = await store.list_conversations(_user())
        assert listed[0].metadata["title_source"] == "llm"

    asyncio.run(_run())


def test_workflow_first_message_is_saved_and_titled() -> None:
    store = MemoryConversationStore()
    llm = _StubLlmService("QueryMind 使用帮助")
    agent = Agent(
        llm_service=llm,
        tool_registry=ToolRegistry(),
        user_resolver=_UserResolver(),
        agent_memory=None,
        conversation_store=store,
        workflow_handler=_HelpWorkflow(),
    )

    async def _run() -> None:
        async for _ in agent.send_message(
            RequestContext(),
            "/help",
            conversation_id="conv-workflow",
        ):
            pass

        conversation = await store.get_conversation("conv-workflow", _user())
        assert conversation is not None
        assert [message.role for message in conversation.messages] == ["user", "assistant"]
        assert conversation.messages[0].content == "/help"
        assert conversation.metadata["title"] == "QueryMind 使用帮助"

    asyncio.run(_run())

    assert llm.calls == 1
