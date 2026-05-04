# 评测

本页说明 QueryMind 的评测框架：如何加载数据集、如何组装 runtime、
如何采集 agent trace、如何用 `sql_accuracy` 和 `expected_outcome` 评分、
如何恢复中断的运行，以及如何生成报告。

以下事实源来自：

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
- 真实的 `run.log`、`checkpoint.json`、`results.jsonl` 和
  `evaluation_report.md`，来自 `run_id=20260430_023016_f36173c6`

## 评测的目标

评测主要回答三个问题：

1. QueryMind 能不能端到端解决这道 benchmark 题？
2. agent 是否遵循了预期的 tool path？
3. 最终 SQL 的结果形状和内容是否正确？

当前 harness 主要面向 SQL 评测，重点覆盖：

- 数据集校验
- 独立 agent session
- schema 检索和 SQL 工具使用
- LLM-as-judge 的 SQL 评分
- 确定性的 expected-outcome 检查
- 带 checkpoint 的恢复和报告生成

这套链路关注的是：

- Agent 是否能通过多步推理找到正确 schema
- Schema Memory 驱动的增强检索，是否真的提升 SQL 生成质量
- 结果是否满足预先定义的行为契约，例如工具路径、最终回答内容和运行时长

它并不主要衡量跨样本的 Agent Memory 复用。每个 test case 都在独立
session 中运行，且默认使用 `NoOpAgentMemory`，因此样本之间不会因为共享 Agent Memory 而互相污染。

## 快速开始

常见执行入口：

```bash
my-evaluation \
  --dataset-path src/evals/datasets/expansion.yaml \
  --resume-root eval_output/resume_points \
  --report-output-dir eval_output
```

恢复最近一次未完成的运行：

```bash
my-evaluation --resume-latest
```

从已有运行生成报告：

```bash
python evals/generate_report.py --latest --resume-root evals/resume_points
```

常用环境变量：

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

本页使用的真实锚点运行是：

- `run_id=20260430_023016_f36173c6`
- `dataset_name=QueryMind SQL Eval - Expansion 50`
- `total_test_cases=50`
- `status=completed`
- `completed_count=50`
- 配置的 evaluator 是 `sql_accuracy` 和 `expected_outcome`

## 运行结构

### 数据集加载

`EvaluationDataset.from_yaml()` 和 `EvaluationDataset.from_json()` 负责加载
数据集，然后由 `EvaluationDatasetValidator.default().validate()` 做结构校验。

校验规则包括：

- `dataset.test_cases` 必须存在且非空
- 每条 test case 都必须满足规范中的必填字段
- 字段类型必须正确
- 重复的 test case id 会被拒绝

数据集对象保存：

- 数据集名称和描述
- `SqlTestCase` 列表
- 用于分组和报告的可选 metadata

每个 `SqlTestCase` 都包含：

- `id`
- `database_id`
- `dialect`
- `query`
- `ground_truth_sql`
- 可选的用户身份字段
- 可选的 `expected_outcome`

### Runtime 组装

`EvaluationRuntime` 会把这些部分绑在一起：

- SQL runner
- schema memory
- agent LLM service
- 可选的 schema sync
- 确定性的 tool registry
- 评测专用的 conversation store

对本页锚定的运行来说，runtime 快照是：

- `database_id=adventureworks`
- `dialect=postgres`
- `schema_sync_mode=reuse_existing`
- `allow_write_sql=false`
- `max_tool_iterations=25`
- `agent_model=deepseek-v4-flash`
- `judge_model=deepseek-v4-flash`
- `pass_threshold=0.7`

当 `schema_sync_mode=reuse_existing` 时，runtime 只初始化 schema memory，
不再做新的 schema sync。日志明确记录了：

`Evaluation schema memory initialized in reuse_existing mode; schema sync skipped.`

### Evaluation Session

`EvaluationRuntime.create_session()` 会为每个 test case 建一个独立 session。
这个 session 由以下部分组成：

- `EvaluationConversationStore`
- `NoOpAgentMemory`
- `StaticUserResolver`
- `RequestContext`
- `Agent`

对 `sql_126` 来说，runtime 使用：

- `user.id=admin`
- `username=Xihong`
- `group_memberships=[admin, user]`
- `conversation_id=eval-sql_126`

这种隔离是刻意设计的：每个 benchmark 样本都独立评测。

## 执行流程

```text
dataset -> validation -> run store -> runtime -> session -> agent trace
       -> sql_accuracy judge -> expected_outcome check -> checkpoint + report
```

### 1) 数据集与运行存储

`my-evaluation` 会先加载数据集，然后解析或创建 `EvaluationRunStore`，
checkpoint 会写到：

`src/evals/resume_points/<run_id>/checkpoint.json`

`EvaluationRunStore` 会管理：

- `checkpoint.json`
- `results.jsonl`
- `run.log`

同时支持：

- `create_new()`
- `open_existing()`
- `find_latest()`
- `refresh_from_disk()`
- `hydrate_completed_ids()`
- `append_result()`
- `mark_status()`
- `load_results()`

锚点 checkpoint 显示：

