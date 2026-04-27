# 工具系统

工具系统为 QueryMind 提供了定义、注册和执行工具的框架，让 LLM 可以调用来执行查询数据库、生成可视化或管理内存等操作。本页解释 QueryMind 如何把一次 LLM 工具调用转成一个安全、类型明确、可展示的动作。

## 设计原则

- 工具类只负责能力本身，尽量保持小而专注。
- 策略放在注册表里统一管理，这样同一个工具可以在不同场景下复用。
- 先做模型校验，再做任何副作用。
- 同一次调用同时返回推理文本和 UI 结果。
- 把数据产物也当作一等输出，而不只是聊天文本。

这样的拆分让流程更确定：模型先提出动作，注册表再校验并可选择改写，工具负责领域动作，最后结果同时喂给 LLM 和前端。

## Tool Registry

注册表是工具系统的控制平面。工具类本身保持简单，注册表决定哪些工具可见、哪些可执行，以及参数是否需要在执行前做策略性变换。

这样设计的原因：
- 工具类描述的是能力，不是策略。
- 同一个实现可以在 demo、评测和生产环境中用不同方式注册。
- 访问组提供了一种紧凑、便于审计的权限模型。
- `ToolResult` 把“推理输出”和“UI 输出”解耦开来。

工具契约中的核心模型：
- `ToolCall`：LLM 的原始调用，包含 `id`、`name` 和 `arguments`。
- `ToolContext`：执行上下文，包含 `user`、`conversation_id`、`request_id`、`agent_memory`、`metadata`、可选 observability，以及 schema 能力。
- `ToolResult`：`success`、`result_for_llm`、可选 `ui_component`、可选 `error`，以及自由形式 `metadata`。
- `ToolRejection`：当策略判断“不应执行”时，由 `transform_args()` 返回。

## Tool Execution Pipeline

### Execution Flow Diagram^
```text
┌──────────────────────────────┐
│ 1. LLM 提出工具调用         │
│    名称 + 原始参数           │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ 2. 注册表接管这次调用       │
│    查找、权限、校验、策略    │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ 3. 工具用类型化参数执行      │
│    tool.execute(context,...) │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ 4. 结果双通道返回            │
│    LLM 文本 + UI 负载        │
└──────────────────────────────┘
```

### Tool Lookup
`ToolRegistry.execute()` 会按名称解析工具。如果工具不存在，注册表返回失败的 `ToolResult`，而不是直接抛异常，这样 Agent 循环可以继续运行。

### Permission Validation^
```text
┌──────────────────────┐      ┌──────────────────────┐
│ user.group_memberships│      │ tool.access_groups    │
│ 示例：               │      │ 示例：               │
│ ["user","admin"]     │      │ [] / ["admin"]       │
└──────────┬───────────┘      └──────────┬───────────┘
           │                             │
           └──────────────┬──────────────┘
                          ▼
                ┌──────────────────────┐
                │ access_groups 为空？  │
                │ 是 -> 公开工具       │
                │ 否 -> 检查交集       │
                └──────────┬───────────┘
                           ▼
                 共享组存在 -> 允许
                 否则         -> 拒绝
```

这套检查在两个地方复用：
- `get_schemas(user)` 会隐藏用户无权访问的工具。
- `execute()` 会阻止无权限的运行时调用。

当 `AuditConfig.log_tool_access_checks` 开启时，允许和拒绝都会写入审计日志。

