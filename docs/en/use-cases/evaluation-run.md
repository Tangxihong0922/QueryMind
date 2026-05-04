# Evaluation Run Use Case

This page focuses on one real evaluation run: the `sql_126` sample from
`run_id=20260430_023016_f36173c6`. It shows how one benchmark sample moves
from dataset validation into runtime setup, through `Agent.send_message()` and
trace extraction, then into `SqlAccuracyEvaluator` / `ExpectedOutcomeEvaluator`,
and finally into `EvaluationRunStore` and the generated report.

## Scenario

This is not an interactive QueryMind chat. It is a benchmark execution in the
evaluation harness. The run uses `src/evals/datasets/expansion.yaml`, which
contains 50 test cases. `sql_126` asks for a query that sorts
`BusinessEntityID` with `SalariedFlag`-aware ordering.

## What Happens

1. `EvaluationDataset.from_yaml()` loads the dataset and
   `EvaluationDatasetValidator.default().validate()` checks the structure.
2. `EvaluationRunStore.create_new()` / `open_existing()` maintain
   `checkpoint.json`; this run ends with `status=completed` and
   `completed_count=50`.
3. `EvaluationRuntimeResolver.resolve()` selects the runtime for
   `database_id=adventureworks`.
4. `EvaluationRuntime.ensure_initialized()` skips schema sync when
   `schema_sync_mode=reuse_existing`, so only the existing schema memory is
   initialized.
5. `EvaluationRuntime.create_session()` wires together
   `EvaluationConversationStore`, `NoOpAgentMemory`, `StaticUserResolver`,
   `RequestContext`, and `Agent`.
6. `EvaluationRunner._run_single_test_case()` calls
   `session.agent.send_message()` with the natural-language `sql_126` query.
7. `EvaluationRunner._extract_trace()` reconstructs `tool_calls`,
   `final_answer`, and the trace summary from `conversation.messages`.
8. `SqlAccuracyEvaluator.evaluate()` executes `_execute_sql()` for both the
   ground-truth SQL and the agent SQL, then sends a `JudgeInput` to the LLM
   judge.
9. `ExpectedOutcomeEvaluator.evaluate()` checks the tool sequence and final
   answer fragments against `expected_outcome`.
10. `EvaluationRunStore.append_result()` and `save_report_artifacts()` persist
    `results.jsonl`, `checkpoint.json`, and `evaluation_report.*`.

## ASCII Diagram

The diagram below turns one real benchmark run into a concrete end-to-end
loop. The facts come from `src/QueryMind/core/evaluation/base.py`,
`dataset.py`, `validation.py`, `runtime.py`, `runner.py`, `evaluators.py`,
`outcome.py`, `report.py`, `my_evaluation.py`,
`src/evals/resume_store.py`, `src/evals/reporting.py`, the real `run.log`,
and `results.jsonl`.

