# QueryMind 手册

QueryMind 是一个面向 SQL 的 LLM Agent 框架，用于构建专注于自然语言转SQL查询的LLM Agent，具备企业级安全性和双记忆系统驱动的 RAG 能力。

它尤其适合多轮分析任务。第一轮可以先找到合适的表，下一轮可以沿着这些表继续扩展；而管理类工作流则可以直接初始化或维护 Schema Memory，而不必全部交给自然语言猜测表连接关系/字段定义等重要业务信息，以提升 Text2SQL的准确率。

---

## 🌟 核心特性

| 特性 | 做什么 | 为什么重要 |
|------|--------|-------------|
| 双记忆系统 | Agent Memory 存工具使用模式和文本知识，Schema Memory 存表结构、字段和关系。 | 把“怎么做”和“数据库长什么样”分开。 |
| 混合式 Schema 检索 | 将 Mem0 向量检索与 Neo4j 图遍历结合，并用 RRF 融合结果。 | 同时提升语义查询和关系查询的召回率。 |
| 多轮 Schema 扩展 | 当历史里存在 seed tables 时，`schema_retrieve` 可以切换到 `expand` 模式。 | 让后续追问沿着上一轮搜索继续，而不是从头来过。 |
| 上下文组装流水线 | System prompt 构建、LLM enhancers、tool enrichers 和 conversation filters 分层处理。 | 让 Prompt 策略、运行时状态和消息历史更容易理解。 |
| 确定性工作流处理 | Slash command 和 starter UI 会在 LLM 之前被拦截。 | 让管理任务、配置检查和 Schema 管理更可预测。 |
| 策略感知工具注册表 | 工具可见性、参数校验和执行策略统一放在 registry。 | 同一套工具实现可以安全运行在 demo、测试和生产环境。 |
| 安全与 RLS | 访问控制基于 group memberships，而 `run_sql` 可被 `RLSToolRegistry` 重写或拒绝。 | 不把策略硬编码进每个工具里。 |
| 会话历史存储 | 会话状态独立于 memory 持久化，并且可以回放、列出或读取最近轮次。 | 支持多轮行为和 history-aware enrichers。 |
| 可扩展钩子 | Hooks、middleware、recovery、observability、enrichers 和 schema services 都是可插拔的。 | 保持核心 agent 简洁，同时允许项目定制。 |

---

## 🏗️ 架构^

QueryMind 以 `Agent` 为核心编排器，并在其周围放置工作流处理、上下文组装、策略执行、记忆和持久化等横切层。核心设计理念是职责分离：模型负责推理，但身份、状态、策略和存储都保持显式。

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   QUERYMIND 架构流水线                                       │
│                                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 1. 请求边界                                                                          │  │
│  │    RequestContext → UserResolver → User                                               │  │
│  └──────────────────────────────────────────┬─────────────────────────────────────────────┘  │
│                                             ▼                                                │
│  ┌────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 2. Agent 编排层                                                                       │  │
│  │    WorkflowHandler | ConversationStore | Hooks | Middleware                           │  │
│  │    ErrorRecovery | Observability | Audit                                              │  │
│  └──────────────────────────────────────────┬─────────────────────────────────────────────┘  │
│                                             ▼                                                │
│  ┌────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 3. 上下文组装                                                                         │  │
│  │    ToolContextEnricher → Tool schemas → SystemPromptBuilder                           │  │
│  │    LlmContextEnhancer → ConversationFilter                                            │  │
│  └──────────────────────────────────────────┬─────────────────────────────────────────────┘  │
│                                             ▼                                                │
│  ┌────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 4. 工具与策略层                                                                       │  │
│  │    ToolRegistry / RLSToolRegistry → 参数校验 → 策略转换 → 执行                          │  │
│  │    访问控制 | RLS 规则 | 审计日志                                                      │  │
│  └──────────────────────────────────────────┬─────────────────────────────────────────────┘  │
│                                             ▼                                                │
│  ┌────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 5. 记忆与 Schema 层                                                                   │  │
│  │    AgentMemory (Mem0) | SchemaMemory (Neo4j + Mem0) | SchemaManagementService         │  │
│  │    检索 | 扩展 | 维护                                                                  │  │
│  └──────────────────────────────────────────┬─────────────────────────────────────────────┘  │
│                                             ▼                                                │
│  ┌────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 6. 运行时集成                                                                        │  │
│  │    LLM service | SQL runners | FileSystem | ConversationStore                          │  │
│  │    Neo4j | Mem0 | Audit logger                                                         │  │
│  └────────────────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

