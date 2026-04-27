# QueryMind Handbook Structure

QueryMind is an LLM agent framework for building natural-language-to-SQL agents, with enterprise-grade security and a dual-memory-driven RAG system.

It is especially well suited to multi-turn analytical work. One turn can identify the right tables, the next turn can expand from them, and admin workflows can initialize or maintain Schema Memory directly instead of relying on the model to guess important business knowledge such as table relationships and field definitions. That makes Text-to-SQL more accurate and easier to control.

---

## 🌟 Core Features

| Feature | What it does | Why it matters |
|---------|--------------|----------------|
| Dual Memory System | Agent Memory stores reusable tool-use patterns and text notes; Schema Memory stores table structure, fields, and relationships. | Separates procedural know-how from database structure. |
| Hybrid Schema Search | Combines Mem0 vector search with Neo4j graph traversal and fuses results with RRF. | Improves recall for both semantic and relationship-heavy schema questions. |
| Multi-turn Schema Expansion | `schema_retrieve` can switch into `expand` mode when seed tables are available from history. | Lets follow-up queries continue from a previous search instead of starting over. |
| Context Assembly Pipeline | System prompt building, LLM enhancers, tool enrichers, and conversation filters each operate at a different layer. | Keeps prompt policy, runtime state, and message history easy to reason about. |
| Deterministic Workflow Handling | Slash commands and starter UI are intercepted before the LLM. | Makes admin tasks, setup checks, and schema management predictable. |
| Policy-aware Tool Registry | Tool visibility, argument validation, and execution policy are centralized in the registry. | Allows the same tool implementation to run safely in demo, test, and production setups. |
| Security & RLS | Access control uses group memberships, and `run_sql` can be rewritten or rejected by `RLSToolRegistry`. | Protects the database without embedding policy into every tool. |
| Conversation History Store | Conversation state is persisted separately from memory and can be replayed, listed, or searched for recent turns. | Supports multi-turn behavior and history-aware enrichers. |
| Extensibility Hooks | Hooks, middleware, recovery strategies, observability, enrichers, and schema services are all pluggable. | Keeps the core agent small while allowing project-specific behavior. |

---

## 🏗️ Architecture^

QueryMind is organized around a single orchestrator, `Agent`, with cross-cutting layers for workflow handling, context assembly, policy enforcement, memory, and persistence. The main design choice is separation of concerns: the model reasons, but the system keeps identity, state, policy, and storage explicit.

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 QUERYMIND ARCHITECTURE FLOW                                  │
│                                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 1. REQUEST BOUNDARY                                                                   │  │
│  │    RequestContext → UserResolver → User                                               │  │
│  └──────────────────────────────────────────┬─────────────────────────────────────────────┘  │
│                                             ▼                                                │
│  ┌────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 2. AGENT CONTROL PLANE                                                                │  │
│  │    WorkflowHandler | ConversationStore | Hooks | Middleware                           │  │
│  │    ErrorRecovery | Observability | Audit                                              │  │
│  └──────────────────────────────────────────┬─────────────────────────────────────────────┘  │
│                                             ▼                                                │
│  ┌────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 3. CONTEXT ASSEMBLY                                                                   │  │
│  │    ToolContextEnricher → Tool schemas → SystemPromptBuilder                           │  │
│  │    LlmContextEnhancer → ConversationFilter                                            │  │
│  └──────────────────────────────────────────┬─────────────────────────────────────────────┘  │
│                                             ▼                                                │
│  ┌────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 4. TOOL & POLICY PLANE                                                                │  │
│  │    ToolRegistry / RLSToolRegistry → validation → policy transform → execution         │  │
│  │    access checks | RLS rules | audit logging                                           │  │
│  └──────────────────────────────────────────┬─────────────────────────────────────────────┘  │
│                                             ▼                                                │
│  ┌────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 5. MEMORY & SCHEMA PLANE                                                              │  │
│  │    AgentMemory (Mem0) | SchemaMemory (Neo4j + Mem0) | SchemaManagementService         │  │
│  │    retrieval | expansion | curation                                                    │  │
│  └──────────────────────────────────────────┬─────────────────────────────────────────────┘  │
│                                             ▼                                                │
│  ┌────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 6. RUNTIME INTEGRATIONS                                                               │  │
│  │    LLM service | SQL runners | FileSystem | ConversationStore                          │  │
│  │    Neo4j | Mem0 | Audit logger                                                         │  │
│  └────────────────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

