# QueryMind 前置条件

本页整理 QueryMind 内置 demo agent 在 `my_agent.py` 和统一启动器（`querymind agent-only`、`querymind web-only`、`querymind demo`）运行时所需的最小部署栈。

源码里能确认的前置条件有四项，也会顺手补上四项很容易漏掉的运行时依赖：

- QueryMind Python SDK
- PostgreSQL & PgVector
- AdventureWorks
- 环境变量配置
- Schema memory 需要 Neo4j
- PostgreSQL 审计日志
- demo 前端构建需要 Node.js / npm
- demo 前端需要预构建的 webcomponent bundle

<a id="querymind-python-sdk"></a>
## 0. QueryMind Python SDK

在仓库根目录执行 `uv sync` 即可安装 QueryMind，这是仓库当前的主路径，会同时装好 `querymind`、`my-agent` 和 `my-evaluation` 这些入口脚本；如果你在本地开发时更偏好可编辑安装，也可以使用 `pip install -e .` 作为 fallback。

这个包要求 Python 3.10 或更新版本，与 `pyproject.toml` 保持一致。

<a id="postgresql-pgvector"></a>
## 1. PostgreSQL & PgVector

QueryMind 里 PostgreSQL 承担两种角色：

- demo 的业务数据库，由 `PostgresRunner` 负责执行 SQL，并由 `PostgresSchemaExtractor` 负责抽取 schema；
- 记忆层的向量存储，默认走 Mem0 的 `pgvector` provider。

`my_agent.py` 里当前把 AdventureWorks 连接写死为下面这组值：

- host：`127.0.0.1`
- port：`5432`
- database：`adventureworks`
- user：`querymind`
- password：`querymind`

记忆层默认使用 `localhost:5432` 上的 PostgreSQL，`provider="pgvector"`，默认记忆库名是 `mem0`。这意味着你的 PostgreSQL 部署需要为记忆库提供 pgvector 兼容的向量存储能力。如果你只有一套 PostgreSQL 服务，最直接的做法通常是为 `adventureworks` 和 `mem0` 分别建库。

如果需要改默认值，就使用下文里的 `PGVECTOR_*` 或 `MEM0_PGVECTOR_*` 环境变量。

示例 agent 还会通过 `PostgresAuditLogger` 把审计事件写入 PostgreSQL。源码默认连接的是 `postgres` 库，并自动创建 `public.audit_events` 表。请确保目标 PostgreSQL 用户有建表权限。

### 本地部署参考

如果你打算在本地搭一套最小可用环境，最直接的路径是：

1. 从系统软件包或 PostgreSQL 官方安装包安装 PostgreSQL。
2. 安装与 PostgreSQL 主版本匹配的 pgvector，或者直接使用官方 `pgvector/pgvector` Docker 镜像。
3. 启动 PostgreSQL，创建 `adventureworks` 和 `mem0` 两个数据库，并在这两个数据库里启用 `vector` 扩展。

Ubuntu / Debian 的示例命令如下：