从整体上看，请求边界先解析用户，工作流层可以直接短路某一轮，对话与工具上下文分层组装，注册表按策略执行工具，而存储与记忆层负责把发生过的事情保留下来。

---

## 🔄 单次查询的 Agent Loop^

`Agent._send_message()` 里的执行顺序是刻意设计的：先解析用户，再处理 starter UI；在消息写入会话前尝试工作流；随后组装上下文、构建 prompt、运行 LLM/tool loop，最后再持久化和收尾。这样的顺序可以把确定性命令留在概率路径之外，也让历史状态更容易理解。

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     Agent Loop 数据流                                        │
│                                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 1. 用户消息 + RequestContext                                                           │  │
│  │    例如：“查询 Northwest 地区的订单”                                                   │  │
│  └────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                            │                                                 │
│                                            ▼                                                 │
│  ┌────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 2. 用户解析                                                                            │  │
│  │    UserResolver.resolve_user(request_context)                                          │  │
│  └────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                            │                                                 │
│                                            ▼                                                 │
│  ┌────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 3. 前置路由                                                                            │  │
│  │    starter UI 请求？/ 空消息？                                                          │  │
│  │    ├─ starter UI → workflow_handler.get_starter_ui()                                   │  │
│  │    └─ 空消息 → 直接返回                                                                 │  │
│  └────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                            │                                                 │
│                                            ▼                                                 │
│  ┌────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 4. 会话载入                                                                            │  │
│  │    读取已有 Conversation，或创建空 Conversation                                         │  │
│  └────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                            │                                                 │
│                                            ▼                                                 │
│  ┌────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 5. Workflow Handler 检查                                                                │  │
│  │    DefaultWorkflowHandler / SchemaInitWorkflow / SchemaManagementWorkflow              │  │
│  │    已处理 → mutate conversation + stream UI + auto-save + 返回                         │  │
│  └────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                            │                                                 │
│                                            ▼                                                 │
│  ┌────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 6. 上下文组装                                                                          │  │
│  │    ToolContextEnrichers → Tool schemas → SystemPromptBuilder + LlmContextEnhancer      │  │
│  │    ConversationFilter → 构建 LLM request                                               │  │
│  └────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                            │                                                 │
│                                            ▼                                                 │
│  ┌────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 7. LLM 响应 / Tool Loop                                                                 │  │
│  │    文本 → 最终回答                                                                      │  │
│  │    tool calls → ToolRegistry / RLSToolRegistry → 执行 → 追加 tool result                │  │
│  │    重复直到没有 tool calls 或达到 max_tool_iterations                                   │  │
│  └────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                            │                                                 │
│                                            ▼                                                 │
│  ┌────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 8. 收尾                                                                                │  │
│  │    保存 conversation，执行 after-message hooks，输出最终 UI                             │  │
│  └────────────────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

循环会在模型返回最终答案时结束，或者在达到 `max_tool_iterations` 时结束，此时 QueryMind 会发出警告并标记结果可能不完整。正常结束后，会话会被持久化，after-message hooks 也会执行。

---

## 🧩 核心组件

下面六个子系统构成了 QueryMind 的主要实现面。每个模块都单独写成子文档，因为它们的实现深度足以独立成页。

---

### *工具系统*

工具层把 LLM 的建议转成类型明确、可审计的动作。registry 决定哪些工具可见、哪些工具可执行，而每个 tool 只专注一项能力，例如 SQL 执行、Schema 检索、记忆、文件系统、Python 执行或可视化。最关键的设计是把策略和能力分离：`RunSqlTool` 不需要知道查询是否允许，`RLSToolRegistry` 也不需要知道 SQL 该怎么执行。

这里也是 QueryMind 运维故事最强的一层。`ToolResult` 同时携带 LLM 可读文本和 UI payload，因此同一次调用既能驱动聊天输出，也能驱动结构化组件。registry 还统一负责访问控制、参数校验、审计和策略重写，这让系统更安全，也让工具本身更易复用。

详情见 [Tool System](./components/tools.md) 和相关策略参考 [Security & Access Control](./components/security.md)。

---

### *Agent Memory (RAG) System*

