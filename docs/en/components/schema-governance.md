# Schema Governance

Schema governance manages the conversation-scoped `schema_retrieve` loop.
It keeps schema discovery separate from SQL drafting and exposes a compact
snapshot for request-time filtering and message-side runtime notices while the
system prompt stays stable.

## Core Pieces

- `SchemaGovernanceManager`: owns policy, mutable state, lock heuristics, recap gating, and request snapshots.
- `SchemaGovernanceHook`: observes `schema_retrieve` results after tool execution and writes the refreshed snapshot back into `result.metadata`.
- `SchemaGovernanceMiddleware`: merges the snapshot into `request.metadata`, prepares recap metadata for downstream runtime notices, and can hide `schema_retrieve` from `request.tools`.
- `SchemaGovernanceEnhancer`: compatibility helper that no longer mutates the prompt in the default runtime wiring.

`build_schema_governance_stack()` returns the reusable bundle of policy, manager, hook, middleware, and compatibility enhancer.

## Policy

`SchemaGovernancePolicy` exposes the knobs that drive the lock and recap behavior:

- `schema_tool_name`
- `schema_retrieve_max_calls`
- `schema_retrieve_max_failures`
- `schema_retrieve_successes_to_lock`
- `schema_retrieve_same_query_limit`
- `schema_retrieve_no_new_tables_limit`
- `schema_retrieve_empty_results_limit`
- `recap_trigger_ratio`
- `recap_min_tool_iterations`
- `system_prompt_block`
- `recap_message`

## State

`SchemaGovernanceState` stores the mutable conversation state:

- call counters for `schema_retrieve`, successes, and failures;
- streak counters for repeated queries, no-new-table results, and empty results;
- the last normalized schema query;
- the set of seen schema tables;
- the lock flag and lock reason;
- the latest raw schema metadata and compact schema summary;
- the last recap request id.

`SchemaGovernanceStack` is a convenience wrapper that packages the policy, manager, hook, middleware, and enhancer together.

## Manager Behavior

### `observe_schema_result(...)`

`observe_schema_result(...)` is called after a `schema_retrieve` tool result.
It:

- normalizes `selected_tables` and drops blanks and duplicates inside the same result;
- increments the call counter on every execution;
- counts a success only when `success` is true and the result includes selected tables;
- counts a failure otherwise;
- tracks repeated queries through a normalized `last_schema_query`;
- tracks empty-result and no-new-table streaks;
- updates `seen_schema_tables`;
- builds `last_schema_summary` with the query, search mode, graph hint, selected tables, new tables, table refs, counters, lock state, and a human-readable `summary_text`.

### Lock Heuristics

The manager locks the conversation in this order:

1. `enough_schema` when `schema_retrieve_successes` reaches `schema_retrieve_successes_to_lock`;
2. `schema_retrieve_empty_results` when the empty-result streak reaches `schema_retrieve_empty_results_limit`;
3. `schema_retrieve_no_new_tables` when the no-new-table streak reaches `schema_retrieve_no_new_tables_limit`;
4. `schema_retrieve_budget` when `schema_retrieve_calls` reaches `schema_retrieve_max_calls`;
5. `schema_retrieve_failures` when `schema_retrieve_failures` reaches `schema_retrieve_max_failures`;
6. `repeated_schema_query` when the repeated-query streak reaches `schema_retrieve_same_query_limit`.

Once locked, the state stays locked for the rest of the conversation.

### `should_inject_recap(...)`

`should_inject_recap(...)` only runs when the request has a `request_id`.
It returns `true` once per request id and triggers when any of these are true:

- the conversation is already locked;
- the schema retrieval loop has reached the recap threshold derived from `max_tool_iterations`, `recap_trigger_ratio`, and `recap_min_tool_iterations`;
- the number of schema retrieval calls has reached the capped call threshold used by the manager.

### `should_hide_schema_tool(...)`

`should_hide_schema_tool(...)` returns `true` only when the conversation is locked.
The middleware and agent turn-prep path use that signal to remove `schema_retrieve` from the visible tool list.

