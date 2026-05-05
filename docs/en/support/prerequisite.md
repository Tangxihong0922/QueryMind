# QueryMind Prerequisites

This page collects the minimum deployment stack for the bundled demo agent in `my_agent.py` and the unified launcher (`querymind agent-only`, `querymind web-only`, `querymind demo`).

The source code shows the four prerequisites you asked for, plus four easy-to-miss runtime requirements:

- QueryMind Python SDK
- PostgreSQL & PgVector
- AdventureWorks
- Environment Variables Configuration
- Neo4j for schema memory
- PostgreSQL audit logging
- Node.js and npm for the demo frontend build
- A prebuilt webcomponent bundle for the demo frontend

<a id="querymind-python-sdk"></a>
## 0. QueryMind Python SDK

Install QueryMind from the repository root with `uv sync`; that is the primary path used by the repo, and it installs the package plus the `querymind`, `my-agent`, and `my-evaluation` entry points. If you prefer an editable install while developing locally, `pip install -e .` is the fallback.

The package requires Python 3.10 or newer, which matches `pyproject.toml`.

<a id="postgresql-pgvector"></a>
## 1. PostgreSQL & PgVector

QueryMind uses PostgreSQL in two different roles:

- the demo business database, queried by `PostgresRunner` and introspected by `PostgresSchemaExtractor`;
- the memory vector store, backed by Mem0 with a `pgvector` provider by default.

The sample backend currently hardcodes the AdventureWorks connection in `my_agent.py`:

- host: `127.0.0.1`
- port: `5432`
- database: `adventureworks`
- user: `querymind`
- password: `querymind`

The memory stacks default to PostgreSQL on `localhost:5432`, with `provider="pgvector"` and a default memory database name of `mem0`. That means your PostgreSQL deployment must expose pgvector-compatible vector storage for the memory databases. If you keep a single PostgreSQL server, the cleanest setup is usually to create separate databases for `adventureworks` and `mem0`.

If you want to override those defaults, use the `PGVECTOR_*` or `MEM0_PGVECTOR_*` environment variables described below.

The sample agent also writes audit events into PostgreSQL through `PostgresAuditLogger`. By default it connects to the `postgres` database, uses the `public.audit_events` table, and creates that table automatically on first use. Make sure the configured PostgreSQL user can create tables in that database.

### Local deployment reference

For a local setup, the most direct path is:

1. Install PostgreSQL from your platform packages or the official binary installers.
2. Install pgvector with the package that matches your PostgreSQL major version, or use the official `pgvector/pgvector` Docker image.
3. Start PostgreSQL, create the `adventureworks` and `mem0` databases, then enable the `vector` extension in both databases.

Example on Ubuntu or Debian:

```bash
sudo apt update
sudo apt install postgresql postgresql-<major>-pgvector
sudo -u postgres createdb adventureworks
sudo -u postgres createdb mem0
psql -d adventureworks -c "CREATE EXTENSION IF NOT EXISTS vector;"
psql -d mem0 -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

The PostgreSQL project documents binary installation options on the [official downloads page](https://www.postgresql.org/download/), and the pgvector project documents platform-specific install methods in its [installation notes](https://github.com/pgvector/pgvector#installation-notes---linux-and-mac).

### Quick local bootstrap

If you are starting from a fresh local PostgreSQL instance, the shortest path is to create three databases:

- `adventureworks` for the business data
- `mem0` for Mem0-backed memory storage
- `postgres` for the audit logger

Then enable pgvector in the databases that need it:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

The extension should be present in both `adventureworks` and `mem0` before you start the demo agent.

<a id="adventureworks"></a>
## 2. AdventureWorks

AdventureWorks is the sample OLTP business database that grounds SQL generation in `my_agent.py`.

The demo agent only syncs and searches the business schemas listed in `BUSINESS_SCHEMAS`:

- `person`
- `humanresources`
- `production`
- `purchasing`
- `sales`

That means your AdventureWorks import should make those schemas available under the `adventureworks` database name, or you should update `my_agent.py` to match your local database naming scheme.

### Recommended import path

The repository keeps a companion import guide in `AdventureWorks-for-Postgres/BusinessDBSetup.md`. The shortest version of that flow is:

```bash
cd AdventureWorks-for-Postgres
ruby update_csvs.rb
psql -c "CREATE DATABASE adventureworks;"
psql -d adventureworks -f install.sql
```

If you use the helper repository exactly as shipped, double-check the database name casing so it matches the lowercase `adventureworks` value used by `my_agent.py`.

<a id="environment-variables-configuration"></a>
## 3. Environment Variables Configuration

QueryMind loads the repository-local `.env` file automatically through `runtime_paths.load_repo_env()`, so the simplest setup is to keep your local values in `QueryMind/.env`.

### Minimal `.env` example

```env
# QueryMind launcher
QUERYMIND_AGENT_HOST=0.0.0.0
QUERYMIND_AGENT_PORT=8000
QUERYMIND_WEB_HOST=127.0.0.1
QUERYMIND_WEB_PORT=8080
QUERYMIND_API_BASE=http://127.0.0.1:8000

