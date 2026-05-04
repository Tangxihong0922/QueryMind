# 工具系统

本页说明 QueryMind 如何把一次 LLM 工具调用转成一个可以被校验、
执行并回传给用户的结构化动作。

工具层拆成三部分：

- execution，放在具体工具类里；
- policy，放在 registry 里；
- presentation，放在 `ToolResult.ui_component` 里。

## 工具契约

核心运行时模型包括：

- `ToolCall`，承载原始 LLM 工具请求；
- `ToolContext`，承载执行所需的用户、会话、请求、记忆和 schema 能力；
- `ToolResult`，承载返回给 LLM 的文本、可选 UI 输出和执行元数据；
- `ToolSchema`，承载面向 LLM 的工具描述；
- `ToolRejection`，表示策略层拒绝了这次调用。

`ToolContext` 还包含当前运行时会用到的字段，包括：

- `raw_user_message`
- `agent_memory`
- `metadata`
- `observability_provider`
- `schema_memory`
- `schema_management_service`
- 用于 UI 渲染的 schema 搜索默认值

## Registry 的职责

`ToolRegistry` 是工具系统的控制平面。

它决定：

- 注册哪些工具；
- 哪些工具对用户可见；
- 哪些工具可以执行；
- 参数在执行前是否需要变换；
- 如何记录访问拒绝和执行日志。

### 可见性与执行

registry 用 `access_groups` 同时控制 schema 可见性和运行时执行。

规则很简单：

- `access_groups` 为空表示公开；
- 否则用户必须和工具共享至少一个 group。

同一套检查既用于生成 tool schema，也用于执行 tool call。

### 参数校验

执行流程是统一的：

1. 按名字解析工具。
2. 校验用户是否有访问权限。
3. 用 Pydantic 校验原始参数。
4. 如果 registry 子类需要策略改写，则执行 `transform_args()`。
5. 用类型化参数调用工具。
6. 返回 `ToolResult`。

默认的 `transform_args()` 是 no-op。子类可以把它用于 SQL 改写、脱敏或按用户过滤等部署级策略。

### 审计

registry 可以记录访问检查、工具调用、工具结果和拒绝事件。审计层是可选的，但它是 registry 契约的一部分。

## 工具执行流水线

这一节只讲 tool execution 本身。
`prompt-chain.md` 负责 prompt 组装，`context.md` 负责 conversation 读取和消息编排。

```text
+====================================================================================================+
| 1) assistant.message.tool_calls                                                                    |
|----------------------------------------------------------------------------------------------------|
| input: LLM 已经在 prompt chain 之后产出一组 tool_calls                                             |
| sql_126 真实调用序列:                                                                              |
|   - schema_retrieve: query="employees with SalariedFlag and BusinessEntityID", search_mode=hybrid |
|   - schema_retrieve: query="employee table with SalariedFlag and BusinessEntityID", search_mode=vector |
|   - schema_retrieve: query="HumanResources Employee", search_mode=hybrid                           |
|   - run_sql: SELECT table_schema, table_name ... WHERE table_name LIKE '%employee%' ...            |
|   - run_sql: SELECT column_name, data_type ... humanresources.employee ...                         |
|   - run_sql: SELECT BusinessEntityID, SalariedFlag ... ORDER BY CASE ...                           |
| output: 进入 tool execution loop                                                                    |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 2) ToolRegistry.execute(tool_call, context)                                                        |
|----------------------------------------------------------------------------------------------------|
| logic:                                                                                             |
|   - 按 name 解析 tool                                                                              |
|   - 检查 access_groups                                                                             |
|   - 组装 base_metadata: tool_name / tool_call_id / conversation_id / request_id / dialect         |
|   - 记录 audit / access check（如果启用）                                                           |
| output: concrete tool 或 ToolRejection                                                             |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 3) Pydantic 参数校验                                                                               |
|----------------------------------------------------------------------------------------------------|
| logic:                                                                                             |
|   - tool.get_args_schema().model_validate(tool_call.arguments)                                     |
|   - invalid arguments -> ToolResult(success=False, error="Invalid arguments: ...")                |
| sql_126: 6 个调用都通过了参数模型校验                                                              |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 4) RLSToolRegistry.transform_args()                                                                |
|----------------------------------------------------------------------------------------------------|
| scope: 仅 `run_sql`                                                                                |
| logic:                                                                                             |
|   - SQL injection check                                                                            |
|   - query complexity check                                                                         |
|   - SQL semantics check                                                                            |
|   - territory-based RLS rewrite（如配置开启）                                                       |
|   - SQL governance / freeze check                                                                  |
| sql_126: trace 中没有 rejection；`run_sql` 使用的 SQL 就是工具请求里的 SQL                         |
| output: 通过后的 typed args 或 ToolRejection                                                       |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 5) concrete tool.execute(context, args)                                                            |
|----------------------------------------------------------------------------------------------------|
| 5a schema_retrieve.execute()                                                                       |
|   - SearchMode -> SchemaMemory.search_schema(...)                                                  |
|   - format LLM text summary                                                                        |
|   - build SchemaRetrieveCardComponent                                                              |
|   - metadata: query / search_mode / total_results / selected_tables / graph_hint                   |
|                                                                                                    |
| 5b run_sql.execute()                                                                               |
|   - SqlRunner.run_sql(args, context)                                                               |
|   - SELECT -> DataFrame -> CSV export -> truncated preview                                         |
|   - ui_component = DataFrameComponent + SimpleTextComponent                                        |
|   - metadata: row_count / columns / results / output_file / executed_sql                           |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 6) ToolResult -> after_tool hooks -> conversation                                                   |
|----------------------------------------------------------------------------------------------------|
| ToolResult fields:                                                                                 |
|   - success                                                                                       |
|   - result_for_llm                                                                                 |
|   - ui_component                                                                                   |
|   - error                                                                                         |
|   - metadata                                                                                      |
| after_tool hooks:                                                                                  |
|   - SchemaGovernanceHook updates schema_retrieve state                                             |
|   - SqlGovernanceHook updates run_sql state                                                        |
| conversation append:                                                                               |
|   - assistant message with tool_calls is already in the conversation                               |
|   - tool messages are appended next                                                                |
|   - next LLM turn reads the updated conversation                                                   |
+====================================================================================================+
```

