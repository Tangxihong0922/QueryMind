# Agent Loop

This page uses one successful evaluation sample, `sql_126`, to show how QueryMind moves a single query from user message to final SQL and answer.

The trace comes from `evaluation_report.json`:

- `conversation_id`: `eval-sql_126`
- `tool_calls`: `schema_retrieve` x 3, `run_sql` x 3
- `conversation_message_count`: `14`
- `component_count`: `48`
- `execution_time_ms`: `21185.04`
- Evaluation result: `sql_accuracy = 0.90`, `expected_outcome = PASS`

The SQL shape is not identical to the ground truth in every ordering detail, but both evaluators passed, so this is a good example of a successful query loop.

## Example Query

| Item | Value |
|---|---|
| `test_case_id` | `sql_126` |
| `query` | Sort `BusinessEntityID` by `SalariedFlag`: descending for `true`, ascending for `false` |
| `trace_source` | [`evaluation_report.json`](../../../src/evals/eval_results/20260428_085122_0315d6e9_deepseek_v4_flash/evaluation_report.json) |
| `tool_count` | `6` |
| `run_sql_call_count` | `3` |
| `conversation_message_count` | `14` |
| `component_count` | `48` |
| `final_status` | `PASS` |

## ASCII Diagram

The ASCII diagram below embeds the real `sql_126` trace directly into each module box.
Each box shows three things:

- the input data
- what the module does
- what state gets written back