At a glance, the request boundary resolves the user, the workflow layer can short-circuit a turn, the context pipeline prepares the prompt and tool state, the registry executes tools under policy, and the storage/memory layers preserve what happened.

---

## 🔄 Agent Loop for one query^

The current loop in `Agent._send_message()` is deliberately ordered: resolve the user, handle starter UI, try workflows before the message is appended, assemble context, build the prompt, run the LLM/tool loop, then persist and finalize. That order keeps deterministic commands out of the probabilistic path and makes history easier to reason about.

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   AGENT LOOP DATA FLOW                                       │
│                                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 1. USER MESSAGE + REQUEST CONTEXT                                                      │  │
│  │    e.g. "Find orders from Northwest region"                                            │  │
│  └────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                            │                                                 │
│                                            ▼                                                 │
│  ┌────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 2. USER RESOLUTION                                                                    │  │
│  │    UserResolver.resolve_user(request_context)                                          │  │
│  └────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                            │                                                 │
│                                            ▼                                                 │
│  ┌────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 3. EARLY ROUTING                                                                      │  │
│  │    starter UI request? / empty message?                                                │  │
│  │    ├─ starter UI → workflow_handler.get_starter_ui()                                   │  │
│  │    └─ empty message → return                                                           │  │
│  └────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                            │                                                 │
│                                            ▼                                                 │
│  ┌────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 4. CONVERSATION LOAD                                                                  │  │
│  │    load existing conversation or create an empty one                                    │  │
│  └────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                            │                                                 │
│                                            ▼                                                 │
│  ┌────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 5. WORKFLOW HANDLER CHECK                                                             │  │
│  │    DefaultWorkflowHandler / SchemaInitWorkflow / SchemaManagementWorkflow              │  │
│  │    handled → mutate conversation + stream UI + auto-save + return                      │  │
│  └────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                            │                                                 │
│                                            ▼                                                 │
│  ┌────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 6. CONTEXT ASSEMBLY                                                                   │  │
│  │    ToolContextEnrichers → Tool schemas → SystemPromptBuilder + LlmContextEnhancer      │  │
│  │    ConversationFilter → build LLM request                                              │  │
│  └────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                            │                                                 │
│                                            ▼                                                 │
│  ┌────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 7. LLM RESPONSE / TOOL LOOP                                                            │  │
│  │    text → final answer                                                                  │  │
│  │    tool calls → ToolRegistry / RLSToolRegistry → execute → append tool results          │  │
│  │    repeat until max_tool_iterations or no more tool calls                                │  │
│  └────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                            │                                                 │
│                                            ▼                                                 │
│  ┌────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 8. FINALIZATION                                                                       │  │
│  │    save conversation, run after-message hooks, stream final UI                          │  │
│  └────────────────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

The loop stops when the model returns a final answer or when `max_tool_iterations` is reached, in which case QueryMind emits a warning and marks the response as potentially incomplete. Conversation persistence and after-message hooks happen after the loop completes.

---

## 🧩 Core Components

The sections below summarize the six major subsystems that make QueryMind work. Each has a dedicated subdocument because the implementation is deep enough to deserve its own reference page.

---

### *Tool System*

The tool layer turns LLM suggestions into typed, inspectable actions. The registry decides which tools are visible and executable, while each tool stays focused on one capability such as SQL execution, schema discovery, memory, file-system access, Python execution, or visualization. The key design choice is separation of policy and capability: `RunSqlTool` does not need to know whether a query is allowed, and `RLSToolRegistry` does not need to know how to execute SQL.

This is also where QueryMind gets its strongest operator story. `ToolResult` carries both the LLM-facing text and the UI payload, so the same call can power chat output and structured components. The registry also centralizes access checks, argument validation, audit logging, and policy rewriting, which makes the system safer without making the tools themselves harder to reuse.

