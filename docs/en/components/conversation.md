# Conversation Storage

Conversation storage is the persisted record of a chat thread. QueryMind keeps it as a small, user-scoped contract: the store records messages and metadata, while prompt construction and tool execution happen later in the agent pipeline.

## Data Model

`Conversation` contains `id`, `user`, `messages`, `created_at`, `updated_at`, and free-form `metadata`. `Message` contains `role`, `content`, `timestamp`, optional `metadata`, optional `tool_result`, optional `tool_calls`, and optional `tool_call_id`.

`Conversation.add_message()` appends a message and refreshes `updated_at`.

## Store Contract

`ConversationStore` exposes exactly five operations:
- `create_conversation(...)`
- `get_conversation(...)`
- `update_conversation(...)`
- `delete_conversation(...)`
- `list_conversations(...)`

The interface does not define search, summarization, or prompt shaping.

## Agent Flow

The diagram below shows how a normal query turn reads from and writes back to conversation storage.

```text
+====================================================================================================+
| 1) Load conversation                                                                              |
|----------------------------------------------------------------------------------------------------|
| conversation_store.get_conversation(conversation_id, user)                                        |
| - load an existing conversation or create an empty one on first request                           |
| output: in-memory Conversation                                                                     |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 2) Write gate before workflow                                                                     |
|----------------------------------------------------------------------------------------------------|
| Agent._send_message() gets the conversation, then calls workflow_handler.try_handle(...)           |
| - starter UI / command cases may return early                                                     |
| - normal queries keep flowing                                                                     |
| output: only messages from a real normal turn are written into history                              |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 3) Append user message                                                                             |
|----------------------------------------------------------------------------------------------------|
| conversation.add_message(Message(role="user", content=message))                                    |
| sql_126 log: the user question is written first, then the LLM / tool loop starts                   |
| output: conversation.messages gets a new user message                                              |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 4) Append assistant / tool / assistant                                                             |
|----------------------------------------------------------------------------------------------------|
| After the LLM returns tool_calls:                                                                  |
| - conversation.add_message(role="assistant", tool_calls=...)                                       |
| - each tool result is appended as a role="tool" message                                            |
| - the final answer is appended as role="assistant", content=final_answer                          |
| output: the full query turn remains in Conversation.messages                                       |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 5) Persist                                                                                         |
|----------------------------------------------------------------------------------------------------|
| when auto-save is enabled, call conversation_store.update_conversation(conversation)               |
| sql_126 log: the in-memory conversation is flushed back to storage after the turn                  |
| output: metadata and new messages are written back                                                 |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 6) Read recent history on the next turn                                                            |
|----------------------------------------------------------------------------------------------------|
| history-aware components call conversation_store.get_recent(conversation_id, limit=10)            |
| - used by SchemaRetrieveContextEnricher and similar readers                                        |
| output: the next turn can inherit prior conversation state                                         |
+====================================================================================================+
```

1. `Agent._send_message()` resolves the user first.
2. Empty messages or `request_context.metadata["starter_ui_request"]` trigger starter UI handling before any normal turn.
3. For a normal turn, the agent loads or creates a conversation, then calls `workflow_handler.try_handle(...)` before adding the user message.
4. If `WorkflowResult.should_skip_llm` is `true`, the agent applies `conversation_mutation` first, streams the returned components, and returns without calling the LLM.
5. If the workflow does not take over, the agent adds the user message to the conversation and continues with the LLM/tool loop.
6. `update_conversation()` is the explicit persistence step. When auto-save is enabled, the agent calls it after starter UI responses and after workflow-handled turns.

The same store is also read by history-aware components in the runtime, including backend-specific recent-history helpers.

## Implementations

### MemoryConversationStore

`MemoryConversationStore` keeps a `Dict[str, Conversation]` in process memory.

What it does:
- creates a conversation with the initial user message
- scopes reads and deletes by `user.id`
- lists only the current user's conversations
- sorts conversation lists by `updated_at` descending

Why it exists:
- fast local development
- unit tests and demos
- zero external dependencies

Tradeoff:
- ephemeral storage
- no restart persistence

### FileSystemConversationStore

`FileSystemConversationStore` persists each conversation as a directory:

```text
conversations/
  conv_12345678/
    metadata.json
    messages/
      1700000000000000_000000.json
      1700000001000000_000001.json
```

What it stores:
- `metadata.json` with conversation id, user payload, and timestamps
- one JSON file per message inside `messages/`

What it does:
- `create_conversation()` writes metadata and the first user message
- `update_conversation()` rewrites metadata and appends only unseen messages
- `get_conversation()` reloads metadata and messages, then reconstructs the `Conversation`
- `delete_conversation()` verifies ownership before removing files
- `list_conversations()` filters by owner, sorts by `updated_at`, and paginates
- `get_recent()` returns the newest N messages for history-aware components

Why it matters:
- conversations are inspectable on disk
- persistence survives process restarts
- append-only message files make debugging and recovery easier
- recent-history reads can reuse previous structured tool output

`get_recent()` is a `FileSystemConversationStore` helper, not part of the `ConversationStore` interface.

## Source Boundaries

Conversation storage keeps raw history and ownership checks. It does not implement memory policy, schema governance, SQL governance, or prompt-chain logic.

## Relevant Source Files

- [`src/QueryMind/core/storage/base.py`](../../../src/QueryMind/core/storage/base.py) - `ConversationStore` interface
- [`src/QueryMind/core/storage/models.py`](../../../src/QueryMind/core/storage/models.py) - `Conversation` and `Message` models
- [`src/QueryMind/integrations/local/storage.py`](../../../src/QueryMind/integrations/local/storage.py) - in-memory conversation store
- [`src/QueryMind/integrations/local/file_system_conversation_store.py`](../../../src/QueryMind/integrations/local/file_system_conversation_store.py) - file-system conversation store
- [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py) - conversation load, workflow short-circuit, and persistence flow
- [`src/QueryMind/core/enricher/schema_retrieve.py`](../../../src/QueryMind/core/enricher/schema_retrieve.py) - history-aware recent-message reader
