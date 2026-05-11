# 提示链

提示链只覆盖 prompt 侧的组装路径。
`conversation` 的读取、过滤和 `LlmRequest.messages` 构建放在 [`context.md`](./context.md)。

## 实际装配顺序

事实源来自 [`src/my_agent.py`](../../../src/my_agent.py) 和 [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py)。
运行时顺序是：

- `enhancer = CompositeLlmContextEnhancer([DefaultLlmContextEnhancer(agent_mem)])`
- `llm_middlewares = [schema_governance.middleware, sql_governance.middleware]`
- `Agent._prepare_turn_prompt()` 先构建稳定 system prompt，再在 `before_llm_request()` 里做消息侧 runtime notice 注入

`SchemaContextEnhancer` 和 `SchemaGovernanceEnhancer` 仍然保留为可复用 helper，但默认运行时里已经不再把它们接到 enhancer 链上。

```text
+====================================================================================================+
| 1) Agent._prepare_turn_prompt()                                                                    |
|----------------------------------------------------------------------------------------------------|
| 输入：user_message + tool_schemas + request_metadata                                               |
| 逻辑：                                                                                             |
|   - 将 schema-governance 快照合并进 metadata                                                       |
|   - 当治理层要求时隐藏 `schema_retrieve`                                                           |
|   - 调用 DefaultSystemPromptBuilder                                                                 |
|   - 执行 llm_context_enhancer.enhance_system_prompt()                                              |
|   - 保持 system prompt 稳定、可缓存                                                                |
| 输出：visible_tool_schemas + 稳定 system_prompt + merged_metadata                                   |
| 示例（sql_126）：user query = "write a query in SQL to sort the BusinessEntityID ..."             |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 2) DefaultSystemPromptBuilder（基础 system prompt 生成器）                                         |
|----------------------------------------------------------------------------------------------------|
| 输入：user + visible_tool_schemas                                                                  |
| 逻辑：                                                                                             |
|   - `base_prompt != None` -> 直接返回                                                               |
|   - 否则输出稳定核心规则和很短的稳定尾部                                                            |
| prompt 片段：                                                                                       |
|   "You are QueryMind, an AI data analyst assistant..."                                             |
|   "Response Guidelines:"                                                                           |
|   "- When you execute a query, that raw result is shown to the user ..."                           |
|   "- If a SQL query was executed successfully, append the executed SQL ..."                        |
|   "- Use `schema_retrieve` only for schema discovery..."                                           |
|   "Runtime context notices are authoritative..."                                                    |
| 输出：基础 system prompt                                                                             |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 3) DefaultLlmContextEnhancer                                                                      |
|----------------------------------------------------------------------------------------------------|
| 来源：DefaultLlmContextEnhancer(agent_memory)                                                       |
| 逻辑：                                                                                             |
|   - 从 `user_message` 检索 AgentMemory                                                              |
|   - 预置一条面向用户的 memory advisory message                                                      |
|   - degraded 或失败时原样返回                                                                        |
| prompt 片段：                                                                                       |
|   "## Memory Advisory"                                                                             |
|   "Use these snippets only if they are relevant to the current turn:"                              |
| 输出：消息侧 memory advisory，而不是 system prompt                                                  |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 4) 可选 SchemaContextEnhancer                                                                      |
|----------------------------------------------------------------------------------------------------|
| 顺序：SchemaContextEnhancer() -> DefaultLlmContextEnhancer(agent_mem)                              |
| 逻辑：                                                                                             |
|   - 每个增强器接收上一个增强器的输出                                                                 |
|   - 任一增强器失败都不会中断整条链                                                                   |
|   - SchemaContextEnhancer 以消息侧 user message 的形式注入 schema context                           |
|   - 它不会修改 system prompt                                                                        |
| SchemaContextEnhancer 片段：                                                                       |
|   "## Schema Context"                                                                              |
|   "Search Mode: hybrid"                                                                            |
|   "Tables: ..."                                                                                     |
| 输出：消息侧 schema context，而不是 system prompt                                                  |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 5) SchemaGovernanceMiddleware + SqlGovernanceMiddleware（请求时治理注入）                           |
|----------------------------------------------------------------------------------------------------|
| 顺序：SchemaGovernanceMiddleware -> SqlGovernanceMiddleware                                         |
| 逻辑：                                                                                             |
|   - 根据运行时快照刷新 request.metadata                                                             |
|   - 结合 request.metadata / user message 推断或复用 SQL profile                                      |
|   - 隐藏 `schema_retrieve`（如需要）                                                                |
|   - 预置一条用户侧 runtime notice                                                                   |
|   - 把 schema lock / summary、SQL anchor preview、freeze reason、repair strategy / reason / signals、row grain 和 recap 放进去         |
| SQL governance 片段：                                                                               |
|   "## Runtime Context Notice"                                                                      |
|   "Schema governance:"                                                                             |
|   "- schema_retrieve unavailable this turn: yes/no"                                                 |
|   "SQL governance:"                                                                                |
|   "- repair strategy: local_repair / structural_rewrite"                                           |
| 输出：最终 request.system_prompt + request.tools + request.messages                                 |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 6) Final LlmRequest（最终请求）                                                                    |
|----------------------------------------------------------------------------------------------------|
| 输入：messages + tools + system_prompt + metadata                                                  |
| sql_126 路径：                                                                                     |
|   - 第一轮 LLM -> 3 次 `schema_retrieve` 调用                                                       |
|   - 后续轮次 LLM -> 3 次 `run_sql` 调用                                                             |
| 输出：模型在选工具前看到稳定 system prompt + 消息侧 runtime notice；SQL 侧 notice 会携带 repair strategy / reason / signals |
+====================================================================================================+
```

