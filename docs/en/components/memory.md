# Agent Memory (RAG) System

QueryMind uses two memory systems:
- Agent Memory stores successful tool paths and reusable text notes.
- Schema Memory stores table structure, relationships, and business context.

Together they help the agent reuse proven actions and pick the right tables before SQL generation.

## Agent Memory^

Agent Memory stores two kinds of reusable experience:
- Tool Memory: successful question/tool/args combinations.
- Text Memory: free-form knowledge, definitions, and domain notes.

In practice, QueryMind stores successful tool paths and notes so similar requests can reuse them later.

### Memory Flow Diagram^
```text
┌──────────────────────────────┐
│ User asks a question         │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Prompt builder checks tools  │
│ and may add memory rules     │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ DefaultLlmContextEnhancer    │
│ searches text memory         │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ LLM chooses tools and acts   │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Successful patterns are      │
│ saved back to AgentMemory    │
└──────────────────────────────┘
```

### Tool Memory
Tool memory is written through `save_question_tool_args` and stores:
- the original question,
- the tool name,
- the exact arguments,
- success state,
- optional metadata.

This is more useful than raw chat logs because it preserves the exact tool call that worked.

#### SaveQuestionToolArgsTool
`SaveQuestionToolArgsTool` saves one successful question/tool/args combination.

Key features:
- Writes to the configured `AgentMemory` backend.
- Uses `ToolContext` so entries stay tied to the current user, conversation, and agent.
- Returns a success message and a status-style UI card.
- Detects degraded memory backends and reports a graceful no-op instead of failing the whole request.

Behavior:
- When memory is healthy, the tool saves the usage pattern and returns the stored tool name.
- When memory is degraded, the tool still succeeds from the request flow’s point of view, but tells the user the pattern was not persisted.
- When the backend throws, the tool returns a structured failure result.

#### SearchSavedCorrectToolUsesTool
`SearchSavedCorrectToolUsesTool` searches prior successful tool-use examples for a question.

Key features:
- Similarity search over agent memory.
- Supports `limit`, `similarity_threshold`, and `tool_name_filter`.
- Returns both LLM text and a rich UI result.
- Shows detailed memory cards only when `UiFeature.UI_FEATURE_SHOW_MEMORY_DETAILED_RESULTS` is enabled.
- Falls back cleanly when memory is empty or degraded.

Behavior:
- The tool searches only successful tool patterns.
- The result includes question, tool name, arguments, similarity score, and optionally timestamp or memory id.
- If the backend is unavailable, the tool returns a safe informational result rather than breaking the agent loop.

#### SaveTextMemoryTool
`SaveTextMemoryTool` stores free-form notes, definitions, and domain observations.

Key features:
- Saves plain text content through `AgentMemory`.
- Returns the saved memory id when available.
- Skips persistence gracefully when the backend is degraded.
- Uses a compact status card instead of a heavy UI panel.

Behavior:
- This tool is the right place for durable domain facts such as abbreviations, table semantics, or business rules.
- Tool memory stores action patterns, while text memory stores knowledge.

### Text Memory
Text memory is read before tool selection, and the default LLM context enhancer appends relevant snippets to the system prompt.

#### DefaultLlmContextEnhancer
`DefaultLlmContextEnhancer` enriches the system prompt with relevant text memories.

What it adds:
- It gives the model extra grounding before tool selection starts.
- It keeps reusable notes out of the user prompt when possible.
- It gives the model a lightweight way to reuse prior knowledge.

Behavior:
- If no memory backend is configured, the prompt is returned unchanged.
- If the memory backend is degraded, the prompt is returned unchanged.
- Otherwise the enhancer searches `search_text_memories()` and appends the most relevant snippets to the system prompt.

### Memory UI and Commands
QueryMind exposes memory through both tools and operator commands.

The default workflow handler supports:
- `/memories` or `/recent_memories` to inspect recent memories.
- `/delete <memory_id>` to delete tool or text memories.

