# QueryMind Eval-Driven 迭代优化复盘

这份复盘不是只看分数，而是把 evaluation 期间真正发生的三类变化串起来看：

- Schema Governance 如何把 `schema_retrieve` 从“可调用”收口成“可锁定、可裁剪、可回写”
- SQL Governance 如何把 `run_sql` 从“自由生成”收口成“按 shape 修补、按 skeleton 冻结”
- 提示链如何把 system prompt、middleware、hook、enricher、history replay 分层，避免上下文互相污染

这版复盘的事实来源有三类：

1. 运行时装配和上下文管线，主要看 [src/QueryMind/core/evaluation/runtime.py](/root/Xihong/QueryMind/src/QueryMind/core/evaluation/runtime.py) 和 [src/QueryMind/core/agent/agent.py](/root/Xihong/QueryMind/src/QueryMind/core/agent/agent.py)
2. Schema / SQL governance 的状态机，主要看 [src/QueryMind/core/agent/governance.py](/root/Xihong/QueryMind/src/QueryMind/core/agent/governance.py)、[src/QueryMind/core/agent/sql_governance.py](/root/Xihong/QueryMind/src/QueryMind/core/agent/sql_governance.py)、[src/QueryMind/core/agent/sql_governance_shape.py](/root/Xihong/QueryMind/src/QueryMind/core/agent/sql_governance_shape.py)
3. 真实 conversation / dataset / tests，主要看 [src/conversations/1777018794339-0ejyewnby/messages/1777019091378910_000009.json](/root/Xihong/QueryMind/src/conversations/1777018794339-0ejyewnby/messages/1777019091378910_000009.json)、[src/evals/datasets/basic.yaml](/root/Xihong/QueryMind/src/evals/datasets/basic.yaml)、[src/evals/datasets/expansion.yaml](/root/Xihong/QueryMind/src/evals/datasets/expansion.yaml)、[tests/test_schema_governance.py](/root/Xihong/QueryMind/tests/test_schema_governance.py)、[tests/test_sql_governance.py](/root/Xihong/QueryMind/tests/test_sql_governance.py)

---

## 一句话总结

QueryMind 的 Eval-Driven 迭代本质上经历了三次收口：

1. 先把 schema 检索从一次性尝试，变成可跨轮传递的状态流。
2. 再把 schema 检索收紧成 lock / recap / tool hiding，逼模型从“继续找”转向“开始写 SQL”。
3. 最后把 SQL 生成从自由生成收口为“按形状修补”，并通过 AST 化 skeleton freeze 把正确骨架固定下来。

如果把曲线压成一句话，就是：

```text
40% -> 25~30% -> 65% -> 70~75% -> 85% -> 72%(50-case)
```

---

## 先看落盘链路

下面这条链路是后面所有阶段的共同底座。`EvaluationRuntime.create_session()` 会把同一套治理层同时装进评测和生产 agent；`hook` 负责把 tool result 回写到状态机；`middleware` 负责在下一个 LLM request 里注入 prompt / 裁剪工具；`enricher` 负责把上一轮已经发现的 schema / SQL 状态继续带入下一轮。

