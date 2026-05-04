# Memory Systems

QueryMind has two separate memory systems:

- Agent Memory stores reusable tool patterns and free-form notes.
- Schema Memory stores table schemas, field metadata, and relationship context.

They serve different purposes and should be documented separately from prompt
construction and governance policy.

## Agent Memory

Agent Memory stores two kinds of reusable experience:

- Tool memory: successful question/tool/args combinations.
- Text memory: free-form knowledge, definitions, and domain notes.

This is the runtime contract behind the memory tools and the default memory
context enhancer.

### Agent Memory Interface

The abstract `AgentMemory` interface defines the storage contract:

- `save_tool_usage(...)`
- `save_text_memory(...)`
- `search_similar_usage(...)`
- `search_text_memories(...)`
- `get_recent_memories(...)`
- `get_recent_text_memories(...)`
- `delete_by_id(...)`
- `delete_text_memory(...)`
- `clear_memories(...)`

The concrete memory tools and enhancers all depend on that interface, not on a
specific backend.

### Tool Memory

Tool memory records the successful question, tool name, arguments, success
flag, and optional metadata for a tool call.

The stored model is `ToolMemory`.
Search results are represented by `ToolMemorySearchResult`.

The main tool-facing behavior is:

- save a successful tool pattern for reuse later;
- search prior successful patterns by question similarity;
- surface the result to both the LLM and the UI;
- degrade safely when the backend is unavailable.

### Text Memory

Text memory stores durable notes and observations that are useful across turns.
The stored model is `TextMemory`.
Search results are represented by `TextMemorySearchResult`.

The memory enhancer uses text memory to provide extra context before the LLM
starts reasoning. It appends relevant snippets to the system prompt when the
backend is healthy and returns the original prompt unchanged otherwise.

### Memory Backends

QueryMind ships with two practical Agent Memory backends:

- `DemoAgentMemory` keeps memories in RAM for demos and tests.
- `Mem0AgentMemory` uses Mem0 for persistent storage, isolation, and semantic
  search.

`DemoAgentMemory` is intentionally simple:

- it keeps tool and text memories in memory;
- it uses lightweight similarity measures such as Jaccard and difflib ratio;
- it supports FIFO eviction;
- it is protected by an `asyncio.Lock`.

`Mem0AgentMemory` is the higher-fidelity backend:

- it isolates memories by user and agent;
- it can scope tool memories to the current conversation when requested;
- it stores metadata alongside each record;
- it can fall back to no-op mode when Mem0 is unavailable;
- it supports similarity search and reranking through the Mem0 backend.

### Agent Memory ASCII Diagram

The diagram below connects `save_question_tool_args`,
`search_saved_correct_tool_uses`, `save_text_memory`, and
`DefaultLlmContextEnhancer` into one flow and shows how reusable experience is
fed back into the system prompt.

```text
+====================================================================================================+
| 1) Memory tool entry                                                                              |
|----------------------------------------------------------------------------------------------------|
| Input: ToolContext + original question + tool arguments                                             |
| Key fields: context.raw_user_message, context.metadata.ui_features_available                       |
| Logic:                                                                                             |
|   - save_question_tool_args saves successful question/tool/args combinations                       |
|   - search_saved_correct_tool_uses searches historical successful usage                            |
|   - save_text_memory stores free-form notes                                                        |
| Real trace:                                                                                        |
|   - "Found 2 similar tool usage pattern(s):"                                                       |
|   - question = "calculate salary percentile by department CUME_DIST PERCENT_RANK"                  |
|   - question = "calculate the salary percentile for each employee within the                       |
|     'Information Services' and 'Document Control' departments"                                     |
|   - args.sql = "SELECT ... CUME_DIST() ... PERCENT_RANK() ... FROM employeedepartmentrate ..."     |
| Output: ToolResult(result_for_llm + ui_component)                                                   |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 2) AgentMemory interface                                                                          |
|----------------------------------------------------------------------------------------------------|
| Call chain:                                                                                        |
|   context.agent_memory.search_similar_usage(...)                                                   |
|   context.agent_memory.save_tool_usage(...)                                                        |
|   context.agent_memory.save_text_memory(...)                                                       |
| Role: hide backend differences behind one contract                                                 |
| Output: ToolMemory / TextMemory / SearchResult                                                     |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 3) Mem0AgentMemory backend                                                                         |
|----------------------------------------------------------------------------------------------------|
| my_agent.py wiring: agent_mem = Mem0AgentMemory(config=create_config_from_env())                   |
| Logic:                                                                                             |
|   - isolate by user_id / agent_id                                                                  |
|   - persist tool usage and text memory                                                             |
|   - return no-op behavior when `is_degraded` is true                                               |
|   - serialize args into metadata when needed                                                       |
| Real data shape:                                                                                   |
|   - ToolMemory.question / tool_name / args                                                         |
|   - TextMemory.content                                                                              |
| Output: reusable, searchable agent memory records                                                  |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 4) DefaultLlmContextEnhancer                                                                       |
|----------------------------------------------------------------------------------------------------|
| my_agent.py wiring: DefaultLlmContextEnhancer(agent_memory=agent_mem)                              |
| Logic:                                                                                             |
|   - build a temporary ToolContext(conversation_id='temp', request_id=uuid4())                      |
|   - call search_text_memories(query=user_message, limit=5)                                         |
|   - append matching snippets to the system prompt                                                  |
|   - return the original prompt unchanged when degraded or failing                                  |
| Real prompt excerpt:                                                                               |
|   - "## Relevant Context from Memory"                                                              |
|   - "The following domain knowledge and context from prior interactions may be relevant:"         |
| Output: enhanced system prompt                                                                     |
+====================================================================================================+
```