Read more in [Tool System](./components/tools.md) and the related policy reference in [Security & Access Control](./components/security.md).

---

### *Agent Memory (RAG) System*

QueryMind uses two different memory planes for two different jobs. Agent Memory stores reusable tool-use patterns and text notes, while Schema Memory stores table structure, fields, relationships, and business context. That split matters because the system should remember both how to solve a problem and what the database actually looks like.

The innovation here is not just “memory exists.” It is that QueryMind keeps procedural memory and structural memory separate, then lets each one feed a different stage of the agent loop. Agent Memory can help the model reuse a known-good query pattern, while Schema Memory can ground the same question in actual table relationships.

Read more in [Agent Memory (RAG) System](./components/memory.md).

---

### *Context Assembly/Enhancement Pipeline*

QueryMind assembles context in three layers: the `SystemPromptBuilder` creates the base instruction scaffold, `LlmContextEnhancer` enriches the prompt and message stream before each LLM call, and `ToolContextEnricher` injects execution-time state into tool calls. This separation keeps prompt policy, conversational evidence, and tool runtime state from being mixed together.

The most interesting part is stateful retrieval. `SchemaRetrieveContextEnricher` reads recent conversation history, extracts the last `schema_retrieve` result, and injects `seed_tables` into `ToolContext.metadata`. That lets a follow-up question continue from the previous schema search instead of forcing the model to reconstruct the same context in prose.

Read more in [Context Assembly/Enhancement Pipeline](./components/context.md).

---

### *Workflow Handler*

Workflow handlers are QueryMind’s deterministic pre-LLM routing layer. They intercept a message before the agent sends it to the model, decide whether a command or stateful workflow should run, and either return UI immediately or let the normal LLM pipeline continue.

This is where admin commands become first-class operations. `DefaultWorkflowHandler` handles `/help`, `/status`, `/memories`, and `/delete`; `SchemaInitWorkflow` exposes `/init_schema`; `SchemaManagementWorkflow` exposes `/schema_list`, `/schema_detail`, and `/schema_enrich`; and `CompositeWorkflowHandler` lets them coexist cleanly. The model stays focused on reasoning, while exact commands stay exact.

Read more in [Workflow Handler](./components/workflow.md).

---

### *Security & Access Control*

Security in QueryMind is layered. Request identity is resolved first, tool access is gated by group membership, UI features are gated by the same primitive, and SQL safety is enforced by a registry-level policy layer before the database call is made. That keeps the system reusable across deployments and easy to explain.

The important innovation is that `RLSToolRegistry.transform_args()` can rewrite or reject `run_sql` before execution. That means row-level security and injection defense are not buried inside the SQL tool. They are deployment policies applied at the registry boundary, which keeps the tool reusable and the security model auditable.

Read more in [Security & Access Control](./components/security.md).

---

### *Conversation Store & History Management*

Conversation storage is the durable source of truth for multi-turn behavior. It keeps exact chat turns, tool calls, and tool results separate from Agent Memory, which stores reusable patterns and knowledge. In other words, conversation history is the transcript, not the long-term memory.

That separation enables a useful trick: recent history can become a state bus for retrieval. `SchemaRetrieveContextEnricher` can look at the last `schema_retrieve` result, recover selected tables, and feed them back into the next turn as `seed_tables`. The file-system backend also makes conversations inspectable outside the app, which is valuable for debugging and operations.

Read more in [Conversation Store & History Management](./components/conversation.md).

---

## Advanced Features

QueryMind’s advanced features are the extension surface around the agent core. Hooks intercept the turn lifecycle, middlewares wrap the LLM boundary, and recovery strategies turn transient failures into explicit retry/fail decisions. Together they keep the core loop small while making customization predictable.

### Lifecycle Hooks
Lifecycle hooks are the broadest interception point in the agent loop. They let a deployment observe or reshape a message before it is processed, watch each tool invocation, and run cleanup after the turn ends. The contract is intentionally lightweight: `before_message()` may replace the text, `before_tool()` can block execution by raising, `after_tool()` may replace the result, and `after_message()` is side-effect only.

