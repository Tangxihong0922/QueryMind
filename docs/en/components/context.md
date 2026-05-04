# Context Assembly

QueryMind splits context into two separate paths:

- prompt-facing context, which shapes what the model sees
- tool-facing context, which shapes what tools receive at execution time

Those paths solve different problems and should stay separate from the prompt chain itself.

## Two Paths

| Path | Contract | Main output |
|---|---|---|
| Prompt-facing | `SystemPromptBuilder`, `LlmContextEnhancer` | `system_prompt` and the final `LlmRequest.messages` list |
| Tool-facing | `ToolContextEnricher` | `ToolContext.metadata` |

Prompt-facing details live in [`prompt-chain.md`](./prompt-chain.md).

For the concrete turn-by-turn walk-through, see
[`request-assembly.md`](./request-assembly.md).

## Request Assembly Order

This page keeps only the request assembly path itself.
The full `sql_126` Agent Loop trace lives in [`agent-loop.md`](./agent-loop.md).

```text
+====================================================================================================+
| 1) Build ToolContext                                                                               |
|----------------------------------------------------------------------------------------------------|
| input: user, conversation_id, request_id, raw_user_message, request_context.metadata               |
| seed metadata: ui_features_available, tool_memory_session_isolated                                  |
| output: ToolContext(user, conversation_id, request_id, metadata=...)                               |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 2) ToolContextEnricher chain                                                                       |
|----------------------------------------------------------------------------------------------------|
| SchemaRetrieveContextEnricher.enrich_context(context)                                              |
| - prefer turn-local schema snapshot in context.metadata                                            |
| - else read conversation history via conversation_store                                           |
| output: context.metadata.last_schema_summary / schema_retrieve_context                             |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 3) ToolRegistry.get_schemas(user)                                                                  |
|----------------------------------------------------------------------------------------------------|
| fetch visible tool schemas for this turn                                                           |
| output: tool_schemas[]                                                                             |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 4) _prepare_turn_prompt()                                                                          |
|----------------------------------------------------------------------------------------------------|
| SystemPromptBuilder.build_system_prompt(user, visible_tool_schemas)                                |
| schema governance may add a prompt block or hide the schema tool                                   |
| LlmContextEnhancer.enhance_system_prompt(): memory examples                                        |
| output: visible_tool_schemas + system_prompt + prepared_metadata                                   |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 5) ConversationFilter chain + _build_llm_request()                                                 |
|----------------------------------------------------------------------------------------------------|
| filters run in order over conversation.messages                                                    |
| message -> LlmMessage(role/content/tool_calls/tool_call_id/metadata/tool_result)                   |
| request_metadata merged into each message.metadata                                                  |
| LlmContextEnhancer.enhance_user_messages(): final pass (default = identity)                        |
| output: LlmRequest(messages, tools, user, system_prompt, metadata)                                 |
+====================================================================================================+
```

The important boundaries are:
- `ToolContextEnricher` writes `ToolContext.metadata` first, then fetches visible tool schemas; it affects execution state only, not the prompt.
- `_prepare_turn_prompt()` is responsible for `SystemPromptBuilder` + the governance block + `enhance_system_prompt()`, and produces the current turn's `system_prompt` and `visible_tool_schemas`.
- `ConversationFilter` trims and reorders conversation history before it becomes `LlmMessage` objects.
- `LlmContextEnhancer.enhance_user_messages()` is the final message-side hook, and only then is `LlmRequest` materialized.

## Tool Context Enrichment

`ToolContextEnricher` is the lowest layer in the assembly pipeline.
It does not change the prompt.
It writes execution-time state into `ToolContext.metadata`.

The current concrete enricher shipped in the codebase is:

- `SchemaRetrieveContextEnricher`

That enricher:
- prefers turn-local schema snapshot data already present in `context.metadata`
- falls back to recent conversation history when needed
- reads the latest schema retrieval result from the conversation
- writes `last_schema_summary` and `schema_retrieve_context` into the tool context

`schema_retrieve_context` can carry:
- `seed_tables`
- `seed_table_refs`
- `expand_mode`
- `last_query`
- `last_search_mode`
- `graph_hint`
- `required_fields`
- `domain_filter`
- `summary_text`
- `schema_locked`
- `lock_reason`

This is execution state, not prompt policy. The enricher exists so a later `schema_retrieve` call can continue from the previous structured result without rebuilding that state in prose.

## Conversation Filters

`ConversationFilter` transforms conversation history before the LLM sees it.

Filters run in order inside `Agent._build_llm_request()`, so later filters receive the output of earlier filters.
They can:
- remove sensitive text
- trim long histories
- summarize older turns
- deduplicate or reorder messages

This layer works on the message history itself, not on storage and not on tool state.

## Source Boundaries

This page covers request assembly boundaries, tool-context enrichment, and conversation filtering.
It does not define prompt policy, schema governance state, SQL governance state, or the final system-prompt prose.

## Relevant Source Files

- [`src/QueryMind/core/enricher/base.py`](../../../src/QueryMind/core/enricher/base.py) - `ToolContextEnricher` interface
- [`src/QueryMind/core/enricher/schema_retrieve.py`](../../../src/QueryMind/core/enricher/schema_retrieve.py) - schema retrieve context enricher
- [`src/QueryMind/core/filter/base.py`](../../../src/QueryMind/core/filter/base.py) - `ConversationFilter` interface
- [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py) - enrichment, filtering, and request assembly flow
- [`src/QueryMind/core/agent/governance.py`](../../../src/QueryMind/core/agent/governance.py) - schema governance manager
- [`src/QueryMind/core/enhancer/default.py`](../../../src/QueryMind/core/enhancer/default.py) - default LLM context enhancer
- [`src/QueryMind/core/llm/models.py`](../../../src/QueryMind/core/llm/models.py) - `LlmRequest` / `LlmMessage`
- [`src/QueryMind/core/registry.py`](../../../src/QueryMind/core/registry.py) - `ToolRegistry.get_schemas`
- [`src/QueryMind/core/tool/models.py`](../../../src/QueryMind/core/tool/models.py) - `ToolContext`
- [`src/QueryMind/core/user/request_context.py`](../../../src/QueryMind/core/user/request_context.py) - `RequestContext`
- [`src/QueryMind/core/system_prompt/default.py`](../../../src/QueryMind/core/system_prompt/default.py) - default system prompt builder
- [`src/QueryMind/core/storage/base.py`](../../../src/QueryMind/core/storage/base.py) - conversation store contract used by history-aware enrichers
