# Agent Loop

本页用一次通过评测的真实样本 `sql_126`，展示 QueryMind 如何把一次 query 从用户消息推进到最终 SQL 和答案。

这条轨迹来自 `evaluation_report.json`：

- `conversation_id`: `eval-sql_126`
- `tool_calls`: `schema_retrieve` x 3, `run_sql` x 3
- `conversation_message_count`: `14`
- `component_count`: `48`
- `execution_time_ms`: `21185.04`
- 评测结果：`sql_accuracy = 0.90`，`expected_outcome = PASS`

这里的 SQL 形状在排序细节上并不完全等于 ground truth，但两个 evaluator 都通过，所以它很适合拿来做一次“成功 query”的闭环样本。

## 示例查询

| 项目 | 值 |
|---|---|
| `test_case_id` | `sql_126` |
| `query` | 按 `SalariedFlag` 对 `BusinessEntityID` 排序：`true` 组降序，`false` 组升序 |
| `trace_source` | [`evaluation_report.json`](../../../src/evals/eval_results/20260428_085122_0315d6e9_deepseek_v4_flash/evaluation_report.json) |
| `tool_count` | `6` |
| `run_sql_call_count` | `3` |
| `conversation_message_count` | `14` |
| `component_count` | `48` |
| `final_status` | `PASS` |

## ASCII 框图

下面的 ASCII 框图把 `sql_126` 的真实轨迹直接嵌进每个模块框里。
每个框都说明三件事：

- 输入了什么数据
- 这个模块怎么处理
- 写回了什么状态

