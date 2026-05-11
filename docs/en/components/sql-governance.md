# SQL Governance

SQL governance manages the SQL drafting loop after schema discovery has started.
It keeps the task profile, SQL shape, best anchor, and freeze/repair transition
separate from schema exploration, and surfaces live summary / anchor / freeze
state as message-side runtime notices while the system prompt stays stable.

## Core Pieces

- `SqlGovernanceManager`: owns policy, state, snapshot assembly, recap gating, and freeze decisions.
- `SqlGovernanceHook`: records `run_sql` outcomes after tool execution and writes the refreshed snapshot back into `result.metadata`.
- `SqlGovernanceMiddleware`: infers or reuses the current profile, merges request metadata, appends the user-side runtime notice at the tail, and injects recap blocks when the turn has drifted or run long enough; the runtime notice also carries repair strategy / reason / signals.

There is no separate SQL enhancer. Prompt text is rendered through manager helpers for the stable system-prompt tail, while volatile SQL state is exposed by middleware as message-side runtime notices.

`build_sql_governance_stack()` returns the reusable bundle of policy, manager, hook, and middleware.

## Helper Modules

`sql_governance_prompt.py` and `sql_governance_shape.py` split the problem into two layers:

- prompt rendering and recap text;
- profile inference, SQL shape analysis, and rejection-reason helpers.

`build_sql_governance_profile()`, `infer_profile_from_message()`, `build_sql_governance_prompt_block()`, and `build_sql_governance_recap_block()` live in that split.
`analyze_sql_text()` and `analyze_sql_shape()` use `sqlglot` to extract SQL structure.
The helper stack now also distinguishes `local_repair` from `structural_rewrite`, and it treats `case_when`, `null_handling`, `comparison`, and `distinct` as conservative detail-expression families.

The analysis covers:

- select / where / join / group by / having / order by;
- window and ranking functions;
- subqueries and CTE counts;
- set operations;
- row grain;
- metadata-query detection;
- canonical and core signatures.

## Policy

`SqlGovernancePolicy` exposes these knobs:

- `max_query_length`
- `max_subqueries`
- `max_cte_depth`
- `max_joins`
- `recap_trigger_ratio`
- `recap_min_tool_iterations`
- `freeze_trigger_ratio`
- `freeze_min_tool_iterations`
- `freeze_min_best_sql_support`
- `system_prompt_block`
- `recap_message`

## State

`SqlGovernanceState` stores the mutable conversation state:

- conversation identifiers and profile state;
- SQL attempts, successes, failures, and metadata-query failures;
- the latest SQL text, signatures, shape features, and rejection reason;
- row-grain state, SQL family, candidate families, and turn-local repair mode;
- the best SQL anchor and its support count;
- the frozen SQL snapshot and freeze reason;
- recap bookkeeping and the last freeze evaluation.

`SqlGovernanceState` is intentionally rich because it powers both snapshot assembly and freeze evaluation.

## Manager Behavior

### `register_request_profile(...)`

`register_request_profile(...)` stores the current profile for the conversation.
It can receive a profile from middleware or inference, clears the profile when it has no signal, stores `last_user_message` when provided, updates `profile_signature`, and resolves:

- `sql_family`
- `sql_family_candidates`
- `row_grain_state`

It uses `_resolve_sql_family_state(...)` to do that resolution.

### `observe_sql_result(...)`

`observe_sql_result(...)` runs after each `run_sql` result.
It:

- records attempts, successes, and failures;
- reads SQL text from `executed_sql`, `sql`, or the previous `last_sql_text`;
- analyzes the SQL text with `analyze_sql_text(...)`;
- updates the SQL signature, core signature, and canonical signature;
- increments `metadata_query_failures` when the SQL shape is a metadata query;
- computes `last_gap_categories`;
- tracks repeated rejection reasons;
- updates the best SQL anchor when a better candidate appears;
- evaluates turn-local repair mode;
- evaluates freeze and, when the criteria are met, copies the best anchor into the frozen snapshot.

Metadata-query results are treated specially: they do not contribute to a validated anchor.

### `build_request_metadata(...)`

`build_request_metadata(...)` returns `{}` until the conversation has some SQL state to expose.
Otherwise it returns:

- `sql_governance`
  - `conversation_id`
  - `sql_attempts`
  - `sql_successes`
  - `sql_failures`
  - `metadata_query_failures`
  - `last_sql_result_success`
  - `last_sql_result_has_metadata_query`
  - `last_sql_text`
  - `last_sql_signature`
  - `last_sql_core_signature`
  - `last_sql_canonical_signature`
  - `last_success_sql_canonical_signature`
  - `last_sql_shape`
  - `last_gap_categories`
  - `last_tool_iterations`
  - `last_max_tool_iterations`
  - `same_success_sql_canonical_streak`
  - `last_rejection_reason`
  - `last_rejection_reason_count`
  - `turn_local_repair_mode`
  - `repair_strategy`
  - `repair_reason`
  - `repair_signals`
  - `sql_family`
  - `sql_family_candidates`
  - `row_grain_state`
  - `best_sql_text`
  - `best_sql_shape`
  - `best_sql_signature`
  - `best_sql_core_signature`
  - `best_sql_canonical_signature`
  - `best_sql_gap_categories`
  - `best_sql_support_count`
  - `sql_exploration_frozen`
  - `frozen_sql_text`
  - `frozen_sql_shape`
  - `frozen_sql_signature`
  - `frozen_sql_core_signature`
  - `frozen_sql_canonical_signature`
  - `freeze_reason`
  - `freeze_trigger_tool_iterations`
  - `freeze_trigger_max_tool_iterations`
  - `last_freeze_evaluation`
