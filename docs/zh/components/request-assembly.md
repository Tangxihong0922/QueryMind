# 请求组装

这一页把 [`context.md`](./context.md) 里的简版边界图展开成一次完整 turn。
它只跟踪从 `ToolContext` 到 `LlmRequest` 的路径；会话回放和持久化见
[`conversation.md`](./conversation.md)，prompt 正文细节见
[`prompt-chain.md`](./prompt-chain.md)。

## 运行时装配

事实源来自 [`src/my_agent.py`](../../../src/my_agent.py) 和
[`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py)，
再加上评测产物里捕获到的 `sql_126` 轨迹。

- `enhancer = CompositeLlmContextEnhancer([DefaultLlmContextEnhancer(agent_mem)])`
- `enricher = [SchemaRetrieveContextEnricher(conversation_store=FileSystemConversationStore())]`
- `llm_middlewares = [schema_governance.middleware, sql_governance.middleware]`
- `my_agent.py` 没有显式传入 `conversation_filters`，所以当前运行里这一段是 identity
- `AgentConfig` 只覆盖了 `max_tool_iterations` 和 `schema_search_default_threshold`；`temperature`、`max_tokens`、`stream_responses` 仍然走默认值

`SchemaContextEnhancer` 和 `SchemaGovernanceEnhancer` 仍然保留为可复用 helper，但默认运行时里已经不再把它们接到 enhancer 链上。

## ASCII 图

下面这张图跟踪一次 turn 从 `ToolContext` 构建到最终 `LlmRequest`。
`sql_126` 是真实锚点，但装配顺序对所有正常 query turn 都一样。

```text
+====================================================================================================+
| 1) 构建 ToolContext                                                                                |
|----------------------------------------------------------------------------------------------------|
| input: user, conversation_id, request_id, raw_user_message, agent_memory,                          |
|        schema_memory, schema_management_service, observability_provider,                           |
|        request_context.metadata                                                                    |
| seed metadata: ui_features_available, tool_memory_session_isolated                                  |
| config fields: schema_search_default_limit=10,                                                     |
|                schema_search_default_threshold=0.4, schema_search_default_mode="hybrid"            |
| my_agent wiring: conversation_store=FileSystemConversationStore()                                  |
| output: ToolContext(user, conversation_id, request_id, metadata=...)                               |
+============================================+=======================================================+
                                                |
                                                v
+====================================================================================================+
| 2) ToolContextEnricher 链                                                                          |
|----------------------------------------------------------------------------------------------------|
| SchemaRetrieveContextEnricher.enrich_context(context)                                              |
| - 优先使用 context.metadata 里已经存在的 turn-local schema snapshot                                |
| - 否则读取 FileSystemConversationStore.get_recent(..., limit=10)                                   |
| - 抽取最新的 schema 结果，并把 `last_schema_summary` 以及                                       |
|   `seed_tables`、`graph_hint`、`required_fields`、`schema_locked`、`lock_reason` 写回             |
| 输出: context.metadata.last_schema_summary / schema_retrieve_context                               |
| sql_126 提示: 第一轮通常还是空的；后续 turn 会复用 hooks 写回的 snapshot                             |
+============================================+=======================================================+
                                                |
                                                v
+====================================================================================================+
| 3) ToolRegistry.get_schemas(user)                                                                  |
|----------------------------------------------------------------------------------------------------|
| my_agent wiring: RLSToolRegistry + register_local_tool(...)                                         |
| 已注册的本地工具: run_sql, schema_retrieve, memory 工具, python 工具, file 工具, visualize_data 工具    |
| 逻辑: 只返回当前解析出的用户能看到的工具 schema                                                     |
| 输出: tool_schemas[]                                                                               |
+============================================+=======================================================+
                                                |
                                                v
