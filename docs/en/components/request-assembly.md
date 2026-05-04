# Request Assembly

This page expands the compact boundary view in [`context.md`](./context.md) into
one concrete turn. It stays on the path from `ToolContext` to `LlmRequest`;
conversation replay and persistence live in [`conversation.md`](./conversation.md),
and the prompt body itself is detailed in [`prompt-chain.md`](./prompt-chain.md).

## Runtime Wiring

The facts here come from [`src/my_agent.py`](../../../src/my_agent.py) and
[`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py),
plus the `sql_126` trace captured in the evaluation artifacts.

- `enhancer = CompositeLlmContextEnhancer([schema_governance.enhancer, SchemaContextEnhancer(), DefaultLlmContextEnhancer(agent_mem)])`
- `enricher = [SchemaRetrieveContextEnricher(conversation_store=FileSystemConversationStore())]`
- `llm_middlewares = [schema_governance.middleware, sql_governance.middleware]`
- `conversation_filters = []` in `my_agent.py`, so the filter chain is identity in the current runtime
- `AgentConfig` only overrides `max_tool_iterations` and `schema_search_default_threshold`; `temperature`, `max_tokens`, and `stream_responses` stay on their defaults

## ASCII Diagram

The diagram below follows one turn from `ToolContext` creation to the final
`LlmRequest`. The `sql_126` trace is the concrete anchor, but the assembly order
is the same for every normal query turn.

```text
+====================================================================================================+
| 1) Build ToolContext                                                                               |
|----------------------------------------------------------------------------------------------------|
| input: user, conversation_id, request_id, raw_user_message, agent_memory,                          |
|        schema_memory, schema_management_service, observability_provider,                           |
|        request_context.metadata                                                                    |
| seed metadata: ui_features_available, tool_memory_session_isolated                                  |
| config fields: schema_search_default_limit=10,                                                     |
|                schema_search_default_threshold=0.4, schema_search_default_mode="hybrid"            |
| my_agent wiring: conversation_store=FileSystemConversationStore()                                  |
| output: ToolContext(user, conversation_id, request_id, metadata=...)                               |
+============================================+=======================================================+
                                                |
                                                v
+====================================================================================================+
| 2) ToolContextEnricher chain                                                                       |
|----------------------------------------------------------------------------------------------------|
| SchemaRetrieveContextEnricher.enrich_context(context)                                              |
| - prefer turn-local schema snapshot already in context.metadata                                     |
| - else read recent history from FileSystemConversationStore.get_recent(..., limit=10)              |
| - extract the latest schema result and write `last_schema_summary` plus                             |
|   `seed_tables`, `graph_hint`, `required_fields`, `schema_locked`, and `lock_reason`               |
| output: context.metadata.last_schema_summary / schema_retrieve_context                             |
| sql_126 note: the first turn usually starts empty; later turns reuse the snapshot written by hooks  |
+============================================+=======================================================+
                                                |
                                                v
+====================================================================================================+
| 3) ToolRegistry.get_schemas(user)                                                                  |
|----------------------------------------------------------------------------------------------------|
| my_agent wiring: RLSToolRegistry + register_local_tool(...)                                         |
| registered local tools: run_sql, schema_retrieve, memory tools, python tools,                      |
| and file / visualize_data tools                                                                     |
| logic: return only the schemas the resolved user can see                                            |
| output: tool_schemas[]                                                                             |
+============================================+=======================================================+
                                                |
                                                v
+====================================================================================================+
| 4) _prepare_turn_prompt()                                                                          |
|----------------------------------------------------------------------------------------------------|
| logic:                                                                                             |
|   - merge schema_governance snapshot into request_metadata                                         |
|   - hide `schema_retrieve` when governance says the turn is locked                                 |
|   - build the base system prompt                                                                   |
|   - append governance prompt blocks                                                                |
|   - call `CompositeLlmContextEnhancer.enhance_system_prompt()`                                     |
| prompt excerpts from the real builder:                                                             |
|   "You are QueryMind, an AI data analyst assistant..."                                              |
|   "Response Guidelines:"                                                                            |
|   "- If a SQL query was executed successfully, append the executed SQL..."                          |
|   "MEMORY SYSTEM:" / "TOOL USAGE MEMORY" / "TEXT MEMORY"                                           |
| governance excerpts from the real stack:                                                           |
|   "## Schema Governance"                                                                            |
|   "- schema_locked: false"                                                                          |
|   "## Schema Retrieval Tool - Search Mode Selection Rules"                                          |
|   "- hybrid (Balanced mode, default)"                                                              |
| output: visible_tool_schemas + system_prompt + merged_metadata                                     |
+============================================+=======================================================+
                                                |
                                                v
+====================================================================================================+
| 5) ConversationFilter chain + _build_llm_request()                                                 |
|----------------------------------------------------------------------------------------------------|
| my_agent wiring: no custom `conversation_filters`, so this stage is a pass-through today           |
| logic:                                                                                             |
|   - run filters in order over `conversation.messages`                                              |
|   - convert each message into `LlmMessage(role/content/tool_calls/tool_call_id/metadata/tool_result)`|
|   - merge `request_metadata` into each `message.metadata`                                           |
|   - call `LlmContextEnhancer.enhance_user_messages()` as the final message-side hook               |
| request_metadata at turn start:                                                                     |
|   conversation_id=eval-sql_126, tool_iterations=0, max_tool_iterations=25                         |
| output: LlmRequest(messages, tools, user, system_prompt, metadata)                                 |
+============================================+=======================================================+
                                                |
                                                v
