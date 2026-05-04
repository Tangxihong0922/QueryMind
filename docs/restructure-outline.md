# Docs Restructure Outline / 文档重构目录大纲

This document defines the target documentation map for QueryMind.
The goal is to separate entry docs, component references, governance pages,
use cases, and support material into a mirrored English/Chinese structure.

本文档定义 QueryMind 的目标文档结构。
目标是把入口页、组件参考页、治理页、用例页和支持材料拆成镜像的中英文结构。

## Goals / 目标

- Keep the top-level entry page short and navigational.
- Give each runtime boundary its own page when the implementation is materially different.
- Mirror every user-facing page in `docs/en` and `docs/zh`.
- Separate shared assets from language-specific content.
- Treat schema governance and SQL governance as first-class docs, not embedded subsections.
- Keep support, troubleshooting, and retrospective material out of the core component pages.

- 保持顶部入口页简短，并以导航为主。
- 当运行边界明显不同的时候，为每个边界单独建页。
- 所有面向用户的页面都在 `docs/en` 和 `docs/zh` 中镜像。
- 将共享资源与语言内容分离。
- 将 schema governance 和 SQL governance 作为独立一等文档，而不是嵌在子章节里。
- 将支持、排障和复盘材料移出核心组件页。

## Target Tree / 目标目录树

```text
docs/
  shared/
    figures/
    diagrams/
  en/
    querymind.md
    components/
      context.md
      request-assembly.md
      prompt-chain.md
      tools.md
      memory.md
      conversation.md
      workflow.md
      security.md
      advanced-features.md
      agent-loop.md
      schema-governance.md
      sql-governance.md
    use-cases/
      schema-governance.md
      sql-governance.md
      workflow-shortcut.md
    support/
      installation.md
      debugging.md
      evaluation.md
      querymind-eval-retro.md
  zh/
    querymind.md
    components/
      context.md
      request-assembly.md
      prompt-chain.md
      tools.md
      memory.md
      conversation.md
      workflow.md
      security.md
      advanced-features.md
      agent-loop.md
      schema-governance.md
      sql-governance.md
    use-cases/
      schema-governance.md
      sql-governance.md
      workflow-shortcut.md
    support/
      installation.md
      debugging.md
      evaluation.md
      querymind-eval-retro.md
```

## Page Map / 页面映射

