# Security & Access Control

Security in QueryMind is layered, not monolithic. Identity is resolved at the request boundary, authorization is enforced on tools and UI features, and SQL safety is pushed into a registry-level policy layer before any database call is made. That separation keeps the system reusable across deployments and easier to explain in interviews.

This page is the policy reference for [Tool Registry Use Case: RLS Protection](./tools.md#tool-registry-use-case-rls-protection).

## User Resolver & Authentication^

```text
┌──────────────────────────────┐
│        HTTP Request          │
│ cookies / headers / IP /     │
│ query params / metadata      │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│       RequestContext         │
│  structured request state    │
│  - cookies                   │
│  - headers                   │
│  - remote_addr               │
│  - query_params              │
│  - metadata                  │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│       UserResolver           │
│  pluggable auth adapter      │
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
│ Authorization surfaces       │
│ tools / UI features / RLS    │
└──────────────────────────────┘
```

`RequestContext` is the handoff object between the web layer and authentication logic. It carries cookies, headers, remote address, query parameters, and framework-specific metadata, and its header lookup is case-insensitive so adapters can stay framework-agnostic.

`UserResolver` is intentionally abstract. QueryMind does not hard-code a single login scheme; it only requires a resolver that can turn the request context into a `User` object. That makes it easy to plug in cookie auth, bearer tokens, SSO, or a local dev resolver without changing the rest of the stack.

The authorization side starts from `User.group_memberships`, not from ad hoc checks scattered through the codebase. The `User` model also keeps a free-form `metadata` field, so provider claims can be preserved without changing the core schema.

The design split is the important part:
- authentication answers "who is this?"
- authorization answers "what may this identity do?"
- the rest of QueryMind consumes `group_memberships` as the shared policy primitive

## Tool Access Control^

```text
┌──────────────────────────────┐      ┌──────────────────────────────┐
│     user.group_memberships   │      │     tool.access_groups       │
│   ["user", "admin", ...]     │      │   [] or ["admin", ...]      │
└──────────────┬───────────────┘      └──────────────┬───────────────┘
               │                                     │
               └──────────────┬──────────────────────┘
                              ▼
                    ┌──────────────────────────┐
                    │ empty access_groups       │
                    │ => public tool            │
                    │ otherwise intersection    │
                    └──────────────┬───────────┘
                                   ▼
                        allow if shared group
                        deny otherwise
```

`ToolRegistry` keeps policy out of the tool implementations. A tool can be wrapped with deployment-specific `access_groups` at registration time, which means the same class can be reused in demo, evaluation, and production with different permissions.

The registry applies the same group-intersection rule in two places:
- `get_schemas(user)` hides tool schemas the user should not see
- `execute()` blocks runtime execution when the user lacks access

That dual check matters. LLMs only see the tools they are allowed to use, and even if a tool call is generated anyway, the registry stops it before execution.

QueryMind also reuses the same model for UI feature gating. `UiFeatures` in `AgentConfig` uses group membership checks with the same intersection semantics as tools, and the schema-management UI features default to `["admin"]`. During request setup, the agent computes `ui_features_available` and stores it in `ToolContext.metadata`, so tools and audit logs can read the same allowlist.

This is especially visible in schema management:
- `/schema_*` workflow commands are admin-gated
- `/api/querymind/v1/schema/*` routes check for `admin`
- schema-management UI features are admin-only by default

So the policy is consistent across chat commands, API routes, and rendered UI.

### Audit Trail

Access control is observable, not hidden. `AuditLogger` can record tool access checks, tool invocations, tool results, UI feature checks, and AI responses. `AuditConfig` enables the high-value events by default, while `log_ui_feature_checks` stays off by default because it can be noisy.

Sensitive tool parameters are sanitized before logging by name-based redaction. Common secret-like keys such as `password`, `token`, `api_key`, `credential`, `private_key`, and `access_key` are replaced before the event is stored.

## RLS Protection Module^*

```text
┌────────────────────────────────────────────────────────────────────┐
│                    RLSToolRegistry.transform_args()                │
├────────────────────────────────────────────────────────────────────┤
│  tool is run_sql?                                                  │
│     ├─ no  → pass through unchanged                                │
│     └─ yes                                                         │
│            ▼                                                       │
│      RunSqlToolArgs (typed)                                         │
│            ▼                                                       │
│  1) SQL injection detection                                        │
│            ├─ reject → ToolRejection                               │
│            ▼                                                       │
│  2) Query complexity validation                                    │
│            ├─ reject → ToolRejection                               │
│            ▼                                                       │
│  3) Territory-based rewrite                                         │
│            ▼                                                       │
│      RunSqlTool.execute()                                           │
└────────────────────────────────────────────────────────────────────┘
```

`RLSToolRegistry` is the clearest example of why QueryMind keeps policy in the registry layer. Row-level security is cross-cutting behavior, so it belongs above the SQL tool, not inside it. That keeps `RunSqlTool` reusable while letting deployments swap in different security rules by changing `rls_config.yaml`.

The YAML config is organized into four policy blocks:
- `territory_rls` for group-to-territory mapping and protected tables
- `sql_injection` for rejection patterns and metadata allowlists
- `query_limits` for query length and structural complexity caps
- `audit` for logging SQL rewrites and rejected queries

Only `run_sql` is transformed. The registry checks the tool name, validates the typed `RunSqlToolArgs`, then applies policy before execution. Because the hook runs after Pydantic validation and before the database call, the policy layer sees structured arguments, not raw strings.

This module is innovative for one simple reason: it turns SQL safety into a composable deployment policy. The tool stays focused on database execution, while the registry owns the security contract.

### SQL Injection Prevention^

```text
┌────────────────────────────────────────────────────────────────────┐
│ raw SQL query                                                      │
└──────────────┬─────────────────────────────────────────────────────┘
               ▼
┌────────────────────────────────────────────────────────────────────┐
│ metadata allowlist match?                                          │
│ - information_schema                                               │
│ - pg_catalog                                                       │
│ - other read-only catalog views                                    │
└──────────────┬─────────────────────────────────────────────────────┘
        yes    │    no
               ▼
     allow catalog introspection                         check forbidden patterns
                                                              │
                                                              ▼
                                                 any match => reject
                                                              │
                                                              ▼
                                                complexity + RLS checks
```

QueryMind blocks obvious injection patterns before any SQL reaches the runner. The forbidden set covers comment injection, stacked statements, DDL/DML chaining, `UNION SELECT` abuse, execution primitives, file access, shell-style escalation, timing payloads, and common bypass forms.

The allowlist is just as important as the deny list. Schema retrieval depends on read-only metadata access, so `information_schema` and `pg_catalog` queries are explicitly allowed when they are clearly being used for introspection. That keeps security from breaking a core product feature.

The result is a pragmatic balance:
- safe by default
- explicit exceptions for read-only metadata
- fail closed on everything else

### Territory-Based Row-Level Security (RLS)^

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
│ allowed territory ids        │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ no territories?              │
│  ├─ yes → return empty rows  │
│  └─ no  → inspect SELECT SQL │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ protected table referenced?   │
│  ├─ yes → rewrite WHERE      │
│  └─ no  → leave SQL unchanged│
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ RunSqlTool executes rewritten │
│ query                        │
└──────────────────────────────┘
```

The territory policy is config-driven. Groups map to allowed `TerritoryID` values, and protected tables declare which columns can be filtered. The current transformer applies RLS to `SELECT` queries only, and it attempts a fail-closed rewrite when a user has no territory access.

For tables with a direct territory column, the registry injects a territory predicate into the query. The implementation is intentionally conservative: it focuses on direct column-based filtering, while the config keeps join-oriented metadata available as an extension point for richer policy rewrites later.

That design gives QueryMind a few useful properties:
- permissions are readable in YAML, not hidden in code
- new territory groupings can be deployed without changing the SQL tool
- unauthorized access produces empty data instead of a leaky fallback
- the same pattern can be extended to more datasets later

The audit flags in the same config let operators record rewrites and rejected queries when they need a stronger paper trail.

## Related

See also [Tool Registry Use Case: RLS Protection](./tools.md#tool-registry-use-case-rls-protection).


<details open>
<summary>Relevant source files</summary>

- [`src/QueryMind/core/user/base.py`](../../../src/QueryMind/core/user/base.py) - user service abstraction for identity-dependent operations
- [`src/QueryMind/core/user/models.py`](../../../src/QueryMind/core/user/models.py) - `User` model and group memberships
- [`src/QueryMind/core/user/request_context.py`](../../../src/QueryMind/core/user/request_context.py) - request context model and header/cookie helpers
- [`src/QueryMind/core/user/resolver.py`](../../../src/QueryMind/core/user/resolver.py) - pluggable request-to-user resolution
- [`src/QueryMind/core/registry.py`](../../../src/QueryMind/core/registry.py) - tool visibility and execution policy enforcement
- [`src/QueryMind/core/tool/base.py`](../../../src/QueryMind/core/tool/base.py) - tool interface and access-group exposure through schemas
- [`src/QueryMind/core/tool/models.py`](../../../src/QueryMind/core/tool/models.py) - tool context and schema models that carry access metadata
- [`src/QueryMind/core/agent/config.py`](../../../src/QueryMind/core/agent/config.py) - feature access-group configuration
- [`src/QueryMind/core/audit/base.py`](../../../src/QueryMind/core/audit/base.py) - audit logger interface for security-sensitive events
- [`src/QueryMind/core/audit/models.py`](../../../src/QueryMind/core/audit/models.py) - audit event models with user and request metadata
- [`src/QueryMind/core/hook/base.py`](../../../src/QueryMind/core/hook/base.py) - lifecycle hooks for policy and observability extensions
- [`src/QueryMind/core/middleware/base.py`](../../../src/QueryMind/core/middleware/base.py) - middleware interface for request/response interception
- [`src/QueryMind/core/recovery/base.py`](../../../src/QueryMind/core/recovery/base.py) - recovery interface for controlled failure handling
- [`src/QueryMind/core/recovery/default.py`](../../../src/QueryMind/core/recovery/default.py) - default retry/backoff strategy
- [`src/QueryMind/integrations/local/audit.py`](../../../src/QueryMind/integrations/local/audit.py) - local audit logger implementation
- [`src/QueryMind/integrations/auditlogger/postgres_logger.py`](../../../src/QueryMind/integrations/auditlogger/postgres_logger.py) - Postgres audit logger implementation
- [`src/rls_registry.py`](../../../src/rls_registry.py) - RLS-aware registry with SQL transformation and rejection logic
- [`src/rls_config.yaml`](../../../src/rls_config.yaml) - territory RLS policy configuration

</details>