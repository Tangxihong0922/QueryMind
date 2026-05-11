# SQL Governance 用例

本页展示 SQL governance 如何把一个宽泛的 SQL 起草问题收敛成一个
受控循环：画像推断、冻结决策、局部修补，以及 aggregation / rollup / 多 CTE
这类结构性 turn 的重写分流。

## 场景

用户提出一个需要结构化 SQL 起草的问题。agent 先生成一个候选 query，
然后不断迭代，直到有足够证据可以冻结出稳定 skeleton，或者转入局部
修补。

## 发生了什么

1. `SqlGovernanceMiddleware.before_llm_request(...)` 会先从
   `sql_governance_profile`、`sql_profile`、`runtime_profile`、
   `sql_runtime_profile` 或 `sql_governance` 中寻找画像线索。
2. 如果这些线索都没有，middleware 会回退到
   `infer_profile_from_message(...)`。
3. 随后 `SqlGovernanceMiddleware.before_llm_request(...)` 会调用
   `SqlGovernanceManager.register_request_profile(...)`。
4. 每次 `run_sql` 之后，`SqlGovernanceHook.after_tool(...)` 都会记录
   SQL 结果，并把刷新后的 snapshot 写回 `result.metadata`。
5. `SqlGovernanceManager.observe_sql_result(...)` 会更新 SQL signature、
   row grain 状态、anchor 支持度和 freeze 评估。
6. `SqlGovernanceManager.build_request_metadata(...)` 会把当前的
   `sql_governance`、`runtime_profile`、`last_sql_summary`、
   `last_sql_shape`、`sql_family`、`sql_family_candidates` 和
   `row_grain_state` 暴露给下一轮，同时把 `repair_strategy`、`repair_reason`
   和 `repair_signals` 一并带上。
7. `SqlGovernanceMiddleware.before_llm_request(...)` 会把这些 snapshot 合并进
   `request.metadata`，再在消息链尾部追加一条 message-side runtime notice；当轮次漂移、
   失败或运行过长时，还会插入 recap。
8. 一旦证据足够，manager 会冻结 skeleton；如果当前 turn 被判定为
   `structural_rewrite`，下一轮会优先重写 grouped summary / CTE 形状，而
   不是继续做局部修补。

## ASCII 流程图

下面这张图把 SQL 起草闭环按用例叙述串起来。事实源来自
`src/QueryMind/core/agent/sql_governance.py`、
`src/QueryMind/core/agent/sql_governance_shape.py`、
`src/QueryMind/core/agent/sql_governance_prompt.py`、
`src/QueryMind/core/hook/sql_governance.py`、
`src/QueryMind/core/middleware/sql_governance.py`、
`src/my_agent.py`，以及 `eval-sql_126` 的真实日志。

