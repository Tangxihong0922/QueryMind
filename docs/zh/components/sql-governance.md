# SQL Governance

SQL governance 管理的是 schema discovery 开始之后的 SQL 起草循环。
它把任务画像、SQL 形状、最佳 anchor，以及 freeze / repair 的切换和
schema 探索分开，并通过消息侧 runtime notice 把 live summary / anchor / freeze
状态暴露给模型，而不是主要依赖 system prompt。

## 核心组件

- `SqlGovernanceManager`：负责 policy、状态、snapshot 组装、recap gating 和 freeze 决策。
- `SqlGovernanceHook`：在工具执行后记录 `run_sql` 的结果，并把刷新后的 snapshot 写回 `result.metadata`。
- `SqlGovernanceMiddleware`：推断或复用当前画像，合并 request metadata，预置消息侧 runtime notice，并在轮次漂移或运行过长时插入 recap；runtime notice 里也会带上 repair strategy / reason / signals。

SQL 没有单独的 enhancer。prompt 文本通过 manager 辅助方法生成，用于稳定的 system prompt 尾部；动态 SQL 状态则通过 middleware 注入到消息侧。

`build_sql_governance_stack()` 会返回一个可复用的 bundle，里面包含 policy、manager、hook 和 middleware。

## 辅助模块

`sql_governance_prompt.py` 和 `sql_governance_shape.py` 把问题拆成两层：

- prompt 文本和 recap 文本；
- profile 推断、SQL 形状分析、rejection reason 辅助逻辑。

`build_sql_governance_profile()`、`infer_profile_from_message()`、`build_sql_governance_prompt_block()` 和 `build_sql_governance_recap_block()` 都在这套拆分里。
`analyze_sql_text()` 和 `analyze_sql_shape()` 使用 `sqlglot` 提取 SQL 结构。
这套帮助函数现在还会显式区分 `local_repair` 和 `structural_rewrite`，并对 `case_when`、`null_handling`、`comparison`、`distinct` 这类 detail 表达式家族给出更保守的提示。

分析覆盖：

- select / where / join / group by / having / order by；
- window 和 ranking 函数；
- subquery 和 CTE 计数；
- set operation；
- row grain；
- metadata query 检测；
- canonical 和 core signature。

## Policy

`SqlGovernancePolicy` 暴露这些控制项：

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

`SqlGovernanceState` 保存会话中的可变状态：

- 会话标识和画像状态；
- SQL 的尝试、成功、失败次数，以及 metadata-query 失败次数；
- 最新 SQL 文本、签名、shape feature 和 rejection reason；
- row grain 状态、SQL family、候选 family，以及 turn-local repair mode；
- 最好的 SQL anchor 和它的 support 计数；
- 冻结后的 SQL 快照和 freeze 原因；
- recap 相关记录和最近一次 freeze evaluation。

`SqlGovernanceState` 之所以这么丰富，是因为它同时要支撑 snapshot 组装和 freeze 评估。

## Manager 行为

### `register_request_profile(...)`

`register_request_profile(...)` 会把当前画像写入会话状态。
它可以接收 middleware 推断出的画像；当画像没有有效信号时会清空画像；在提供 `user_message` 时会保存 `last_user_message`；更新 `profile_signature`；并解析出：

- `sql_family`
- `sql_family_candidates`
- `row_grain_state`

这一步使用的是 `_resolve_sql_family_state(...)`。

### `observe_sql_result(...)`

`observe_sql_result(...)` 会在每次 `run_sql` 结果返回后执行。
它会：

- 记录尝试、成功和失败；
- 从 `executed_sql`、`sql` 或之前的 `last_sql_text` 里读取 SQL 文本；
- 使用 `analyze_sql_text(...)` 分析 SQL；
- 更新 SQL signature、core signature 和 canonical signature；
- 在检测到 metadata query 时增加 `metadata_query_failures`；
- 计算 `last_gap_categories`；
- 跟踪重复的 rejection reason；
- 更新最佳 SQL anchor；
- 评估 turn-local repair mode；
- 评估 freeze，并在条件满足时把最佳 anchor 复制到 frozen snapshot。

metadata-query 结果会被单独对待：它们不会进入已验证的 anchor。

### `build_request_metadata(...)`

`build_request_metadata(...)` 会在会话还没有可暴露的 SQL 状态时返回 `{}`。
否则它会返回：

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

`runtime_profile` 会在可用时从当前 anchor 推导出来。

### `should_inject_recap(...)`

`should_inject_recap(...)` 对同一个 `request_id` 只会发出一次 recap。
它委托给 `_sql_should_emit_recap(...)`，而这个判断会在当前轮出现 drift、metadata-query 结果、row-grain mismatch、family mismatch、gap categories，或重复的 rejection signal 时返回 true。
当 `sql_exploration_frozen` 为 true 时，它不会再发 recap。

### `build_prompt_block(...)` 与 `build_recap_block(...)`

