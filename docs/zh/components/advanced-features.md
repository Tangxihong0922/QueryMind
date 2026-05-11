# 高级特性

本页讲的是位于核心 prompt、工具、记忆和治理页面之外的运行时扩展点。

这里有三类内容：

- hooks：观察并调整 agent 生命周期事件；
- LLM middlewares：围绕每次 LLM 调用改写请求和响应；
- 恢复策略：决定 runtime 在失败时应该如何处理。

这些扩展点让治理、可观测性和部署级策略可以在不 fork 核心 agent loop 的情况下接入。

## Hooks

hooks 是通过 `Agent.hooks` 挂载的生命周期回调。
agent 会按列表顺序执行这些 hook。

基础接口提供四个入口：

- `before_message(user, message)`：消息进入前的预处理；
- `after_message(result)`：消息结束后的清理或记录；
- `before_tool(tool, context)`：具体 tool 执行前；
- `after_tool(result)`：tool 执行完成后。

这里最重要的运行时行为是：

- hooks 按列表顺序执行；
- `before_tool()` 主要用于观察和加 guardrail，不负责改写结果；
- `after_tool()` 可以返回一个新的 `ToolResult` 替换原结果；
- `before_message()` 可以改写进入的消息字符串。

治理相关的 hook 直接用到了这个机制：

- `SchemaGovernanceHook` 记录 `schema_retrieve` 结果，并把刷新后的
  schema snapshot 写回 `result.metadata`；
- `SqlGovernanceHook` 记录 `run_sql` 结果，并把刷新后的 SQL snapshot
  写回 `result.metadata`。

这样治理状态就跟 tool 执行保持贴近，而不是散落到 prompt 文本里。

## LLM Middlewares

LLM middlewares 通过 `Agent.llm_middlewares` 挂载。
agent 会在非流式和流式两条路径上都按列表顺序执行它们。

基础接口提供两个入口：

- `before_llm_request(request)`：请求发给模型之前；
- `after_llm_response(request, response)`：模型返回之后。

实际上，middleware 层就是请求时策略放置的位置：

- `before_llm_request()` 可以追加或改写 metadata、system prompt、message-side runtime notice 和可见工具；
- `after_llm_response()` 可以归一化或补充模型响应；
- 同一条 middleware 链会被普通请求和流式请求共用。

治理相关的 middleware 直接用到了这个路径：

- `SchemaGovernanceMiddleware` 会合并治理 metadata，在需要时把 schema recap 作为
  message-side runtime notice 注入，并在会话锁定后隐藏 `schema_retrieve`；
- `SqlGovernanceMiddleware` 会注册或推断 SQL profile，把 anchor preview、
  freeze reason、repair strategy / reason / signals、row grain、recap 等
  runtime notice 注入消息侧，并把当前 snapshot 保存在 request metadata 里。

所以 hooks 负责 tool-result 一侧的治理，middlewares 负责 request-shaping
以及 message-side runtime notice 的治理。

## 恢复策略

恢复策略描述的是 runtime 遇到失败时应该怎么处理。
共享接口是 `ErrorRecoveryStrategy`。

它定义了两个处理入口：

- `handle_tool_error(error, context, attempt)`：处理 tool 执行失败；
- `handle_llm_error(error, request, attempt)`：处理 LLM 通信失败。

恢复动作模型支持四种结果：

- `RETRY`
- `FAIL`
- `FALLBACK`
- `SKIP`

内置的 `ExponentialBackoffStrategy` 提供了带可选 jitter 的重试式恢复。

当前已经接入这个接口的 LLM 集成包括：

- `integrations/llmservice/openai/llm.py`：通过 `handle_llm_error(...)` 重试
  短暂的模型错误；
- `integrations/llmservice/anthropic/llm.py`：同样通过 `handle_llm_error(...)`
  做重试。

tool error 这一半接口是给自定义 tool runner 或其他执行循环准备的对称契约；
即使某个部署还没有把统一的 tool retry 路径接起来，这个接口也已经存在。

## 它们如何协同

这些扩展点分布在不同边界上：

- hooks 观察或调整 message/tool 周围的生命周期事件；
- middlewares 改写 LLM request 和 response 路径；
- 恢复策略决定失败应该重试、失败、fallback 还是跳过。

这种分层就是为什么治理页可以保持短而精确：

- schema governance 用 hooks 和 middlewares 管理 schema_retrieve 循环；
- SQL governance 用 hooks 和 middlewares 管理 SQL profile 推断、runtime notice、
  recap 插入和 freeze 行为；
- 恢复层负责处理短暂故障，不把故障逻辑混进 prompt 文本。

## 源码映射

- [文档重构目录大纲](../restructure-outline.md)
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