```text
+====================================================================================================+
| 1) 用户消息 / RequestContext                                                                       |
|----------------------------------------------------------------------------------------------------|
| 输入: query                                                                                        |
|   "write a query in SQL to sort the BusinessEntityID in descending order                          |
|    for those employees that have the SalariedFlag set to 'true' and                               |
|    in ascending order that have the SalariedFlag set to 'false'.                                  |
|    Return BusinessEntityID, and SalariedFlag."                                                     |
| 状态: request_context.metadata = {}                                                                |
| 输出: 进入一次正常 query turn                                                                       |
+============================================+=======================================================+
                                                |
                                                v
+====================================================================================================+
| 2) 用户解析器 + ConversationStore                                                                  |
|----------------------------------------------------------------------------------------------------|
| resolve_user() -> user.id=admin, username=Xihong, groups=[admin, user]                             |
| get_conversation("eval-sql_126") -> 加载或创建 conversation                                        |
| 动作: 将用户消息追加到 conversation history                                                         |
| 输出: conversation 已准备好进入 agent loop                                                         |
+============================================+=======================================================+
                                                |
                                                v
+====================================================================================================+
| 3) workflow_handler.try_handle()                                                                   |
|----------------------------------------------------------------------------------------------------|
| 输入: conversation + user message                                                                  |
| 规则: 普通 SQL query -> DefaultWorkflowHandler 不接管                                              |
| 效果: 不短路、不走 starter UI、不走命令路由                                                        |
| 输出: 继续进入正常 LLM / tool loop                                                                  |
+============================================+=======================================================+
                                                |
                                                v
+====================================================================================================+
| 4) 上下文组装                                                                                      |
|----------------------------------------------------------------------------------------------------|
| ToolContextEnricher: SchemaRetrieveContextEnricher                                                 |
| - 读取 FileSystemConversationStore 中最近的 conversation history                                   |
| - 恢复最近的 schema snapshot（如果存在）                                                           |
| - 生成 seed_tables / graph_hint / required_fields                                                  |
| Prompt 链: SystemPromptBuilder + DefaultLlmContextEnhancer + ConversationFilter                    |
| - 构建稳定 system prompt 和消息侧 advisory messages                                                |
| - 组装 LlmRequest.messages                                                                         |
| 输出: request.metadata 携带 schema_governance / sql_governance snapshots                          |
+============================================+=======================================================+
                                                |
                                                v
+====================================================================================================+
| 5) LLM 规划器 / 中间件                                                                             |
|----------------------------------------------------------------------------------------------------|
| 输入: system_prompt + visible tool schemas + conversation messages + request metadata              |
| middleware.before_llm_request(): 在尾部追加 runtime notice 和 snapshot metadata                    |
| 轨迹结果: 首轮 LLM 输出 tool_calls = schema_retrieve x3                                             |
| 循环规则: tool_calls -> 执行工具 -> 追加 tool messages -> 重建 request -> 下一轮 LLM               |
+============================================+=======================================================+
                                                |
                                                v
+====================================================================================================+
| 6) schema_retrieve 执行器                                                                          |
|----------------------------------------------------------------------------------------------------|
| +--------------------------------------------------------------------------------------------------+ |
| | #1 query="employees with SalariedFlag and BusinessEntityID"   search_mode=hybrid                | |
| |    逻辑: 先放宽检索范围，找到 employee 相关表                                                     | |
| +--------------------------------------------------------------------------------------------------+ |
| +--------------------------------------------------------------------------------------------------+ |
| | #2 query="employee table with SalariedFlag and BusinessEntityID" search_mode=vector             | |
| |    逻辑: 在第一轮基础上收紧语义检索                                                               | |
| +--------------------------------------------------------------------------------------------------+ |
| +--------------------------------------------------------------------------------------------------+ |
| | #3 query="HumanResources Employee"                      search_mode=hybrid                       | |
| |    逻辑: 锁定目标表                                                                               | |
| +--------------------------------------------------------------------------------------------------+ |
| after_tool: SchemaGovernanceHook 写回 last_schema_summary + schema_retrieve_context                |
| 输出: selected_tables=["humanresources.employee"]                                                  |
+============================================+=======================================================+
                                                |
                                                v
+====================================================================================================+
| 7) run_sql 执行器                                                                                  |
|----------------------------------------------------------------------------------------------------|
| +--------------------------------------------------------------------------------------------------+ |
| | #4 SELECT table_schema, table_name                                                               | |
| |    FROM information_schema.tables                                                                | |
| |    WHERE table_name LIKE '%employee%'                                                            | |
| |    ORDER BY table_schema, table_name;                                                            | |
| +--------------------------------------------------------------------------------------------------+ |
| +--------------------------------------------------------------------------------------------------+ |
| | #5 SELECT column_name, data_type                                                                 | |
| |    FROM information_schema.columns                                                               | |
| |    WHERE table_schema = 'humanresources'                                                         | |
| |      AND table_name = 'employee'                                                                 | |
| |    ORDER BY ordinal_position;                                                                    | |
| +--------------------------------------------------------------------------------------------------+ |
| +--------------------------------------------------------------------------------------------------+ |
| | #6 SELECT BusinessEntityID, SalariedFlag                                                         | |
| |    FROM humanresources.employee                                                                  | |
| |    ORDER BY CASE WHEN SalariedFlag = true THEN 0 ELSE 1 END,                                     | |
| |             CASE WHEN SalariedFlag = true THEN BusinessEntityID END DESC,                        | |
| |             CASE WHEN SalariedFlag = false THEN BusinessEntityID END ASC;                        | |
| +--------------------------------------------------------------------------------------------------+ |
| 逻辑: 验证表 -> 验证列 -> 执行最终 SQL                                                               |
| 输出: row_count=290, columns=[businessentityid, salariedflag]                                      |
| after_tool: SqlGovernanceHook 写回 last_sql_summary + last_sql_shape                               |
+============================================+=======================================================+
                                                |
                                                v
+====================================================================================================+
| 8) 最终收尾 / 持久化                                                                               |
|----------------------------------------------------------------------------------------------------|
| 最终回答: "The query executed successfully. Here's a summary of the results:"                     |
| save conversation -> after_message hooks -> auto-save                                              |
| 轨迹摘要: tool_count=6, run_sql_call_count=3, conversation_message_count=14                        |
+====================================================================================================+
```

这不是抽象的一次 query loop，而是 `sql_126` 的真实 turn：

- 3 次 `schema_retrieve` 先把候选表收窄到 `HumanResources.Employee`
- 2 次 `run_sql` 先验证表和字段，再进入最终 SQL
- 最后 1 次 `run_sql` 产出 290 行结果并通过评测

如果只看这条轨迹，`tool_count = 6` 就是从“探索”到“验证”再到“落 SQL”的完整闭环。

## 模块如何接力

