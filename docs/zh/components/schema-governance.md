# Schema Governance

Schema governance 管理的是按会话维度维护的 `schema_retrieve` 循环。
它把 schema 发现和 SQL 起草分开，并向 prompt 组装和请求时过滤暴露
一个紧凑的状态快照。

## 核心组件

- `SchemaGovernanceManager`：负责 policy、可变状态、锁定启发式、recap gating 和 request snapshot。
- `SchemaGovernanceHook`：在工具执行后观察 `schema_retrieve` 结果，并把刷新后的 snapshot 写回 `result.metadata`。
- `SchemaGovernanceMiddleware`：把 snapshot 合并到 `request.metadata`，追加治理块，在需要时插入 recap，并且可以把 `schema_retrieve` 从 `request.tools` 中隐藏掉。
- `SchemaGovernanceEnhancer`：只在 prompt 侧追加来自 `policy.system_prompt_block` 的固定治理块，不改状态。

`build_schema_governance_stack()` 会返回一个可复用的 bundle，里面包含 policy、manager、hook、middleware 和 enhancer。

## Policy

`SchemaGovernancePolicy` 暴露的控制项包括：

- `schema_tool_name`
- `schema_retrieve_max_calls`
- `schema_retrieve_max_failures`
- `schema_retrieve_successes_to_lock`
- `schema_retrieve_same_query_limit`
- `schema_retrieve_no_new_tables_limit`
- `schema_retrieve_empty_results_limit`
- `recap_trigger_ratio`
- `recap_min_tool_iterations`
- `system_prompt_block`
- `recap_message`

## State

`SchemaGovernanceState` 保存会话中的可变状态：

- `schema_retrieve` 的调用、成功、失败计数；
- 重复查询、无新增表、空结果的 streak 计数；
- 归一化后的上一条 schema query；
- 已见 schema tables 集合；
- 锁定标记和锁定原因；
- 最新的原始 schema metadata 和紧凑 summary；
- 最新的 recap request id。

`SchemaGovernanceStack` 是一个方便的包装器，把 policy、manager、hook、middleware 和 enhancer 打包在一起。

## Manager 行为

### `observe_schema_result(...)`

`observe_schema_result(...)` 会在 `schema_retrieve` 工具结果返回后执行。
它会：

- 对 `selected_tables` 做归一化，并去掉同一条结果里的空值和重复项；
- 每次执行都增加调用计数；
- 只有在 `success` 为 true 且结果里包含 selected tables 时才计为成功；
- 否则计为失败；
- 用归一化后的 `last_schema_query` 跟踪重复查询；
- 跟踪空结果 streak 和无新增表 streak；
- 更新 `seen_schema_tables`；
- 构建 `last_schema_summary`，里面包含 query、search mode、graph hint、selected tables、new tables、table refs、计数、锁定状态，以及可读的 `summary_text`。

### 锁定启发式

manager 的锁定顺序如下：

1. `enough_schema`：当 `schema_retrieve_successes` 达到 `schema_retrieve_successes_to_lock`；
2. `schema_retrieve_empty_results`：当空结果 streak 达到 `schema_retrieve_empty_results_limit`；
3. `schema_retrieve_no_new_tables`：当无新增表 streak 达到 `schema_retrieve_no_new_tables_limit`；
4. `schema_retrieve_budget`：当 `schema_retrieve_calls` 达到 `schema_retrieve_max_calls`；
5. `schema_retrieve_failures`：当 `schema_retrieve_failures` 达到 `schema_retrieve_max_failures`；
6. `repeated_schema_query`：当重复查询 streak 达到 `schema_retrieve_same_query_limit`。

一旦锁定，状态在整个会话内保持锁定。

### `should_inject_recap(...)`

`should_inject_recap(...)` 只有在请求带有 `request_id` 时才会运行。
它会对同一个 request id 只触发一次，并在以下任一条件成立时返回 true：

- 会话已经锁定；
- schema retrieval 循环已经达到由 `max_tool_iterations`、`recap_trigger_ratio` 和 `recap_min_tool_iterations` 推导出的 recap 阈值；
- schema retrieval 的调用数已经达到 manager 使用的上限阈值。

### `should_hide_schema_tool(...)`