## Agent Memory Tools

The memory tools live in `QueryMind.tools.agent_memory` and expose the memory
contract to the LLM.

### `save_question_tool_args`

This tool saves one successful question/tool/args combination.

It:

- uses the canonical user question when `ToolContext.raw_user_message` is
  available;
- writes the usage pattern through `context.agent_memory.save_tool_usage(...)`;
- returns a success message and a small status UI component;
- returns a graceful no-op message when the backend is degraded.

### `search_saved_correct_tool_uses`

This tool searches previous successful tool-use examples for a question.

It:

- queries `context.agent_memory.search_similar_usage(...)`;
- supports `limit`, `similarity_threshold`, and `tool_name_filter`;
- returns both LLM text and a UI payload;
- can render a compact status response or a detailed memory card depending on
  UI features in `ToolContext.metadata`;
- degrades safely when the memory backend is unavailable or empty.

### `save_text_memory`

This tool stores free-form notes, definitions, or observations.

It:

- writes content through `context.agent_memory.save_text_memory(...)`;
- returns the saved memory id when available;
- returns a graceful no-op response when persistence is unavailable;
- uses a compact status UI component.

## Schema Memory

Schema Memory stores table schemas and retrieval metadata for `schema_retrieve`.

The capability interface defines the storage and search contract:

- save table schemas;
- batch save schemas;
- update schemas;
- search by business query;
- search by field names;
- search by foreign-key relationships;
- perform hybrid retrieval;
- list and delete stored table schemas.

The core models are:

- `BusinessContext`
- `FieldDefinition`
- `ForeignKeyReference`
- `TableRelationship`
- `TableSchema`
- `SchemaSearchResult`

### Schema Memory Backends

`Neo4jMem0SchemaMemory` is the main implementation in the current codebase.
It combines:

- Neo4j for graph-shaped schema data;
- Mem0 for semantic schema lookup;
- `SchemaSearch` for hybrid retrieval and result fusion.

The backend normalizes table metadata into structured schemas, stores them in
both layers, and returns search results that carry table schemas plus ranking
metadata.

### Schema Memory ASCII Diagram

The diagram below connects `SchemaRetrieveContextEnricher`,
`SchemaRetrieveTool`, `Neo4jMem0SchemaMemory`, the `schema_governance` state
snapshot, and `SchemaContextEnhancer` into one flow. It uses the real `sql_126`
trace to show how the lock heuristic works.

