# 提示链

提示链只覆盖 prompt 侧的组装路径。
`conversation` 的读取、过滤和 `LlmRequest.messages` 构建放在 [`context.md`](./context.md)。

## 实际装配顺序

事实源来自 [`src/my_agent.py`](../../../src/my_agent.py) 和 [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py)。
运行时顺序是：

- `enhancer = CompositeLlmContextEnhancer([schema_governance.enhancer, SchemaContextEnhancer(), DefaultLlmContextEnhancer(agent_mem)])`
- `llm_middlewares = [schema_governance.middleware, sql_governance.middleware]`
- `Agent._prepare_turn_prompt()` 先拼 system prompt，再在 `before_llm_request()` 里做 request-time 注入

```text
+====================================================================================================+
| 1) Agent._prepare_turn_prompt()                                                                    |
|----------------------------------------------------------------------------------------------------|
| 输入：user_message + tool_schemas + request_metadata                                               |
| 逻辑：                                                                                             |
|   - 将 schema-governance 快照合并进 metadata                                                       |
|   - 当治理层要求时隐藏 `schema_retrieve`                                                           |
|   - 渲染治理块                                                                                     |
|   - 调用 DefaultSystemPromptBuilder                                                                 |
|   - 执行 llm_context_enhancer.enhance_system_prompt()                                              |
| 输出：visible_tool_schemas + system_prompt + merged_metadata                                       |
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
|   - 否则输出当天日期、可见工具名和记忆工作流                                                         |
| prompt 片段：                                                                                       |
|   "You are QueryMind, an AI data analyst assistant..."                                             |
|   "Response Guidelines:"                                                                           |
|   "- When you execute a query, that raw result is shown to the user ..."                           |
|   "- If a SQL query was executed successfully, append the executed SQL ..."                        |
|   "You have access to the following tools: ..."                                                     |
|   "MEMORY SYSTEM:" / "1. TOOL USAGE MEMORY..." / "2. TEXT MEMORY..."                               |
| 输出：基础 system prompt                                                                             |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 3) SchemaGovernanceManager + SchemaGovernanceEnhancer（Schema 治理注入）                           |
|----------------------------------------------------------------------------------------------------|
| 来源：SchemaGovernanceManager.build_prompt_block() + manager.policy.system_prompt_block           |
| 逻辑：                                                                                             |
|   - 只注入一次                                                                                      |
|   - discovery 期间 `schema_locked: false`                                                         |
|   - lock 之后 `schema_locked: true`                                                               |
| prompt 片段：                                                                                       |
|   "## Schema Governance"                                                                           |
|   "- Treat `schema_retrieve` as discovery support, not as the final answer."                      |
|   "- Once you have enough schema context, switch to SQL draft mode..."                             |
|   "## Core Objective Reminder"                                                                      |
| 示例（sql_126）：第 3 次 `schema_retrieve` 之后，下一轮进入锁定                                     |
| 输出：引导 discovery / SQL draft 切换的 schema-governance 块                                        |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 4) CompositeLlmContextEnhancer（增强器链）                                                          |
|----------------------------------------------------------------------------------------------------|
| 顺序：SchemaContextEnhancer() -> DefaultLlmContextEnhancer(agent_mem)                              |
| 逻辑：                                                                                             |
|   - 每个增强器接收上一个增强器的输出                                                                 |
|   - 任一增强器失败都不会中断整条链                                                                   |
|   - `schema_locked` 为 true 时，SchemaContextEnhancer 保持 prompt 不变                            |
|   - DefaultLlmContextEnhancer 依据 `user_message` 检索 AgentMemory                                 |
| SchemaContextEnhancer 片段：                                                                       |
|   "## Schema Retrieval Tool - Search Mode Selection Rules"                                         |
|   "hybrid / vector / graph / expand"                                                                |
|   "【Current Retrieved Schema Information】"                                                          |
| DefaultLlmContextEnhancer 片段：                                                                   |
|   "## Relevant Context from Memory"                                                                 |
|   "The following domain knowledge and context from prior interactions may be relevant:"            |
| 输出：包含 schema 规则和 memory 上下文的最终 system prompt                                          |
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
|   - 追加 request-time 治理块                                                                        |
|   - 必要时从 request.tools 中隐藏 `schema_retrieve`                                                |
|   - 必要时追加 recap 块                                                                             |
| SQL governance 片段：                                                                               |
|   "## SQL Governance"                                                                               |
|   "- Avoid metadata introspection queries unless they are explicitly allowed."                      |
|   "- Keep the current row grain stable and call `run_sql` once the table path is clear."            |
| SQL recap 片段：                                                                                   |
|   "## SQL Self-Check Reminder"                                                                      |
| 输出：最终 request.system_prompt + request.tools                                                    |
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
| 输出：模型在选工具前看到完整 prompt 栈                                                              |
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