QueryMind 使用两种不同的记忆平面来解决不同问题。Agent Memory 存工具使用模式和文本笔记，Schema Memory 存表结构、字段、关系和业务上下文。这个拆分很重要，因为系统既要记住“怎么做”，也要记住“数据库实际长什么样”。

这里的创新不只是“有 memory”，而是把 procedural memory 和 structural memory 明确分离，再让它们进入 agent loop 的不同阶段。Agent Memory 可以帮助模型复用一条已知有效的查询路径，而 Schema Memory 可以把同一个问题锚定到真实的表关系上。

详情见 [Agent Memory (RAG) System](./components/memory.md)。

---

### *Context Assembly/Enhancement Pipeline*

QueryMind 将上下文组装分成三层：`SystemPromptBuilder` 生成基础 instruction scaffold，`LlmContextEnhancer` 在每次 LLM 调用前增强 prompt 和 message stream，`ToolContextEnricher` 则把执行时状态注入到 tool call 里。这样可以避免把 prompt 策略、对话证据和工具运行状态混在一起。

最有意思的部分是有状态检索。`SchemaRetrieveContextEnricher` 会读取最近的会话历史，找到上一轮 `schema_retrieve` 的结果，并把 `seed_tables` 注入到 `ToolContext.metadata` 里。这样后续追问就能沿着上一轮 schema 搜索继续，而不必让模型用自然语言重新“记住”上下文。

详情见 [Context Assembly/Enhancement Pipeline](./components/context.md)。

---

### *Workflow Handler*

Workflow handler 是 QueryMind 的确定性、前置 LLM 路由层。它会在 agent 把消息送给模型之前先拦截消息，判断某个 command 或 stateful workflow 是否应该直接执行，最后要么立即返回 UI，要么继续正常的 LLM 流程。

这里也是管理类命令变成一等公民的地方。`DefaultWorkflowHandler` 处理 `/help`、`/status`、`/memories` 和 `/delete`；`SchemaInitWorkflow` 暴露 `/init_schema`；`SchemaManagementWorkflow` 暴露 `/schema_list`、`/schema_detail` 和 `/schema_enrich`；`CompositeWorkflowHandler` 则让它们可以干净地共存。模型负责推理，精确命令则保持精确。

详情见 [Workflow Handler](./components/workflow.md)。

---

### *Security & Access Control*

QueryMind 的安全是分层实现的。首先解析请求身份，然后用 group membership 做工具访问控制，再用同一套 primitive 做 UI feature gating，最后在数据库调用之前由 registry 级策略层执行 SQL 安全检查。这样可以让系统在不同部署场景中复用，同时也更容易讲清楚。

真正关键的创新在于 `RLSToolRegistry.transform_args()` 可以在执行前重写或拒绝 `run_sql`。这意味着 row-level security 和 injection defense 不需要埋进 SQL tool 内部，而是作为 registry 边界上的部署策略。工具因此保持可复用，安全模型也更容易审计。

详情见 [Security & Access Control](./components/security.md)。

---

### *Conversation Store & History Management*

Conversation storage 是多轮行为的持久化事实来源。它保存的是精确的聊天轮次、tool call 和 tool result，而不是 Agent Memory 那种可复用模式。换句话说，conversation history 是 transcript，而不是长期记忆。

这种分离带来一个很有用的能力：最近历史可以变成检索的 state bus。`SchemaRetrieveContextEnricher` 能从上一轮 `schema_retrieve` 结果里恢复 selected tables，再把它们作为下一轮的 `seed_tables` 使用。文件系统后端还能让会话在应用外部被直接检查，这对调试和运维很有价值。

详情见 [Conversation Store & History Management](./components/conversation.md)。

---

## Advanced Features

QueryMind 的高级特性位于 agent core 的扩展层。Hooks 负责拦截整个 turn 生命周期，middlewares 负责包裹 LLM 边界，recovery strategies 则把瞬时失败转成显式的 retry / fail 决策。这样做的结果是：核心循环保持简洁，而定制能力依然清晰可控。

---

### Lifecycle Hooks
Lifecycle hooks 是 agent loop 中最宽的拦截点。它们允许部署在消息进入处理前观察或改写消息，在每次 tool 执行前后介入，并在 turn 结束后做清理。这个契约刻意保持轻量：`before_message()` 可以替换文本，`before_tool()` 可以通过抛错阻止执行，`after_tool()` 可以替换结果，`after_message()` 只负责副作用。

