# QueryMind RLS 规则说明文档

## 概述

本文档说明 `RLSToolRegistry` 实现的 **SQL注入防护** 和 **Territory-Based RLS** 规则的详细设计。

---

## 一、SQL注入防护规则

### 1.1 防护原理

SQL注入防护通过**正则表达式模式匹配**实现。当用户提交的SQL包含禁止的模式时，直接拒绝执行。

### 1.2 允许与禁止模式详解

RLS 现在不是把所有系统目录访问都一刀切拦掉，而是先放行 QueryMind 需要的**只读元数据查询**，再对其它高风险模式继续拦截。

#### 1.2.1 允许的只读元数据查询

| 类别 | 模式 | 说明 | 用途 |
|------|------|------|------|
| **PostgreSQL 元数据** | `information_schema.tables` / `columns` / `table_constraints` / `key_column_usage` / `referential_constraints` / `schemata` / `views` / `routines` / `parameters` | 只读 schema introspection | schema 初始化、表列表、字段信息 |
| **PostgreSQL catalog** | `pg_namespace` / `pg_database` / `pg_tables` / `pg_indexes` / `pg_class` / `pg_attribute` / `pg_constraint` / `pg_type` | 只读 catalog introspection | schema discovery、库/表/索引枚举 |

这些白名单只放行“元数据探测”这一类查询，不会绕过其它注入规则。

#### 1.2.2 仍然禁止的高风险模式

| 类别 | 模式 | 说明 | 攻击示例 |
|------|------|------|----------|
| **注释注入** | `;--` | 注释掉后续语句 | `SELECT * FROM users;-- WHERE admin=1` |
| **块注释** | `/\*.*\*/` | 块注释包裹恶意内容 | `SELECT * /* WHERE 1=1 */ FROM users` |
| **DDL语句** | `;\s*(DROP\|DELETE\|TRUNCATE\|ALTER\|CREATE)` | 分号终止后跟破坏性DDL | `SELECT * FROM users; DROP TABLE users` |
| **DML语句** | `;\s*(INSERT\|UPDATE\|REPLACE)` | 分号终止后跟数据修改 | `SELECT * FROM users; UPDATE users SET admin=1` |
| **UNION注入** | `UNION\s+(ALL\s+)?SELECT` | UNION联合查询注入 | `SELECT * FROM users UNION SELECT * FROM passwords` |
| **堆叠查询** | `;\s*;` | 双重分号尝试执行多条语句 | `SELECT * FROM users;; DROP TABLE users` |
| **系统目录** | `(pg_\|pg_catalog\|information_schema\|sys\.)` | 非白名单的系统目录访问仍会被拦截 | `SELECT * FROM pg_shadow` |
| **XP存储过程** | `xp_` | SQL Server扩展存储过程 | `EXEC xp_cmdshell 'dir'` |
| **执行函数** | `(EXEC\|EXECUTE)\s*\(` | 执行函数/过程 | `EXECUTE sp_executesql` |
| **文件操作** | `(LOAD_FILE\|INTO\s+OUTFILE\|INTO\s+DUMPFILE)` | 文件读写 | `SELECT * INTO OUTFILE '/tmp/data.txt'` |
| **时间盲注** | `(SLEEP\(\|BENCHMARK\()` | 时间延迟注入 | `SELECT * FROM users WHERE id=1 AND SLEEP(5)` |
| **HEX编码** | `0x[0-9a-f]+` | 十六进制编码绕过 | `SELECT 0x73656c656374` (= 'select') |

### 1.3 触发逻辑

```
用户提交SQL 
    ↓
detect_sql_injection(sql)
    ↓
命中 allowlist metadata?
    ├─ 是：跳过“系统目录”黑名单检查，继续检查其它规则
    └─ 否：正常进入黑名单遍历
    ↓
遍历 forbidden_patterns 配置
    ↓
任一正则匹配 → 返回 ToolRejection → 拒绝执行
    ↓
全部不匹配 → 继续处理
```

### 1.4 示例

```python
# 用户提交恶意SQL
sql = "SELECT * FROM Sales.SalesOrderHeader; DROP TABLE Sales.SalesOrderHeader--"

# detect_sql_injection() 检测
# 匹配模式: ";\s*(DROP|Delete|TRUNCATE|ALTER|CREATE)"
# 匹配结果: True (发现 "; DROP")
# 返回: ToolRejection(reason="Statement termination followed by destructive DDL")

# 执行结果: Query rejected - SQL rejected: Statement termination followed by destructive DDL
```

#### 1.4.1 允许的元数据查询示例

