# QueryMind

**LLM-powered SQL Query Agent with RAG Capabilities**

QueryMind is a modular framework for building LLM-powered agents specialized in natural language to SQL translation with enterprise-grade security and intelligent schema discovery.

---

## 🌟 Core Features

| Feature | Description |
|---------|-------------|
| **Dual Memory System** | Agent Memory (Mem0) for Q&A patterns + Schema Memory (Neo4j + PgVector) for database structure |
| **Hybrid Schema Search** | RRF-fused vector semantic search + graph FK traversal |
| **4 Search Modes** | hybrid / vector / graph / expand - LLM agentic decision |
| **Context Enhancement Pipeline** | Enhancer (LLM side) + Enricher (Tool side) dual-channel injection |
| **Enterprise RLS** | SQL injection prevention + Territory-based Row-Level Security |
| **9 Extensibility Points** | Hooks, Middleware, Recovery, Enhancer, Enricher, Filter, etc. |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              QUERYMIND ARCHITECTURE                             │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                            USER INTERFACE                                 │    │
│  │                         (FastAPI / Web UI)                                │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                       │                                         │
│                                       ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                              AGENT CORE                                   │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │    │
│  │  │   Agent     │  │    Tool     │  │  Workflow   │  │   Context    │    │    │
│  │  │  Loop      │  │  Registry   │  │  Handler    │  │  Pipeline    │    │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│           │                   │                    │                  │            │
│           ▼                   ▼                    ▼                  ▼            │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                           INTEGRATIONS                                    │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │    │
│  │  │   LLM       │  │   Agent     │  │   Schema    │  │   Audit     │    │    │
│  │  │  Service   │  │  Memory     │  │  Memory     │  │   Logger    │    │    │
│  │  │ (MiniMax)  │  │  (Mem0)     │  │ (Neo4j+PgV) │  │ (PostgreSQL)│    │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                       │                                         │
│                                       ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                         DATA STORES                                      │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │    │
│  │  │ PostgreSQL  │  │   Neo4j     │  │  PgVector   │  │    File     │    │    │
│  │  │  (Target)   │  │  (Graph)    │  │  (Vectors)  │  │  System     │    │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Agent Loop - Complete Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              AGENT LOOP DATA FLOW                                │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ 1. USER MESSAGE                                                         │    │
│  │    "Find orders from Northwest region"                                   │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                    │                                             │
│                                    ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ 2. USER RESOLUTION                                                       │    │
│  │    UserResolver.resolve_user(request_context)                            │    │
│  │    └─→ User(group_memberships=["sales_northwest"])                       │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                    │                                             │
│                                    ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ 3. WORKFLOW HANDLER CHECK                                                │    │
│  │    WorkflowHandler.try_handle(message)                                    │    │
│  │    ├─ SchemaInitWorkflow: /init_schema                                   │    │
│  │    ├─ SchemaManagementWorkflow: /schema_*                               │    │
│  │    └─ DefaultWorkflowHandler: Normal processing                          │    │
│  │    [If matched → skip LLM, return workflow result]                       │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                    │                                             │
│                                    ▼ (Not matched)                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ 4. TOOL CONTEXT ENRICHMENT (ToolContextEnricher)                         │    │
│  │    ┌─────────────────────────────────────────────────────────────────┐  │    │
│  │    │ SchemaRetrieveContextEnricher                                     │  │    │
│  │    │   └─→ ConversationStore.get_recent() → Extract seed_tables     │  │    │
│  │    │   └─→ context.metadata["schema_retrieve_context"] = {            │  │    │
│  │    │           seed_tables: [...],                                     │  │    │
│  │    │           expand_mode: True/False,                                │  │    │
│  │    │       }                                                           │  │    │
│  │    └─────────────────────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                    │                                             │
│                                    ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ 5. LLM CONTEXT ENHANCEMENT (LlmContextEnhancer)                           │    │
│  │    ┌─────────────────────────────────────────────────────────────────┐  │    │
│  │    │ SchemaContextEnhancer                                             │  │    │
│  │    │   └─→ Append SCHEMA_RETRIEVE_RULES to system prompt              │  │    │
│  │    └─────────────────────────────────────────────────────────────────┘  │    │
│  │    ┌─────────────────────────────────────────────────────────────────┐  │    │
│  │    │ DefaultLlmContextEnhancer (AgentMemory)                           │  │    │
│  │    │   └─→ AgentMemory.search_text_memories() → Q&A examples          │  │    │
│  │    └─────────────────────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                    │                                             │
│                                    ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ 6. LLM RESPONSE / TOOL CALL LOOP                               ◀────────┐│    │
│  │    ┌───────────────────────────────────────────────────────────────┐    ││    │
│  │    │ While iterations < max_tool_iterations:                       │    ││    │
│  │    │                                                               │    ││    │
│  │    │   LLM Response                                                │    ││    │
│  │    │      ├─→ Text → Return to user (complete)                     │    ││    │
│  │    │      └─→ Tool Calls → Execute each tool                       │    ││    │
│  │    │                                                               │    ││    │
│  │    │         ┌─────────────────────────────────────────────┐       │    ││    │
│  │    │         │  ToolRegistry.execute(tool_call, context)    │       │    ││    │
│  │    │         │                                              │       │    ││    │
│  │    │         │  RLSToolRegistry.transform_args():           │       │    ││    │
│  │    │         │    ├─ _detect_sql_injection()               │       │    ││    │
│  │    │         │    ├─ _validate_query_complexity()          │       │    ││    │
│  │    │         │    └─ _apply_territory_rls()                │       │    ││    │
│  │    │         │                                              │       │    ││    │
│  │    │         │  Tool.execute(context, args)                 │       │    ││    │
│  │    │         │         └─→ ToolResult                       │       │    ││    │
│  │    │         └─────────────────────────────────────────────┘       │    ││    │
│  │    │                                                               │    ││    │
│  │    │         Tool Result → Continue loop                           │    ││    │
│  │    └───────────────────────────────────────────────────────────────┘    ││    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                    │                                             │
│                                    ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ 7. FINAL RESPONSE TO USER                                               │    │
│  │    UiComponent stream → Frontend display                               │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🧠 Schema Memory Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         SCHEMA MEMORY ARCHITECTURE                               │
│                                                                                  │
│    ┌────────────────────────────────────────────────────────────────────────┐  │
│    │                    Neo4jMem0SchemaMemory                                 │  │
│    │                          (Facade)                                       │  │
│    └────────────────────────────────────────────────────────────────────────┘  │
│                    │                               │                            │
│                    ▼                               ▼                            │
│    ┌───────────────────────────┐    ┌───────────────────────────────────────┐   │
│    │      Neo4jGraphStore      │    │         Mem0VectorStore               │   │
│    │         (Graph Layer)     │    │          (Vector Layer)               │   │
│    │                           │    │                                       │   │
│    │  Nodes:                   │    │  Store: Mem0 Memory                   │   │
│    │  - (:Table)               │    │  - TableSchema → vector_text         │   │
│    │  - (:Field)               │    │  - Semantic search                   │   │
│    │  - (:BusinessDomain)     │    │  - domain/table_name filters         │   │
│    │                           │    │                                       │   │
│    │  Relationships:          │    │                                       │   │
│    │  - HAS_FIELD              │    │                                       │   │
│    │  - BELONGS_TO_DOMAIN      │    │                                       │   │
│    │  - FK_TO                  │    │                                       │   │
│    │  - REFERENCES             │    │                                       │   │
│    └───────────────────────────┘    └───────────────────────────────────────┘   │
│                    │                               │                            │
│                    └───────────┬───────────────────┘                            │
│                                ▼                                                │
│                    ┌───────────────────────┐                                    │
│                    │   SchemaSearch        │                                    │
│                    │   (Fusion Engine)     │                                    │
│                    │                       │                                    │
│                    │  RRF Algorithm:       │                                    │
│                    │  score = Σ (w / (k+r))│                                    │
│                    │  vector_w=0.6         │                                    │
│                    │  graph_w=0.4          │                                    │
│                    │  k=60 (RRF param)     │                                    │
│                    └───────────────────────┘                                    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔍 Schema Retrieve Tool - 4 Search Modes