## sql_126 示例

下面这组值来自一次成功查询的真实日志和评估结果。

```text
user message:
"write a query in SQL to sort the BusinessEntityID in descending order for those employees
that have the SalariedFlag set to 'true' and in ascending order that have the SalariedFlag set
to 'false'. Return BusinessEntityID, and SalariedFlag."

schema_retrieve #1:
query="employees with SalariedFlag and BusinessEntityID"
search_mode="hybrid"

schema_retrieve #2:
query="employee table with SalariedFlag and BusinessEntityID"
search_mode="vector"

schema_retrieve #3:
query="HumanResources Employee"
search_mode="hybrid"

run_sql #1:
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_name LIKE '%employee%'
ORDER BY table_schema, table_name;

run_sql #2:
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'humanresources' AND table_name = 'employee'
ORDER BY ordinal_position;

run_sql #3:
SELECT BusinessEntityID, SalariedFlag
FROM humanresources.employee
ORDER BY
    CASE WHEN SalariedFlag = true THEN 0 ELSE 1 END,
    CASE WHEN SalariedFlag = true THEN BusinessEntityID END DESC,
    CASE WHEN SalariedFlag = false THEN BusinessEntityID END ASC;
```

## 关键边界

- `Agent._prepare_turn_prompt()` 只负责 system prompt 的初始装配。
- `CompositeLlmContextEnhancer` 只做 prompt 增强，不读取 `conversation`。
- `SchemaGovernanceMiddleware` / `SqlGovernanceMiddleware` 只在 `before_llm_request()` 阶段注入请求时治理块。
- `conversation` 的读取 / 过滤 / `LlmRequest.messages` 构建留在 [`context.md`](./context.md)。

## 源码文件

- [`src/my_agent.py`](../../../src/my_agent.py) - runtime enhancer / middleware wiring
- [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py) - `_prepare_turn_prompt()` / `_build_llm_request()`
- [`src/QueryMind/core/system_prompt/default.py`](../../../src/QueryMind/core/system_prompt/default.py) - `DefaultSystemPromptBuilder`
- [`src/QueryMind/core/enhancer/composite.py`](../../../src/QueryMind/core/enhancer/composite.py) - `CompositeLlmContextEnhancer`
- [`src/QueryMind/core/enhancer/default.py`](../../../src/QueryMind/core/enhancer/default.py) - `DefaultLlmContextEnhancer`
- [`src/QueryMind/core/enhancer/schema_retrieve.py`](../../../src/QueryMind/core/enhancer/schema_retrieve.py) - `SchemaContextEnhancer`
- [`src/QueryMind/core/enhancer/schema_governance.py`](../../../src/QueryMind/core/enhancer/schema_governance.py) - `SchemaGovernanceEnhancer`
- [`src/QueryMind/core/agent/governance.py`](../../../src/QueryMind/core/agent/governance.py) - `SchemaGovernanceManager`
- [`src/QueryMind/core/agent/sql_governance_prompt.py`](../../../src/QueryMind/core/agent/sql_governance_prompt.py) - SQL governance prompt text
- [`src/QueryMind/core/middleware/schema_governance.py`](../../../src/QueryMind/core/middleware/schema_governance.py) - schema-governance middleware injection path
- [`src/QueryMind/core/middleware/sql_governance.py`](../../../src/QueryMind/core/middleware/sql_governance.py) - SQL-governance middleware injection path
