# QueryMind 前后端联调指南

> 本指南帮助您启动和调试 QueryMind 的前后端服务，进行实时预览和开发迭代。

---

## 📋 目录

1. [项目架构概览](#1-项目架构概览)
2. [前置条件检查](#2-前置条件检查)
3. [启动后端服务](#3-启动后端服务)
4. [启动前端服务](#4-启动前端服务)
5. [前后端联调](#5-前后端联调)
6. [常见问题排查](#6-常见问题排查)
7. [调试技巧](#7-调试技巧)

---

## 1. 项目架构概览

```
┌─────────────────────────────────────────────────────────────────┐
│                        浏览器 (Browser)                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    前端页面 (localhost:端口)                │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │           <querymind-chat> 组件                      │  │  │
│  │  │                   ↓ 发送消息                          │  │  │
│  │  │                   ↑ 接收响应                          │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕ HTTP/SSE
                              ↕ (api-base: http://localhost:8000)
┌─────────────────────────────────────────────────────────────────┐
│                    后端服务 (localhost:8000)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  FastAPI     │  │  Agent       │  │  LLM + Memory        │  │
│  │  Server      │  │  (my_agent)  │  │  (Neo4j, PgVector)   │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    外部服务 (External APIs)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  MiniMax     │  │ ModelScope   │  │  PostgreSQL          │  │
│  │  (LLM)       │  │ (Embedder)   │  │  + Neo4j             │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 关键端口

| 服务 | 端口 | 说明 |
|------|------|------|
| 后端 API | 8000 | QueryMind FastAPI 服务 |
| 前端 Dev | 5173 | Vite 开发服务器（默认） |
| 前端 Test | 5555 | Python 测试后端 |
| Neo4j | 7687 | 图数据库 Bolt 协议 |
| PostgreSQL | 5432 | 关系数据库 |

---

## 2. 前置条件检查

### 2.1 检查服务状态

```bash
# 启动 PostgreSQL & Neo4j
/etc/init.d/postgresql start && neo4j start && pg_lsclusters && neo4j status

# 检查 PostgreSQL（无 sudo 权限时使用）
pg_isready -h localhost -p 5432
# 或检查进程
ps aux | grep -E '[p]ostgres|[p]g_' | head -5

# 检查 Neo4j
/opt/neo4j/bin/neo4j status
# 或检查进程
ps aux | grep -E '[n]eo4j' | head -5

# 检查端口占用
ss -tlnp | grep -E '5432|7687|7474|8000|5173'

# 一句话检查两个端口
pg_lsclusters && echo "---" && neo4j status
```


### 2.2 验证环境变量

```bash
# 检查 .env 文件是否存在
ls -la QueryMind/src/.env

# 验证关键配置（不要输出敏感信息）
grep -E "^(LLM_|MEM0_|NEO4J_|PGVECTOR_)" QueryMind/src/.env
```

### 2.3 检查 Node.js

```bash
node --version    # 应显示 v20.x.x
npm --version     # 应显示 10.x.x
```

---

## 3. 启动后端服务

### 3.1 完整启动流程

```bash
# 1. 进入后端目录
cd QueryMind/src

# 2. 确保依赖已安装
pip install -e ..  # 或使用 uv sync

# 3. 启动后端服务
python my_agent.py
```

### 3.2 预期输出

```
# 成功启动后应看到类似输出：
INFO:     Started server process on ['0.0.0.0:8000']
INFO:     Application startup complete.
```

### 3.3 验证后端运行

```bash
# 检查健康状态
curl http://localhost:8000/health 2>/dev/null || echo "可能没有 /health 端点"

# 检查 OpenAPI 文档
curl -s http://localhost:8000/docs | head -20
```

### 3.4 后端日志分析

后端启动时会显示关键组件的初始化信息：

| 日志关键词 | 含义 |
|-----------|------|
| `LLM Service initialized` | LLM 服务连接成功 |
| `Agent Memory initialized` | Mem0 记忆服务就绪 |
| `Schema Memory initialized` | Neo4j + PgVector 就绪 |
| `Tool Registry initialized` | 工具注册完成（含 RLS） |
| `Server started on 0.0.0.0:8000` | 服务已就绪 |

---

## 4. 启动前端服务

> ⚠️ **重要提示**：这是一个 **Web Components 组件库**项目，不是普通 Web 应用。它没有默认入口页面，需要通过以下三种方式之一来使用/开发。

### 4.1 阶段一：测试模式（零配置，快速验证）

**适合场景**：想快速验证组件是否正常工作，无需配置任何后端服务

```bash
# ========== 终端 1：启动 Python 测试后端 ==========
cd /root/Xihong/QueryMind/frontends/webcomponent

# 安装 Python 测试依赖（如果还没安装）
pip install fastapi uvicorn pydantic

# 启动测试后端（会提供完整的测试页面）
python test_backend.py --mode realistic

# 预期输出：
# Starting test backend in realistic mode...
# Server running at http://0.0.0.0:5555
# Send message '/test' to run comprehensive component test
```

```bash
# ========== 浏览器 ==========
# 打开浏览器访问
http://localhost:5555
```

**预期效果**：
- 页面显示组件测试界面
- 可以点击 "Run Comprehensive Test" 按钮
- 观看所有组件类型的渲染测试
- 验证组件功能是否正常

**退出测试后端**：`Ctrl+C`

---

### 4.2 阶段二：开发模式（Storybook + 实时预览）

**适合场景**：开发新组件、修改现有组件，需要热重载和独立查看每个组件

```bash
# 1. 进入前端目录
cd /root/Xihong/QueryMind/frontends/webcomponent

# 2. 确保依赖已安装
npm install

# 3. 启动 Storybook
npm run storybook

# 预期输出：
# ➜  Local:   http://localhost:6006
# ➜  Network: http://192.168.x.x:6006
```

```bash
# ========== 浏览器 ==========
# 打开浏览器访问
http://localhost:6006
```

**预期效果**：
- 左侧菜单显示所有组件列表
- 点击任意组件可查看独立预览
- 修改组件代码后，Storybook 自动刷新
- 可查看组件的不同状态和属性

**退出 Storybook**：`Ctrl+C`

---

### 4.3 阶段三：交付模式（构建生产版本）

**适合场景**：完成开发后，需要构建可发布的组件库

```bash
# 1. 进入前端目录
cd /root/Xihong/QueryMind/frontends/webcomponent

# 2. 确保依赖已安装
npm install

# 3. 构建生产版本
npm run build

# 预期输出：
# dist/vanna-components.js  (主文件)
# dist/vanna-components.js.map  (调试用 source map)
```

**构建产物**：
| 文件 | 说明 |
|------|------|
| `dist/vanna-components.js` | 生产环境使用的组件库 |
| `dist/vanna-components.js.map` | 调试用的 source map |

**使用构建产物**：
```html
<!-- 在 HTML 中引入 -->
<script type="module" src="./dist/vanna-components.js"></script>

<!-- 使用组件 -->
<querymind-chat
  api-base="http://localhost:8000"
  title="QueryMind 助手">
</querymind-chat>
```

---

### 4.4 快速启动对照表

| 场景 | 命令 | 访问地址 | 特点 |
|------|------|----------|------|
| 🔬 快速测试 | `python test_backend.py` | http://localhost:5555 | 无需配置，功能完整 |
| 🎨 组件开发 | `npm run storybook` | http://localhost:6006 | 热重载，独立查看组件 |
| 📦 生产构建 | `npm run build` | 无（生成 dist/） | 可发布到生产环境 |

---

### 4.5 ❌ 为什么不推荐 `npm run dev`？

```bash
npm run dev
# 预期输出：
# VITE v7.x.x  ready in xxx ms
# ➜  Local:   http://localhost:5173/
```

**原因**：
- 这是一个 **库模式（Library Mode）** 项目
- `vite.config.ts` 配置了 `build.lib`
- Vite 不会自动提供 `index.html` 入口
- 访问 `http://localhost:5173` 会显示 **404 Not Found**

**什么时候能用**：
- 只有在你手动创建了 `index.html` 并引用组件时
- 或者通过其他方式（如 Storybook、测试后端）提供入口

---

### 4.6 使用真实后端联调

如果你有完整的后端服务运行中，可以：

```bash
# 1. 启动真实后端（另一个终端）
cd /root/Xihong/QueryMind/src
python my_agent.py

# 2. 启动测试后端（修改 api-url）
cd /root/Xihong/QueryMind/frontends/webcomponent
python test_backend.py

# 3. 修改测试页面的 api-url
# 编辑 test-comprehensive.html，将 api-url 改为：
# api-url="http://localhost:8000"

# 4. 访问 http://localhost:5555
```

或者通过浏览器控制台动态修改：
```javascript
// 在浏览器 Console 中执行
document.querySelector('vanna-chat').setAttribute('api-url', 'http://localhost:8000');
```

---

## 5. 前后端联调

### 5.1 配置前端连接后端

前端组件通过 `api-base` 属性指定后端地址：

```html
<!-- 默认连接 localhost:8000 -->
<querymind-chat
  api-base="http://localhost:8000"
  title="QueryMind 助手">
</querymind-chat>
```

### 5.2 修改 api-base（开发时）

如果后端运行在不同端口，修改 `test-comprehensive.html` 或您的测试页面：

```javascript
// 打开浏览器开发者工具 (F12)，在 Console 中执行：
document.querySelector('querymind-chat').setAttribute('api-base', 'http://localhost:8000');
```

### 5.3 完整联调流程

```bash
# Terminal 1: 启动后端
cd QueryMind/src
python my_agent.py

# Terminal 2: 启动前端
cd QueryMind/frontends/webcomponent
npm run dev

# Terminal 3（可选）: 监控日志
tail -f /var/log/postgresql/postgresql-16-main.log  # PostgreSQL
tail -f /opt/neo4j/logs/neo4j.log  # Neo4j
```

### 5.4 测试联调

1. 打开浏览器访问 `http://localhost:5173`
2. 在聊天框输入问题，如"显示所有销售订单"
3. 观察：
   - 前端是否正确发送请求（Network 面板）
   - 后端是否收到请求（终端日志）
   - 响应是否正确返回并渲染

---

## 6. 常见问题排查

### 问题 1: 前端显示 "Backend not responding"

**原因：** 后端未运行或端口不对

**排查步骤：**
```bash
# 1. 确认后端正在运行
ps aux | grep my_agent.py

# 2. 测试后端连通性
curl -X POST http://localhost:8000/api/querymind/v1/chat_sse \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}' \
  -v  # 查看详细响应
```

**解决方案：**
- 启动后端：`cd QueryMind/src && python my_agent.py`
- 修改 `api-base` 为正确地址

---

### 问题 2: 后端启动失败 "Connection refused"

**原因：** PostgreSQL 或 Neo4j 未运行

**排查步骤：**
```bash
# 1. 检查 PostgreSQL（无 sudo 权限时）
pg_isready -h localhost -p 5432
# 或检查进程
ps aux | grep -E '[p]ostgres|[p]g_' | head -5

# 2. 检查 Neo4j
/opt/neo4j/bin/neo4j status
# 或检查进程
ps aux | grep -E '[n]eo4j' | head -5
```

**解决方案：**
```bash
# 启动 PostgreSQL（无 sudo 权限时请联系管理员，或使用容器内启动方式）
# 如果使用 Docker: docker start <postgres_container>
# 如果直接运行: pg_ctl -D /var/lib/postgresql/data start

# 启动 Neo4j
/opt/neo4j/bin/neo4j start
```

---

### 问题 3: LLM API 错误

**原因：** API Key 配置错误或网络问题

**排查步骤：**
```bash
# 1. 检查 .env 中的 API Key
grep -E "API_KEY" QueryMind/src/.env | head -5

# 2. 测试 API 连通性（MiniMax 为例）
curl -X POST https://api.minimaxi.com/anthropic/v1/messages \
  -H "Authorization: Bearer $MINIMAX_API_KEY" \
  -d '{"model":"Minimax-M2.7","messages":[{"role":"user","content":"hi"}]}'
```

**解决方案：**
- 更新 `.env` 中的 API Key
- 检查网络代理设置

---

### 问题 4: CORS 错误

**错误信息：** `Access to fetch at 'http://localhost:8000' from origin 'http://localhost:5173' has been blocked by CORS policy`

**原因：** 后端未配置 CORS 或前端 origin 不在白名单

**解决方案：**
检查后端代码中的 CORS 配置（FastAPI）：

```python
# 在 my_agent.py 或 server 配置中应该有类似：
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 允许的前端地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### 问题 5: SSE 连接失败

**错误信息：** `EventSource 连接失败` 或 `net::ERR_CONNECTION_REFUSED`

**排查步骤：**
```bash
# 1. 确认后端 SSE 端点存在
curl -s http://localhost:8000/openapi.json | grep -i sse

# 2. 手动测试 SSE
curl -N -X POST http://localhost:8000/api/querymind/v1/chat_sse \
  -H "Content-Type: application/json" \
  -d '{"message": "hi"}'
```

**解决方案：**
- 确认后端已正确实现 SSE 端点
- 检查防火墙/网络设置

---

### 问题 6: 前端组件不渲染

**排查步骤：**
```bash
# 1. 检查 Vite 是否正常运行
ps aux | grep vite

# 2. 检查浏览器控制台错误 (F12 → Console)

# 3. 检查组件是否构建
ls -la QueryMind/frontends/webcomponent/dist/
```

**解决方案：**
```bash
# 重新构建
cd QueryMind/frontends/webcomponent
npm run build

# 或清除缓存后重启
rm -rf node_modules/.vite
npm run dev
```

---

### 问题 7: 数据库连接超时

**错误信息：** `Connection timeout` 或 `Could not connect to database`

**排查步骤：**
```bash
# 1. 确认服务运行
ps aux | grep postgres
ps aux | grep neo4j

# 2. 测试连接
psql -h localhost -U querymind -d mem0 -c "SELECT 1;"
/opt/neo4j/bin/cypher-shell -u neo4j -p password "RETURN 1"
```

---

## 7. 调试技巧

### 7.1 前端调试

**浏览器开发者工具快捷键：** `F12`

| 面板 | 用途 |
|------|------|
| Console | 查看 JavaScript 日志和错误 |
| Network | 监控 HTTP/SSE 请求和响应 |
| Elements | 检查 HTML 结构和样式 |

**调试前端 JavaScript：**
```javascript
// 在 Console 中手动测试组件
const chat = document.querySelector('querymind-chat');
chat.sendMessage("测试消息");

// 查看组件属性
console.log(chat.apiBase);
console.log(chat.theme);
```

### 7.2 后端调试

**启用详细日志：**
```python
# 在 my_agent.py 中添加
import logging
logging.basicConfig(level=logging.DEBUG)
```

**测试 API 端点：**
```bash
# 测试聊天端点
curl -X POST http://localhost:8000/api/querymind/v1/chat_sse \
  -H "Content-Type: application/json" \
  -d '{"message": "显示所有表"}'
```

### 7.3 数据库调试

**查看 PostgreSQL 表结构：**
```bash
psql -h localhost -U querymind -d querymind -c "\dt"
```

**查看 Neo4j 数据：**
```bash
# 访问 Neo4j Browser
# http://localhost:7474

# 使用 cypher-shell
/opt/neo4j/bin/cypher-shell -u neo4j -p neo4j "MATCH (n) RETURN labels(n), count(*)"
```

### 7.4 日志文件位置

| 服务 | 日志位置 |
|------|---------|
| PostgreSQL | `/var/log/postgresql/postgresql-16-main.log` |
| Neo4j | `/opt/neo4j/logs/neo4j.log` |
| QueryMind | 终端输出 |

### 7.5 快速重启服务

```bash
# 重启后端
pkill -f my_agent.py
cd QueryMind/src && python my_agent.py

# 重启前端（Vite 支持热重载，通常自动生效）
# 如需强制刷新：Ctrl+Shift+R (清除缓存刷新)
```

---

## 📞 获取帮助

遇到问题时，请提供以下信息：

1. **操作系统和版本**：`cat /etc/os-release`
2. **Node.js 版本**：`node --version`
3. **Python 版本**：`python --version`
4. **相关服务状态**：`ss -tlnp | grep -E '5432|7687|7474|8000|5173'`
5. **错误日志**：终端输出的完整错误信息
6. **浏览器控制台**：F12 → Console 的错误截图

---

## 🔗 相关文档

- [基础设施安装指南](./INSTALL_INFRASTRUCTURE.md)
- [前端 README](./frontends/README_zh.md)
- [RLS 规则说明](./src/rls_rules.md)