`build_prompt_block(...)` 和 `build_recap_block(...)` 通过辅助模块渲染 prompt 文本。
`build_prompt_block(...)` 会把当前 profile、缺失类别、冻结状态、freeze 原因、冻结和最佳 anchor 文本、anchor tier、SQL family，以及 turn-local repair mode 传给 prompt renderer，但默认运行时只把这些稳定规则留在 system prompt 的尾部。
当 `repair_strategy` 为 `structural_rewrite` 时，它会显式要求重建 grouped summary 或 CTE shape；当 profile 命中 `case_when`、`null_handling`、`comparison`、`distinct` 这类 detail 家族时，它会更保守地提示只调整 CASE / COALESCE / comparison / deduplication 逻辑。
`build_recap_block(...)` 会在当前状态需要 recap 时渲染 reactive recap 文本。

## Freeze 与 Repair

freeze 是 SQL governance 的核心变化。
manager 只有在下面这些条件同时满足时才会冻结：

- 存在有效的 best SQL anchor；
- 该 anchor 已经是 validated，而不只是 candidate；
- 当前 row grain 是 aligned；
- anchor 还没有任何剩余 gap categories；
- `last_tool_iterations` 已知，并且达到了由 `freeze_trigger_ratio` 和 `freeze_min_tool_iterations` 推导出的阈值；
- 会话当前还没有被冻结。

validated anchor 的检查还要求 best SQL candidate 的支持度足够：`best_sql_support_count` 必须至少达到 `max(2, freeze_min_best_sql_support)`。

状态冻结后，manager 会把最佳 anchor 复制到 frozen snapshot，并记录带有迭代信息的 freeze reason。

`turn_local_repair_mode` 会在 anchor 处于 candidate 或 validated、状态未冻结、row grain 对齐，并且出现同一个成功 canonical SQL 重复或者同一个 rejection reason 重复时变为 true；如果 `_sql_repair_strategy_from_snapshot()` 判定为 `structural_rewrite`，这个开关会被强制关闭，让 aggregation / rollup / 多 CTE 这类 turn 走重写而不是局部修补。

## 请求时流程

这一节只展示 `run_sql` 之后的 SQL 起草闭环。`sql_126` 的前置条件是：
`schema_retrieve` 已经把目标收敛到 `HumanResources.Employee`，随后才进入
`run_sql` 起草循环。

`sql_126` 事实：
- 用户问题是 `write a query in SQL to sort the BusinessEntityID in descending order for those employees that have the SalariedFlag set to 'true' and in ascending order that have the SalariedFlag set to 'false'. Return BusinessEntityID, and SalariedFlag.`
- 最终结果摘要是 `row_count=290`，`columns=["businessentityid","salariedflag"]`
- 预览首行是 `290, true`，次行是 `289, true`