### `build_request_metadata(...)`

`build_request_metadata(...)` returns `{}` until the conversation has at least one schema retrieval call or a stored summary.
Otherwise it returns:

- `schema_governance`
  - `conversation_id`
  - `schema_retrieve_calls`
  - `schema_retrieve_successes`
  - `schema_retrieve_failures`
  - `consecutive_same_query_calls`
  - `consecutive_no_new_tables`
  - `consecutive_empty_results`
  - `schema_locked`
  - `lock_reason`
  - `last_schema_query`
- `last_schema_summary`

When the lock reason is `schema_retrieve_empty_results`, the snapshot also adds:

- top-level `allow_metadata_query: true`
- `schema_governance.allow_metadata_query: true`

### `build_prompt_block(...)`

`build_prompt_block(...)` renders the stable tail guidance used by the system prompt.
It uses the locked prompt when `schema_locked` is true, otherwise it uses
`policy.system_prompt_block`.
The helper still appends the latest schema summary when available, or the lock
reason when the conversation is locked without a summary.

For the empty-results lock, the helper also adds the special guidance that
read-only metadata discovery is still allowed for that turn.
The default runtime now surfaces volatile schema state through message-side
notices instead of carrying it in the system prompt.

## Request-Time Flow

The runtime uses the manager in two places:

- `Agent._prepare_turn_prompt()` merges the snapshot into the turn metadata,
  hides `schema_retrieve` when locked, and keeps the system prompt stable.
- `SchemaGovernanceMiddleware.before_llm_request()` repeats the metadata merge,
  stores recap text for the downstream runtime notice, and removes
  `schema_retrieve` from `request.tools` when the conversation is locked.
- `SqlGovernanceMiddleware.before_llm_request()` later consumes the schema
  snapshot and prepends the user-side runtime notice that exposes the live
  schema summary and lock reason together with the SQL state.

The middleware only adds recap payloads when the current request has not already
been summarized for that turn.

The hook closes the loop by updating `result.metadata` after each `schema_retrieve` call, so the next turn can reuse the latest schema state.

## ASCII Diagram

The diagram below connects the `schema_retrieve` ToolResult, schema-governance state updates, request snapshots,
prompt assembly, and tool filtering. The facts come from `src/my_agent.py`,
`src/QueryMind/core/agent/governance.py`, `src/QueryMind/core/middleware/schema_governance.py`,
`src/QueryMind/core/enhancer/schema_governance.py`, and the real `eval-sql_126` log.

