# SQL Governance Use Case

This page shows how SQL governance turns a broad SQL drafting problem into a
controlled loop with profiling, freeze decisions, local repair, and structural
rewrite routing for aggregation / rollup / multi-CTE turns.

## Scenario

A user asks a question that requires a structured SQL draft. The agent starts
with a candidate query, then iterates until it has enough evidence to freeze a
stable skeleton or to steer into local repair.

## What Happens

1. `SqlGovernanceMiddleware.before_llm_request(...)` looks for profile hints in
   `sql_governance_profile`, `sql_profile`, `runtime_profile`,
   `sql_runtime_profile`, or `sql_governance`, and falls back to
   `infer_profile_from_message(...)` when none are present.
2. The middleware calls `SqlGovernanceManager.register_request_profile(...)`
   for the current conversation.
3. Each `run_sql` result goes through
   `SqlGovernanceHook.after_tool(...)`, which records the SQL outcome and
   writes the refreshed snapshot back into `result.metadata`.
4. `SqlGovernanceManager.observe_sql_result(...)` updates SQL signatures, row
   grain state, anchor support, and freeze evaluation.
5. `SqlGovernanceManager.build_request_metadata(...)` exposes the current
   `sql_governance`, `runtime_profile`, `last_sql_summary`, `last_sql_shape`,
   `sql_family`, `sql_family_candidates`, and `row_grain_state` for the next
   turn, along with `repair_strategy`, `repair_reason`, and `repair_signals`.
6. `SqlGovernanceMiddleware.before_llm_request(...)` folds those snapshots into
   `request.metadata`, then appends a message-side runtime notice at the tail; it also
   injects a recap when the turn has drifted, failed, or run long enough.
7. Once the evidence is strong enough, the manager freezes the skeleton. If
   the turn is classified as `structural_rewrite`, the next turn rewrites the
   grouped summary or CTE shape instead of doing local repair.

## Harness Strategy

1. Keep profile inference separate from the runtime notice
   - The middleware first reuses a profile from `sql_governance_profile`,
     `sql_profile`, `runtime_profile`, `sql_runtime_profile`, or
     `sql_governance`; if none is present, it infers one from the last user
     message.
   - It then appends governance state as a tail `Runtime Context Notice`
     instead of rewriting the system prompt.
   - Why this matters: the system prompt stays stable while runtime state can
     change with the conversation, so the prompt itself does not drift.
   - Typical failure mode: missing profiles, a profile that does not match the
     real SQL family, or dynamic state leaking into the system prompt.

2. Recap correction at 70% of `max_tool_iterations`
   - `recap_trigger_ratio=0.7`, `recap_min_tool_iterations=4`; recap is sent at
     most once per `request_id`.
   - When tool usage gets close to the budget, or drift / repeated rejection
     appears, the middleware injects a recap that restates the anchor, row
     grain, and current repair direction.
   - Why this matters: SQL drafting often gets stuck in “one more tiny tweak”
     mode late in the turn, and recap pulls the model back to the current
     skeleton.
   - Typical failure mode: repeated `information_schema` queries, bouncing
     between near-identical SQL variants, or still not producing a stable
     shape near the end.

3. Freeze only when the evidence is strong enough
   - `freeze_trigger_ratio=0.65`, `freeze_min_tool_iterations=8`, and
     `freeze_min_best_sql_support=2`; freeze is only allowed when the anchor is
     `validated`, `row_grain_state.status=aligned`, and
     `best_sql_gap_categories` is empty.
   - Why this matters: freeze is not “looks close enough,” it is “has been
     validated enough times to become the anchor.”
   - Typical failure mode: one lucky query gets frozen too early, and every
     later turn keeps nudging the wrong anchor instead of fixing the real issue.

4. Split `turn_local_repair_mode` from `structural_rewrite`
   - When the anchor is candidate/validated, the row grain is aligned, and
     repeated success or repeated rejection suggests a small fix, local repair
     is allowed.
   - Once `_sql_repair_strategy_from_snapshot(...)` decides the turn is a
     `structural_rewrite`, the prompt asks for a rebuilt grouped summary or CTE
     shape instead of preserving the old skeleton.
   - Why this matters: some problems are predicate-level fixes, while others
     are skeleton-level rewrites; the harness needs to route those cases
     differently.
   - Typical failure mode: aggregation / rollup / multi-CTE tasks keep changing
     WHERE clauses when the real problem is the GROUP BY or CTE structure.

