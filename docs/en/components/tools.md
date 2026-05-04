# Tool Systems

This page explains how QueryMind turns an LLM tool call into a typed action
that can be validated, executed, and rendered back to the user.

The tool layer is split into three responsibilities:

- execution, which lives in the concrete tool class;
- policy, which lives in the registry;
- presentation, which lives in `ToolResult.ui_component`.

## Tool Contract

The core runtime models are:

- `ToolCall`, which carries the raw LLM tool request;
- `ToolContext`, which carries the user, conversation, request, memory, and
  schema capabilities needed for execution;
- `ToolResult`, which carries the LLM-facing text, optional UI output, and
  execution metadata;
- `ToolSchema`, which is the LLM-facing description of a tool;
- `ToolRejection`, which signals that a policy layer rejected the call.

`ToolContext` also carries fields used by the current runtime, including:

- `raw_user_message`
- `agent_memory`
- `metadata`
- `observability_provider`
- `schema_memory`
- `schema_management_service`
- schema search defaults for UI rendering

## Registry Responsibilities

`ToolRegistry` is the control plane of the tool system.

It decides:

- which tools are registered;
- which tools are visible to a user;
- which tools can execute;
- whether arguments should be transformed before execution;
- how access denials and executions are logged.

### Visibility and Execution

The registry uses `access_groups` for both schema visibility and runtime
execution.

The rule is simple:

- an empty access group list means public access;
- otherwise the user must share at least one group with the tool.

The same check is used when generating tool schemas and when executing a tool
call.

### Argument Validation

Execution follows a consistent path:

1. Resolve the tool by name.
2. Validate the user's access.
3. Validate the raw arguments with Pydantic.
4. Run `transform_args()` if the registry subclass needs policy-aware changes.
5. Execute the tool with typed arguments.
6. Return a `ToolResult`.

The default `transform_args()` implementation is a no-op. Subclasses can use it
for deployment-specific policies such as SQL rewriting, redaction, or per-user
filtering.

### Auditing

The registry can log access checks, tool invocations, tool results, and
denials. The audit layer is optional, but the integration point is part of the
registry contract.

## Tool Execution Pipeline

This section covers tool execution only.
`prompt-chain.md` covers prompt assembly, and `context.md` covers conversation
reads and message construction.

```text
+====================================================================================================+
| 1) assistant.message.tool_calls                                                                    |
|----------------------------------------------------------------------------------------------------|
| input: the LLM has already been constrained by the prompt chain and emits tool_calls              |
| sql_126 real call sequence:                                                                        |
|   - schema_retrieve: query="employees with SalariedFlag and BusinessEntityID", search_mode=hybrid |
|   - schema_retrieve: query="employee table with SalariedFlag and BusinessEntityID", search_mode=vector |
|   - schema_retrieve: query="HumanResources Employee", search_mode=hybrid                           |
|   - run_sql: SELECT table_schema, table_name ... WHERE table_name LIKE '%employee%' ...            |
|   - run_sql: SELECT column_name, data_type ... humanresources.employee ...                         |
|   - run_sql: SELECT BusinessEntityID, SalariedFlag ... ORDER BY CASE ...                           |
| output: enter the tool execution loop                                                               |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 2) ToolRegistry.execute(tool_call, context)                                                        |
|----------------------------------------------------------------------------------------------------|
| logic:                                                                                             |
|   - resolve the tool by name                                                                       |
|   - validate access_groups                                                                         |
|   - build base_metadata: tool_name / tool_call_id / conversation_id / request_id / dialect         |
|   - record audit / access checks when enabled                                                      |
| output: a concrete tool or a ToolRejection                                                         |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 3) Pydantic argument validation                                                                     |
|----------------------------------------------------------------------------------------------------|
| logic:                                                                                             |
|   - tool.get_args_schema().model_validate(tool_call.arguments)                                     |
|   - invalid arguments -> ToolResult(success=False, error="Invalid arguments: ...")                |
| sql_126: all 6 calls pass argument validation                                                      |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 4) RLSToolRegistry.transform_args()                                                                |
|----------------------------------------------------------------------------------------------------|
| scope: `run_sql` only                                                                              |
| logic:                                                                                             |
|   - SQL injection check                                                                            |
|   - query complexity check                                                                         |
|   - SQL semantics check                                                                            |
|   - territory-based RLS rewrite (when configured)                                                  |
|   - SQL governance / freeze checks                                                                 |
| sql_126: the trace shows no rejection; `run_sql` uses the SQL from the tool call                  |
| output: typed args or ToolRejection                                                                |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 5) concrete tool.execute(context, args)                                                            |
|----------------------------------------------------------------------------------------------------|
| 5a schema_retrieve.execute()                                                                       |
|   - SearchMode -> SchemaMemory.search_schema(...)                                                  |
|   - format the LLM summary                                                                          |
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
|   - the next LLM turn reads the updated conversation                                               |
+====================================================================================================+
```

