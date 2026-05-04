# 评测运行用例

本页只讲一条真实评测运行：`run_id=20260430_023016_f36173c6` 中的 `sql_126`
样本。它展示一条评测样本如何从 dataset 进入 runtime，经过
`Agent.send_message()` 产生 trace，再被 `SqlAccuracyEvaluator` 和
`ExpectedOutcomeEvaluator` 评测，最后写入 `EvaluationRunStore` 和 report。

## 场景

用户不是在交互式 QueryMind 会话里提问，而是在评测框架里跑一条标准样本。
这次运行使用 `src/evals/datasets/expansion.yaml`，总计 50 条测试样本。
`sql_126` 是其中一个样本：它要求为 `BusinessEntityID` 和 `SalariedFlag`
生成排序查询。

## 发生了什么

1. `EvaluationDataset.from_yaml()` 读取 dataset，
   `EvaluationDatasetValidator.default().validate()` 校验结构。
2. `EvaluationRunStore.create_new()` / `open_existing()` 维护 `checkpoint.json`；
   本次 run 最终 `status=completed`，`completed_count=50`。
3. `EvaluationRuntimeResolver.resolve()` 按 `database_id=adventureworks` 选出 runtime。
4. `EvaluationRuntime.ensure_initialized()` 因 `schema_sync_mode=reuse_existing`
   跳过 schema sync，只初始化已有 schema memory。
5. `EvaluationRuntime.create_session()` 组装 `EvaluationConversationStore`、
   `NoOpAgentMemory`、`StaticUserResolver`、`RequestContext` 和 `Agent`。
6. `EvaluationRunner._run_single_test_case()` 调用 `session.agent.send_message()`，
   把 `sql_126` 的自然语言问题送进 Agent。
7. `EvaluationRunner._extract_trace()` 从 `conversation.messages` 还原
   `tool_calls`、`final_answer` 和 trace summary。
8. `SqlAccuracyEvaluator.evaluate()` 用 `ground_truth_sql` 和 agent SQL
   分别执行 `_execute_sql()`，再把 `JudgeInput` 交给 LLM judge。
9. `ExpectedOutcomeEvaluator.evaluate()` 检查工具顺序和最终答案片段是否满足
   `expected_outcome`。
10. `EvaluationRunStore.append_result()` 和 `save_report_artifacts()` 把结果落盘为
    `results.jsonl`、`checkpoint.json` 和 `evaluation_report.*`。

## ASCII 框图

下面这张图把一次真实评测运行串成闭环。事实源来自
`src/QueryMind/core/evaluation/base.py`、`dataset.py`、`validation.py`、
`runtime.py`、`runner.py`、`evaluators.py`、`outcome.py`、`report.py`、
`my_evaluation.py`、`src/evals/resume_store.py`、`src/evals/reporting.py`、
`run.log` 和 `results.jsonl`。

