# 安全与访问控制

QueryMind 的安全体系不是单点开关，而是分层防护。身份在请求边界被解析，授权在工具和 UI 特性层面被统一执行，而 SQL 安全则被前移到注册表级策略，在数据库真正执行前完成拦截或改写。这样做的好处是：同一套工具代码可以在不同部署里复用，而且更容易向面试官解释清楚。

本页是 [工具系统](./tools.md) 里注册表级 SQL 安全和访问控制行为的策略参考页。

## 用户解析与认证^

```text
┌──────────────────────────────┐
│          HTTP Request        │
│ cookies / headers / IP /     │
│ query params / metadata      │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│       RequestContext         │
│  结构化请求上下文            │
│  - cookies                   │
│  - headers                   │
│  - remote_addr               │
│  - query_params              │
│  - metadata                  │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│       UserResolver           │
│  可插拔认证适配器            │
│  cookies / JWT / SSO / ...   │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│            User              │
│ id, username, email,         │
│ metadata, group_memberships   │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ 授权作用域                    │
│ tools / UI features / RLS    │
└──────────────────────────────┘
```

`RequestContext` 是 Web 层和认证逻辑之间的交接对象。它封装了 cookies、headers、remote address、query params，以及框架自定义的 metadata；同时它的 header 查询是大小写不敏感的，方便不同 Web 框架接入时保持统一。

`UserResolver` 只定义“如何把请求解析成用户”，并不绑定某一种登录方式。QueryMind 不会在核心层里写死 cookie 登录、JWT、SSO 或本地调试用户，而是把这些差异留给具体实现。这让认证逻辑可以按部署灵活替换。

授权则从 `User.group_memberships` 开始，而不是在各处散落判断。`User` 还保留了自由形式的 `metadata`，因此身份提供方的额外 claims 可以直接带进来，而不需要修改核心模型。

这个拆分很关键：
- 认证回答“这是谁”
- 授权回答“这个身份能做什么”
- QueryMind 的其余组件统一消费 `group_memberships` 作为共享权限原语

## 工具访问控制^

```text
┌──────────────────────────────┐      ┌──────────────────────────────┐
│     user.group_memberships   │      │     tool.access_groups       │
│   ["user", "admin", ...]     │      │   [] or ["admin", ...]      │
└──────────────┬───────────────┘      └──────────────┬───────────────┘
               │                                     │
               └──────────────┬──────────────────────┘
                              ▼
                    ┌──────────────────────────┐
                    │ access_groups 为空        │
                    │ => 公开工具              │
                    │ 否则检查交集            │
                    └──────────────┬───────────┘
                                   ▼
                        有共享组 -> 允许
                        无共享组 -> 拒绝
```

`ToolRegistry` 的职责是把策略从工具实现里剥离出来。注册工具时可以通过 `access_groups` 给同一个工具类套上不同权限，这样 demo、评测、生产环境都能复用同一个实现，但权限配置可以不同。

注册表会在两个地方使用同一套组交集规则：
- `get_schemas(user)` 隐藏用户看不到的工具 schema
- `execute()` 在运行时阻止无权限调用

这层双重检查很重要。LLM 只能看到它被允许使用的工具；即使模型误生成了不该出现的调用，注册表也会在执行前把它拦住。

QueryMind 还把同样的权限模型复用到 UI 特性上。`AgentConfig` 里的 `UiFeatures` 也使用 group membership 交集判断，schema management 相关的 UI 特性默认都是 `["admin"]`。Agent 在每次请求时会先计算 `ui_features_available`，再写入 `ToolContext.metadata`，因此工具和审计都能读取同一份 allowlist。

这一点在 schema management 上尤其明显：
- `/schema_*` workflow 命令需要 admin
- `/api/querymind/v1/schema/*` 路由会再次检查 admin
- schema management UI 默认也是 admin only

所以同一套策略同时覆盖了聊天命令、API 路由和前端 UI。

### 审计追踪

访问控制不是黑盒。`AuditLogger` 可以记录工具访问检查、工具调用、工具结果、UI 特性检查以及 AI 响应。`AuditConfig` 默认开启高价值审计项，而 `log_ui_feature_checks` 默认关闭，因为这类日志可能比较吵。

敏感参数会在写日志前进行字段级脱敏。像 `password`、`token`、`api_key`、`credential`、`private_key`、`access_key` 这类常见敏感字段都会先被替换掉。