## sql_126 Trace

The values below come from a successful evaluation run and its log output.

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

The important boundary is that policy happens before the concrete tool runs.
The tool itself should stay focused on domain work.

## Built-in Tool Groups

The current codebase includes the following tool groups:

- SQL tools: `schema_retrieve`, `run_sql`
- memory tools: `save_question_tool_args`, `search_saved_correct_tool_uses`,
  `save_text_memory`
- file system tools: `list_files`, `search_files`, `read_file`, `write_file`,
  `edit_file`
- Python tools: `run_python_file`, `pip_install`
- visualization tools: `visualize_data`

## SQL Tools

### `schema_retrieve`

`schema_retrieve` searches `SchemaMemory` for relevant table schemas before SQL
is written.

It supports:

- `hybrid`, `vector`, `graph`, and `expand` search modes;
- `graph_hint` values for domain, fields, and expand intent;
- `required_fields`, `seed_tables`, `domain_filter`, `limit`, and
  `similarity_threshold`.

The tool returns:

- a text summary for the LLM;
- a rich schema UI component;
- metadata including selected tables, search mode, and graph hint.

### `run_sql`

`run_sql` executes SQL through an injected `SqlRunner`.

It supports:

- dependency injection for the database runner;
- optional file-system persistence for query results;
- separate behavior for `SELECT` and non-`SELECT` queries;
- CSV export for row-returning queries;
- dataframe-style UI for result sets;
- notification-style UI for write operations;
- structured metadata for downstream steps.

The tool writes large result sets to CSV, returns a truncated preview to the
LLM, and stores execution metadata such as row count, columns, and output file
name.

## Memory Tools

### `save_question_tool_args`

Saves one successful question/tool/args combination for later reuse.

### `search_saved_correct_tool_uses`

Searches similar successful tool-use examples so the model can reuse a known
good pattern.

### `save_text_memory`

Saves free-form notes or observations as durable text memory.

## File System Tools

The file system tools are standard workspace utilities:

- `list_files` lists files in a workspace directory;
- `search_files` searches by file name or content;
- `read_file` reads file contents;
- `write_file` writes or overwrites a file;
- `edit_file` applies line-based edits.

These tools are reusable across workflows and do not carry governance-specific
policy in this page.

## Python Tools

The Python tools run code inside the workspace:

- `run_python_file`
- `pip_install`

They provide execution support for scripts and package installation in the
current environment.

## Visualization Tools

`visualize_data` turns CSV input into a chart and a UI component.

It is part of the tool catalog because it is a runtime capability, not a
prompt-layer concern.

## What This Page Covers

- the tool contract;
- registry policy and access control;
- execution validation and transformation;
- the built-in tool catalog;
- SQL, memory, file system, Python, and visualization tools.

## What This Page Does Not Cover

- prompt construction;
- schema governance policy;
- SQL governance state machines;
- detailed security policy;
- memory backend internals.

Those belong in the prompt-chain, governance, security, and memory pages.

## Source Files

- [`src/QueryMind/core/registry.py`](../../../src/QueryMind/core/registry.py)
- [`src/QueryMind/core/tool/models.py`](../../../src/QueryMind/core/tool/models.py)
- [`src/rls_registry.py`](../../../src/rls_registry.py)
- [`src/QueryMind/tools/schema_retrieve.py`](../../../src/QueryMind/tools/schema_retrieve.py)
- [`src/QueryMind/tools/run_sql.py`](../../../src/QueryMind/tools/run_sql.py)
- [`src/QueryMind/tools/agent_memory.py`](../../../src/QueryMind/tools/agent_memory.py)
- [`src/evals/resume_points/20260428_085122_0315d6e9/run.log`](../../../src/evals/resume_points/20260428_085122_0315d6e9/run.log)
- [`src/evals/eval_results/20260428_085122_0315d6e9_deepseek_v4_flash/evaluation_report.json`](../../../src/evals/eval_results/20260428_085122_0315d6e9_deepseek_v4_flash/evaluation_report.json)