```text
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   Shared Governance Loop                                   │
│                                                                                            │
│  用户问题 / testcase query                                                                  │
│    例如：sql_002 "average and sum of subtotal for every customer"                         │
│                                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 1. Runtime 装配                                                                       │  │
│  │    EvaluationRuntime.create_session()                                                 │  │
│  │    hooks=[schema_governance.hook, sql_governance.hook]                               │  │
│  │    middlewares=[schema_governance.middleware, sql_governance.middleware]             │  │
│  │    enhancers=[schema_governance.enhancer, SchemaContextEnhancer, DefaultLlm...]      │  │
│  │    context_enrichers=[SchemaRetrieveContextEnricher]                                 │  │
│  └──────────────────────────────────────────────────────────────────────────────────────┘  │
│                                            │                                               │
│                                            ▼                                               │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 2. 请求进入 LLM 前                                                                    │  │
│  │    middleware.before_llm_request()                                                    │  │
│  │    - 读取 request.metadata                                                            │  │
│  │    - 注册 profile / conversation_id / request_id                                     │  │
│  │    - 注入 governance prompt block                                                     │  │
│  │    - 视状态注入 recap / 隐藏 schema_retrieve                                          │  │
│  └──────────────────────────────────────────────────────────────────────────────────────┘  │
│                                            │                                               │
│                                            ▼                                               │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 3. 工具执行                                                                           │  │
│  │    schema_retrieve / run_sql                                                          │  │
│  │    tool result 由 hook.after_tool() 回写状态                                           │  │
│  └──────────────────────────────────────────────────────────────────────────────────────┘  │
│                                            │                                               │
│                                            ▼                                               │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 4. 落盘到 result.metadata / context.metadata                                            │  │
│  │    schema_governance / last_schema_summary / schema_retrieve_context                  │  │
│  │    sql_governance / last_sql_summary / last_sql_shape / runtime_profile               │  │
│  └──────────────────────────────────────────────────────────────────────────────────────┘  │
│                                            │                                               │
│                                            ▼                                               │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 5. 下一轮请求                                                                         │  │
│  │    enricher 先读 turn-local snapshot，再回退到 conversation history                   │  │
│  │    让下一轮看到的是“已经收口过的状态”，不是裸消息                                     │  │
│  └──────────────────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

这条链路后面会反复出现，区别只在于每一阶段到底把哪一个状态字段写满了。

---

## 复盘总表

| 节点 | 时间 / 代表 run | 准确率变化 | 关键重构 | 主要暴露问题 |
|---|---|---:|---|---|
| 1. Baseline | 2026-04-22 / `20260422_165317_a8c9d397` | 40%，8/20，mean 0.428 | 先确认问题不是“不会找 schema”，而是“没有从检索转到 SQL 的强制收口” | `missing_sql`、`wrong_semantics`、`formatting_only` |
| 2. 检索链震荡 | 2026-04-23 ~ 2026-04-24 上午 | 25% ~ 30% | `schema_retrieve` 能跨轮传，但还没有 lock / recap / tool hiding 的闭环 | `missing_sql` 持续主导 |
| 3. Schema Governance 锁定 turn | 2026-04-24 / `20260424_154827_e6452415` | 65%，13/20，mean 0.720 | `SchemaGovernanceManager` 用 calls / empty streak / no-new streak 做锁定；middleware 注入 locked prompt 并隐藏 `schema_retrieve`；enricher 把 seed_tables 带入下一轮 | `missing_sql` 明显下降，剩余主要是 `wrong_semantics`、`wrong_result_preview` |
| 4. SQL Governance v1 | 2026-04-25 / `20260425_064414_e2662cd2` 到 `20260425_191410_fde3231e` | 75% 峰值，后续稳定在 65% ~ 75% | 引入 `SqlGovernanceProfile`、`row_grain_state`、`candidate anchor`、`turn_local_repair_mode`、`SQL Self-Check Reminder` | `wrong_result_preview`、`wrong_columns`、`wrong_order_by` |
| 5. SQL skeleton freeze + AST 化 | 2026-04-26 / `20260426_091552_9c7e063c` 到 2026-04-27 / `20260427_134912_b4d4841f` | 70% 到单轮 85% 峰值 | `sqlglot` AST 化；显式识别 window / ranking / rollup / grouping sets；validated skeleton freeze 只允许局部修补 | 主要剩 `wrong_result_preview` 和少量 `formatting_only` |
| 6. 扩展集复核 | 2026-04-28 / `20260428_085122_0315d6e9` | 72%，36/50，mean 0.680 | 没有新架构，主要是更大、更难的数据集复核 | `wrong_semantics`、`wrong_result_preview`、`wrong_columns`、`wrong_order_by` |

---

## 阶段一：Baseline，先暴露问题

**时间点**：2026-04-22  
**代表 run**：`20260422_165317_a8c9d397`  
**指标**：40%，8/20，mean 0.428

### 上一个节点暴露了什么问题

最早的评测并不是“模型不会 SQL”，而是“模型会在检索后停住”。这在 `sql_001` 这类简单过滤题上就能看出来：

- 题目明确要求 `sellstartdate IS NOT NULL`、`productline = 'T'`、`ORDER BY name`
- 但流程里没有一个强制把“检索完”推进到“立刻落 SQL”的状态收口
- `missing_sql` 因此成为最典型的失败形态

换句话说，最早的瓶颈不是单点生成质量，而是链路边界缺失。

### 做了哪些调整 / 更新

这一阶段真正做的不是“先修一个 prompt”，而是把后续所有工程改动的落点定下来：

- 不能只靠 system prompt 的口头约束，必须有 state machine
- `schema_retrieve` 的结果必须写进 request / context metadata
- prompt、middleware、hook、enricher 必须分层，而不是混在一个大 prompt 里
- 评测和生产要复用同一套治理栈，避免“线上/线下两套行为”

这也是后面 `EvaluationRuntime.create_session()` 统一挂载治理栈的原因。

### Data Loop

```text
┌────────────────────────────────────────────────────────────────────────────────────┐
│ Example query: sql_001                                                             │
│ "Return only product rows with non-null sellstartdate and productline = 'T'..."    │
│ tags = ["filtering", "null_handling", "ordering"]                                  │
│ expected_outcome.tools_called = ["schema_retrieve", "run_sql"]                     │
└────────────────────────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌────────────────────────────────────────────────────────────────────────────────────┐
│ Baseline request.metadata                                                           │
│ schema_governance = {}                                                              │
│ sql_governance = {}                                                                 │
│ schema_retrieve_context = {}                                                        │
│ schema_locked = false                                                               │
│ sql_exploration_frozen = false                                                      │
└────────────────────────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌────────────────────────────────────────────────────────────────────────────────────┐
│ LLM 可以看到 schema_retrieve，但看不到“必须立刻转 SQL”的强状态                      │
│ 结果：检索后停住 / 或者继续发散探索                                                  │
└────────────────────────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌────────────────────────────────────────────────────────────────────────────────────┐
│ missing_sql / wrong_semantics / formatting_only                                     │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### 代码依据