5. Use metadata-query and canonical-streak signals to decide whether to keep repairing
   - `metadata_query_failures` tracks SQL that is still doing metadata
     introspection; `same_success_sql_canonical_streak` and
     `last_rejection_reason_count` help decide whether to keep local repair or
     change pace.
   - Why this matters: the harness needs to separate “reconnaissance SQL” from
     the real answer. If the same canonical shape keeps succeeding, local
     repair is reasonable; if rejection repeats, the turn should change shape.
   - Typical failure mode: the model keeps running `information_schema`
     queries, or keeps resubmitting nearly identical SQL without turning the
     judge feedback into a new action.

## ASCII Diagram

The diagram below turns the SQL drafting narrative into a concrete loop. The
facts come from `src/QueryMind/core/agent/sql_governance.py`,
`src/QueryMind/core/agent/sql_governance_shape.py`,
`src/QueryMind/core/agent/sql_governance_prompt.py`,
`src/QueryMind/core/hook/sql_governance.py`,
`src/QueryMind/core/middleware/sql_governance.py`,
`src/my_agent.py`, and the real `eval-sql_126` log.

```text
+====================================================================================================+
| 0) SqlGovernanceMiddleware.before_llm_request()                                                   |
|----------------------------------------------------------------------------------------------------|
| Input: sql_governance_profile / sql_profile / runtime_profile / sql_runtime_profile               |
| Logic:                                                                                             |
|   - prefer an already available profile                                                            |
|   - fall back to infer_profile_from_message(...) when no hints are present                         |
|   - call SqlGovernanceManager.register_request_profile(...)                                        |
| sql_126 fact:                                                                                      |
|   profile source = message                                                                         |
|   categories = ["ordering"]                                                                        |
| Output: request.metadata carries the current profile / runtime snapshot                            |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 1) run_sql.execute()                                                                              |
|----------------------------------------------------------------------------------------------------|
| Input: LLM-issued tool call                                                                        |
| sql_126 real parameters:                                                                           |
|   #1 SELECT table_schema, table_name FROM information_schema.tables                                |
|      WHERE table_schema = 'humanresources' ORDER BY table_name;                                   |
|   #2 SELECT column_name, data_type FROM information_schema.columns                                 |
|      WHERE table_schema = 'humanresources' AND table_name = 'employee'                            |
|      ORDER BY ordinal_position;                                                                    |
|   #3 SELECT businessentityid, salariedflag                                                        |
|      FROM humanresources.employee                                                                  |
|      ORDER BY CASE WHEN salariedflag = true THEN 0 ELSE 1 END,                                    |
|               CASE WHEN salariedflag = true THEN businessentityid END DESC,                      |
|               CASE WHEN salariedflag = false THEN businessentityid END ASC;                      |
| Output: ToolResult(success=true, row_count=290, columns=["businessentityid","salariedflag"])      |
| Note: the first two calls are metadata introspection; the third is the final SQL                  |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 2) SqlGovernanceHook.after_tool()                                                                  |
|----------------------------------------------------------------------------------------------------|
| Entry condition: result.metadata.tool_name == "run_sql"                                           |
| Logic:                                                                                             |
|   - call observe_sql_result(...)                                                                   |
|   - then call build_request_metadata(...)                                                          |
|   - write the refreshed snapshot back into result.metadata                                         |
| sql_126 result: three consecutive run_sql results were recorded as success                        |
| Output: result.metadata.sql_governance + last_sql_summary                                          |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 3) SqlGovernanceManager.observe_sql_result()                                                       |
|----------------------------------------------------------------------------------------------------|
| Input: executed_sql / sql / last_sql_text / result metadata                                         |
| Processing: analyze_sql_text(...) -> update signatures, anchor, row grain, and freeze gate         |
| sql_126 snapshot:                                                                                  |
|   sql_attempts=3                                                                                   |
|   sql_successes=3                                                                                  |
|   sql_failures=0                                                                                   |
|   last_sql_result_success=true                                                                     |
|   last_sql_text = "SELECT businessentityid, salariedflag FROM humanresources.employee ..."        |
|   row_grain_state = aligned                                                                        |
|   best_sql_support_count = 1                                                                       |
|   sql_exploration_frozen = false                                                                   |
| Output: runtime_profile / best_sql_* / row_grain_state / last_sql_summary                           |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 4) sql_governance_shape.py                                                                         |
|----------------------------------------------------------------------------------------------------|
| Extract SQL shape: select / where / join / group by / having / order by / subquery / CTE           |
| sql_126 shape facts:                                                                               |
|   table_references=["humanresources.employee"]                                                     |
|   feature_names=["case_expression", "order_by"]                                                    |
|   metadata_query=false                                                                              |
|   row_grain=detail                                                                                  |
| Note: this is the ordering family, not metadata-query, aggregation, join, or window drafting      |
| Output: canonical / core signature + shape features                                                 |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 5) sql_governance_prompt.py                                                                        |
|----------------------------------------------------------------------------------------------------|
| Generates prompt text and recap text                                                               |
| Real prompt excerpt:                                                                               |
|   "## SQL Governance"                                                                              |
|   "- Avoid metadata introspection queries unless they are explicitly allowed."                     |
|   "- Keep the current row grain stable and call `run_sql` once the table path is clear."           |
| sql_126 semantics: profile source=message, categories=["ordering"]                                 |
| Output: governance prompt block + (recap block only when drift / mismatch / repeated rejection)    |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 6) SqlGovernanceMiddleware.before_llm_request()                                                    |
|----------------------------------------------------------------------------------------------------|
| Input: request.metadata + request.system_prompt + request.messages                                  |
| Logic:                                                                                             |
|   - merge the latest snapshot                                                                      |
|   - append a message-side runtime notice at the tail                                               |
|   - inject a recap block when needed                                                               |
|   - adjust the next turn based on current anchor / repair mode                                     |
| sql_126 visible context:                                                                           |
|   request.metadata carries sql_governance / runtime_profile / last_sql_summary                     |
| Output: LlmRequest enters the next LLM turn                                                         |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 7) Next LLM / tool selection                                                                       |
|----------------------------------------------------------------------------------------------------|
| Model sees: a stable system-prompt tail + message-side runtime notice + metadata snapshot          |
| Result: continue repairing if there is drift, or finish once the SQL shape is stable              |
| sql_126 result: the final `ORDER BY CASE ...` version is completed and the query turn ends         |
+====================================================================================================+
```