```text
+====================================================================================================+
| 1) SchemaRetrieveContextEnricher                                                                  |
|----------------------------------------------------------------------------------------------------|
| Input: ToolContext + conversation_id + recent conversation history                                |
| Logic:                                                                                             |
|   - prefer context.metadata.last_schema_summary first                                              |
|   - otherwise fall back to conversation_store.get_recent(..., limit=10)                           |
|   - extract seed_tables / seed_table_refs / schema_locked                                         |
| Real trace:                                                                                        |
|   - last_schema_summary = "schema_retrieve[hybrid] query='employees with SalariedFlag             |
|     and BusinessEntityID' -> 10 table(s)"                                                          |
|   - schema_retrieve_context.seed_tables = [...]                                                     |
| Output: context.metadata.last_schema_summary / schema_retrieve_context                             |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 2) SchemaRetrieveTool                                                                              |
|----------------------------------------------------------------------------------------------------|
| Input parameters: query, search_mode, graph_hint, required_fields, limit, similarity_threshold      |
| my_agent.py wiring: SchemaRetrieveTool(schema_memory=schema_mem)                                    |
| Role: turn LLM retrieval intent into schema_memory.search_schema(...)                               |
| Real parameters:                                                                                   |
|   - query="employees with SalariedFlag and BusinessEntityID"                                       |
|     search_mode="hybrid"                                                                            |
|   - query="HumanResources Employee table with SalariedFlag and BusinessEntityID"                   |
|     search_mode="vector"                                                                            |
|   - query="employee table human resources"                                                          |
|     search_mode="hybrid"                                                                            |
| Output: SchemaSearchResult[]                                                                        |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 3) Neo4jMem0SchemaMemory + SchemaSearch                                                            |
|----------------------------------------------------------------------------------------------------|
| my_agent.py wiring: schema_mem = Neo4jMem0SchemaMemory(...)                                         |
| Structure: Neo4jGraphStore + Mem0VectorStore + RRF fusion                                           |
| Logic:                                                                                             |
|   - search_hybrid(): vector_task + graph_task -> asyncio.gather(...)                               |
|   - graph search only runs when required_fields or domain_filter is explicit                        |
|   - use RRF to fuse vector / graph results into one ranking                                         |
| Real result shape:                                                                                 |
|   - 10 table(s) / 0 table(s) / lock=enough_schema                                                   |
| Output: TableSchema + similarity_score + rank + match_reason                                        |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 4) schema_governance state snapshot                                                                |
|----------------------------------------------------------------------------------------------------|
| Source: schema_governance.hook + last_schema_summary                                                |
| Role: compress discovery progress into a compact state and decide whether to lock schema retrieval  |
| Real states:                                                                                       |
|   - calls=1 successes=1 failures=0 locked=False                                                     |
|   - calls=3 successes=2 failures=1 locked=True lock_reason=enough_schema                           |
|   - calls=4 failures=3 lock_reason=schema_retrieve_empty_results                                   |
| Output: schema_locked + lock_reason + summarized schema context                                      |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 5) SchemaContextEnhancer                                                                           |
|----------------------------------------------------------------------------------------------------|
| my_agent.py wiring: SchemaContextEnhancer()                                                         |
| Logic:                                                                                             |
|   - stop appending retrieval rules once schema_locked is true                                      |
|   - otherwise inject `## Schema Retrieval Tool - Search Mode Selection Rules`                      |
|   - prepend `【Current Retrieved Schema Information】` as a system message                          |
| Real prompt excerpt:                                                                               |
|   - "## Schema Retrieval Tool - Search Mode Selection Rules"                                       |
|   - "【Current Retrieved Schema Information】"                                                       |
| Output: final prompt / message with schema rules and current snapshot                               |
+====================================================================================================+
```

## What This Page Covers

- Agent Memory and Schema Memory as separate systems;
- the Agent Memory interface;
- memory tools;
- concrete memory backends;
- Schema Memory storage and search capabilities.

## What This Page Does Not Cover

- prompt-chain assembly;
- schema exploration governance;
- SQL drafting governance;
- conversation persistence;
- tool registry policy.

Those belong in the prompt-chain, governance, conversation, and tools pages.

## Source Files

- [`src/QueryMind/capabilities/agent_memory/base.py`](../../../src/QueryMind/capabilities/agent_memory/base.py)
- [`src/QueryMind/capabilities/agent_memory/models.py`](../../../src/QueryMind/capabilities/agent_memory/models.py)
- [`src/QueryMind/integrations/local/agent_memory/in_memory.py`](../../../src/QueryMind/integrations/local/agent_memory/in_memory.py)
- [`src/QueryMind/integrations/agentmemory/mem0/agent_memory.py`](../../../src/QueryMind/integrations/agentmemory/mem0/agent_memory.py)
- [`src/QueryMind/tools/agent_memory.py`](../../../src/QueryMind/tools/agent_memory.py)
- [`src/QueryMind/core/enhancer/default.py`](../../../src/QueryMind/core/enhancer/default.py)
- [`src/QueryMind/core/enhancer/schema_retrieve.py`](../../../src/QueryMind/core/enhancer/schema_retrieve.py)
- [`src/QueryMind/core/enricher/schema_retrieve.py`](../../../src/QueryMind/core/enricher/schema_retrieve.py)
- [`src/my_agent.py`](../../../src/my_agent.py)
- [`src/QueryMind/capabilities/schema_memory/base.py`](../../../src/QueryMind/capabilities/schema_memory/base.py)
- [`src/QueryMind/capabilities/schema_memory/models.py`](../../../src/QueryMind/capabilities/schema_memory/models.py)
- [`src/QueryMind/integrations/schemamemory/memory.py`](../../../src/QueryMind/integrations/schemamemory/memory.py)
- [`src/QueryMind/integrations/schemamemory/schema_search.py`](../../../src/QueryMind/integrations/schemamemory/schema_search.py)
- [`src/evals/resume_points/20260430_023016_f36173c6/run.log`](../../../src/evals/resume_points/20260430_023016_f36173c6/run.log)
