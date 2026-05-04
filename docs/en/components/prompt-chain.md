# Prompt Chain

Prompt chain covers only the prompt-facing assembly path.
Conversation reads, filtering, and `LlmRequest.messages` construction are documented in [`context.md`](./context.md).

## Actual Assembly Order

The facts here come from [`src/my_agent.py`](../../../src/my_agent.py) and [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py).
The runtime order is:

- `enhancer = CompositeLlmContextEnhancer([schema_governance.enhancer, SchemaContextEnhancer(), DefaultLlmContextEnhancer(agent_mem)])`
- `llm_middlewares = [schema_governance.middleware, sql_governance.middleware]`
- `Agent._prepare_turn_prompt()` builds the system prompt first, then `before_llm_request()` applies request-time injections

```text
+====================================================================================================+
| 1) Agent._prepare_turn_prompt()                                                                    |
|----------------------------------------------------------------------------------------------------|
| input: user_message + tool_schemas + request_metadata                                              |
| logic:                                                                                             |
|   - merge schema-governance snapshot into metadata                                                 |
|   - hide `schema_retrieve` when governance says so                                                 |
|   - render governance block                                                                         |
|   - call DefaultSystemPromptBuilder                                                                 |
|   - run llm_context_enhancer.enhance_system_prompt()                                               |
| output: visible_tool_schemas + system_prompt + merged_metadata                                     |
| example (sql_126): user query = "write a query in SQL to sort the BusinessEntityID ..."           |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 2) DefaultSystemPromptBuilder                                                                      |
|----------------------------------------------------------------------------------------------------|
| input: user + visible_tool_schemas                                                                 |
| logic:                                                                                             |
|   - `base_prompt != None` -> return unchanged                                                      |
|   - otherwise emit today's date, visible tool names, and memory workflow                          |
| prompt excerpt:                                                                                    |
|   "You are QueryMind, an AI data analyst assistant..."                                             |
|   "Response Guidelines:"                                                                           |
|   "- When you execute a query, that raw result is shown to the user ..."                           |
|   "- If a SQL query was executed successfully, append the executed SQL ..."                        |
|   "You have access to the following tools: ..."                                                     |
|   "MEMORY SYSTEM:" / "1. TOOL USAGE MEMORY..." / "2. TEXT MEMORY..."                               |
| output: base system prompt                                                                          |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 3) SchemaGovernanceManager + SchemaGovernanceEnhancer                                              |
|----------------------------------------------------------------------------------------------------|
| source: SchemaGovernanceManager.build_prompt_block() + manager.policy.system_prompt_block          |
| logic:                                                                                             |
|   - append only once                                                                                |
|   - `schema_locked: false` while discovery is open                                                  |
|   - `schema_locked: true` after lock                                                                |
| prompt excerpt:                                                                                    |
|   "## Schema Governance"                                                                           |
|   "- Treat `schema_retrieve` as discovery support, not as the final answer."                      |
|   "- Once you have enough schema context, switch to SQL draft mode..."                             |
|   "## Core Objective Reminder"                                                                      |
| example (sql_126): after the 3rd schema_retrieve, the next turn is locked                           |
| output: schema-governance block that steers discovery vs SQL draft mode                             |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 4) CompositeLlmContextEnhancer                                                                     |
|----------------------------------------------------------------------------------------------------|
| order: SchemaContextEnhancer() -> DefaultLlmContextEnhancer(agent_mem)                             |
| logic:                                                                                             |
|   - each enhancer receives previous output                                                          |
|   - one enhancer failing does not stop the chain                                                    |
|   - SchemaContextEnhancer keeps the prompt unchanged when `schema_locked` is true                  |
|   - DefaultLlmContextEnhancer searches AgentMemory from `user_message`                             |
| SchemaContextEnhancer excerpt:                                                                      |
|   "## Schema Retrieval Tool - Search Mode Selection Rules"                                         |
|   "hybrid / vector / graph / expand"                                                                |
|   "【Current Retrieved Schema Information】"                                                          |
| DefaultLlmContextEnhancer excerpt:                                                                  |
|   "## Relevant Context from Memory"                                                                 |
|   "The following domain knowledge and context from prior interactions may be relevant:"            |
| output: refined system prompt with schema rules + memory context                                   |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 5) SchemaGovernanceMiddleware + SqlGovernanceMiddleware                                             |
|----------------------------------------------------------------------------------------------------|
| order: SchemaGovernanceMiddleware -> SqlGovernanceMiddleware                                        |
| logic:                                                                                             |
|   - refresh request.metadata from runtime snapshots                                                 |
|   - infer or reuse SQL profile from request.metadata / user message                                  |
|   - append request-time governance blocks                                                            |
|   - may hide `schema_retrieve` from request.tools                                                    |
|   - may append recap blocks                                                                          |
| SQL governance excerpt:                                                                             |
|   "## SQL Governance"                                                                               |
|   "- Avoid metadata introspection queries unless they are explicitly allowed."                      |
|   "- Keep the current row grain stable and call `run_sql` once the table path is clear."            |
| SQL recap excerpt:                                                                                  |
|   "## SQL Self-Check Reminder"                                                                      |
| output: final request.system_prompt + request.tools                                                  |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 6) Final LlmRequest                                                                                |
|----------------------------------------------------------------------------------------------------|
| input: messages + tools + system_prompt + metadata                                                 |
| sql_126 path:                                                                                      |
|   - first LLM turn -> 3 `schema_retrieve` calls                                                     |
|   - later turn -> 3 `run_sql` calls                                                                 |
| output: the model sees the full prompt stack before tool selection                                  |
+====================================================================================================+
```