### Mode Decision Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    SCHEMA RETRIEVE MODE SELECTION LOGIC                          │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                    TOOL CALL: schema_retrieve                             │    │
│  │  query: "..."                                                            │    │
│  │  seed_tables: [ ] OR [table1, table2, ...]  ← Key decision factor!       │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                       │                                         │
│                                       ▼                                         │
│                    ┌──────────────────────────────────────┐                      │
│                    │  seed_tables provided by Enricher?   │                      │
│                    └──────────────────────────────────────┘                      │
│                                       │                                         │
│                    ┌──────────────────┴──────────────────┐                       │
│                    │ YES                                │ NO                    │
│                    ▼                                    ▼                       │
│         ┌─────────────────────┐              ┌─────────────────────┐            │
│         │      EXPAND         │              │  Check query type   │            │
│         │  (Seed-based FK     │              │                     │            │
│         │   expansion)       │              │  ┌───────────────┐ │            │
│         │                     │              │  │ Contains FK/ │ │            │
│         │ From seed_tables:   │              │  │ Relationship  │ │            │
│         │ - SalesOrderHeader │              │  │ keywords?    │ │            │
│         │                     │              │  └───────────────┘ │            │
│         │ Via FK traversal:   │              │         │          │            │
│         │ hop 1: SalesOrderDetail           │         ├─YES──────┼──→ GRAPH  │
│         │ hop 1: Customer      │              │         │          │            │
│         │ hop 2: Address       │              │         └─NO──────┘            │
│         │ hop 2: Person        │              │         │          │            │
│         │                     │              │         ▼          │            │
│         │ Deduplicate          │              │  ┌─────────────────┴─┐          │
│         │ Return expanded list │              │  │   DEFAULT        │          │
│         │                     │              │  │   HYBRID        │          │
│         │                     │              │  │ (Vector + Graph │          │
│         │                     │              │  │  RRF Fusion)    │          │
│         │                     │              │  └─────────────────┘          │
│         │                     │              │         │          │            │
│         │                     │              │         └─NO──────→ VECTOR      │
│         └─────────────────────┘              └─────────────────────┘            │
│                                                                                  │
│  MODE SELECTION RULES (injected by SchemaContextEnhancer):                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ When seed_tables is NOT provided:                                        │    │
│  │   • hybrid (default) - general business queries                          │    │
│  │   • vector - simple semantic queries                                     │    │
│  │   • graph - FK relationship exploration                                 │    │
│  │                                                                             │    │
│  │ When seed_tables IS provided (by Enricher):                             │    │
│  │   • expand - seed-based table expansion                                 │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### EXPAND Mode - Complete Decision Flow (Special Case)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    EXPAND MODE - COMPLETE DECISION FLOW                         │
│                                                                                  │
│  ═══════════════════════════════════════════════════════════════════════════   │
│  FIRST QUERY: "Find tables related to customer orders"                         │
│  ═══════════════════════════════════════════════════════════════════════════   │
│                                       │                                         │
│                                       ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ LLM DECISION: No seed_tables in context                                 │    │
│  │ └─→ Cannot use EXPAND → selects HYBRID (default)                        │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                       │                                         │
│                                       ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ HYBRID SEARCH:                                                          │    │
│  │   Parallel:                                                             │    │
│  │     ├─→ Mem0VectorStore.search_by_query("customer orders")              │    │
│  │     │     └─→ [SalesOrderHeader, Customer, Person, ...]                 │    │
│  │     └─→ Neo4jGraphStore.find_tables_by_domain("Sales")                   │    │
│  │           └─→ [SalesOrderHeader, SalesOrderDetail, ...]                  │    │
│  │   RRF Fusion: vector_score + graph_score → final ranking                 │    │
│  │   Top Result: SalesOrderHeader (score: 0.92)                           │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                       │                                         │
│                                       ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ TOOL RESULT stored with metadata:                                       │    │
│  │   { selected_tables: ["SalesOrderHeader"] }  ← KEY for next step!        │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                       │                                         │
│  ═══════════════════════════════════════════════════════════════════════════   │
│  SECOND QUERY: "Find all tables related to these orders"                       │
│  ═══════════════════════════════════════════════════════════════════════════   │
│                                       │                                         │
│                                       ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ SchemaRetrieveContextEnricher.enrich_context()                          │    │
│  │   1. conversation_store.get_recent() → finds previous tool call        │    │
│  │   2. Extracts selected_tables = ["SalesOrderHeader"]                    │    │
│  │   3. Injects into context.metadata:                                     │    │
│  │      context.metadata["schema_retrieve_context"] = {                     │    │
│  │          seed_tables: ["SalesOrderHeader"],  ← NOW PROVIDED!            │    │
│  │          expand_mode: True,                                             │    │
│  │          last_query: "customer orders",                                 │    │
│  │      }                                                                  │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                       │                                         │
│                                       ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ LLM DECISION: seed_tables=["SalesOrderHeader"] provided                 │    │
│  │ └─→ SchemaContextEnhancer's rules: "When seed_tables IS provided"       │    │
│  │ └─→ LLM selects: EXPAND mode                                           │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                       │                                         │
│                                       ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ EXPAND SEARCH:                                                          │    │
│  │   For each seed_table:                                                  │    │
│  │     Neo4jGraphStore.find_related_tables(seed_table, max_hops=2)          │    │
│  │         │                                                               │    │
│  │         ├─→ FK_TO: SalesOrderHeader → Customer                          │    │
│  │         ├─→ FK_TO: SalesOrderHeader → Person (via Customer)           │    │
│  │         ├─→ FK_TO: SalesOrderDetail → SalesOrderHeader                 │    │
│  │         ├─→ FK_TO: SalesOrderHeader → SalesTerritory                   │    │
│  │         └─→ FK_TO: SalesPerson → SalesTerritory                        │    │
│  │   Deduplicate → [SalesOrderDetail, Customer, SalesTerritory,            │    │
│  │                  SalesPerson, Address, Person, ...]                      │    │
│  │   Return expanded tables (all related via FK)                           │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### RRF Fusion Algorithm

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           RRF (RECIPROCAL RANK FUSION)                           │
│                                                                                  │
│  Formula:                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                                                                             │    │
│  │   fusion_score = vector_weight × (1 / (k + vector_rank))                 │    │
│  │                 + graph_weight × (1 / (k + graph_rank))                   │    │
│  │                                                                             │    │
│  │   Default: vector_weight=0.6, graph_weight=0.4, k=60                      │    │
│  │                                                                             │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  Example:                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ Vector Results (semantic):              Graph Results (FK):            │    │
│  │   Rank 1: SalesOrderHeader (0.95)         Rank 1: SalesOrderDetail     │    │
│  │   Rank 2: Customer (0.88)                 Rank 2: SalesOrderHeader     │    │
│  │   Rank 3: Person (0.85)                   Rank 3: SalesPerson          │    │
│  │                                                                             │    │
│  │ Fusion Calculation for SalesOrderHeader:                                │    │
│  │   = 0.6 × (1 / (60 + 1)) + 0.4 × (1 / (60 + 2))                       │    │
│  │   = 0.6 × 0.0164 + 0.4 × 0.0161                                        │    │
│  │   = 0.00984 + 0.00644 = 0.01628                                         │    │
│  │                                                                             │    │
│  │ Final Ranking: [SalesOrderHeader, SalesOrderDetail, Customer, ...]       │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔗 Context Enhancement Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    CONTEXT ENHANCEMENT PIPELINE                                  │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                     LLM CONTEXT ENHANCERS (LlmContextEnhancer)             │    │
│  │                         (Applied to System Prompt)                       │    │
│  │                                                                         │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐    │    │
│  │  │ SchemaContextEnhancer                                             │    │    │
│  │  │                                                                   │    │    │
│  │  │ enhance_system_prompt():                                         │    │    │
│  │  │   └─→ Append SCHEMA_RETRIEVE_RULES:                              │    │    │
│  │  │       "When using schema_retrieve tool, select mode based on:"   │    │    │
│  │  │       - hybrid: Most general business queries                     │    │    │
│  │  │       - vector: Simple semantic queries                          │    │    │
│  │  │       - graph: FK relationship exploration                       │    │    │
│  │  │       - expand: When seed_tables provided                        │    │    │
│  │  └─────────────────────────────────────────────────────────────────┘    │    │
│  │                                                                         │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐    │    │
│  │  │ DefaultLlmContextEnhancer (AgentMemory)                           │    │    │
│  │  │                                                                   │    │    │
│  │  │ enhance_system_prompt():                                         │    │    │
│  │  │   └─→ agent_memory.search_text_memories(query)                   │    │    │
│  │  │   └─→ Append relevant examples to prompt:                        │    │    │
│  │  │       "## Relevant Context from Memory"                          │    │    │
│  │  │       "• Previous Q&A about similar queries..."                   │    │    │
│  │  └─────────────────────────────────────────────────────────────────┘    │    │
│  │                                                                         │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                        │                                        │
│                                        │ Enhanced System Prompt                 │
│                                        ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                           LLM PROCESSING                                 │    │
│  │              (Generates tool calls based on enhanced prompt)            │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                        │                                        │
│                                        │ Tool Call: schema_retrieve             │
│                                        ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                   TOOL CONTEXT ENRICHERS (ToolContextEnricher)           │    │
│  │                      (Applied to Tool Execution Context)                  │    │
│  │                                                                         │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐    │    │
│  │  │ SchemaRetrieveContextEnricher                                     │    │    │
│  │  │                                                                   │    │    │
│  │  │ enrich_context(context):                                          │    │    │
│  │  │   1. conversation_store.get_recent(conversation_id, limit=10)      │    │    │
│  │  │   2. Find last schema_retrieve result from history               │    │    │
│  │  │   3. Extract selected_tables from metadata                        │    │    │
│  │  │   4. Inject into context.metadata:                                │    │    │
│  │  │       context.metadata["schema_retrieve_context"] = {            │    │    │
│  │  │           "seed_tables": [...],   # For expand mode             │    │    │
│  │  │           "expand_mode": True,                                    │    │    │
│  │  │       }                                                           │    │    │
│  │  └─────────────────────────────────────────────────────────────────┘    │    │
│  │                                                                         │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                        │                                        │
│                                        │ Enriched ToolContext                   │
│                                        ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                      TOOL EXECUTION                                      │    │
│  │                   SchemaRetrieveTool.execute()                           │    │
│  │                         │                                                │    │
│  │                         ▼                                                │    │
│  │              SchemaMemory.search_schema(                                 │    │
│  │                  query="...",                                            │    │
│  │                  context=context,  ← Includes seed_tables!                │    │
│  │                  search_mode="hybrid/vector/graph/expand",               │    │
│  │              )                                                          │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔒 RLS & Security