```text
+====================================================================================================+
| 0) EvaluationDataset.from_yaml() + EvaluationDatasetValidator.default().validate()                |
|----------------------------------------------------------------------------------------------------|
| 输入：dataset_path = src/evals/datasets/expansion.yaml                                             |
| 逻辑：                                                                                             |
|   - 读取 `QueryMind SQL Eval - Expansion 50`                                                       |
|   - 校验 `test_cases` 结构、必填字段和重复 id                                                      |
|   - 保留 `sql_126` 这类带 `expected_outcome` 的样本                                                 |
| 输出：50 个 test case，dataset 通过校验                                                             |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 1) EvaluationRunStore / checkpoint.json                                                            |
|----------------------------------------------------------------------------------------------------|
| 输入：run_id、dataset_hash、dataset_name、config_snapshot                                          |
| 真实值：                                                                                            |
|   run_id=20260430_023016_f36173c6                                                                  |
|   status=running -> completed                                                                      |
|   completed_count=50 / 50                                                                          |
|   checkpoint_path=src/evals/resume_points/20260430_023016_f36173c6/checkpoint.json                |
| 说明：`open_existing()` / `find_latest()` 可以从 checkpoint 恢复                                     |
| 输出：可恢复的评测进度快照                                                                         |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 2) EvaluationRuntimeResolver.resolve() + EvaluationRuntime.ensure_initialized()                    |
|----------------------------------------------------------------------------------------------------|
| 输入：test_case.database_id = adventureworks                                                       |
| 逻辑：                                                                                             |
|   - 按 database_id 选择 runtime                                                                     |
|   - 初始化 schema memory                                                                           |
|   - `schema_sync_mode=reuse_existing` 时跳过 schema sync                                          |
| run.log 事实：                                                                                      |
|   "Evaluation schema memory initialized in reuse_existing mode; schema sync skipped."             |
| 配置快照：                                                                                         |
|   allow_write_sql=false, max_tool_iterations=25                                                     |
| 输出：runtime ready，且与评测数据库绑定                                                             |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 3) EvaluationRuntime.create_session()                                                              |
|----------------------------------------------------------------------------------------------------|
| 输入：test_case + runtime                                                                           |
| 逻辑：                                                                                             |
|   - build `EvaluationConversationStore`                                                             |
|   - use `NoOpAgentMemory`                                                                           |
|   - resolve user with `StaticUserResolver`                                                          |
|   - create `RequestContext` and `Agent`                                                             |
| 真实值：                                                                                            |
|   user.id=admin / username=Xihong / groups=[admin, user]                                           |
|   conversation_id=eval-sql_126                                                                      |
|   request_context.metadata includes evaluation=true / database_id=adventureworks / dialect=postgres |
| 输出：一个与外部状态隔离的 evaluation session                                                         |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 4) EvaluationRunner._run_single_test_case() + Agent.send_message()                                 |
|----------------------------------------------------------------------------------------------------|
| 输入：test_case.query                                                                               |
| 真实 query：                                                                                        |
|   "write a query in SQL to sort the BusinessEntityID in descending order ... Return BusinessEntityID, and SalariedFlag." |
| Agent 轨迹（sql_126）：                                                                             |
|   schema_retrieve x3                                                                                |
|     #1 query="employees with SalariedFlag and BusinessEntityID" search_mode="hybrid"              |
|     #2 query="HumanResources Employee table with SalariedFlag and BusinessEntityID" search_mode="vector" |
|     #3 query="employee table human resources" search_mode="hybrid"                                 |
|   run_sql x3                                                                                       |
|     #4 SELECT table_schema, table_name FROM information_schema.tables                               |
|        WHERE table_schema = 'humanresources' ORDER BY table_name;                                  |
|     #5 SELECT column_name, data_type FROM information_schema.columns                                |
|        WHERE table_schema = 'humanresources' AND table_name = 'employee'                            |
|        ORDER BY ordinal_position;                                                                   |
|     #6 SELECT businessentityid, salariedflag FROM humanresources.employee                          |
|        ORDER BY CASE WHEN salariedflag = true THEN 0 ELSE 1 END,                                   |
|                 CASE WHEN salariedflag = true THEN businessentityid END DESC,                     |
|                 CASE WHEN salariedflag = false THEN businessentityid END ASC;                     |
| 输出：tool_count=6，模型进入最终回答                                                                 |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 5) EvaluationRunner._extract_trace()                                                               |
|----------------------------------------------------------------------------------------------------|
| 输入：conversation.messages                                                                        |
| 逻辑：                                                                                             |
|   - 把 assistant/tool 消息重建成 `tool_calls`                                                       |
|   - 把最后一条纯文本 assistant 消息当作 `final_answer`                                               |
| trace summary：                                                                                    |
|   tool_count=6                                                                                     |
|   run_sql_call_count=3                                                                              |
|   conversation_message_count=14                                                                     |
|   component_count=48                                                                                |
| 输出：AgentResult(final_answer + tool_calls + metadata)                                            |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 6) SqlAccuracyEvaluator.evaluate()                                                                 |
|----------------------------------------------------------------------------------------------------|
| 输入：AgentResult + test_case + judge_llm                                                          |
| 逻辑：                                                                                             |
|   - 用 `_execute_sql()` 分别执行 `ground_truth_sql` 和 agent SQL                                   |
|   - `allow_write_sql=false`，所以非只读 SQL 会被拦截                                                |
|   - 组装 `JudgeInput`，再交给 judge LLM                                                            |
| 真实结果：                                                                                         |
|   - agent_artifact.success=true                                                                    |
|   - agent_artifact.row_count=290                                                                    |
|   - agent_artifact.column_names=["businessentityid", "salariedflag"]                               |
|   - agent_artifact.preview_rows=[{businessentityid:290, salariedflag:true}, ...]                  |
|   - ground_truth_artifact.row_count=290                                                             |
|   - ground_truth_artifact.preview_rows=[{businessentityid:4, salariedflag:false}, ...]             |
| judge 结果：                                                                                        |
|   score=0.9                                                                                         |
|   issue_tags=["wrong_order_by"]                                                                     |
|   passed=true because score >= pass_threshold=0.7                                                  |
| 输出：EvaluationResult 作为 canonical SQL 评测结果                                                 |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 7) ExpectedOutcomeEvaluator.evaluate()                                                             |
|----------------------------------------------------------------------------------------------------|
| 输入：test_case.expected_outcome + AgentResult                                                      |
| 逻辑：                                                                                             |
|   - `tools_called=["schema_retrieve","run_sql"]` 按有序子序列匹配                                   |
|   - `final_answer_contains=["BusinessEntityID","SalariedFlag"]` 检查最终答案片段                   |
| 真实结果：                                                                                         |
|   score=1.0                                                                                         |
|   passed=true                                                                                       |
| 输出：行为契约通过，说明这条样本的工具路径和回答形式都满足预期                                       |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 8) EvaluationRunStore.append_result() + save_report_artifacts()                                    |
|----------------------------------------------------------------------------------------------------|
| 输入：canonical EvaluationResult                                                                   |
| 逻辑：                                                                                             |
|   - 追加写入 `results.jsonl`                                                                       |
|   - 更新 `checkpoint.json`                                                                         |
|   - `save_report_artifacts()` 生成 `evaluation_report.json/csv/md/html`                           |
| run 结果：                                                                                         |
|   results.jsonl 行数 = 50                                                                           |
|   checkpoint.status = completed                                                                    |
|   checkpoint.completed_count = 50                                                                  |
| 统计摘要：                                                                                         |
|   sql_accuracy: 31 / 50 pass, average score = 0.672                                                |
|   expected_outcome: 18 / 50 pass                                                                   |
| 输出：一个可恢复、可追踪、可复盘的评测运行                                                            |
+====================================================================================================+
```

