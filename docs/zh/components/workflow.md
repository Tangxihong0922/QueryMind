# Workflow Handler

Workflow handler 是 QueryMind 的确定性前置路由层。它会在消息送入 LLM 之前先拦截一轮，判断这条消息是否应该走命令、状态流或其他固定流程；如果应该，就直接返回 UI；如果不应该，就放行给正常的 LLM 流水线。

这一层存在的原因很简单：并不是所有用户动作都应该交给模型解释。有些动作更适合显式命令、权限检查或 starter UI。这样能让交互更快、更稳定，也更容易排错。

## Workflow Handler 在 Agent 流水线中的位置^

workflow handler 的执行点在用户解析和会话加载之后，但在消息写入 conversation history 或发送给 LLM 之前。

#### Agent 流水线图
```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                              AGENT MESSAGE PIPELINE                          │
│                                                                              │
│  User Message                                                                │
│        │                                                                     │
│        ▼                                                                     │
│  UserResolver.resolve_user()                                                 │
│        │                                                                     │
│        ▼                                                                     │
│  Load / Create Conversation                                                  │
│        │                                                                     │
│        ▼                                                                     │
│  WorkflowHandler.try_handle()                                                │
│        │                                                                     │
│        ▼                                                                     │
│  WorkflowResult                                                              │
│        │                                                                     │
│        ├────────────── True ──────────────┐                                  │
│        │                                  ▼                                  │
│        │                        直接把 UI components 流式输出                 │
│        │                                  │                                  │
│        │                                  ▼                                  │
│        │                        如有需要先应用 conversation_mutation          │
│        │                                  │                                  │
│        │                                  ▼                                  │
│        │                        不进入 LLM，直接返回                         │
│        │                                                                     │
│        └────────────── False ─────────────┐                                  │
│                                           ▼                                  │
│                                把消息写入 conversation                        │
│                                           │                                  │
│                                           ▼                                  │
│                                LLM processing / tool loop                    │
│                                           │                                  │
│                                           ▼                                  │
│                                将组件流式输出到 UI                             │
└──────────────────────────────────────────────────────────────────────────────┘
```

真正的分界点是 `should_skip_llm`。如果它是 `True`，workflow 直接接管这一轮；如果它是 `False`，消息就继续进入正常 agent 流水线。

## Workflow Result 决策流^

`WorkflowResult` 是 workflow handler 和 agent 之间的契约。它可以同时做三件事：
- 直接跳过 LLM，
- 流式输出 UI components，
- 在返回前修改 conversation 状态。

#### Workflow Result 图
```text
┌──────────────────────────────┐
│ WorkflowHandler.try_handle() │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ WorkflowResult               │
└──────────────┬───────────────┘
               ▼
        ┌──────┴──────┐
        │ should_skip? │
        └──────┬──────┘
          True  │  False
               ▼
┌──────────────────────────────┐    ┌──────────────────────────────┐
│ 可选 conversation_mutation   │    │ 继续 LLM processing          │
│ 可选 UI components           │    │ 写入 user message 到历史      │
│ 流式输出到 UI                 │    │ 构建 prompt 和 tool loop     │
│ 不进入 LLM                   │    │ 输出最终响应                  │
└──────────────────────────────┘    └──────────────────────────────┘
```

把 workflow 理解成前置于模型的确定性分支，会最容易理解这一层的作用。

## 它提供什么

### 内置命令

QueryMind 内置了多种显式命令 workflow，例如 `/help`、`/status`、`/memories`、`/delete`、`/init_schema`、`/schema_list`、`/schema_detail` 和 `/schema_enrich`。

这些并不只是快捷方式，而是一个稳定的操作入口，适合那些不应该依赖模型自由解释的任务：
- 帮助信息，
- 管理员操作，
- schema 初始化，
- schema 检查与整理，
- memory 查看与清理。

### Setup 健康检查

`DefaultWorkflowHandler` 会分析当前可用工具集合，并把它变成一份 setup report。它会检查：
- SQL 连接，
- memory 搜索/保存工具，
- 可视化工具，
- 类计算器工具。

这很实用，因为 QueryMind 常常运行在“只配了一部分工具”的环境里。这个 workflow 能在用户提问之前就告诉他当前系统是否已经可用。