```text
+====================================================================================================+
| 0) schema_retrieve.execute()                                                                      |
|----------------------------------------------------------------------------------------------------|
| Input: ToolCall.arguments = {query, search_mode, limit, similarity_threshold, graph_hint, ...}    |
| Real calls (eval-sql_126):                                                                         |
|   #1 query="employees with SalariedFlag and BusinessEntityID" search_mode="hybrid"               |
|   #2 query="employee table with SalariedFlag and BusinessEntityID" search_mode="vector"          |
|   #3 query="HumanResources Employee" search_mode="hybrid"                                         |
| Output: ToolResult.metadata -> total_results / selected_tables / summary_text                      |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 1) SchemaGovernanceHook.observe_schema_result()                                                    |
|----------------------------------------------------------------------------------------------------|
| Input: ToolResult.metadata + success                                                               |
| Logic:                                                                                             |
|   - normalize selected_tables, query, and table refs                                                |
|   - maintain calls / successes / failures / empty / no_new / same_query streaks                    |
|   - build last_schema_summary                                                                      |
| eval-sql_126 snapshot:                                                                             |
|   after #1 -> calls=1 successes=1 failures=0 locked=False                                         |
|   after #2 -> calls=2 successes=1 failures=1 locked=False                                         |
|   after #3 -> calls=3 successes=2 failures=1 locked=True lock_reason=enough_schema                |
| Output: write back result.metadata.schema_governance + last_schema_summary                          |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 2) SchemaGovernanceManager                                                                          |
|----------------------------------------------------------------------------------------------------|
| Input: conversation_id + latest state                                                              |
| Logic:                                                                                             |
|   - build_request_metadata() emits a compact snapshot                                              |
|   - build_prompt_block() chooses unlocked vs. locked prompt based on lock_reason                   |
|   - should_hide_schema_tool() decides whether `schema_retrieve` should disappear next turn         |
| Real snapshot (eval-sql_126):                                                                      |
|   schema_governance.schema_retrieve_calls=3                                                       |
|   schema_governance.schema_retrieve_successes=2                                                   |
|   schema_governance.schema_retrieve_failures=1                                                    |
|   schema_governance.schema_locked=true                                                            |
|   schema_governance.lock_reason=enough_schema                                                     |
|   last_schema_summary.summary_text =                                                               |
|     "schema_retrieve[hybrid] query='HumanResources Employee' -> 10 table(s): ... (+6) | new=8 | lock=enough_schema" |
| Prompt excerpt:                                                                                    |
|   "## Schema Governance"                                                                           |
|   "- schema_locked: true"                                                                          |
|   "- `schema_retrieve` is locked for this turn."                                                  |
|   "- Enter SQL draft mode now."                                                                    |
|   "- Call `run_sql` instead of exploring more schema."                                            |
| Output: request.metadata + snapshot for downstream runtime notice                                   |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 3) Agent._prepare_turn_prompt()                                                                    |
|----------------------------------------------------------------------------------------------------|
| Input: user_message + tool_schemas + request.metadata + stable system_prompt                       |
| Logic:                                                                                             |
|   - merge the snapshot into turn metadata                                                           |
|   - hide `schema_retrieve` when governance says the turn is locked                                  |
|   - keep the system prompt byte-stable except for the short tail rules                              |
| Result: visible tools narrow while dynamic schema state stays out of the system prompt              |
| Example: after lock, the schema state is carried by metadata and runtime notices                   |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 4) SchemaGovernanceMiddleware.before_llm_request()                                                 |
|----------------------------------------------------------------------------------------------------|
| Input: request.metadata + request.tools + request.system_prompt                                    |
| Logic:                                                                                             |
|   - merge the snapshot again                                                                        |
|   - store recap text for the downstream runtime notice                                             |
|   - remove `schema_retrieve` when `should_hide_schema_tool()` is true                               |
|   - the metadata-discovery exception only applies to empty-result locks                             |
| eval-sql_126 result:                                                                               |
|   - next turn keeps only `run_sql`                                                                  |
|   - `schema_retrieve` is no longer exposed to the LLM                                               |
|   - the SQL middleware prepends the user-side runtime notice that makes lock reason visible         |
| Output: final request.system_prompt + request.tools + request.metadata                              |
+====================================================================================================+
```

## Lock Reasons

The lock reasons are:

- `enough_schema`
- `schema_retrieve_empty_results`
- `schema_retrieve_no_new_tables`
- `schema_retrieve_budget`
- `schema_retrieve_failures`
- `repeated_schema_query`

These reasons are not just labels. They also affect the prompt text, the recap behavior, and the empty-results metadata-discovery exception.

## What This Page Covers

- schema exploration state;
- lock heuristics;
- request snapshot fields;
- hook and middleware integration;
- tool hiding behavior;
- recap injection.

## What This Page Does Not Cover

- SQL shape analysis;
- SQL freeze behavior;
- schema retrieval search-mode rules;
- schema result context assembly.

Those belong in the SQL governance, prompt-chain, and context pages.

## Source Files

- [`src/QueryMind/core/agent/governance.py`](../../../src/QueryMind/core/agent/governance.py)
- [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py)
- [`src/QueryMind/core/enhancer/schema_governance.py`](../../../src/QueryMind/core/enhancer/schema_governance.py)
- [`src/QueryMind/core/hook/schema_governance.py`](../../../src/QueryMind/core/hook/schema_governance.py)
- [`src/QueryMind/core/middleware/schema_governance.py`](../../../src/QueryMind/core/middleware/schema_governance.py)