The UI distinguishes between normal users and admins:
- normal users see compact status messages,
- admins can inspect detailed cards and delete entries.

The same memory data is available to the agent at runtime and to operators during maintenance.

### Memory Backend Behavior
QueryMind ships with two backend styles:
- `Mem0AgentMemory` for production-style persistent memory.
- `DemoAgentMemory` for zero-dependency local demos and tests.

`DemoAgentMemory` is intentionally simple:
- it keeps tool and text memories in RAM,
- it uses cheap similarity measures such as Jaccard and difflib ratio,
- it supports FIFO eviction,
- it is async-safe with a lock.

`Mem0AgentMemory` is the higher-fidelity backend:
- it isolates memory by user, agent, and conversation,
- it stores metadata with each record,
- it supports similarity search and reranking,
- it can degrade into a no-op mode when Mem0 is unavailable.

If Mem0 is unavailable, memory calls degrade to no-op so the agent can keep running.

### Memory Architecture Diagram^
```text
┌──────────────────────────────────────────────────────────────────────────┐
│                              Agent Memory                                │
│                                                                          │
│  ┌──────────────────────────┐      ┌──────────────────────────────────┐  │
│  │ SaveQuestionToolArgsTool  │      │ SearchSavedCorrectToolUsesTool  │  │
│  │ SaveTextMemoryTool        │      │ DefaultLlmContextEnhancer       │  │
│  └─────────────┬────────────┘      └──────────────┬───────────────────┘  │
│                │                                  │                      │
│                ▼                                  ▼                      │
│     ┌──────────────────────┐          ┌──────────────────────────────┐    │
│     │ AgentMemory interface │          │ search_text_memories()      │    │
│     │ save/search/delete    │          │ search_similar_usage()      │    │
│     └─────────────┬────────┘          └──────────────┬───────────────┘    │
│                   │                                   │                    │
│                   ▼                                   ▼                    │
│      ┌─────────────────────────┐        ┌──────────────────────────────┐   │
│      │ Mem0AgentMemory         │        │ DemoAgentMemory              │   │
│      │ persistent backend      │        │ in-memory backend            │   │
│      └─────────────┬───────────┘        └──────────────┬───────────────┘   │
│                    │                                   │                   │
│                    ▼                                   ▼                   │
│      ┌─────────────────────────┐        ┌──────────────────────────────┐   │
│      │ Mem0 storage + rerank   │        │ Jaccard + difflib similarity │   │
│      │ user/agent/run isolation │        │ FIFO eviction                │   │
│      └─────────────────────────┘        └──────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
```

## Schema Memory ^*

Schema Memory stores table schemas, fields, relationships, and business context. `schema_retrieve` reads it to find relevant tables before SQL is generated.

It is marked as `*` because `schema_retrieve` has four search modes: vector, graph, hybrid, and expand.

### Two Layers^

Schema Memory uses two complementary storage layers:
- Neo4j stores graph structure, table relationships, and domain links.
- Mem0 stores vectorized schema text for semantic lookup.

Some schema questions are semantic:
- “Which tables are about orders?”

Some are structural:
- “What tables connect to this one by foreign key?”

QueryMind uses vector search for semantic lookup and graph search for relationship lookup.

