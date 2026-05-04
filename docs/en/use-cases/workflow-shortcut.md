# Workflow Shortcut Use Case

This page shows how workflow handlers short-circuit the LLM, provide starter
UI, or fall through to the normal Agent loop. The facts come from
`src/QueryMind/server/base/chat_handler.py`,
`src/QueryMind/server/fastapi/routes.py`,
`src/QueryMind/core/agent/agent.py`,
`src/QueryMind/core/workflow/base.py`,
`src/QueryMind/core/workflow/default.py`,
`src/QueryMind/core/workflow/schema_init_workflow.py`,
`src/QueryMind/core/workflow/schema_management_workflow.py`,
`src/QueryMind/core/workflow/composite.py`, and `src/my_agent.py`.

## Scenario

A user opens a new conversation, sends a deterministic command such as
`/help`, `/init_schema`, or `/schema_list`, or just types a normal query.
The workflow layer decides first whether the turn should short-circuit.

The important boundary is not “letting the model remember the rules”; it is
making the rules explicit in the routing layer.

## What Happens

1. `ChatHandler._create_request_context()` copies the request metadata and
   injects `allow_metadata_query`.
2. `Agent._send_message()` resolves the user and then checks whether the turn
   is a starter UI request: empty message, or
   `request_context.metadata["starter_ui_request"] = True`.
3. The starter UI branch calls `workflow_handler.get_starter_ui(...)`.
4. The normal message branch loads or creates the conversation and then calls
   `workflow_handler.try_handle(...)`.
5. `CompositeWorkflowHandler` runs handlers in the order configured in
   `src/my_agent.py`:
   `DefaultWorkflowHandler` -> `SchemaInitWorkflow` -> `SchemaManagementWorkflow`.
6. The first handler that returns `should_skip_llm=True` takes over the turn.
7. If all handlers return `should_skip_llm=False`, the message falls through
   to the usual `ToolContext` / prompt chain / LLM / tool loop.

## ASCII Diagram

The diagram below turns deterministic workflow routing into one concrete loop.

```text
+====================================================================================================+
| 0) ChatHandler._create_request_context()                                                           |
|----------------------------------------------------------------------------------------------------|
| Input: ChatRequest.message / metadata / conversation_id / request_id                              |
| Logic:                                                                                             |
|   - copy `request.metadata`                                                                        |
|   - inject `allow_metadata_query`                                                                  |
|   - build `RequestContext(metadata=..., user=..., conversation_id=..., request_id=...)`           |
| Output: the Agent receives a request context with routing flags                                    |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 1) Agent._send_message()                                                                           |
|----------------------------------------------------------------------------------------------------|
| Logic:                                                                                             |
|   - `resolve_user(request_context)`                                                                |
|   - check for a starter UI request: empty message or `starter_ui_request=true`                    |
|   - starter UI -> load/create conversation -> `workflow_handler.get_starter_ui(...)` -> stream components / auto-save / return |
|   - normal turn -> load/create conversation, then call `workflow_handler.try_handle(...)`         |
| Output: either a starter UI response or a deterministic workflow route                            |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 2) CompositeWorkflowHandler                                                                        |
|----------------------------------------------------------------------------------------------------|
| Logic:                                                                                             |
|   - `get_starter_ui(...)`: collect starter UI components from every handler and merge them        |
|   - `try_handle(...)`: execute handlers in `src/my_agent.py` order                                 |
|       1. `DefaultWorkflowHandler`                                                                  |
|       2. `SchemaInitWorkflow`                                                                      |
|       3. `SchemaManagementWorkflow`                                                                |
|   - return immediately on the first `should_skip_llm=True` result                                 |
| Output: a merged starter UI list, or one `WorkflowResult`                                          |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 3) WorkflowResult -> Agent tail                                                                    |
|----------------------------------------------------------------------------------------------------|
| `should_skip_llm=true`:                                                                            |
|   - optionally execute `conversation_mutation`                                                     |
|   - stream `components`                                                                            |
|   - save the conversation                                                                          |
|   - return without calling the LLM                                                                 |
| `should_skip_llm=false`:                                                                           |
|   - write the user message into history                                                            |
|   - continue to `ToolContext` / prompt chain / tool loop                                           |
| Real effect: starter UI and slash commands are short-circuited before the LLM                     |
+====================================================================================================+
```

## Command Coverage

- `DefaultWorkflowHandler.try_handle()` handles:
  - `/help`
  - `/status`
  - `/memories`
  - `/recent_memories`
  - `/delete <memory_id>`
- `SchemaInitWorkflow.try_handle()` handles:
  - `/init_schema`
  - `/init_schema force`
- `SchemaManagementWorkflow.try_handle()` handles:
  - `/schema_list`
  - `/schema_list incomplete`
  - `/schema_detail <table>`
  - `/schema_detail <schema>.<table>`
  - `/schema_enrich`
  - `/schema_enrich <table>`

These handlers are deterministic: a match returns
`WorkflowResult(should_skip_llm=True)`, and a miss falls through to the LLM.

## Starter UI

Starter UI is part of the workflow layer and does not require the user to send
a message first.

- `DefaultWorkflowHandler.get_starter_ui()` reads
  `agent.tool_registry.get_schemas(user)` and builds a welcome or setup card
  based on the current tool set and user role.
- `SchemaInitWorkflow.get_starter_ui()` returns content only for admins when
  the extractor is configured.
- `SchemaManagementWorkflow.get_starter_ui()` returns a schema-management
  entry only for admins.
- `CompositeWorkflowHandler.get_starter_ui()` merges all handler outputs into
  one list.

In `src/my_agent.py`, the stack is wired as:

`DefaultWorkflowHandler()` -> `SchemaInitWorkflow(...)` -> `SchemaManagementWorkflow(...)`

So default commands are consumed first, schema-management commands are handled
next, and starter UI can be assembled from multiple handlers at once.

## Why This Matters

- It keeps deterministic commands out of the LLM path.
- It makes role checks, schema initialization, and schema management explicit
  and auditable.
- It lets a brand-new conversation return starter UI instead of an empty chat.
- It cleanly routes everything else back into the normal Agent loop.

## Source Files

- [`src/QueryMind/server/base/chat_handler.py`](../../../src/QueryMind/server/base/chat_handler.py)
- [`src/QueryMind/server/fastapi/routes.py`](../../../src/QueryMind/server/fastapi/routes.py)
- [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py)
- [`src/QueryMind/core/workflow/base.py`](../../../src/QueryMind/core/workflow/base.py)
- [`src/QueryMind/core/workflow/default.py`](../../../src/QueryMind/core/workflow/default.py)
- [`src/QueryMind/core/workflow/schema_init_workflow.py`](../../../src/QueryMind/core/workflow/schema_init_workflow.py)
- [`src/QueryMind/core/workflow/schema_management_workflow.py`](../../../src/QueryMind/core/workflow/schema_management_workflow.py)
- [`src/QueryMind/core/workflow/composite.py`](../../../src/QueryMind/core/workflow/composite.py)
- [`src/my_agent.py`](../../../src/my_agent.py)
