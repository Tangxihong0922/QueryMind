# Tool Systems

This page explains how QueryMind turns an LLM tool call into a safe, typed, inspectable action. The tool layer is deliberately split into execution, policy, and presentation. That separation keeps tools reusable and makes the system easier to reason about in interviews.

## Design Principles

- Keep tool classes capability-focused and small.
- Centralize policy in the registry so the same tool can be reused with different permissions.
- Validate model output before any side effects.
- Return both reasoning text and UI payload from the same call.
- Treat artifacts, not just chat text, as first-class outputs.

These choices make the flow deterministic: the model proposes an action, the registry validates and optionally rewrites it, the tool performs the domain work, and the result is then rendered for both the LLM and the user.

## Tool Registry

The registry is the control plane of the tool system. Tools remain simple; the registry decides which tools are visible, which are executable, and whether arguments should be transformed before execution.

Why this layer exists:
- Tool classes describe capability, not policy.
- The same implementation can be registered differently in demo, evaluation, and production.
- Access groups provide a compact, audit-friendly permission model.
- `ToolResult` keeps reasoning output and UI output decoupled.

Core models in the tool contract:
- `ToolCall`: raw LLM request with `id`, `name`, and `arguments`.
- `ToolContext`: execution context with `user`, `conversation_id`, `request_id`, `agent_memory`, `metadata`, optional observability, and schema capabilities.
- `ToolResult`: `success`, `result_for_llm`, optional `ui_component`, optional `error`, and free-form `metadata`.
- `ToolRejection`: returned by `transform_args()` when policy says the call should not run.

## Tool Execution Pipeline

### Execution Flow Diagram^
```text
┌──────────────────────────────┐
│ 1. LLM proposes a tool call  │
│    name + raw arguments      │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ 2. Registry governs the call │
│    lookup, permission,       │
│    validation, policy        │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ 3. Tool runs with typed args  │
│    tool.execute(context,...)  │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ 4. Result is returned twice   │
│    LLM text + UI payload      │
└──────────────────────────────┘
```

### Tool Lookup
`ToolRegistry.execute()` resolves the tool by name. If the tool does not exist, the registry returns a failed `ToolResult` instead of raising, so the agent loop can continue cleanly.

### Permission Validation^
```text
┌──────────────────────┐      ┌──────────────────────┐
│ user.group_memberships│      │ tool.access_groups    │
│ example:             │      │ example:             │
│ ["user","admin"]     │      │ [] / ["admin"]       │
└──────────┬───────────┘      └──────────┬───────────┘
           │                             │
           └──────────────┬──────────────┘
                          ▼
                ┌──────────────────────┐
                │ empty groups => open │
                │ otherwise intersect  │
                └──────────┬───────────┘
                           ▼
                 allow  if shared group
                 deny   otherwise
```

The same check is used in two places:
- `get_schemas(user)` hides tools the user cannot access.
- `execute()` blocks runtime execution for unauthorized users.

When `AuditConfig.log_tool_access_checks` is enabled, the registry logs both allow and deny decisions.

### Argument Validation & Transformation^
```text
┌──────────────────────────────┐
│ raw tool_call.arguments      │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Pydantic validation          │
│ model_validate(...)          │
└───────┬──────────────────────┘
        │ ok              │ fail
        ▼                 ▼
┌──────────────────────┐  ┌──────────────────────┐
│ typed args object     │  │ invalid arguments    │
└──────────┬───────────┘  │ ToolResult           │
           ▼              └──────────────────────┘
┌──────────────────────────────┐
│ transform_args()             │
│ base=no-op, policy hook      │
└───────┬──────────────────────┘
        │ accept          │ reject
        ▼                 ▼
┌──────────────────────┐  ┌──────────────────────┐
│ final args            │  │ ToolRejection result │
└──────────┬───────────┘  └──────────────────────┘
           ▼
┌──────────────────────────────┐
│ tool.execute(context, args)   │
└──────────────────────────────┘
```

The base registry performs no argument transformation. Subclasses override `transform_args()` when they need policy-aware behavior such as SQL rewriting, redaction, or per-user filtering. That is the key architectural seam: typing happens once, policy happens centrally, and tools stay focused on domain work.