Hook 的执行顺序是串联且可观测的。每个 hook 都会接收到前一个 hook 处理后的值，agent 还会为每次调用包上 span 和 timing metrics，这样策略逻辑就不会变成“看不见的黑盒”。

#### Invocation Points^
```text
┌──────────────────────────────┐
│ User message enters Agent    │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ before_message(user, msg)    │
│ rewrite / quota / validate   │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ workflow handling + LLM loop │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ before_tool(tool, context)   │
│ block / audit / enrich check │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ tool_registry.execute(...)   │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ after_tool(result)           │
│ normalize / redact / tag     │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ conversation saved           │
│ after_message(conversation)  │
└──────────────────────────────┘
```

关键边界在于：workflow handler 可以在更底层的 hook 点被触达前就把整轮对话短路掉。换句话说，starter UI 和显式命令可能完全不进入 tool path。

---

### LLM Middlewares
LLM middlewares 恰好包在模型调用的两侧。它们比 hooks 更窄：它们不会看到 workflow routing 或 tool execution，只看到进来的 `LlmRequest` 和返回的 `LlmResponse`。因此它们很适合做缓存、脱敏、请求整形、响应日志和成本跟踪。

QueryMind 在 non-streaming 和 streaming 两条路径上都使用同一套 middleware 链。流式输出会先被聚合，再交给后置 middleware 处理成一个完整的 response，因此 middleware 逻辑在两种 transport mode 下是对称的。

#### Invocation Points^
```text
┌──────────────────────────────┐
│ Built LLM request            │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ before_llm_request(request)  │
│ cache / redact / reshape     │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ LlmService.send_request()    │
│ or LlmService.stream_request │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ after_llm_response(...)      │
│ log / normalize / fallback   │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ tool loop or final output    │
└──────────────────────────────┘
```

当你想改变“模型如何被调用”时用 middleware；当你想直接绕过模型时用 workflow。

---

### Error Recovery
Error recovery 被建模成一个 strategy object，而不是散落在代码里的硬编码重试逻辑。基础契约返回的是类型化的 `RecoveryAction`，因此恢复动作可以显式表达 `RETRY`、`FAIL`、`FALLBACK`、`SKIP`，并带上 `retry_delay_ms`、`fallback_value`、`message` 这类结构化字段。

当前默认的 backoff strategy 只会发出 `RETRY` 和 `FAIL`，但更丰富的 enum 为未来引入 fallback 行为保留了空间，而无需改动契约本身。

`ErrorRecoveryStrategy` 暴露两个决策点：`handle_tool_error()` 和 `handle_llm_error()`。基础实现是 fail-fast，而具体策略可以在此之上叠加 backoff、fallback 文本，或更温和的 graceful degradation。

#### Use Case: ExponentialBackoffStrategy*
`ExponentialBackoffStrategy` 是 QueryMind 内置的具体策略。它在 [`src/my_agent.py`](../../src/my_agent.py) 中被配置，用来处理瞬时失败：每次重试都把延迟翻倍，设定上限，并加入可选 jitter，避免大量客户端同时按同一节奏重试。

```text
┌──────────────────────────────┐
│ tool error or LLM error      │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ handle_tool_error()          │
│ or handle_llm_error()        │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ attempt >= max_retries ?     │
└───────┬──────────────┬───────┘
        │ no           │ yes
        ▼              ▼
┌──────────────────────┐   ┌──────────────────────────┐
│ delay = base * 2^n   │   │ RecoveryAction(FAIL)     │
│ cap at max_delay_ms  │   │ user-friendly message    │
│ jitter 50%-100%      │   └──────────────────────────┘
└──────────────┬───────┘
               ▼
┌──────────────────────────────┐
│ RecoveryAction(RETRY, delay) │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ retry the operation          │
└──────────────────────────────┘
```

这里的创新点不在于“重试”本身，而在于把 retry policy 做成显式、类型化、可部署配置的策略层。这样一来，瞬时故障处理就不会侵入 agent 核心逻辑，同时 agent 外层的异常兜底仍然保留，负责最终的用户可见 fallback。

---

Notes:
- 主文档中，对于有子文档（标题加粗）的章节，需要提供可跳转的子文档超链接信息。
- `^` 章节表示该章节中有 draw.io diagram，需要为 diagram 预留空间，可先使用 ASCII diagram 进行绘制，后续再替换为更美观的图表。
- `*` 章节表示具有创新性工作的章节，请进行更加详尽的叙述和创新点阐释。