#### Two-Layer Diagram^
```text
┌──────────────────────────────────────────────────────────────────────────┐
│                           Schema Memory                                 │
│                                                                          │
│     ┌──────────────────────────┐        ┌────────────────────────────┐   │
│     │        Neo4jGraphStore    │        │      Mem0VectorStore      │   │
│     │        graph layer        │        │      vector layer         │   │
│     │                          │        │                          │   │
│     │  Table ─ HAS_FIELD ─ Field│        │  table.to_vector_text()  │   │
│     │  Table ─ FK_TO ─ Table    │        │  semantic similarity     │   │
│     │  Table ─ BELONGS_TO ─ Dom │        │  domain/table filters    │   │
│     └─────────────┬────────────┘        └──────────────┬───────────┘   │
│                   │                                   │                 │
│                   └──────────────┬────────────────────┘                 │
│                                  ▼                                      │
│                    ┌──────────────────────────────┐                      │
│                    │        SchemaSearch          │                      │
│                    │       fusion engine          │                      │
│                    │                              │                      │
│                    │  RRF score =                │                      │
│                    │  vector_w/(k+rank) +        │                      │
│                    │  graph_w/(k+rank)           │                      │
│                    └──────────────────────────────┘                      │
└──────────────────────────────────────────────────────────────────────────┘
```

### Initialization^

Schema Memory is usually initialized in a separate sync step:
1. `SchemaExtractor` reads table metadata from the source database.
2. `SchemaSyncEngine` saves the extracted schemas into Schema Memory.
3. `Neo4jMem0SchemaMemory.initialize()` prepares both storage layers.

That loads the schema corpus once, so runtime retrieval does not need to rescan the live database.

The initializer also supports batching, retries on transient save failures, early abort on repeated failures, resume mode for already-saved tables, and `force=True` for full reinitialization.

#### Initialization Diagram^
```text
┌──────────────────────────────┐
│ SchemaExtractor              │
│ reads source database        │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ SchemaSyncEngine             │
│ batches and retries writes   │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Neo4jMem0SchemaMemory        │
│ initialize()                 │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Neo4j graph + Mem0 vector    │
│ store the schema corpus      │
└──────────────────────────────┘
```

### 4 Search Modes^*

Schema retrieval supports four modes:
- `vector`: semantic search first.
- `graph`: relationship traversal first.
- `hybrid`: the default balanced mode.
- `expand`: seed-based expansion from prior results.

These modes let the tool handle different query shapes without forcing one strategy on every request.

#### Mode Selection Flow^
```text
┌──────────────────────────────────────────────────────────────────────────┐
│                        schema_retrieve tool call                         │
│                                                                          │
│   query: "..."                                                           │
│   search_mode: optional                                                  │
│   graph_hint: optional                                                   │
│   seed_tables: optional                                                  │
└──────────────┬───────────────────────────────────────────────────────────┘
               ▼
┌──────────────────────────────┐
│ seed_tables available?       │
└──────────────┬───────────────┘
        yes    │    no
               ▼
┌──────────────────────────────┐    ┌───────────────────────────────────┐
│ expand                        │    │ query semantics and hints       │
│ start from seed tables        │    │ decide between hybrid/vector/graph│
└──────────────┬───────────────┘    └─────────────────────┬─────────────┘
               ▼                                          ▼
      ┌───────────────┐                         ┌────────────────────────┐
      │ FK expansion  │                         │ hybrid / vector / graph │
      └───────────────┘                         └────────────────────────┘
```

#### When to Use Each Mode
- `vector` is best when the question is mostly semantic.
- `graph` is best when foreign-key traversal matters more than similarity.
- `hybrid` is the default when you want both recall and structure.
- `expand` is best when you already have seed tables from a previous turn.

### Context Injection^

The expand flow depends on two components:
- `SchemaRetrieveContextEnricher` reads conversation history and injects `schema_retrieve_context` into `ToolContext`.
- `SchemaContextEnhancer` appends search-mode rules and retrieved schema summaries into the LLM prompt and messages.

This lets the next `schema_retrieve` call reuse tables found in the previous turn.

#### Context Injection Diagram^
```text
┌──────────────────────────────┐
│ Conversation history         │
│ contains previous results    │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ SchemaRetrieveContextEnricher│
│ extracts selected_tables     │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ ToolContext.metadata         │
│ schema_retrieve_context      │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ schema_retrieve tool call    │
│ can use expand mode          │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ SchemaContextEnhancer       │
│ injects rules and summary   │
└──────────────────────────────┘
```

