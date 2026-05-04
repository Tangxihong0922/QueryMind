# 工作流短路用例

本页展示 workflow handler 如何在 LLM 之前拦截消息、返回 starter UI，
或者把消息放行到正常 Agent 流程。事实源来自
`src/QueryMind/server/base/chat_handler.py`、
`src/QueryMind/server/fastapi/routes.py`、
`src/QueryMind/core/agent/agent.py`、
`src/QueryMind/core/workflow/base.py`、
`src/QueryMind/core/workflow/default.py`、
`src/QueryMind/core/workflow/schema_init_workflow.py`、
`src/QueryMind/core/workflow/schema_management_workflow.py`、
`src/QueryMind/core/workflow/composite.py` 和 `src/my_agent.py`。

## 场景

用户打开新会话，发送 `/help`、`/init_schema`、`/schema_list` 这类确定性命令，
或者直接发一条普通 query。workflow 层会先判断这一轮是否应当短路。

这里的关键不是“让模型记住规则”，而是把规则显式写进路由层。

## 发生了什么

1. `ChatHandler._create_request_context()` 会复制请求 metadata，并注入
   `allow_metadata_query`。
2. `Agent._send_message()` 先解析用户，再判断是不是 starter UI 请求：
   空消息，或者 `request_context.metadata["starter_ui_request"] = True`。
3. starter UI 分支会调用 `workflow_handler.get_starter_ui(...)`。
4. 普通消息分支会先加载或创建 conversation，再调用
   `workflow_handler.try_handle(...)`。
5. `CompositeWorkflowHandler` 按 `src/my_agent.py` 的顺序调用：
   `DefaultWorkflowHandler` -> `SchemaInitWorkflow` -> `SchemaManagementWorkflow`。
6. 第一个返回 `should_skip_llm=True` 的 handler 会直接接管这一轮。
7. 如果所有 handler 都返回 `should_skip_llm=False`，消息才会进入
   常规的 `ToolContext` / prompt chain / LLM / tool loop。

## ASCII 框图

下面这张图把 deterministic workflow routing 串成一个完整闭环。

```text
+====================================================================================================+
| 0) ChatHandler._create_request_context()                                                           |
|----------------------------------------------------------------------------------------------------|
| 输入：ChatRequest.message / metadata / conversation_id / request_id                               |
| 逻辑：                                                                                             |
|   - 复制 `request.metadata`                                                                        |
|   - 注入 `allow_metadata_query`                                                                    |
|   - 构造 `RequestContext(metadata=..., user=..., conversation_id=..., request_id=...)`            |
| 输出：后续 Agent 拿到带标志位的请求上下文                                                            |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 1) Agent._send_message()                                                                           |
|----------------------------------------------------------------------------------------------------|
| 逻辑：                                                                                             |
|   - `resolve_user(request_context)`                                                                |
|   - 判断是否 starter UI 请求：空消息或 `starter_ui_request=true`                                   |
|   - starter UI -> 加载/创建 conversation -> `workflow_handler.get_starter_ui(...)` -> 流式输出组件 / 自动保存 / 返回 |
|   - 普通消息 -> 加载/创建 conversation，然后调用 `workflow_handler.try_handle(...)`               |
| 输出：要么直接返回 starter UI，要么进入确定性 workflow 路由                                         |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 2) CompositeWorkflowHandler                                                                        |
|----------------------------------------------------------------------------------------------------|
| 逻辑：                                                                                             |
|   - `get_starter_ui(...)`：逐个收集所有 handler 的 starter UI 并合并                             |
|   - `try_handle(...)`：按 `src/my_agent.py` 的顺序执行                                             |
|       1. `DefaultWorkflowHandler`                                                                  |
|       2. `SchemaInitWorkflow`                                                                      |
|       3. `SchemaManagementWorkflow`                                                                |
|   - 第一个 `should_skip_llm=True` 的结果会直接返回                                                 |
| 输出：starter UI 合集，或者一个 `WorkflowResult`                                                    |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 3) WorkflowResult -> Agent 收尾                                                                    |
|----------------------------------------------------------------------------------------------------|
| `should_skip_llm=true`：                                                                           |
|   - 可选执行 `conversation_mutation`                                                               |
|   - 流式输出 `components`                                                                          |
|   - 保存 conversation                                                                              |
|   - 直接返回，不进入 LLM                                                                           |
| `should_skip_llm=false`：                                                                         |
|   - 把用户消息写入 history                                                                         |
|   - 继续 `ToolContext` / prompt chain / tool loop                                                  |
| 真实效果：slash command 和 starter UI 都在 LLM 前短路                                             |
+====================================================================================================+
```

## 命令覆盖

- `DefaultWorkflowHandler.try_handle()` 处理：
  - `/help`
  - `/status`
  - `/memories`
  - `/recent_memories`
  - `/delete <memory_id>`
- `SchemaInitWorkflow.try_handle()` 处理：
  - `/init_schema`
  - `/init_schema force`
- `SchemaManagementWorkflow.try_handle()` 处理：
  - `/schema_list`
  - `/schema_list incomplete`
  - `/schema_detail <table>`
  - `/schema_detail <schema>.<table>`
  - `/schema_enrich`
  - `/schema_enrich <table>`

这些 handler 都是确定性的：命中就返回 `WorkflowResult(should_skip_llm=True)`，
没命中就放行到 LLM。

## Starter UI

starter UI 也是 workflow 的一部分，不需要用户先发消息。

- `DefaultWorkflowHandler.get_starter_ui()` 会读取 `agent.tool_registry.get_schemas(user)`，
  再根据工具集合和角色生成欢迎卡或 setup 卡。
- `SchemaInitWorkflow.get_starter_ui()` 只在 admin 且 extractor 已配置时返回内容。
- `SchemaManagementWorkflow.get_starter_ui()` 只对 admin 返回 schema 管理入口。
- `CompositeWorkflowHandler.get_starter_ui()` 会把各个 handler 返回的组件合并成一个列表。

在 `src/my_agent.py` 里，这三个 handler 被挂成：

`DefaultWorkflowHandler()` -> `SchemaInitWorkflow(...)` -> `SchemaManagementWorkflow(...)`

所以默认命令会先被消费，schema 管理命令随后接管，starter UI 也能同时拼装。

## 为什么重要

- 它把“确定性命令”从自然语言推理里拆出来，避免浪费 LLM 调用。
- 它把角色权限、schema 初始化和 schema 管理都放在可审计的路由层。
- 它让新会话可以直接返回 starter UI，而不是空白输入框。
- 它把“不匹配的消息”明确放回正常 Agent 流程，边界很清楚。

## 源码文件

- [`src/QueryMind/server/base/chat_handler.py`](../../../src/QueryMind/server/base/chat_handler.py)
- [`src/QueryMind/server/fastapi/routes.py`](../../../src/QueryMind/server/fastapi/routes.py)
- [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py)
- [`src/QueryMind/core/workflow/base.py`](../../../src/QueryMind/core/workflow/base.py)
- [`src/QueryMind/core/workflow/default.py`](../../../src/QueryMind/core/workflow/default.py)
- [`src/QueryMind/core/workflow/schema_init_workflow.py`](../../../src/QueryMind/core/workflow/schema_init_workflow.py)
- [`src/QueryMind/core/workflow/schema_management_workflow.py`](../../../src/QueryMind/core/workflow/schema_management_workflow.py)
- [`src/QueryMind/core/workflow/composite.py`](../../../src/QueryMind/core/workflow/composite.py)
- [`src/my_agent.py`](../../../src/my_agent.py)
