# QueryMind Evaluation

## 模块说明

QueryMind 的 evaluation 模块用于评估 SQL Agent 在多步推理、工具调用和 Schema Memory 检索增强下的表现。当前实现分成两层：

- 入口脚本：[`my_evaluation.py`](../../my_evaluation.py) 和独立报告脚本 [`src/evals/generate_report.py`](../../src/evals/generate_report.py)
- 核心评估库：[`src/QueryMind/core/evaluation/`](../../src/QueryMind/core/evaluation/)

这套链路关注的是：

- Agent 是否能通过多步推理找到正确 schema
- Schema Memory 驱动的增强检索，是否真的提升 SQL 生成质量
- 结果是否满足预先定义的行为契约，例如工具路径、最终回答内容和运行时长

它默认不评估 Agent Memory 的跨题召回效果。evaluation runtime 为每条 test case 建立独立会话，并使用 `NoOpAgentMemory`，因此样本之间不会因为共享 Agent Memory 而互相污染。

## 0. 快速启动

先确保 `src/.env` 已配置好数据库、LLM 和评估参数。若想复用已有 Schema Memory，建议：

```bash
EVAL_SCHEMA_SYNC_MODE=reuse_existing
```

如果 Agent 和 Judge 都想走兼容 Anthropic API 的 Minimax，可以直接统一全局配置，或按前缀分别配置：

```bash
LLM_PROVIDER=minimax
LLM_MODEL=Minimax-M2.7
LLM_BASE_URL=https://api.minimaxi.com/anthropic
```

常用启动方式：

```bash
my-evaluation \
  --dataset-path src/evals/datasets/basic.yaml \
  --resume-root eval_output/resume_points \
  --report-output-dir eval_output/eval_results
```

继续上次未完成的评测：

```bash
my-evaluation --resume-latest
```

只生成报告：

```bash
python evals/generate_report.py --latest --resume-root evals/resume_points
```

常用环境变量：

- `EVAL_DATASET_PATH`：默认数据集路径
- `EVAL_OUTPUT_DIR`：评测结果输出根目录，默认会落到 `eval_output/eval_results`
- `EVAL_MAX_CONCURRENCY`：并发数
- `EVAL_MAX_TOOL_ITERATIONS`：evaluation 中 Agent 的工具调用轮数上限，默认 `25`
- `EVAL_PASS_THRESHOLD`：`sql_accuracy` 的通过阈值
- `EVAL_PREVIEW_ROWS`：Judge 预览行数
- `EVAL_PROGRESS`：是否显示进度条
- `EVAL_CONSOLE_LOG_LEVEL` / `EVAL_FILE_LOG_LEVEL`：日志级别
- `EVAL_RECOVERY_*`：LLM 重试退避策略

默认产物目录：

```text
src/evals/resume_points/<run_id>/
  checkpoint.json
  results.jsonl
  run.log

eval_output/eval_results/<run_id>/
  evaluation_report.json
  evaluation_report.csv
  evaluation_report.md
  evaluation_report.html
```

## 1. 模块目标

当前 evaluation 主要回答三件事：

- QueryMind Agent 是否能通过多步推理和工具调用完成 SQL 生成
- Schema Memory 驱动的检索增强，是否比直接猜表名更有效
- 生成结果是否满足预先定义的行为契约

它刻意不把以下内容作为主目标：

- Agent Memory 的跨题召回能力
- 会话之间共享记忆带来的收益
- 纯文本回答的风格或措辞

在当前实现里，每条 `test_case` 默认使用独立 `conversation_id`，若数据集未显式提供，则按 `eval-{id}` 生成。

## 2. 核心功能

### Evaluation Dataflow Pipeline

```text
dataset YAML/JSON
    |
    v
test_case_spec.yaml validator
    |
    v
EvaluationDataset
    |
    v
EvaluationRunStore
    |--- checkpoint.json
    |--- results.jsonl
    |--- run.log
    |
    v
EvaluationRuntime
    |
    v
for each test_case
    |
    +--> Agent 执行与轨迹采集
    |
    +--> sql_accuracy evaluator (LLM-as-judge)
    |
    +--> expected_outcome evaluator (deterministic rules)
    |
    v
单条结果立即落盘
    |
    v
EvaluationReport
    +--> JSON
    +--> CSV
    +--> Markdown
    +--> HTML
```