`should_hide_schema_tool(...)` 只有在会话锁定后才会返回 true。
middleware 和 agent 的 turn-prep path 会用这个信号把 `schema_retrieve` 从可见工具列表里移除。

### `build_request_metadata(...)`

`build_request_metadata(...)` 会在会话还没有任何 schema retrieval 调用或缓存 summary 之前返回 `{}`。
否则它会返回：

- `schema_governance`
  - `conversation_id`
  - `schema_retrieve_calls`
  - `schema_retrieve_successes`
  - `schema_retrieve_failures`
  - `consecutive_same_query_calls`
  - `consecutive_no_new_tables`
  - `consecutive_empty_results`
  - `schema_locked`
  - `lock_reason`
  - `last_schema_query`
- `last_schema_summary`

当锁定原因是 `schema_retrieve_empty_results` 时，snapshot 还会额外包含：

- 顶层 `allow_metadata_query: true`
- `schema_governance.allow_metadata_query: true`

### `build_prompt_block(...)`

`build_prompt_block(...)` 负责渲染请求时的治理 prompt block。
当 `schema_locked` 为 true 时，它会使用 locked prompt；否则使用
`policy.system_prompt_block`。
然后它会附上最新的 schema summary；如果会话已经锁定但没有 summary，
则会附上 lock reason。

对于 empty-results 锁定，它还会附上特殊说明：这一轮仍然允许只读的
metadata discovery。

## 请求时流程

运行时在两个地方使用这个 manager：

- `Agent._prepare_turn_prompt()` 会把 snapshot 合并到 turn metadata，锁定时隐藏 `schema_retrieve`，并在最终 system prompt 生成前追加治理块。
- `SchemaGovernanceMiddleware.before_llm_request()` 会再次合并 metadata，追加治理块，在需要时插入 recap，并在会话锁定时把 `schema_retrieve` 从 `request.tools` 中移除。

middleware 只有在 system prompt 里还没有明确写出 `schema_locked: true` 时，才会额外插入 recap block。

hook 会在每次 `schema_retrieve` 之后更新 `result.metadata`，这样下一轮就能复用最新的 schema 状态。

## ASCII 流程图

下面这张图把 `schema_retrieve` 的 ToolResult、Schema 治理状态更新、请求时 snapshot、
prompt 组装和工具过滤串起来。事实源来自 `src/my_agent.py`、
`src/QueryMind/core/agent/governance.py`、`src/QueryMind/core/middleware/schema_governance.py`、
`src/QueryMind/core/enhancer/schema_governance.py`，以及 `eval-sql_126` 的真实日志。

