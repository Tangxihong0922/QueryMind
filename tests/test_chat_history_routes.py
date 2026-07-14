from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from fastapi import FastAPI  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from QueryMind.core.storage import Conversation, Message  # noqa: E402
from QueryMind.core.user import User  # noqa: E402
from QueryMind.integrations.local import MemoryConversationStore  # noqa: E402
from QueryMind.server.base import ChatHandler  # noqa: E402
from QueryMind.server.fastapi.routes import register_chat_routes  # noqa: E402


class _DummyUserResolver:
    async def resolve_user(self, request_context):  # noqa: D401
        return User(
            id="admin",
            username="admin",
            email="admin@local",
            group_memberships=["admin"],
        )


class _DummyAgent:
    def __init__(self, store):
        self.conversation_store = store
        self.user_resolver = _DummyUserResolver()


def _build_client(store: MemoryConversationStore) -> TestClient:
    app = FastAPI()
    register_chat_routes(app, ChatHandler(_DummyAgent(store)))
    return TestClient(app)


def test_list_conversations_skips_empty_sessions_and_uses_first_user_message_title():
    store = MemoryConversationStore()
    user = User(
        id="admin",
        username="admin",
        email="admin@local",
        group_memberships=["admin"],
    )

    async def _seed() -> None:
        await store.create_conversation(
            "conv_full",
            user,
            "Show me employee salary trends for the last quarter",
        )
        conversation = await store.get_conversation("conv_full", user)
        assert conversation is not None
        conversation.add_message(
            Message(role="assistant", content="I can help with that.")
        )
        await store.update_conversation(conversation)

        empty = Conversation(id="conv_empty", user=user, messages=[])
        await store.update_conversation(empty)

    import asyncio

    asyncio.run(_seed())

    client = _build_client(store)
    response = client.get("/api/querymind/v1/chat/conversations")

    assert response.status_code == 200
    body = response.json()
    assert body["pagination"]["total_count"] == 1
    assert len(body["conversations"]) == 1
    assert body["conversations"][0]["conversation_id"] == "conv_full"
    assert body["conversations"][0]["title"].startswith(
        "Show me employee salary trends"
    )
    assert body["conversations"][0]["message_count"] == 2


def test_get_and_delete_conversation():
    store = MemoryConversationStore()
    user = User(
        id="admin",
        username="admin",
        email="admin@local",
        group_memberships=["admin"],
    )

    async def _seed() -> None:
        await store.create_conversation("conv_delete", user, "List tables for sales")

    import asyncio

    asyncio.run(_seed())

    client = _build_client(store)

    detail = client.get("/api/querymind/v1/chat/conversations/conv_delete")
    assert detail.status_code == 200
    assert detail.json()["message_count"] == 1

    deleted = client.delete("/api/querymind/v1/chat/conversations/conv_delete")
    assert deleted.status_code == 200
    assert deleted.json()["success"] is True

    missing = client.get("/api/querymind/v1/chat/conversations/conv_delete")
    assert missing.status_code == 404


def test_list_conversations_prefers_persisted_llm_title():
    store = MemoryConversationStore()
    user = User(
        id="admin",
        username="admin",
        email="admin@local",
        group_memberships=["admin"],
    )

    async def _seed() -> None:
        conversation = await store.create_conversation(
            "conv_titled",
            user,
            "请统计过去十二个月每月的订单金额并分析趋势",
        )
        conversation.metadata["title"] = "月度订单趋势分析"
        conversation.metadata["title_source"] = "llm"
        await store.update_conversation(conversation)

    import asyncio

    asyncio.run(_seed())

    response = _build_client(store).get("/api/querymind/v1/chat/conversations")

    assert response.status_code == 200
    assert response.json()["conversations"][0]["title"] == "月度订单趋势分析"