```text
+====================================================================================================+
| 1) User message / RequestContext                                                                   |
|----------------------------------------------------------------------------------------------------|
| Input: query                                                                                       |
|   "write a query in SQL to sort the BusinessEntityID in descending order                          |
|    for those employees that have the SalariedFlag set to 'true' and                               |
|    in ascending order that have the SalariedFlag set to 'false'.                                  |
|    Return BusinessEntityID, and SalariedFlag."                                                     |
| State: request_context.metadata = {}                                                               |
| Output: enter one normal query turn                                                                |
+============================================+=======================================================+
                                                |
                                                v
+====================================================================================================+
| 2) User resolver + ConversationStore                                                               |
|----------------------------------------------------------------------------------------------------|
| resolve_user() -> user.id=admin, username=Xihong, groups=[admin, user]                             |
| get_conversation("eval-sql_126") -> load or create conversation                                    |
| Action: append the user message to conversation history                                            |
| Output: conversation is ready for the agent loop                                                   |
+============================================+=======================================================+
                                                |
                                                v
+====================================================================================================+
| 3) workflow_handler.try_handle()                                                                   |
|----------------------------------------------------------------------------------------------------|
| Input: conversation + user message                                                                 |
| Rule: normal SQL query -> DefaultWorkflowHandler does not take over                                |
| Effect: no short-circuit, no starter UI, no command routing                                        |
| Output: continue into the normal LLM / tool loop                                                   |
+============================================+=======================================================+
                                                |
                                                v
+====================================================================================================+
| 4) Context assembly                                                                                |
|----------------------------------------------------------------------------------------------------|
| ToolContextEnricher: SchemaRetrieveContextEnricher                                                 |
| - read recent conversation history from FileSystemConversationStore                                |
| - recover the latest schema snapshot if it exists                                                  |
| - generate seed_tables / graph_hint / required_fields                                              |
| Prompt chain: SystemPromptBuilder + DefaultLlmContextEnhancer + ConversationFilter                  |
| - build a stable system prompt and message-side advisory messages                                  |
| - assemble LlmRequest.messages                                                                     |
| Output: request.metadata carries schema_governance / sql_governance snapshots                      |
+============================================+=======================================================+
                                                |
                                                v
+====================================================================================================+
| 5) LLM planner / middleware                                                                        |
|----------------------------------------------------------------------------------------------------|
| Input: system_prompt + visible tool schemas + conversation messages + request metadata             |
| middleware.before_llm_request(): append runtime notices and snapshot metadata                      |
| Trace result: the first LLM turn emits tool_calls = schema_retrieve x3                            |
| Loop rule: tool_calls -> execute tools -> append tool messages -> rebuild request -> next LLM turn |
+============================================+=======================================================+
                                                |
                                                v
+====================================================================================================+
| 6) schema_retrieve executor                                                                        |
|----------------------------------------------------------------------------------------------------|
| +--------------------------------------------------------------------------------------------------+ |
| | #1 query="employees with SalariedFlag and BusinessEntityID"   search_mode=hybrid                | |
| |    logic: start broad, find employee-related tables                                               | |
| +--------------------------------------------------------------------------------------------------+ |
| +--------------------------------------------------------------------------------------------------+ |
| | #2 query="employee table with SalariedFlag and BusinessEntityID" search_mode=vector             | |
| |    logic: tighten semantic retrieval after the first pass                                         | |
| +--------------------------------------------------------------------------------------------------+ |
| +--------------------------------------------------------------------------------------------------+ |
| | #3 query="HumanResources Employee"                      search_mode=hybrid                       | |
| |    logic: lock onto the target table                                                             | |
| +--------------------------------------------------------------------------------------------------+ |
| after_tool: SchemaGovernanceHook writes back last_schema_summary + schema_retrieve_context         |
| Output: selected_tables=["humanresources.employee"]                                                |
+============================================+=======================================================+
                                                |
                                                v
+====================================================================================================+
| 7) run_sql executor                                                                                |
|----------------------------------------------------------------------------------------------------|
| +--------------------------------------------------------------------------------------------------+ |
| | #4 SELECT table_schema, table_name                                                               | |
| |    FROM information_schema.tables                                                                | |
| |    WHERE table_name LIKE '%employee%'                                                            | |
| |    ORDER BY table_schema, table_name;                                                            | |
| +--------------------------------------------------------------------------------------------------+ |
| +--------------------------------------------------------------------------------------------------+ |
| | #5 SELECT column_name, data_type                                                                 | |
| |    FROM information_schema.columns                                                               | |
| |    WHERE table_schema = 'humanresources'                                                         | |
| |      AND table_name = 'employee'                                                                 | |
| |    ORDER BY ordinal_position;                                                                    | |
| +--------------------------------------------------------------------------------------------------+ |
| +--------------------------------------------------------------------------------------------------+ |
| | #6 SELECT BusinessEntityID, SalariedFlag                                                         | |
| |    FROM humanresources.employee                                                                  | |
| |    ORDER BY CASE WHEN SalariedFlag = true THEN 0 ELSE 1 END,                                     | |
| |             CASE WHEN SalariedFlag = true THEN BusinessEntityID END DESC,                        | |
| |             CASE WHEN SalariedFlag = false THEN BusinessEntityID END ASC;                        | |
| +--------------------------------------------------------------------------------------------------+ |
| Logic: validate table -> validate columns -> execute the final SQL                                 |
| Output: row_count=290, columns=[businessentityid, salariedflag]                                    |
| after_tool: SqlGovernanceHook writes back last_sql_summary + last_sql_shape                        |
+============================================+=======================================================+
                                                |
                                                v
+====================================================================================================+
| 8) Finalize / persist                                                                              |
|----------------------------------------------------------------------------------------------------|
| Final answer: "The query executed successfully. Here's a summary of the results:"                 |
| save conversation -> after_message hooks -> auto-save                                              |
| Trace summary: tool_count=6, run_sql_call_count=3, conversation_message_count=14                  |
+====================================================================================================+
```

This is not an abstract query loop. It is the real `sql_126` turn:

- 3 `schema_retrieve` calls narrow the table down to `HumanResources.Employee`
- 2 `run_sql` calls verify the table and columns before the final SQL
- 1 final `run_sql` call returns 290 rows and passes evaluation

So `tool_count = 6` is the full loop from exploration to verification to SQL drafting.

## How the Modules Hand Off State

