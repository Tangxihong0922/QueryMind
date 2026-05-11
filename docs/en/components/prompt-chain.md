# Prompt Chain

Prompt chain covers only the prompt-facing assembly path.
Conversation reads, filtering, and `LlmRequest.messages` construction are documented in [`context.md`](./context.md).

## Actual Assembly Order

The facts here come from [`src/my_agent.py`](../../../src/my_agent.py) and [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py).
The runtime order is:

- `enhancer = CompositeLlmContextEnhancer([DefaultLlmContextEnhancer(agent_mem)])`
- `llm_middlewares = [schema_governance.middleware, sql_governance.middleware]`
- `Agent._prepare_turn_prompt()` builds a stable system prompt first, then `before_llm_request()` applies request-time message-side notices

`SchemaContextEnhancer` and `SchemaGovernanceEnhancer` still exist as reusable helpers, but they are not part of the default runtime wiring anymore.

```text
+====================================================================================================+
| 1) Agent._prepare_turn_prompt()                                                                    |
|----------------------------------------------------------------------------------------------------|
| input: user_message + tool_schemas + request_metadata                                              |
| logic:                                                                                             |
|   - merge schema-governance snapshot into metadata                                                 |
|   - hide `schema_retrieve` when governance says so                                                 |
|   - call DefaultSystemPromptBuilder                                                                 |
|   - run llm_context_enhancer.enhance_system_prompt()                                               |
|   - keep the system prompt byte-stable                                                              |
| output: visible_tool_schemas + stable system_prompt + merged_metadata                              |
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
|   - otherwise emit the stable core rules and a short stable tail                                    |
| prompt excerpt:                                                                                    |
|   "You are QueryMind, an AI data analyst assistant..."                                             |
|   "Response Guidelines:"                                                                           |
|   "- When you execute a query, that raw result is shown to the user ..."                           |
|   "- If a SQL query was executed successfully, append the executed SQL ..."                        |
|   "- Use `schema_retrieve` only for schema discovery..."                                           |
|   "Runtime context notices are authoritative..."                                                    |
| output: base system prompt                                                                          |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 3) DefaultLlmContextEnhancer                                                                      |
|----------------------------------------------------------------------------------------------------|
| source: DefaultLlmContextEnhancer(agent_memory)                                                     |
| logic:                                                                                             |
|   - search AgentMemory from `user_message`                                                         |
|   - append a user-side memory advisory message                                                      |
|   - return the original messages unchanged when degraded or failing                               |
| prompt excerpt:                                                                                    |
|   "## Memory Advisory"                                                                             |
|   "Use these snippets only if they are relevant to the current turn:"                              |
| output: message-side memory advisory, not system prompt                                             |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 4) Optional SchemaContextEnhancer                                                                  |
|----------------------------------------------------------------------------------------------------|
| order: SchemaContextEnhancer() -> DefaultLlmContextEnhancer(agent_mem)                             |
| logic:                                                                                             |
|   - each enhancer receives previous output                                                          |
|   - one enhancer failing does not stop the chain                                                    |
|   - SchemaContextEnhancer injects schema context as a user-side message                            |
|   - it does not mutate the system prompt                                                            |
| SchemaContextEnhancer excerpt:                                                                     |
|   "## Schema Context"                                                                              |
|   "Search Mode: hybrid"                                                                            |
|   "Tables: ..."                                                                                     |
| output: message-side schema context, not system prompt                                              |
+====================================================================================================+
                                              |
                                              v
+====================================================================================================+
| 5) SchemaGovernanceMiddleware + SqlGovernanceMiddleware                                             |
|----------------------------------------------------------------------------------------------------|
| order: SchemaGovernanceMiddleware -> SqlGovernanceMiddleware                                        |
| logic:                                                                                             |
|   - refresh request.metadata from runtime snapshots                                                 |
|   - infer or reuse SQL profile from request.metadata / user message                                |
|   - hide `schema_retrieve` from request.tools when needed                                           |
|   - append a single user-side runtime notice at the tail                                            |
|   - include schema lock / summary, SQL anchor preview, freeze reason, repair strategy / reason / signals, row grain, and recap          |
| SQL governance excerpt:                                                                             |
|   "## Runtime Context Notice"                                                                      |
|   "Schema governance:"                                                                             |
|   "- schema_retrieve unavailable this turn: yes/no"                                                 |
|   "SQL governance:"                                                                                |
|   "- repair strategy: local_repair / structural_rewrite"                                           |
| output: final request.system_prompt + request.tools + request.messages                              |
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
| output: the model sees a stable system prompt plus message-side runtime notices; the SQL-side notice carries repair strategy / reason / signals before tool selection|
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
