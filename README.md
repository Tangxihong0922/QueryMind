# QueryMind

QueryMind is a sample agent framework for SQL workflows, with a FastAPI backend and a webcomponent demo frontend.

- Chinese README: [README_zh.md](README_zh.md)

## Get Started

### A Sample Agent built with QueryMind

This repository ships a sample agent that pairs the QueryMind backend with a demo chat frontend, so you can run the full agent loop end to end.

#### Quick Start

**Prerequisites**

- Business database: placeholder for setup and startup instructions.
- Agent Memory: placeholder for setup and startup instructions.
- Schema Memory: placeholder for setup and startup instructions.

**Use `querymind` to start the project**

The unified launcher lives in [`querymind.py`](/root/Xihong/QueryMind/querymind.py), and the same modes are exposed through the `querymind` console script.

```bash
querymind demo
```

**Launcher modes**

```bash
querymind agent-only
querymind web-only
querymind demo
```

- `agent-only`: start the backend agent only.
- `web-only`: start the demo frontend only.
- `demo`: start both services and open the demo page automatically.

## Agent Backend

The backend runs the agent loop, tool registry, memory, and API server.

Launcher: [`my_agent.py`](/root/Xihong/QueryMind/my_agent.py)

Start it with:

```bash
python my_agent.py
```

## Demo Chat Frontend

The demo chat frontend serves the webcomponent UI in [`frontends/webcomponent/demo.html`](/root/Xihong/QueryMind/frontends/webcomponent/demo.html).

Launcher: [`webcomponent_demo.py`](/root/Xihong/QueryMind/webcomponent_demo.py)

Start it with:

```bash
python webcomponent_demo.py --api-base http://127.0.0.1:8000
```

The frontend launcher opens the demo page automatically.