| Logical page | English path | 中文 path | Action | English role | 中文职责 |
|---|---|---|---|---|---|
| QueryMind entry | `docs/en/querymind.md` | `docs/zh/querymind.md` | rewrite | Landing page, architecture overview, and documentation index | 入口页、架构总览、文档索引 |
| Context assembly | `docs/en/components/context.md` | `docs/zh/components/context.md` | rewrite | Request assembly boundaries and execution-time context | 请求组装边界和执行态上下文 |
| Request assembly | `docs/en/components/request-assembly.md` | `docs/zh/components/request-assembly.md` | add | One turn from `ToolContext` to the final `LlmRequest` | 一次从 `ToolContext` 到最终 `LlmRequest` 的完整 turn 组装 |
| Prompt chain | `docs/en/components/prompt-chain.md` | `docs/zh/components/prompt-chain.md` | rewrite | System prompt builder, governance prompt blocks, and enhancer ordering | system prompt builder、治理块和增强顺序 |
| Tool system | `docs/en/components/tools.md` | `docs/zh/components/tools.md` | rewrite | Tool registry, validation, execution, and built-in tools | 工具注册表、校验、执行和内置工具 |
| Memory system | `docs/en/components/memory.md` | `docs/zh/components/memory.md` | rewrite | Agent Memory and Schema Memory as separate long-term stores | Agent Memory 和 Schema Memory 的长期分层 |
| Conversation store | `docs/en/components/conversation.md` | `docs/zh/components/conversation.md` | rewrite | Conversation persistence, recent history, and history-as-state-bus behavior | 会话持久化、最近历史和历史状态总线 |
| Workflow handler | `docs/en/components/workflow.md` | `docs/zh/components/workflow.md` | rewrite | Deterministic commands, admin workflows, and starter UI routing | 确定性命令、管理工作流和 starter UI 路由 |
| Security | `docs/en/components/security.md` | `docs/zh/components/security.md` | rewrite | Authentication, authorization, UI gating, auditing, and RLS policy | 认证、授权、UI gating、审计和 RLS 策略 |
| Advanced features | `docs/en/components/advanced-features.md` | `docs/zh/components/advanced-features.md` | rewrite | Hooks, LLM middlewares, and recovery strategies | hooks、LLM middlewares 和恢复策略 |
| Agent loop | `docs/en/components/agent-loop.md` | `docs/zh/components/agent-loop.md` | add | End-to-end query loop with a real evaluation trace | 一次真实 query 的 Agent Loop 闭环与评测样本 |
| Schema governance | `docs/en/components/schema-governance.md` | `docs/zh/components/schema-governance.md` | add | Schema exploration budget, lock state, and middleware/hook/enhancer trio | schema 探索预算、锁定状态、middleware/hook/enhancer 三件套 |
| SQL governance | `docs/en/components/sql-governance.md` | `docs/zh/components/sql-governance.md` | add | SQL shape/profile analysis, freeze, recap, and repair loop | SQL 形状/画像分析、冻结、recap 和修补闭环 |
| Schema governance use case | `docs/en/use-cases/schema-governance.md` | `docs/zh/use-cases/schema-governance.md` | add | Multi-turn schema discovery, expand mode, and lock behavior | 多轮 schema 发现、expand 模式和锁定行为 |
| SQL governance use case | `docs/en/use-cases/sql-governance.md` | `docs/zh/use-cases/sql-governance.md` | add | Example-driven SQL drafting, drift detection, and local repair | 示例驱动的 SQL 起草、漂移检测和局部修补 |
| Workflow shortcut use case | `docs/en/use-cases/workflow-shortcut.md` | `docs/zh/use-cases/workflow-shortcut.md` | add | Deterministic routing, starter UI, and LLM short-circuit | 确定性路由、starter UI 和 LLM 短路 |
| Evaluation run use case | `docs/en/use-cases/evaluation-run.md` | `docs/zh/use-cases/evaluation-run.md` | add | One real evaluation sample from dataset to trace, judge, report, and resume | 一条真实评测样本从 dataset 到 trace、judge、report、resume |
| Installation | `docs/en/support/installation.md` | `docs/zh/support/installation.md` | add | Environment setup and infrastructure bootstrap | 环境配置和基础设施初始化 |
| Debugging | `docs/en/support/debugging.md` | `docs/zh/support/debugging.md` | add | Troubleshooting, runtime checks, and common failure paths | 排障、运行时检查和常见故障路径 |
| Evaluation | `docs/en/support/evaluation.md` | `docs/zh/support/evaluation.md` | add | Evaluation harness, datasets, metrics, and reporting | 评测框架、数据集、指标和报告 |
| Eval retrospective | `docs/en/support/querymind-eval-retro.md` | `docs/zh/support/querymind-eval-retro.md` | add | Retrospective on governance iteration and evaluation learnings | governance 迭代和评测经验复盘 |

## Component Responsibilities / 组件职责

### Entry Page / 入口页
- English: Keep the page concise, explain the system in one screen, and point readers to component pages.
- 中文：保持页面简洁，用一屏说明系统，并引导读者进入组件页。

### Context and Prompt Chain / 上下文与提示链
- English: `context.md` should cover request assembly boundaries and execution-time context.
- English: `request-assembly.md` should show the concrete turn-level assembly flow from `ToolContext` to `LlmRequest`.
- English: `prompt-chain.md` should cover the base prompt builder, governance prompt blocks, and enhancer ordering.
- 中文：`context.md` 负责请求组装边界和执行态上下文。
- 中文：`request-assembly.md` 负责展示从 `ToolContext` 到 `LlmRequest` 的完整单轮装配流程。
- 中文：`prompt-chain.md` 负责基础 prompt builder、治理 prompt block 和增强器顺序。

### Tools and Security / 工具与安全
- English: `tools.md` should describe the registry, argument validation, execution, and the built-in tool matrix.
- English: `security.md` should focus on identity, authorization, UI feature gating, auditing, and RLS.
- 中文：`tools.md` 说明注册表、参数校验、执行链和内置工具矩阵。
- 中文：`security.md` 聚焦身份、授权、UI 特性 gating、审计和 RLS。

