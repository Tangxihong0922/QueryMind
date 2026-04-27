# 上下文组装/增强流水线


QueryMind 的上下文组装分成三层：
- `SystemPromptBuilder` 负责生成基础指令骨架。
- `LlmContextEnhancer` 负责在每次 LLM 调用前增强 prompt 和消息流。
- `ToolContextEnricher` 负责把执行态信息注入到工具调用里。

这样拆分是必要的，因为 prompt 上下文、对话上下文和工具执行上下文解决的是不同问题。system prompt 决定模型怎么思考。message enhancer 提供当前轮次需要的上下文。tool enricher 则把工具真正需要的运行时状态带进去。

## System Prompt Builder^

System prompt builder 是请求组装的第一步。它的职责是根据当前用户和该轮可用工具，生成基础 prompt。在默认实现中，prompt 不是固定字符串，而是由当前工具列表动态拼出来的；当 memory 工具存在时，它还会附加 memory workflow 指令。

如果显式提供了固定的 `base_prompt`，默认 builder 会直接返回它，不再做动态组装。

核心实现是 `DefaultSystemPromptBuilder`。它会：
- 读取工具 schema 列表里的工具名，
- 判断 memory 相关工具是否存在，
- 写入 QueryMind 的基础角色与响应规范，
- 仅在相关工具可用时追加结构化说明。

这样做的好处是：当 agent 配置的工具较少时，prompt 保持简洁；当 agent 拥有记忆能力时，prompt 又会自动扩展。也就是说，prompt 是按能力自适应的，而不只是固定的品牌文案。

#### System Prompt Builder 流程^
```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                           SYSTEM PROMPT BUILDING                             │
│                                                                              │
│  ┌──────────────────────────────┐                                            │
│  │ 用户 + 可用工具 Schemas      │                                            │
│  └──────────────┬───────────────┘                                            │
│                 ▼                                                            │
│  ┌──────────────────────────────┐                                            │
│  │ DefaultSystemPromptBuilder   │                                            │
│  │                              │                                            │
│  │  1. 读取工具名               │                                            │
│  │  2. 判断 memory 工具         │                                            │
│  │  3. 写入基础助手角色         │                                            │
│  │  4. 追加能力规则             │                                            │
│  └──────────────┬───────────────┘                                            │
│                 ▼                                                            │
│  ┌──────────────────────────────┐                                            │
│  │ 基础 system prompt           │                                            │
│  │ + 可选 memory workflow       │                                            │
│  └──────────────────────────────┘                                            │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 基础 Prompt 实际做了什么

默认 prompt 会明确几件事：
- 助手自我定位为 QueryMind，
- 当前日期会被写入 prompt，
- 工具输出会在对话外单独展示，所以助手应当总结而不是重复原始结果，
- 工具名会被列出来，让模型知道自己能调用哪些工具。

当 memory 工具存在时，prompt 还会包含明确的工具使用策略。这个策略不是装饰，而是为了稳定模型的工具搜索与保存行为。

## LLM Context Enhancers^

LLM context enhancer 会在 LLM 调用前进一步修改 prompt 和 message stream。QueryMind 用它来注入记忆片段和 schema 路由规则，而不是把这些细节硬编码进基础 prompt。

这里有两个关键行为：
- `enhance_system_prompt()` 追加稳定的策略说明。
- `enhance_user_messages()` 把当前轮次相关的上下文注入到消息序列里。

这个拆分很有用。稳定策略属于 system prompt。新的证据属于 message stream。

#### LLM Enhancer 流程^
```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                             LLM CONTEXT ENHANCERS                            │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ System Prompt                                                          │  │
│  │                                                                        │  │
│  │  DefaultSystemPromptBuilder                                            │  │
│  │           │                                                            │  │
│  │           ▼                                                            │  │
│  │  CompositeLlmContextEnhancer                                           │  │
│  │           │                                                            │  │
│  │   ┌───────┴────────┐                                                   │  │
│  │   ▼                ▼                                                   │  │
│  │ SchemaContextEnhancer   DefaultLlmContextEnhancer                      │  │
│  │   │                    │                                              │  │
│  │   │ 追加 schema        │  在 AgentMemory 中检索相关示例              │  │
│  │   │ 路由规则           │  把记忆片段追加到 prompt                    │  │
│  │   └────────────┬────────┘                                              │  │
│  └─────────────────┼──────────────────────────────────────────────────────┘  │
│                    ▼                                                         │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ User Messages                                                          │  │
│  │                                                                        │  │
│  │  CompositeLlmContextEnhancer                                           │  │
│  │           │                                                            │  │
│  │           ▼                                                            │  │
│  │  enhance_user_messages()                                               │  │
│  │                                                                        │  │
│  │  - schema enhancer 可以前置最新的 schema 结果                           │  │
│  │  - default enhancer 通常保持消息不变                                   │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### System Prompt Enhancer

`SchemaContextEnhancer` 负责 schema 路由指令。它会把 search-mode 规则附加到 system prompt 中，让 LLM 能根据 query 选择 `hybrid`、`vector`、`graph` 或 `expand`。

