# Evaluation

This page documents the QueryMind evaluation harness: how a dataset is loaded,
how a runtime is assembled, how agent traces are captured, how `sql_accuracy`
and `expected_outcome` are scored, how results are resumed, and how reports are
generated.

The facts below are grounded in:

- `src/QueryMind/core/evaluation/base.py`
- `src/QueryMind/core/evaluation/dataset.py`
- `src/QueryMind/core/evaluation/validation.py`
- `src/QueryMind/core/evaluation/runtime.py`
- `src/QueryMind/core/evaluation/runner.py`
- `src/QueryMind/core/evaluation/evaluators.py`
- `src/QueryMind/core/evaluation/outcome.py`
- `src/QueryMind/core/evaluation/report.py`
- `my_evaluation.py`
- `src/evals/resume_store.py`
- `src/evals/reporting.py`
- the real `run.log`, `checkpoint.json`, `results.jsonl`, and
  `evaluation_report.md` from `run_id=20260430_023016_f36173c6`

## What Evaluation Is For

Evaluation answers three practical questions:

1. Can QueryMind solve the benchmark question end to end?
2. Does the agent follow the expected tool path?
3. Does the final SQL return the right result shape and content?

The current harness is SQL-centric. It evaluates:

- dataset validation
- isolated agent sessions
- schema retrieval and SQL tool usage
- LLM-as-judge SQL scoring
- deterministic expected-outcome checks
- checkpointed resume and report generation

It does not mainly measure cross-sample Agent Memory reuse. Each test case runs
in an isolated session with `NoOpAgentMemory`.

## Quick Start

Common execution entry points:

```bash
my-evaluation \
  --dataset-path src/evals/datasets/expansion.yaml \
  --resume-root eval_output/resume_points \
  --report-output-dir eval_output/eval_results
```

Resume the latest incomplete run:

```bash
my-evaluation --resume-latest
```

Generate a report from an existing run:

```bash
python evals/generate_report.py --latest --resume-root evals/resume_points
```

Useful environment variables:

- `EVAL_DATASET_PATH`
- `EVAL_OUTPUT_DIR`
- `EVAL_MAX_CONCURRENCY`
- `EVAL_MAX_TOOL_ITERATIONS`
- `EVAL_PASS_THRESHOLD`
- `EVAL_PREVIEW_ROWS`
- `EVAL_PROGRESS`
- `EVAL_CONSOLE_LOG_LEVEL`
- `EVAL_FILE_LOG_LEVEL`
- `EVAL_RECOVERY_*`

The evaluation run used as the anchor in this page is:

- `run_id=20260430_023016_f36173c6`
- `dataset_name=QueryMind SQL Eval - Expansion 50`
- `total_test_cases=50`
- `status=completed`
- `completed_count=50`
- `sql_accuracy` and `expected_outcome` as the configured evaluators

## Runtime Layout

### Dataset Loading

`EvaluationDataset.from_yaml()` and `EvaluationDataset.from_json()` load the
dataset, then `EvaluationDatasetValidator.default().validate()` checks the
structure.

Validation rules include:

- `dataset.test_cases` must exist and be non-empty
- every test case must satisfy the required fields in the spec
- field types must match the spec
- duplicate test case IDs are rejected

The dataset object stores:

- dataset name and description
- a list of `SqlTestCase` objects
- optional metadata for grouping and reporting

Each `SqlTestCase` carries:

- `id`
- `database_id`
- `dialect`
- `query`
- `ground_truth_sql`
- optional user identity fields
- optional `expected_outcome`

### Runtime Assembly

`EvaluationRuntime` binds together:

- a SQL runner
- schema memory
- an agent LLM service
- optional schema sync
- a deterministic tool registry
- an evaluation-only conversation store

For the anchored run, the runtime snapshot says:

- `database_id=adventureworks`
- `dialect=postgres`
- `schema_sync_mode=reuse_existing`
- `allow_write_sql=false`
- `max_tool_iterations=25`
- `agent_model=deepseek-v4-flash`
- `judge_model=deepseek-v4-flash`
- `pass_threshold=0.7`

When `schema_sync_mode=reuse_existing`, the runtime initializes schema memory
and skips a fresh schema sync. The log records:

`Evaluation schema memory initialized in reuse_existing mode; schema sync skipped.`

### Evaluation Session

`EvaluationRuntime.create_session()` creates one isolated session per test case.
That session wires together:

- `EvaluationConversationStore`
- `NoOpAgentMemory`
- `StaticUserResolver`
- `RequestContext`
- `Agent`

For `sql_126`, the runtime uses:

- `user.id=admin`
- `username=Xihong`
- `group_memberships=[admin, user]`
- `conversation_id=eval-sql_126`

This isolation is deliberate: each benchmark sample is evaluated independently.

## Execution Flow

```text
dataset -> validation -> run store -> runtime -> session -> agent trace
       -> sql_accuracy judge -> expected_outcome check -> checkpoint + report
```

### 1) Dataset and Run Store

