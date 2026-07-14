"""Generate short, persistent titles for chat conversations."""

from __future__ import annotations

import logging
import re

from QueryMind.core.llm import LlmMessage, LlmRequest, LlmService
from QueryMind.core.storage import Conversation

logger = logging.getLogger(__name__)

_MAX_TITLE_LENGTH = 48
_THINK_BLOCK_RE = re.compile(r"<think>.*?</think>", re.IGNORECASE | re.DOTALL)
_TITLE_PREFIX_RE = re.compile(r"^(?:title|conversation title)\s*[:：]\s*", re.IGNORECASE)


def clean_conversation_title(raw_title: str) -> str:
    """Normalize model output into one compact, plain-text title."""
    title = _THINK_BLOCK_RE.sub("", raw_title or "").strip()
    title = next((line.strip() for line in title.splitlines() if line.strip()), "")
    title = _TITLE_PREFIX_RE.sub("", title)
    title = title.strip("`*_#\"'[]() ")
    title = re.sub(r"\s+", " ", title).strip()
    if len(title) > _MAX_TITLE_LENGTH:
        title = title[:_MAX_TITLE_LENGTH].rstrip(" ,.;:，。；：")
    return title


async def ensure_conversation_title(
    conversation: Conversation,
    llm_service: LlmService,
) -> str | None:
    """Generate a title once and store it in conversation metadata.

    Title generation is best-effort. Chat persistence must continue even when
    the external model is temporarily unavailable.
    """
    existing_title = str(conversation.metadata.get("title") or "").strip()
    if existing_title:
        return existing_title

    first_user_message = next(
        (
            message.content.strip()
            for message in conversation.messages
            if message.role == "user" and message.content.strip()
        ),
        "",
    )
    if not first_user_message:
        return None

    assistant_message = next(
        (
            message.content.strip()
            for message in reversed(conversation.messages)
            if message.role == "assistant" and message.content.strip()
        ),
        "",
    )

    source = f"User request:\n{first_user_message[:1200]}"
    if assistant_message:
        source += f"\n\nAssistant response:\n{assistant_message[:1200]}"

    request = LlmRequest(
        messages=[LlmMessage(role="user", content=source)],
        user=conversation.user,
        system_prompt=(
            "Create a concise conversation title that captures the user's main intent. "
            "Use the same language as the user. Return only the title, without quotes, "
            "markdown, labels, or ending punctuation. Keep Chinese titles within 4-18 "
            "characters and English titles within 3-8 words."
        ),
        temperature=0.2,
        max_tokens=32,
        metadata={"purpose": "conversation_title"},
    )

    try:
        response = await llm_service.send_request(request)
        title = clean_conversation_title(response.content or "")
    except Exception as exc:  # noqa: BLE001
        logger.warning(
            "Conversation title generation failed for %s: %s",
            conversation.id,
            exc,
        )
        return None

    if not title:
        return None

    conversation.metadata["title"] = title
    conversation.metadata["title_source"] = "llm"
    return title
