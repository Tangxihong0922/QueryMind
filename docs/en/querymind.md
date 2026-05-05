# QueryMind Handbook

QueryMind is an LLM agent framework for natural-language-to-SQL work.
This page is the documentation entry point: it explains the system at a high
level and points to the component pages, governance pages, use cases, and
support material that carry the detailed implementation notes.


## What QueryMind Is

QueryMind is organized around five practical layers:

- Request boundary: resolve the user and load the conversation.
- Prompt chain: build the base system prompt and layer in governance rules.
- Tool plane: validate, govern, and execute tool calls.
- Memory plane: keep reusable agent memory and schema memory separate.
- Governance plane: control schema exploration and SQL drafting with explicit state machines.

The pages linked below are the source of truth for the implementation details.

## Documentation Map

### Core Entry

| Page | Status | Purpose |
|---|---|---|
| [querymind.md](./querymind.md) | Current | Entry page and documentation index |

### Components

| Page | Status | Purpose |
|---|---|---|
| [components/context.md](./components/context.md) | Current | Request assembly boundaries, enhancers, and tool-context enrichment |
| [components/request-assembly.md](./components/request-assembly.md) | Current | One turn from `ToolContext` to the final `LlmRequest` |
| [components/prompt-chain.md](./components/prompt-chain.md) | Current | Base prompt builder, governance prompt blocks, and enhancer ordering |
| [components/tools.md](./components/tools.md) | Current | Tool registry, validation, execution, and built-in tools |
| [components/memory.md](./components/memory.md) | Current | Agent Memory and Schema Memory as separate long-term stores |
| [components/conversation.md](./components/conversation.md) | Current | Conversation persistence and history-as-state-bus behavior |
| [components/workflow.md](./components/workflow.md) | Current | Deterministic commands, admin workflows, and starter UI routing |
| [components/security.md](./components/security.md) | Current | Authentication, authorization, UI gating, auditing, and RLS |
| [components/advanced-features.md](./components/advanced-features.md) | Current | Hooks, LLM middlewares, and recovery strategies |
| [components/agent-loop.md](./components/agent-loop.md) | Current | End-to-end query loop with a real evaluation trace |
| [components/schema-governance.md](./components/schema-governance.md) | Current | Schema exploration budget, lock state, and the enhancer/hook/middleware trio |
| [components/sql-governance.md](./components/sql-governance.md) | Current | SQL profile analysis, freeze, recap, and repair loop |

### Use Cases

| Page | Status | Purpose |
|---|---|---|
| [use-cases/schema-governance.md](./use-cases/schema-governance.md) | Current | Multi-turn schema discovery and expand-mode behavior |
| [use-cases/sql-governance.md](./use-cases/sql-governance.md) | Current | SQL drafting, drift detection, and local repair |
| [use-cases/workflow-shortcut.md](./use-cases/workflow-shortcut.md) | Current | Deterministic routing, starter UI, and LLM short-circuit |
| [use-cases/evaluation-run.md](./use-cases/evaluation-run.md) | Current | One real evaluation run from dataset to trace, judge, and report |

### Support

| Page | Status | Purpose |
|---|---|---|
| [support/installation.md](./support/installation.md) | Current | Environment setup and infrastructure bootstrap |
| [support/prerequisite.md](./support/prerequisite.md) | Current | Full prerequisite and deployment guide |
| [support/debugging.md](./support/debugging.md) | Current | Troubleshooting, runtime checks, and failure paths |
| [support/evaluation.md](./support/evaluation.md) | Current | Evaluation harness, datasets, metrics, and reporting |
| [support/querymind-eval-retro.md](./support/querymind-eval-retro.md) | Current | Retrospective on governance iteration and evaluation learnings |

## Recommended Reading Order

1. Read [components/context.md](./components/context.md) to understand request assembly boundaries.
2. Read [components/request-assembly.md](./components/request-assembly.md) to follow one turn from `ToolContext` to `LlmRequest`.
3. Read [components/prompt-chain.md](./components/prompt-chain.md) to understand the base prompt builder and enhancer ordering.
4. Read [components/tools.md](./components/tools.md) to understand execution and policy boundaries.
5. Read [components/memory.md](./components/memory.md) and [components/conversation.md](./components/conversation.md) to understand state and persistence.
6. Read [components/workflow.md](./components/workflow.md) and [components/security.md](./components/security.md) to understand deterministic routing and access control.
7. Read [use-cases/workflow-shortcut.md](./use-cases/workflow-shortcut.md) to see how starter UI and slash commands short-circuit before the LLM.
8. Read [components/advanced-features.md](./components/advanced-features.md) and [components/agent-loop.md](./components/agent-loop.md) to connect the earlier boundaries into one real query loop.
9. Read the governance pages next:
   - [components/schema-governance.md](./components/schema-governance.md)
   - [components/sql-governance.md](./components/sql-governance.md)
10. Read the use cases for end-to-end examples:
   - [use-cases/schema-governance.md](./use-cases/schema-governance.md)
   - [use-cases/sql-governance.md](./use-cases/sql-governance.md)
   - [use-cases/workflow-shortcut.md](./use-cases/workflow-shortcut.md)
   - [use-cases/evaluation-run.md](./use-cases/evaluation-run.md)

## How This Entry Page Will Be Used

- Keep this page short and navigational.
- Put implementation details in the linked component pages.
- Put end-to-end examples in the use-case pages.
- Put environment setup, debugging, and retrospective material in support pages.

## Notes

- The English and Chinese trees should stay structurally mirrored.
- Diagrams and figures can stay near the relevant sections, but the source assets should be centralized.
- Older long-form explanations from the previous entry page should be moved into the new component pages instead of being kept here.
