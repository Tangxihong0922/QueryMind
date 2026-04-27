# Context Assembly/Enhancement Pipeline


QueryMind assembles context in three layers:
- `SystemPromptBuilder` creates the base instruction scaffold.
- `LlmContextEnhancer` enriches the prompt and message stream before each LLM call.
- `ToolContextEnricher` injects execution-time state into tool calls.

This separation is important because prompt context, conversational context, and tool-execution context solve different problems. The system prompt tells the model how to think. The message enhancer gives it relevant prior context. The tool enricher gives tools the runtime state they need to behave correctly.

## System Prompt Builder^

The system prompt builder is the first step in request assembly. Its job is to produce the base prompt for the current user and the tools available in that turn. In the default implementation, the prompt is not static: it is built from the current tool list and can include memory-related instructions when the memory tools are present.

If a fixed `base_prompt` is provided, the default builder returns it as-is and skips dynamic assembly.

The main implementation is `DefaultSystemPromptBuilder`. It:
- identifies the available tools from the tool schema list,
- inspects whether memory-related tools exist,
- adds the core QueryMind role and response guidelines,
- appends structured instructions only when the relevant tools are available.

That design keeps the base prompt short when the agent is configured with a small toolset, but expands it when the agent has memory capabilities. In other words, the prompt adapts to capability, not just to branding.

#### System Prompt Builder Flow^
```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                           SYSTEM PROMPT BUILDING                             │
│                                                                              │
│  ┌──────────────────────────────┐                                            │
│  │ User + Available Tool Schemas │                                            │
│  └──────────────┬───────────────┘                                            │
│                 ▼                                                            │
│  ┌──────────────────────────────┐                                            │
│  │ DefaultSystemPromptBuilder   │                                            │
│  │                              │                                            │
│  │  1. read tool names          │                                            │
│  │  2. detect memory tools      │                                            │
│  │  3. write base assistant role│                                            │
│  │  4. append capability rules  │                                            │
│  └──────────────┬───────────────┘                                            │
│                 ▼                                                            │
│  ┌──────────────────────────────┐                                            │
│  │ Base system prompt           │                                            │
│  │ + optional memory workflow   │                                            │
│  └──────────────────────────────┘                                            │
└──────────────────────────────────────────────────────────────────────────────┘
```

### What the Base Prompt Actually Does

The default prompt establishes a few practical rules:
- the assistant identifies itself as QueryMind,
- the current date is included,
- tool output is treated as externally visible, so the assistant should summarize instead of repeating raw results,
- tool names are listed so the model knows what it can call.

When memory tools are present, the prompt also contains explicit tool-usage policy. That policy is not decorative; it is there to steer the model toward consistent tool search/save behavior.

## LLM Context Enhancers^

LLM context enhancers modify the prompt and message stream right before an LLM call. QueryMind uses them to add memory snippets and schema-routing rules without hardcoding those details into the base prompt.

There are two important enhancer behaviors:
- `enhance_system_prompt()` appends persistent guidance.
- `enhance_user_messages()` injects turn-specific context into the message sequence.

This is a useful split. Stable policy belongs in the system prompt. Fresh evidence belongs in the message stream.

