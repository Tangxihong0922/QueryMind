# QueryMind Eval Retrospective

This page is the support-friendly summary of QueryMind's eval-driven
iteration. The longer historical narrative is kept in the top-level Chinese
retrospective page at [../../zh/querymind-eval-retro.md](../../zh/querymind-eval-retro.md).

The facts below are grounded in:

- `src/QueryMind/core/evaluation/runtime.py`
- `src/QueryMind/core/evaluation/runner.py`
- `src/QueryMind/core/evaluation/evaluators.py`
- `src/QueryMind/core/evaluation/outcome.py`
- `src/QueryMind/core/evaluation/report.py`
- `src/QueryMind/core/agent/governance.py`
- `src/QueryMind/core/agent/sql_governance.py`
- `src/QueryMind/core/agent/sql_governance_shape.py`
- `src/QueryMind/core/agent/sql_governance_prompt.py`
- `src/QueryMind/core/middleware/schema_governance.py`
- `src/QueryMind/core/middleware/sql_governance.py`
- `src/QueryMind/core/enhancer/schema_governance.py`
- `src/QueryMind/core/enricher/schema_retrieve.py`
- `src/evals/resume_points/20260430_023016_f36173c6/run.log`
- `src/evals/resume_points/20260430_023016_f36173c6/checkpoint.json`
- `src/evals/resume_points/20260430_023016_f36173c6/results.jsonl`
- `src/evals/eval_results/20260430_023016_f36173c6_deepseek_v4_flash/evaluation_report.md`

## At a Glance

```text
baseline 40%
  -> retrieval oscillation 25%~30%
  -> schema lock 65%
  -> SQL governance v1 75%
  -> AST freeze peak 85%
  -> expansion review 66%
  -> sql_126 trace: schema_retrieve x3 -> run_sql x3 -> judge 0.9
```

## What This Page Covers

- How Schema Governance turns `schema_retrieve` into a lockable state machine
- How SQL Governance turns `run_sql` into a profile-aware, freezeable, locally repairable shape flow
- How prompt layers, middleware, hooks, and enrichers write state back into the next turn
- What the evaluation artifacts show once those boundaries are in place

## Key Phases

| Phase | Representative run | Result | What changed |
|---|---|---|---|
| Baseline | `20260422_165317_a8c9d397` | `40%`, `8/20`, `mean 0.428` | The problem was not just SQL generation. The loop also lacked a hard handoff from retrieval to SQL drafting. |
| Retrieval oscillation | `20260423_170540_81ed9179` to `20260424_070510_18f3aceb` | `25% ~ 30%` | This was not a stable plateau. The loop first dropped to `15%/20%`, then bounced back to `25%/30%`. `schema_retrieve` could already write back into context, but it still had no lock / recap / tool-hiding closure. |
| Schema lock | `20260424_154827_e6452415` | `65%`, `13/20`, `mean 0.720` | `SchemaGovernanceManager` began tracking call counts, empty-result streaks, and no-new-table streaks, and the middleware hid `schema_retrieve` after lock. |
| SQL governance v1 | `20260425_064414_e2662cd2` | `75%`, `15/20`, `mean 0.750` | SQL drafting became profile-aware and row-grain-aware, with local repair instead of full rewrites. |
| AST freeze peak | `20260426_091552_9c7e063c` to `20260427_134912_b4d4841f` | `70% -> 85% peak` | `sqlglot` AST analysis made it possible to freeze a validated skeleton and only patch local drift. |
| Expansion review | `20260428_085122_0315d6e9_deepseek_v4_flash` | `66%`, `33/50`, `mean 0.680` | A harder benchmark surface brought back semantic, preview, and ordering errors. |

## Representative Trace

`sql_126` is a useful end-to-end sample because it shows discovery, SQL
drafting, and judge scoring in one trace.

### Input

- The user asks for an ordering query over `BusinessEntityID` and `SalariedFlag`
- The target table is `HumanResources.Employee`
- The final answer passes `expected_outcome`, but `sql_accuracy` still scores `0.9` because of ordering details

### Real Tool Path

```text
schema_retrieve(query="employees with SalariedFlag and BusinessEntityID", search_mode="hybrid")
schema_retrieve(query="HumanResources Employee table with SalariedFlag and BusinessEntityID", search_mode="vector")
schema_retrieve(query="employee table human resources", search_mode="hybrid")
run_sql(SELECT table_schema, table_name FROM information_schema.tables ...)
run_sql(SELECT column_name, data_type FROM information_schema.columns ...)
run_sql(SELECT businessentityid, salariedflag FROM humanresources.employee ORDER BY ...)
```