- 默认 schema prompt： [src/QueryMind/core/agent/governance.py](/root/Xihong/QueryMind/src/QueryMind/core/agent/governance.py)
- 默认 SQL prompt： [src/QueryMind/core/agent/sql_governance_prompt.py](/root/Xihong/QueryMind/src/QueryMind/core/agent/sql_governance_prompt.py)
- 统一 runtime 装配： [src/QueryMind/core/evaluation/runtime.py](/root/Xihong/QueryMind/src/QueryMind/core/evaluation/runtime.py)

---

## 阶段二：检索链仍在震荡

**时间点**：2026-04-23 ~ 2026-04-24 上午  
**指标区间**：25% ~ 30%

### 上一个节点暴露了什么问题

这一阶段已经不是单次停住，而是“多次探索但依然没有边界”。真实 conversation 里，`sql_002` 那类聚合题会先经过检索，再因为没找到表而继续尝试，最后直接转 SQL：

- 第一次 `schema_retrieve`：`query="sales order header subtotal customer salesperson"`，`search_mode="hybrid"`，`total_results=0`
- 第二次 `schema_retrieve`：`query="sales order header"`，`search_mode="vector"`，`total_results=0`
- 然后直接 `run_sql`，落到 `sales.salesorderheader`

这说明链路已经“有状态”，但还没有“有治理”。

### 做了哪些调整 / 更新

这一阶段开始把上下文组装从“单层提示”推到“可写回、可复用”的结构化管线：

- `Agent._build_live_schema_snapshot()` 会把 `schema_retrieve` 的 tool result 转成 `last_schema_summary` 和 `schema_retrieve_context`
- `SchemaRetrieveContextEnricher` 先读 `context.metadata["last_schema_summary"]` / `schema_retrieve_context`，再回退到 conversation history
- `schema_retrieve_context` 里明确写入 `seed_tables`、`expand_mode`、`last_query`、`last_search_mode`、`graph_hint`、`schema_locked`
- `SchemaContextEnhancer` 会在 system prompt 里追加搜索模式规则，但如果 `schema_locked` 为 true 就不再补 search rules

这一步还没有 lock，但已经把“上一轮检索结果”显式塞回下一轮了。

### Data Loop

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ Example conversation: 1777018794339-0ejyewnby                                               │
│ User query: "average and sum of subtotal for every customer..."                              │
│ Tool trace:                                                                                  │
│   1) search_saved_correct_tool_uses                                                           │
│   2) schema_retrieve(query="sales order header subtotal customer salesperson", hybrid)      │
│      -> total_results=0                                                                      │
│   3) schema_retrieve(query="sales order header", vector)                                    │
│      -> total_results=0                                                                      │
│   4) run_sql(SELECT customerid, salespersonid, AVG(subtotal) ... GROUP BY ... ORDER BY ...) │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ 真实落盘的 schema snapshot                                                                   │
│ last_schema_summary = {                                                                      │
│   query: "sales order header subtotal customer salesperson",                                 │
│   search_mode: "hybrid",                                                                     │
│   total_results: 0,                                                                          │
│   selected_tables: [],                                                                       │
│   schema_locked: false,                                                                     │
│   lock_reason: null,                                                                         │
│   summary_text: "schema_retrieve[hybrid] query='...' -> 0 table(s)"                        │
│ }                                                                                            │
│ schema_retrieve_context = {                                                                  │
│   seed_tables: [],                                                                           │
│   seed_table_refs: [],                                                                       │
│   expand_mode: false,                                                                        │
│   last_query: "sales order header subtotal customer salesperson",                            │
│   last_search_mode: "hybrid",                                                                │
│   graph_hint: "none",                                                                        │
│   required_fields: [],                                                                       │
│   domain_filter: null,                                                                       │
│   schema_locked: false,                                                                      │
│   lock_reason: null                                                                          │
│ }                                                                                            │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 代码依据

