# 上下文组装

QueryMind 把上下文拆成两条独立路径：

- 面向 prompt 的上下文，决定模型看到什么
- 面向工具的上下文，决定工具执行时拿到什么

这两条路径解决的是不同问题，应该和 prompt chain 保持分离。

## 两条路径

| 路径 | 契约 | 主要输出 |
|---|---|---|
| Prompt 侧 | `SystemPromptBuilder`、`LlmContextEnhancer` | `system_prompt` 和最终的 `LlmRequest.messages` 列表 |
| Tool 侧 | `ToolContextEnricher` | `ToolContext.metadata` |

Prompt 端的细节见 [`prompt-chain.md`](./prompt-chain.md)。

更完整的单轮组装 walkthrough 见 [`request-assembly.md`](./request-assembly.md)。

## 请求组装顺序

这一页只保留请求组装路径本身。
完整的 `sql_126` Agent Loop 轨迹放在 [`agent-loop.md`](./agent-loop.md)。

```text
+====================================================================================================+
| 1) 构建 ToolContext                                                                                |
|----------------------------------------------------------------------------------------------------|
| 输入: user, conversation_id, request_id, raw_user_message, request_context.metadata               |
| 初始元数据: ui_features_available, tool_memory_session_isolated                                    |
| 输出: ToolContext(user, conversation_id, request_id, metadata=...)                                 |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 2) ToolContextEnricher 链                                                                          |
|----------------------------------------------------------------------------------------------------|
| SchemaRetrieveContextEnricher.enrich_context(context)                                              |
| - 优先复用 turn-local 的 schema snapshot                                                           |
| - 否则读取 conversation history / conversation_store                                               |
| 输出: context.metadata.last_schema_summary / schema_retrieve_context                               |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 3) 获取可见工具 schemas                                                                              |
|----------------------------------------------------------------------------------------------------|
| ToolRegistry.get_schemas(user)                                                                     |
| - 读取当前用户可见的工具 schema                                                                     |
| 输出: tool_schemas[]                                                                               |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 4) _prepare_turn_prompt()                                                                          |
|----------------------------------------------------------------------------------------------------|
| SystemPromptBuilder.build_system_prompt(user, visible_tool_schemas)                                |
| schema 治理可能追加提示块，或隐藏 schema 工具                                                      |
| LlmContextEnhancer.enhance_system_prompt(): 注入记忆中的示例                                      |
| 输出: visible_tool_schemas + system_prompt + prepared_metadata                                     |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 5) ConversationFilter 链 + _build_llm_request()                                                    |
|----------------------------------------------------------------------------------------------------|
| 过滤器按顺序处理 conversation.messages                                                             |
| message -> LlmMessage(role/content/tool_calls/tool_call_id/metadata/tool_result)                   |
| request_metadata 合并到每条 message.metadata                                                        |
| LlmContextEnhancer.enhance_user_messages(): 最终消息增强（默认不修改）                              |
| 输出: LlmRequest(messages, tools, user, system_prompt, metadata)                                   |
+====================================================================================================+
```

关键边界是：
- `ToolContextEnricher` 先写 `ToolContext.metadata`，再去拉可见工具 schemas；它只影响工具执行态，不改 prompt。
- `_prepare_turn_prompt()` 负责 `SystemPromptBuilder` + governance block + `enhance_system_prompt()`，产出当前 turn 的 `system_prompt` 和 `visible_tool_schemas`。
- `ConversationFilter` 先裁剪/重排 conversation history，再把消息包装成 `LlmMessage`。
- `LlmContextEnhancer.enhance_user_messages()` 是最后一道消息侧钩子，随后才生成 `LlmRequest`。

## 工具上下文注入

`ToolContextEnricher` 是组装流水线里最低的一层。
它不改 prompt。
它只把执行时状态写进 `ToolContext.metadata`。

当前代码里已经提供的具体实现是：

- `SchemaRetrieveContextEnricher`

这个 enricher 会：
- 优先使用 `context.metadata` 里已经存在的 turn-local schema snapshot
- 如果没有，再回退到最近的会话历史
- 从会话里读取最新的 schema retrieval 结果
- 把 `last_schema_summary` 和 `schema_retrieve_context` 写进工具上下文

`schema_retrieve_context` 可以包含：
- `seed_tables`
- `seed_table_refs`
- `expand_mode`
- `last_query`
- `last_search_mode`
- `graph_hint`
- `required_fields`
- `domain_filter`
- `summary_text`
- `schema_locked`
- `lock_reason`

这里保存的是执行状态，不是 prompt 策略。这个 enricher 的作用，是让后续的 `schema_retrieve` 调用能够沿着上一轮的结构化结果继续，而不用用自然语言重新拼状态。

## 会话过滤

`ConversationFilter` 会在模型看到消息之前改写会话历史。

filters 在 `Agent._build_llm_request()` 里按顺序执行，所以后面的 filter 会看到前面 filter 的输出。
它们可以：
- 移除敏感文本
- 裁剪过长历史
- 总结旧轮次
- 去重或重排消息

这一层处理的是消息历史本身，不是存储，也不是工具状态。

## 边界

本页只覆盖请求组装边界、tool-context 注入和 conversation filtering。
它不定义 prompt policy、schema governance state、SQL governance state，也不定义最终的 system prompt 文案。

## 相关源码文件

- [`src/QueryMind/core/enricher/base.py`](../../../src/QueryMind/core/enricher/base.py) - `ToolContextEnricher` 接口
- [`src/QueryMind/core/enricher/schema_retrieve.py`](../../../src/QueryMind/core/enricher/schema_retrieve.py) - schema retrieve context enricher
- [`src/QueryMind/core/filter/base.py`](../../../src/QueryMind/core/filter/base.py) - `ConversationFilter` 接口
- [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py) - 上下文注入、过滤和请求组装流程
- [`src/QueryMind/core/agent/governance.py`](../../../src/QueryMind/core/agent/governance.py) - schema 治理管理器
- [`src/QueryMind/core/enhancer/default.py`](../../../src/QueryMind/core/enhancer/default.py) - 默认模型上下文增强器
- [`src/QueryMind/core/llm/models.py`](../../../src/QueryMind/core/llm/models.py) - `LlmRequest` / `LlmMessage`
- [`src/QueryMind/core/registry.py`](../../../src/QueryMind/core/registry.py) - `ToolRegistry.get_schemas`
- [`src/QueryMind/core/tool/models.py`](../../../src/QueryMind/core/tool/models.py) - `ToolContext`
- [`src/QueryMind/core/user/request_context.py`](../../../src/QueryMind/core/user/request_context.py) - `RequestContext`
- [`src/QueryMind/core/system_prompt/default.py`](../../../src/QueryMind/core/system_prompt/default.py) - 默认 system prompt builder
- [`src/QueryMind/core/storage/base.py`](../../../src/QueryMind/core/storage/base.py) - 供 history-aware enricher 使用的会话存储契约