```text
+====================================================================================================+
| 0) SqlGovernanceMiddleware.before_llm_request()                                                   |
|----------------------------------------------------------------------------------------------------|
| 输入：sql_governance_profile / sql_profile / runtime_profile / sql_runtime_profile                |
| 逻辑：                                                                                             |
|   - 优先复用已有画像                                                                              |
|   - 如果没有线索，则回退到 infer_profile_from_message(...)                                        |
|   - 调用 SqlGovernanceManager.register_request_profile(...)                                       |
| sql_126 事实：                                                                                     |
|   profile source = message                                                                         |
|   categories = ["ordering"]                                                                        |
| 输出：request.metadata 带上当前 profile / runtime snapshot                                         |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 1) run_sql.execute()                                                                              |
|----------------------------------------------------------------------------------------------------|
| 输入：LLM 发出的 tool call                                                                        |
| sql_126 真实参数：                                                                                 |
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
| 输出：ToolResult(success=true, row_count=290, columns=["businessentityid","salariedflag"])         |
| 说明：前两次是 metadata introspection，第 3 次才是最终 SQL                                         |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 2) SqlGovernanceHook.after_tool()                                                                  |
|----------------------------------------------------------------------------------------------------|
| 入口条件：result.metadata.tool_name == "run_sql"                                                   |
| 逻辑：                                                                                             |
|   - 调用 observe_sql_result(...)                                                                   |
|   - 再调用 build_request_metadata(...)                                                             |
|   - 把刷新后的 snapshot 写回 result.metadata                                                       |
| sql_126 结果：连续 3 次 run_sql 都被记录为 success                                                   |
| 输出：result.metadata.sql_governance + last_sql_summary                                             |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 3) SqlGovernanceManager.observe_sql_result()                                                       |
|----------------------------------------------------------------------------------------------------|
| 输入：executed_sql / sql / last_sql_text / result metadata                                         |
| 处理：analyze_sql_text(...) -> 更新 signature、anchor、row grain、freeze gate                    |
| sql_126 snapshot：                                                                                 |
|   sql_attempts=3                                                                                   |
|   sql_successes=3                                                                                  |
|   sql_failures=0                                                                                   |
|   last_sql_result_success=true                                                                     |
|   last_sql_text = "SELECT businessentityid, salariedflag FROM humanresources.employee ..."         |
|   row_grain_state = aligned                                                                        |
|   best_sql_support_count = 1                                                                       |
|   sql_exploration_frozen = false                                                                   |
| 输出：runtime_profile / best_sql_* / row_grain_state / last_sql_summary                             |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 4) sql_governance_shape.py                                                                         |
|----------------------------------------------------------------------------------------------------|
| 提取 SQL 形状：select / where / join / group by / having / order by / subquery / CTE             |
| sql_126 形状片段：                                                                                 |
|   table_references=["humanresources.employee"]                                                     |
|   feature_names=["case_expression", "order_by"]                                                    |
|   metadata_query=false                                                                              |
|   row_grain=detail                                                                                  |
| 说明：这是 ordering family，不是 metadata query，也不是聚合 / join / window 起草                  |
| 输出：canonical / core signature + shape features                                                   |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 5) sql_governance_prompt.py                                                                        |
|----------------------------------------------------------------------------------------------------|
| 生成 prompt 文本与 recap 文本                                                                       |
| prompt 真实片段：                                                                                  |
|   "## SQL Governance"                                                                              |
|   "- Avoid metadata introspection queries unless they are explicitly allowed."                     |
|   "- Keep the current row grain stable and call `run_sql` once the table path is clear."           |
| sql_126 语义：profile source=message, categories=["ordering"]                                      |
| 输出：governance prompt block +（仅在 drift / mismatch / repeated rejection 时才会）recap block      |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 6) SqlGovernanceMiddleware.before_llm_request()                                                    |
|----------------------------------------------------------------------------------------------------|
| 输入：request.metadata + request.system_prompt + request.messages                                   |
| 逻辑：                                                                                             |
|   - 读取并合并最新 snapshot                                                                        |
|   - 在消息链尾部追加 message-side runtime notice                                                   |
|   - 必要时插入 recap block                                                                         |
|   - 依据 current anchor / repair mode 调整下一轮提示                                              |
| sql_126 可见上下文：                                                                               |
|   request.metadata 里带着 sql_governance / runtime_profile / last_sql_summary                      |
| 输出：LlmRequest 进入下一轮 LLM                                                                     |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 7) 下一轮 LLM / tool selection                                                                     |
|----------------------------------------------------------------------------------------------------|
| 模型看到：稳定 system prompt tail + message-side runtime notice + metadata snapshot               |
| 结果：如果还有 drift 就继续修补；如果已经稳定，就结束该 SQL 起草轮次                               |
| sql_126 结果：最终稳定的 `ORDER BY CASE ...` 版本完成，query turn 结束                              |
+====================================================================================================+
```

## 关键指标

manager 会跟踪这些信号：

- SQL 尝试、成功和失败次数；
- `metadata_query_failures`；
- SQL 文本签名和 canonical signature；
- `best_sql_support_count`；
- `repair_strategy`、`repair_reason` 和 `repair_signals`；
- row grain 是否对齐；
- `same_success_sql_canonical_streak`；
- `turn_local_repair_mode`；
- freeze 状态和 freeze 原因。

## Freeze 行为

当当前候选已经有足够支持，并且评估阈值达标时，会触发 freeze。
freeze 之后：

- 当前 skeleton 会被视为 anchor；
- runtime 可以优先做局部修补；如果当前 turn 属于 aggregation / rollup / 多 CTE 这类结构性形状，则会优先走结构重写；
- recap 消息可以把模型拉回冻结的形状上。

## 为什么重要

SQL governance 能避免 agent 反复重启同一种 query 形状：

- 它会显式保存最佳 skeleton；
- 它能识别 drift 和重复失败；
- 它可以冻结已经验证过的 SQL 形状；
- 之后的轮次只需要围绕已知 anchor 做修补，成本更低。

## 源码文件

- [`src/QueryMind/core/agent/sql_governance.py`](../../../src/QueryMind/core/agent/sql_governance.py)
- [`src/QueryMind/core/agent/sql_governance_prompt.py`](../../../src/QueryMind/core/agent/sql_governance_prompt.py)
- [`src/QueryMind/core/agent/sql_governance_shape.py`](../../../src/QueryMind/core/agent/sql_governance_shape.py)
- [`src/QueryMind/core/hook/sql_governance.py`](../../../src/QueryMind/core/hook/sql_governance.py)
- [`src/QueryMind/core/middleware/sql_governance.py`](../../../src/QueryMind/core/middleware/sql_governance.py)
- [`src/my_agent.py`](../../../src/my_agent.py)
- [`src/evals/resume_points/20260430_023016_f36173c6/run.log`](../../../src/evals/resume_points/20260430_023016_f36173c6/run.log)