- `SchemaGovernanceHook.after_tool(...)` observes each `schema_retrieve` result and writes the refreshed schema snapshot back into `result.metadata`.
- `SchemaGovernanceMiddleware.before_llm_request(...)` merges `schema_governance`, `last_schema_summary`, and recap logic into the next request, then leaves the live notice construction to the runtime notice path.
- `_build_live_schema_snapshot()` turns the same-turn `schema_retrieve` result into `last_schema_summary` and `schema_retrieve_context`, so the next turn can inherit seed tables, `graph_hint`, and `required_fields`.
- `SchemaRetrieveContextEnricher` reads recent conversation history from `FileSystemConversationStore`, reuses the latest schema snapshot first, and falls back to history when needed.
- `SqlGovernanceHook.after_tool(...)` records each `run_sql` result and writes back `sql_governance`, `last_sql_summary`, and `last_sql_shape`.
- `SqlGovernanceMiddleware.before_llm_request(...)` reuses or infers the SQL profile, appends the SQL runtime notice at the tail, and injects recap when needed.
- `_build_live_sql_snapshot()` turns the `run_sql` result into a same-turn snapshot, so the next turn can continue from a validated SQL shape.
- `ConversationStore` persists `user / assistant / tool` messages for later turns, replay, and evaluation extraction.

## Runtime Wiring

The key wiring in `my_agent.py` is:

- `workflow_handler=CompositeWorkflowHandler([...])`
- `context_enrichers=[SchemaRetrieveContextEnricher(...)]`
- `llm_context_enhancer=CompositeLlmContextEnhancer([DefaultLlmContextEnhancer(...)])`
- `hooks=[schema_governance.hook, sql_governance.hook]`
- `llm_middlewares=[schema_governance.middleware, sql_governance.middleware]`
- `conversation_store=FileSystemConversationStore()`
- `tool_registry=RLSToolRegistry(...)`
- `schema_memory=Neo4jMem0SchemaMemory(...)`
- `agent_memory=Mem0AgentMemory(...)`
- `observability_provider=PrometheusObservabilityProvider()`
- `audit_logger=PostgresAuditLogger(...)`

This layer is not business logic, but it decides where each piece of query state is written and where the next turn reads from.

## Scope

- the full turn loop for a normal query;
- request assembly, tool loop, and finalization boundaries;
- the real evaluation trace for `sql_126`;
- how schema and SQL governance write state into the next turn.

## Not Covered

- the lock thresholds, recap details, and state machine rules from `schema-governance.md`;
- the SQL profile, anchor, freeze, and repair details from `sql-governance.md`;
- deterministic command short-circuit routing from `workflow.md`;
- authentication, authorization, and RLS policy from `security.md`.

These topics have their own dedicated pages.

## Relevant Source Files

- [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py) - main loop, request assembly, tool loop, and finalize
- [`src/my_agent.py`](../../../src/my_agent.py) - runtime wiring entrypoint
- [`src/QueryMind/core/tool/models.py`](../../../src/QueryMind/core/tool/models.py) - `ToolContext` / `ToolResult` / `ToolSchema`
- [`src/QueryMind/core/user/request_context.py`](../../../src/QueryMind/core/user/request_context.py) - `RequestContext`
- [`src/QueryMind/core/enricher/schema_retrieve.py`](../../../src/QueryMind/core/enricher/schema_retrieve.py) - schema retrieve context injection
- [`src/QueryMind/core/enhancer/schema_governance.py`](../../../src/QueryMind/core/enhancer/schema_governance.py) - schema governance prompt enhancement
- [`src/QueryMind/core/enhancer/default.py`](../../../src/QueryMind/core/enhancer/default.py) - default memory enhancement
- [`src/QueryMind/core/middleware/schema_governance.py`](../../../src/QueryMind/core/middleware/schema_governance.py) - schema governance request shaping
- [`src/QueryMind/core/middleware/sql_governance.py`](../../../src/QueryMind/core/middleware/sql_governance.py) - SQL governance request shaping
- [`src/QueryMind/core/hook/schema_governance.py`](../../../src/QueryMind/core/hook/schema_governance.py) - schema tool result write-back
- [`src/QueryMind/core/hook/sql_governance.py`](../../../src/QueryMind/core/hook/sql_governance.py) - SQL tool result write-back
- [`src/evals/eval_results/20260428_085122_0315d6e9_deepseek_v4_flash/evaluation_report.json`](../../../src/evals/eval_results/20260428_085122_0315d6e9_deepseek_v4_flash/evaluation_report.json) - `sql_126` evaluation trace