- turn-local snapshot 构造： [src/QueryMind/core/agent/agent.py](/root/Xihong/QueryMind/src/QueryMind/core/agent/agent.py)
- turn-local schema context enricher： [src/QueryMind/core/enricher/schema_retrieve.py](/root/Xihong/QueryMind/src/QueryMind/core/enricher/schema_retrieve.py)
- history fallback 与 explicit summary 优先级： [tests/test_schema_governance.py](/root/Xihong/QueryMind/tests/test_schema_governance.py)

---

## 阶段三：Schema Governance 锁定 turn

**时间点**：2026-04-24  
**代表 run**：`20260424_154827_e6452415`  
**指标**：65%，13/20，mean 0.720

### 上一个节点暴露了什么问题

前一阶段的问题已经很明确：schema 检索太自由，导致模型会继续“想再找找看”。

真正需要修的是：

- 空结果 / 无新增表的状态没有被利用
- 相近 query 会反复打同一条搜索链
- 明明已经足够推进 SQL draft 了，模型还是保持探索惯性

### 做了哪些调整 / 更新

这一阶段把 Schema Governance 变成了真正的状态机，落点非常具体：

- `SchemaGovernanceState` 开始维护 conversation-scoped 状态字段
  - `schema_retrieve_calls`
  - `schema_retrieve_successes`
  - `schema_retrieve_failures`
  - `consecutive_same_query_calls`
  - `consecutive_no_new_tables`
  - `consecutive_empty_results`
  - `schema_locked`
  - `lock_reason`
- `observe_schema_result()` 每次 tool result 后都会更新这些计数器
- `_update_lock_state()` 会按阈值锁定：
  - `schema_retrieve_successes_to_lock=2`
  - `schema_retrieve_empty_results_limit=2`
  - `schema_retrieve_no_new_tables_limit=2`
  - `schema_retrieve_max_calls=3`
  - `schema_retrieve_max_failures=2`
  - `schema_retrieve_same_query_limit=2`
- `build_request_metadata()` 会把 `schema_governance` 和 `last_schema_summary` 写回 request.metadata
- `build_prompt_block()` 在 `schema_locked=true` 时切到 `DEFAULT_SCHEMA_GOVERNANCE_LOCKED_PROMPT`
- `should_hide_schema_tool()` 会直接把 `schema_retrieve` 从 tools 列表里裁掉
- `SchemaGovernanceMiddleware.before_llm_request()` 会把这些变化同步到本轮 request

### 这个阶段解决了什么

它解决的不是“找得更准”，而是“什么时候必须停”。

锁定之后：

- `schema_retrieve` 不再是主循环工具
- system prompt 直接切换到 SQL draft mode
- `allow_metadata_query` 只在 `schema_retrieve_empty_results` 这类特殊锁定里单独放行
- `missing_sql` 明显下降

### Data Loop

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ Example query: sql_002                                                                       │
│ "calculate the total freight paid by each customer..."                                       │
│ profile tags = ["aggregation", "grouping", "ordering"]                                      │
│ expected outcome tools = ["schema_retrieve", "run_sql"]                                      │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ SchemaGovernancePolicy                                                                       │
│ schema_retrieve_max_calls = 3                                                                │
│ schema_retrieve_successes_to_lock = 2                                                        │
│ schema_retrieve_empty_results_limit = 2                                                      │
│ schema_retrieve_no_new_tables_limit = 2                                                      │
│ schema_retrieve_same_query_limit = 2                                                         │
│ recap_trigger_ratio = 0.7                                                                    │
│ recap_min_tool_iterations = 4                                                                │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ After two empty schema_retrieve calls                                                         │
│ schema_retrieve_calls = 2                                                                     │
│ consecutive_empty_results = 2                                                                 │
│ consecutive_no_new_tables = 2                                                                 │
│ schema_locked = true                                                                          │
│ lock_reason = "schema_retrieve_empty_results"                                                │
│ allow_metadata_query = true                                                                   │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ request.metadata                                                                              │
│ schema_governance = {                                                                         │
│   schema_locked: true,                                                                        │
│   lock_reason: "schema_retrieve_empty_results",                                               │
│   last_schema_query: "...",                                                                   │
│   consecutive_empty_results: 2,                                                              │
│   consecutive_no_new_tables: 2                                                                │
│ }                                                                                             │
│ last_schema_summary.summary_text = "schema_retrieve[hybrid] query='...' -> 0 table(s)"      │
│ system_prompt gains locked block:                                                             │
│   - schema_locked: true                                                                       │
│   - `schema_retrieve` is locked for this turn                                                 │
│   - Enter SQL draft mode now                                                                  │
│ tools list: schema_retrieve removed                                                           │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ 模型只能开始写 SQL，不能继续把检索当主任务                                                   │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 代码依据