### 数据集加载与校验

数据集由 [`src/QueryMind/core/evaluation/dataset.py`](../../src/QueryMind/core/evaluation/dataset.py) 加载，加载前会先经过 [`src/QueryMind/core/evaluation/validation.py`](../../src/QueryMind/core/evaluation/validation.py) 的 `EvaluationDatasetValidator` 校验。

`src/evals/datasets/test_case_spec.yaml` 是数据规范，不是可直接执行的数据集。它定义了：

- 必填字段
- 允许值范围
- 嵌套对象结构
- `expected_outcome` 的字段类型

校验会检查：

- `test_cases` 是否存在且非空
- 每条 test case 的必填字段是否齐全
- 字段类型是否正确
- `allowed_values` 是否被满足
- `test_case.id` 是否重复

如果数据集不符合规范，会抛出 `DatasetValidationError`，在真正跑评估前就会失败。

### Agent 执行与轨迹采集

[`src/QueryMind/core/evaluation/runtime.py`](../../src/QueryMind/core/evaluation/runtime.py) 负责把数据库、SQL runner、LLM、schema memory 和工具注册表组装成 evaluation runtime。

每条 test case 会创建独立 session：

- 独立 `conversation_id`
- 独立 `EvaluationConversationStore`
- `NoOpAgentMemory`
- 仅挂载 `RunSqlTool` 和 `SchemaRetrieveTool`

这意味着 evaluation 主要测的是：

- schema 检索
- 多步推理
- SQL 生成

而不是跨 case 的记忆召回。

`EvaluationRunner` 会在单条样本结束后立即提取轨迹，生成 `AgentResult`，再把结果交给 evaluator；同时通过 `result_callback` 立刻写入 `results.jsonl`，保证中途退出时已有结果不丢失。

### Evaluator 双层评估（LLM-as-judge）

源码里当前有两个 evaluator：

- `sql_accuracy`
- `expected_outcome`（源码名；文档里也可理解为 `expected_accuracy` 行为契约层）

评估顺序在 [`my_evaluation.py`](../../my_evaluation.py) 中固定为：

```text
sql_accuracy -> expected_outcome
```

`EvaluationRunner` 仍把第一个 evaluator 作为 canonical result，所以当前 canonical 结果是 `sql_accuracy`。

#### 2.4.1 `sql_accuracy`

源码位置：

- 评估主体：[`src/QueryMind/core/evaluation/evaluators.py`](../../src/QueryMind/core/evaluation/evaluators.py)
- Judge 输入模型：[`src/QueryMind/core/evaluation/base.py`](../../src/QueryMind/core/evaluation/base.py)

`sql_accuracy` 是真正的 LLM-as-judge 层，核心实现位于 [`src/QueryMind/core/evaluation/evaluators.py`](../../src/QueryMind/core/evaluation/evaluators.py) 的 `SqlAccuracyEvaluator`、`_build_judge_prompt()`、`_parse_judge_output()` 和 `_score_from_tags()`。

它的流程如下：

1. 执行 `ground_truth_sql`
2. 执行 agent 产出的 SQL
3. 组装 `JudgeInput`
4. 拼接 judge prompt
5. 让 Judge LLM 输出 JSON
6. 按 `issue_tags` 扣分并与 `pass_threshold` 比较

Judge prompt 的核心约束是：

- 只基于 query、SQL、执行预览、行数和错误信息判断
- 忽略仅有格式差异的结果
- 识别 `wrong_result_preview`、`wrong_columns`、`wrong_order_by`、`formatting_only` 等问题
- 输出必须是 JSON

Judge 的输入字段包括：

- `query`
- `database_id`
- `dialect`
- `ground_truth_sql`
- `ground_truth_result_preview`
- `agent_sql`
- `agent_result_preview`
- `sql_features`
- `trace_summary`

解析层不是死等纯 JSON，而是按下面顺序回收：

- 先尝试 fenced JSON
- 再尝试 balanced braces 提取
- 再尝试 raw 输出回收
- 解析结果会记录 `JudgeResult.parse_source`

如果最终仍然无法解析，就会落到 `judge_parse_failure`。

