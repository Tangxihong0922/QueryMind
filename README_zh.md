# QueryMind

QueryMind 是一个面向 SQL 工作流的 Sample Agent 框架，提供 FastAPI 后端和 webcomponent 演示前端。

- English README: [README.md](README.md)

## 快速开始

### A Sample Agent built with QueryMind

这个仓库提供了一个 Sample Agent，把 QueryMind 后端和 demo chat 前端组合在一起，可以直接跑通完整的 Agent 闭环。

#### Quick Start

**前置准备**

- 业务数据库：这里预留数据库初始化与启动方式。
- Agent Memory：这里预留 Memory 初始化与启动方式。
- Schema Memory：这里预留 Schema Memory 初始化与启动方式。

**使用 `querymind` 快速启动项目**

统一启动器位于 [`querymind.py`](/root/Xihong/QueryMind/querymind.py)，同时也通过 `querymind` console script 暴露。

```bash
querymind demo
```

**三个启动命令的用法**

```bash
querymind agent-only
querymind web-only
querymind demo
```

- `agent-only`：只启动后端 Agent。
- `web-only`：只启动前端 demo。
- `demo`：同时启动后端和前端，并自动打开 demo 页面。

## Agent 后端

后端负责运行 Agent 循环、工具注册、记忆管理和 API 服务。

主脚本：[`my_agent.py`](/root/Xihong/QueryMind/my_agent.py)

启动命令：

```bash
python my_agent.py
```

## Demo Chat 前端

前端负责提供 webcomponent 的聊天界面，页面入口是 [`frontends/webcomponent/demo.html`](/root/Xihong/QueryMind/frontends/webcomponent/demo.html)。

前端启动脚本：[`webcomponent_demo.py`](/root/Xihong/QueryMind/webcomponent_demo.py)

启动命令：

```bash
python webcomponent_demo.py --api-base http://127.0.0.1:8000
```

前端启动后会自动打开 demo 页面。