- 状态机与阈值： [src/QueryMind/core/agent/governance.py](/root/Xihong/QueryMind/src/QueryMind/core/agent/governance.py)
- lock prompt / tool hiding： [src/QueryMind/core/middleware/schema_governance.py](/root/Xihong/QueryMind/src/QueryMind/core/middleware/schema_governance.py)
- schema lock prompt enhancer： [src/QueryMind/core/enhancer/schema_governance.py](/root/Xihong/QueryMind/src/QueryMind/core/enhancer/schema_governance.py)
- 相关单测： [tests/test_schema_governance.py](/root/Xihong/QueryMind/tests/test_schema_governance.py)

---

## 阶段四：SQL Governance v1

**时间点**：2026-04-25  
**代表 run**：`20260425_064414_e2662cd2` 到 `20260425_191410_fde3231e`  
**指标**：75% 峰值，后续稳定在 65% ~ 75%

### 上一个节点暴露了什么问题

Schema Governance 把模型推到了 SQL 阶段，但新的问题马上出现：

- 模型能写 SQL，但经常写错 shape
- 典型偏差集中在 `wrong_result_preview`、`wrong_columns`、`wrong_order_by`
- 更准确地说，问题不是“有没有 SQL”，而是“SQL 的骨架是不是对的”

### 做了哪些调整 / 更新

这一阶段把 SQL 视为“可描述的形状”，并把修补逻辑落到非常明确的 state 字段里：

- `SqlGovernanceProfile`
  - 由 query / tags / category 推断任务类型
  - `build_sql_governance_profile()` 会把 `window`、`aggregation`、`grouping`、`join`、`ordering`、`subquery`、`set_operation`、`time_series` 等类别写进 profile
- `register_request_profile()`
  - 读取 `sql_governance_profile` / `sql_profile` / `runtime_profile`
  - 更新 `profile_signature`
  - 计算 `sql_family`
  - 计算 `sql_family_candidates`
  - 计算 `row_grain_state`
- `observe_sql_result()`
  - 调 `analyze_sql_text()` 做 shape 分析
  - 写入 `last_sql_features`
  - 写入 `last_sql_signature` / `last_sql_core_signature` / `last_sql_canonical_signature`
  - 计算 `last_gap_categories`
  - 维护 `best_sql_*`
  - 维护 `same_success_sql_canonical_streak`
  - 维护 `last_rejection_reason_count`
- `turn_local_repair_mode`
  - 当 anchor 已经足够稳定、row grain aligned、且同一 canonical 成功或同类 rejection 连续出现时打开
- `build_sql_governance_prompt_block()`
  - 追加 `Candidate anchor` / `Validated anchor`
  - 告诉模型只允许 local fix
- `build_sql_governance_recap_block()`
  - 用 `row_grain_state` 和 `sql_family` 生成更具体的 self-check reminder

### 这个阶段解决了什么

它解决的是“生成 SQL 之后没有局部修补能力”的问题。

过去模型往往会整体重写，结果把已经正确的部分也改坏。现在则改成：

1. 先识别任务 profile
2. 再识别 missing gap categories
3. 再针对 gap 做局部修补

### Data Loop

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ Example query: sql_002                                                                       │
│ "calculate the total freight paid by each customer..."                                       │
│ tags = ["aggregation", "grouping", "ordering"]                                              │
│ ground_truth_sql = SELECT customerid, salespersonid, AVG(subtotal) AS average, SUM(...)     │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ request.metadata.sql_governance_profile                                                       │
│ source = "case"                                                                               │
│ categories = ["aggregation", "grouping", "ordering"]                                         │
│ notes = ["manual"]                                                                            │
│ allow_metadata_query = false                                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ register_request_profile()                                                                    │
│ sql_family = "aggregation"                                                                   │
│ sql_family_candidates = ["aggregation", "grouping"]                                          │
│ row_grain_state = {                                                                           │
│   expected: "grouped",                                                                        │
│   observed: "detail" or "grouped",                                                           │
│   status: "mismatch" or "aligned",                                                            │
│   reason: "grouped output is still at detail grain" / "aligned"                              │
│ }                                                                                             │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ build_sql_governance_prompt_block() / build_sql_governance_recap_block()                      │
│ - Avoid metadata introspection queries unless explicitly allowed                              │
│ - Keep the current row grain stable and call run_sql once the table path is clear            │
│ - Candidate anchor for the aggregation family:                                               │
│   SELECT customerid, salespersonid, AVG(subtotal) AS average, SUM(subtotal) AS sum ...       │
│ - If turn_local_repair_mode=true, only repair the last drift                                  │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ run_sql -> observe_sql_result() -> best_sql_support_count += 1                                │
│ next turn can repair locally instead of rewriting the whole SQL                               │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 代码依据