`my-evaluation` loads the dataset, resolves or creates a `EvaluationRunStore`,
and stores a checkpoint under:

`eval_output/resume_points/<run_id>/checkpoint.json`

`EvaluationRunStore` keeps:

- `checkpoint.json`
- `results.jsonl`
- `run.log`

It also supports:

- `create_new()`
- `open_existing()`
- `find_latest()`
- `refresh_from_disk()`
- `hydrate_completed_ids()`
- `append_result()`
- `mark_status()`
- `load_results()`

The anchored checkpoint reports:

- `status=completed`
- `completed_count=50`
- `completed_test_case_ids` containing `sql_126`

### 2) Agent Execution

`EvaluationRunner.run_evaluation()` resolves all runtimes first, initializes
them, and then runs each pending test case.

For each case, `_run_single_test_case()`:

1. creates the session
2. calls `session.agent.send_message(...)`
3. collects streamed UI components
4. fetches the final conversation
5. extracts the agent trace
6. evaluates the trace with each evaluator
7. emits the canonical result through `result_callback`

`EvaluationRunner._extract_trace()` reconstructs:

- `tool_calls`
- `final_answer`
- `tool_count`
- `run_sql_call_count`
- `conversation_message_count`

For `sql_126`, the captured trace summary is:

- `tool_count=6`
- `run_sql_call_count=3`
- `conversation_message_count=14`
- `component_count=48`

The real tool path is:

- `schema_retrieve`
- `schema_retrieve`
- `schema_retrieve`
- `run_sql`
- `run_sql`
- `run_sql`

### 3) SQL Accuracy Judge

`SqlAccuracyEvaluator` is the LLM-as-judge layer.

It:

1. executes the ground-truth SQL
2. executes the agent SQL
3. normalizes row previews and result artifacts
4. builds `JudgeInput`
5. asks the judge LLM to score the result
6. converts judge issue tags into a final score

The judge scoring logic uses issue-tag penalties. The important tags include:

- `wrong_result_preview`
- `wrong_columns`
- `wrong_order_by`
- `formatting_only`
- `missing_sql`
- `execution_error`

For `sql_126`, the anchored result is:

- `agent_artifact.row_count=290`
- `agent_artifact.column_names=["businessentityid", "salariedflag"]`
- `ground_truth_artifact.row_count=290`
- `ground_truth_artifact.column_names=["businessentityid", "salariedflag"]`
- `judge_result.score=0.9`
- `judge_result.issue_tags=["wrong_order_by"]`

The judge reason says the agent sorted `SalariedFlag=true` rows ahead of
`SalariedFlag=false` rows, while the ground truth orders the false rows first.

### 4) Expected Outcome Check

`ExpectedOutcomeEvaluator` checks deterministic behavior contracts.

For `sql_126`, the expected outcome is:

- `tools_called=["schema_retrieve", "run_sql"]`
- `final_answer_contains=["BusinessEntityID", "SalariedFlag"]`
- `max_execution_time_ms=90000`

The evaluator uses an ordered subsequence check for tool names, so the actual
trace may contain extra calls between the required ones.

For `sql_126`, that check passes and returns:

- `score=1.0`
- `passed=true`

The real `final_answer` in the result explains the query in natural language and
includes the SQL block.

### 5) Report Generation

`EvaluationReport` aggregates all results and computes:

- pass rate
- average score
- average execution time
- evaluator-specific summaries
- issue-tag distribution
- classification breakdowns by difficulty, category, source, and language

`save_report_artifacts()` writes:

- `evaluation_report.json`
- `evaluation_report.csv`
- `evaluation_report.md`
- `evaluation_report.html`

For the anchored run, the report summary shows:

- `Test cases: 50`
- `Evaluators: sql_accuracy, expected_outcome`
- `Pass Rate: 62.00%`
- `Average Score: 0.67`
- `sql_accuracy` average score: `0.67`
- `expected_outcome` average score: `0.77`

## ASCII Diagram