<a id="rls-protection-module"></a>
## RLS 防护模块^*

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1) ToolRegistry.execute()                                                                                │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 输入: ToolCall(name="run_sql", arguments={sql: ...}) + ToolContext(user, metadata, request_id, ...)    │
│ 逻辑: 查找工具 -> 校验 access groups -> model_validate(args) -> 记录基础 metadata                        │
│ 输出: 已验证的 tool + RunSqlToolArgs，或 ToolResult(success=False, error=...)                           │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                │
                                                v
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 2) RLSToolRegistry.transform_args()                                                                      │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 输入: 已验证的 RunSqlToolArgs + user.group_memberships + context.raw_user_message + context.metadata    │
│ 逻辑: 只处理 run_sql / RunSqlToolArgs；然后按顺序执行策略门禁：                                          │
│   - _detect_sql_injection(sql) -> sql_injection.allowed_metadata_patterns / forbidden_patterns          │
│   - _validate_query_complexity(sql) -> 长度、子查询、CTE、JOIN                                           │
│   - sql_semantics_rejection_reason(...) -> 窗口、聚合、ROLLUP、导航函数、行粒度                         │
│   - _apply_territory_rls(sql, user) -> 将 group 映射成 territory ids 并改写受保护表                     │
│   - sql_governance_rejection_reason(...) -> context.metadata 里的 snapshot + SqlGovernancePolicy       │
│   - sql_skeleton_freeze_rejection_reason(...) -> 保持已验证 skeleton 不被破坏                           │
│ 输出: 改写后的 RunSqlToolArgs，或 ToolRejection(reason=...)                                             │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                │
                                                v
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 3) RunSqlTool.execute()                                                                                  │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 输入: 通过策略门禁的 RunSqlToolArgs + ToolContext                                                        │
│ 逻辑: self.sql_runner.run_sql(args, context)                                                             │
│   - query 分支: 写 CSV，构建 DataFrameComponent + SimpleTextComponent                                    │
│   - rows_affected 分支: 构建 NotificationComponent                                                       │
│ sql_126 真实快照: row_count=290，columns=["businessentityid", "salariedflag"]，                          │
│                 output_file=query_results_<id>.csv                                                       │
│ 输出: ToolResult(success=True, result_for_llm=CSV 预览 + 文件指针, metadata=...)                          │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

`RLSToolRegistry` 是 QueryMind 为什么要把策略放在注册表层的最好例子。它不只是做 territory 改写，而是把 `run_sql` 的执行前安全门统一收拢到一起：先过滤工具名，再校验 typed args，随后按顺序执行 injection、复杂度、SQL 语义、territory RLS、SQL governance 和 skeleton freeze。

这个 YAML 配置分成这些策略块：
- `territory_rls`：group 到 territory 的映射，以及受保护的表
- `sql_injection`：拒绝模式和 metadata allowlist
- `sql_semantics`：窗口、聚合、ROLLUP、导航函数等语义约束
- `query_limits`：查询长度和结构复杂度限制
- `audit`：SQL 改写与拒绝查询的日志开关

其中 `sql_governance` 和 `sql_skeleton_freeze` 不在 `rls_config.yaml` 里，它们读取的是 `context.metadata` 里的治理 snapshot 和 `SqlGovernancePolicy`。也就是说，这条链不只是改写 SQL，还会把安全、治理和冻结串成一个前置门禁。

当前只会改写 `run_sql`。注册表先检查工具名，再校验类型化后的 `RunSqlToolArgs`，然后在执行前套上策略。因为这一步发生在 Pydantic 校验之后、数据库调用之前，所以策略层看到的是结构化参数，而不是原始字符串。

这也是这个模块的创新点：它把 SQL 安全变成了一种可组合的部署策略。工具负责执行，注册表负责守门，职责边界非常清晰。

### SQL 注入防护^

```text
┌────────────────────────────────────────────────────────────────────┐
│ 原始 SQL                                                           │
└──────────────┬─────────────────────────────────────────────────────┘
               ▼
┌────────────────────────────────────────────────────────────────────┐
│ metadata allowlist 命中？                                          │
│ - information_schema                                               │
│ - pg_catalog                                                       │
│ - 其他只读 catalog 视图                                            │
└──────────────┬─────────────────────────────────────────────────────┘
        是     │     否
               ▼
     允许 catalog introspection                     继续检查 forbidden patterns
                                                              │
                                                              ▼
                                                 命中任意模式 => 拒绝
                                                              │
                                                              ▼
                                                复杂度校验 + RLS 检查
```

QueryMind 会在 SQL 进入 runner 之前先拦截明显的注入模式。拒绝列表覆盖了注释注入、堆叠语句、DDL/DML 串联、`UNION SELECT` 滥用、执行类函数、文件访问、shell 式提权、时间盲注以及常见绕过形式。