### SQL Injection Prevention

QueryMind blocks dangerous SQL patterns through regex matching:

| Pattern | Attack Type |
|---------|-------------|
| `;--` | Comment injection |
| `/\*.*\*/` | Block comment injection |
| `;\s*(DROP\|DELETE\|TRUNCATE)` | DDL statement injection |
| `UNION\s+SELECT` | UNION-based injection |
| `LOAD_FILE\|INTO\s+OUTFILE` | File read/write injection |
| `SLEEP\(\|BENCHMARK\` | Time-based blind injection |
| `xp_cmdshell` | OS command execution |

### Territory-Based Row-Level Security

Based on user's `group_memberships`, QueryMind automatically rewrites SQL:

```yaml
# rls_config.yaml
group_territory_mapping:
  sales_northwest: [1, 2, 3]
  sales_canada: [10]
  sales_manager: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  admin: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  user: [1, 2, 3, 4, 5, 6, 7, 8, 9]
  guest: []
```

**Example Transformation:**

```
Original SQL:
  SELECT * FROM Sales.SalesOrderHeader WHERE OrderDate > '2024-01-01'

User: sales_northwest (Territories: [1, 2, 3])

Transformed SQL:
  SELECT * FROM Sales.SalesOrderHeader 
  WHERE OrderDate > '2024-01-01' 
    AND (TerritoryID IN (1, 2, 3) OR TerritoryID IS NULL)