```text
+====================================================================================================+
| 0) EvaluationDataset.from_yaml() + EvaluationDatasetValidator.default().validate()                |
|----------------------------------------------------------------------------------------------------|
| Input: `src/evals/datasets/expansion.yaml`                                                         |
| Logic:                                                                                             |
|   - load dataset metadata and 50 test cases                                                        |
|   - validate required fields, field types, allowed values, and duplicate IDs                       |
| Output: a validated `EvaluationDataset`                                                            |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 1) EvaluationRunStore.create_new() / open_existing() / find_latest()                              |
|----------------------------------------------------------------------------------------------------|
| Input: dataset hash, resume root, run id, evaluator names                                          |
| Logic:                                                                                             |
|   - create or restore `checkpoint.json`                                                            |
|   - keep `results.jsonl` and `run.log` under the run directory                                     |
| Real run:                                                                                          |
|   - `run_id=20260430_023016_f36173c6`                                                              |
|   - `status=completed`                                                                              |
|   - `completed_count=50`                                                                           |
| Output: resumable checkpoint state                                                                 |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 2) EvaluationRuntime.ensure_initialized() + create_session()                                      |
|----------------------------------------------------------------------------------------------------|
| Input: `database_id=adventureworks`, `schema_sync_mode=reuse_existing`                            |
| Logic:                                                                                             |
|   - initialize schema memory                                                                       |
|   - skip schema sync when reuse_existing is enabled                                                |
|   - build `EvaluationConversationStore`, `NoOpAgentMemory`, `StaticUserResolver`, `RequestContext` |
| Real run:                                                                                          |
|   - `conversation_id=eval-sql_126`                                                                 |
|   - `user.id=admin`, `username=Xihong`                                                             |
| Output: isolated evaluation session                                                                |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 3) EvaluationRunner._run_single_test_case() + Agent.send_message()                                |
|----------------------------------------------------------------------------------------------------|
| Input: benchmark query                                                                             |
| Real `sql_126` query:                                                                              |
|   "write a query in SQL to sort the BusinessEntityID in descending order ..."                      |
| Trace:                                                                                             |
|   schema_retrieve x3 -> run_sql x3                                                                 |
|   `tool_count=6`, `run_sql_call_count=3`, `conversation_message_count=14`                         |
| Output: final answer + conversation trace                                                         |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 4) SqlAccuracyEvaluator.evaluate()                                                                 |
|----------------------------------------------------------------------------------------------------|
| Input: `AgentResult` + ground truth SQL + judge LLM                                                |
| Logic:                                                                                             |
|   - execute both SQL statements                                                                    |
|   - collect result previews, row counts, and SQL features                                          |
|   - ask judge LLM for JSON scoring                                                                 |
| Real run:                                                                                          |
|   - `agent_artifact.row_count=290`                                                                 |
|   - `ground_truth_artifact.row_count=290`                                                          |
|   - `judge_result.score=0.9`                                                                       |
|   - `judge_result.issue_tags=["wrong_order_by"]`                                                   |
| Output: canonical `EvaluationResult`                                                               |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 5) ExpectedOutcomeEvaluator.evaluate()                                                             |
|----------------------------------------------------------------------------------------------------|
| Input: `expected_outcome` + `AgentResult`                                                          |
| Logic:                                                                                             |
|   - ordered subsequence check for tool names                                                       |
|   - final-answer fragment matching                                                                 |
|   - execution time threshold check                                                                 |
| Real run:                                                                                          |
|   - `tools_called=["schema_retrieve", "run_sql"]` passed                                          |
|   - `final_answer_contains=["BusinessEntityID", "SalariedFlag"]` passed                            |
| Output: behavior contract result                                                                   |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 6) EvaluationReport + save_report_artifacts()                                                      |
|----------------------------------------------------------------------------------------------------|
| Input: all `EvaluationResult` objects from the run                                                 |
| Logic:                                                                                             |
|   - aggregate pass rate, average score, evaluator summaries, and issue tags                        |
|   - write JSON / CSV / Markdown / HTML artifacts                                                   |
| Real run:                                                                                          |
|   - `Pass Rate=62.00%`                                                                             |
|   - `Average Score=0.67`                                                                           |
|   - `sql_accuracy=0.67`, `expected_outcome=0.77`                                                   |
| Output: reproducible report artifacts                                                               |
+====================================================================================================+
```

## How to Read the Results

There are two different notions of success:

- `sql_accuracy` checks semantic closeness to the ground truth result.
- `expected_outcome` checks whether the agent followed the expected tool path
  and answer shape.

That means a case can:

- pass `sql_accuracy` but fail `expected_outcome`
- pass `expected_outcome` but fail `sql_accuracy`
- pass both
- fail both

For `sql_126`:

- `sql_accuracy` passes with `score=0.9`
- `expected_outcome` passes with `score=1.0`
- the run itself is `completed`

For `sql_159`, the report shows a case where the agent SQL and ground truth
produce matching row counts and previews, but the alias text differs. That case
still passes `sql_accuracy` with `score=0.95`.

## Resume Behavior

The run store supports safe resume by checkpoint:

- `create_new()` creates a fresh run directory
- `open_existing()` reopens an exact run directory
- `find_latest()` finds the latest incomplete run for the same dataset hash
- `append_result()` writes each canonical result to `results.jsonl`
- `mark_status()` updates `checkpoint.json`

The anchored checkpoint confirms that the run completed all 50 test cases.

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
- [`src/evals/resume_points/20260430_023016_f36173c6/run.log`](../../../src/evals/resume_points/20260430_023016_f36173c6/run.log)
- [`src/evals/resume_points/20260430_023016_f36173c6/checkpoint.json`](../../../src/evals/resume_points/20260430_023016_f36173c6/checkpoint.json)
- [`src/evals/resume_points/20260430_023016_f36173c6/results.jsonl`](../../../src/evals/resume_points/20260430_023016_f36173c6/results.jsonl)
- [`src/evals/eval_results/20260430_023016_f36173c6_deepseek_v4_flash/evaluation_report.md`](../../../src/evals/eval_results/20260430_023016_f36173c6_deepseek_v4_flash/evaluation_report.md)