# QueryMind runtime storage
QUERYMIND_CONVERSATIONS_DIR=conversations
QUERYMIND_QUERY_RESULTS_DIR=query_results
MAX_TOOL_ITERATIONS=25

# LLM used by my_agent.py
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

### Environment groups

- Demo backend and launcher:
  - `DEEPSEEK_API_KEY`
  - `DEEPSEEK_BASE_URL`
  - `QUERYMIND_AGENT_HOST`
  - `QUERYMIND_AGENT_PORT`
  - `QUERYMIND_CONVERSATIONS_DIR`
  - `QUERYMIND_QUERY_RESULTS_DIR`
  - `MAX_TOOL_ITERATIONS`
- Demo frontend launcher:
  - `QUERYMIND_WEB_HOST`
  - `QUERYMIND_WEB_PORT`
  - `QUERYMIND_API_BASE`
  - `QUERYMIND_STARTUP_TIMEOUT`
  - `QUERYMIND_POLL_INTERVAL`
- Mem0 agent memory:
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
- Schema memory:
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
- Governance tuning:
  - `SCHEMA_GOVERNANCE_*`
  - `SQL_GOVERNANCE_*`

The default demo path uses `DEEPSEEK_*` for the agent LLM, `OPENAI_API_KEY` for Mem0-backed memory, and `NEO4J_*` for schema memory. If you want to swap in another provider, adjust the corresponding `MEM0_*` or `LLM_*` values instead of editing the launcher.

## 4. Additional Runtime Requirements

Two more runtime pieces are easy to miss if you only read the top-level README.

### Neo4j for schema memory

`my_agent.py` constructs `Neo4jConfig.from_env()`, `Neo4jMem0SchemaMemory(...)`, and `Neo4jMem0SchemaManagementService(...)`, so the schema memory graph store must be reachable before the agent starts.

The default configuration expects the local Neo4j service to be available through the `NEO4J_*` variables shown above. If you keep the defaults, the graph store points at `bolt://localhost:7687` with the `neo4j` database.

### PostgreSQL audit logger

`my_agent.py` also constructs `PostgresAuditLogger(...)`, which creates and writes the `public.audit_events` table in a PostgreSQL database. The current sample uses the same `127.0.0.1:5432` server and the `postgres` database for audit logging.

If you want to point audit logs elsewhere, update the constructor arguments in `my_agent.py`.

### Node.js and npm for the demo frontend build

The `frontends/webcomponent` package must be built before the static demo launcher can serve it. That means `node` and `npm` need to be available so you can run `npm install` and `npm run build`.

### Webcomponent bundle for the demo frontend

`webcomponent_demo.py` serves a prebuilt frontend bundle from `frontends/webcomponent/static/querymind-components.js` or `frontends/webcomponent/dist/querymind-components.js`.

If the bundle is missing, the launcher raises an error and tells you to run `npm run build` inside `frontends/webcomponent`. The practical setup is:

```bash
cd frontends/webcomponent
npm install
npm run build
```

The demo launcher does not start the Vite dev server; it serves the built assets directly.

## Recommended Bootstrap Order

1. Install the QueryMind Python SDK with `uv sync`.
2. Prepare PostgreSQL for the `adventureworks` and `mem0` databases, plus pgvector support for memory storage.
3. Start Neo4j and confirm the `NEO4J_*` connection values.
4. Fill in `QueryMind/.env` with the launcher, LLM, Mem0, and schema-memory variables.
5. Build the frontend bundle with `npm install && npm run build` inside `frontends/webcomponent`.
6. Launch the demo with `querymind demo`.
