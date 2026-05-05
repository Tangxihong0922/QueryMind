# QueryMind 手册

QueryMind 是一个面向自然语言转 SQL 的 LLM Agent 框架。
本页是文档入口索引：只负责说明系统的整体结构，并指向组件页、治理页、用例页和支持材料。

## QueryMind 是什么

QueryMind 主要由五层组成：

- 请求边界：解析用户并加载会话。
- 提示链：构建基础 system prompt，并叠加治理规则。
- 工具层：对工具调用进行校验、治理和执行。
- 记忆层：把 Agent Memory 和 Schema Memory 分开保存。
- 治理层：用显式状态机控制 schema 探索和 SQL 起草。

下面列出的页面是具体实现说明的来源。

## 文档地图

### 入口页

| 页面 | 状态 | 职责 |
|---|---|---|
| [querymind.md](./querymind.md) | 当前 | 入口页和文档索引 |

### 组件页

| 页面 | 状态 | 职责 |
|---|---|---|
| [components/context.md](./components/context.md) | 当前 | 请求组装边界、增强器和工具上下文注入 |
| [components/request-assembly.md](./components/request-assembly.md) | 当前 | 一次从 `ToolContext` 到最终 `LlmRequest` 的完整 turn 组装 |
| [components/prompt-chain.md](./components/prompt-chain.md) | 当前 | 基础 prompt builder、治理 prompt block 和增强顺序 |
| [components/tools.md](./components/tools.md) | 当前 | 工具注册表、参数校验、执行流程和内置工具 |
| [components/memory.md](./components/memory.md) | 当前 | Agent Memory 和 Schema Memory 两种长期存储 |
| [components/conversation.md](./components/conversation.md) | 当前 | 会话持久化与“历史即状态总线”的行为 |
| [components/workflow.md](./components/workflow.md) | 当前 | 确定性命令、管理工作流和 starter UI 路由 |
| [components/security.md](./components/security.md) | 当前 | 认证、授权、UI gating、审计和 RLS |
| [components/advanced-features.md](./components/advanced-features.md) | 当前 | hooks、LLM middleware 和恢复策略 |
| [components/agent-loop.md](./components/agent-loop.md) | 当前 | 一次真实 query 的 Agent Loop 闭环与评测样本 |
| [components/schema-governance.md](./components/schema-governance.md) | 当前 | schema 探索预算、锁定状态，以及 enhancer/hook/middleware 三件套 |
| [components/sql-governance.md](./components/sql-governance.md) | 当前 | SQL 画像分析、冻结、recap 和修补闭环 |

### 用例页

| 页面 | 状态 | 职责 |
|---|---|---|
| [use-cases/schema-governance.md](./use-cases/schema-governance.md) | 当前 | 多轮 schema 发现和 expand 模式行为 |
| [use-cases/sql-governance.md](./use-cases/sql-governance.md) | 当前 | SQL 起草、漂移检测和局部修补 |
| [use-cases/workflow-shortcut.md](./use-cases/workflow-shortcut.md) | 当前 | 确定性路由、starter UI 和 LLM 短路 |
| [use-cases/evaluation-run.md](./use-cases/evaluation-run.md) | 当前 | 一条真实评测运行从 dataset 到 trace、judge、report 的完整闭环 |

### 支持页

| 页面 | 状态 | 职责 |
|---|---|---|
| [support/installation.md](./support/installation.md) | 当前 | 环境配置和基础设施初始化 |
| [support/prerequisite.md](./support/prerequisite.md) | 当前 | 完整的前置条件与部署指南 |
| [support/debugging.md](./support/debugging.md) | 当前 | 排障、运行时检查和故障路径 |
| [support/evaluation.md](./support/evaluation.md) | 当前 | 评测框架、数据集、指标和报告 |
| [support/querymind-eval-retro.md](./support/querymind-eval-retro.md) | 当前 | governance 迭代和评测经验复盘 |

## 推荐阅读顺序

1. 先读 [components/context.md](./components/context.md)，理解请求组装边界。
2. 再读 [components/request-assembly.md](./components/request-assembly.md)，看一次 `ToolContext` 到 `LlmRequest` 的完整 turn。
3. 再读 [components/prompt-chain.md](./components/prompt-chain.md)，理解基础 prompt builder 和增强顺序。
4. 再读 [components/tools.md](./components/tools.md)，理解执行和策略边界。
5. 再读 [components/memory.md](./components/memory.md) 和 [components/conversation.md](./components/conversation.md)，理解状态与持久化。
6. 再读 [components/workflow.md](./components/workflow.md) 和 [components/security.md](./components/security.md)，理解确定性路由和访问控制。
7. 先读 [use-cases/workflow-shortcut.md](./use-cases/workflow-shortcut.md)，看 starter UI 和 slash command 是怎么在 LLM 前短路的。
8. 再读 [components/advanced-features.md](./components/advanced-features.md) 和 [components/agent-loop.md](./components/agent-loop.md)，把前面的边界串成一次真实 query 的闭环。
9. 然后读治理页：
   - [components/schema-governance.md](./components/schema-governance.md)
   - [components/sql-governance.md](./components/sql-governance.md)
10. 最后读用例页，查看端到端示例：
   - [use-cases/schema-governance.md](./use-cases/schema-governance.md)
   - [use-cases/sql-governance.md](./use-cases/sql-governance.md)
   - [use-cases/workflow-shortcut.md](./use-cases/workflow-shortcut.md)
   - [use-cases/evaluation-run.md](./use-cases/evaluation-run.md)

## 入口页的使用方式

- 入口页保持短小，只负责导航。
- 具体实现细节放到对应组件页。
- 端到端示例放到 use case 页面。
- 环境配置、排障和复盘材料放到 support 页面。

## 说明

- 中英文目录需要保持结构镜像。
- 图表和插图可以放在相关章节附近，但源文件建议统一管理。
- 旧入口页里那些长篇实现说明，后续应迁移到新的组件页，不要继续堆在这里。