- profile / family / row grain 推断： [src/QueryMind/core/agent/sql_governance_shape.py](/root/Xihong/QueryMind/src/QueryMind/core/agent/sql_governance_shape.py)
- 状态机 / best_sql / repair mode： [src/QueryMind/core/agent/sql_governance.py](/root/Xihong/QueryMind/src/QueryMind/core/agent/sql_governance.py)
- prompt / recap 具体措辞： [src/QueryMind/core/agent/sql_governance_prompt.py](/root/Xihong/QueryMind/src/QueryMind/core/agent/sql_governance_prompt.py)
- 相关单测： [tests/test_sql_governance.py](/root/Xihong/QueryMind/tests/test_sql_governance.py)

---

## 阶段五：SQL skeleton freeze + AST 化

**时间点**：2026-04-26 ~ 2026-04-27  
**代表 run**：`20260426_091552_9c7e063c` 到 `20260427_134912_b4d4841f`  
**指标**：70% -> 单轮 85% 峰值

### 上一个节点暴露了什么问题

SQL Governance v1 已经能修补，但还有一个根问题没解决：模型在修补时仍然可能把“正确骨架”改坏。

这在复杂任务里尤其常见：

- window / ranking
- rollup / grouping sets
- 多阶段 aggregation
- 看起来对，但 skeleton 已经漂移

### 做了哪些调整 / 更新

这一阶段的重点不是更强的 prompt，而是更强的结构约束：

- 解析层切到 `sqlglot`
- `sql_governance_shape.py` 用 dialect-aware AST 做分析，而不是靠字符串正则猜
- `analyze_sql_text()` 显式抽取：
  - `has_over`
  - `has_partition_by`
  - `has_window_function`
  - `has_navigation_window_function`
  - `has_ranking_window_function`
  - `has_rollup`
  - `has_grouping_sets`
  - `has_grouping`
  - `has_subquery`
  - `has_set_operation`
  - `has_time_series`
  - `window_function_names`
  - `feature_names`
- `_shape_family_signature()` / `_shape_signature_from_features()` 建立 canonical signature
- `register_request_profile()` + `observe_sql_result()` 把 `best_sql_*` 逐步推进到 `validated`
- `freeze_trigger_ratio=0.65`、`freeze_min_tool_iterations=8`、`freeze_min_best_sql_support=2`
- 当 `anchor_tier=="validated"`、`row_grain_state.status=="aligned"`、`best_sql_support_count>=2` 且达到工具轮次阈值时，冻结 validated skeleton
- `SqlGovernanceHook` 把 snapshot 写回 `result.metadata`
- `SqlGovernanceMiddleware` 在冻结后只允许局部修补，并在必要时发 recap

### 这个阶段解决了什么

它解决的是“生成可以修补，但不能把骨架修坏”的问题。

也就是：

- 先保住 FROM / JOIN / GROUP / OVER 的主干
- 再允许局部修边
- 不再把整个 SQL 当成一坨字符串重写

### Data Loop

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ Example query: sql_003                                                                       │
│ "find the sum, average, count, minimum, and maximum order quantity..."                       │
│ tags = ["window", "aggregation", "filtering"]                                                │
│ ground_truth_sql includes OVER / PARTITION BY                                                │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ analyze_sql_text(sql, dialect="postgres")                                                    │
│ has_over = true                                                                              │
│ has_window_function = true                                                                   │
│ has_partition_by = true                                                                      │
│ window_function_names = ["SUM", "AVG", "COUNT", "MIN", "MAX"]                                │
│ feature_names = [...]                                                                        │
│ last_sql_signature / last_sql_core_signature / last_sql_canonical_signature are populated    │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ Freeze decision                                                                              │
│ freeze_trigger_ratio = 0.65                                                                  │
│ freeze_min_tool_iterations = 8                                                               │
│ freeze_min_best_sql_support = 2                                                               │
│ example: max_tool_iterations = 25 -> freeze_threshold = 16                                   │
│ if last_tool_iterations = 23, best_sql_support_count >= 2, anchor_tier = validated          │
│ then sql_exploration_frozen = true                                                           │
│ freeze_reason = "Validated SQL skeleton frozen at 23/25 tool iterations"                    │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ Frozen prompt block                                                                          │
│ - A validated SQL skeleton is frozen for this turn                                           │
│ - Keep the current FROM/JOIN/GROUP/OVER shape stable and only make local fixes               │
│ - Frozen anchor: SELECT ... OVER (...) ...                                                   │
│ - Do not restart schema exploration                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ 后续只允许 local fix，骨架漂移会被 hook / middleware 拦回                                     │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 代码依据