### Real Outcome

- `tool_count=6`
- `run_sql_call_count=3`
- `conversation_message_count=14`
- `component_count=48`
- `agent_artifact.row_count=290`
- `agent_artifact.column_names=["businessentityid", "salariedflag"]`
- `judge_result.score=0.9`
- `judge_result.issue_tags=["wrong_order_by"]`
- `expected_outcome.score=1.0`

### What This Trace Shows

- `schema_retrieve` is no longer open-ended exploration; governance narrows it down turn by turn
- `run_sql` can do metadata validation before the final query
- The final success criteria are split between semantic accuracy and behavioral contract checks

## Oscillation Period

Before schema lock, QueryMind went through a visible retrieval oscillation:

- `20260423_170540_81ed9179`: `sql_accuracy=15%`
- `20260423_181441_b4191489`: `sql_accuracy=20%`
- `20260424_040936_4cb5c240`: `sql_accuracy=20%`
- `20260424_052745_55472bdc`: `sql_accuracy=30%`
- `20260424_070510_18f3aceb`: `sql_accuracy=25%`

During that period, `schema_retrieve` could already persist state into the next turn, but it still wasn't a true closure mechanism:

- some samples stopped at metadata exploration
- some kept expanding the search space
- some moved into `run_sql` too early

The real turning point was when `SchemaGovernanceManager` made "keep searching" a governed state with thresholds, lock conditions, and tool hiding.

## Practical Takeaways

- Schema lock answers "when do we stop searching"
- SQL governance answers "what shape should the SQL keep"
- Prompt chaining answers "where does state live between turns"
- AST freeze answers "what can be repaired without damaging the skeleton"

Together, those boundaries form the QueryMind eval-driven loop.

## Source Files

- [`src/QueryMind/core/evaluation/runtime.py`](../../../src/QueryMind/core/evaluation/runtime.py)
- [`src/QueryMind/core/evaluation/runner.py`](../../../src/QueryMind/core/evaluation/runner.py)
- [`src/QueryMind/core/evaluation/evaluators.py`](../../../src/QueryMind/core/evaluation/evaluators.py)
- [`src/QueryMind/core/evaluation/outcome.py`](../../../src/QueryMind/core/evaluation/outcome.py)
- [`src/QueryMind/core/evaluation/report.py`](../../../src/QueryMind/core/evaluation/report.py)
- [`src/QueryMind/core/agent/governance.py`](../../../src/QueryMind/core/agent/governance.py)
- [`src/QueryMind/core/agent/sql_governance.py`](../../../src/QueryMind/core/agent/sql_governance.py)
- [`src/QueryMind/core/agent/sql_governance_shape.py`](../../../src/QueryMind/core/agent/sql_governance_shape.py)
- [`src/QueryMind/core/agent/sql_governance_prompt.py`](../../../src/QueryMind/core/agent/sql_governance_prompt.py)
- [`src/QueryMind/core/middleware/schema_governance.py`](../../../src/QueryMind/core/middleware/schema_governance.py)
- [`src/QueryMind/core/middleware/sql_governance.py`](../../../src/QueryMind/core/middleware/sql_governance.py)
- [`src/QueryMind/core/enhancer/schema_governance.py`](../../../src/QueryMind/core/enhancer/schema_governance.py)
- [`src/QueryMind/core/enricher/schema_retrieve.py`](../../../src/QueryMind/core/enricher/schema_retrieve.py)
- [`src/evals/resume_points/20260430_023016_f36173c6/run.log`](../../../src/evals/resume_points/20260430_023016_f36173c6/run.log)
- [`src/evals/resume_points/20260430_023016_f36173c6/checkpoint.json`](../../../src/evals/resume_points/20260430_023016_f36173c6/checkpoint.json)
- [`src/evals/resume_points/20260430_023016_f36173c6/results.jsonl`](../../../src/evals/resume_points/20260430_023016_f36173c6/results.jsonl)
- [`src/evals/eval_results/20260430_023016_f36173c6_deepseek_v4_flash/evaluation_report.md`](../../../src/evals/eval_results/20260430_023016_f36173c6_deepseek_v4_flash/evaluation_report.md)

## Related Reading

- [`evaluation.md`](./evaluation.md)