- `runtime_profile`
- `last_sql_summary`
- `last_sql_shape`
- `sql_family`
- `sql_family_candidates`
- `row_grain_state`

The `runtime_profile` is derived from the current anchor when one is available.

### `should_inject_recap(...)`

`should_inject_recap(...)` only emits one recap per `request_id`.
It delegates to `_sql_should_emit_recap(...)`, which returns true when the current turn shows drift, a metadata-query result, a row-grain mismatch, a family mismatch, gap categories, or repeated rejection signals.
It does not emit a recap once `sql_exploration_frozen` is true.

### `build_prompt_block(...)` and `build_recap_block(...)`

`build_prompt_block(...)` and `build_recap_block(...)` render prompt text through the helper modules.
`build_prompt_block(...)` passes the current profile, missing categories, frozen state, freeze reason, frozen and best anchor text, anchor tier, SQL family, and turn-local repair mode into the prompt renderer, but the default runtime keeps that guidance on the stable system-prompt tail rather than using it for live state.
When `repair_strategy` is `structural_rewrite`, the prompt asks the model to rebuild the grouped summary or CTE shape from scratch; when the profile matches `case_when`, `null_handling`, `comparison`, or `distinct`, it stays conservative and only asks for CASE / COALESCE / comparison / deduplication edits.
`build_recap_block(...)` renders the reactive recap text when the current state says the turn needs one.

## Freeze and Repair

Freeze is the main behavior change in SQL governance.
The manager only freezes when all of these are true:

- a valid best SQL anchor exists;
- that anchor is validated, not merely a candidate;
- the current row grain is aligned;
- there are no remaining gap categories for the anchor;
- `last_tool_iterations` is present and reaches the threshold derived from `freeze_trigger_ratio` and `freeze_min_tool_iterations`;
- the conversation is not already frozen.

The validated anchor check also requires enough support for the best SQL candidate: `best_sql_support_count` must reach at least `max(2, freeze_min_best_sql_support)`.

When the state freezes, the manager copies the best SQL anchor into the frozen snapshot and records a freeze reason that includes the iteration count.

`turn_local_repair_mode` becomes true when the anchor is candidate or validated, the state is not frozen, the row grain is aligned, and either the same successful canonical SQL repeats or the same rejection reason repeats; if `_sql_repair_strategy_from_snapshot()` classifies the turn as `structural_rewrite`, the flag is forced off so aggregation / rollup / multi-CTE turns rewrite instead of local-repairing.

## Request-Time Flow

This section shows only the SQL drafting loop that starts after schema discovery.
For `sql_126`, the precondition is that `schema_retrieve` has already narrowed the
target to `HumanResources.Employee`, and SQL governance then takes over.

`sql_126` facts:
- The user asked to sort `BusinessEntityID` descending for `SalariedFlag = 'true'` rows and ascending for `SalariedFlag = 'false'` rows.
- The final result summary is `row_count=290`, `columns=["businessentityid","salariedflag"]`.
- The preview starts with `290, true` and `289, true`.

