# Workflow Handler

Workflow handler 是确定性的 LLM 前置路由层。它决定一条消息是直接短路到命令处理或 starter UI，还是继续进入正常的 agent 流程。

## 基础契约

`WorkflowHandler` 定义两个钩子：
- `try_handle(...)` 决定这一轮是否由 workflow 接管
- `get_starter_ui(...)` 负责在会话开始时可选地提供启动界面

`WorkflowResult` 是 `try_handle(...)` 的返回契约。

## Agent 流水线

```text
用户解析 -> 加载/创建会话 -> workflow_handler.try_handle(...)
  已接管 -> 应用 conversation_mutation -> 流式输出组件 -> 保存 -> 返回
  未接管 -> 写入用户消息 -> 构建 LLM request -> tool loop -> 响应
```

starter UI 走的是单独路径：空消息，或 `request_context.metadata["starter_ui_request"]`，会先调用 `get_starter_ui(...)`，再进入正常轮次。

## WorkflowResult

- `should_skip_llm`：必需标志位
- `components`：可选的 `UiComponent` 列表或 async generator
- `conversation_mutation`：可选的 async 回调，用来修改当前 `Conversation`

如果 `should_skip_llm` 为 `true`，agent 在这一支路里不会自动把消息写入历史。

## DefaultWorkflowHandler

`DefaultWorkflowHandler` 是默认内置 handler，负责常见命令和 starter UI。

它处理：
- `/help`
- `/status`
- `/memories`
- `/recent_memories` 和 `recent_memories`
- `/delete <memory_id>`

权限判断使用 `user.group_memberships`。`/help` 对所有人开放，其余命令只给 admin。

它的 starter UI 会读取 `agent.tool_registry.get_schemas(user)`，把检测到的工具集合转换成带角色感知的欢迎卡片或 setup 卡片。setup 分析会检查 SQL、memory 搜索/保存、可视化和类计算器工具。

这个 handler 的职责刻意保持得很窄。它不负责 schema 初始化，也不负责 schema 整理命令。

## Schema Workflows

### SchemaInitWorkflow

`SchemaInitWorkflow` 处理 `/init_schema` 和 `/init_schema force`。

源码里明确的是：
- 只允许 admin 使用
- 需要已经配置好的 `SchemaExtractor`
- 使用注入的 `SchemaSyncEngine`
- 只有 extractor 已配置时才会返回 admin starter UI

### SchemaManagementWorkflow

`SchemaManagementWorkflow` 处理初始化之后的 schema 整理命令。

它支持：
- `/schema_list`
- `/schema_list incomplete`
- `/schema_detail <table>` 或 `/schema_detail <schema>.<table>`
- `/schema_enrich`
- `/schema_enrich <table>`

源码里明确的是：
- 只允许 admin 使用
- 使用 `SchemaManagementService`
- 会为 schema management 命令集返回 admin starter UI

## CompositeWorkflowHandler

`CompositeWorkflowHandler` 会把多个 handler 组合起来。

它按顺序执行 handler，并返回第一个 `should_skip_llm=True` 的结果。对于 starter UI，它会收集所有 handler 的组件并合并成一个列表。

当你想把默认命令和 schema workflow 一起挂上去时，就用这个组合层。

## 边界

workflow handler 负责确定性路由和 starter UI。SQL governance、schema governance 和 prompt 构建都在别的层里。

## 相关源码文件

- [`src/QueryMind/core/workflow/base.py`](../../../src/QueryMind/core/workflow/base.py) - `WorkflowHandler` 契约与 `WorkflowResult`
- [`src/QueryMind/core/workflow/default.py`](../../../src/QueryMind/core/workflow/default.py) - 默认命令、setup 分析和 starter UI
- [`src/QueryMind/core/workflow/schema_init_workflow.py`](../../../src/QueryMind/core/workflow/schema_init_workflow.py) - `/init_schema` workflow
- [`src/QueryMind/core/workflow/schema_management_workflow.py`](../../../src/QueryMind/core/workflow/schema_management_workflow.py) - schema management workflow
- [`src/QueryMind/core/workflow/composite.py`](../../../src/QueryMind/core/workflow/composite.py) - 组合式 handler
- [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py) - agent 流水线中的 workflow 接入点
- [`src/my_agent.py`](../../../src/my_agent.py) - 组装 workflow stack 的项目入口
