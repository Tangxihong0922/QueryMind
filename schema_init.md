# Schema Init 设计说明

本文档记录 `/init_schema` 的当前设计，目标是让 schema 初始化具备这三个特性：

1. 遇到确定性硬错误时，首错即停。
2. 遇到偶发限速/网络抖动时，尽量跳过继续跑。
3. 大部分 schema 都能初始化成功，同时前端能明确看到失败原因。

## 流程

1. 用户输入 `/init_schema` 或 `/init_schema force`。
2. `SchemaInitWorkflow` 拦截命令并调用 `SchemaSyncEngine.initialize()`。
3. `force` 模式只重置 `SchemaMemory` 侧数据，不影响 `AgentMemory`。
4. 引擎先拉取全部表结构，再逐表保存到 schema memory。
5. 引擎会先读取 schema memory 中已存在的表，直接跳过这些表。
6. 每张需要处理的表之间固定等待 `1s`，降低限速概率。
7. 单表保存失败时先做重试；仍失败后再根据错误类型决定继续还是中止。
8. 最终返回 `InitResult`，前端据此渲染 success / warning / error 卡片。

## 当前参数

默认参数已经在启动入口显式写死，便于联调时稳定复现：

- `request_delay = 1.0s`
- `save_retry_attempts = 3`
- `save_retry_delay = 1.0s`
- `max_consecutive_failures = 5`
- `max_consecutive_same_errors = 3`
- `max_consecutive_transient_failures = 8`
- `resume_existing_tables = True`（当前应用默认开启）

## 错误分层

### 1. Fatal

这类错误表示当前表或当前初始化流程本身有明确问题，应该立刻停：

- Neo4j Cypher 语法错误
- 配置错误
- 权限错误
- 认证失败
- 不支持的能力或参数

典型例子：

- `CypherSyntaxError`
- `Invalid input 'WHERE'`

### 2. Transient

这类错误通常是外部系统的临时波动，应该先重试，再决定是否继续：

- `429`
- rate limit
- timeout
- connection reset/refused

处理方式：

- 先重试 `3` 次
- 每次重试指数退避
- 如果连续 transient 失败达到阈值，再中止

### 3. Recoverable

这类错误一般是单表脏数据、局部异常或偶发不一致：

- 先记录错误
- 跳过当前表
- 继续处理后续表
- 如果同类错误连续出现很多次，再认为是系统性问题并中止

## 停止策略

当前不是“第一条错误就全局停止”，而是下面这套规则：

- `fatal`：首错即停
- `transient`：先重试，连续过多再停
- `recoverable`：单表跳过，连续过多再停
- `stop_on_first_error = True`：强制回到最激进的首错即停模式

这套策略的目的，是让偶发错误不打断整批 schema 初始化，同时让真正的系统性错误尽快暴露。

## 续跑机制

当前实现会把 `SchemaMemory` 里已经存在的表当成 checkpoint。

处理方式：

- 先调用 `list_tables()` 读取已存在表。
- 如果某张表已经存在，直接跳过，不再调用 embedding 服务。
- 如果某张表还不存在，继续正常保存。

这意味着：

- 今天已经成功入库的 116 张表，明天再跑 `/init_schema` 时会被自动跳过。
- 只会处理剩余未创建的表。
- 如果你想完全重跑，仍然用 `/init_schema force`。

## 返回结果语义

`InitResult` 现在多了两个字段：

- `stopped_early`：是否提前中止
- `abort_reason`：提前中止原因

另外还会记录：

- `tables_skipped_existing`：本次续跑时跳过的已存在表数量

结果展示分三类：

### Success

`success = True` 且 `error_details` 为空。

前端展示绿色成功卡片。

### Warning

`success = True` 但 `error_details` 非空。

说明初始化整体完成，但有少量表被跳过。

前端展示 warning 卡片，并附上样例错误。

### Error

`success = False`。

说明流程中止。

前端展示 error 卡片，并标明：

- 中止原因
- 已处理表数量
- 样例错误
- 是否提前中止

## 实现位置

- 初始化引擎：[`base.py`](/root/Xihong/QueryMind/src/QueryMind/capabilities/schema_extracter/base.py)
- 结果模型：[`models.py`](/root/Xihong/QueryMind/src/QueryMind/capabilities/schema_extracter/models.py)
- 前端卡片：[`schema_init_workflow.py`](/root/Xihong/QueryMind/src/QueryMind/core/workflow/schema_init_workflow.py)
- 启动入口参数：[`my_agent.py`](/root/Xihong/QueryMind/src/my_agent.py)

## 调参建议

- 如果 429 仍然很多，优先把 `request_delay` 调大。
- 如果是单个表反复报同类错误，优先修表级逻辑或上游数据。
- 如果是明显的语法/配置错误，不要继续放宽阈值，应该直接修 bug。
- 如果要做环境化配置，可以把这些阈值继续抽到环境变量里。

## 设计原则

一句话总结：**硬错误立刻停，软错误尽量绕，系统性错误再刹车。**