### Memory and Conversation / 记忆与会话
- English: `memory.md` should keep Agent Memory and Schema Memory separate.
- English: `conversation.md` should explain how stored history powers replay, UI history, and follow-up state extraction.
- 中文：`memory.md` 要清楚区分 Agent Memory 和 Schema Memory。
- 中文：`conversation.md` 解释存储历史如何支撑回放、会话 UI 和后续状态提取。

### Governance Pages / 治理页
- English: `schema-governance.md` should describe the schema exploration state machine and its prompt/hook/middleware integration.
- English: `sql-governance.md` should describe SQL shape analysis, profile inference, freeze, recap, and repair.
- 中文：`schema-governance.md` 讲清 schema 探索状态机及其 prompt/hook/middleware 集成。
- 中文：`sql-governance.md` 讲清 SQL 形状分析、画像推断、冻结、recap 和修补。

### Agent Loop / Agent Loop
- English: `agent-loop.md` should show one real query end-to-end, tying request assembly, governance, tool execution, and finalization together.
- 中文：`agent-loop.md` 应该用一次真实 query 贯通请求组装、治理、工具执行和收尾。

### Use Cases / 场景页
- English: Each governance page gets a matching use-case page with one end-to-end example; `workflow-shortcut.md` shows deterministic routing and starter UI short-circuit, and `evaluation-run.md` shows one concrete benchmark execution from dataset to report.
- 中文：每个 governance 页都配一个用例页，用一个端到端例子讲完整闭环；`workflow-shortcut.md` 展示确定性路由和 starter UI 短路，`evaluation-run.md` 额外展示一条具体评测从 dataset 到 report 的完整执行。

## Transitional Root Files / 过渡期仓库根文件

These files exist today and should either be kept as repository landing pages or become thin redirects to the new docs tree.

这些文件目前存在，后续要么保留为仓库入口，要么变成指向新 docs 目录的薄跳转页。

- `README.md`
- `README_zh.md`
- `INSTALL_INFRASTRUCTURE.md`
- `DEBUG_GUIDE.md`

## Migration Order / 迁移顺序

1. Rewrite `querymind.md` first so the entry page becomes a true index.
2. Split the turn-level docs into `context.md`, `request-assembly.md`, and `prompt-chain.md`.
3. Add `schema-governance.md` and `sql-governance.md` under `components/`.
4. Add the workflow-shortcut use case, matching use-case pages for both governance tracks, plus one evaluation-run page for the benchmark harness.
5. Tighten `tools.md`, `security.md`, `memory.md`, `conversation.md`, and `workflow.md` so each page has a single responsibility.
6. Mirror or redirect the support docs into `docs/en/support/` and `docs/zh/support/`.
7. Rebase image and diagram links onto `docs/shared/figures/` and `docs/shared/diagrams/`.

1. 先重写 `querymind.md`，让入口页变成真正的索引。
2. 把 `context.md` 拆成 `context.md` 和 `prompt-chain.md`。
3. 在 `components/` 下新增 `schema-governance.md` 和 `sql-governance.md`。
4. 先补 workflow-shortcut 用例，再为两条治理线各补一个 use case 页面，并额外补一个评测运行页。
5. 收紧 `tools.md`、`security.md`、`memory.md`、`conversation.md` 和 `workflow.md`，让每页只负责一件事。
6. 将支持文档镜像或重定向到 `docs/en/support/` 和 `docs/zh/support/`。
7. 将图片和图表链接统一改到 `docs/shared/figures/` 和 `docs/shared/diagrams/`。

## Notes / 说明

- English and Chinese should stay structurally mirrored even if some examples differ.
- Keep diagrams close to the sections they explain, but store the source assets in the shared asset folders.
- The evaluation retrospective should not be the main entry point; it is supporting analysis.
- The governance pages should be more precise than the current `Advanced Features` section.

- 中英文结构要保持镜像，即使示例内容略有差异。
- 图表应尽量贴近解释它们的章节，但源文件要放在共享资源目录里。
- evaluation 复盘页不应成为主入口，它属于支持性分析。
- governance 页要比当前 `Advanced Features` 部分更精确。
