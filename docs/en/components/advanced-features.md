# Advanced Features

This page covers runtime extension points that sit beside the core prompt,
tool, memory, and governance pages.

The three pieces here are:

- hooks, which observe and adjust agent lifecycle events;
- LLM middlewares, which reshape requests and responses around each LLM call;
- recovery strategies, which decide how the runtime should respond to failures.

These are the extension points that make governance, observability, and
deployment-specific policy possible without forking the core agent loop.

## Hooks

Hooks are lifecycle callbacks attached through `Agent.hooks`.
The agent walks the hook list in order.

The base interface exposes four entry points:

- `before_message(user, message)` for message pre-processing;
- `after_message(result)` for post-message cleanup or logging;
- `before_tool(tool, context)` before a concrete tool executes;
- `after_tool(result)` after a tool finishes.

The important runtime behavior is:

- hooks run in list order;
- `before_tool()` is for observation and guardrails, not result rewriting;
- `after_tool()` can return a replacement `ToolResult`;
- `before_message()` can rewrite the inbound message string.

The governance hooks use this mechanism directly:

- `SchemaGovernanceHook` records `schema_retrieve` results and writes the
  refreshed schema snapshot back into `result.metadata`;
- `SqlGovernanceHook` records `run_sql` results and writes the refreshed SQL
  snapshot back into `result.metadata`.

That keeps governance state updates close to tool execution instead of pushing
them into prompt text.

## LLM Middlewares

LLM middlewares are attached through `Agent.llm_middlewares`.
The agent applies them in list order on both the streaming and non-streaming
paths.

The base interface exposes two entry points:

- `before_llm_request(request)` before the request is sent to the model;
- `after_llm_response(request, response)` after the model returns.

In practice, the middleware layer is where request-time policy lives:

- `before_llm_request()` can add or rewrite metadata, system prompt blocks, and
  visible tools;
- `after_llm_response()` can normalize or annotate the model response;
- the same middleware chain is reused for standard and streaming requests.

The governance middlewares use this path directly:

- `SchemaGovernanceMiddleware` injects schema-governance prompt blocks, adds
  recap text when the schema loop should be restated, and can hide
  `schema_retrieve` once the conversation is locked;
- `SqlGovernanceMiddleware` registers or infers the SQL profile, appends SQL
  governance text, injects recap text when the SQL loop drifts, and preserves
  the current snapshot in request metadata.

So hooks are the tool-result side of governance, while middlewares are the
request-shaping side.

## Recovery Strategies

Recovery strategies describe how the runtime should respond to failures.
The shared interface is `ErrorRecoveryStrategy`.

It defines two handlers:

- `handle_tool_error(error, context, attempt)` for tool execution failures;
- `handle_llm_error(error, request, attempt)` for LLM communication failures.

The recovery action model supports four outcomes:

- `RETRY`
- `FAIL`
- `FALLBACK`
- `SKIP`

The built-in `ExponentialBackoffStrategy` implements retry-oriented recovery
with optional jitter.

The current shipping LLM integrations already consume this interface:

- `integrations/llmservice/openai/llm.py` retries transient model errors by
  calling `handle_llm_error(...)`;
- `integrations/llmservice/anthropic/llm.py` does the same.

The tool-error half of the interface is the symmetric contract for custom tool
runners or alternative execution loops, even when a deployment does not wire a
shared tool retry path yet.

## How They Fit Together

The runtime uses these extension points at different boundaries:

- hooks observe or adjust lifecycle events around messages and tools;
- middlewares reshape the LLM request and response path;
- recovery strategies decide whether a failure should retry, fail, fall back,
  or be skipped.

That separation is what lets the governance pages stay small and precise:

- schema governance uses hooks and middlewares to manage the schema-retrieve
  loop;
- SQL governance uses hooks and middlewares to manage SQL profile inference,
  recap injection, and freeze behavior;
- the recovery layer handles transient failures without mixing them into
  prompt text.

## Source Map

- [Docs Restructure Outline](../restructure-outline.md)
- [`src/QueryMind/core/hook/base.py`](../../../src/QueryMind/core/hook/base.py)
- [`src/QueryMind/core/middleware/base.py`](../../../src/QueryMind/core/middleware/base.py)
- [`src/QueryMind/core/recovery/base.py`](../../../src/QueryMind/core/recovery/base.py)
- [`src/QueryMind/core/recovery/default.py`](../../../src/QueryMind/core/recovery/default.py)
- [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py)
- [`src/QueryMind/core/middleware/schema_governance.py`](../../../src/QueryMind/core/middleware/schema_governance.py)
- [`src/QueryMind/core/middleware/sql_governance.py`](../../../src/QueryMind/core/middleware/sql_governance.py)
- [`src/QueryMind/core/hook/schema_governance.py`](../../../src/QueryMind/core/hook/schema_governance.py)
- [`src/QueryMind/core/hook/sql_governance.py`](../../../src/QueryMind/core/hook/sql_governance.py)
- [`src/QueryMind/integrations/llmservice/openai/llm.py`](../../../src/QueryMind/integrations/llmservice/openai/llm.py)
- [`src/QueryMind/integrations/llmservice/anthropic/llm.py`](../../../src/QueryMind/integrations/llmservice/anthropic/llm.py)
