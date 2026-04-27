# 会话存储与历史管理


Conversation storage 是 QueryMind 多轮对话的持久化事实来源。它和 `AgentMemory` 不是一回事：前者保存精确的聊天轮次和工具痕迹，后者保存可复用的模式和语义笔记。

## 会话数据模型

`Conversation` 包含 `id`、`user`、`messages`、`created_at`、`updated_at` 和自由形式的 `metadata`。`Message` 包含 `role`、`content`、`timestamp`，以及可选的 `metadata`、`tool_calls`、`tool_result`、`tool_call_id`。

`ConversationStore` 接口故意设计得很小：
- `create_conversation(...)`
- `get_conversation(...)`
- `update_conversation(...)`
- `delete_conversation(...)`
- `list_conversations(...)`

这里的目标不是把所有聊天能力都塞进存储层，而是定义一个最小但稳定的持久化契约，让 demo、本地文件系统后端或其他实现都能在不改 agent 的情况下接入。

## 会话生命周期^

```text
┌──────────────────────────────┐     ┌──────────────────────────────┐
│ Client sends message        │ --> │ ChatHandler creates           │
│ and optional conversation_id│     │ conversation_id/request_id   │
└──────────────────────────────┘     └──────────────┬───────────────┘
                                                    │
                                                    ▼
┌──────────────────────────────┐     ┌──────────────────────────────┐
│ Agent resolves user         │ --> │ Load conversation            │
│ from RequestContext         │     │ or create empty one          │
└──────────────────────────────┘     └──────────────┬───────────────┘
                                                    │
                                                    ▼
┌──────────────────────────────┐     ┌──────────────────────────────┐
│ Add user message            │ --> │ Build LLM request from       │
│ to Conversation             │     │ filtered history             │
└──────────────────────────────┘     └──────────────┬───────────────┘
                                                    │
                                                    ▼
┌──────────────────────────────┐     ┌──────────────────────────────┐
│ LLM returns tools or final  │ --> │ Append assistant/tool        │
│ response                    │     │ messages to history          │
└──────────────────────────────┘     └──────────────┬───────────────┘
                                                    │
                                                    ▼
┌──────────────────────────────┐     ┌──────────────────────────────┐
│ Auto-save enabled?          │ --> │ update_conversation()        │
│ yes -> persist              │     │ keeps raw history            │
└──────────────────────────────┘     └──────────────────────────────┘
```

最重要的设计点是：存储层保存的是原始历史。过滤器和 enrichers 会在后续读取时生成各自的视图。这让会话既方便回放，也方便调试和复用。

## 内存会话存储（Demo）

`MemoryConversationStore` 是最简单的后端。它把 `Dict[str, Conversation]` 保存在进程内存里，按 `user.id` 做读写隔离，并按 `updated_at` 排序会话列表。

它存在的原因：
- 适合本地开发
- 适合单元测试和 demo
- 不需要外部依赖

代价也很明确：
- 进程重启后会丢失
- 不适合长期保存
- 如果你需要基于最近消息做历史增强，它本身还不够

在没有显式注入 store 时，agent 可以默认使用这个后端，这样本地启动很轻便，但接口仍然保留了后续切换到持久化后端的空间。

## 文件系统会话存储^

```text
conversations/
  conv_12345678/
    metadata.json
    messages/
      1700000000000000_000000.json
      1700000001000000_000001.json
```

`FileSystemConversationStore` 会把每个会话落成一个目录。`metadata.json` 保存会话 id、用户信息和时间戳；每条消息则作为独立 JSON 文件保存在 `messages/` 目录下，文件名用时间戳加序号保证顺序。

读写行为如下：
- `create_conversation()` 会写入 metadata 和第一条用户消息
- `update_conversation()` 会重写 metadata，并只追加尚未保存的消息
- `get_conversation()` 会重新加载 metadata 和 messages，再重建 `Conversation`
- `delete_conversation()` 会先验证 ownership，再删除文件
- `list_conversations()` 会遍历目录、按 owner 过滤、按 `updated_at` 排序并分页
- `get_recent()` 会返回最近的 N 条消息，供 history-aware enrichers 使用

这个后端的价值在于：
- 会话可以在应用外直接检查
- 重启后仍然保留
- 追加式消息文件让排查和恢复更方便
- `get_recent()` 让需要短历史窗口的后续行为成为可能

## 常见使用方式

同一个 store 会服务三种不同的读取路径：
- LLM 看到的是过滤后的消息
- 聊天历史 UI 看到的是会话摘要
- context enricher 看到的是最近的结构化事件

所以这里的 store 是事实来源，而不是最终 prompt。

### 为上下文提取会话历史^

```text
┌──────────────────────────────┐
│ ConversationStore            │
│ raw conversation history     │
└──────────────┬───────────────┘
               │
      ┌────────┴────────┐
      ▼                 ▼
┌──────────────┐   ┌──────────────────────┐
│ Conversation │   │ get_recent(limit=10) │
│ filters      │   │ for enrichers        │
└──────┬───────┘   └──────────┬───────────┘
       │                      │
       ▼                      ▼
┌───────────────────┐   ┌──────────────────────────┐
│ LLM request       │   │ SchemaRetrieveContextEnricher
│ filtered messages │   │ injects schema_retrieve_context
└───────────────────┘   └──────────────────────────┘
```

`ConversationFilter` 会在 `Agent._build_llm_request()` 中按顺序执行。它可以裁剪上下文、移除敏感文本，或者在消息太长时做摘要，然后再把结果送给 LLM。

这和 `SchemaRetrieveContextEnricher` 的作用不同：后者会从 store 里读取最近消息，并抽取结构化的工具输出。也就是说：
- filters 决定模型看到什么
- enrichers 决定工具看到什么
- store 本身保持不变

