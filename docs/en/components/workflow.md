# Workflow Handler

Workflow handlers are the deterministic pre-LLM routing layer. They decide whether a message should short-circuit into command handling or starter UI, or continue into the normal agent loop.

## Base Contract

`WorkflowHandler` defines two hooks:
- `try_handle(...)` decides whether the workflow takes over a turn
- `get_starter_ui(...)` optionally provides starter UI for a conversation

`WorkflowResult` is the return contract for `try_handle(...)`.

## Agent Pipeline

```text
User resolution -> Load/Create conversation -> workflow_handler.try_handle(...)
  handled -> apply conversation_mutation -> stream components -> save -> return
  not handled -> add user message -> build LLM request -> tool loop -> response
```

Starter UI uses a separate path: empty messages, or `request_context.metadata["starter_ui_request"]`, call `get_starter_ui(...)` before the normal turn starts.

## WorkflowResult

- `should_skip_llm`: required flag
- `components`: optional list or async generator of `UiComponent`
- `conversation_mutation`: optional async callback that mutates the current `Conversation`

If `should_skip_llm` is `true`, the agent does not add the message to history automatically in that branch.

## DefaultWorkflowHandler

`DefaultWorkflowHandler` is the built-in handler for common commands and starter UI.

It handles:
- `/help`
- `/status`
- `/memories`
- `/recent_memories` and `recent_memories`
- `/delete <memory_id>`

Permission checks use `user.group_memberships`. `/help` is available to everyone; the other commands are admin-only.

Its starter UI reads `agent.tool_registry.get_schemas(user)` and turns the detected tool set into a role-aware welcome card or setup card. The setup analysis looks for SQL, memory search/save, visualization, and calculator-like tools.

The handler is intentionally narrow. It does not implement schema initialization or schema curation commands.

## Schema Workflows

### SchemaInitWorkflow

`SchemaInitWorkflow` handles `/init_schema` and `/init_schema force`.

Facts from the source:
- admin-only
- requires a configured `SchemaExtractor`
- uses the injected `SchemaSyncEngine`
- returns admin starter UI only when the extractor is configured

### SchemaManagementWorkflow

`SchemaManagementWorkflow` handles schema curation commands after initialization.

It supports:
- `/schema_list`
- `/schema_list incomplete`
- `/schema_detail <table>` or `/schema_detail <schema>.<table>`
- `/schema_enrich`
- `/schema_enrich <table>`

Facts from the source:
- admin-only
- uses `SchemaManagementService`
- returns admin starter UI for the schema-management command set

## CompositeWorkflowHandler

`CompositeWorkflowHandler` composes multiple handlers.

It processes handlers in order and returns the first result that sets `should_skip_llm=True`. For starter UI, it collects components from all handlers and merges them into one list.

Use this when you want default commands plus schema workflows together.

## Source Boundaries

Workflow handlers route deterministic actions and surface starter UI. SQL governance, schema governance, and prompt construction live in other layers.

## Relevant Source Files

- [`src/QueryMind/core/workflow/base.py`](../../../src/QueryMind/core/workflow/base.py) - `WorkflowHandler` contract and `WorkflowResult`
- [`src/QueryMind/core/workflow/default.py`](../../../src/QueryMind/core/workflow/default.py) - default commands, setup analysis, and starter UI
- [`src/QueryMind/core/workflow/schema_init_workflow.py`](../../../src/QueryMind/core/workflow/schema_init_workflow.py) - `/init_schema` workflow
- [`src/QueryMind/core/workflow/schema_management_workflow.py`](../../../src/QueryMind/core/workflow/schema_management_workflow.py) - schema management workflows
- [`src/QueryMind/core/workflow/composite.py`](../../../src/QueryMind/core/workflow/composite.py) - ordered handler composition
- [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py) - workflow integration in the agent loop
- [`src/my_agent.py`](../../../src/my_agent.py) - project entrypoint that wires the workflow stack