allowlist 同样重要。schema 检索依赖只读 metadata，所以当查询明确是在做 introspection 时，`information_schema` 和 `pg_catalog` 会被允许。这样不会因为安全策略而破坏核心功能。

结果就是一个比较务实的平衡：
- 默认安全
- 对只读 metadata 提供显式例外
- 其它情况都 fail closed

### 基于 Territory 的行级安全（RLS）^

```text
┌──────────────────────────────┐
│ user.group_memberships       │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ rls_config.yaml              │
│ group_territory_mapping      │
│ protected_tables             │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ 可访问 territory ids         │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ 没有 territory 吗？          │
│  ├─ 是 -> 返回空结果         │
│  └─ 否 -> 检查 SELECT SQL    │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ 命中受保护表吗？             │
│  ├─ 是 -> 改写 WHERE        │
│  └─ 否 -> 原样返回 SQL      │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ RunSqlTool 执行改写后的 SQL  │
└──────────────────────────────┘
```

territory 策略是配置驱动的。group 会映射到允许访问的 `TerritoryID`，受保护表则声明可以按哪个列过滤。当前 transformer 只对 `SELECT` 查询做 RLS 改写；当用户没有任何 territory 权限时，它会尝试走 fail-closed 改写路径。

对于带有直接 territory 列的表，注册表会注入 territory 过滤条件。这里的实现是刻意保守的：它优先处理直接列过滤，而配置中保留的 join 相关元数据则作为后续更复杂改写的扩展点。

这样做的好处很实在：
- 权限规则写在 YAML 里，可读、可审
- territory 分组变化时不需要改 SQL 工具
- 无权限访问不会泄漏数据，只会得到空结果
- 未来要扩展到更多数据集时也容易复用同一模式

同一份配置里的 audit 开关还可以帮助运维记录 SQL 改写和被拒绝的查询，让安全链路更可追踪。

## 关联

另见 [工具系统](./tools.md)，了解 registry 与执行边界。


<details open>
<summary>相关源码文件</summary>

- [`src/QueryMind/core/user/base.py`](../../../src/QueryMind/core/user/base.py) - 面向身份相关操作的 user 服务抽象
- [`src/QueryMind/core/user/models.py`](../../../src/QueryMind/core/user/models.py) - `User` 模型与 group memberships
- [`src/QueryMind/core/user/request_context.py`](../../../src/QueryMind/core/user/request_context.py) - 请求上下文模型及 header/cookie 辅助方法
- [`src/QueryMind/core/user/resolver.py`](../../../src/QueryMind/core/user/resolver.py) - 可插拔的 request-to-user 解析逻辑
- [`src/QueryMind/core/registry.py`](../../../src/QueryMind/core/registry.py) - 工具可见性与执行策略约束
- [`src/QueryMind/core/tool/base.py`](../../../src/QueryMind/core/tool/base.py) - 工具基类与 schema 中的 access-group 暴露
- [`src/QueryMind/core/tool/models.py`](../../../src/QueryMind/core/tool/models.py) - 携带 access 元数据的 tool context 与 schema 模型
- [`src/QueryMind/core/agent/config.py`](../../../src/QueryMind/core/agent/config.py) - feature 访问组配置
- [`src/QueryMind/core/audit/base.py`](../../../src/QueryMind/core/audit/base.py) - 面向安全敏感事件的 audit logger 接口
- [`src/QueryMind/core/audit/models.py`](../../../src/QueryMind/core/audit/models.py) - 带有用户与请求元数据的 audit 事件模型
- [`src/QueryMind/core/hook/base.py`](../../../src/QueryMind/core/hook/base.py) - 用于策略与可观测性扩展的生命周期钩子
- [`src/QueryMind/core/middleware/base.py`](../../../src/QueryMind/core/middleware/base.py) - 请求/响应拦截用 middleware 接口
- [`src/QueryMind/core/recovery/base.py`](../../../src/QueryMind/core/recovery/base.py) - 可控失败处理的恢复策略接口
- [`src/QueryMind/core/recovery/default.py`](../../../src/QueryMind/core/recovery/default.py) - 默认重试/退避策略
- [`src/QueryMind/integrations/local/audit.py`](../../../src/QueryMind/integrations/local/audit.py) - 本地 audit logger 实现
- [`src/QueryMind/integrations/auditlogger/postgres_logger.py`](../../../src/QueryMind/integrations/auditlogger/postgres_logger.py) - Postgres audit logger 实现
- [`src/QueryMind/rls_registry.py`](../../../src/QueryMind/rls_registry.py) - 支持 RLS 的注册表及 SQL 改写/拒绝逻辑
- [`src/QueryMind/rls_config.yaml`](../../../src/QueryMind/rls_config.yaml) - territory RLS 策略配置

</details>