当前分数逻辑是：

- Judge 原始输出先转换成 `issue_tags`
- 同一 `issue_tag` 只计一次
- 最终分数按下面公式计算：

```text
score = clamp(1.0 - sum(penalty(issue_tag)), 0.0, 1.0)
passed = score >= EVAL_PASS_THRESHOLD
```

也就是说，最终是否通过看的是重新计算后的 `score`，不是 Judge 原始输出里的 `passed` 字段。

补充规则：

- `issue_tags` 里重复项会被去重后再扣分
- 未知 `issue_tag` 默认按 `0.1` 罚分
- 如果 Judge 输出无法解析，直接记为 `judge_parse_failure`，分数为 `0.0`

| issue_tag | 罚分 | 规则说明 |
|---|---:|---|
| `missing_sql` | `1.0` | Agent 没有产出可用的 `run_sql` 调用，属于核心结果缺失。 |
| `execution_error` | `1.0` | Agent 的 SQL 可提取，但执行失败或抛错。 |
| `ground_truth_failure` | `1.0` | 标准答案 SQL 本身执行失败，无法建立对比基准。 |
| `dataset_error` | `1.0` | 数据集或样本结构异常，属于数据层问题。 |
| `judge_parse_failure` | `1.0` | Judge 输出无法解析为结构化 JSON。 |
| `wrong_semantics` | `0.5` | 语义明显不对，但未被更具体的 tag 覆盖；如果 Judge 明确判失败且没给 tag，系统会自动补这个 tag。 |
| `wrong_result_preview` | `0.3` | 前几行结果明显不一致，属于结果内容层面的偏差。 |
| `wrong_columns` | `0.2` | 返回列集合或列语义不一致，但整体可能仍接近。 |
| `wrong_order_by` | `0.1` | 主要问题是排序不一致，通常是轻量扣分。 |
| `formatting_only` | `0.05` | 结果语义一致，只是别名、空白、SQL 格式等表面差异。 |

默认阈值 `EVAL_PASS_THRESHOLD=0.7`。因此通常可以这样理解：

- `formatting_only` 一般仍会通过
- `wrong_order_by` 单独出现时大概率也会通过
- `wrong_columns` 或 `wrong_result_preview` 往往会落在阈值边缘
- `missing_sql`、`execution_error`、`judge_parse_failure` 这类直接失败

#### 2.4.2 `expected_outcome`（行为契约 / `expected_accuracy` 层）

源码位置：

- 规则实现：[`src/QueryMind/core/evaluation/outcome.py`](../../src/QueryMind/core/evaluation/outcome.py)
- 数据模型：[`src/QueryMind/core/evaluation/base.py`](../../src/QueryMind/core/evaluation/base.py)

这一层不是 LLM judge，而是确定性的行为契约检查，核心实现位于 [`src/QueryMind/core/evaluation/outcome.py`](../../src/QueryMind/core/evaluation/outcome.py) 的 `ExpectedOutcomeEvaluator`、`_ordered_subsequence_match()`、`_fragment_matches()` 和 `_answer_surface_text()`。

当前规则是：

- `tools_called`
  - 取 `agent_result.tool_calls` 的真实顺序，只看 `tool_name`
  - 按 `tool_name` 做有序子序列匹配
  - 允许中间出现额外探索调用
  - 允许重复工具名，只要关键路径顺序不被打乱
- `final_answer_contains`
  - 优先抽取 SQL code block
  - 再做大小写无关、空白归一化的包含检查
  - 单词型 fragment 使用词边界匹配，避免把局部子串误判成命中
- `max_execution_time_ms`
  - 直接比较 `agent_result.execution_time_ms`
  - 主要用于排除明显死循环或卡死样本，不是严格的性能 SLA

这一层会把每个检查的结果写入 `metadata.check_results`，因此报告里能看见每一项是怎么判定的。

### 报告输出

报告逻辑位于 [`src/QueryMind/core/evaluation/report.py`](../../src/QueryMind/core/evaluation/report.py)，输出四种产物：

- JSON
- CSV
- Markdown
- HTML

报告会包含：

- 整体 pass rate、average score、execution success rate、平均耗时
- 每个 evaluator 的汇总
- 按 `difficulty`、`category`、`source`、`query_language` 的分类统计
- 每条样本的 evaluator breakdown