- `status=completed`
- `completed_count=50`
- `completed_test_case_ids` 中包含 `sql_126`

### 2) Agent 执行

`EvaluationRunner.run_evaluation()` 会先解析所有 runtime、初始化它们，
然后再运行每个未完成的 test case。

对于每个样本，`_run_single_test_case()` 会：

1. 创建 session
2. 调用 `session.agent.send_message(...)`
3. 收集流式 UI component
4. 取回最终 conversation
5. 提取 agent trace
6. 用每个 evaluator 评估 trace
7. 通过 `result_callback` 输出 canonical result

`EvaluationRunner._extract_trace()` 会重建：

- `tool_calls`
- `final_answer`
- `tool_count`
- `run_sql_call_count`
- `conversation_message_count`

对于 `sql_126`，真实 trace 摘要是：

- `tool_count=6`
- `run_sql_call_count=3`
- `conversation_message_count=14`
- `component_count=48`

真实 tool path 是：

- `schema_retrieve`
- `schema_retrieve`
- `schema_retrieve`
- `run_sql`
- `run_sql`
- `run_sql`

### 3) SQL Accuracy Judge

`SqlAccuracyEvaluator` 是 LLM-as-judge 层。

它会：

1. 执行 ground-truth SQL
2. 执行 agent SQL
3. 规范化结果预览和执行产物
4. 组装 `JudgeInput`
5. 请求 judge LLM 评分
6. 根据 issue tag 转成最终分数

评分逻辑使用 issue-tag penalty。常见 tag 包括：

- `wrong_result_preview`
- `wrong_columns`
- `wrong_order_by`
- `formatting_only`
- `missing_sql`
- `execution_error`

对 `sql_126` 来说，锚定结果是：

- `agent_artifact.row_count=290`
- `agent_artifact.column_names=["businessentityid", "salariedflag"]`
- `ground_truth_artifact.row_count=290`
- `ground_truth_artifact.column_names=["businessentityid", "salariedflag"]`
- `judge_result.score=0.9`
- `judge_result.issue_tags=["wrong_order_by"]`

judge 的理由说明：agent 把 `SalariedFlag=true` 的行排在前面，而
ground truth 是先排 `SalariedFlag=false`，再排 `SalariedFlag=true`。

### 4) Expected Outcome 检查

`ExpectedOutcomeEvaluator` 用来检查确定性的行为契约。

对 `sql_126`，expected_outcome 是：

- `tools_called=["schema_retrieve", "run_sql"]`
- `final_answer_contains=["BusinessEntityID", "SalariedFlag"]`
- `max_execution_time_ms=90000`

这个 evaluator 对 tool 名称做的是“有序子序列”检查，所以实际 trace
里可以在这两个必需调用之间出现额外调用。

对 `sql_126`，这个检查通过，结果是：

- `score=1.0`
- `passed=true`

真实的 `final_answer` 会用自然语言解释查询，并包含 SQL block。

### 5) 报告生成

`EvaluationReport` 会聚合所有结果，并计算：

- pass rate
- average score
- average execution time
- evaluator-specific summary
- issue-tag distribution
- 按 difficulty / category / source / language 的分组统计

`save_report_artifacts()` 会写出：

- `evaluation_report.json`
- `evaluation_report.csv`
- `evaluation_report.md`
- `evaluation_report.html`

锚点运行的报告摘要显示：

- `Test cases: 50`
- `Evaluators: sql_accuracy, expected_outcome`
- `Pass Rate: 62.00%`
- `Average Score: 0.67`
- `sql_accuracy` 平均分：`0.67`
- `expected_outcome` 平均分：`0.77`

## ASCII 框图