这很重要，因为 QueryMind 不想把 schema search 固定成一种策略。这个 enhancer 给模型一套选择规则：
- `hybrid` 适合一般业务问题，
- `vector` 适合语义发现，
- `graph` 适合偏关系遍历的探索，
- `expand` 适合上下文里已经有 seed tables 的情况。

prompt 层的规则能提高 tool 选择的稳定性，但它仍然只是指导。真正的执行结果还是由工具层决定。

`DefaultLlmContextEnhancer` 的职责不同。它会在 `AgentMemory` 里查找和当前用户消息相关的 text memories，然后把这些内容追加到 system prompt 的 “relevant context” 段落里。这样模型就能拿到上一轮经验或领域知识。

如果 agent memory 不存在，或者已经 degraded，enhancer 会直接保持 prompt 不变。

这两个 enhancer 常常会通过 `CompositeLlmContextEnhancer` 组合起来，而且按顺序执行。这个顺序是刻意设计的：先放好 schema 规则，再补 memory 片段，最终 prompt 才会像一套完整而连贯的指令集。
如果某个 enhancer 失败，composite 会跳过它并继续执行后面的 enhancer，这样单个增强器出错不会拖垮整轮请求。

### User Message Enhancer

同一套 enhancer 接口也可以修改 message history。当前 QueryMind 的行为里，schema enhancer 会把最新检索到的 schema 内容前置成一个 synthetic system message，而 default memory enhancer 通常不修改消息本身。

这个选择看起来细，但很有价值。把检索到的 schema 上下文放进 messages，而不是塞进基础 prompt，可以更清楚地区分“稳定指令”和“当前轮次证据”。

#### 为什么要有这一层

enhancer 层解决的是一个实际的 LLM 问题：模型不应该只依赖原始历史去猜上下文。

没有 enhancer 时，模型可能会：
- 忽略有用的历史记忆，
- 选错 schema search mode，
- 或者无法在多轮对话中保持检索结果可见。

通过把 prompt 策略和检索证据分开，QueryMind 让对话更容易控制，也更容易排错。

## Tool Context Enricher^

Tool context enricher 的层级比 prompt enhancer 更低。它不会直接改变模型看到的内容，而是改变模型真正调用工具时，工具拿到的执行上下文。

这个 hook 的边界是故意收紧的：enricher 通常只修改 `context.metadata`，而不会替换整个 context 对象。

这就是 runtime state 转成 execution state 的地方。QueryMind 里最重要的例子就是 `SchemaRetrieveContextEnricher`。