HTML 报告支持按这四个维度做筛选，表格行也带有对应的 `data-*` 属性，因此可以直接在页面里筛选不同难度、来源或语言的样本。

### 断点续评功能

断点续评由 [`src/evals/resume_store.py`](../../src/evals/resume_store.py) 管理，核心文件是：

- `checkpoint.json`
- `results.jsonl`
- `run.log`

每条样本结束后会立即追加结果，并更新 checkpoint。中途中断后，下次可以：

- 用 `--resume-latest` 继续最近未完成的 run
- 用 `--resume-run-id <run_id>` 继续指定 run

恢复时会按 `test_case.id` 去重，所以不会重复写入已经完成的样本。

独立的 [`src/evals/generate_report.py`](../../src/evals/generate_report.py) 还能直接从已有 resume point 生成报告，即使该 run 还没完全完成也可以出报表。

## 3. 未来优化计划

- multi-evaluators 引入与聚合：当前 canonical result 还是 `sql_accuracy`，后续可以加权、投票或按维度聚合。
- 评估阈值分层：`pass_threshold` 现在是全局值，后续可以按 evaluator、数据集或难度分层配置。
- judge prompt 版本化：把 judge prompt 固定成可追踪版本，方便回放和回归对比。
- 失败样本回放：增加单 case replay / debug 脚本，快速定位 agent、schema 或 judge 问题。
- 更细粒度统计：继续按 `tags`、`database_id`、失败类型和工具路径做分桶分析。

<details open>
<summary>相关源码文件</summary>

- [`my_evaluation.py`](../../my_evaluation.py) - 评估入口、resume、report 生成、双 evaluator 编排
- [`src/evals/generate_report.py`](../../src/evals/generate_report.py) - 独立报告生成脚本
- [`src/evals/bootstrap.py`](../../src/evals/bootstrap.py) - 环境变量加载、LLM 构建、runtime 构建、日志与进度条
- [`src/evals/reporting.py`](../../src/evals/reporting.py) - 报告产物落盘
- [`src/evals/resume_store.py`](../../src/evals/resume_store.py) - checkpoint、results.jsonl、run.log 管理
- [`src/evals/datasets/basic.yaml`](../../src/evals/datasets/basic.yaml) - 当前评测数据集
- [`src/evals/datasets/test_case_spec.yaml`](../../src/evals/datasets/test_case_spec.yaml) - 数据集规范与校验规则
- [`src/QueryMind/core/evaluation/base.py`](../../src/QueryMind/core/evaluation/base.py) - 评估数据模型
- [`src/QueryMind/core/evaluation/dataset.py`](../../src/QueryMind/core/evaluation/dataset.py) - 数据集加载
- [`src/QueryMind/core/evaluation/validation.py`](../../src/QueryMind/core/evaluation/validation.py) - 数据集校验器
- [`src/QueryMind/core/evaluation/runtime.py`](../../src/QueryMind/core/evaluation/runtime.py) - evaluation runtime、session、tool registry 组装
- [`src/QueryMind/core/evaluation/runner.py`](../../src/QueryMind/core/evaluation/runner.py) - 单条 test case 执行、轨迹提取、evaluator 运行
- [`src/QueryMind/core/evaluation/evaluators.py`](../../src/QueryMind/core/evaluation/evaluators.py) - `sql_accuracy` 的 judge prompt 与 JSON 解析
- [`src/QueryMind/core/evaluation/outcome.py`](../../src/QueryMind/core/evaluation/outcome.py) - `expected_outcome` 行为契约判定
- [`src/QueryMind/core/evaluation/report.py`](../../src/QueryMind/core/evaluation/report.py) - JSON/CSV/Markdown/HTML 报告
- [`src/QueryMind/core/evaluation/sql_policy.py`](../../src/QueryMind/core/evaluation/sql_policy.py) - read-only SQL 策略

</details>

## 小结

当前 evaluation 模块的目标很清晰：评估多步推理、工具调用和 Schema Memory 驱动的 SQL 生成能力，并通过 `sql_accuracy` + `expected_outcome` 两层结果把“结果正确”和“行为合理”分开看。
