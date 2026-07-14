# Portfolio Changelog

This file tracks changes maintained in `luyan9513/QueryMind-Enterprise` on top of the upstream QueryMind project.

## v0.1.0-portfolio - 2026-07-14

### Added

- DeepSeek and SiliconFlow provider configuration with component-level key fallback.
- `BAAI/bge-m3` fixed-dimension compatibility for Mem0 and pgvector.
- Read-only PostgreSQL PK/FK extraction through `pg_catalog`.
- Composite and cross-schema foreign-key modeling for Neo4j.
- Persistent LLM-generated conversation titles and automatic history refresh.
- Workflow message persistence, legacy conversation fallback, and mobile workspace fixes.
- Provider, graph relationship, conversation-title, and chat-history tests.
- Playwright as a reproducible browser-verification dependency.

### Verified

- 117 Python tests pass.
- AdventureWorks initialization covers 68 tables and 456 fields.
- Schema Memory contains 68 vectors, 91 `FK_TO` relationships, and 91 field-level `REFERENCES` relationships.

### Known Limitations

- No production deployment or concurrency benchmark.
- No standalone Text2SQL accuracy benchmark for this fork yet.
- Cloud-model retry, circuit breaking, and alerting are not implemented.