### Search Result Shape
Schema retrieval returns both machine-readable and human-readable outputs:
- `result_for_llm`: a structured text summary.
- `ui_component`: a rich schema card.
- `metadata`: selected tables, search mode, graph hint, domain filter, required fields, and seed tables.

This gives the model and the user the same retrieval result in different formats.

### What It Prevents
Schema memory mainly prevents three common failure modes:
- the model guesses the wrong table,
- the model joins the wrong tables,
- the model loses context across turns.

It does this by separating:
- schema extraction,
- persistent storage,
- retrieval strategy,
- context injection,
- user-facing rendering.

The split keeps each step narrow and easier to debug.

### Schema Memory Diagram^*
```text
┌──────────────────────────────────────────────────────────────────────────┐
│                              Schema Memory                               │
│                                                                          │
│   Source DB → SchemaExtractor → SchemaSyncEngine → Neo4j/Mem0 storage     │
│                                                                          │
│   Runtime query → schema_retrieve → Context Enricher → LLM prompt        │
│                                          │                               │
│                                          ▼                               │
│                               hybrid / vector / graph / expand           │
│                                          │                               │
│                                          ▼                               │
│                                schema card + metadata + seed tables      │
└──────────────────────────────────────────────────────────────────────────┘
```

### Schema Management

Schema Management provides the admin commands and WebUI for working with stored schema data. It lets operators list tables, inspect details, edit business context, enrich missing metadata, and delete stale entries.

`/init_schema` only builds or refreshes the schema corpus. Schema Management maintains it afterward.

#### Schema Management Commands
![schema management commands](../../figures/schema_commands.png)

Operators get a small command surface:
- `/schema_list` shows every stored table with completeness status.
- `/schema_list incomplete` narrows the list to tables that still need work.
- `/schema_detail <table>` or `/schema_detail <schema>.<table>` opens one table for review and editing. When the schema name is omitted, the workflow falls back to `public`.
- `/schema_enrich` asks the LLM to fill missing domain, description, keywords, and field meanings. Without a table argument, it targets incomplete tables only.
- `/schema_enrich <table>` enriches one specific table.

The list view shows inventory and completeness. The detail view shows business context, field meanings, foreign keys, and completeness. The enrich command fills missing metadata and can process multiple incomplete tables in one run.

#### Schema Management Dashboard (WebUI)
![schema management dashboard](../../figures/schema_dashboard.png)

The dashboard is a thin client over the same schema management API. It uses:
- `GET /api/querymind/v1/schema/tables`
- `GET /api/querymind/v1/schema/tables/{full_name}`
- `PUT /api/querymind/v1/schema/tables/{full_name}/metadata`
- `POST /api/querymind/v1/schema/tables/{full_name}/enrich`
- `DELETE /api/querymind/v1/schema/tables/{full_name}`
- `POST /api/querymind/v1/schema/tables/delete`

The page is built for review and correction. The left sidebar provides search, stats, checkbox selection, and batch delete. The right pane shows one table at a time, with editable domain, description, keywords, and per-field business meanings. Edits are tracked as drafts, and the AI Enrich button fills missing metadata into the draft instead of committing blindly. All actions remain admin-only.

#### Not `/init_schema`
`/init_schema` is the ingestion step. Schema Management is the curation step.

## Closing Note

QueryMind memory has one goal: keep the next decision grounded.

Agent Memory stores successful tool paths and reusable notes.
Schema Memory stores table structure, relationships, and business context.

Together they reduce retries, wrong-table SQL, and repeated setup work.


<details open>
<summary>Relevant source files</summary>