```text
+====================================================================================================+
| 0) EvaluationDataset.from_yaml() + EvaluationDatasetValidator.default().validate()                |
|----------------------------------------------------------------------------------------------------|
| 输入：`src/evals/datasets/expansion.yaml`                                                          |
| 逻辑：                                                                                             |
|   - 读取数据集元信息和 50 条 test case                                                             |
|   - 校验必填字段、字段类型、允许值和重复 id                                                        |
| 输出：一个已校验通过的 `EvaluationDataset`                                                         |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 1) EvaluationRunStore.create_new() / open_existing() / find_latest()                              |
|----------------------------------------------------------------------------------------------------|
| 输入：dataset hash、resume root、run id、evaluator names                                           |
| 逻辑：                                                                                             |
|   - 创建或恢复 `checkpoint.json`                                                                   |
|   - 将 `results.jsonl` 和 `run.log` 保存在运行目录下                                              |
| 真实运行：                                                                                         |
|   - `run_id=20260430_023016_f36173c6`                                                              |
|   - `status=completed`                                                                              |
|   - `completed_count=50`                                                                           |
| 输出：可恢复的 checkpoint 状态                                                                     |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 2) EvaluationRuntime.ensure_initialized() + create_session()                                      |
|----------------------------------------------------------------------------------------------------|
| 输入：`database_id=adventureworks`、`schema_sync_mode=reuse_existing`                              |
| 逻辑：                                                                                             |
|   - 初始化 schema memory                                                                           |
|   - 在 reuse_existing 模式下跳过 schema sync                                                      |
|   - 构造 `EvaluationConversationStore`、`NoOpAgentMemory`、`StaticUserResolver`、`RequestContext` |
| 真实运行：                                                                                         |
|   - `conversation_id=eval-sql_126`                                                                 |
|   - `user.id=admin`、`username=Xihong`                                                             |
| 输出：一个独立的 evaluation session                                                                |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 3) EvaluationRunner._run_single_test_case() + Agent.send_message()                                |
|----------------------------------------------------------------------------------------------------|
| 输入：benchmark query                                                                               |
| 真实 `sql_126` query：                                                                             |
|   "write a query in SQL to sort the BusinessEntityID in descending order ..."                      |
| 轨迹：                                                                                             |
|   schema_retrieve x3 -> run_sql x3                                                                 |
|   `tool_count=6`、`run_sql_call_count=3`、`conversation_message_count=14`                         |
| 输出：最终回答 + conversation trace                                                                |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 4) SqlAccuracyEvaluator.evaluate()                                                                 |
|----------------------------------------------------------------------------------------------------|
| 输入：`AgentResult` + ground truth SQL + judge LLM                                                 |
| 逻辑：                                                                                             |
|   - 执行两条 SQL                                                                                   |
|   - 收集结果预览、行数和 SQL features                                                              |
|   - 请求 judge LLM 输出 JSON 评分                                                                  |
| 真实运行：                                                                                         |
|   - `agent_artifact.row_count=290`                                                                 |
|   - `ground_truth_artifact.row_count=290`                                                          |
|   - `judge_result.score=0.9`                                                                       |
|   - `judge_result.issue_tags=["wrong_order_by"]`                                                   |
| 输出：canonical `EvaluationResult`                                                                 |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 5) ExpectedOutcomeEvaluator.evaluate()                                                             |
|----------------------------------------------------------------------------------------------------|
| 输入：`expected_outcome` + `AgentResult`                                                           |
| 逻辑：                                                                                             |
|   - 对 tool 名称做有序子序列检查                                                                  |
|   - 对最终回答做 fragment 匹配                                                                    |
|   - 校验执行时间阈值                                                                              |
| 真实运行：                                                                                         |
|   - `tools_called=["schema_retrieve", "run_sql"]` 通过                                           |
|   - `final_answer_contains=["BusinessEntityID", "SalariedFlag"]` 通过                             |
| 输出：行为契约评估结果                                                                             |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 6) EvaluationReport + save_report_artifacts()                                                      |
|----------------------------------------------------------------------------------------------------|
| 输入：本次运行的所有 `EvaluationResult`                                                            |
| 逻辑：                                                                                             |
|   - 聚合 pass rate、平均分、evaluator summary 和 issue tag                                        |
|   - 写出 JSON / CSV / Markdown / HTML 产物                                                        |
| 真实运行：                                                                                         |
|   - `Pass Rate=62.00%`                                                                             |
|   - `Average Score=0.67`                                                                           |
|   - `sql_accuracy=0.67`、`expected_outcome=0.77`                                                   |
| 输出：可复现的报告产物                                                                              |
+====================================================================================================+
```

## 如何阅读结果

这里有两个不同的“通过”概念：

- `sql_accuracy` 判断是否接近 ground truth 的语义结果。
- `expected_outcome` 判断是否遵循了预期的 tool path 和回答形状。

这意味着一个样本可以：

- 通过 `sql_accuracy`，但不通过 `expected_outcome`
- 通过 `expected_outcome`，但不通过 `sql_accuracy`
- 两者都通过
- 两者都失败

对 `sql_126` 而言：

- `sql_accuracy` 通过，`score=0.9`
- `expected_outcome` 通过，`score=1.0`
- 整个 run 也处于 `completed`

对 `sql_159` 而言，报告中可以看到：agent SQL 和 ground truth 的结果
行数与预览一致，但别名文本不同；这类样本仍可能通过 `sql_accuracy`
并得到 `score=0.95`。

## 恢复机制

run store 支持按 checkpoint 恢复：

- `create_new()` 创建新的运行目录
- `open_existing()` 打开指定 run 目录
- `find_latest()` 找到同一数据集 hash 下最新的未完成运行
- `append_result()` 把每条 canonical result 写入 `results.jsonl`
- `mark_status()` 更新 `checkpoint.json`

锚点 checkpoint 证明这次运行完成了全部 50 条样本。

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
- [`src/evals/resume_points/20260430_023016_f36173c6/run.log`](../../../src/evals/resume_points/20260430_023016_f36173c6/run.log)
- [`src/evals/resume_points/20260430_023016_f36173c6/checkpoint.json`](../../../src/evals/resume_points/20260430_023016_f36173c6/checkpoint.json)
- [`src/evals/resume_points/20260430_023016_f36173c6/results.jsonl`](../../../src/evals/resume_points/20260430_023016_f36173c6/results.jsonl)
- [`src/evals/eval_results/20260430_023016_f36173c6_deepseek_v4_flash/evaluation_report.md`](../../../src/evals/eval_results/20260430_023016_f36173c6_deepseek_v4_flash/evaluation_report.md)
