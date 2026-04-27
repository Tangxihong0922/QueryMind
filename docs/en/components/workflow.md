# Workflow Handler

Workflow handlers are QueryMind’s deterministic pre-LLM routing layer. They intercept a message before the agent sends it to the LLM, decide whether a command or stateful workflow should run, and either return UI immediately or let the normal LLM pipeline continue.

This layer exists for a simple reason: not every user action should be interpreted by the model. Some actions are better handled as explicit commands, permission checks, or starter UI. That keeps the chat experience faster, more predictable, and easier to debug.

## Workflow Handler Position in Agent Pipeline^

The workflow handler runs after user resolution and conversation loading, but before the message is added to conversation history or sent to the LLM.

#### Agent Pipeline Flow
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
│        │                        Stream UI components directly                 │
│        │                                  │                                  │
│        │                                  ▼                                  │
│        │                        Apply conversation mutation if any            │
│        │                                  │                                  │
│        │                                  ▼                                  │
│        │                        Return without LLM                           │
│        │                                                                     │
│        └────────────── False ─────────────┐                                  │
│                                           ▼                                  │
│                                Add message to conversation                   │
│                                           │                                  │
│                                           ▼                                  │
│                                LLM processing / tool loop                    │
│                                           │                                  │
│                                           ▼                                  │
│                                Stream components to UI                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

The key decision is `should_skip_llm`. If it is `True`, the workflow takes ownership of the turn and the LLM is skipped. If it is `False`, the message continues into the normal agent pipeline.

## Workflow Result Decision Flow^

`WorkflowResult` is the contract between the workflow handler and the agent. It can do three things:
- short-circuit the LLM,
- stream UI components,
- mutate conversation state before returning.