### Smart Starter UI

workflow handler 可以在用户还没发消息时就返回 starter UI。这样首屏就能展示：
- 欢迎语，
- 管理员快捷入口，
- setup 状态，
- schema 管理入口。

这样系统从第一次交互开始就会显得完整，而不是一个空白聊天框。

### Tool Analysis

默认 workflow 会对已注册工具名做一层轻量能力分析。它不会深挖业务逻辑，只会识别常见工具模式，然后把它们转成用户可读的健康状态。

这种分析足够快，也足够适合做 setup 指引。

## 内置 Workflow Handler

### DefaultWorkflowHandler

`DefaultWorkflowHandler` 是通用型 handler，负责常见命令和 starter UI。

它的三个主要行为是：
- `/help` 输出自然语言帮助，
- `/status` 输出 setup 健康状况与能力信息，
- `/memories` 和 `/delete` 供管理员查看和清理 memory。

它的 starter UI 也会反映当前工具情况。如果 SQL 缺失，会提示系统还不能用；如果 SQL 有了但 memory 或 visualization 不完整，会显示部分配置状态。对管理员来说，它还会附加更详细的系统信息和 memory 管理入口。

这里最重要的设计点是：handler 不只是回答命令，而是把内部 setup 状态转换成用户可读的状态面。

### SchemaInitWorkflow

`SchemaInitWorkflow` 处理 `/init_schema`，也就是确定性的 schema 导入/初始化步骤。

这个 workflow 只允许 admin 使用，并依赖已配置的 `SchemaExtractor` 和 `SchemaSyncEngine` 来初始化或刷新 schema memory。命令支持两种模式：
- `/init_schema` 表示 upsert 风格同步，
- `/init_schema force` 表示全量重建。

实现会报告三类状态：
- 成功，
- 成功但带 warning，
- 失败或提前停止。

这很重要，因为真实环境里的 schema 加载经常只能部分成功。workflow 会把 processed 数、created/updated/skipped 数量、耗时以及 sample errors 都展示出来，让运维人员判断这次同步是否需要处理。

### SchemaManagementWorkflow

`SchemaManagementWorkflow` 负责初始化之后的 schema 维护命令。

它支持：
- `/schema_list`
- `/schema_list incomplete`
- `/schema_detail <table>` 或 `/schema_detail <schema>.<table>`
- `/schema_enrich`
- `/schema_enrich <table>`

这个 workflow 和 `/init_schema` 是分开的。初始化负责构建语料，schema management 负责持续维护它的健康度，包括完整度列表、BusinessContext 编辑和缺失字段补全。

## Workflow Handler 设计

基础接口非常小：
- `try_handle()` 决定 workflow 是否接管这一轮，
- `get_starter_ui()` 决定是否提供启动界面。

这个小接口会让 workflow 很容易理解。复杂逻辑留给具体 handler，本身的契约保持稳定。

`CompositeWorkflowHandler` 允许多个 handler 共存。它按顺序执行，返回第一个决定跳过 LLM 的 handler；对 starter UI，它会收集所有 handler 的组件并合并。

这让系统可以组合使用 help/status、schema init、schema management，而不会让某个 handler 独占整条对话。

## Use Case: Schema Management Commands*

schema management 是 workflow 价值最清楚的例子。

这些命令不应该交给模型模糊理解，因为它们是带副作用的运维动作：
- 列表查看，
- 单表查看，
- 元数据编辑，
- 缺失 schema 补全，
- 过期条目删除。

workflow 会把边界讲清楚：
- admin 可以触发确定性的维护动作，
- 非 admin 会被提前拒绝，
- 结果已知时直接跳过 LLM，
- UI 可以直接渲染结构化的 list/detail 卡片。

