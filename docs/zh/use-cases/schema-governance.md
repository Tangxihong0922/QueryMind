# Schema Governance 用例

本页展示 schema governance 在典型多轮 schema 发现流程中的端到端行为。

prompt 侧的 `SchemaGovernanceEnhancer` 只负责追加 prompt-chain 页面里
描述的固定 block。下面的流程主要由 manager、hook 和 middleware 驱动。

## 场景

用户先发起一次较宽泛的 schema 搜索，然后在后续轮次里要求基于前一次
选中的表继续扩展。

这个流程依赖的是会话级状态，而不是自然语言里的“记忆”。

## 发生了什么

1. 第一次 `schema_retrieve` 会返回选中的表和检索元数据。
2. `SchemaGovernanceHook.after_tool(...)` 记录这次结果，更新会话状态，
   并把刷新后的 snapshot 写回 `result.metadata`。
3. `SchemaGovernanceManager.build_request_metadata(...)` 会把
   `schema_governance` 和 `last_schema_summary` 暴露给下一轮。
4. `SchemaGovernanceMiddleware.before_llm_request(...)` 会把这个 snapshot
   合并到 request metadata，追加治理 prompt block，并在会话锁定后隐藏
   `schema_retrieve`。
5. 当轮次预算或锁定状态需要重新强调目标时，middleware 会插入 recap
   提示。
6. 下一轮就能直接沿用已保存的 schema 状态，而不是重新开始。

## ASCII 流程图

下面这张图按用例叙述串起 schema governance 的完整闭环。事实源来自
`src/QueryMind/core/agent/governance.py`、`src/QueryMind/core/hook/schema_governance.py`、
`src/QueryMind/core/middleware/schema_governance.py`、`src/QueryMind/core/enhancer/schema_governance.py`
以及 `eval-sql_126` 的真实日志。

```text
+====================================================================================================+
| 0) schema_retrieve.execute()                                                                      |
|----------------------------------------------------------------------------------------------------|
| 输入：ToolCall.arguments                                                                           |
|   - #1 query="employees with SalariedFlag and BusinessEntityID" search_mode="hybrid"              |
|   - #2 query="HumanResources Employee table with SalariedFlag and BusinessEntityID"               |
|         search_mode="vector"                                                                       |
|   - #3 query="employee table human resources" search_mode="hybrid"                                 |
| 输出：ToolResult.metadata -> selected_tables / total_results / summary_text                        |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 1) SchemaGovernanceHook.after_tool(...)                                                            |
|----------------------------------------------------------------------------------------------------|
| 输入：schema_retrieve 的 ToolResult.metadata + success                                             |
| 逻辑：                                                                                             |
|   - 归一化 selected_tables、query 和 table refs                                                     |
|   - 更新 calls / successes / failures / empty / no_new / same_query streaks                       |
|   - 把刷新后的 snapshot 写回 result.metadata                                                       |
| eval-sql_126 快照：                                                                                |
|   - after #1 -> calls=1 successes=1 failures=0 locked=False                                        |
|   - after #2 -> calls=2 successes=1 failures=1 locked=False                                        |
|   - after #3 -> calls=3 successes=2 failures=1 locked=True lock_reason=enough_schema               |
| 输出：result.metadata.schema_governance + last_schema_summary                                       |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 2) SchemaGovernanceManager                                                                         |
|----------------------------------------------------------------------------------------------------|
| 输入：conversation_id + 最新 state                                                                  |
| 逻辑：                                                                                             |
|   - build_request_metadata() 暴露紧凑 snapshot                                                      |
|   - build_prompt_block() 生成 unlocked / locked 治理块                                              |
|   - should_hide_schema_tool() 判断下一轮是否隐藏 `schema_retrieve`                                 |
| 真实 snapshot（eval-sql_126）：                                                                    |
|   schema_retrieve_calls=3                                                                          |
|   schema_retrieve_successes=2                                                                      |
|   schema_retrieve_failures=1                                                                       |
|   schema_locked=true                                                                               |
|   lock_reason=enough_schema                                                                        |
| prompt 片段：                                                                                       |
|   "## Schema Governance"                                                                           |
|   "- schema_locked: true"                                                                          |
|   "- `schema_retrieve` is locked for this turn."                                                   |
|   "- Enter SQL draft mode now."                                                                    |
| 输出：request.metadata + request-time governance block                                              |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 3) Agent._prepare_turn_prompt() + SchemaGovernanceEnhancer                                         |
|----------------------------------------------------------------------------------------------------|
| 输入：user_message + tool_schemas + request.metadata + system_prompt                               |
| 逻辑：                                                                                             |
|   - 先把 snapshot 合并进 turn metadata                                                              |
|   - 再把治理块拼进 system prompt                                                                   |
|   - `SchemaGovernanceEnhancer` 只追加固定治理 block，不改状态                                       |
| 结果：最终 system prompt 带着 `schema_locked: true` / `false` 的提示                               |
| 作用：让模型在 prompt 层知道“继续探索”还是“进入 SQL 起草”                                          |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 4) SchemaGovernanceMiddleware.before_llm_request()                                                 |
|----------------------------------------------------------------------------------------------------|
| 输入：request.metadata + request.tools + request.system_prompt                                      |
| 逻辑：                                                                                             |
|   - 再次合并 snapshot                                                                               |
|   - 需要时插入 recap block                                                                          |
|   - `should_hide_schema_tool()` 为 true 时移除 `schema_retrieve`                                   |
|   - empty-results 锁定时仍允许 metadata discovery 例外                                              |
| eval-sql_126 结果：                                                                                |
|   - 下一轮只保留 `run_sql`                                                                         |
|   - `schema_retrieve` 不再暴露给 LLM                                                              |
| 输出：最终 request.system_prompt + request.tools + request.metadata                                |
+====================================================================================================+
```