```python
# QueryMind schema discovery 依赖的只读查询
sql = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"

# 结果:
# - 命中 allowed_metadata_patterns
# - 不会被系统目录黑名单拦截
# - 仍会继续检查其它注入规则（例如 UNION / DDL / DML）
```

#### 1.4.2 仍会被拦截的示例

```python
sql = "SELECT * FROM pg_shadow"

# 结果:
# - 不命中 allowlist
# - 命中系统目录黑名单
# - 返回 ToolRejection(reason=\"Direct system catalog access attempt\")
```

---

## 二、Territory-Based RLS (行级安全)

### 2.1 设计原理

基于用户的**组 memberships** 映射到可访问的 **Sales TerritoryID** 列表，SQL查询自动被改写添加 `WHERE TerritoryID IN (...)` 条件。

### 2.2 AdventureWorks Territory结构

| TerritoryID | 名称 | 地区组 |
|-------------|------|--------|
| 1, 2, 3 | Northwest | 美国西北部 |
| 4, 5, 6 | Northeast | 美国东北部 |
| 7, 8, 9 | Southwest | 美国西南部 |
| 10 | Canada | 加拿大 |

### 2.3 用户组 → Territory 映射

```yaml
group_territory_mapping:
  # 销售区域经理 - 访问其管辖区域
  sales_west: [1, 2, 3, 7, 8, 9]      # 西部: 西北+西南
  sales_central: [4, 5, 6, 10]        # 中部+加拿大
  
  # 按具体区域划分
  sales_northwest: [1, 2, 3]
  sales_southwest: [7, 8, 9]
  sales_northeast: [4, 5, 6]
  sales_canada: [10]
  
  # 管理/分析/财务 - 全访问
  sales_manager: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  admin: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  analytics: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  finance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  
  # User - 普通用户仅能访问美国本土(不含Canada)
  user: [1, 2, 3, 4, 5, 6, 7, 8, 9]
  
  # Guest - 无访问权限
  guest: []
```

### 2.4 受保护的表

| 表名 | Territory列 | 说明 |
|------|-------------|------|
| `Sales.SalesOrderHeader` | TerritoryID | 主订单表 - 直接关联 |
| `Sales.SalesTerritory` | TerritoryID | 区域参考表 |
| `Sales.Customer` | TerritoryID | 客户表 |
| `Sales.SalesPerson` | TerritoryID | 销售员表 |
| `Sales.SalesOrderDetail` | (通过JOIN) | 订单明细 - 通过Header关联 |
| `Sales.SalesPersonQuotaHistory` | (通过JOIN) | 销售配额历史 |
| `Sales.SalesTerritoryHistory` | TerritoryID | 区域分配历史 |

### 2.5 触发逻辑

```
用户提交SQL: SELECT * FROM Sales.SalesOrderHeader
    ↓
should_apply_rls(sql)?
    ├─ territory_rls.enabled == true?
    ├─ SQL以SELECT开头?
    └─ 查询包含受保护的表名?
    ↓ (全部满足)
_apply_territory_rls(sql, user)
    ↓
_get_user_territories(user)
    ├─ 获取 user.group_memberships: ["sales_northwest", "reporting"]
    └─ 查表映射: ["sales_northwest"] → [1, 2, 3]
    ↓
SQL改写: SELECT * FROM Sales.SalesOrderHeader 
         → SELECT * FROM Sales.SalesOrderHeader 
           WHERE TerritoryID IN (1, 2, 3) OR TerritoryID IS NULL
    ↓
返回改写后的SQL
```

### 2.6 示例

#### 示例1: Northwest区域销售员查询

```python
# 用户信息
user = User(
    id="user_001",
    username="john_doe",
    group_memberships=["sales_northwest"]
)

# 提交的SQL
sql = "SELECT * FROM Sales.SalesOrderHeader WHERE OrderDate > '2024-01-01'"

# RLS处理后
# territories = [1, 2, 3]
# 
# 改写为:
# SELECT * FROM Sales.SalesOrderHeader 
# WHERE OrderDate > '2024-01-01' 
#   AND (TerritoryID IN (1, 2, 3) OR TerritoryID IS NULL)
```

#### 示例2: 经理查询 (全区域访问)

```python
# 用户信息
user = User(
    id="manager_001", 
    username="manager_smith",
    group_memberships=["sales_manager"]
)

# 提交的SQL
sql = "SELECT * FROM Sales.SalesOrderHeader"

# RLS处理后
# territories = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
#
# 改写为:
# SELECT * FROM Sales.SalesOrderHeader 
# WHERE TerritoryID IN (1,2,3,4,5,6,7,8,9,10) OR TerritoryID IS NULL
```