### Tool Execution
- `tool.execute()` always uses the context-first signature: `tool.execute(context, args)`.
- Execution time is measured with `time.perf_counter()` and written to `result.metadata["execution_time_ms"]`.
- Unhandled exceptions are converted into a failure `ToolResult`.
- Rich UI output is carried in `ToolResult.ui_component`, with a simple fallback text payload alongside it.

### Auditing (Optional)
- `AuditConfig` controls access checks, invocations, results, and parameter sanitization.
- `log_tool_invocation()` can sanitize sensitive parameters before writing them.
- `ui_features_available` is read from `context.metadata` and attached to invocation logs.
- Access checks, invocations, results, and denials all have dedicated audit events.

## Tool Registry Use Case: RLS Protection

`RLSToolRegistry` is the clearest example of why `transform_args()` exists. Row-level security is cross-cutting policy, not business logic, so it belongs in the registry layer rather than inside `RunSqlTool`. That keeps the SQL tool reusable while letting different deployments swap in different policy rules.

The current policy pipeline is:
1. reject obvious SQL injection patterns,
2. cap query complexity,
3. rewrite qualifying `SELECT` queries with territory filters,
4. execute the rewritten SQL.

That ordering matters. QueryMind fails fast on unsafe input before touching the database, and it applies row-level constraints before the SQL ever executes.

Why the policy is shaped this way:
- Metadata discovery is intentionally allowlisted because schema retrieval depends on it.
- Territory access is expressed as business groups, not raw SQL fragments.
- If a user has no allowed territory, the registry rewrites the query to return zero rows instead of trusting the caller to check access.
- The same SQL tool can be reused in evaluation, demo, and production by swapping registry configuration.

