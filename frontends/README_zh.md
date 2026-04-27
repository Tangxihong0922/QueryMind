# QueryMind Web Components

**QueryMind AI Agent 的 Lit Web Components - 交互式聊天界面**

QueryMind Web Components 为 QueryMind AI Agent 框架提供了一个精美、交互式的聊天界面。基于 [Lit](https://lit.dev/)（Web Components）构建，支持实时流式响应、丰富的数据可视化，以及完全可定制化的设计系统。

---

## 🎯 这是什么？

这是 QueryMind 的**前端用户界面**，提供以下功能：

- 💬 **聊天界面** - 自然语言转 SQL 查询
- 📊 **数据可视化** - 基于 Plotly.js 的交互式图表
- 🔄 **实时流式响应** - AI 处理请求时实时更新
- 📋 **丰富组件** - 表格、卡片、进度指示器、通知
- 🌙 **深色模式** - 内置主题支持

---

## 🛠️ 技术栈

| 技术 | 用途 | 为什么重要 |
|------|------|-----------|
| **Lit 3.x** | Web Components 框架 | 一次编写，随处使用（React、Vue、原生 JS） |
| **TypeScript** | 类型安全 | 在编译时捕获错误 |
| **Vite 7.x** | 构建工具 | 极快的开发和构建速度 |
| **Plotly.js** | 图表和可视化 | 专业级数据可视化 |
| **Storybook 8.x** | 组件文档 | 可视化测试和文档 |

---

## 📁 项目结构

```
webcomponent/
├── src/                          # 源代码
│   ├── index.ts                   # ⭐ 主导出文件 - 组件从这里导入！
│   │
│   ├── components/               # UI 组件
│   │   ├── querymind-chat.ts     # ⭐ 最核心的聊天组件
│   │   ├── querymind-message.ts  # 消息气泡
│   │   ├── querymind-status-bar.ts  # 状态栏
│   │   ├── querymind-progress-tracker.ts  # 进度追踪器
│   │   ├── rich-card.ts          # 可操作卡片
│   │   ├── rich-task-list.ts     # 任务列表
│   │   ├── rich-progress-bar.ts  # 进度条
│   │   ├── plotly-chart.ts       # 图表可视化
│   │   ├── schema-management-page.ts  # Schema 管理页面
│   │   ├── schema-retrieve-settings.ts  # Schema 检索设置
│   │   └── rich-component-system.ts  # 通用组件渲染系统
│   │
│   ├── services/                  # API 通信
│   │   └── api-client.ts          # SSE、WebSocket、REST 客户端
│   │
│   └── styles/                    # 设计系统
│       ├── vanna-design-tokens.ts # 颜色、间距、字体
│       └── rich-component-styles.ts
│
├── test_backend.py               # 本地测试服务器（Python/FastAPI）
├── test-comprehensive.html       # 浏览器测试界面
├── package.json                   # 依赖管理
├── vite.config.ts                # 构建配置
└── tsconfig.json                 # TypeScript 配置
```

---

## 🚀 快速开始

### 第一步：安装依赖

```bash
cd QueryMind/frontends/webcomponent
npm install
```

### 第二步：构建 Web Component

```bash
npm run build
```

这会在 `dist/` 目录下创建生产构建文件。

### 第三步：在 HTML 页面中使用

**方式 A：使用构建后的文件（推荐）**

```html
<!DOCTYPE html>
<html>
<head>
  <!-- 加载 web component -->
  <script type="module" src="./dist/vanna-components.js"></script>
</head>
<body>
  <!-- 使用聊天组件 -->
  <querymind-chat
    api-base="http://localhost:8000"
    title="QueryMind 助手">
  </querymind-chat>
</body>
</html>
```

**方式 B：通过 npm 包使用**

```javascript
// 在你的 JS/TS 文件中
import { QueryMindChat } from '@querymind/webcomponent';

// 或者直接从源码导入（开发时）
import { QueryMindChat } from './src/index.ts';
```

---

## 📖 组件使用指南

### 1. 主聊天组件（`<querymind-chat>`）

处理聊天界面和与后端通信的核心组件。

**基本用法：**

```html
<querymind-chat
  api-base="http://localhost:8000"
  title="SQL 助手"
  placeholder="问我任何关于数据库的问题...">
</querymind-chat>
```

**所有属性：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `api-base` | string | "" | 后端服务器地址 |
| `title` | string | "QueryMind Chat" | 标题 |
| `subtitle` | string | "" | 副标题 |
| `placeholder` | string | "Ask me anything..." | 输入框占位符 |
| `theme` | "light" \| "dark" | "light" | 主题颜色 |
| `disabled` | boolean | false | 禁用输入 |
| `show-progress` | boolean | true | 显示进度指示器 |
| `allow-minimize` | boolean | true | 允许最小化按钮 |
| `starting-state` | string | "normal" | 初始窗口状态 |
| `sse-endpoint` | string | "/api/querymind/v1/chat_sse" | SSE 端点路径 |
| `ws-endpoint` | string | "/api/querymind/v1/chat_websocket" | WebSocket 端点 |
| `poll-endpoint` | string | "/api/querymind/v1/chat_poll" | 轮询端点 |

**JavaScript API：**

```javascript
const chat = document.querySelector('querymind-chat');

// 通过代码发送消息
chat.sendMessage("显示销售数据");

// 监听事件
chat.addEventListener('message-sent', (e) => {
  console.log('消息已发送:', e.detail);
});

chat.addEventListener('message-received', (e) => {
  console.log('收到响应:', e.detail);
});
```

### 2. 图表组件（`<plotly-chart>`）

显示交互式 Plotly 图表。

```html
<plotly-chart
  chart-type="bar"
  chart-data='{"data": [{"x": ["A", "B"], "y": [1, 2]}]}'
  title="我的图表">
</plotly-chart>
```

### 3. 卡片组件

带有 Markdown 内容和操作按钮的卡片。

```javascript
import { RichCard } from './src/components/rich-card.ts';

// 创建卡片
const card = new RichCard();
card.title = "需要操作";
card.content = "**请检查**以下数据";
card.actions = [
  { label: "批准", action: "/approve", variant: "primary" },
  { label: "拒绝", action: "/reject", variant: "danger" }
];
```

---

## 🔌 后端 API 集成

### API 端点

前端通过以下端点与后端通信：

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/querymind/v1/chat_sse` | POST | **主要端点** - 发送消息，接收流式响应 |
| `/api/querymind/v1/schema/tables` | GET | 获取所有表及元数据 |
| `/api/querymind/v1/schema/tables/{name}` | GET | 获取指定表的详细 schema |
| `/api/querymind/v1/schema/tables/{name}/metadata` | PUT | 更新表元数据 |
| `/api/querymind/v1/schema/tables/{name}/enrich` | POST | AI 丰富表元数据 |

### 请求格式（Chat SSE）

```javascript
// POST /api/querymind/v1/chat_sse
{
  "message": "显示销售订单",
  "conversation_id": "conv-123",      // 可选
  "request_id": "req-456",            // 可选
  "metadata": {                       // 可选
    "user_id": "user-789"
  }
}
```

### 响应格式（SSE 流）

后端通过 SSE 发送 JSON 数据块：

```javascript
// 每个数据块格式：
{
  "rich": {
    "id": "comp-123",
    "type": "text",                   // 组件类型
    "lifecycle": "create",           // create, update, replace, remove
    "data": {
      "content": "这里是结果...",
      "markdown": true
    },
    "timestamp": "2024-01-01T00:00:00Z"
  },
  "conversation_id": "conv-123",
  "request_id": "req-456",
  "timestamp": 1704067200
}
```

### 富组件类型

| 类型 | 说明 | 数据属性 |
|------|------|----------|
| `text` | 文本/Markdown 内容 | `content`, `markdown` |
| `card` | 带有标题、内容、操作的卡片 | `title`, `content`, `actions[]` |
| `dataframe` | 带数据的表格 | `data[]`, `columns[]`, `title` |
| `chart` | Plotly 图表 | `chart_type`, `data`, `title` |
| `progress_bar` | 进度指示器 | `value`, `label`, `status` |
| `notification` | 通知消息 | `message`, `level`, `title` |
| `task_list` | 任务列表 | `title`, `tasks[]` |
| `status_indicator` | 状态显示 | `status`, `message` |

---

## 🧪 测试指南

### 1. 启动测试后端

```bash
# 在 webcomponent 目录下
cd QueryMind/frontends/webcomponent

# 启动 Python 测试服务器
python test_backend.py --mode realistic
```

这会在 `http://localhost:5555` 启动本地服务器，提供模拟后端。

### 2. 打开测试页面

在浏览器中打开：
```
http://localhost:5555
```

### 3. 运行组件测试

点击 **"Run Comprehensive Test"** 按钮测试所有组件类型：
- 文本组件
- 卡片和按钮
- 数据表格
- 图表
- 进度指示器
- 通知

### 测试模式

```bash
# 真实模式（带延迟）- 推荐用于视觉测试
python test_backend.py --mode realistic

# 快速模式 - 用于压力测试
python test_backend.py --mode rapid
```

---

## 🎨 定制化指南

### 1. 自定义主题

在页面中覆盖 CSS 变量：

```css
querymind-chat {
  /* 主色调 */
  --chat-primary: #4F46E5;
  --chat-primary-stronger: #3730A3;
  
  /* 背景色 */
  --chat-surface: #FFFFFF;
  --chat-muted: #F3F4F6;
}
```

### 2. 深色模式

只需添加 `theme="dark"` 属性：

```html
<querymind-chat theme="dark" title="深色模式聊天">
</querymind-chat>
```

### 3. 自定义样式

组件使用 Shadow DOM，样式是封装的。可以通过 CSS 自定义属性覆盖（见上文）或使用 `::part()` 伪元素：

```css
querymind-chat::part(header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
```

---

## 🔧 开发指南

### 本地开发

```bash
# 启动 Vite 开发服务器（热重载）
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 使用 Storybook（组件文档）

```bash
# 启动 Storybook
npm run storybook

# 构建 Storybook 静态站点
npm run build-storybook
```

### 项目脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动 Vite 开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览生产构建 |
| `npm run storybook` | 启动 Storybook |
| `npm run build-storybook` | 构建 Storybook 静态站点 |
| `npm run sync-version` | 同步版本号到构建 |

---

## 🐛 故障排查

### 问题："Web component not defined"

**原因：** 脚本在组件定义前加载

**解决方案：**
```html
<!-- 确保使用 type="module" -->
<script type="module" src="./dist/vanna-components.js"></script>
```

### 问题："Backend not responding"（后端无响应）

**解决方案：**
1. 检查后端是否运行：`curl http://localhost:8000/health`
2. 确认后端已启用 CORS
3. 检查 `api-base` 属性指向正确的 URL

### 问题："Components not rendering"（组件不显示）

**检查：**
1. 浏览器控制台是否有错误（F12）
2. Webcomponent 是否已构建：`ls dist/`
3. 检查样式是否被注入

### 问题："SSE connection failing"（SSE 连接失败）

**解决方案：**
1. 确认后端支持 SSE
2. 检查 CORS 头是否允许你的域名
3. 尝试 WebSocket 或轮询作为备选

---

## 📚 富组件系统

前端使用通用的**富组件系统**，可以渲染后端发送的任何组件。这提供了灵活性和可扩展性。

### 工作原理

1. 后端通过 SSE 发送 JSON 格式的组件
2. 前端接收并解析 JSON
3. `ComponentManager` 将请求路由到相应的渲染器
4. 渲染器创建/更新 DOM 元素

### 组件生命周期

| 生命周期 | 说明 |
|---------|------|
| `create` | 创建新组件 |
| `update` | 更新现有组件属性 |
| `replace` | 替换整个组件 |
| `remove` | 从 DOM 中移除组件 |

---

## 🚀 集成示例

### 1. React 集成

```jsx
import { useEffect, useRef } from 'react';
import { QueryMindChat } from '@querymind/webcomponent';

function App() {
  const chatRef = useRef(null);

  return (
    <div>
      <h1>我的 SQL 助手</h1>
      <querymind-chat
        ref={chatRef}
        api-base="http://localhost:8000"
        title="SQL 助手"
      />
    </div>
  );
}
```

### 2. Vue 集成

```vue
<template>
  <div>
    <h1>我的 SQL 助手</h1>
    <querymind-chat
      :api-base="apiBase"
      title="SQL 助手"
      @message-sent="onMessageSent"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@querymind/webcomponent';

const apiBase = ref('http://localhost:8000');

function onMessageSent(event) {
  console.log('消息已发送:', event.detail);
}
</script>
```

### 3. 原生 JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="./dist/vanna-components.js"></script>
</head>
<body>
  <querymind-chat
    id="my-chat"
    api-base="http://localhost:8000">
  </querymind-chat>

  <script>
    const chat = document.getElementById('my-chat');
    
    // 3 秒后发送消息
    setTimeout(() => {
      chat.sendMessage("显示所有表");
    }, 3000);
  </script>
</body>
</html>
```

---

## 🔗 后端要求

要让前端正常工作，后端必须：

1. **暴露 SSE 端点** `/api/querymind/v1/chat_sse`
2. **接受 POST 请求**，JSON body 包含 `message`
3. **通过 SSE 流式响应** JSON 数据块
4. **包含 CORS 头**，允许跨域请求

最小后端示例（FastAPI）：

```python
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
import json

app = FastAPI()

@app.post("/api/querymind/v1/chat_sse")
async def chat_sse(request: Request):
    body = await request.json()
    message = body.get("message", "")
    
    async def generate():
        # 发送欢迎消息
        yield f"data: {json.dumps({'rich': {'type': 'text', 'data': {'content': f'你说的是: {message}'}}})}\n\n"
        yield "data: [DONE]\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")
```

---

## 📄 许可证

MIT 许可证 - 参见 [QueryMind 许可证](../../LICENSE)

---

## 🤝 贡献指南

贡献指南参见 [QueryMind 贡献指南](../../CONTRIBUTING.md)

---

**由 QueryMind 团队用 ❤️ 构建**