#### 示例3: Guest用户 (无权限)

```python
# 用户信息
user = User(
    id="guest_001",
    username="guest_user", 
    group_memberships=["guest"]
)

# 提交的SQL
sql = "SELECT * FROM Sales.SalesOrderHeader"

# RLS处理后
# territories = [] (空列表)
#
# 改写为:
# SELECT * FROM Sales.SalesOrderHeader WHERE 1=0
# (1=0条件确保返回空结果)
```

---

## 三、User如何触发RLS

### 3.1 User模型结构

```python
class User(BaseModel):
    id: str                    # 用户唯一标识
    username: Optional[str]    # 用户名
    email: Optional[str]       # 邮箱
    group_memberships: List[str]  # ← 关键字段！决定RLS权限
    metadata: Dict[str, Any]    # 额外元数据
```

### 3.2 触发流程图

```
┌─────────────────────────────────────────────────────────────┐
│                         User                                │
│  group_memberships: ["sales_northwest", "analytics"]         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              RLSToolRegistry.transform_args()                │
│                                                              │
│  1. 检测工具类型: tool.name == "run_sql"                    │
│  2. 获取args.sql: "SELECT * FROM Sales.SalesOrderHeader"   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   SQL Injection Check                       │
│  _detect_sql_injection(sql) → None (通过)                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Query Complexity Check                     │
│  _validate_query_complexity(sql) → None (通过)              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Territory-Based RLS Check                      │
│                                                              │
│  _should_apply_rls(sql)?                                     │
│    ✓ territory_rls.enabled                                  │
│    ✓ SQL是SELECT                                            │
│    ✓ 涉及受保护表(Sales.SalesOrderHeader)                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Apply RLS Transformation                        │
│                                                              │
│  _get_user_territories(user)                                │
│    group_memberships: ["sales_northwest", "analytics"]      │
│    → sales_northwest: [1, 2, 3]                            │
│    → analytics: [1,2,3,4,5,6,7,8,9,10]                     │
│    → 合并去重: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]             │
│                                                              │
│  SQL改写: WHERE TerritoryID IN (1,2,3,4,5,6,7,8,9,10)      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Return Transformed args                         │
│  args.sql = "SELECT * FROM Sales.SalesOrderHeader          │
│              WHERE TerritoryID IN (1,2,3,4,5,6,7,8,9,10)"   │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 多组合并逻辑

```python
# 用户属于多个组时，权限是合并的(并集)

user.group_memberships = ["sales_northwest", "sales_canada"]

# 查表映射:
# sales_northwest → [1, 2, 3]
# sales_canada → [10]

# 合并: [1, 2, 3, 10]

# 结果: 该用户可以访问 Northwest 和 Canada 区域的订单
```

---

## 四、查询复杂度限制

| 限制项 | 默认值 | 说明 |
|--------|--------|------|
| max_query_length | 10000 | SQL字符串最大长度 |
| max_subqueries | 5 | 嵌套SELECT子查询数量 |
| max_cte_depth | 3 | WITH CTE的最大数量 |
| max_joins | 15 | JOIN子句的最大数量 |

---

## 五、审计日志

以下操作会被记录:

```yaml
audit:
  log_sql_transformations: true   # RLS SQL改写记录
  log_rejected_queries: true     # 被拒绝的查询
  log_rls_blocks: true          # RLS阻止记录
```

日志示例:
```
INFO: RLS Transformation for user user_001: territories=[1, 2, 3]
WARNING: SQL injection blocked: UNION SELECT injection - pattern: UNION\s+(ALL\s+)?SELECT
```

---

## 六、快速参考

| 场景 | 组Membership | TerritoryIDs | 查询SalesOrderHeader结果 |
|------|-------------|---------------|--------------------------|
| **Admin用户** | admin | [1,2,3,4,5,6,7,8,9,10] | 全部订单（含Canada TerritoryID=10） |
| **普通用户** | user | [1,2,3,4,5,6,7,8,9] | 仅美国本土订单（不含Canada） |
| 西北销售 | sales_northwest | [1,2,3] | 仅西北订单 |
| 西南销售 | sales_southwest | [7,8,9] | 仅西南订单 |
| 经理 | sales_manager | [1-10] | 全部订单 |
| Guest | guest | [] | 无订单(空) |
| 多组用户 | ["user","sales_canada"] | [1,2,3,4,5,6,7,8,9,10] | 美国本土+加拿大订单 |