## 结果摘要

- `sql_126` 的 `sql_accuracy` 通过，`score=0.9`，`issue_tags=["wrong_order_by"]`。
- `sql_126` 的 `expected_outcome` 也通过，`score=1.0`。
- 这次 run 一共 50 条样本，`checkpoint.completed_count=50`，`status=completed`。
- `results.jsonl` 一共有 50 行；canonical `sql_accuracy` 通过 31 条，平均分 `0.672`。
- `expected_outcome` 通过 18 条，说明很多样本在“行为契约”层面比 SQL 语义层面更严格。
- `sql_126` 的 agent 和 ground truth 都返回 290 行、相同列名，但排序顺序不同，
  所以 `wrong_order_by` 会出现在判分结果里。

## 为什么重要

评测运行不是一个单一的“打分器”，而是一条完整的数据链路：

- dataset 先被校验，避免坏样本进入运行时；
- runtime 先完成会话、用户和数据库上下文装配；
- agent trace 记录了实际工具调用，而不是只看最终 SQL；
- `sql_accuracy` 和 `expected_outcome` 把“SQL 正确性”和“行为契约”分开；
- `EvaluationRunStore` 让长评测可以恢复、追加和复盘；
- report 不是手工拼出来的，而是从结构化结果里派生出来的。

## 源码文件

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