Hook execution is ordered and observable. Each hook sees the value left by the previous hook, and the agent wraps each call in spans and timing metrics so policy work stays measurable instead of invisible.

#### Invocation Points^
```text
┌──────────────────────────────┐
│ User message enters Agent    │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ before_message(user, msg)    │
│ rewrite / quota / validate   │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ workflow handling + LLM loop │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ before_tool(tool, context)   │
│ block / audit / enrich check │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ tool_registry.execute(...)   │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ after_tool(result)           │
│ normalize / redact / tag     │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ conversation saved           │
│ after_message(conversation)  │
└──────────────────────────────┘
```

The key boundary is that workflow handlers can short-circuit the turn before the lower hook points are reached. In other words, starter UI and explicit commands may finish without ever entering the tool path.

---

### LLM Middlewares
LLM middlewares sit exactly around the model call. They are narrower than hooks: they do not see user workflow routing or tool execution, only the `LlmRequest` going in and the `LlmResponse` coming back. That makes them a good fit for caching, redaction, request shaping, response logging, and cost tracking.

QueryMind applies the same middleware chain in both non-streaming and streaming paths. The stream is accumulated first, then the post-response middleware sees a single coherent response object, so middleware logic stays symmetric across transport modes.

#### Invocation Points^
```text
┌──────────────────────────────┐
│ Built LLM request            │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ before_llm_request(request)  │
│ cache / redact / reshape     │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ LlmService.send_request()    │
│ or LlmService.stream_request │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ after_llm_response(...)      │
│ log / normalize / fallback   │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ tool loop or final output    │
└──────────────────────────────┘
```

Use middlewares when you want to change how the model is called. Use workflows when you want to bypass the model entirely.

---

### Error Recovery
Error recovery is modeled as a strategy object instead of hard-coded retry logic. The base contract returns a typed `RecoveryAction`, so recovery can express `RETRY`, `FAIL`, `FALLBACK`, or `SKIP` with structured fields such as `retry_delay_ms`, `fallback_value`, and `message`.

The shipped backoff strategy only emits `RETRY` and `FAIL`, but the richer enum leaves room for future fallback behaviors without changing the contract.

`ErrorRecoveryStrategy` exposes two decision points: `handle_tool_error()` and `handle_llm_error()`. The base behavior is fail-fast, while concrete strategies can layer in backoff, fallback text, or graceful degradation.

#### Use Case: ExponentialBackoffStrategy*
`ExponentialBackoffStrategy` is the concrete policy shipped with QueryMind. It is configured in [`src/my_agent.py`](../../src/my_agent.py) and sets the recovery posture for transient failures with a simple rule set: double the delay on each retry, cap the delay, and add optional jitter so many clients do not retry in lockstep.

```text
┌──────────────────────────────┐
│ tool error or LLM error      │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ handle_tool_error()          │
│ or handle_llm_error()        │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ attempt >= max_retries ?     │
└───────┬──────────────┬───────┘
        │ no           │ yes
        ▼              ▼
┌──────────────────────┐   ┌──────────────────────────┐
│ delay = base * 2^n   │   │ RecoveryAction(FAIL)     │
│ cap at max_delay_ms  │   │ user-friendly message    │
│ jitter 50%-100%      │   └──────────────────────────┘
└──────────────┬───────┘
               ▼
┌──────────────────────────────┐
│ RecoveryAction(RETRY, delay) │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ retry the operation          │
└──────────────────────────────┘
```

The innovation here is not retry by itself. It is making retry policy explicit, typed, and deployment-level. That keeps transient-failure handling out of the core agent logic, while still leaving the agent’s outer exception guard in place for the final user-facing fallback.


Notes:
- 主文档中，对于有子文档（标题加粗）的章节，需要提供可跳转的子文档超链接信息。
- `^` 章节表示该章节中有 draw.io diagram，需要为 diagram 预留空间，可先使用 ASCII diagram 进行绘制，后续再替换为更美观的图表。
- `*` 章节表示具有创新性工作的章节，请进行更加详尽的叙述和创新点阐释。