```text
+====================================================================================================+
| 0) schema_retrieve.execute()                                                                      |
|----------------------------------------------------------------------------------------------------|
| 输入：ToolCall.arguments = {query, search_mode, limit, similarity_threshold, graph_hint, ...}     |
| 真实调用（eval-sql_126）：                                                                         |
|   #1 query="employees with SalariedFlag and BusinessEntityID" search_mode="hybrid"               |
|   #2 query="employee table with SalariedFlag and BusinessEntityID" search_mode="vector"          |
|   #3 query="HumanResources Employee" search_mode="hybrid"                                         |
| 输出：ToolResult.metadata -> total_results / selected_tables / summary_text                        |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 1) SchemaGovernanceHook.observe_schema_result()                                                    |
|----------------------------------------------------------------------------------------------------|
| 输入：ToolResult.metadata + success                                                                 |
| 逻辑：                                                                                             |
|   - 归一化 selected_tables、query 和 table refs                                                     |
|   - 维护 calls / successes / failures / empty / no_new / same_query streaks                       |
|   - 生成 last_schema_summary                                                                      |
| eval-sql_126 快照：                                                                                |
|   after #1 -> calls=1 successes=1 failures=0 locked=False                                         |
|   after #2 -> calls=2 successes=1 failures=1 locked=False                                         |
|   after #3 -> calls=3 successes=2 failures=1 locked=True lock_reason=enough_schema                |
| 输出：写回 result.metadata.schema_governance + last_schema_summary                                  |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 2) SchemaGovernanceManager                                                                          |
|----------------------------------------------------------------------------------------------------|
| 输入：conversation_id + 最新 state                                                                  |
| 逻辑：                                                                                             |
|   - build_request_metadata() 产出紧凑 snapshot                                                     |
|   - build_prompt_block() 根据 lock_reason 选择 unlocked / locked prompt                            |
|   - should_hide_schema_tool() 决定下一轮是否隐藏 `schema_retrieve`                                |
| 真实 snapshot（eval-sql_126）：                                                                    |
|   schema_governance.schema_retrieve_calls=3                                                       |
|   schema_governance.schema_retrieve_successes=2                                                   |
|   schema_governance.schema_retrieve_failures=1                                                    |
|   schema_governance.schema_locked=true                                                            |
|   schema_governance.lock_reason=enough_schema                                                     |
|   last_schema_summary.summary_text =                                                               |
|     "schema_retrieve[hybrid] query='HumanResources Employee' -> 10 table(s): ... (+6) | new=8 | lock=enough_schema" |
| prompt 片段：                                                                                       |
|   "## Schema Governance"                                                                           |
|   "- schema_locked: true"                                                                          |
|   "- `schema_retrieve` is locked for this turn."                                                  |
|   "- Enter SQL draft mode now."                                                                    |
|   "- Call `run_sql` instead of exploring more schema."                                            |
| 输出：request.metadata + 请求时治理块                                                                |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 3) Agent._prepare_turn_prompt() + SchemaGovernanceEnhancer                                         |
|----------------------------------------------------------------------------------------------------|
| 输入：user_message + tool_schemas + request.metadata + system_prompt                               |
| 逻辑：                                                                                             |
|   - 先把 snapshot 合并进 turn metadata                                                              |
|   - 再把治理块拼进 system prompt                                                                   |
|   - `SchemaGovernanceEnhancer` 只追加 `policy.system_prompt_block`，不改状态                       |
|   - 当 `## Schema Governance` 已存在时，enhancer 直接返回                                          |
| 结果：最终 system prompt 带着 `schema_locked: true` / `false` 的提示                               |
| 示例：锁定后 system prompt 继续强调“进入 SQL draft mode”                                           |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 4) SchemaGovernanceMiddleware.before_llm_request()                                                 |
|----------------------------------------------------------------------------------------------------|
| 输入：request.metadata + request.tools + request.system_prompt                                      |
| 逻辑：                                                                                             |
|   - 再次合并 snapshot                                                                                |
|   - 必要时追加 recap block                                                                         |
|   - `should_hide_schema_tool()` 为 true 时移除 `schema_retrieve`                                   |
|   - empty-results 锁定时才允许 metadata discovery 例外                                             |
| eval-sql_126 结果：                                                                                |
|   - 下一轮只保留 `run_sql`                                                                         |
|   - `schema_retrieve` 不再暴露给 LLM                                                              |
| 输出：最终 request.system_prompt + request.tools + request.metadata                                |
+====================================================================================================+
```

## 锁定原因

锁定原因包括：

- `enough_schema`
- `schema_retrieve_empty_results`
- `schema_retrieve_no_new_tables`
- `schema_retrieve_budget`
- `schema_retrieve_failures`
- `repeated_schema_query`

这些原因不只是标签。它们还会影响 prompt 文本、recap 行为，以及 empty-results 场景下的 metadata discovery 例外。

## 本页覆盖什么

- schema 探索状态；
- 锁定启发式；
- request snapshot 字段；
- hook 和 middleware 集成；
- 工具隐藏行为；
- recap 插入。

## 本页不覆盖什么

- SQL 形状分析；
- SQL freeze 行为；
- schema retrieval 的 search-mode 规则；
- schema 结果上下文组装。

这些内容分别放到 SQL governance、prompt-chain 和 context 页面里。

## 源码文件

- [`src/QueryMind/core/agent/governance.py`](../../../src/QueryMind/core/agent/governance.py)
- [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py)
- [`src/QueryMind/core/enhancer/schema_governance.py`](../../../src/QueryMind/core/enhancer/schema_governance.py)
- [`src/QueryMind/core/hook/schema_governance.py`](../../../src/QueryMind/core/hook/schema_governance.py)
- [`src/QueryMind/core/middleware/schema_governance.py`](../../../src/QueryMind/core/middleware/schema_governance.py)