- AST / canonical signature / shape analysis： [src/QueryMind/core/agent/sql_governance_shape.py](/root/Xihong/QueryMind/src/QueryMind/core/agent/sql_governance_shape.py)
- freeze decision / anchor tier / metadata snapshot： [src/QueryMind/core/agent/sql_governance.py](/root/Xihong/QueryMind/src/QueryMind/core/agent/sql_governance.py)
- frozen prompt / recap block： [src/QueryMind/core/agent/sql_governance_prompt.py](/root/Xihong/QueryMind/src/QueryMind/core/agent/sql_governance_prompt.py)
- hook / middleware： [src/QueryMind/core/hook/sql_governance.py](/root/Xihong/QueryMind/src/QueryMind/core/hook/sql_governance.py)、[src/QueryMind/core/middleware/sql_governance.py](/root/Xihong/QueryMind/src/QueryMind/core/middleware/sql_governance.py)
- 相关单测： [tests/test_sql_governance.py](/root/Xihong/QueryMind/tests/test_sql_governance.py)

---

## 阶段六：扩展集复核

**时间点**：2026-04-28  
**代表 run**：`20260428_085122_0315d6e9`  
**指标**：66%，33/50，mean 0.680

### 这一阶段说明了什么

扩展集不是“回到原点”，而是“换一个更难的验证面”。

相比 basic 20-case，50-case expansion 把更多语义边界拉了出来：

- `set_operation`
- `comparison`
- `null_handling`
- `time_series`
- `cte`
- `ordering`
- `topk`

因此 66% 应该解释成“泛化复核”，而不是和 85% 直接硬比。

### 这一步暴露了什么问题

扩展集里重新凸显的是语义层，而不是 skeleton 层：

- `wrong_semantics`
- `wrong_result_preview`
- `wrong_columns`
- `wrong_order_by`

这说明 SQL Governance 已经能稳定保住骨架，但复杂语义的分类还会继续暴露边界。

### 做了哪些调整 / 更新

这一阶段没有新架构，主要是把已有治理栈放到更难的数据面上复核：

- `build_sql_governance_profile()` 已经覆盖了 `set_operation`、`time_series`、`comparison`、`null_handling` 这类信号
- `analyze_sql_text()` 也已经能识别 `has_set_operation`、`has_time_series`、`has_grouping_sets` 等 shape
- 但 expansion 的查询会更频繁地考验“语义是否足够完整”，而不是“有没有正确骨架”

### Data Loop

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ Example query: sql_126                                                                       │
│ "sort the BusinessEntityID in descending order for salaried employees..."                    │
│ tags = ["ordering", "case_when"]                                                             │
│ ground_truth_sql uses CASE WHEN in ORDER BY                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ profile inference                                                                           │
│ categories = ["ordering"]                                                                   │
│ notes = ["ordering", "case_when"]                                                           │
│ sql_family = "ordering"                                                                     │
│ row_grain_state.expected = "detail"                                                         │
│ row_grain_state.status = "aligned"                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ 同一套 governance 仍然生效                                                                   │
│ 但更复杂的 CASE / NULL / UNION / TIME semantics 会重新暴露 wrong_semantics                  │
│ 这不是新架构问题，而是数据面比 basic 更难                                                   │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 代码依据

- profile inference： [src/QueryMind/core/agent/sql_governance_prompt.py](/root/Xihong/QueryMind/src/QueryMind/core/agent/sql_governance_prompt.py)
- shape analysis： [src/QueryMind/core/agent/sql_governance_shape.py](/root/Xihong/QueryMind/src/QueryMind/core/agent/sql_governance_shape.py)
- dataset 说明： [src/evals/datasets/expansion.yaml](/root/Xihong/QueryMind/src/evals/datasets/expansion.yaml)

---

## 三条主线如何彼此咬合

### 1. Schema Governance 负责“什么时候停”

它解决的是搜索链条的边界问题：

- 没有 lock，模型会一直找
- 有 lock，模型必须开始写 SQL

在代码里，这条线由 `SchemaGovernanceManager` 负责状态统计，由 `SchemaGovernanceMiddleware` 负责请求时裁剪，由 `SchemaRetrieveContextEnricher` 负责把上一轮检索状态写进下一轮上下文。

### 2. SQL Governance 负责“写什么形状”

它解决的是 SQL 生成的结构问题：

- 不是单纯生成一条 SQL
- 而是按 profile、row grain、shape 来修补

在代码里，这条线由 `SqlGovernanceManager` 负责 profile / anchor / freeze / recap，由 `SqlGovernanceHook` 把 tool result 回写进状态机，由 `SqlGovernanceMiddleware` 在下一轮注入 prompt 和 recap。

