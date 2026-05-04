# QueryMind Eval 复盘

本页是 support 版的简明复盘，重点记录 QueryMind 在 eval-driven
迭代里做对了什么、还剩下什么边界。更长的历史叙述仍保留在
[顶层中文复盘](../querymind-eval-retro.md)。

以下事实源来自：

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

## 一眼看懂

```text
baseline 40%
  -> retrieval oscillation 25%~30%
  -> schema lock 65%
  -> SQL governance v1 75%
  -> AST freeze peak 85%
  -> expansion review 72%
  -> sql_126 trace: schema_retrieve x3 -> run_sql x3 -> judge 0.9
```

## 这份复盘看什么

- Schema Governance 如何把 `schema_retrieve` 从自由探索收口成可锁定的状态机
- SQL Governance 如何把 `run_sql` 从自由生成收口成可分析、可冻结、可局部修补的形状流程
- Prompt / middleware / hook / enricher 如何把状态分层写回下一轮
- 评测结果如何把这些变化暴露成可复核的 run、report 和 trace

## 关键阶段

| 阶段 | 代表 run | 结果 | 说明 |
|---|---|---|---|
| Baseline | `20260422_165317_a8c9d397` | `40%`, `8/20`, `mean 0.428` | 问题不只是不会写 SQL，而是检索后缺少强制转 SQL 的收口。 |
| 检索链震荡 | `20260423_170540_81ed9179` 到 `20260424_070510_18f3aceb` | `25% ~ 30%` | 这不是稳定的平台期，而是先跌到 `15%/20%`，再回到 `25%/30%` 的震荡窗口。`schema_retrieve` 已经能回写上下文，但还没有 lock / recap / tool hiding 的闭环。 |
| Schema lock | `20260424_154827_e6452415` | `65%`, `13/20`, `mean 0.720` | `SchemaGovernanceManager` 开始记录 calls、empty streak 和 no-new streak，middleware 在锁定后隐藏 `schema_retrieve`。 |
| SQL governance v1 | `20260425_064414_e2662cd2` | `75%`, `15/20`, `mean 0.750` | SQL 开始按 profile、row grain 和 anchor 起草，并允许 turn-local repair。 |
| AST freeze peak | `20260426_091552_9c7e063c` 到 `20260427_134912_b4d4841f` | `70% -> 85% peak` | `sqlglot` AST 化之后，validated skeleton 可以被冻结，只允许局部修补。 |
| Expansion review | `20260428_085122_0315d6e9_deepseek_v4_flash` | `66%`, `33/50`, `mean 0.680` | 更难的数据集把语义、结果预览和排序问题重新暴露出来。 |

## 代表性轨迹

`sql_126` 是一条很典型的收尾样本，能同时看到 schema discovery、
SQL 起草和最终判分。

### 输入

- 用户问题是一个排序题，要求返回 `BusinessEntityID` 和 `SalariedFlag`
- 目标表是 `HumanResources.Employee`
- 最终回答虽然通过了 expected_outcome，但 `sql_accuracy` 仍然因为排序细节拿到 `0.9`

### 真实 tool path

```text
schema_retrieve(query="employees with SalariedFlag and BusinessEntityID", search_mode="hybrid")
schema_retrieve(query="HumanResources Employee table with SalariedFlag and BusinessEntityID", search_mode="vector")
schema_retrieve(query="employee table human resources", search_mode="hybrid")
run_sql(SELECT table_schema, table_name FROM information_schema.tables ...)
run_sql(SELECT column_name, data_type FROM information_schema.columns ...)
run_sql(SELECT businessentityid, salariedflag FROM humanresources.employee ORDER BY ...)
```

### 真实结果

- `tool_count=6`
- `run_sql_call_count=3`
- `conversation_message_count=14`
- `component_count=48`
- `agent_artifact.row_count=290`
- `agent_artifact.column_names=["businessentityid", "salariedflag"]`
- `judge_result.score=0.9`
- `judge_result.issue_tags=["wrong_order_by"]`
- `expected_outcome.score=1.0`

### 这条轨迹说明什么

- `schema_retrieve` 已经不再是无限探索，而是会在治理状态下逐步收口
- `run_sql` 允许先做 metadata 验证，再做最终查询
- 结果是否正确，最后还是要落到 `sql_accuracy` 和 `expected_outcome` 两条判定线上

## 震荡期补充

在 schema lock 之前，QueryMind 先经历了一段明显的检索链震荡：

- `20260423_170540_81ed9179`：`sql_accuracy=15%`
- `20260423_181441_b4191489`：`sql_accuracy=20%`
- `20260424_040936_4cb5c240`：`sql_accuracy=20%`
- `20260424_052745_55472bdc`：`sql_accuracy=30%`
- `20260424_070510_18f3aceb`：`sql_accuracy=25%`

这段时间里，`schema_retrieve` 已经能把上一轮结果写回下一轮，但它还只是“能回写”，不是“能收口”：

- 有些样本会停在 metadata 探索
- 有些样本会继续发散检索
- 还有一些样本会过早进入 `run_sql`

真正的分水岭不是分数本身，而是 `SchemaGovernanceManager` 把“继续找”这件事变成了有阈值、可锁定、可隐藏工具的状态机。

## 实际结论

- Schema lock 解决的是“什么时候必须停”
- SQL governance 解决的是“写什么形状”
- Prompt chain 解决的是“把状态放在哪里”
- AST freeze 解决的是“可以修补，但不能把骨架修坏”

这几条线叠在一起，才形成 QueryMind 的 eval-driven loop。

## 源码文件

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

## 相关页面

- [`evaluation.md`](./evaluation.md)
- [`querymind.md`](../querymind.md)