+====================================================================================================+
| 4) _prepare_turn_prompt()                                                                          |
|----------------------------------------------------------------------------------------------------|
| 逻辑:                                                                                             |
|   - 把 schema_governance snapshot 合并进 request_metadata                                          |
|   - 如果治理状态已经锁定，就把 `schema_retrieve` 从可见工具里隐藏                                 |
|   - 生成基础 system prompt                                                                        |
|   - 保持 system prompt 稳定、可缓存                                                                |
|   - 调用 `CompositeLlmContextEnhancer.enhance_system_prompt()`                                    |
| 真实 prompt 片段:                                                                                  |
|   "You are QueryMind, an AI data analyst assistant..."                                             |
|   "Response Guidelines:"                                                                            |
|   "- If a SQL query was executed successfully, append the executed SQL..."                          |
|   "- Use `schema_retrieve` only for schema discovery..."                                            |
|   "Runtime context notices are authoritative..."                                                    |
| 输出: visible_tool_schemas + 稳定 system_prompt + merged_metadata                                   |
+============================================+=======================================================+
                                                |
                                                v
+====================================================================================================+
| 5) ConversationFilter 链 + _build_llm_request()                                                    |
|----------------------------------------------------------------------------------------------------|
| my_agent wiring: 当前没有自定义 `conversation_filters`，所以这一段实际是透传                         |
| 逻辑:                                                                                             |
|   - 按顺序处理 conversation.messages                                                              |
|   - 把每条消息转成 `LlmMessage(role/content/tool_calls/tool_call_id/metadata/tool_result)`        |
|   - 把 `request_metadata` 合并到每条 `message.metadata`                                            |
|   - 最后调用 `LlmContextEnhancer.enhance_user_messages()`                                         |
| turn 起始时的 request_metadata:                                                                    |
|   conversation_id=eval-sql_126, tool_iterations=0, max_tool_iterations=25                         |
| 输出: LlmRequest(messages, tools, user, system_prompt, metadata)                                   |
+============================================+=======================================================+
                                                |
                                                v
+====================================================================================================+
| 6) SchemaGovernanceMiddleware + SqlGovernanceMiddleware                                             |
|----------------------------------------------------------------------------------------------------|
| 顺序: `SchemaGovernanceMiddleware` -> `SqlGovernanceMiddleware`                                    |
| 逻辑:                                                                                             |
|   - 从运行时 snapshot 重新补齐 request.metadata                                                     |
|   - 准备 request-time runtime notice，而不是继续追加治理块                                          |
|   - 根据 user message 或 metadata 推断 / 复用 SQL profile                                          |
|   - 当 schema 锁定后，从 `request.tools` 里移除 `schema_retrieve`                                   |
|   - 在 turn 变长或漂移时插入 recap                                                                 |
| request-time snapshot 字段:                                                                        |
|   schema_governance / last_schema_summary / allow_metadata_query                                   |
|   sql_governance / runtime_profile / last_sql_summary                                              |
| 输出: 最终 request.system_prompt + 最终 request.tools + 最终 request.metadata                     |
+============================================+=======================================================+
                                                |
                                                v