- `SchemaGovernanceHook.after_tool(...)` 观察每次 `schema_retrieve` 的结果，并把刷新后的 schema snapshot 写回 `result.metadata`。
- `SchemaGovernanceMiddleware.before_llm_request(...)` 把 `schema_governance`、`last_schema_summary` 和 recap 逻辑合并进下一轮 request，然后把动态内容留给消息侧 notice。
- `_build_live_schema_snapshot()` 把同一轮的 `schema_retrieve` 结果整理成 `last_schema_summary` 和 `schema_retrieve_context`，让下一轮可以继承 seed tables、`graph_hint` 和 `required_fields`。
- `SchemaRetrieveContextEnricher` 从 `FileSystemConversationStore` 读取最近的会话历史，优先复用最新 schema snapshot，再回退到历史消息。
- `SqlGovernanceHook.after_tool(...)` 记录每次 `run_sql` 的执行结果，并写回 `sql_governance`、`last_sql_summary` 和 `last_sql_shape`。
- `SqlGovernanceMiddleware.before_llm_request(...)` 复用或推断 SQL profile，把 SQL runtime notice 追加到尾部，并在需要时插入 recap。
- `_build_live_sql_snapshot()` 把 `run_sql` 的结果整理成同轮 snapshot，帮助下一轮继续沿着已经验证过的 SQL 形状推进。
- `ConversationStore` 负责把 `user / assistant / tool` 消息持久化下来，供后续 turn、replay 和 evaluation 读取。

## 运行时装配

`my_agent.py` 里的关键装配如下：

- `workflow_handler=CompositeWorkflowHandler([...])`
- `context_enrichers=[SchemaRetrieveContextEnricher(...)]`
- `llm_context_enhancer=CompositeLlmContextEnhancer([DefaultLlmContextEnhancer(...)])`
- `hooks=[schema_governance.hook, sql_governance.hook]`
- `llm_middlewares=[schema_governance.middleware, sql_governance.middleware]`
- `conversation_store=FileSystemConversationStore()`
- `tool_registry=RLSToolRegistry(...)`
- `schema_memory=Neo4jMem0SchemaMemory(...)`
- `agent_memory=Mem0AgentMemory(...)`
- `observability_provider=PrometheusObservabilityProvider()`
- `audit_logger=PostgresAuditLogger(...)`

这一层不是“业务逻辑”，但它决定了 query loop 的每一段数据往哪里写、下一轮从哪里读。

## 覆盖范围

- 一次正常 query 的完整 turn loop；
- request 组装、tool loop、finalize 的边界；
- 一次真实评测样本 `sql_126` 的工具轨迹；
- schema / SQL governance 如何把结果写回下一轮。

## 不覆盖内容

- `schema-governance.md` 里的锁定阈值、recap 细节和状态机规则；
- `sql-governance.md` 里的 SQL 画像、anchor、freeze 和 repair 细节；
- `workflow.md` 里的命令型短路路由；
- `security.md` 里的认证、授权和 RLS 策略。

这些内容都有各自的专页。

## 相关源码文件

- [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py) - 主 loop、request assembly、tool loop 和 finalize
- [`src/my_agent.py`](../../../src/my_agent.py) - 运行时装配入口
- [`src/QueryMind/core/tool/models.py`](../../../src/QueryMind/core/tool/models.py) - `ToolContext` / `ToolResult` / `ToolSchema`
- [`src/QueryMind/core/user/request_context.py`](../../../src/QueryMind/core/user/request_context.py) - `RequestContext`
- [`src/QueryMind/core/enricher/schema_retrieve.py`](../../../src/QueryMind/core/enricher/schema_retrieve.py) - schema retrieve 上下文注入
- [`src/QueryMind/core/enhancer/schema_governance.py`](../../../src/QueryMind/core/enhancer/schema_governance.py) - schema governance prompt 增强
- [`src/QueryMind/core/enhancer/default.py`](../../../src/QueryMind/core/enhancer/default.py) - 默认 memory 增强
- [`src/QueryMind/core/middleware/schema_governance.py`](../../../src/QueryMind/core/middleware/schema_governance.py) - schema governance request shaping
- [`src/QueryMind/core/middleware/sql_governance.py`](../../../src/QueryMind/core/middleware/sql_governance.py) - SQL governance request shaping
- [`src/QueryMind/core/hook/schema_governance.py`](../../../src/QueryMind/core/hook/schema_governance.py) - schema tool result 回写
- [`src/QueryMind/core/hook/sql_governance.py`](../../../src/QueryMind/core/hook/sql_governance.py) - SQL tool result 回写
- [`src/evals/eval_results/20260428_085122_0315d6e9_deepseek_v4_flash/evaluation_report.json`](../../../src/evals/eval_results/20260428_085122_0315d6e9_deepseek_v4_flash/evaluation_report.json) - `sql_126` 评测轨迹