## sql_126 真实轨迹

下面这组值来自一次成功查询的真实评估结果与运行日志。

```text
+====================================================================================================+
| schema_retrieve executor                                                                           |
|----------------------------------------------------------------------------------------------------|
| #1 args: query="employees with SalariedFlag and BusinessEntityID", search_mode="hybrid"          |
|    result_for_llm: "【Schema Retrieval Results】Mode: hybrid"                                      |
|    metadata.total_results = 10                                                                     |
|    metadata.selected_tables preview:                                                               |
|      adventureworks.person.phonenumbertype                                                         |
|      adventureworks.sales.countryregioncurrency                                                    |
|      adventureworks.sales.currency                                                                 |
|      adventureworks.person.countryregion                                                           |
|      ... (+6 more)                                                                                 |
|                                                                                                    |
| #2 args: query="employee table with SalariedFlag and BusinessEntityID", search_mode="vector"      |
|    result_for_llm: "No table schemas found matching 'employee table with SalariedFlag and BusinessEntityID'" |
|    metadata.total_results = 0                                                                      |
|                                                                                                    |
| #3 args: query="HumanResources Employee", search_mode="hybrid"                                    |
|    result_for_llm: "【Schema Retrieval Results】Mode: hybrid"                                      |
|    metadata.total_results = 10                                                                     |
|    metadata.selected_tables preview:                                                               |
|      adventureworks.sales.salespersonquotahistory                                                  |
|      adventureworks.sales.personcreditcard                                                         |
|      adventureworks.sales.salesterritoryhistory                                                    |
|      adventureworks.person.countryregion                                                           |
|      ... (+6 more)                                                                                 |
|    hook: SchemaGovernanceHook -> lock_reason=enough_schema                                         |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| run_sql executor                                                                                   |
|----------------------------------------------------------------------------------------------------|
| #4 args: SELECT table_schema, table_name                                                           |
|         FROM information_schema.tables                                                             |
|         WHERE table_name LIKE '%employee%'                                                         |
|         ORDER BY table_schema, table_name;                                                         |
|                                                                                                    |
| #5 args: SELECT column_name, data_type                                                             |
|         FROM information_schema.columns                                                            |
|         WHERE table_schema = 'humanresources'                                                      |
|           AND table_name = 'employee'                                                              |
|         ORDER BY ordinal_position;                                                                 |
|                                                                                                    |
| #6 args: SELECT BusinessEntityID, SalariedFlag                                                     |
|         FROM humanresources.employee                                                                |
|         ORDER BY                                                                                    |
|             CASE WHEN SalariedFlag = true THEN 0 ELSE 1 END,                                       |
|             CASE WHEN SalariedFlag = true THEN BusinessEntityID END DESC,                          |
|             CASE WHEN SalariedFlag = false THEN BusinessEntityID END ASC;                          |
|                                                                                                    |
| result_for_llm: truncated CSV preview + runtime CSV handoff                                        |
| metadata.row_count = 290                                                                           |
| metadata.columns = ["businessentityid", "salariedflag"]                                            |
| preview_rows[0] = {"businessentityid": 290, "salariedflag": true}                                  |
| preview_rows[1] = {"businessentityid": 289, "salariedflag": true}                                  |
| ui_component = DataFrameComponent + SimpleTextComponent                                            |
+====================================================================================================+
```