```bash
sudo apt update
sudo apt install postgresql postgresql-<major>-pgvector
sudo -u postgres createdb adventureworks
sudo -u postgres createdb mem0
psql -d adventureworks -c "CREATE EXTENSION IF NOT EXISTS vector;"
psql -d mem0 -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

PostgreSQL 官方提供了二进制安装入口，见 [下载页面](https://www.postgresql.org/download/)；pgvector 官方则在 [安装说明](https://github.com/pgvector/pgvector#installation-notes---linux-and-mac) 中整理了各平台的安装方法。

### 本地快速初始化

如果你是从一个全新的本地 PostgreSQL 实例开始，最短路径是先建三个数据库：

- `adventureworks`：业务数据
- `mem0`：Mem0 记忆存储
- `postgres`：审计日志

然后在需要的数据库里启用 pgvector：

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

在启动 demo agent 之前，`adventureworks` 和 `mem0` 两个库都应该已经具备这个扩展。

<a id="adventureworks"></a>
## 2. AdventureWorks

AdventureWorks 是 `my_agent.py` 里的示例业务数据库，用来支撑 SQL 生成。

demo agent 实际只会同步和检索 `BUSINESS_SCHEMAS` 里定义的业务 schema：

- `person`
- `humanresources`
- `production`
- `purchasing`
- `sales`

因此你的 AdventureWorks 导入结果应该让这些 schema 出现在 `adventureworks` 这个数据库名下；如果你的本地命名不同，就需要同步修改 `my_agent.py`。

### 推荐导入路径

仓库里配套提供了 `AdventureWorks-for-Postgres/BusinessDBSetup.md`，可以作为 AdventureWorks 导入的参考。最短流程可以概括为：

```bash
cd AdventureWorks-for-Postgres
ruby update_csvs.rb
psql -c "CREATE DATABASE adventureworks;"
psql -d adventureworks -f install.sql
```

如果你直接按这个 helper 仓库操作，请特别确认数据库名大小写与 `my_agent.py` 里使用的 `adventureworks` 保持一致。

<a id="environment-variables-configuration"></a>
## 3. 环境变量配置

QueryMind 会通过 `runtime_paths.load_repo_env()` 自动加载仓库根目录下的 `.env`，所以最省事的做法就是把本地配置统一放在 `QueryMind/.env` 里。

### 最小 `.env` 示例

```env
# QueryMind 启动器
QUERYMIND_AGENT_HOST=0.0.0.0
QUERYMIND_AGENT_PORT=8000
QUERYMIND_WEB_HOST=127.0.0.1
QUERYMIND_WEB_PORT=8080
QUERYMIND_API_BASE=http://127.0.0.1:8000

# QueryMind 运行时目录
QUERYMIND_CONVERSATIONS_DIR=conversations
QUERYMIND_QUERY_RESULTS_DIR=query_results
MAX_TOOL_ITERATIONS=25

# my_agent.py 使用的 LLM
DEEPSEEK_API_KEY=...
DEEPSEEK_BASE_URL=https://api.deepseek.com

# Mem0 Agent Memory
OPENAI_API_KEY=...
MEM0_VECTOR_STORE_PROVIDER=pgvector
MEM0_PGVECTOR_HOST=localhost
MEM0_PGVECTOR_PORT=5432
MEM0_PGVECTOR_DATABASE=mem0
MEM0_PGVECTOR_USERNAME=postgres
MEM0_PGVECTOR_PASSWORD=...