## Key Signals

The manager tracks:

- SQL attempts, successes, and failures;
- `metadata_query_failures`;
- SQL text signatures and canonical signatures;
- `best_sql_support_count`;
- `repair_strategy`, `repair_reason`, and `repair_signals`;
- row-grain alignment;
- `same_success_sql_canonical_streak`;
- `turn_local_repair_mode`;
- freeze state and freeze reason.

## Freeze Behavior

Freeze is triggered when the current candidate has enough support and the
evaluation threshold is met. After freeze:

- the current skeleton is treated as the anchor;
- the runtime can prefer local repair; structural-rewrite turns can rebuild the grouped summary or CTE shape instead of staying local;
- recap messages can steer the model toward the frozen shape.

## Why This Matters

SQL governance keeps the agent from restarting the same query shape over and
over:

- it captures the best known skeleton explicitly;
- it detects drift and repeated failures;
- it can freeze a validated SQL shape;
- it makes later turns cheaper because they can repair around a known anchor.

## Source Files

- [`src/QueryMind/core/agent/sql_governance.py`](../../../src/QueryMind/core/agent/sql_governance.py)
- [`src/QueryMind/core/agent/sql_governance_prompt.py`](../../../src/QueryMind/core/agent/sql_governance_prompt.py)
- [`src/QueryMind/core/agent/sql_governance_shape.py`](../../../src/QueryMind/core/agent/sql_governance_shape.py)
- [`src/QueryMind/core/hook/sql_governance.py`](../../../src/QueryMind/core/hook/sql_governance.py)
- [`src/QueryMind/core/middleware/sql_governance.py`](../../../src/QueryMind/core/middleware/sql_governance.py)
- [`src/my_agent.py`](../../../src/my_agent.py)
- [`src/evals/resume_points/20260430_023016_f36173c6/run.log`](../../../src/evals/resume_points/20260430_023016_f36173c6/run.log)