The policy reference lives in [Security & Access Control](./security.md#rls-protection-module).

## Toolkits

The table below lists the built-in tools that exist in the codebase today. The `Default access` column shows each tool's own `access_groups` value; deployments can still tighten access when registering tools.

| Category | Tool | Primary use | Key behavior | Default access |
|----------|------|-------------|--------------|----------------|
| SQL | `schema_retrieve` | Find relevant table schemas before writing SQL | Supports `hybrid`, `vector`, `graph`, and `expand`; accepts `graph_hint`, `required_fields`, `seed_tables`, `similarity_threshold`, and `limit`; returns schema metadata plus a rich UI payload | open |
| SQL | `run_sql` | Execute SQL and persist query results | Uses an injected `SqlRunner`; `SELECT` writes a CSV and dataframe UI; non-`SELECT` returns affected-row summaries; LLM preview is truncated to 1000 characters | open |
| Memory | `save_question_tool_args` | Save a successful question/tool/args combination | Stores a successful usage pattern in `AgentMemory` and degrades safely when memory is unavailable | open |
| Memory | `search_saved_correct_tool_uses` | Search prior successful tool-use examples | Runs similarity search over agent memory and can show detailed memory cards when the UI feature is enabled | open |
| Memory | `save_text_memory` | Save free-form notes or observations | Persists text memory and returns a success message with the saved id when available | open |
| File system | `list_files` | List files in a workspace directory | Uses the per-user isolated filesystem and returns a file list card | open |
| File system | `search_files` | Search files by name or content | Supports `query`, `include_content`, and `max_results`; returns file paths and snippets | open |
| File system | `read_file` | Read file contents | Returns the full file content in both text and UI form | open |
| File system | `write_file` | Write or overwrite a file | Writes content with an optional overwrite flag and returns a success notification | open |
| File system | `edit_file` | Apply line-based edits to a file | Accepts one or more edit ranges and returns a diff-style result | open |
| Python | `run_python_file` | Run a Python script in the workspace interpreter | Supports script arguments and timeout control; executes inside the workspace shell | open |
| Python | `pip_install` | Install Python packages | Runs `pip install` with optional upgrade, extra args, and timeout support | open |
| Visualization | `visualize_data` | Create a chart from a CSV file | Reads CSV, auto-selects a chart type, and returns a chart component plus summary text | open |

### Tool Notes
The sections below describe each tool directly, with the implementation details that matter most to users and to the author preparing interview stories.

#### SQL Execution
##### RunSqlTool
`RunSqlTool` executes SQL queries against databases using the `SqlRunner` abstraction pattern. It supports dependency injection for database connectivity and file storage.

Key features:
- Dependency injection: accepts `SqlRunner` implementations such as `SqliteRunner` and `PostgresRunner`
- File system integration: optional `FileSystem` for saving query results, defaulting to `LocalFileSystem`
- Custom naming: supports `custom_tool_name` and `custom_tool_description`
- Query type handling: different behavior for `SELECT` vs. non-`SELECT` queries
- Result truncation: limits the LLM-facing response to 1000 characters for large result sets
- CSV export: saves `SELECT` results to CSV files for downstream tools
- UI output: returns dataframe-style UI for query results and notifications for write-style queries
- Metadata: records row counts, columns, query type, and output file name

Behavior:
- `SELECT` queries are converted into dataframe records, written to `query_results_<id>.csv`, and returned as a dataframe-style UI component.
- Non-`SELECT` queries return an affected-row summary and a compact success notification.
- Large result sets are truncated for the LLM preview, while the full CSV remains available on disk.
- Failures are returned as structured error results instead of exceptions.

In practice, `run_sql` answers the immediate query and leaves behind a durable CSV artifact that downstream tools can reuse.

##### SchemaRetrieveTool
`SchemaRetrieveTool` searches `SchemaMemory` for relevant table schemas before SQL is written. It is the schema-discovery companion to `RunSqlTool`.

Key features:
- Search modes: `hybrid`, `vector`, `graph`, and `expand`
- Query controls: `graph_hint`, `required_fields`, `seed_tables`, `similarity_threshold`, and `limit`
- Context awareness: can merge seed tables from `context.metadata["schema_retrieve_context"]`
- Output shape: returns selected table refs, search metadata, and a rich schema UI payload

Behavior:
- `search_mode=None` defaults to `hybrid`.
- `graph_hint` and `seed_tables` can steer the tool toward expansion-style retrieval.
- The result contains enough structure for both the LLM and the user to inspect the same schema from different angles.

Together, the two tools form a practical plan-then-execute loop: schema retrieval narrows the search space, and SQL execution produces the data artifact.

#### Agent Memory
##### SaveQuestionToolArgsTool
`SaveQuestionToolArgsTool` saves a successful question/tool/args combination for later reuse. It captures what worked, not just what was asked.

Key features:
- Stores successful usage patterns in `AgentMemory`
- Degrades safely when the memory backend is unavailable
- Returns a short success message and a status-style UI update

##### SearchSavedCorrectToolUsesTool
`SearchSavedCorrectToolUsesTool` searches for similar successful tool-use examples based on a question. It helps the model reuse known-good patterns instead of re-deriving them from scratch.

Key features:
- Similarity search over agent memory
- `limit`, `similarity_threshold`, and `tool_name_filter` controls
- Detailed memory cards when `UiFeature.UI_FEATURE_SHOW_MEMORY_DETAILED_RESULTS` is enabled
- Safe fallback messages when memory is degraded or empty

##### SaveTextMemoryTool
`SaveTextMemoryTool` stores free-form notes, observations, or definitions in agent memory.

Key features:
- Saves plain text memory content
- Returns the saved memory id when the backend is healthy
- Skips persistence gracefully when memory is degraded

#### File System
##### ListFilesTool
`ListFilesTool` lists files in a directory inside the user-isolated workspace.

Key features:
- Uses the injected file system service
- Respects per-user workspace isolation
- Returns a card-style summary of directory contents

##### SearchFilesTool
`SearchFilesTool` searches for files by name and optionally by content.

Key features:
- Supports `query`, `include_content`, and `max_results`
- Returns file paths plus optional text snippets
- Works well for repo navigation and targeted artifact discovery

##### ReadFileTool
`ReadFileTool` reads and returns the contents of a file.

Key features:
- Reads a file through the injected file system
- Returns file content in both text and UI form
- Useful when the agent needs to inspect a known artifact directly

##### WriteFileTool
`WriteFileTool` writes content to a file, with optional overwrite support.

Key features:
- Supports creating or replacing files
- Uses the injected file system service
- Returns a success notification when the write completes

##### EditFileTool
`EditFileTool` applies line-based edits to an existing file.

Key features:
- Accepts one or more explicit edit ranges
- Produces a diff-style result so the change is easy to inspect
- Better suited for surgical edits than full file rewrites

#### Python Execution
##### RunPythonFileTool
`RunPythonFileTool` executes a Python file inside the workspace interpreter.

Key features:
- Accepts script arguments and an optional timeout
- Runs through the workspace file system abstraction
- Returns the command, stdout, stderr, and exit code in the result payload

##### PipInstallTool
`PipInstallTool` installs Python packages with `pip` inside the workspace environment.

Key features:
- Supports package lists, upgrade mode, and extra arguments
- Runs as `python -m pip install`
- Returns a command result card so installation output is inspectable

#### Visualization
##### VisualizeDataTool
`VisualizeDataTool` reads a CSV file, parses it into a DataFrame, and generates a chart.

Key features:
- Uses the injected file system to read the CSV artifact
- Uses `PlotlyChartGenerator` to choose an appropriate chart type
- Returns both a rich chart component and a concise text summary
- Reports file-not-found and CSV-parse errors as structured failures

### Creating Custom Tools
A custom tool should be narrow, typed, and side-effect aware. If a capability needs user-specific policy, keep that logic in the registry rather than inside the tool body.

A minimal shape looks like this:
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

The important design rule is simple: keep tools thin, keep policy centralized, and let the registry own any user-aware rewriting or gating.


<details open>
<summary>Relevant source files</summary>

- [`src/QueryMind/core/registry.py`](../../../src/QueryMind/core/registry.py) - tool registry, schema filtering, and execution policy
- [`src/QueryMind/core/tool/base.py`](../../../src/QueryMind/core/tool/base.py) - base tool interface and schema generation
- [`src/QueryMind/core/tool/models.py`](../../../src/QueryMind/core/tool/models.py) - `ToolCall`, `ToolContext`, `ToolResult`, `ToolSchema`, and `ToolRejection`
- [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py) - builds `ToolContext` and drives tool execution in the agent loop
- [`src/QueryMind/core/agent/config.py`](../../../src/QueryMind/core/agent/config.py) - feature-group access rules and tool-related runtime defaults
- [`src/QueryMind/core/audit/base.py`](../../../src/QueryMind/core/audit/base.py) - audit logger interface for tool events
- [`src/QueryMind/core/audit/models.py`](../../../src/QueryMind/core/audit/models.py) - audit event models and payloads
- [`src/QueryMind/core/hook/base.py`](../../../src/QueryMind/core/hook/base.py) - lifecycle hooks around tool execution
- [`src/QueryMind/core/middleware/base.py`](../../../src/QueryMind/core/middleware/base.py) - LLM middleware interface around request/response handling
- [`src/QueryMind/core/recovery/base.py`](../../../src/QueryMind/core/recovery/base.py) - error recovery interface for failed tool executions
- [`src/QueryMind/core/recovery/default.py`](../../../src/QueryMind/core/recovery/default.py) - default retry/backoff recovery strategy
- [`src/QueryMind/tools/agent_memory.py`](../../../src/QueryMind/tools/agent_memory.py) - agent memory tools
- [`src/QueryMind/tools/file_system.py`](../../../src/QueryMind/tools/file_system.py) - file-system tools
- [`src/QueryMind/tools/python.py`](../../../src/QueryMind/tools/python.py) - Python execution and package installation tools
- [`src/QueryMind/tools/run_sql.py`](../../../src/QueryMind/tools/run_sql.py) - SQL execution tool built on `SqlRunner`
- [`src/QueryMind/tools/schema_retrieve.py`](../../../src/QueryMind/tools/schema_retrieve.py) - schema retrieval tool for table discovery and expansion
- [`src/QueryMind/tools/visualize_data.py`](../../../src/QueryMind/tools/visualize_data.py) - data visualization tool
- [`src/QueryMind/capabilities/agent_memory/base.py`](../../../src/QueryMind/capabilities/agent_memory/base.py) - agent memory capability interface
- [`src/QueryMind/capabilities/file_system/base.py`](../../../src/QueryMind/capabilities/file_system/base.py) - file-system capability interface
- [`src/QueryMind/capabilities/schema_memory/base.py`](../../../src/QueryMind/capabilities/schema_memory/base.py) - schema memory capability interface
- [`src/QueryMind/capabilities/schema_management/base.py`](../../../src/QueryMind/capabilities/schema_management/base.py) - schema management capability interface
- [`src/QueryMind/capabilities/sql_runner/base.py`](../../../src/QueryMind/capabilities/sql_runner/base.py) - SQL runner abstraction used by `RunSqlTool`

</details>