### Argument Validation & Transformation^
```text
┌──────────────────────────────┐
│ raw tool_call.arguments      │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Pydantic 校验                │
│ model_validate(...)          │
└───────┬──────────────────────┘
        │ 通过            │ 失败
        ▼                 ▼
┌──────────────────────┐  ┌──────────────────────┐
│ typed args 对象       │  │ invalid arguments    │
└──────────┬───────────┘  │ ToolResult           │
           ▼              └──────────────────────┘
┌──────────────────────────────┐
│ transform_args()             │
│ 可在此做策略改写             │
└───────┬──────────────────────┘
        │ 接受            │ ToolRejection
        ▼                 ▼
┌──────────────────────┐  ┌──────────────────────┐
│ final args            │  │ 被拒绝的 ToolResult  │
└──────────┬───────────┘  └──────────────────────┘
           ▼
┌──────────────────────────────┐
│ tool.execute(context, args)  │
└──────────────────────────────┘
```

基础注册表不做参数变换。只有在需要 SQL 改写、脱敏、按用户过滤等策略能力时，子类才覆盖 `transform_args()`。这正是工具层和策略层的关键分界：类型校验只做一次，策略决策集中处理，工具本身只负责领域动作。

### Tool Execution
- `tool.execute()` 一直使用 context-first 签名：`tool.execute(context, args)`。
- 执行时间通过 `time.perf_counter()` 测量，并写入 `result.metadata["execution_time_ms"]`。
- 未处理异常会被转换成失败的 `ToolResult`。
- Rich UI 输出放在 `ToolResult.ui_component` 中，同时保留一个简单文本兜底。

### Auditing (Optional)
- `AuditConfig` 控制访问检查、调用、结果和参数脱敏。
- `log_tool_invocation()` 可以在写日志前脱敏敏感参数。
- `ui_features_available` 会从 `context.metadata` 读取并写入调用日志。
- 访问检查、调用、结果和拒绝都有独立的审计事件。

## Tool Registry Use Case: RLS Protection

`RLSToolRegistry` 是 `transform_args()` 最典型的例子。行级安全属于跨工具的策略逻辑，不应该塞进 `RunSqlTool` 里；放到注册表层可以让 SQL 工具保持可复用，也让不同部署能替换不同策略。

当前的策略流水线是：
1. 先拒绝明显的 SQL 注入模式，
2. 再限制查询复杂度，
3. 再给符合条件的 `SELECT` 查询加 territory 过滤，
4. 最后执行改写后的 SQL。

这个顺序很重要。QueryMind 会在触碰数据库前先挡住不安全输入，并在执行前完成行级约束。

这样设计的原因：
- 元数据查询被刻意放行，因为 schema 检索依赖它。
- Territory 权限用业务组来表达，而不是直接写死 SQL 片段。
- 如果用户没有任何可访问 territory，注册表会把查询改写成返回空结果，而不是把责任丢给调用方。
- 同一个 SQL 工具可以通过替换注册表配置，在评测、demo 和生产环境中复用。

