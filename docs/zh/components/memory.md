# 记忆系统

QueryMind 有两套彼此独立的记忆系统：

- Agent Memory 存储可复用的工具模式和自由文本笔记。
- Schema Memory 存储表结构、字段元数据和关系上下文。

它们承担的职责不同，应当与 prompt 组装和治理策略分开说明。

## Agent Memory

Agent Memory 存两类可复用经验：

- Tool memory：成功的 question/tool/args 组合。
- Text memory：自由文本知识、定义和业务笔记。

这就是记忆工具和默认记忆上下文增强器所依赖的运行时契约。

### Agent Memory 接口

抽象的 `AgentMemory` 接口定义了存储契约：

- `save_tool_usage(...)`
- `save_text_memory(...)`
- `search_similar_usage(...)`
- `search_text_memories(...)`
- `get_recent_memories(...)`
- `get_recent_text_memories(...)`
- `delete_by_id(...)`
- `delete_text_memory(...)`
- `clear_memories(...)`

具体的记忆工具和 enhancer 都依赖这套接口，而不是绑定某个后端实现。

### Tool Memory

Tool memory 会记录一次成功工具调用中的问题、工具名、参数、
成功标记和可选元数据。

对应的数据模型是 `ToolMemory`，搜索结果是 `ToolMemorySearchResult`。

面向工具的行为主要包括：

- 保存一次成功的工具模式，方便之后复用；
- 根据问题相似度搜索过去的成功模式；
- 同时把结果返回给 LLM 和 UI；
- 当后端不可用时优雅降级。

### Text Memory

Text memory 存储可跨轮次复用的笔记和观察。
对应的数据模型是 `TextMemory`，搜索结果是 `TextMemorySearchResult`。

默认的 memory enhancer 会在 LLM 开始推理前读取 text memory。
当后端健康时，它会把相关片段作为用户侧 advisory message 注入；如果后端不可用，
则直接返回原始消息列表。

### 记忆后端

当前代码里有两种实用的 Agent Memory 后端：

- `DemoAgentMemory`：用于 demo 和测试，数据保存在内存里。
- `Mem0AgentMemory`：使用 Mem0 做持久化存储、隔离和语义检索。

`DemoAgentMemory` 的特点是：

- tool memory 和 text memory 都存放在内存中；
- 使用 Jaccard 和 difflib ratio 这类轻量相似度；
- 支持 FIFO 淘汰；
- 使用 `asyncio.Lock` 保护并发访问。

`Mem0AgentMemory` 更接近真实部署：

- 按 user 和 agent 做隔离；
- 在需要时可以把 tool memory 绑定到当前 conversation；
- 每条记录都带元数据；
- 在 Mem0 不可用时可降级为 no-op；
- 通过 Mem0 后端支持相似度检索和 rerank。

### Agent Memory ASCII 框图

下面的框图把 `save_question_tool_args`、`search_saved_correct_tool_uses`、
`save_text_memory` 和 `DefaultLlmContextEnhancer` 串成一条链路，并展示
真实的记忆内容如何回流到消息侧。

```text
+====================================================================================================+
| 1) 记忆工具入口                                                                                   |
|----------------------------------------------------------------------------------------------------|
| 输入: ToolContext + 原始问题 + 工具参数                                                             |
| 关键字段: context.raw_user_message, context.metadata.ui_features_available                         |
| 逻辑:                                                                                              |
|   - save_question_tool_args 保存成功的 question/tool/args 组合                                     |
|   - search_saved_correct_tool_uses 按问题检索历史成功用法                                           |
|   - save_text_memory 保存自由文本笔记                                                              |
| 真实轨迹:                                                                                          |
|   - "Found 2 similar tool usage pattern(s):"                                                       |
|   - question = "calculate salary percentile by department CUME_DIST PERCENT_RANK"                  |
|   - question = "calculate the salary percentile for each employee within the                       |
|     'Information Services' and 'Document Control' departments"                                     |
|   - args.sql = "SELECT ... CUME_DIST() ... PERCENT_RANK() ... FROM employeedepartmentrate ..."     |
| 输出: ToolResult(result_for_llm + ui_component)                                                     |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 2) AgentMemory 接口层                                                                              |
|----------------------------------------------------------------------------------------------------|
| 调用链:                                                                                            |
|   context.agent_memory.search_similar_usage(...)                                                   |
|   context.agent_memory.save_tool_usage(...)                                                        |
|   context.agent_memory.save_text_memory(...)                                                       |
| 作用: 统一隐藏后端差异，工具只依赖契约，不直接依赖具体实现                                         |
| 输出: ToolMemory / TextMemory / SearchResult                                                       |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 3) Mem0AgentMemory 后端                                                                             |
|----------------------------------------------------------------------------------------------------|
| my_agent.py wiring: agent_mem = Mem0AgentMemory(config=create_config_from_env())                   |
| 执行逻辑:                                                                                          |
|   - 按 user_id / agent_id 做隔离                                                                    |
|   - 保存 tool usage 和 text memory                                                                 |
|   - 在 `is_degraded` 时直接返回 no-op                                                               |
|   - 需要时把 args 序列化进 metadata                                                                 |
| 真实数据形状:                                                                                      |
|   - ToolMemory.question / tool_name / args                                                         |
|   - TextMemory.content                                                                              |
| 输出: 可检索、可复用的 agent memory 记录                                                            |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 4) DefaultLlmContextEnhancer                                                                       |
|----------------------------------------------------------------------------------------------------|
| my_agent.py wiring: DefaultLlmContextEnhancer(agent_memory=agent_mem)                              |
| 执行逻辑:                                                                                          |
|   - 构造临时 ToolContext(conversation_id='temp', request_id=uuid4())                               |
|   - 调用 search_text_memories(query=user_message, limit=5)                                         |
|   - 命中时把相关片段作为用户侧 advisory message 注入                                                |
|   - 失败或 degraded 时原样返回                                                                      |
| 真实 prompt 片段:                                                                                  |
|   - "## Memory Advisory"                                                                           |
|   - "Use these snippets only if they are relevant to the current turn:"                            |
| 输出: 增强后的用户侧 advisory message                                                               |
+====================================================================================================+
```