```

---

## 🛠️ Available Tools

| Tool | Access Groups | Description |
|------|---------------|-------------|
| `run_sql` | user, admin | Execute SQL queries |
| `schema_retrieve` | user, admin | Retrieve schema information |
| `save_question` | user, admin | Save correct Q&A pairs |
| `search_saved_correct` | user, admin | Search saved examples |
| `save_text_memory` | user, admin | Save text to memory |
| `run_python_file` | admin | Execute Python files |
| `pip_install` | admin | Install Python packages |
| `list_files` | admin | List directory contents |
| `search_files` | admin | Search file contents |
| `read_file` | admin | Read file contents |
| `write_file` | admin | Write file contents |
| `visualize_data` | admin | Generate visualizations |

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd QueryMind
pip install -e .
```

### 2. Configure Environment

```bash
cd src
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start the Server

```bash
cd src
python my_agent.py
# Server runs on http://0.0.0.0:8000
```

### 4. Example API Call

```python
import requests

response = requests.post(
    "http://localhost:8000/api/chat",
    json={
        "message": "Show me sales orders from Northwest region",
        "user_id": "user_001"
    }
)
print(response.json())
```

---

## 📁 Project Structure

```
QueryMind/
├── src/
│   ├── my_agent.py              # Main entry point
│   ├── .env.example             # Environment variables
│   ├── rls_config.yaml          # RLS security rules
│   ├── rls_registry.py          # RLS ToolRegistry
│   ├── rls_rules.md             # RLS documentation
│   └── QueryMind/               # Core framework
│       ├── core/                # Core abstractions
│       │   ├── agent/           # Agent implementation
│       │   ├── tool/            # Tool base classes
│       │   ├── registry/        # Tool registry
│       │   ├── enhancer/        # LLM context enhancers
│       │   ├── enricher/        # Tool context enrichers
│       │   └── workflow/        # Workflow handlers
│       ├── integrations/        # External integrations
│       │   ├── llmservice/     # LLM service adapters
│       │   ├── agentmemory/     # Mem0 integration
│       │   ├── schemamemory/    # Neo4j + PgVector
│       │   └── sqlrunner/       # SQL execution
│       ├── tools/               # Tool implementations
│       └── server/              # FastAPI server
├── pyproject.toml
└── README.md
```

---

## 📚 Documentation

- [Installation Guide](./INSTALL_INFRASTRUCTURE.md) - Infrastructure setup for PostgreSQL, Neo4j, and Mem0
- [RLS Rules](./src/rls_rules.md) - Detailed RLS security documentation

---

## 📄 License

MIT License