关键边界是：策略必须先于具体工具执行。
工具本身应该只负责领域动作。

## 内置工具分组

当前源码里包含这些工具分组：

- SQL 工具：`schema_retrieve`、`run_sql`
- 记忆工具：`save_question_tool_args`、`search_saved_correct_tool_uses`、
  `save_text_memory`
- 文件系统工具：`list_files`、`search_files`、`read_file`、`write_file`、
  `edit_file`
- Python 工具：`run_python_file`、`pip_install`
- 可视化工具：`visualize_data`

## SQL 工具

### `schema_retrieve`

`schema_retrieve` 会先从 `SchemaMemory` 里检索相关表结构，再继续写 SQL。

它支持：

- `hybrid`、`vector`、`graph` 和 `expand` 四种搜索模式；
- 用于 domain、fields、expand 意图的 `graph_hint`；
- `required_fields`、`seed_tables`、`domain_filter`、`limit` 和
  `similarity_threshold`。

这个工具会返回：

- 给 LLM 使用的文本摘要；
- rich schema UI 组件；
- 包含选中表、搜索模式和 graph hint 的 metadata。

### `run_sql`

`run_sql` 通过注入式 `SqlRunner` 执行 SQL。

它支持：

- 数据库 runner 的依赖注入；
- 查询结果的可选文件系统持久化；
- `SELECT` 和非 `SELECT` 的不同处理；
- 将返回行结果导出为 CSV；
- 面向结果集的 dataframe 风格 UI；
- 面向写操作的通知型 UI；
- 供下游步骤使用的结构化 metadata。

这个工具会把大结果集写入 CSV，给 LLM 返回截断后的预览，并保存
row count、columns、输出文件名等执行元数据。

## 记忆工具

### `save_question_tool_args`

保存一次成功的 question/tool/args 组合，供之后复用。

### `search_saved_correct_tool_uses`

搜索过去类似的成功工具用法，让模型复用已知的正确模式。

### `save_text_memory`

把自由文本笔记或观察保存成持久化 text memory。

## 文件系统工具

文件系统工具属于标准工作区工具：

- `list_files` 列出目录中的文件；
- `search_files` 按文件名或内容搜索；
- `read_file` 读取文件内容；
- `write_file` 写入或覆盖文件；
- `edit_file` 以行级方式编辑文件。

这些工具可在多个工作流中复用，本页不展开治理策略。

## Python 工具

Python 工具用于在工作区中执行代码：

- `run_python_file`
- `pip_install`

它们负责脚本执行和依赖安装，不属于 prompt 层内容。

## 可视化工具

`visualize_data` 会把 CSV 转成图表和 UI 组件。

它属于工具目录，因为它是运行时能力，而不是 prompt 组装的一部分。

## 本页覆盖什么

- 工具契约；
- registry 策略和访问控制；
- 执行校验与参数变换；
- 内置工具目录；
- SQL、记忆、文件系统、Python 和可视化工具。

## 本页不覆盖什么

- prompt 组装；
- schema governance 策略；
- SQL governance 状态机；
- 详细安全策略；
- memory 后端内部实现。

这些内容分别放到 prompt-chain、governance、security 和 memory 页面里。

## 源码文件

- [`src/QueryMind/core/registry.py`](../../../src/QueryMind/core/registry.py)
- [`src/QueryMind/core/tool/models.py`](../../../src/QueryMind/core/tool/models.py)
- [`src/rls_registry.py`](../../../src/rls_registry.py)
- [`src/QueryMind/tools/schema_retrieve.py`](../../../src/QueryMind/tools/schema_retrieve.py)
- [`src/QueryMind/tools/run_sql.py`](../../../src/QueryMind/tools/run_sql.py)
- [`src/QueryMind/tools/agent_memory.py`](../../../src/QueryMind/tools/agent_memory.py)
- [`src/evals/resume_points/20260428_085122_0315d6e9/run.log`](../../../src/evals/resume_points/20260428_085122_0315d6e9/run.log)
- [`src/evals/eval_results/20260428_085122_0315d6e9_deepseek_v4_flash/evaluation_report.json`](../../../src/evals/eval_results/20260428_085122_0315d6e9_deepseek_v4_flash/evaluation_report.json)