```text
+====================================================================================================+
| 0) EvaluationDataset.from_yaml() + EvaluationDatasetValidator.default().validate()                |
|----------------------------------------------------------------------------------------------------|
| Input: dataset_path = src/evals/datasets/expansion.yaml                                            |
| Logic:                                                                                             |
|   - load `QueryMind SQL Eval - Expansion 50`                                                       |
|   - validate `test_cases`, required fields, and duplicate ids                                      |
|   - keep samples such as `sql_126` that define `expected_outcome`                                  |
| Output: 50 test cases, dataset passes validation                                                   |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 1) EvaluationRunStore / checkpoint.json                                                            |
|----------------------------------------------------------------------------------------------------|
| Input: run_id, dataset_hash, dataset_name, config_snapshot                                          |
| Real values:                                                                                        |
|   run_id=20260430_023016_f36173c6                                                                  |
|   status=running -> completed                                                                      |
|   completed_count=50 / 50                                                                          |
|   checkpoint_path=src/evals/resume_points/20260430_023016_f36173c6/checkpoint.json                |
| Note: `open_existing()` / `find_latest()` can restore progress from the checkpoint                  |
| Output: a resumable evaluation progress snapshot                                                    |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 2) EvaluationRuntimeResolver.resolve() + EvaluationRuntime.ensure_initialized()                    |
|----------------------------------------------------------------------------------------------------|
| Input: test_case.database_id = adventureworks                                                      |
| Logic:                                                                                             |
|   - choose the runtime by database_id                                                              |
|   - initialize schema memory                                                                       |
|   - skip schema sync when `schema_sync_mode=reuse_existing`                                        |
| run.log fact:                                                                                       |
|   "Evaluation schema memory initialized in reuse_existing mode; schema sync skipped."             |
| Config snapshot:                                                                                   |
|   allow_write_sql=false, max_tool_iterations=25                                                     |
| Output: runtime is ready and bound to the evaluation database                                      |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 3) EvaluationRuntime.create_session()                                                              |
|----------------------------------------------------------------------------------------------------|
| Input: test_case + runtime                                                                         |
| Logic:                                                                                             |
|   - build `EvaluationConversationStore`                                                             |
|   - use `NoOpAgentMemory`                                                                           |
|   - resolve user with `StaticUserResolver`                                                          |
|   - create `RequestContext` and `Agent`                                                             |
| Real values:                                                                                        |
|   user.id=admin / username=Xihong / groups=[admin, user]                                           |
|   conversation_id=eval-sql_126                                                                      |
|   request_context.metadata includes evaluation=true / database_id=adventureworks / dialect=postgres |
| Output: an isolated evaluation session                                                              |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 4) EvaluationRunner._run_single_test_case() + Agent.send_message()                                 |
|----------------------------------------------------------------------------------------------------|
| Input: test_case.query                                                                              |
| Real query:                                                                                         |
|   "write a query in SQL to sort the BusinessEntityID in descending order ... Return BusinessEntityID, and SalariedFlag." |
| Agent trace (`sql_126`):                                                                            |
|   schema_retrieve x3                                                                                |
|     #1 query="employees with SalariedFlag and BusinessEntityID" search_mode="hybrid"              |
|     #2 query="HumanResources Employee table with SalariedFlag and BusinessEntityID" search_mode="vector" |
|     #3 query="employee table human resources" search_mode="hybrid"                                 |
|   run_sql x3                                                                                        |
|     #4 SELECT table_schema, table_name FROM information_schema.tables                               |
|        WHERE table_schema = 'humanresources' ORDER BY table_name;                                  |
|     #5 SELECT column_name, data_type FROM information_schema.columns                                |
|        WHERE table_schema = 'humanresources' AND table_name = 'employee'                            |
|        ORDER BY ordinal_position;                                                                   |
|     #6 SELECT businessentityid, salariedflag FROM humanresources.employee                          |
|        ORDER BY CASE WHEN salariedflag = true THEN 0 ELSE 1 END,                                   |
|                 CASE WHEN salariedflag = true THEN businessentityid END DESC,                     |
|                 CASE WHEN salariedflag = false THEN businessentityid END ASC;                     |
| Output: tool_count=6, then the model writes the final answer                                        |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 5) EvaluationRunner._extract_trace()                                                               |
|----------------------------------------------------------------------------------------------------|
| Input: conversation.messages                                                                       |
| Logic:                                                                                             |
|   - reconstruct `tool_calls` from assistant/tool messages                                          |
|   - treat the last plain-text assistant message as `final_answer`                                  |
| Trace summary:                                                                                     |
|   tool_count=6                                                                                     |
|   run_sql_call_count=3                                                                              |
|   conversation_message_count=14                                                                     |
|   component_count=48                                                                                |
| Output: `AgentResult(final_answer + tool_calls + metadata)`                                         |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 6) SqlAccuracyEvaluator.evaluate()                                                                 |
|----------------------------------------------------------------------------------------------------|
| Input: AgentResult + test_case + judge_llm                                                         |
| Logic:                                                                                             |
|   - execute `ground_truth_sql` and agent SQL via `_execute_sql()`                                  |
|   - `allow_write_sql=false`, so any non-read-only SQL would be blocked                              |
|   - build `JudgeInput` and send it to the LLM judge                                                |
| Real result:                                                                                        |
|   - agent_artifact.success=true                                                                    |
|   - agent_artifact.row_count=290                                                                    |
|   - agent_artifact.column_names=["businessentityid", "salariedflag"]                               |
|   - agent_artifact.preview_rows=[{businessentityid:290, salariedflag:true}, ...]                  |
|   - ground_truth_artifact.row_count=290                                                             |
|   - ground_truth_artifact.preview_rows=[{businessentityid:4, salariedflag:false}, ...]             |
| Judge result:                                                                                       |
|   score=0.9                                                                                         |
|   issue_tags=["wrong_order_by"]                                                                     |
|   passed=true because score >= pass_threshold=0.7                                                  |
| Output: canonical SQL evaluation result                                                             |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 7) ExpectedOutcomeEvaluator.evaluate()                                                             |
|----------------------------------------------------------------------------------------------------|
| Input: test_case.expected_outcome + AgentResult                                                    |
| Logic:                                                                                             |
|   - match `tools_called=["schema_retrieve","run_sql"]` as an ordered subsequence                  |
|   - check that `final_answer_contains=["BusinessEntityID","SalariedFlag"]`                         |
| Real result:                                                                                        |
|   score=1.0                                                                                         |
|   passed=true                                                                                       |
| Output: behavioral contract passes, so the tool path and answer shape are both acceptable         |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 8) EvaluationRunStore.append_result() + save_report_artifacts()                                    |
|----------------------------------------------------------------------------------------------------|
| Input: canonical EvaluationResult                                                                   |
| Logic:                                                                                             |
|   - append to `results.jsonl`                                                                       |
|   - update `checkpoint.json`                                                                        |
|   - generate `evaluation_report.json/csv/md/html`                                                  |
| Run result:                                                                                         |
|   results.jsonl line count = 50                                                                     |
|   checkpoint.status = completed                                                                    |
|   checkpoint.completed_count = 50                                                                  |
| Summary stats:                                                                                      |
|   sql_accuracy: 31 / 50 pass, average score = 0.672                                                |
|   expected_outcome: 18 / 50 pass                                                                   |
| Output: a resumable, traceable, and reviewable evaluation run                                       |
+====================================================================================================+
```