#### LLM Enhancer Pipeline^
```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                             LLM CONTEXT ENHANCERS                            │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ System Prompt                                                          │  │
│  │                                                                        │  │
│  │  DefaultSystemPromptBuilder                                             │  │
│  │           │                                                            │  │
│  │           ▼                                                            │  │
│  │  CompositeLlmContextEnhancer                                           │  │
│  │           │                                                            │  │
│  │   ┌───────┴────────┐                                                   │  │
│  │   ▼                ▼                                                   │  │
│  │ SchemaContextEnhancer   DefaultLlmContextEnhancer                      │  │
│  │   │                    │                                              │  │
│  │   │ append schema      │ search AgentMemory for relevant examples     │  │
│  │   │ routing rules      │ append memory snippets to prompt            │  │
│  │   └────────────┬────────┘                                              │  │
│  └─────────────────┼──────────────────────────────────────────────────────┘  │
│                    ▼                                                         │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ User Messages                                                          │  │
│  │                                                                        │  │
│  │  CompositeLlmContextEnhancer                                           │  │
│  │           │                                                            │  │
│  │           ▼                                                            │  │
│  │  enhance_user_messages()                                               │  │
│  │                                                                        │  │
│  │  - schema enhancer can prepend retrieved schema context                │  │
│  │  - default enhancer usually leaves messages unchanged                  │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### System Prompt Enhancer

`SchemaContextEnhancer` is responsible for schema-routing instructions. It appends search-mode rules to the system prompt so the LLM can choose between `hybrid`, `vector`, `graph`, and `expand` in a way that matches the query.

This matters because QueryMind does not want schema search to be a single fixed strategy. The enhancer gives the model a policy for choosing the search mode based on semantics and context:
- `hybrid` for general business questions,
- `vector` for semantic discovery,
- `graph` for relationship-heavy exploration,
- `expand` when seed tables already exist in context.

The prompt-level rules make the tool selection more reliable, but they are still advisory. The tool execution layer remains the source of truth.

`DefaultLlmContextEnhancer` serves a different purpose. It looks up relevant text memories from `AgentMemory` and appends them to the system prompt as a compact “relevant context” section. That gives the model prior examples or domain facts that are likely to help on the current turn.

If agent memory is missing or degraded, the enhancer leaves the prompt unchanged.

The two enhancers are often combined in `CompositeLlmContextEnhancer`, which applies them in order. This is deliberate: schema rules should be in place before the memory snippets are appended, so the final prompt reads as one coherent instruction set.
If one enhancer fails, the composite skips it and continues with the rest, so a bad enhancer does not break the whole turn.

### User Message Enhancer

The same enhancer interface can also modify message history. In current QueryMind behavior, the schema enhancer uses this path to inject the latest retrieved schema block as a synthetic system message, while the default memory enhancer leaves the messages untouched.

That choice is subtle but useful. Putting retrieved schema context into messages instead of the base prompt makes it easier to separate stable instructions from turn-specific evidence.

#### Why This Layer Exists

The enhancer layer solves a practical LLM problem: the model should not have to infer everything from raw history alone.

Without enhancers, the model may:
- ignore useful prior memory,
- choose the wrong schema search mode,
- or fail to keep retrieval results visible across turns.

By separating prompt policy from retrieved evidence, QueryMind keeps the conversation easier to steer and easier to debug.

## Tool Context Enricher^

Tool context enrichers operate one layer lower than prompt enhancers. They do not change what the model sees directly; they change what the tool receives when the model actually calls it.

The hook is intentionally narrow: enrichers usually mutate `context.metadata` instead of replacing the whole context object.

This is where runtime state becomes execution state. The most important example in QueryMind is `SchemaRetrieveContextEnricher`.

#### Tool Context Enricher Flow^
```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                            TOOL CONTEXT ENRICHMENT                           │
│                                                                              │
│  Conversation history                                                        │
│          │                                                                   │
│          ▼                                                                   │
│  SchemaRetrieveContextEnricher                                               │
│          │                                                                   │
│          ├─→ read recent conversation messages                                │
│          ├─→ find latest schema_retrieve tool result                         │
│          ├─→ extract selected_tables / graph_hint / required_fields          │
│          └─→ write context.metadata["schema_retrieve_context"]               │
│                                                                              │
│          ▼                                                                   │
│  SchemaRetrieveTool.execute()                                                │
│          │                                                                   │
│          └─→ reads seed_tables from ToolContext.metadata                      │
│              and can switch into expand mode                                  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Use Case: Schema Retrieve Context Enricher^*

`SchemaRetrieveContextEnricher` is one of the most important pieces in the whole pipeline because it turns schema retrieval into a multi-turn workflow instead of a one-shot lookup.

Its job is to inspect recent conversation history, locate the latest `schema_retrieve` tool result, and extract the tables selected in that previous step. It then injects a `schema_retrieve_context` object into `ToolContext.metadata`.

That metadata usually contains:
- `seed_tables`
- `seed_table_refs`
- `expand_mode`
- `last_query`
- `graph_hint`
- `required_fields`
- `domain_filter`

This is not just bookkeeping. It is what allows a follow-up query like “find all tables related to those orders” to reuse the previous result instead of starting over.

#### Why This Is Innovative

The key idea is stateful retrieval.

Most systems treat schema search as a stateless query. QueryMind treats it as a conversation. The previous search result becomes an explicit input to the next search. That makes the retrieval process more natural for users and more controllable for the agent.

The benefits are practical:
- better multi-turn follow-up handling,
- less repetition in schema discovery,
- more deterministic expansion from known tables,
- cleaner separation between “finding a good starting point” and “expanding from it”.

In interview terms, this is the part that shows the system is not just doing retrieval. It is maintaining retrieval state.

#### Schema Retrieve Context Flow
```text
┌──────────────────────────────┐
│ Recent conversation history   │
│ contains prior tool results   │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ SchemaRetrieveContextEnricher│
│ finds last schema_retrieve   │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ ToolContext.metadata         │
│ schema_retrieve_context      │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ schema_retrieve tool call    │
│ reads seed_tables            │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ expand mode can continue     │
│ from the prior schema result  │
└──────────────────────────────┘
```