这种拆分是有意为之的。原始历史始终完整保留，而后续读取可以针对不同消费者做不同处理。

### 用户会话列表（聊天历史 UI）

![Chat History UI](../../figures/chat_history_sidebar.png)

FastAPI 的 history 接口直接基于同一个 store 提供 UI：
- `/api/querymind/v1/chat/conversations` 列出当前用户的会话
- `/api/querymind/v1/chat/conversations/{conversation_id}` 返回完整历史
- `DELETE` 删除当前用户的会话

UI 的列表展示被刻意做得很紧凑。它会跳过没有真实用户消息的 starter session，用第一条用户消息作为标题，用最新一条消息作为预览，并按 `updated_at` 排序，让最新会话排在最前面。

这样既保留了历史列表的实用性，也避免在存储里额外维护一份摘要索引。

### 手动保存会话

`AgentConfig` 默认开启了自动保存，但持久化本身仍然是显式的。agent 会在正常轮次结束后、workflow 直接接管的一轮后，以及 starter UI 响应后调用 `update_conversation()`。

这也给自定义集成留了清晰的控制点：
- 先修改内存中的 `Conversation`
- 需要持久化时再调用 `update_conversation(conversation)`

在文件系统后端里，这个保存路径很便宜，因为只会追加新的消息。在内存后端里，则是直接用当前的会话对象替换之前的记录。

## 用例：Schema Retrieve 搜索模式选择*

这是代码里最有意思的历史驱动用例。

一次 schema 搜索结果不只是“一次性答案”，它会成为下一轮的状态：
1. 第一次 `schema_retrieve` 会把 `selected_tables`、`selected_table_refs`、`graph_hint` 等元数据写入工具结果
2. `SchemaRetrieveContextEnricher` 会用 `get_recent(limit=10)` 读取最近一段会话
3. enricher 找到最新的 `schema_retrieve` 结果，并注入 `schema_retrieve_context`
4. 下一次 `schema_retrieve` 就可以切换到 `expand` 模式，从 seed tables 继续往外扩展

```text
Turn 1
┌──────────────────────────────┐
│ "find customer tables"       │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ schema_retrieve result       │
│ selected_tables = [...]      │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ ConversationStore persists   │
│ tool result metadata         │
└──────────────┬───────────────┘

Turn 2
┌──────────────────────────────┐
│ "expand from those"          │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ get_recent() finds last      │
│ schema_retrieve result       │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ seed_tables injected into    │
│ context.metadata             │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ LLM can choose expand mode   │
└──────────────────────────────┘
```

这里的创新点在于：会话历史被用作一个低摩擦的状态总线，而不是单纯的转录文本。系统不会强迫模型用自然语言记住之前选过哪些表，而是直接恢复上一次结构化工具结果，让下一轮在这个状态上继续。

这给 QueryMind 带来几个实际好处：
- 多轮 schema 探索更确定
- 模型可以接着上一次搜索继续，而不用重新推导同样的表
- 存储层保留完整线程用于调试，而 enricher 只抽取当前需要的状态

## 小结

会话存储是轮次之间的桥梁。它保留原始记录，支撑 UI 历史，给 context filters 提供数据，也让结构化的后续行为可以在不压迫 LLM prompt 的前提下自然发生。


<details open>
<summary>相关源码文件</summary>

- [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py) - 在主 Agent Loop 中负责读取、过滤并持久化会话
- [`src/QueryMind/core/agent/config.py`](../../../src/QueryMind/core/agent/config.py) - auto-save 与会话相关的 agent 配置
- [`src/QueryMind/core/user/request_context.py`](../../../src/QueryMind/core/user/request_context.py) - 传给用户解析器的请求元数据
- [`src/QueryMind/core/user/resolver.py`](../../../src/QueryMind/core/user/resolver.py) - chat 入口处使用的用户解析接口
- [`src/QueryMind/core/user/models.py`](../../../src/QueryMind/core/user/models.py) - 用于 ownership 和 scope 的用户身份模型
- [`src/QueryMind/server/base/chat_handler.py`](../../../src/QueryMind/server/base/chat_handler.py) - 框架无关的 chat 入口，负责创建 request context 并流式返回结果
- [`src/QueryMind/server/fastapi/routes.py`](../../../src/QueryMind/server/fastapi/routes.py) - 会话历史 API 与 chat UI 路由
- [`src/QueryMind/core/workflow/base.py`](../../../src/QueryMind/core/workflow/base.py) - starter UI 和确定性处理所用的 workflow handler 接口
- [`src/QueryMind/core/workflow/default.py`](../../../src/QueryMind/core/workflow/default.py) - 默认 starter UI、命令处理和管理员校验
- [`src/QueryMind/core/filter/base.py`](../../../src/QueryMind/core/filter/base.py) - 在 LLM 请求前使用的 conversation filter 接口
- [`src/QueryMind/core/storage/base.py`](../../../src/QueryMind/core/storage/base.py) - 会话存储契约
- [`src/QueryMind/core/storage/models.py`](../../../src/QueryMind/core/storage/models.py) - Conversation 与 Message 数据模型
- [`src/QueryMind/core/enricher/schema_retrieve.py`](../../../src/QueryMind/core/enricher/schema_retrieve.py) - 复用上一轮状态的历史感知 schema 检索
- [`src/QueryMind/integrations/local/storage.py`](../../../src/QueryMind/integrations/local/storage.py) - 内存版会话后端
- [`src/QueryMind/integrations/local/file_system_conversation_store.py`](../../../src/QueryMind/integrations/local/file_system_conversation_store.py) - 持久化的文件系统会话后端

</details>