## 关键信号

manager 会跟踪这些信号：

- `schema_retrieve_calls`
- `schema_retrieve_successes`
- `schema_retrieve_failures`
- `consecutive_same_query_calls`
- `consecutive_no_new_tables`
- `consecutive_empty_results`
- `schema_locked`
- `lock_reason`
- 在 empty-results 锁定下的 `allow_metadata_query`

这些信号决定 discovery 是否继续、工具是否隐藏，以及 recap 是否要插入。

## 锁定启发式

当前的锁定原因包括：

- `enough_schema`
- `schema_retrieve_empty_results`
- `schema_retrieve_no_new_tables`
- `schema_retrieve_budget`
- `schema_retrieve_failures`
- `repeated_schema_query`

当 schema 已经足够、搜索停滞、重复查询，或者预算耗尽时，manager
都可以锁定探索。

## 为什么重要

schema governance 把 schema 发现变成一个确定性循环：

- 模型不需要用自然语言记住之前选了哪些表；
- 运行时可以显式保存已经选中的表；
- 一旦结构足够清晰，prompt 就可以收紧；
- 下一轮可以从 seed tables 继续，而不是重头开始；
- empty-results 锁定仍然允许只读 metadata discovery。

## 源码文件

- [`src/QueryMind/core/agent/governance.py`](../../../src/QueryMind/core/agent/governance.py)
- [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py)
- [`src/QueryMind/core/enhancer/schema_governance.py`](../../../src/QueryMind/core/enhancer/schema_governance.py)
- [`src/QueryMind/core/hook/schema_governance.py`](../../../src/QueryMind/core/hook/schema_governance.py)
- [`src/QueryMind/core/middleware/schema_governance.py`](../../../src/QueryMind/core/middleware/schema_governance.py)
- [`src/evals/resume_points/20260430_023016_f36173c6/run.log`](../../../src/evals/resume_points/20260430_023016_f36173c6/run.log)