### Assembly Order in Practice

The execution order in the agent is:
- `context_enrichers` run before tool schemas are fetched,
- `SystemPromptBuilder` builds the base prompt,
- `llm_context_enhancer` appends policy and memory context,
- message enhancement runs before each LLM request,
- the resulting `ToolContext` is passed into tool execution.

That order matters because each step consumes a different kind of context. Changing the order would change the behavior.

## Closing Note

The overall pattern is simple: build a base prompt, enrich it with policy and memory, then enrich tool execution with state from the conversation.

That gives QueryMind a clean separation between what the model is told, what it remembers, and what the tool can actually use.


<details open>
<summary>Relevant source files</summary>

- [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py) - request assembly and the main agent loop
- [`src/QueryMind/core/agent/config.py`](../../../src/QueryMind/core/agent/config.py) - agent options, UI feature gating, and schema defaults used during assembly
- [`src/QueryMind/core/user/request_context.py`](../../../src/QueryMind/core/user/request_context.py) - structured request metadata passed into user resolution
- [`src/QueryMind/core/user/resolver.py`](../../../src/QueryMind/core/user/resolver.py) - user resolution interface used at request entry
- [`src/QueryMind/core/user/models.py`](../../../src/QueryMind/core/user/models.py) - user model shared by request assembly and stores
- [`src/QueryMind/core/system_prompt/base.py`](../../../src/QueryMind/core/system_prompt/base.py) - system prompt builder interface
- [`src/QueryMind/core/system_prompt/default.py`](../../../src/QueryMind/core/system_prompt/default.py) - default system prompt assembly
- [`src/QueryMind/core/enhancer/base.py`](../../../src/QueryMind/core/enhancer/base.py) - LLM context enhancer interface
- [`src/QueryMind/core/enhancer/default.py`](../../../src/QueryMind/core/enhancer/default.py) - memory-backed prompt enrichment
- [`src/QueryMind/core/enhancer/composite.py`](../../../src/QueryMind/core/enhancer/composite.py) - enhancer composition and ordering
- [`src/QueryMind/core/enhancer/schema_retrieve.py`](../../../src/QueryMind/core/enhancer/schema_retrieve.py) - schema-routing prompt rules
- [`src/QueryMind/core/enricher/base.py`](../../../src/QueryMind/core/enricher/base.py) - tool context enricher interface
- [`src/QueryMind/core/enricher/schema_retrieve.py`](../../../src/QueryMind/core/enricher/schema_retrieve.py) - history-aware schema retrieval context injection
- [`src/QueryMind/core/filter/base.py`](../../../src/QueryMind/core/filter/base.py) - conversation filter interface
- [`src/QueryMind/core/llm/models.py`](../../../src/QueryMind/core/llm/models.py) - LLM message/request/response contracts used by enhancers and filters
- [`src/QueryMind/core/tool/models.py`](../../../src/QueryMind/core/tool/models.py) - ToolContext and ToolResult contracts used during enrichment and execution
- [`src/QueryMind/capabilities/agent_memory/base.py`](../../../src/QueryMind/capabilities/agent_memory/base.py) - agent memory interface used by memory-backed prompt enrichment
- [`src/QueryMind/capabilities/agent_memory/models.py`](../../../src/QueryMind/capabilities/agent_memory/models.py) - tool/text memory data models
- [`src/QueryMind/capabilities/schema_memory/base.py`](../../../src/QueryMind/capabilities/schema_memory/base.py) - schema memory interface carried in ToolContext
- [`src/QueryMind/capabilities/schema_memory/models.py`](../../../src/QueryMind/capabilities/schema_memory/models.py) - table schema and schema search data models
- [`src/QueryMind/capabilities/schema_management/base.py`](../../../src/QueryMind/capabilities/schema_management/base.py) - schema management service interface carried in ToolContext
- [`src/QueryMind/capabilities/schema_management/models.py`](../../../src/QueryMind/capabilities/schema_management/models.py) - schema management list and enrichment models
- [`src/QueryMind/core/storage/base.py`](../../../src/QueryMind/core/storage/base.py) - conversation store contract
- [`src/QueryMind/core/storage/models.py`](../../../src/QueryMind/core/storage/models.py) - Conversation and Message data models
- [`src/QueryMind/integrations/local/file_system_conversation_store.py`](../../../src/QueryMind/integrations/local/file_system_conversation_store.py) - persistent conversation history backend
- [`src/QueryMind/integrations/local/storage.py`](../../../src/QueryMind/integrations/local/storage.py) - in-memory conversation history backend

</details>