+====================================================================================================+
| 6) SchemaGovernanceMiddleware + SqlGovernanceMiddleware                                             |
|----------------------------------------------------------------------------------------------------|
| order: `SchemaGovernanceMiddleware` -> `SqlGovernanceMiddleware`                                   |
| logic:                                                                                             |
|   - rehydrate request.metadata from runtime snapshots                                               |
|   - append request-time governance prompt blocks                                                    |
|   - infer or reuse the SQL profile from request metadata or the user message                        |
|   - hide `schema_retrieve` from `request.tools` when schema is locked                              |
|   - inject recap blocks when the turn has drifted or run long enough                               |
| request-time snapshot fields:                                                                       |
|   schema_governance / last_schema_summary / allow_metadata_query                                   |
|   sql_governance / runtime_profile / last_sql_summary                                              |
| output: final request.system_prompt + final request.tools + final request.metadata                 |
+============================================+=======================================================+
                                                |
                                                v
+====================================================================================================+
| 7) Final LlmRequest                                                                                |
|----------------------------------------------------------------------------------------------------|
| input: messages + tools + system_prompt + metadata                                                 |
| sql_126 path:                                                                                      |
|   - first turn uses the prompt stack above                                                         |
|   - later turns inherit schema/sql snapshots from the previous tool results                        |
| request fields:                                                                                    |
|   messages = filtered conversation history with merged metadata                                    |
|   tools = visible tool schemas after governance narrowing                                          |
|   system_prompt = base prompt + governance blocks + memory snippets                                |
|   metadata = turn counters + governance snapshots                                                  |
|   temperature=0.7, max_tokens=None, stream=True                                                   |
| output: the object handed to `llm_service.send_request(request)`                                   |
+====================================================================================================+
```

## sql_126 Anchor

The concrete `sql_126` query used to anchor this walkthrough is:

```text
write a query in SQL to sort the BusinessEntityID in descending order for those
employees that have the SalariedFlag set to 'true' and in ascending order that
have the SalariedFlag set to 'false'. Return BusinessEntityID, and SalariedFlag.
```

The request assembly path sees this turn with:

- `conversation_id=eval-sql_126`
- `request_metadata.tool_iterations=0`
- `request_metadata.max_tool_iterations=25`
- `ToolContext.metadata.ui_features_available` derived from the resolved user groups
- `ToolContext.metadata.tool_memory_session_isolated` copied from `request_context.metadata`
- `ToolContext.schema_search_default_threshold=0.4`

The prompt stack assembled for this turn is:

- base prompt from `DefaultSystemPromptBuilder`
- `SchemaGovernanceEnhancer` block with `schema_locked: false`
- `SchemaContextEnhancer` search-mode rules for `schema_retrieve`
- `DefaultLlmContextEnhancer` memory snippets when `AgentMemory` returns matches

After tool execution starts, the next turn can reuse the snapshots written back by
the governance hooks:

- `schema_governance.hook` writes `last_schema_summary` and `schema_retrieve_context`
- `sql_governance.hook` writes `last_sql_summary`, `runtime_profile`, and SQL-shape state

That write-back is why the next `before_llm_request()` call can narrow tools,
append recap text, and keep the turn aligned with the discovered schema and SQL shape.

## Important Boundaries

- `ToolContext.metadata` is for execution-time tool state.
- `request.metadata` is for the LLM call and middleware shaping.
- `SchemaRetrieveContextEnricher` writes tool-facing schema state, not prompt text.
- `SchemaGovernanceMiddleware` and `SqlGovernanceMiddleware` are the last request-time mutators before the LLM call.

## Relevant Source Files

- [`src/my_agent.py`](../../../src/my_agent.py) - runtime enhancer / middleware wiring
- [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py) - `_prepare_turn_prompt()` / `_build_llm_request()` / `_send_llm_request()`
- [`src/QueryMind/core/tool/models.py`](../../../src/QueryMind/core/tool/models.py) - `ToolContext` / `ToolResult` / `ToolSchema`
- [`src/QueryMind/core/enricher/schema_retrieve.py`](../../../src/QueryMind/core/enricher/schema_retrieve.py) - `SchemaRetrieveContextEnricher`
- [`src/QueryMind/core/enhancer/composite.py`](../../../src/QueryMind/core/enhancer/composite.py) - `CompositeLlmContextEnhancer`
- [`src/QueryMind/core/enhancer/schema_retrieve.py`](../../../src/QueryMind/core/enhancer/schema_retrieve.py) - `SchemaContextEnhancer`
- [`src/QueryMind/core/enhancer/default.py`](../../../src/QueryMind/core/enhancer/default.py) - `DefaultLlmContextEnhancer`
- [`src/QueryMind/core/middleware/schema_governance.py`](../../../src/QueryMind/core/middleware/schema_governance.py) - schema governance request shaping
- [`src/QueryMind/core/middleware/sql_governance.py`](../../../src/QueryMind/core/middleware/sql_governance.py) - SQL governance request shaping
- [`src/QueryMind/core/system_prompt/default.py`](../../../src/QueryMind/core/system_prompt/default.py) - default system prompt builder
- [`src/QueryMind/core/llm/models.py`](../../../src/QueryMind/core/llm/models.py) - `LlmRequest` / `LlmMessage`
- [`src/QueryMind/core/filter/base.py`](../../../src/QueryMind/core/filter/base.py) - `ConversationFilter`
- [`src/QueryMind/core/user/request_context.py`](../../../src/QueryMind/core/user/request_context.py) - `RequestContext`