## Agent Memory 工具

记忆工具位于 `QueryMind.tools.agent_memory`，用于把记忆契约暴露给 LLM。

### `save_question_tool_args`

这个工具用于保存一次成功的 question/tool/args 组合。

它会：

- 在 `ToolContext.raw_user_message` 可用时优先使用原始用户问题；
- 通过 `context.agent_memory.save_tool_usage(...)` 写入使用模式；
- 返回成功消息和轻量状态 UI；
- 当后端降级时返回优雅的 no-op 提示。

### `search_saved_correct_tool_uses`

这个工具用于根据问题搜索过去成功的工具用法。

它会：

- 调用 `context.agent_memory.search_similar_usage(...)`；
- 支持 `limit`、`similarity_threshold` 和 `tool_name_filter`；
- 同时返回 LLM 文本和 UI 负载；
- 可以根据 `ToolContext.metadata` 里的 UI 特性返回简洁状态或详细记忆卡；
- 当 memory 后端不可用或没有结果时优雅降级。

### `save_text_memory`

这个工具用于保存自由文本笔记、定义或观察。

它会：

- 通过 `context.agent_memory.save_text_memory(...)` 写入内容；
- 在可用时返回保存后的 memory id；
- 在后端不可用时优雅返回 no-op 结果；
- 使用轻量状态 UI。

## Schema Memory

Schema Memory 用于存储 `schema_retrieve` 所依赖的表结构和检索元数据。

能力接口定义了以下契约：

- 保存表结构；
- 批量保存 schema；
- 更新 schema；
- 按业务问题检索；
- 按字段名检索；
- 按外键关系检索；
- 执行 hybrid 检索；
- 列出和删除已存表结构。

核心模型包括：

- `BusinessContext`
- `FieldDefinition`
- `ForeignKeyReference`
- `TableRelationship`
- `TableSchema`
- `SchemaSearchResult`

### Schema Memory 后端

当前主实现是 `Neo4jMem0SchemaMemory`。
它把以下部分组合在一起：

- Neo4j 用于图结构 schema 数据；
- Mem0 用于语义 schema 检索；
- `SchemaSearch` 用于 hybrid 检索和结果融合。

后端会把表元数据规范化成结构化 schema，写入两层存储，并返回带
排序信息的搜索结果。

### Schema Memory ASCII 框图

下面的框图把 `SchemaRetrieveContextEnricher`、`SchemaRetrieveTool`、
`Neo4jMem0SchemaMemory`、`schema_governance` 状态快照和
`SchemaContextEnhancer` 串成一条链路，并用 `sql_126` 的真实轨迹说明
锁定启发式如何工作。