### 3. 提示链构造负责“把状态放在哪里”

它解决的是上下文如何组织的问题：

- system prompt 负责总规则
- middleware 负责 turn 级收紧
- enricher 负责把上一轮结果传给下一轮
- history replay 负责把真实轨迹重新灌回上下文

这三条线叠在一起，才形成真正的 Eval-Driven Loop。

### 总体 Data Loop

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ 用户问题 / testcase query                                                                    │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ Schema Retrieve / Expand Loop                                                                │
│  - 找表、找关系                                                                              │
│  - 写回 schema_governance / last_schema_summary / schema_retrieve_context                   │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                          │
                  达到 lock / recap
                          ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ SQL Governance Loop                                                                          │
│  - 识别 profile / shape / row grain                                                         │
│  - 维护 best_sql / anchor_tier / turn_local_repair_mode                                     │
│  - 冻结 validated skeleton，只允许局部修补                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ run_sql / judge                                                                              │
│  - 产出执行结果、preview、score                                                               │
│  - 写回 sql_governance / last_sql_summary / last_sql_shape                                   │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ 回写 conversation / metadata                                                                 │
│ 进入下一轮 prompt / recap / lock / freeze                                                     │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 模型 / 配置干扰项

这部分非常重要，因为它决定了复盘结论的边界。

### 1. 4/26 的 provider sweep 证明模型差异很大

同一批任务，不同模型表现差异非常明显。历史结果里：

- `gpt5.4` 明显偏低
- `minimax` 也偏低
- `deepseek-v4-pro` 居中
- `deepseek-v4-flash` 在代码收紧后能跑出更高峰值

这说明后半段的涨幅不能全部算到代码上。

### 2. 50-case 扩展集比 20-case basic 更难

72% 是在更难数据集上的复核结果，所以它更适合被解释为“泛化验证”，而不是简单的“退步”。

### 复盘原则

以后看这条曲线时，建议这样拆：

- 代码重构收益：Schema Governance、SQL Governance、AST freeze
- 配置收益：模型切换、judge 切换、并发变化
- 数据收益：basic 20-case 和 expansion 50-case 难度不同

---

## 关键源码位置

下面这些位置基本覆盖了这次 Eval-Driven 迭代的主干：

- [src/my_agent.py](/root/Xihong/QueryMind/src/my_agent.py)
- [src/QueryMind/core/evaluation/runtime.py](/root/Xihong/QueryMind/src/QueryMind/core/evaluation/runtime.py)
- [src/QueryMind/core/agent/agent.py](/root/Xihong/QueryMind/src/QueryMind/core/agent/agent.py)
- [src/QueryMind/core/agent/governance.py](/root/Xihong/QueryMind/src/QueryMind/core/agent/governance.py)
- [src/QueryMind/core/middleware/schema_governance.py](/root/Xihong/QueryMind/src/QueryMind/core/middleware/schema_governance.py)
- [src/QueryMind/core/enricher/schema_retrieve.py](/root/Xihong/QueryMind/src/QueryMind/core/enricher/schema_retrieve.py)
- [src/QueryMind/core/agent/sql_governance.py](/root/Xihong/QueryMind/src/QueryMind/core/agent/sql_governance.py)
- [src/QueryMind/core/agent/sql_governance_prompt.py](/root/Xihong/QueryMind/src/QueryMind/core/agent/sql_governance_prompt.py)
- [src/QueryMind/core/agent/sql_governance_shape.py](/root/Xihong/QueryMind/src/QueryMind/core/agent/sql_governance_shape.py)
- [src/QueryMind/core/middleware/sql_governance.py](/root/Xihong/QueryMind/src/QueryMind/core/middleware/sql_governance.py)
- [src/QueryMind/core/hook/schema_governance.py](/root/Xihong/QueryMind/src/QueryMind/core/hook/schema_governance.py)
- [src/QueryMind/core/hook/sql_governance.py](/root/Xihong/QueryMind/src/QueryMind/core/hook/sql_governance.py)
- [src/QueryMind/core/system_prompt/default.py](/root/Xihong/QueryMind/src/QueryMind/core/system_prompt/default.py)

---

## 建议的读法

如果你要把这段历程讲给别人听，最稳的顺序是：

1. 先讲 baseline 暴露了什么问题
2. 再讲 schema lock 为什么是第一个分水岭
3. 接着讲 SQL Governance 为什么是第二个分水岭
4. 最后讲 AST freeze 为什么是第三个分水岭
5. 结尾一定要补上模型 / 配置 / 数据集的干扰项

这样讲，逻辑会比单纯报分数更完整，也更能解释为什么曲线不是严格单调上升。
