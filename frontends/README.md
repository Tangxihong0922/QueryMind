# QueryMind Web Components

**Lit-based Web Components for QueryMind AI Agents - Interactive Chat Interface**

QueryMind Web Components provides a beautiful, interactive chat UI for the QueryMind AI Agent framework. Built with [Lit](https://lit.dev/) (Web Components), it features real-time streaming responses, rich data visualization, and a fully customizable design system.

---

## 🎯 What is This?

This is the **frontend user interface** for QueryMind. It provides:

- 💬 **Chat Interface** - Natural language to SQL queries
- 📊 **Data Visualization** - Interactive charts with Plotly.js
- 🔄 **Real-time Streaming** - Live updates as AI processes requests
- 📋 **Rich Components** - Tables, cards, progress indicators, notifications
- 🌙 **Dark Mode** - Built-in theme support

---

## 🛠️ Technology Stack

| Technology | Purpose | Why It Matters |
|------------|---------|----------------|
| **Lit 3.x** | Web Components framework | Write components once, use anywhere (React, Vue, vanilla JS) |
| **TypeScript** | Type safety | Catches errors before runtime |
| **Vite 7.x** | Build tool | Lightning-fast development and builds |
| **Plotly.js** | Charts and visualizations | Professional data visualization |
| **Storybook 8.x** | Component documentation | Visual testing and documentation |

---

## 📁 Project Structure

```
webcomponent/
├── src/                          # Source code
│   ├── index.ts                   # Main export file - import components from here!
│   │
│   ├── components/               # UI Components
│   │   ├── querymind-chat.ts     # ⭐ Main chat component (most important!)
│   │   ├── querymind-message.ts  # Message bubbles
│   │   ├── querymind-status-bar.ts
│   │   ├── querymind-progress-tracker.ts
│   │   ├── rich-card.ts          # Card with actions
│   │   ├── rich-task-list.ts     # Task list display
│   │   ├── rich-progress-bar.ts
│   │   ├── plotly-chart.ts       # Chart visualization
│   │   ├── schema-management-page.ts
│   │   ├── schema-retrieve-settings.ts
│   │   └── rich-component-system.ts  # Generic component renderer
│   │
│   ├── services/                  # API Communication
│   │   └── api-client.ts          # SSE, WebSocket, REST clients
│   │
│   └── styles/                    # Design System
│       ├── vanna-design-tokens.ts # Colors, spacing, typography
│       └── rich-component-styles.ts
│
├── test_backend.py               # Local test server (Python/FastAPI)
├── test-comprehensive.html       # Browser-based test interface
├── package.json                   # Dependencies
├── vite.config.ts                # Build configuration
└── tsconfig.json                 # TypeScript configuration
```

---

## 🚀 Quick Start Guide

### Step 1: Install Dependencies

```bash
cd QueryMind/frontends/webcomponent
npm install
```

### Step 2: Build the Web Component

```bash
npm run build
```

This creates the production build in `dist/` folder.

### Step 3: Use in Your HTML Page

**Option A: Use the built file (Recommended)**

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Load the web component -->
  <script type="module" src="./dist/vanna-components.js"></script>
</head>
<body>
  <!-- Use the chat component -->
  <querymind-chat
    api-base="http://localhost:8000"
    title="QueryMind Assistant">
  </querymind-chat>
</body>
</html>
```

**Option B: Use with npm package**

```javascript
// In your JS/TS file
import { QueryMindChat } from '@querymind/webcomponent';

// Or import directly from source (for development)
import { QueryMindChat } from './src/index.ts';
```

---

## 📖 Component Usage Guide

### 1. Main Chat Component (`<querymind-chat>`)

The main component that handles the chat interface and communication with the backend.

**Basic Usage:**

```html
<querymind-chat
  api-base="http://localhost:8000"
  title="SQL Assistant"
  placeholder="Ask me anything about your database...">
</querymind-chat>
```

**All Properties:**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `api-base` | string | "" | Backend server URL |
| `title` | string | "QueryMind Chat" | Header title |
| `subtitle` | string | "" | Header subtitle |
| `placeholder` | string | "Ask me anything..." | Input placeholder |
| `theme` | "light" \| "dark" | "light" | Color theme |
| `disabled` | boolean | false | Disable input |
| `show-progress` | boolean | true | Show progress indicator |
| `allow-minimize` | boolean | true | Allow minimize button |
| `starting-state` | string | "normal" | Initial window state |
| `sse-endpoint` | string | "/api/querymind/v1/chat_sse" | SSE endpoint path |
| `ws-endpoint` | string | "/api/querymind/v1/chat_websocket" | WebSocket endpoint |
| `poll-endpoint` | string | "/api/querymind/v1/chat_poll" | Polling endpoint |

**JavaScript API:**

```javascript
const chat = document.querySelector('querymind-chat');

// Send a message programmatically
chat.sendMessage("Show me sales data");

// Listen to events
chat.addEventListener('message-sent', (e) => {
  console.log('Message sent:', e.detail);
});

chat.addEventListener('message-received', (e) => {
  console.log('Response received:', e.detail);
});
```

### 2. Chart Component (`<plotly-chart>`)

Display interactive Plotly charts.

```html
<plotly-chart
  chart-type="bar"
  chart-data='{"data": [{"x": ["A", "B"], "y": [1, 2]}]}'
  title="My Chart">
</plotly-chart>
```

### 3. Rich Card Component

Cards with markdown content and action buttons.

```javascript
import { RichCard } from './src/components/rich-card.ts';

// Create a card
const card = new RichCard();
card.title = "Action Required";
card.content = "**Please review** the following data";
card.actions = [
  { label: "Approve", action: "/approve", variant: "primary" },
  { label: "Reject", action: "/reject", variant: "danger" }
];
```

---

## 🔌 Backend API Integration

### API Endpoints

The frontend communicates with the backend via these endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/querymind/v1/chat_sse` | POST | **Main endpoint** - Send message, receive streaming response |
| `/api/querymind/v1/schema/tables` | GET | Get all tables with metadata |
| `/api/querymind/v1/schema/tables/{name}` | GET | Get detailed schema for a table |
| `/api/querymind/v1/schema/tables/{name}/metadata` | PUT | Update table metadata |
| `/api/querymind/v1/schema/tables/{name}/enrich` | POST | AI enrich table metadata |

### Request Format (Chat SSE)

```javascript
// POST /api/querymind/v1/chat_sse
{
  "message": "Show me sales orders",
  "conversation_id": "conv-123",      // Optional
  "request_id": "req-456",            // Optional
  "metadata": {                       // Optional
    "user_id": "user-789"
  }
}
```

### Response Format (SSE Stream)

The backend sends Server-Sent Events (SSE) with JSON chunks:

```javascript
// Each chunk looks like this:
{
  "rich": {
    "id": "comp-123",
    "type": "text",                   // Component type
    "lifecycle": "create",           // create, update, replace, remove
    "data": {
      "content": "Here are the results...",
      "markdown": true
    },
    "timestamp": "2024-01-01T00:00:00Z"
  },
  "conversation_id": "conv-123",
  "request_id": "req-456",
  "timestamp": 1704067200
}
```

### Rich Component Types

| Type | Description | Data Properties |
|------|-------------|-----------------|
| `text` | Text/markdown content | `content`, `markdown` |
| `card` | Card with title, content, actions | `title`, `content`, `actions[]` |
| `dataframe` | Table with data | `data[]`, `columns[]`, `title` |
| `chart` | Plotly chart | `chart_type`, `data`, `title` |
| `progress_bar` | Progress indicator | `value`, `label`, `status` |
| `notification` | Alert message | `message`, `level`, `title` |
| `task_list` | List of tasks | `title`, `tasks[]` |
| `status_indicator` | Status display | `status`, `message` |

---

## 🧪 Testing Guide

### 1. Start the Test Backend

```bash
# From the webcomponent directory
cd QueryMind/frontends/webcomponent

# Start the Python test server
python test_backend.py --mode realistic
```

This starts a local server at `http://localhost:5555` with a mock backend.

### 2. Open the Test Page

Open your browser to:
```
http://localhost:5555
```

### 3. Run Component Tests

Click the **"Run Comprehensive Test"** button to test all component types:
- Text components
- Cards and buttons
- Data tables
- Charts
- Progress indicators
- Notifications

### Test Modes

```bash
# Realistic mode (with delays) - Recommended for visual testing
python test_backend.py --mode realistic

# Rapid mode (fast) - For stress testing
python test_backend.py --mode rapid
```

---

## 🎨 Customization Guide

### 1. Custom Theme

Override CSS variables in your page:

```css
querymind-chat {
  /* Primary colors */
  --chat-primary: #4F46E5;
  --chat-primary-stronger: #3730A3;
  
  /* Background colors */
  --chat-surface: #FFFFFF;
  --chat-muted: #F3F4F6;
}
```

### 2. Dark Mode

Simply add the `theme="dark"` attribute:

```html
<querymind-chat theme="dark" title="Dark Mode Chat">
</querymind-chat>
```

### 3. Custom Styling

The component uses Shadow DOM, so styles are encapsulated. Override them with CSS custom properties (see above) or use the `::part()` pseudo-element:

```css
querymind-chat::part(header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
```

---

## 🔧 Development Guide

### Local Development

```bash
# Start Vite dev server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Using Storybook (Component Documentation)

```bash
# Start Storybook
npm run storybook

# Build Storybook static site
npm run build-storybook
```

### Project Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run storybook` | Start Storybook |
| `npm run build-storybook` | Build Storybook static site |
| `npm run sync-version` | Sync version to build |

---

## 🐛 Troubleshooting

### Issue: "Web component not defined"

**Cause:** Script loaded before component defined

**Solution:**
```html
<!-- Make sure to use type="module" -->
<script type="module" src="./dist/vanna-components.js"></script>
```

### Issue: "Backend not responding"

**Solutions:**
1. Check backend is running: `curl http://localhost:8000/health`
2. Verify CORS is enabled on backend
3. Check the `api-base` attribute points to correct URL

### Issue: "Components not rendering"

**Check:**
1. Browser console for errors (F12)
2. Webcomponent built: `ls dist/`
3. Check if styles are being injected

### Issue: "SSE connection failing"

**Solutions:**
1. Verify backend supports SSE
2. Check CORS headers allow your origin
3. Try WebSocket or polling fallback

---

## 📚 Rich Component System

The frontend uses a generic **Rich Component System** that can render any component sent from the backend. This provides flexibility and extensibility.

### How It Works

1. Backend sends component as JSON via SSE
2. Frontend receives and parses the JSON
3. `ComponentManager` routes to appropriate renderer
4. Renderer creates/updates DOM element

### Component Lifecycle

| Lifecycle | Description |
|-----------|-------------|
| `create` | Create new component |
| `update` | Update existing component properties |
| `replace` | Replace entire component |
| `remove` | Remove component from DOM |

---

## 🚀 Integration Examples

### 1. React Integration

```jsx
import { useEffect, useRef } from 'react';
import { QueryMindChat } from '@querymind/webcomponent';

function App() {
  const chatRef = useRef(null);

  return (
    <div>
      <h1>My SQL Assistant</h1>
      <querymind-chat
        ref={chatRef}
        api-base="http://localhost:8000"
        title="SQL Assistant"
      />
    </div>
  );
}
```

### 2. Vue Integration

```vue
<template>
  <div>
    <h1>My SQL Assistant</h1>
    <querymind-chat
      :api-base="apiBase"
      title="SQL Assistant"
      @message-sent="onMessageSent"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@querymind/webcomponent';

const apiBase = ref('http://localhost:8000');

function onMessageSent(event) {
  console.log('Message sent:', event.detail);
}
</script>
```

### 3. Vanilla JavaScript

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
    
    // Send message after 3 seconds
    setTimeout(() => {
      chat.sendMessage("Show me all tables");
    }, 3000);
  </script>
</body>
</html>
```

---

## 🔗 Backend Requirements

For the frontend to work, your backend must:

1. **Expose SSE endpoint** at `/api/querymind/v1/chat_sse`
2. **Accept POST requests** with JSON body containing `message`
3. **Stream responses** as SSE with JSON chunks
4. **Include CORS headers** for cross-origin requests

Example minimal backend (FastAPI):

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
        # Send welcome message
        yield f"data: {json.dumps({'rich': {'type': 'text', 'data': {'content': f'You said: {message}'}}})}\n\n"
        yield "data: [DONE]\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")
```

---

## 📄 License

MIT License - See [QueryMind License](../../LICENSE)

---

## 🤝 Contributing

For contributing guidelines, see [QueryMind Contributing Guide](../../CONTRIBUTING.md)

---

**Built with ❤️ by QueryMind Team**