## sql_126 Example

The values below come from a successful query in the real evaluation log and report.

```text
user message:
"write a query in SQL to sort the BusinessEntityID in descending order for those employees
that have the SalariedFlag set to 'true' and in ascending order that have the SalariedFlag set
to 'false'. Return BusinessEntityID, and SalariedFlag."

schema_retrieve #1:
query="employees with SalariedFlag and BusinessEntityID"
search_mode="hybrid"

schema_retrieve #2:
query="employee table with SalariedFlag and BusinessEntityID"
search_mode="vector"

schema_retrieve #3:
query="HumanResources Employee"
search_mode="hybrid"

run_sql #1:
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_name LIKE '%employee%'
ORDER BY table_schema, table_name;

run_sql #2:
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'humanresources' AND table_name = 'employee'
ORDER BY ordinal_position;

run_sql #3:
SELECT BusinessEntityID, SalariedFlag
FROM humanresources.employee
ORDER BY
    CASE WHEN SalariedFlag = true THEN 0 ELSE 1 END,
    CASE WHEN SalariedFlag = true THEN BusinessEntityID END DESC,
    CASE WHEN SalariedFlag = false THEN BusinessEntityID END ASC;
```

## Scope

This page covers prompt generation, prompt enhancers, and request-time prompt middleware only.
Conversation reads / filtering / message persistence remain in [`context.md`](./context.md).

## Source Files

- [`src/my_agent.py`](../../../src/my_agent.py) - runtime enhancer / middleware wiring
- [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py) - `_prepare_turn_prompt()` / `_build_llm_request()`
- [`src/QueryMind/core/system_prompt/default.py`](../../../src/QueryMind/core/system_prompt/default.py) - `DefaultSystemPromptBuilder`
- [`src/QueryMind/core/enhancer/composite.py`](../../../src/QueryMind/core/enhancer/composite.py) - `CompositeLlmContextEnhancer`
- [`src/QueryMind/core/enhancer/default.py`](../../../src/QueryMind/core/enhancer/default.py) - `DefaultLlmContextEnhancer`
- [`src/QueryMind/core/enhancer/schema_retrieve.py`](../../../src/QueryMind/core/enhancer/schema_retrieve.py) - `SchemaContextEnhancer`
- [`src/QueryMind/core/enhancer/schema_governance.py`](../../../src/QueryMind/core/enhancer/schema_governance.py) - `SchemaGovernanceEnhancer`
- [`src/QueryMind/core/agent/governance.py`](../../../src/QueryMind/core/agent/governance.py) - `SchemaGovernanceManager`
- [`src/QueryMind/core/agent/sql_governance_prompt.py`](../../../src/QueryMind/core/agent/sql_governance_prompt.py) - SQL governance prompt text
- [`src/QueryMind/core/middleware/schema_governance.py`](../../../src/QueryMind/core/middleware/schema_governance.py) - schema-governance middleware injection path
- [`src/QueryMind/core/middleware/sql_governance.py`](../../../src/QueryMind/core/middleware/sql_governance.py) - SQL-governance middleware injection path