#### Schema Management 命令流^
```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                         SCHEMA MANAGEMENT COMMAND FLOW                       │
│                                                                              │
│  User Message: "/schema_detail public.customers"                             │
│        │                                                                     │
│        ▼                                                                     │
│  WorkflowHandler.try_handle()                                                │
│        │                                                                     │
│        ▼                                                                     │
│  SchemaManagementWorkflow                                                     │
│        │                                                                     │
│        ├─→ 检查 admin 权限                                                   │
│        ├─→ 解析命令 / 参数                                                   │
│        ├─→ 构建 ToolContext                                                  │
│        ├─→ 调用 SchemaManagementService                                      │
│        └─→ 生成 rich UI components                                           │
│                                                                              │
│        ▼                                                                     │
│  WorkflowResult(should_skip_llm=True)                                         │
│        │                                                                     │
│        └─→ 直接把 list/detail cards 流式输出到 UI                            │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### 为什么值得有这一层

这里的创新点不是命令语法本身，而是把运维任务做成 LLM 之前的第一类 workflow 分支，而不是强行通过自然语言解释来完成。

这让 QueryMind 拥有：
- 更低的 admin 操作延迟，
- 更少的命令歧义，
- 更强的权限边界，
- 也更容易在面试里解释“管理员到底如何管理系统”。

## 结语

workflow handler 给 QueryMind 提供了一个确定性的前门。

它处理那些应该显式表达的事情，让 LLM 专注于真正需要推理的内容，也让整个 agent 更容易运维。


<details open>
<summary>相关源码文件</summary>

- [`src/QueryMind/core/workflow/base.py`](../../../src/QueryMind/core/workflow/base.py) - workflow 契约与 `WorkflowResult`
- [`src/QueryMind/core/workflow/default.py`](../../../src/QueryMind/core/workflow/default.py) - 默认命令路由与 starter UI 处理
- [`src/QueryMind/core/workflow/composite.py`](../../../src/QueryMind/core/workflow/composite.py) - handler 组合与 first-match 分发
- [`src/QueryMind/core/workflow/schema_init_workflow.py`](../../../src/QueryMind/core/workflow/schema_init_workflow.py) - `/init_schema` 工作流
- [`src/QueryMind/core/workflow/schema_management_workflow.py`](../../../src/QueryMind/core/workflow/schema_management_workflow.py) - schema management 命令工作流
- [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py) - Agent 循环中 workflow handler 的接入点
- [`src/my_agent.py`](../../../src/my_agent.py) - 组装 composite workflow handler 的项目入口
- [`src/QueryMind/capabilities/schema_management/base.py`](../../../src/QueryMind/capabilities/schema_management/base.py) - workflow handler 使用的 schema management service 接口
- [`src/QueryMind/capabilities/schema_management/models.py`](../../../src/QueryMind/capabilities/schema_management/models.py) - schema management 的列表/详情模型
- [`src/QueryMind/capabilities/schema_extracter/base.py`](../../../src/QueryMind/capabilities/schema_extracter/base.py) - schema init workflow 使用的 schema extractor 接口
- [`src/QueryMind/capabilities/schema_extracter/models.py`](../../../src/QueryMind/capabilities/schema_extracter/models.py) - schema 抽取与初始化模型
- [`src/QueryMind/integrations/schemamanagement/neo4j_mem0/neo4j_mem0_schema_management.py`](../../../src/QueryMind/integrations/schemamanagement/neo4j_mem0/neo4j_mem0_schema_management.py) - 具体的 schema management 后端
- [`src/QueryMind/integrations/schemaextractor/sqlite/sqlite_extractor.py`](../../../src/QueryMind/integrations/schemaextractor/sqlite/sqlite_extractor.py) - SQLite schema extractor 后端
- [`src/QueryMind/integrations/schemaextractor/postgres/postgres_extractor.py`](../../../src/QueryMind/integrations/schemaextractor/postgres/postgres_extractor.py) - Postgres schema extractor 后端
- [`src/QueryMind/integrations/schemaextractor/mssql/mssql_extractor.py`](../../../src/QueryMind/integrations/schemaextractor/mssql/mssql_extractor.py) - MSSQL schema extractor 后端
- [`src/QueryMind/components/rich/schema_management/schema_list_component.py`](../../../src/QueryMind/components/rich/schema_management/schema_list_component.py) - schema list UI 组件
- [`src/QueryMind/components/rich/schema_management/schema_detail_component.py`](../../../src/QueryMind/components/rich/schema_management/schema_detail_component.py) - schema detail UI 组件

</details>