```text
+====================================================================================================+
| 1) run_sql.execute()                                                                              |
|----------------------------------------------------------------------------------------------------|
| Input: an LLM tool call                                                                           |
| sql_126 real arguments:                                                                           |
|   #1 SELECT table_schema, table_name FROM information_schema.tables                                |
|      WHERE table_schema = 'humanresources' ORDER BY table_name;                                   |
|   #2 SELECT column_name, data_type FROM information_schema.columns                                 |
|      WHERE table_schema = 'humanresources' AND table_name = 'employee'                            |
|      ORDER BY ordinal_position;                                                                    |
|   #3 SELECT businessentityid, salariedflag FROM humanresources.employee                           |
|      ORDER BY CASE WHEN salariedflag = true THEN 0 ELSE 1 END,                                    |
|               CASE WHEN salariedflag = true THEN businessentityid END DESC,                      |
|               CASE WHEN salariedflag = false THEN businessentityid END ASC;                      |
| Output: ToolResult(success=true, summary=row_count=290, columns=["businessentityid","salariedflag"])|
| Note: the first two calls are metadata introspection; the third call is the usable final SQL       |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 2) SqlGovernanceHook.after_tool()                                                                  |
|----------------------------------------------------------------------------------------------------|
| Guard: `result.metadata.tool_name == "run_sql"`                                                    |
| Actions:                                                                                           |
|   - call `observe_sql_result(conversation_id, request_id, result_metadata, success)`              |
|   - call `build_request_metadata(...)`                                                             |
|   - write the refreshed snapshot back into `result.metadata`                                       |
| sql_126 fact: the log records 3 consecutive `Recorded SQL governance state ... success=True`       |
| Output: the next turn can read the latest SQL state immediately                                     |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 3) sql_governance.py / SqlGovernanceManager.observe_sql_result()                                  |
|----------------------------------------------------------------------------------------------------|
| Reads: `executed_sql` / `sql` / `last_sql_text`                                                    |
| Process: `analyze_sql_text(...)` -> update attempts, successes, failures, signatures, anchor, gate |
| sql_126 snapshot:                                                                                  |
|   sql_attempts=3, sql_successes=3, sql_failures=0                                                  |
|   last_sql_result_success=true                                                                     |
|   last_sql_text="SELECT businessentityid, salariedflag FROM humanresources.employee ..."           |
|   last_sql_summary.summary_text="run_sql[success] features=case_expression, order_by sql='...'"   |
|   row_grain_state={expected=detail, observed=detail, status=aligned, reason=aligned}              |
|   best_sql_support_count=1 -> `anchor_tier=candidate`                                              |
|   freeze gate: `last_tool_iterations=3 < threshold=16` -> `sql_exploration_frozen=false`          |
| Output: `sql_governance` / `runtime_profile` / `last_sql_summary` / `last_sql_shape`               |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 4) sql_governance_shape.py                                                                         |
|----------------------------------------------------------------------------------------------------|
| Extract SQL shape: select / where / join / group by / having / order by / subquery / CTE / row grain|
| sql_126 shape slice:                                                                               |
|   table_references=["humanresources.employee"]                                                     |
|   feature_names=["case_expression", "order_by"]                                                    |
|   metadata_query=false                                                                              |
|   row_grain=detail                                                                                  |
| Meaning: this is an ordering family, not a metadata query, aggregation loop, or window draft      |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 5) sql_governance_prompt.py                                                                        |
|----------------------------------------------------------------------------------------------------|
| Renders stable guidance text and recap text                                                         |
| Real prompt excerpt:                                                                               |
|   "## SQL Governance"                                                                              |
|   "- Avoid metadata introspection queries unless they are explicitly allowed."                     |
|   "- Keep the current row grain stable and call `run_sql` once the table path is clear."           |
| sql_126 semantics: profile source=message, categories=["ordering"]                                |
| Output: a stable guidance block plus a recap block only when drift / mismatch / rejection repeats  |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 6) SqlGovernanceMiddleware.before_llm_request()                                                    |
|----------------------------------------------------------------------------------------------------|
| Input: `request.metadata` + `request.system_prompt` + `request.messages`                            |
| Order:                                                                                             |
|   - read `sql_governance_profile` / `sql_profile` / `runtime_profile`                             |
|   - call `register_request_profile(...)`                                                            |
|   - merge the latest snapshot back into `request.metadata`                                         |
|   - append a single user-side runtime notice at the tail with schema recap, SQL anchor preview, freeze reason, |
|     row grain, and SQL recap                                                                        |
|   - insert a recap block when needed                                                                |
| sql_126 visible context:                                                                           |
|   request.metadata = {sql_governance:{sql_attempts=3,...},                                         |
|                        runtime_profile:{source=runtime, anchor_tier=candidate,                     |
|                        sql_family=ordering, best_sql_preview="SELECT businessentityid, ..."}}      |
| Output: `LlmRequest` for the next LLM turn                                                         |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 7) Next LLM turn / tool selection                                                                  |
|----------------------------------------------------------------------------------------------------|
| Model sees: stable system prompt + runtime notice + metadata snapshot                               |
| Result: continue refining or finish the SQL draft                                                  |
| sql_126 outcome: the agent stabilizes on the final `ORDER BY CASE ...` form and ends the turn      |
+====================================================================================================+
```

The boundary is simple: `run_sql` writes back into `result.metadata` first,
`SqlGovernanceManager` turns that into a state snapshot, and
`SqlGovernanceMiddleware` injects that state into the next `request.metadata`
and appends the user-side runtime notice at the tail instead of mutating the system prompt.

## What This Page Covers

- SQL profile inference;
- SQL shape analysis;
- request snapshot fields;
- anchor and freeze behavior;
- recap and repair-mode logic;
- hook and middleware integration.

## What This Page Does Not Cover

- schema exploration locking;
- schema retrieval search-mode rules;
- conversation persistence;
- general memory behavior.

Those belong in the schema governance, prompt-chain, context, and memory pages.

## Source Files

- [`src/QueryMind/core/agent/sql_governance.py`](../../../src/QueryMind/core/agent/sql_governance.py)
- [`src/QueryMind/core/agent/sql_governance_prompt.py`](../../../src/QueryMind/core/agent/sql_governance_prompt.py)
- [`src/QueryMind/core/agent/sql_governance_shape.py`](../../../src/QueryMind/core/agent/sql_governance_shape.py)
- [`src/QueryMind/core/hook/sql_governance.py`](../../../src/QueryMind/core/hook/sql_governance.py)
- [`src/QueryMind/core/middleware/sql_governance.py`](../../../src/QueryMind/core/middleware/sql_governance.py)