#### Workflow Result Flow
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
│ Optional conversation_mutation│    │ Continue LLM processing      │
│ Optional UI components        │    │ Add user message to history  │
│ Stream to UI                  │    │ Build prompt and tool loop   │
│ Return without LLM            │    │ Stream final response         │
└──────────────────────────────┘    └──────────────────────────────┘
```

This is the cleanest way to think about workflows: they are deterministic branches that sit in front of the model, not inside it.

## What It Provides

### Built-in Commands

QueryMind ships workflows for explicit commands such as `/help`, `/status`, `/memories`, `/delete`, `/init_schema`, `/schema_list`, `/schema_detail`, and `/schema_enrich`.

These are not just convenience shortcuts. They create a stable operational surface for tasks that should not depend on model interpretation:
- help text,
- admin-only operations,
- schema initialization,
- schema inspection and curation,
- memory inspection and cleanup.

### Setup Health Checking

`DefaultWorkflowHandler` analyses the available tool set and turns that into a setup report. It checks for:
- SQL connectivity,
- memory search/save tools,
- visualization tools,
- calculator-like tools.

This is useful because QueryMind is often embedded into partially configured environments. The workflow gives the user a clear “what works now” picture before they even ask a question.

### Smart Starter UI

The workflow handler can return starter UI before any message is sent. In practice this means the first screen can show:
- welcome text,
- admin-only quick actions,
- setup status,
- schema management shortcuts.

This makes the system feel intentional from the first interaction instead of presenting a blank chat box.

### Tool Analysis

The default workflow does a lightweight capability analysis from the registered tool names. It does not inspect business logic deeply; it looks for recognizable tool patterns and turns them into user-facing health information.

That keeps the analysis fast, portable, and good enough for setup guidance.

## Built-in Workflow Handlers

### DefaultWorkflowHandler

`DefaultWorkflowHandler` is the general-purpose handler used for common commands and starter UI.

It provides three main behaviors:
- `/help` returns a plain-language command overview,
- `/status` reports setup health and available capabilities,
- `/memories` and `/delete` expose memory inspection and cleanup for admins.

Its starter UI also reflects the detected tool set. If SQL is missing, it warns that the system is not ready. If SQL exists but memory or visualization tools are missing, it shows a partially configured state. For admins, it adds more system detail and memory-management access.

The important design choice here is that the handler does not just answer commands. It also turns internal setup state into a user-readable status surface.

### SchemaInitWorkflow

`SchemaInitWorkflow` handles `/init_schema`, the deterministic schema ingestion step.

This workflow is admin-only and uses a configured `SchemaExtractor` plus `SchemaSyncEngine` to initialize or refresh schema memory. The command supports two modes:
- `/init_schema` for upsert-style synchronization,
- `/init_schema force` for full reinitialization.

The implementation reports three useful states:
- success,
- success with warnings,
- failure or early stop.

That distinction matters because schema loading is often only partially successful in real deployments. The workflow surfaces processed counts, created/updated/skipped tables, duration, and sample errors so operators can tell whether the sync needs attention.

### SchemaManagementWorkflow

`SchemaManagementWorkflow` handles admin schema curation commands after initialization.

It supports:
- `/schema_list`
- `/schema_list incomplete`
- `/schema_detail <table>` or `/schema_detail <schema>.<table>`
- `/schema_enrich`
- `/schema_enrich <table>`

This workflow is intentionally separate from `/init_schema`. Initialization builds the corpus. Schema management keeps it healthy afterward by listing completeness, editing business context, and enriching missing fields.

## Workflow Handler Design

The base interface is intentionally small:
- `try_handle()` decides whether the workflow takes over the turn,
- `get_starter_ui()` optionally provides a launch screen.

That minimal surface keeps workflows easy to reason about. The complexity lives in the concrete handlers, not in the contract.

`CompositeWorkflowHandler` lets multiple handlers coexist. It runs handlers in order and returns the first one that decides to skip the LLM. For starter UI, it collects components from all handlers and merges them.

That makes the system composable: help/status, schema init, and schema management can all exist together without one handler owning the whole conversation.

## Use Case: Schema Management Commands*

Schema management is the clearest example of why workflows matter.

These commands should not be interpreted loosely by the model. They are operational actions with side effects:
- listing tables,
- viewing one table,
- editing metadata,
- enriching incomplete schemas,
- deleting stale entries.

The workflow makes the boundary explicit:
- admins can trigger deterministic maintenance,
- non-admins get access denied early,
- the LLM is skipped when the result is already known,
- the UI can render structured list/detail cards directly.

#### Schema Management Command Flow^
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
│        ├─→ Check admin permission                                             │
│        ├─→ Parse command / arguments                                          │
│        ├─→ Build ToolContext                                                  │
│        ├─→ Call SchemaManagementService                                       │
│        └─→ Create rich UI components                                          │
│                                                                              │
│        ▼                                                                     │
│  WorkflowResult(should_skip_llm=True)                                         │
│        │                                                                     │
│        └─→ Stream list/detail cards to the UI                                 │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Why This Is Worth Having

The innovation here is not in command syntax itself. It is in making operational tasks first-class workflow branches instead of forcing them through generic natural-language interpretation.

That gives QueryMind:
- lower latency for common admin tasks,
- less ambiguity in command handling,
- stronger permission boundaries,
- cleaner interview stories for “how do admins actually manage the system?”

## Closing Note

Workflow handlers give QueryMind a deterministic front door.

They handle the things that should be explicit, keep the LLM focused on the things that need reasoning, and make the whole agent much easier to operate.


<details open>
<summary>Relevant source files</summary>

- [`src/QueryMind/core/workflow/base.py`](../../../src/QueryMind/core/workflow/base.py) - workflow contract and `WorkflowResult`
- [`src/QueryMind/core/workflow/default.py`](../../../src/QueryMind/core/workflow/default.py) - default command routing and starter-UI handling
- [`src/QueryMind/core/workflow/composite.py`](../../../src/QueryMind/core/workflow/composite.py) - handler composition and first-match dispatch
- [`src/QueryMind/core/workflow/schema_init_workflow.py`](../../../src/QueryMind/core/workflow/schema_init_workflow.py) - `/init_schema` workflow
- [`src/QueryMind/core/workflow/schema_management_workflow.py`](../../../src/QueryMind/core/workflow/schema_management_workflow.py) - schema management command workflow
- [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py) - workflow-handler integration in the agent loop
- [`src/my_agent.py`](../../../src/my_agent.py) - project entrypoint that assembles the composite workflow handler
- [`src/QueryMind/capabilities/schema_management/base.py`](../../../src/QueryMind/capabilities/schema_management/base.py) - schema management service interface used by workflow handlers
- [`src/QueryMind/capabilities/schema_management/models.py`](../../../src/QueryMind/capabilities/schema_management/models.py) - schema management list/detail models
- [`src/QueryMind/capabilities/schema_extracter/base.py`](../../../src/QueryMind/capabilities/schema_extracter/base.py) - schema extractor interface used by schema init workflows
- [`src/QueryMind/capabilities/schema_extracter/models.py`](../../../src/QueryMind/capabilities/schema_extracter/models.py) - schema extraction and initialization models
- [`src/QueryMind/integrations/schemamanagement/neo4j_mem0/neo4j_mem0_schema_management.py`](../../../src/QueryMind/integrations/schemamanagement/neo4j_mem0/neo4j_mem0_schema_management.py) - concrete schema management backend
- [`src/QueryMind/integrations/schemaextractor/sqlite/sqlite_extractor.py`](../../../src/QueryMind/integrations/schemaextractor/sqlite/sqlite_extractor.py) - SQLite schema extractor backend
- [`src/QueryMind/integrations/schemaextractor/postgres/postgres_extractor.py`](../../../src/QueryMind/integrations/schemaextractor/postgres/postgres_extractor.py) - Postgres schema extractor backend
- [`src/QueryMind/integrations/schemaextractor/mssql/mssql_extractor.py`](../../../src/QueryMind/integrations/schemaextractor/mssql/mssql_extractor.py) - MSSQL schema extractor backend
- [`src/QueryMind/components/rich/schema_management/schema_list_component.py`](../../../src/QueryMind/components/rich/schema_management/schema_list_component.py) - schema list UI component
- [`src/QueryMind/components/rich/schema_management/schema_detail_component.py`](../../../src/QueryMind/components/rich/schema_management/schema_detail_component.py) - schema detail UI component

</details>