- [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py) - wires memory capabilities into the agent runtime
- [`src/QueryMind/core/agent/config.py`](../../../src/QueryMind/core/agent/config.py) - UI feature flags and schema-related defaults used by memory workflows
- [`src/QueryMind/core/tool/base.py`](../../../src/QueryMind/core/tool/base.py) - tool interface used by memory-related tools
- [`src/QueryMind/core/tool/models.py`](../../../src/QueryMind/core/tool/models.py) - tool context and result models used across memory flows
- [`src/QueryMind/core/system_prompt/base.py`](../../../src/QueryMind/core/system_prompt/base.py) - system prompt builder interface
- [`src/QueryMind/core/system_prompt/default.py`](../../../src/QueryMind/core/system_prompt/default.py) - default system prompt builder used by memory-aware agents
- [`src/QueryMind/core/enhancer/base.py`](../../../src/QueryMind/core/enhancer/base.py) - LLM context enhancer interface
- [`src/QueryMind/core/enhancer/composite.py`](../../../src/QueryMind/core/enhancer/composite.py) - composite enhancer orchestration
- [`src/QueryMind/core/storage/base.py`](../../../src/QueryMind/core/storage/base.py) - conversation store interface used by history-aware memory flows
- [`src/QueryMind/core/storage/models.py`](../../../src/QueryMind/core/storage/models.py) - conversation and message models
- [`src/QueryMind/capabilities/agent_memory/base.py`](../../../src/QueryMind/capabilities/agent_memory/base.py) - agent memory interface
- [`src/QueryMind/capabilities/agent_memory/models.py`](../../../src/QueryMind/capabilities/agent_memory/models.py) - tool memory and text memory models
- [`src/QueryMind/capabilities/schema_memory/base.py`](../../../src/QueryMind/capabilities/schema_memory/base.py) - schema memory interface
- [`src/QueryMind/capabilities/schema_memory/models.py`](../../../src/QueryMind/capabilities/schema_memory/models.py) - schema storage and search data models
- [`src/QueryMind/capabilities/schema_management/base.py`](../../../src/QueryMind/capabilities/schema_management/base.py) - schema management service interface
- [`src/QueryMind/capabilities/schema_management/models.py`](../../../src/QueryMind/capabilities/schema_management/models.py) - schema management list and enrichment models
- [`src/QueryMind/capabilities/schema_extracter/base.py`](../../../src/QueryMind/capabilities/schema_extracter/base.py) - schema extraction interface and sync engine
- [`src/QueryMind/capabilities/schema_extracter/models.py`](../../../src/QueryMind/capabilities/schema_extracter/models.py) - schema extraction result and init models
- [`src/QueryMind/tools/agent_memory.py`](../../../src/QueryMind/tools/agent_memory.py) - built-in agent memory tools
- [`src/QueryMind/tools/schema_retrieve.py`](../../../src/QueryMind/tools/schema_retrieve.py) - built-in schema retrieval tool
- [`src/QueryMind/core/enhancer/default.py`](../../../src/QueryMind/core/enhancer/default.py) - memory-backed LLM prompt enrichment
- [`src/QueryMind/core/enhancer/schema_retrieve.py`](../../../src/QueryMind/core/enhancer/schema_retrieve.py) - schema retrieval prompt rules and mode guidance
- [`src/QueryMind/core/enricher/base.py`](../../../src/QueryMind/core/enricher/base.py) - tool-context enricher interface
- [`src/QueryMind/core/enricher/schema_retrieve.py`](../../../src/QueryMind/core/enricher/schema_retrieve.py) - history-aware schema retrieval context injection
- [`src/QueryMind/core/workflow/base.py`](../../../src/QueryMind/core/workflow/base.py) - workflow contract used by memory commands
- [`src/QueryMind/core/workflow/default.py`](../../../src/QueryMind/core/workflow/default.py) - default memory command handling and starter UI
- [`src/QueryMind/core/workflow/composite.py`](../../../src/QueryMind/core/workflow/composite.py) - workflow handler composition
- [`src/QueryMind/core/workflow/schema_init_workflow.py`](../../../src/QueryMind/core/workflow/schema_init_workflow.py) - `/init_schema` workflow
- [`src/QueryMind/core/workflow/schema_management_workflow.py`](../../../src/QueryMind/core/workflow/schema_management_workflow.py) - schema management commands
- [`src/QueryMind/integrations/local/agent_memory/in_memory.py`](../../../src/QueryMind/integrations/local/agent_memory/in_memory.py) - local demo agent-memory backend
- [`src/QueryMind/integrations/local/storage.py`](../../../src/QueryMind/integrations/local/storage.py) - in-memory conversation store implementation
- [`src/QueryMind/integrations/local/file_system_conversation_store.py`](../../../src/QueryMind/integrations/local/file_system_conversation_store.py) - file-backed conversation history store
- [`src/QueryMind/integrations/agentmemory/mem0/agent_memory.py`](../../../src/QueryMind/integrations/agentmemory/mem0/agent_memory.py) - Mem0-backed agent-memory backend
- [`src/QueryMind/integrations/agentmemory/mem0/config.py`](../../../src/QueryMind/integrations/agentmemory/mem0/config.py) - Mem0 agent-memory connection config
- [`src/QueryMind/integrations/schemamemory/memory.py`](../../../src/QueryMind/integrations/schemamemory/memory.py) - Neo4j + Mem0 schema-memory backend
- [`src/QueryMind/integrations/schemamemory/schema_search.py`](../../../src/QueryMind/integrations/schemamemory/schema_search.py) - fused schema search engine
- [`src/QueryMind/integrations/schemamemory/vector_layer/vector_store.py`](../../../src/QueryMind/integrations/schemamemory/vector_layer/vector_store.py) - vector storage layer used by schema memory
- [`src/QueryMind/integrations/schemamemory/vector_layer/mem0_config.py`](../../../src/QueryMind/integrations/schemamemory/vector_layer/mem0_config.py) - Mem0 config for schema vector storage
- [`src/QueryMind/integrations/schemamemory/graph_layer/graph_store.py`](../../../src/QueryMind/integrations/schemamemory/graph_layer/graph_store.py) - graph storage layer used by schema memory
- [`src/QueryMind/integrations/schemamemory/graph_layer/neo4j_config.py`](../../../src/QueryMind/integrations/schemamemory/graph_layer/neo4j_config.py) - Neo4j config for schema graph storage
- [`src/QueryMind/integrations/schemamanagement/neo4j_mem0/neo4j_mem0_schema_management.py`](../../../src/QueryMind/integrations/schemamanagement/neo4j_mem0/neo4j_mem0_schema_management.py) - concrete schema management implementation
- [`src/QueryMind/integrations/schemaextractor/sqlite/sqlite_extractor.py`](../../../src/QueryMind/integrations/schemaextractor/sqlite/sqlite_extractor.py) - SQLite schema extractor backend
- [`src/QueryMind/integrations/schemaextractor/postgres/postgres_extractor.py`](../../../src/QueryMind/integrations/schemaextractor/postgres/postgres_extractor.py) - Postgres schema extractor backend
- [`src/QueryMind/integrations/schemaextractor/mssql/mssql_extractor.py`](../../../src/QueryMind/integrations/schemaextractor/mssql/mssql_extractor.py) - MSSQL schema extractor backend
- [`src/QueryMind/components/rich/schema_management/schema_list_component.py`](../../../src/QueryMind/components/rich/schema_management/schema_list_component.py) - schema list UI component
- [`src/QueryMind/components/rich/schema_management/schema_detail_component.py`](../../../src/QueryMind/components/rich/schema_management/schema_detail_component.py) - schema detail UI component
- [`src/QueryMind/components/rich/schema_retrieve.py`](../../../src/QueryMind/components/rich/schema_retrieve.py) - schema retrieval UI component
- [`src/QueryMind/server/fastapi/routes.py`](../../../src/QueryMind/server/fastapi/routes.py) - schema management HTTP API

</details>
