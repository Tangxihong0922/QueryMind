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

## Harness Strategy

1. Session-level call budget and tool visibility lock for `schema_retrieve`
   - `schema_retrieve_max_calls=3`, counted across the whole conversation, not
     reset every turn.
   - `consecutive_no_new_tables=2` or `consecutive_empty_results=2` enters
     `schema_locked`.
   - Once `schema_locked=True`, the next `before_llm_request` removes
     `schema_retrieve` from `request.tools`, so the LLM cannot see it for a
     while.
   - Why this matters: it turns schema exploration into a bounded phase and
     keeps the model from spending most of its budget on “just keep looking for
     tables.”
   - Typical failure mode: repeated paraphrases that keep returning the same
     result set, or empty results that lead to blind retry loops.

2. Lock after two useful hits
   - `schema_retrieve_successes_to_lock=2`, so two useful hits can lock the
     conversation early.
   - Why this matters: once the key tables and join path are visible, more
     retrieval usually adds noise rather than reducing uncertainty.
   - Typical failure mode: the model already has the target table but keeps
     “completing” schema discovery and gets distracted by extra tables or
     columns.

3. Recap correction at 70% of `max_tool_iterations`
   - `recap_trigger_ratio=0.7`, `recap_min_tool_iterations=4`; recap is sent at
     most once per `request_id`.
   - The middleware injects a recap when tool usage is close to the budget
     limit, and it restates the move from discovery to SQL drafting.
   - Why this matters: long runs often drift in the last 20% of the budget
     instead of converging; the recap pulls the model back to the main line.
   - Typical failure mode: tool count keeps rising while information gain drops
     to near zero, or the model keeps bouncing between schema search and SQL
     draft mode.

4. Keep a metadata-discovery escape hatch for empty-result locks
   - When the lock reason is `schema_retrieve_empty_results`, the snapshot also
     marks `allow_metadata_query=True`.
   - Why this matters: an empty result does not always mean the schema is fully
     known; sometimes the query was simply too narrow. A read-only metadata
     path can recover the turn.
   - Typical failure mode: the first query is too narrow, and a hard lock would
     remove the last chance to find candidate tables and join paths.

5. Use repeated-query and failure counts as a final guardrail
   - `schema_retrieve_same_query_limit=2` and
     `schema_retrieve_max_failures=2` catch repeated wording and repeated
     failure loops.
   - Why this matters: if the model is just rephrasing the same search or keeps
     failing without changing strategy, more freedom only magnifies the loop.
   - Typical failure mode: near-duplicate queries keep appearing, or two failed
     attempts pass with no new information.

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