```text
+====================================================================================================+
| 1) SchemaRetrieveContextEnricher                                                                  |
|----------------------------------------------------------------------------------------------------|
| 输入: ToolContext + conversation_id + 最近会话历史                                                  |
| 逻辑:                                                                                              |
|   - 优先读取 context.metadata.last_schema_summary                                                  |
|   - 否则回读 conversation_store.get_recent(..., limit=10)                                          |
|   - 提取 seed_tables / seed_table_refs / schema_locked                                             |
| 真实轨迹:                                                                                          |
|   - last_schema_summary = "schema_retrieve[hybrid] query='employees with SalariedFlag             |
|     and BusinessEntityID' -> 10 table(s)"                                                          |
|   - schema_retrieve_context.seed_tables = [...]                                                     |
| 输出: context.metadata.last_schema_summary / schema_retrieve_context                                |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 2) SchemaRetrieveTool                                                                              |
|----------------------------------------------------------------------------------------------------|
| 输入参数: query, search_mode, graph_hint, required_fields, limit, similarity_threshold              |
| my_agent.py wiring: SchemaRetrieveTool(schema_memory=schema_mem)                                    |
| 作用: 把 LLM 的检索意图转成 schema_memory.search_schema(...)                                        |
| 真实参数:                                                                                          |
|   - query="employees with SalariedFlag and BusinessEntityID"                                       |
|     search_mode="hybrid"                                                                            |
|   - query="HumanResources Employee table with SalariedFlag and BusinessEntityID"                   |
|     search_mode="vector"                                                                            |
|   - query="employee table human resources"                                                          |
|     search_mode="hybrid"                                                                            |
| 输出: SchemaSearchResult[]                                                                          |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 3) Neo4jMem0SchemaMemory + SchemaSearch                                                            |
|----------------------------------------------------------------------------------------------------|
| my_agent.py wiring: schema_mem = Neo4jMem0SchemaMemory(...)                                         |
| 结构: Neo4jGraphStore + Mem0VectorStore + RRF fusion                                                |
| 执行逻辑:                                                                                          |
|   - search_hybrid(): vector_task + graph_task -> asyncio.gather(...)                               |
|   - 只有 required_fields 或 domain_filter 明确时才走图检索                                           |
|   - 用 RRF 把 vector / graph 结果融合成统一排序                                                      |
| 真实结果形状:                                                                                      |
|   - 10 table(s) / 0 table(s) / lock=enough_schema                                                   |
| 输出: TableSchema + similarity_score + rank + match_reason                                          |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 4) schema_governance 状态快照                                                                      |
|----------------------------------------------------------------------------------------------------|
| 来源: schema_governance.hook + last_schema_summary                                                  |
| 作用: 把 discovery 过程压缩成紧凑状态，决定是否锁定 schema 检索                                      |
| 真实状态:                                                                                          |
|   - calls=1 successes=1 failures=0 locked=False                                                     |
|   - calls=3 successes=2 failures=1 locked=True lock_reason=enough_schema                           |
|   - calls=4 failures=3 lock_reason=schema_retrieve_empty_results                                   |
| 输出: schema_locked + lock_reason + summarized schema context                                       |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 5) SchemaContextEnhancer                                                                           |
|----------------------------------------------------------------------------------------------------|
| my_agent.py wiring: SchemaContextEnhancer()                                                         |
| 执行逻辑:                                                                                          |
|   - schema_locked 为 true 时不再追加检索规则                                                        |
|   - 否则注入 `## Schema Retrieval Tool - Search Mode Selection Rules`                              |
|   - 再把 `## Schema Context` 作为用户侧 advisory message 前缀                                       |
| 真实 prompt 片段:                                                                                  |
|   - "## Schema Context"                                                                            |
|   - "Search Mode: hybrid"                                                                          |
| 输出: 带 schema 规则和当前快照的最终用户侧 message                                                   |
+====================================================================================================+
```

## 本页覆盖什么

- Agent Memory 和 Schema Memory 两套系统；
- Agent Memory 接口；
- 记忆工具；
- 具体记忆后端；
- Schema Memory 的存储与检索能力。

## 本页不覆盖什么

- prompt-chain 组装；
- schema 探索治理；
- SQL 起草治理；
- conversation 持久化；
- tool registry 策略。

这些内容分别放到 prompt-chain、governance、conversation 和 tools 页面里。

## 源码文件

- [`src/QueryMind/capabilities/agent_memory/base.py`](../../../src/QueryMind/capabilities/agent_memory/base.py)
- [`src/QueryMind/capabilities/agent_memory/models.py`](../../../src/QueryMind/capabilities/agent_memory/models.py)
- [`src/QueryMind/integrations/local/agent_memory/in_memory.py`](../../../src/QueryMind/integrations/local/agent_memory/in_memory.py)
- [`src/QueryMind/integrations/agentmemory/mem0/agent_memory.py`](../../../src/QueryMind/integrations/agentmemory/mem0/agent_memory.py)
- [`src/QueryMind/tools/agent_memory.py`](../../../src/QueryMind/tools/agent_memory.py)
- [`src/QueryMind/core/enhancer/default.py`](../../../src/QueryMind/core/enhancer/default.py)
- [`src/QueryMind/core/enhancer/schema_retrieve.py`](../../../src/QueryMind/core/enhancer/schema_retrieve.py)
- [`src/QueryMind/core/enricher/schema_retrieve.py`](../../../src/QueryMind/core/enricher/schema_retrieve.py)
- [`src/my_agent.py`](../../../src/my_agent.py)
- [`src/QueryMind/capabilities/schema_memory/base.py`](../../../src/QueryMind/capabilities/schema_memory/base.py)
- [`src/QueryMind/capabilities/schema_memory/models.py`](../../../src/QueryMind/capabilities/schema_memory/models.py)
- [`src/QueryMind/integrations/schemamemory/memory.py`](../../../src/QueryMind/integrations/schemamemory/memory.py)
- [`src/QueryMind/integrations/schemamemory/schema_search.py`](../../../src/QueryMind/integrations/schemamemory/schema_search.py)
- [`src/evals/resume_points/20260430_023016_f36173c6/run.log`](../../../src/evals/resume_points/20260430_023016_f36173c6/run.log)