```text
+====================================================================================================+
| 1) run_sql.execute()                                                                              |
|----------------------------------------------------------------------------------------------------|
| 输入: LLM 发出的 tool call                                                                        |
| sql_126 真实参数:                                                                                  |
|   #1 SELECT table_schema, table_name FROM information_schema.tables                                |
|      WHERE table_schema = 'humanresources' ORDER BY table_name;                                   |
|   #2 SELECT column_name, data_type FROM information_schema.columns                                 |
|      WHERE table_schema = 'humanresources' AND table_name = 'employee'                            |
|      ORDER BY ordinal_position;                                                                    |
|   #3 SELECT businessentityid, salariedflag FROM humanresources.employee                           |
|      ORDER BY CASE WHEN salariedflag = true THEN 0 ELSE 1 END,                                    |
|               CASE WHEN salariedflag = true THEN businessentityid END DESC,                      |
|               CASE WHEN salariedflag = false THEN businessentityid END ASC;                      |
| 输出: ToolResult(success=true, 结果摘要=row_count=290, columns=["businessentityid","salariedflag"]) |
| 说明: 前两次是 metadata introspection，第 3 次才是可用的最终 SQL                                     |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 2) SqlGovernanceHook.after_tool()                                                                  |
|----------------------------------------------------------------------------------------------------|
| 入口条件: `result.metadata.tool_name == "run_sql"`                                                |
| 动作:                                                                                              |
|   - 调用 `observe_sql_result(conversation_id, request_id, result_metadata, success)`               |
|   - 再调用 `build_request_metadata(...)`                                                           |
|   - 把刷新后的 snapshot 写回 `result.metadata`                                                     |
| sql_126 事实: 运行日志里连续记录了 3 次 `Recorded SQL governance state ... success=True`          |
| 输出: 下一轮可以直接读取最新 SQL 状态                                                                |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 3) sql_governance.py / SqlGovernanceManager.observe_sql_result()                                  |
|----------------------------------------------------------------------------------------------------|
| 读取: `executed_sql` / `sql` / `last_sql_text`                                                     |
| 处理: `analyze_sql_text(...)` -> 更新尝试次数、成功次数、失败次数、signature、anchor、freeze gate  |
| sql_126 snapshot:                                                                                  |
|   sql_attempts=3, sql_successes=3, sql_failures=0                                                  |
|   last_sql_result_success=true                                                                     |
|   last_sql_text="SELECT businessentityid, salariedflag FROM humanresources.employee ..."           |
|   last_sql_summary.summary_text="run_sql[success] features=case_expression, order_by sql='...'"   |
|   row_grain_state={expected=detail, observed=detail, status=aligned, reason=aligned}              |
|   best_sql_support_count=1 -> `anchor_tier=candidate`                                              |
|   freeze gate: `last_tool_iterations=3 < threshold=16` -> `sql_exploration_frozen=false`          |
| 输出: `sql_governance` / `runtime_profile` / `last_sql_summary` / `last_sql_shape`                 |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 4) sql_governance_shape.py                                                                         |
|----------------------------------------------------------------------------------------------------|
| 提取 SQL 形状: select / where / join / group by / having / order by / subquery / CTE / row grain   |
| sql_126 形状片段:                                                                                  |
|   table_references=["humanresources.employee"]                                                     |
|   feature_names=["case_expression", "order_by"]                                                    |
|   metadata_query=false                                                                              |
|   row_grain=detail                                                                                  |
| 说明: 这是 ordering family，不是 metadata query，也不是聚合 / join / window 起草                   |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 5) sql_governance_prompt.py                                                                        |
|----------------------------------------------------------------------------------------------------|
| 生成稳定的 prompt 文本与 recap 文本                                                                 |
| prompt 真实片段:                                                                                   |
|   "## SQL Governance"                                                                              |
|   "- Avoid metadata introspection queries unless they are explicitly allowed."                     |
|   "- Keep the current row grain stable and call `run_sql` once the table path is clear."           |
| sql_126 语义: profile source=message, categories=["ordering"]                                      |
| 输出: 稳定治理块 +（仅在 drift / mismatch / repeated rejection 时才会）recap block                  |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 6) SqlGovernanceMiddleware.before_llm_request()                                                    |
|----------------------------------------------------------------------------------------------------|
| 读入: `request.metadata` + `request.system_prompt` + `request.messages`                             |
| 顺序:                                                                                              |
|   - 读取 `sql_governance_profile` / `sql_profile` / `runtime_profile`                             |
|   - 调用 `register_request_profile(...)`                                                           |
|   - 合并最新 snapshot 回 `request.metadata`                                                        |
|   - 预置一条消息侧 runtime notice，里面包含 schema recap、SQL anchor preview、freeze reason、     |
|     row grain 和 SQL recap                                                                         |
|   - 必要时再插入 recap block                                                                       |
| sql_126 可见上下文:                                                                                |
|   request.metadata = {sql_governance:{sql_attempts=3,...},                                         |
|                        runtime_profile:{source=runtime, anchor_tier=candidate,                    |
|                        sql_family=ordering, best_sql_preview="SELECT businessentityid, ..."}}      |
| 输出: `LlmRequest` 进入下一轮 LLM                                                                  |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 7) 下一轮 LLM / tool selection                                                                     |
|----------------------------------------------------------------------------------------------------|
| 模型看到: 稳定 system prompt + runtime notice + metadata snapshot                                   |
| 结果: 继续修正或结束 SQL 草案                                                                      |
| sql_126 结果: 生成最终 `ORDER BY CASE ...` 的稳定版本，随后结束该 query turn                        |
+====================================================================================================+
```

这条链路的边界是：`run_sql` 先把结果写回 `result.metadata`，`SqlGovernanceManager`
更新 state 和 snapshot，随后 `SqlGovernanceMiddleware` 再把这些状态注入下一轮
`request.metadata` / 消息侧 runtime notice，而不是继续写进 system prompt。

## 本页覆盖什么

- SQL profile 推断；
- SQL 形状分析；
- request snapshot 字段；
- anchor 和 freeze 行为；
- recap 与 repair mode 逻辑；
- hook 和 middleware 集成。

## 本页不覆盖什么

- schema 探索锁定；
- schema retrieval 的 search-mode 规则；
- conversation 持久化；
- 通用 memory 行为。

这些内容分别放到 schema governance、prompt-chain、context 和 memory 页面里。

## 源码文件

- [`src/QueryMind/core/agent/sql_governance.py`](../../../src/QueryMind/core/agent/sql_governance.py)
- [`src/QueryMind/core/agent/sql_governance_prompt.py`](../../../src/QueryMind/core/agent/sql_governance_prompt.py)
- [`src/QueryMind/core/agent/sql_governance_shape.py`](../../../src/QueryMind/core/agent/sql_governance_shape.py)
- [`src/QueryMind/core/hook/sql_governance.py`](../../../src/QueryMind/core/hook/sql_governance.py)
- [`src/QueryMind/core/middleware/sql_governance.py`](../../../src/QueryMind/core/middleware/sql_governance.py)