## Result Snapshot

- `sql_126` passes `sql_accuracy` with `score=0.9` and `issue_tags=["wrong_order_by"]`.
- `sql_126` also passes `expected_outcome` with `score=1.0`.
- The run contains 50 test cases, and `checkpoint.completed_count=50`.
- `results.jsonl` contains 50 records; canonical `sql_accuracy` passes 31 of them
  with an average score of `0.672`.
- `expected_outcome` passes 18 of them, which shows that behavioral contracts are
  often stricter than SQL-semantic scoring alone.
- The agent and ground truth both return 290 rows and the same columns, but the
  row ordering differs, which is why `wrong_order_by` appears in the result.

## Why This Matters

An evaluation run is not a single scorer. It is a full data pipeline:

- the dataset is validated before execution, so malformed samples do not enter runtime;
- the runtime assembles the session, user, and database context before the agent runs;
- the agent trace captures real tool calls instead of only the final SQL;
- `sql_accuracy` and `expected_outcome` separate SQL correctness from behavioral contracts;
- `EvaluationRunStore` makes long runs resumable, append-only, and auditable;
- the report is derived from structured results rather than hand-written notes.

## Source Files

- [`src/QueryMind/core/evaluation/base.py`](../../../src/QueryMind/core/evaluation/base.py)
- [`src/QueryMind/core/evaluation/dataset.py`](../../../src/QueryMind/core/evaluation/dataset.py)
- [`src/QueryMind/core/evaluation/validation.py`](../../../src/QueryMind/core/evaluation/validation.py)
- [`src/QueryMind/core/evaluation/runtime.py`](../../../src/QueryMind/core/evaluation/runtime.py)
- [`src/QueryMind/core/evaluation/runner.py`](../../../src/QueryMind/core/evaluation/runner.py)
- [`src/QueryMind/core/evaluation/evaluators.py`](../../../src/QueryMind/core/evaluation/evaluators.py)
- [`src/QueryMind/core/evaluation/outcome.py`](../../../src/QueryMind/core/evaluation/outcome.py)
- [`src/QueryMind/core/evaluation/report.py`](../../../src/QueryMind/core/evaluation/report.py)
- [`my_evaluation.py`](../../../my_evaluation.py)
- [`src/evals/resume_store.py`](../../../src/evals/resume_store.py)
- [`src/evals/reporting.py`](../../../src/evals/reporting.py)
- [`src/evals/datasets/expansion.yaml`](../../../src/evals/datasets/expansion.yaml)
- [`src/evals/resume_points/20260430_023016_f36173c6/checkpoint.json`](../../../src/evals/resume_points/20260430_023016_f36173c6/checkpoint.json)
- [`src/evals/resume_points/20260430_023016_f36173c6/results.jsonl`](../../../src/evals/resume_points/20260430_023016_f36173c6/results.jsonl)
- [`src/evals/resume_points/20260430_023016_f36173c6/run.log`](../../../src/evals/resume_points/20260430_023016_f36173c6/run.log)