#### Tool Context Enricher 流程^
```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                            TOOL CONTEXT ENRICHMENT                           │
│                                                                              │
│  Conversation history                                                        │
│          │                                                                   │
│          ▼                                                                   │
│  SchemaRetrieveContextEnricher                                               │
│          │                                                                   │
│          ├─→ 读取最近的对话消息                                              │
│          ├─→ 找到最新的 schema_retrieve 工具结果                            │
│          ├─→ 提取 selected_tables / graph_hint / required_fields            │
│          └─→ 写入 context.metadata["schema_retrieve_context"]               │
│                                                                              │
│          ▼                                                                   │
│  SchemaRetrieveTool.execute()                                                │
│          │                                                                   │
│          └─→ 从 ToolContext.metadata 读取 seed_tables                        │
│              并可切换到 expand mode                                           │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Use Case: Schema Retrieve Context Enricher^*

`SchemaRetrieveContextEnricher` 是整条流水线里最关键的部分之一，因为它把 schema retrieval 从一次性查询变成了多轮工作流。

它的任务是检查最近的对话历史，找到最新的 `schema_retrieve` 工具结果，并提取上一轮已经选中的表。然后它会把一个 `schema_retrieve_context` 对象写入 `ToolContext.metadata`。

这个 metadata 通常包括：
- `seed_tables`
- `seed_table_refs`
- `expand_mode`
- `last_query`
- `graph_hint`
- `required_fields`
- `domain_filter`

这不仅仅是记账。它正是让后续像“找出这些 orders 相关的所有表”这样的追问，能够复用前一轮结果而不是重新开始的关键。

#### 为什么这很创新

核心思想是“有状态检索”。

大多数系统会把 schema search 当成一次无状态查询。QueryMind 把它当成对话。上一轮检索结果会成为下一轮的显式输入。这让检索过程更符合用户使用习惯，也更便于 agent 控制。

实际收益很直接：
- 更好的多轮追问处理，
- 更少的 schema 发现重复劳动，
- 从已知表扩展时更确定，
- “找到起点”和“从起点扩展”两步分离更清楚。

如果从面试表达来看，这一层证明系统做的不只是 retrieval，而是在维护 retrieval state。

#### Schema Retrieve Context 流程
```text
┌──────────────────────────────┐
│ 最近对话历史中包含旧结果     │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ SchemaRetrieveContextEnricher│
│ 找到上一次 schema_retrieve   │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ ToolContext.metadata         │
│ schema_retrieve_context      │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ schema_retrieve 工具调用     │
│ 读取 seed_tables             │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ expand mode 可以继续         │
│ 基于上一轮 schema 结果推进    │
└──────────────────────────────┘
```

### 真实组装顺序

Agent 里的执行顺序是：
- `context_enrichers` 先运行，
- `SystemPromptBuilder` 再构建基础 prompt，
- `llm_context_enhancer` 追加策略和记忆上下文，
- message enhancement 在每次 LLM 请求前执行，
- 最终得到的 `ToolContext` 传给工具执行。

这个顺序非常重要，因为每一步消费的是不同类型的上下文。顺序一变，行为就会变。

## 结语

整体模式其实很清楚：先构建基础 prompt，再补充策略和记忆，最后把对话中的状态注入工具执行。

这让 QueryMind 在“模型被告知什么”“模型记住什么”“工具真正能用什么”之间保持了清晰分层。



<details open>
<summary>相关源码文件</summary>

- [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py) - 请求组装与主 Agent Loop
- [`src/QueryMind/core/agent/config.py`](../../../src/QueryMind/core/agent/config.py) - agent 配置、UI feature gating 与上下文构建时使用的 schema 默认值
- [`src/QueryMind/core/user/request_context.py`](../../../src/QueryMind/core/user/request_context.py) - 传给用户解析器的结构化请求元数据
- [`src/QueryMind/core/user/resolver.py`](../../../src/QueryMind/core/user/resolver.py) - 请求入口处使用的用户解析接口
- [`src/QueryMind/core/user/models.py`](../../../src/QueryMind/core/user/models.py) - 请求组装与会话存储共享的用户模型
- [`src/QueryMind/core/system_prompt/base.py`](../../../src/QueryMind/core/system_prompt/base.py) - system prompt builder 接口
- [`src/QueryMind/core/system_prompt/default.py`](../../../src/QueryMind/core/system_prompt/default.py) - 默认 system prompt 组装
- [`src/QueryMind/core/enhancer/base.py`](../../../src/QueryMind/core/enhancer/base.py) - LLM context enhancer 接口
- [`src/QueryMind/core/enhancer/default.py`](../../../src/QueryMind/core/enhancer/default.py) - 基于 memory 的 prompt 增强
- [`src/QueryMind/core/enhancer/composite.py`](../../../src/QueryMind/core/enhancer/composite.py) - enhancer 组合与执行顺序
- [`src/QueryMind/core/enhancer/schema_retrieve.py`](../../../src/QueryMind/core/enhancer/schema_retrieve.py) - schema 路由提示规则
- [`src/QueryMind/core/enricher/base.py`](../../../src/QueryMind/core/enricher/base.py) - tool context enricher 接口
- [`src/QueryMind/core/enricher/schema_retrieve.py`](../../../src/QueryMind/core/enricher/schema_retrieve.py) - 基于历史的 schema 检索上下文注入
- [`src/QueryMind/core/filter/base.py`](../../../src/QueryMind/core/filter/base.py) - conversation filter 接口
- [`src/QueryMind/core/llm/models.py`](../../../src/QueryMind/core/llm/models.py) - LLM message/request/response 契约，供 enhancer 与 filter 使用
- [`src/QueryMind/core/tool/models.py`](../../../src/QueryMind/core/tool/models.py) - ToolContext 和 ToolResult 契约，供上下文注入与执行使用
- [`src/QueryMind/capabilities/agent_memory/base.py`](../../../src/QueryMind/capabilities/agent_memory/base.py) - 记忆增强 prompt 时使用的 agent memory 接口
- [`src/QueryMind/capabilities/agent_memory/models.py`](../../../src/QueryMind/capabilities/agent_memory/models.py) - tool/text memory 数据模型
- [`src/QueryMind/capabilities/schema_memory/base.py`](../../../src/QueryMind/capabilities/schema_memory/base.py) - 作为 ToolContext 传递的 schema memory 接口
- [`src/QueryMind/capabilities/schema_memory/models.py`](../../../src/QueryMind/capabilities/schema_memory/models.py) - table schema 与 schema search 数据模型
- [`src/QueryMind/capabilities/schema_management/base.py`](../../../src/QueryMind/capabilities/schema_management/base.py) - 作为 ToolContext 传递的 schema management service 接口
- [`src/QueryMind/capabilities/schema_management/models.py`](../../../src/QueryMind/capabilities/schema_management/models.py) - schema management 的列表与 enrich 数据模型
- [`src/QueryMind/core/storage/base.py`](../../../src/QueryMind/core/storage/base.py) - 会话存储契约
- [`src/QueryMind/core/storage/models.py`](../../../src/QueryMind/core/storage/models.py) - Conversation 与 Message 数据模型
- [`src/QueryMind/integrations/local/file_system_conversation_store.py`](../../../src/QueryMind/integrations/local/file_system_conversation_store.py) - 持久化会话历史后端
- [`src/QueryMind/integrations/local/storage.py`](../../../src/QueryMind/integrations/local/storage.py) - 内存版会话历史后端

</details>