+====================================================================================================+
| 7) Final LlmRequest                                                                                |
|----------------------------------------------------------------------------------------------------|
| 输入: messages + tools + system_prompt + metadata                                                  |
| sql_126 路径:                                                                                     |
|   - 第一轮使用上面的 prompt stack                                                                  |
|   - 后续 turn 会继承上一次工具结果写回的 schema/sql snapshot                                        |
| request 字段:                                                                                      |
|   messages = 合并了 metadata 的 conversation history                                                |
|   tools = 治理后仍然可见的 tool schemas                                                             |
|   system_prompt = 基础 prompt + 很短的稳定尾部                                                      |
|   metadata = turn 计数 + 治理快照                                                                  |
|   temperature=0.7, max_tokens=None, stream=True                                                   |
| 输出: 传给 `llm_service.send_request(request)` 的最终对象                                           |
+====================================================================================================+
```

## sql_126 锚点

用于这页的真实 `sql_126` query 是：

```text
write a query in SQL to sort the BusinessEntityID in descending order for those
employees that have the SalariedFlag set to 'true' and in ascending order that
have the SalariedFlag set to 'false'. Return BusinessEntityID, and SalariedFlag.
```

这一次 turn 里，request assembly 看到的值是：

- `conversation_id=eval-sql_126`
- `request_metadata.tool_iterations=0`
- `request_metadata.max_tool_iterations=25`
- `ToolContext.metadata.ui_features_available` 由解析出的用户组决定
- `ToolContext.metadata.tool_memory_session_isolated` 从 `request_context.metadata` 复制
- `ToolContext.schema_search_default_threshold=0.4`

这一 turn 的 prompt 栈是：

- `DefaultSystemPromptBuilder` 生成的基础 system prompt
- `DefaultLlmContextEnhancer` 在 `AgentMemory` 命中时追加的 memory advisory message
- 可选的 `SchemaContextEnhancer` 消息侧 schema context
- `SchemaGovernanceMiddleware` / `SqlGovernanceMiddleware` 在下一轮里追加的 runtime notices

工具开始执行之后，下一轮就可以复用治理 hooks 写回的 snapshot：

- `schema_governance.hook` 写回 `last_schema_summary` 和 `schema_retrieve_context`
- `sql_governance.hook` 写回 `last_sql_summary`、`runtime_profile` 和 SQL 形状状态

这也是为什么下一次 `before_llm_request()` 会变得更收敛、更容易锁定工具可见性和 recap 文案。

## 关键边界

- `ToolContext.metadata` 是工具执行态的状态。
- `request.metadata` 是给 LLM 调用和 middleware 形状调整用的状态。
- `SchemaRetrieveContextEnricher` 写的是工具侧 schema 状态，不是 prompt 文案。
- `SchemaGovernanceMiddleware` 和 `SqlGovernanceMiddleware` 是 LLM 调用前最后两道 request-time 变换。

## 相关源码文件

- [`src/my_agent.py`](../../../src/my_agent.py) - runtime enhancer / middleware wiring
- [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py) - `_prepare_turn_prompt()` / `_build_llm_request()` / `_send_llm_request()`
- [`src/QueryMind/core/tool/models.py`](../../../src/QueryMind/core/tool/models.py) - `ToolContext` / `ToolResult` / `ToolSchema`
- [`src/QueryMind/core/enricher/schema_retrieve.py`](../../../src/QueryMind/core/enricher/schema_retrieve.py) - `SchemaRetrieveContextEnricher`
- [`src/QueryMind/core/enhancer/composite.py`](../../../src/QueryMind/core/enhancer/composite.py) - `CompositeLlmContextEnhancer`
- [`src/QueryMind/core/enhancer/schema_retrieve.py`](../../../src/QueryMind/core/enhancer/schema_retrieve.py) - `SchemaContextEnhancer`
- [`src/QueryMind/core/enhancer/default.py`](../../../src/QueryMind/core/enhancer/default.py) - `DefaultLlmContextEnhancer`
- [`src/QueryMind/core/middleware/schema_governance.py`](../../../src/QueryMind/core/middleware/schema_governance.py) - schema governance request shaping
- [`src/QueryMind/core/middleware/sql_governance.py`](../../../src/QueryMind/core/middleware/sql_governance.py) - SQL governance request shaping
- [`src/QueryMind/core/system_prompt/default.py`](../../../src/QueryMind/core/system_prompt/default.py) - default system prompt builder
- [`src/QueryMind/core/llm/models.py`](../../../src/QueryMind/core/llm/models.py) - `LlmRequest` / `LlmMessage`
- [`src/QueryMind/core/filter/base.py`](../../../src/QueryMind/core/filter/base.py) - `ConversationFilter`
- [`src/QueryMind/core/user/request_context.py`](../../../src/QueryMind/core/user/request_context.py) - `RequestContext`