# Schema Memory
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=password
NEO4J_DATABASE=neo4j
```

### 环境变量分组

- demo 后端和启动器：
  - `DEEPSEEK_API_KEY`
  - `DEEPSEEK_BASE_URL`
  - `QUERYMIND_AGENT_HOST`
  - `QUERYMIND_AGENT_PORT`
  - `QUERYMIND_CONVERSATIONS_DIR`
  - `QUERYMIND_QUERY_RESULTS_DIR`
  - `MAX_TOOL_ITERATIONS`
- demo 前端启动器：
  - `QUERYMIND_WEB_HOST`
  - `QUERYMIND_WEB_PORT`
  - `QUERYMIND_API_BASE`
  - `QUERYMIND_STARTUP_TIMEOUT`
  - `QUERYMIND_POLL_INTERVAL`
- Mem0 Agent Memory：
  - `OPENAI_API_KEY`
  - `MEM0_LLM_PROVIDER`
  - `MEM0_LLM_MODEL`
  - `MEM0_LLM_BASE_URL`
  - `MEM0_EMBEDDER_PROVIDER`
  - `MEM0_EMBEDDER_MODEL`
  - `MEM0_EMBEDDER_BASE_URL`
  - `MEM0_VECTOR_STORE_PROVIDER`
  - `MEM0_PGVECTOR_HOST` / `PGVECTOR_HOST`
  - `MEM0_PGVECTOR_PORT` / `PGVECTOR_PORT`
  - `MEM0_PGVECTOR_DATABASE` / `PGVECTOR_DATABASE`
  - `MEM0_PGVECTOR_USERNAME` / `PGVECTOR_USERNAME`
  - `MEM0_PGVECTOR_PASSWORD` / `PGVECTOR_PASSWORD`
  - `MEM0_EMBEDDING_DIM` / `EMBEDDING_DIM`
- Schema Memory：
  - `NEO4J_URI`
  - `NEO4J_USERNAME`
  - `NEO4J_PASSWORD`
  - `NEO4J_DATABASE`
  - `EMBEDDING_PROVIDER`
  - `EMBEDDING_MODEL`
  - `EMBEDDING_BASE_URL`
  - `LLM_PROVIDER`
  - `LLM_MODEL`
  - `LLM_BASE_URL`
  - `VECTOR_STORE_PROVIDER`
  - `PGVECTOR_HOST`
  - `PGVECTOR_PORT`
  - `PGVECTOR_DATABASE`
  - `PGVECTOR_USERNAME`
  - `PGVECTOR_PASSWORD`
  - `EMBEDDING_DIM`
- governance 调参：
  - `SCHEMA_GOVERNANCE_*`
  - `SQL_GOVERNANCE_*`

默认 demo 路径里，agent LLM 用的是 `DEEPSEEK_*`，Mem0 记忆默认依赖 `OPENAI_API_KEY`，schema memory 默认依赖 `NEO4J_*`。如果你想切换 provider，应该改对应的 `MEM0_*` 或 `LLM_*` 配置，而不是改启动器本身。

## 4. 额外运行时依赖

如果只看 README 顶部，很容易漏掉下面两项。

### Schema Memory 还需要 Neo4j

`my_agent.py` 会构建 `Neo4jConfig.from_env()`、`Neo4jMem0SchemaMemory(...)` 和 `Neo4jMem0SchemaManagementService(...)`，因此 schema memory 的图存储在 agent 启动前就必须可用。

默认配置会通过前面的 `NEO4J_*` 环境变量连接本地 Neo4j；如果保持默认值，图存储会指向 `bolt://localhost:7687` 和 `neo4j` 数据库。

### PostgreSQL 审计日志

`my_agent.py` 也会构建 `PostgresAuditLogger(...)`，把审计事件写入 PostgreSQL，并自动创建 `public.audit_events` 表。当前示例默认使用同一台 `127.0.0.1:5432` PostgreSQL 服务器上的 `postgres` 数据库。

如果你想把审计日志落到别的库，直接改 `my_agent.py` 里的构造参数即可。

### demo 前端构建需要 Node.js / npm

`frontends/webcomponent` 必须先构建，静态 demo 启动器才能提供 bundle。也就是说，运行 `npm install` 和 `npm run build` 时需要本机装好 `node` 和 `npm`。

### demo 前端需要预构建的 webcomponent bundle

`webcomponent_demo.py` 会直接提供 `frontends/webcomponent/static/querymind-components.js` 或 `frontends/webcomponent/dist/querymind-components.js` 作为静态 bundle。

如果 bundle 不存在，启动器会报错，并提示你先在 `frontends/webcomponent` 里执行 `npm run build`。实际操作是：

```bash
cd frontends/webcomponent
npm install
npm run build
```

这个 demo 启动器不会拉起 Vite 开发服务器，而是直接服务已经构建好的静态文件。

## 推荐启动顺序

1. 先用 `uv sync` 安装 QueryMind Python SDK。
2. 准备 PostgreSQL，并为 `adventureworks` 和 `mem0` 两个数据库提供 pgvector 支持。
3. 启动 Neo4j，并确认 `NEO4J_*` 连接信息可用。
4. 把启动器、LLM、Mem0 和 schema memory 的变量写入 `QueryMind/.env`。
5. 在 `frontends/webcomponent` 里运行 `npm install && npm run build`。
6. 最后用 `querymind demo` 启动完整 demo。
