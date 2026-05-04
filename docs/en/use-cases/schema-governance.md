# Schema Governance Use Case

This page shows the end-to-end behavior of schema governance in a typical
multi-turn discovery flow.

The prompt-side `SchemaGovernanceEnhancer` only appends the fixed block
documented in the prompt-chain page. The flow below is driven by the manager,
hook, and middleware.

## Scenario

A user starts with a broad schema search, then follows up with a request to
expand from the previously selected tables.

The flow relies on conversation-scoped state, not on prose memory.

## What Happens

1. The first `schema_retrieve` call returns selected tables and search metadata.
2. `SchemaGovernanceHook.after_tool(...)` records the result, updates the
   conversation state, and writes the refreshed snapshot back into
   `result.metadata`.
3. `SchemaGovernanceManager.build_request_metadata(...)` exposes
   `schema_governance` and `last_schema_summary` for the next turn.
4. `SchemaGovernanceMiddleware.before_llm_request(...)` merges that snapshot
   into request metadata, appends the governance prompt block, and hides
   `schema_retrieve` once the conversation is locked.
5. When the turn budget or lock state says to restate the goal, the middleware
   injects a recap reminder.
6. The next turn can continue from the stored schema state instead of starting
   over.

## ASCII Diagram

The diagram below turns the narrative into a concrete request-time loop. The
facts come from `src/QueryMind/core/agent/governance.py`,
`src/QueryMind/core/hook/schema_governance.py`,
`src/QueryMind/core/middleware/schema_governance.py`,
`src/QueryMind/core/enhancer/schema_governance.py`, `src/my_agent.py`, and the
real `eval-sql_126` log.

```text
+====================================================================================================+
| 0) schema_retrieve.execute()                                                                      |
|----------------------------------------------------------------------------------------------------|
| Input: ToolCall.arguments                                                                          |
|   - #1 query="employees with SalariedFlag and BusinessEntityID" search_mode="hybrid"              |
|   - #2 query="HumanResources Employee table with SalariedFlag and BusinessEntityID"                |
|         search_mode="vector"                                                                       |
|   - #3 query="employee table human resources" search_mode="hybrid"                                 |
| Output: ToolResult.metadata -> selected_tables / total_results / summary_text                     |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 1) SchemaGovernanceHook.after_tool(...)                                                            |
|----------------------------------------------------------------------------------------------------|
| Input: schema_retrieve ToolResult.metadata + success                                               |
| Logic:                                                                                             |
|   - normalize selected_tables, query, and table refs                                               |
|   - update calls / successes / failures / empty / no_new / same_query streaks                      |
|   - write the refreshed snapshot back into result.metadata                                         |
| eval-sql_126 snapshot:                                                                             |
|   - after #1 -> calls=1 successes=1 failures=0 locked=False                                        |
|   - after #2 -> calls=2 successes=1 failures=1 locked=False                                        |
|   - after #3 -> calls=3 successes=2 failures=1 locked=True lock_reason=enough_schema               |
| Output: result.metadata.schema_governance + last_schema_summary                                     |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 2) SchemaGovernanceManager                                                                         |
|----------------------------------------------------------------------------------------------------|
| Input: conversation_id + latest state                                                              |
| Logic:                                                                                             |
|   - build_request_metadata() emits a compact snapshot                                              |
|   - build_prompt_block() selects unlocked vs. locked prompt                                        |
|   - should_hide_schema_tool() decides whether `schema_retrieve` disappears next turn              |
| Real snapshot (eval-sql_126):                                                                      |
|   schema_retrieve_calls=3                                                                          |
|   schema_retrieve_successes=2                                                                      |
|   schema_retrieve_failures=1                                                                       |
|   schema_locked=true                                                                               |
|   lock_reason=enough_schema                                                                        |
| Prompt excerpt:                                                                                    |
|   "## Schema Governance"                                                                           |
|   "- schema_locked: true"                                                                          |
|   "- `schema_retrieve` is locked for this turn."                                                   |
|   "- Enter SQL draft mode now."                                                                    |
| Output: request.metadata + request-time governance block                                            |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 3) Agent._prepare_turn_prompt() + SchemaGovernanceEnhancer                                         |
|----------------------------------------------------------------------------------------------------|
| Input: user_message + tool_schemas + request.metadata + system_prompt                              |
| Logic:                                                                                             |
|   - merge the snapshot into turn metadata                                                           |
|   - append the governance block into the system prompt                                              |
|   - `SchemaGovernanceEnhancer` only appends `policy.system_prompt_block`                            |
|   - when `## Schema Governance` already exists, the enhancer returns unchanged                    |
| Result: the final system prompt carries the `schema_locked: true` / `false` guidance              |
| Example: after lock, the system prompt pushes SQL draft mode                                        |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 4) SchemaGovernanceMiddleware.before_llm_request()                                                 |
|----------------------------------------------------------------------------------------------------|
| Input: request.metadata + request.tools + request.system_prompt                                    |
| Logic:                                                                                             |
|   - merge the snapshot again                                                                        |
|   - inject a recap block when needed                                                                |
|   - remove `schema_retrieve` when `should_hide_schema_tool()` is true                              |
|   - the metadata-discovery exception only applies to empty-result locks                             |
| eval-sql_126 result:                                                                               |
|   - next turn keeps only `run_sql`                                                                  |
|   - `schema_retrieve` is no longer exposed to the LLM                                              |
| Output: final request.system_prompt + request.tools + request.metadata                              |
+====================================================================================================+
```

## Key Signals

The manager tracks:

- `schema_retrieve_calls`
- `schema_retrieve_successes`
- `schema_retrieve_failures`
- `consecutive_same_query_calls`
- `consecutive_no_new_tables`
- `consecutive_empty_results`
- `schema_locked`
- `lock_reason`
- `allow_metadata_query` for the empty-results lock

These signals decide whether discovery continues, whether the tool should be
hidden, and whether a recap should be injected.

## Lock Heuristics

The current lock reasons are:

- `enough_schema`
- `schema_retrieve_empty_results`
- `schema_retrieve_no_new_tables`
- `schema_retrieve_budget`
- `schema_retrieve_failures`
- `repeated_schema_query`

The manager locks exploration when the search is successful enough, when it
stalls, when it repeats, or when it exhausts the configured budget.

## Why This Matters

Schema governance turns schema discovery into a deterministic loop:

- the model does not need to remember previous table choices in prose;
- the runtime can preserve the selected tables explicitly;
- the prompt can be narrowed once enough structure is known;
- the next turn can continue from the seed tables instead of restarting;
- the empty-results lock still allows read-only metadata discovery.

## Source Files

- [`src/QueryMind/core/agent/governance.py`](../../../src/QueryMind/core/agent/governance.py)
- [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py)
- [`src/QueryMind/core/enhancer/schema_governance.py`](../../../src/QueryMind/core/enhancer/schema_governance.py)
- [`src/QueryMind/core/hook/schema_governance.py`](../../../src/QueryMind/core/hook/schema_governance.py)
- [`src/QueryMind/core/middleware/schema_governance.py`](../../../src/QueryMind/core/middleware/schema_governance.py)
- [`src/my_agent.py`](../../../src/my_agent.py)
- [`src/evals/resume_points/20260430_023016_f36173c6/run.log`](../../../src/evals/resume_points/20260430_023016_f36173c6/run.log)