策略参考见 [Security & Access Control](./security.md#rls-protection-module)。

## Toolkits

下表列出源码中当前可用的内置工具。`默认访问` 一列展示的是工具自身的 `access_groups` 值；具体部署仍然可以在注册时进一步收紧权限。

| 分类 | 工具 | 主要用途 | 关键行为 | 默认访问 |
|------|------|----------|----------|----------|
| SQL | `schema_retrieve` | 在写 SQL 前检索相关表结构 | 支持 `hybrid`、`vector`、`graph`、`expand`；支持 `graph_hint`、`required_fields`、`seed_tables`、`similarity_threshold` 和 `limit`；返回 schema 元数据和 rich UI | 公开 |
| SQL | `run_sql` | 执行 SQL 并落盘查询结果 | 使用注入式 `SqlRunner`；`SELECT` 会写 CSV 并返回 dataframe UI；非 `SELECT` 返回受影响行数摘要；LLM 预览会截断到 1000 字符 | 公开 |
| 记忆 | `save_question_tool_args` | 保存一次成功的 question/tool/args 组合 | 将成功路径写入 `AgentMemory`，在记忆后端不可用时也能优雅降级 | 公开 |
| 记忆 | `search_saved_correct_tool_uses` | 搜索历史成功工具用法 | 对 agent memory 做相似度检索，并在 UI 功能开启时显示详细记忆卡片 | 公开 |
| 记忆 | `save_text_memory` | 保存自由文本笔记或观察 | 持久化文本记忆，在后端健康时返回保存 id | 公开 |
| 文件系统 | `list_files` | 列出工作区目录内容 | 基于用户隔离工作区返回文件列表卡片 | 公开 |
| 文件系统 | `search_files` | 按文件名或内容搜索文件 | 支持 `query`、`include_content` 和 `max_results`；返回路径和片段 | 公开 |
| 文件系统 | `read_file` | 读取文件内容 | 同时以文本和 UI 形式返回完整文件内容 | 公开 |
| 文件系统 | `write_file` | 写入或覆盖文件 | 支持 overwrite 标志，并返回成功通知 | 公开 |
| 文件系统 | `edit_file` | 对文件做行级编辑 | 接收一个或多个编辑区间，返回 diff 风格结果 | 公开 |
| Python | `run_python_file` | 在工作区解释器中执行 Python 脚本 | 支持脚本参数和超时控制，在工作区 shell 内执行 | 公开 |
| Python | `pip_install` | 安装 Python 包 | 以 `python -m pip install` 方式运行，可选 upgrade、额外参数和超时 | 公开 |
| 可视化 | `visualize_data` | 从 CSV 文件生成图表 | 读取 CSV，自动选择合适图表类型，并返回图表组件和摘要文本 | 公开 |

### Tool Notes
下面按工具逐个说明，先讲功能，再补充少量实现逻辑。

#### SQL 执行
##### RunSqlTool
`RunSqlTool` 使用 `SqlRunner` 抽象模式在数据库上执行 SQL 查询，并支持数据库连接与文件存储的依赖注入。

Key Features:
- Dependency injection: 接受 `SqlRunner` 实现，例如 `SqliteRunner`、`PostgresRunner`
- File system integration: 可选 `FileSystem` 用于保存查询结果，默认使用 `LocalFileSystem`
- Custom naming: 支持 `custom_tool_name` 和 `custom_tool_description`
- Query type handling: 对 `SELECT` 与非 `SELECT` 采用不同处理方式
- Result truncation: 将面向 LLM 的结果预览限制在 1000 字符以内
- CSV export: 将 `SELECT` 结果保存为 CSV，供下游工具复用
- UI output: 查询结果返回 dataframe 风格 UI，写操作返回通知型 UI
- Metadata: 记录行数、列名、查询类型和输出文件名

Behavior:
- `SELECT` 查询会转成 dataframe 记录，写入 `query_results_<id>.csv`，并返回 dataframe 风格 UI。
- 非 `SELECT` 查询返回受影响行数摘要和简洁的成功通知。
- 大结果集会在 LLM 预览中截断，但完整 CSV 会保留在磁盘上。
- 失败会以结构化错误结果返回，而不是直接抛异常。

实际使用中，`run_sql` 负责回答当前问题，并留下可被下游工具继续使用的 CSV 产物。

##### SchemaRetrieveTool
`SchemaRetrieveTool` 会先从 `SchemaMemory` 中检索相关表结构，再让模型继续写 SQL。它是 `RunSqlTool` 的 schema 发现搭档。

Key Features:
- Search modes: `hybrid`、`vector`、`graph`、`expand`
- Query controls: `graph_hint`、`required_fields`、`seed_tables`、`similarity_threshold`、`limit`
- Context awareness: 可以合并 `context.metadata["schema_retrieve_context"]` 中的 seed tables
- Output shape: 返回选中的表引用、检索元数据和 rich schema UI

Behavior:
- `search_mode=None` 时默认使用 `hybrid`
- `graph_hint` 和 `seed_tables` 可将检索引导到扩展式查找
- 结果结构足够让 LLM 和用户从不同视角查看同一份 schema

这两个工具组合起来，就是一个实际可用的“先发现，再执行”流程：schema retrieval 先缩小搜索空间，SQL execution 再产出数据结果。

#### 记忆工具
##### SaveQuestionToolArgsTool
`SaveQuestionToolArgsTool` 用来保存一次成功的 question/tool/args 组合。它记住的是“什么路径有效”，而不是只记住提问内容。

Key Features:
- 将成功用法写入 `AgentMemory`
- 当记忆后端不可用时可优雅降级
- 返回简短成功信息和状态型 UI 更新

##### SearchSavedCorrectToolUsesTool
`SearchSavedCorrectToolUsesTool` 会根据问题搜索相似的成功工具用法。它帮助模型复用已有的正确模式，而不是每次都从头推导。

Key Features:
- 对 agent memory 做相似度检索
- 支持 `limit`、`similarity_threshold`、`tool_name_filter`
- 在 `UiFeature.UI_FEATURE_SHOW_MEMORY_DETAILED_RESULTS` 开启时显示详细记忆卡片
- 记忆为空或降级时返回安全的回退消息

##### SaveTextMemoryTool
`SaveTextMemoryTool` 用于保存自由文本笔记、观察或定义。

Key Features:
- 保存普通文本记忆
- 在后端健康时返回保存后的 id
- 记忆后端不可用时优雅跳过持久化

#### 文件系统工具
##### ListFilesTool
`ListFilesTool` 用于列出用户隔离工作区中的目录内容。

Key Features:
- 使用注入式文件系统服务
- 遵守按用户隔离的工作区边界
- 以卡片形式返回目录内容摘要

##### SearchFilesTool
`SearchFilesTool` 按文件名或内容搜索文件。

Key Features:
- 支持 `query`、`include_content`、`max_results`
- 返回文件路径和可选文本片段
- 适合做仓库导航和产物定位

##### ReadFileTool
`ReadFileTool` 用于读取文件内容。

Key Features:
- 通过注入式文件系统读取文件
- 同时返回文本和 UI 结果
- 适合直接检查已知文件

##### WriteFileTool
`WriteFileTool` 用于写入文件内容，并支持覆盖。

Key Features:
- 支持新建或覆盖文件
- 使用注入式文件系统
- 完成写入后返回成功通知

##### EditFileTool
`EditFileTool` 用于对已有文件做行级编辑。

Key Features:
- 接收一个或多个明确的编辑区间
- 返回 diff 风格结果，便于人工检查
- 比整文件重写更适合外科手术式修改

#### Python 执行
##### RunPythonFileTool
`RunPythonFileTool` 在工作区解释器中执行 Python 文件。

Key Features:
- 支持脚本参数和可选超时
- 通过工作区文件系统执行
- 在结果中返回命令、stdout、stderr 和退出码

##### PipInstallTool
`PipInstallTool` 用于在工作区环境中安装 Python 包。

Key Features:
- 支持包列表、升级模式和额外参数
- 实际调用 `python -m pip install`
- 返回可检查的命令结果卡片

#### 可视化
##### VisualizeDataTool
`VisualizeDataTool` 会读取 CSV 文件，解析成 DataFrame，并生成图表。

Key Features:
- 使用注入式文件系统读取 CSV 产物
- 使用 `PlotlyChartGenerator` 自动选择合适图表类型
- 同时返回 rich chart component 和简洁摘要文本
- 对文件不存在和 CSV 解析错误返回结构化失败

### Creating Custom Tools
自定义工具最好保持狭窄、类型明确，并对副作用保持克制。如果一个能力需要按用户做策略判断，优先把逻辑放到注册表里，而不是塞进工具本体。

一个最小形态如下：
```python
from typing import Type

from pydantic import BaseModel

from QueryMind.core.tool import Tool, ToolContext, ToolResult


class MyToolArgs(BaseModel):
    query: str


class MyTool(Tool[MyToolArgs]):
    @property
    def name(self) -> str:
        return "my_tool"

    @property
    def description(self) -> str:
        return "Do one focused thing"

    def get_args_schema(self) -> Type[MyToolArgs]:
        return MyToolArgs

    async def execute(self, context: ToolContext, args: MyToolArgs) -> ToolResult:
        return ToolResult(success=True, result_for_llm="done")
```

最重要的设计规则很简单：工具保持薄，策略保持集中，所有用户感知的改写或拦截都交给注册表来负责。


<details open>
<summary>相关源码文件</summary>

- [`src/QueryMind/core/registry.py`](../../../src/QueryMind/core/registry.py) - 工具注册表、schema 过滤与执行策略
- [`src/QueryMind/core/tool/base.py`](../../../src/QueryMind/core/tool/base.py) - 工具基类接口与 schema 生成
- [`src/QueryMind/core/tool/models.py`](../../../src/QueryMind/core/tool/models.py) - `ToolCall`、`ToolContext`、`ToolResult`、`ToolSchema` 与 `ToolRejection`
- [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py) - 构建 `ToolContext` 并驱动 Agent 循环中的工具执行
- [`src/QueryMind/core/agent/config.py`](../../../src/QueryMind/core/agent/config.py) - feature group 访问规则与工具相关运行时默认值
- [`src/QueryMind/core/audit/base.py`](../../../src/QueryMind/core/audit/base.py) - 工具事件的 audit logger 接口
- [`src/QueryMind/core/audit/models.py`](../../../src/QueryMind/core/audit/models.py) - audit 事件模型与载荷
- [`src/QueryMind/core/hook/base.py`](../../../src/QueryMind/core/hook/base.py) - 工具执行前后的生命周期钩子
- [`src/QueryMind/core/middleware/base.py`](../../../src/QueryMind/core/middleware/base.py) - 处理请求/响应的 LLM middleware 接口
- [`src/QueryMind/core/recovery/base.py`](../../../src/QueryMind/core/recovery/base.py) - 工具执行失败时的错误恢复接口
- [`src/QueryMind/core/recovery/default.py`](../../../src/QueryMind/core/recovery/default.py) - 默认重试/退避恢复策略
- [`src/QueryMind/tools/agent_memory.py`](../../../src/QueryMind/tools/agent_memory.py) - agent memory 工具集合
- [`src/QueryMind/tools/file_system.py`](../../../src/QueryMind/tools/file_system.py) - 文件系统工具
- [`src/QueryMind/tools/python.py`](../../../src/QueryMind/tools/python.py) - Python 执行与包安装工具
- [`src/QueryMind/tools/run_sql.py`](../../../src/QueryMind/tools/run_sql.py) - 基于 `SqlRunner` 的 SQL 执行工具
- [`src/QueryMind/tools/schema_retrieve.py`](../../../src/QueryMind/tools/schema_retrieve.py) - 用于表发现与扩展的 schema 检索工具
- [`src/QueryMind/tools/visualize_data.py`](../../../src/QueryMind/tools/visualize_data.py) - 数据可视化工具
- [`src/QueryMind/capabilities/agent_memory/base.py`](../../../src/QueryMind/capabilities/agent_memory/base.py) - agent memory 能力接口
- [`src/QueryMind/capabilities/file_system/base.py`](../../../src/QueryMind/capabilities/file_system/base.py) - 文件系统能力接口
- [`src/QueryMind/capabilities/schema_memory/base.py`](../../../src/QueryMind/capabilities/schema_memory/base.py) - schema memory 能力接口
- [`src/QueryMind/capabilities/schema_management/base.py`](../../../src/QueryMind/capabilities/schema_management/base.py) - schema management 能力接口
- [`src/QueryMind/capabilities/sql_runner/base.py`](../../../src/QueryMind/capabilities/sql_runner/base.py) - `RunSqlTool` 使用的 SQL runner 抽象

</details>