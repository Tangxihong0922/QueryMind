# QueryMind Enterprise：项目归属与证据说明

## 项目定位

这是由 luyan9513 持续维护的企业经营数据问答项目，面向 AI 应用开发与 AI 产品方向。项目以开源 QueryMind 为技术基线，个人负责完整落地、国内模型链路、Schema 图修复、会话产品化、测试验收和后续版本路线。

上游仓库：<https://github.com/Tangxihong0922/QueryMind>

个人仓库：<https://github.com/luyan9513/QueryMind-Enterprise>

## 能力边界

### 上游已有能力

- Agent loop、工具注册与 Workflow。
- Schema Memory、SQL Governance 与 RLS 基础架构。
- FastAPI、Web Component、会话存储和评测框架。

### 个人完成的改造

| 改造 | 关键内容 | 提交 |
| --- | --- | --- |
| 多模型适配 | DeepSeek 主 Agent；硅基流动 Mem0 LLM/Embedding；Mem0 1.0.11 Base URL 和固定维度兼容 | `bb18ffc` |
| Schema 外键图 | 只读账号 `pg_catalog` 抽取；复合与跨 Schema 外键；Neo4j 表级和字段级关系 | `5bf0d93` |
| 会话产品化 | SSE 完成后刷新；一次性 LLM 标题；metadata 持久化；Workflow 消息；失败回退 | `a7c34eb` |
| 浏览器验证 | Playwright 开发依赖与桌面、移动端真实交互验证 | `0ad9f54` |

## 已验证结果

- AdventureWorks：68 张表、456 个字段。
- 关键数据量：`person.person=19,972`、`production.product=504`、`sales.salesorderheader=31,465`、`sales.salesorderdetail=121,317`。
- Schema Memory：68 条 1024 维向量；91 条 `FK_TO`；91 条字段级 `REFERENCES`。
- 业务链路：完成 Schema hybrid retrieval、跨表 SQL、DataFrame、CSV、柱状图和中文总结。
- 质量验证：Python 全量测试 `117 passed`；浏览器无 page error；390px 移动端无横向溢出。

## 表达边界

- 可以写“个人主导项目，基于 QueryMind 开源基线持续开发”。
- 上游基础架构使用“打通并验证”，个人代码使用“设计、实现、修复”。
- 尚未完成生产部署、高并发压测、Text2SQL 准确率评测和云模型自动故障恢复。
- 当前数字是本地运行与测试结果，不代表真实企业生产收益。

## 路线图

1. 建立 20-30 条 AdventureWorks Text2SQL 评测集。
2. 量化 Schema Recall、SQL 可执行率、结果正确率、首次成功率、延迟和模型成本。
3. 增加云模型超时、重试、熔断和可观测指标。
4. 完成多用户 RLS 安全回归与敏感工具权限收敛。
5. 增加 SQL Governance 和 Schema Memory 可观测页面。

