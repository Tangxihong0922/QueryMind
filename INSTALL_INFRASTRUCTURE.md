# QueryMind 基础设施安装指南

> 适用于 AutoDL 云GPU容器实例（无Docker环境）

## 📋 目录

1. [系统环境检查](#1-系统环境检查)
2. [PostgreSQL + pgvector 安装](#2-postgresql--pgvector-安装)
3. [Neo4j 安装](#3-neo4j-安装)
4. [Python 依赖安装](#4-python-依赖安装)
5. [vLLM 安装（可选，本地LLM）](#5-vllm-安装可选本地llm)
6. [环境变量配置](#6-环境变量配置)
7. [服务启动与验证](#7-服务启动与验证)
8. [故障排查](#8-故障排查)

---

## 1. 系统环境检查

```bash
# 查看系统信息
cat /etc/os-release
uname -a

# 查看CPU和内存
nproc
free -h

# 检查已安装的服务端口
netstat -tlnp 2>/dev/null || ss -tlnp

# 更新系统包
sudo apt update && sudo apt upgrade -y
```

---

## 2. PostgreSQL + pgvector 安装

### 方式一：使用 apt 安装（Ubuntu/Debian）

```bash
# 安装 PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# 安装 pgvector（Ubuntu 22.04+自带）
sudo apt install -y postgresql-16-pgvector

# 对于其他版本，手动添加 PG apt 仓库
# sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
# wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
# sudo apt update
# sudo apt install -y postgresql-16
# sudo apt install -y postgresql-16-pgvector
```

### 方式二：编译安装 pgvector（如果 apt 版本不包含）

```bash
# 安装编译依赖
sudo apt install -y build-essential git clang

# 克隆 pgvector
cd /opt
sudo git clone https://github.com/pgvector/pgvector.git

# 编译安装
cd pgvector
sudo make
sudo make install
```

### PostgreSQL 配置

```bash
# 启动 PostgreSQL 服务
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 检查服务状态
sudo systemctl status postgresql

# 切换到 postgres 用户进行配置
sudo -u postgres psql
```

### 创建数据库和用户

```bash
-- 进入 psql 终端
su - postgres -c "psql"
```

```sql
-- 在 psql 终端中执行
CREATE USER querymind WITH PASSWORD 'your_secure_password';
CREATE DATABASE querymind OWNER querymind;
CREATE DATABASE mem0 OWNER querymind;

-- 为 mem0 数据库启用 pgvector 扩展
\c mem0
CREATE EXTENSION IF NOT EXISTS vector;

-- 为 querymind 数据库启用 pgvector（审计日志可能需要）
\c querymind
CREATE EXTENSION IF NOT EXISTS vector;

-- 退出
\q
```

### 配置 PostgreSQL 远程访问

```bash
# 编辑 pg_hba.conf
sudo nano /etc/postgresql/16/main/pg_hba.conf

# 添加以下行（允许本地和远程连接）
host    all     all     127.0.0.1/32    md5
host    all     all     ::1/128         md5
# 如果需要远程访问（按需添加）
# host    all     all     0.0.0.0/0      md5

# 编辑 postgresql.conf 允许监听
sudo nano /etc/postgresql/16/main/postgresql.conf

# 找到并修改
listen_addresses = '*'
# 或者
listen_addresses = 'localhost'

# 重启服务
sudo systemctl restart postgresql

# 检查端口
sudo ss -tlnp | grep 5432
```

---

## 3. Neo4j 安装

### 下载并安装 Neo4j

```bash
# 下载 Neo4j 5.x（社区版）
cd /opt
sudo wget https://dist.neo4j.org/neo4j-5.18.0-linux.tar.gz

# 解压
sudo tar -xzf neo4j-5.18.0-linux.tar.gz
sudo mv neo4j-5.18.0 neo4j

# 创建 neo4j 用户（推荐，但可选）
# sudo adduser --system --group neo4j
# sudo chown -R neo4j:neo4j /opt/neo4j

# 配置环境变量（可选）
echo 'export NEO4J_HOME=/opt/neo4j' >> ~/.bashrc
echo 'export PATH=$NEO4J_HOME/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### 配置 Neo4j

```bash
# 编辑 neo4j 配置
sudo nano /opt/neo4j/conf/neo4j.conf

# 修改以下配置项（取消注释并修改）：
dbms.connector.bolt.listen_address=0.0.0.0:7687
dbms.connector.http.listen_address=0.0.0.0:7474
dbms.memory.heap.initial_size=512m
dbms.memory.heap.max_size=2g
dbms.memory.pagecache.size=1g

# 关闭安全认证（开发环境，生产环境请开启）
dbms.security.auth_enabled=false

# 如果需要远程访问
dbms.connector.bolt.advertised_address=0.0.0.0:7687
dbms.connector.http.advertised_address=0.0.0.0:7474
```

### 启动 Neo4j

```bash
# 启动 Neo4j（前台）
# /opt/neo4j/bin/neo4j console

# 或作为服务启动（首次需要设置初始密码）
/opt/neo4j/bin/neo4j start

# 检查状态
/opt/neo4j/bin/neo4j status

# 查看日志确认启动成功
tail -f /opt/neo4j/logs/neo4j.log
```

### 设置 Neo4j 密码（如果开启了 auth）

```bash
# 如果开启了认证，首次启动后需要设置密码
# 默认用户名：neo4j
/opt/neo4j/bin/cypher-shell -u neo4j -p neo4j \
  "ALTER CURRENT USER SET PASSWORD 'your_neo4j_password'"
```

### 验证 Neo4j

```bash
# 检查端口
sudo ss -tlnp | grep -E '7687|7474'

# 测试连接
curl -s http://localhost:7474
# 应返回 Neo4j 信息

# 使用 cypher-shell 测试
/opt/neo4j/bin/cypher-shell -u neo4j -p your_password "RETURN 1"
```

---

## 4. Python 依赖安装

### 安装 Python 和基础工具

```bash
# 检查 Python 版本（需要 3.10+）
python3 --version

# 安装 uv（推荐的项目管理工具）
curl -LsSf https://astral.sh/uv/install.sh | sh
source ~/.cargo/env

# 或使用 pip
pip install uv
```

### 安装项目依赖

```bash
# 进入项目目录
cd /path/to/QueryMind

# 使用 uv 安装依赖（推荐）
uv sync

# 或使用 pip
pip install -e .
```

### 验证 Mem0 安装

```bash
# 验证 mem0 是否正确安装
python3 -c "from mem0 import Memory; print('Mem0 OK')"

# 验证其他依赖
python3 -c "
import psycopg2
import neo4j
import fastapi
import uvicorn
print('All dependencies OK')
"
```

---

## 5. vLLM 安装（可选，本地LLM）

> 如果你希望在 AutoDL GPU 服务器上本地运行 LLM（无需依赖 OpenAI/MiniMax 等外部 API），可以使用 vLLM。

### 5.1 GPU 环境检查

```bash
# 检查 NVIDIA GPU
nvidia-smi

# 检查 CUDA 版本
nvcc --version

# 查看 GPU 内存
nvidia-smi --query-gpu=memory.total,memory.free --format=csv
```

### 5.2 安装 vLLM

```bash
# 安装 Python CUDA 环境（使用 uv）
uv pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121

# 安装 vLLM
uv pip install vllm

# 或使用 pip
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
pip install vllm
```

### 5.3 启动 vLLM Server

```bash
# 创建模型目录
mkdir -p /opt/vllm_models

# 下载模型（以 Qwen2.5-7B 为例）
# 或者从 HuggingFace 拉取
# huggingface-cli download Qwen/Qwen2.5-7B-Instruct --local-dir /opt/vllm_models/Qwen2.5-7B-Instruct

# 启动 vLLM OpenAI 兼容 API Server
python -m vllm.entrypoints.openai.api_server \
    --model /opt/vllm_models/Qwen2.5-7B-Instruct \
    --tensor-parallel-size 1 \
    --gpu-memory-utilization 0.9 \
    --host 0.0.0.0 \
    --port 8000
```

### 5.4 常用 vLLM 启动参数

| 参数 | 说明 | 示例值 |
|-----|------|-------|
| `--model` | 模型路径或 HuggingFace ID | `/opt/models/llama-3.1-8b` |
| `--tensor-parallel-size` | GPU 数量 | `1`, `2`, `4` |
| `--gpu-memory-utilization` | GPU 显存使用比例 | `0.9` (90%) |
| `--max-model-len` | 最大上下文长度 | `8192` |
| `--port` | 服务端口 | `8000` |
| `--host` | 监听地址 | `0.0.0.0` |
| `--served-model-name` | API 模型名称 | `qwen2.5-7b` |

### 5.5 验证 vLLM 部署

```bash
# 检查服务是否启动
curl http://localhost:8000/v1/models

# 测试推理
curl -X POST http://localhost:8000/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "qwen2.5-7b",
        "messages": [{"role": "user", "content": "Hello!"}],
        "max_tokens": 100
    }'
```

### 5.6 vLLM 与 QueryMind 集成配置

修改 `.env` 文件，使用 vLLM 作为 LLM 提供商：

```env
# ============================================================
# vLLM 本地 LLM 配置（替换 OpenAI/MiniMax）
# ============================================================

# Agent LLM（使用 vLLM）
LLM_PROVIDER=vllm
LLM_MODEL=qwen2.5-7b
LLM_BASE_URL=http://localhost:8000/v1

# Mem0 LLM（可选，也使用 vLLM）
MEM0_LLM_PROVIDER=vllm
MEM0_LLM_MODEL=qwen2.5-7b
MEM0_LLM_BASE_URL=http://localhost:8000/v1

# Embedder（仍需使用 OpenAI 或 Ollama）
EMBEDDING_PROVIDER=openai
EMBEDDING_MODEL=text-embedding-3-small
OPENAI_API_KEY=sk-dummy  # vLLM 不需要真实 key，但配置需要存在
```

### 5.7 推荐模型（按显存需求）

| 模型 | 最小显存 | 推荐用途 |
|-----|---------|---------|
| Qwen2.5-1.5B-Instruct | 4GB | 快速测试 |
| Qwen2.5-3B-Instruct | 6GB | 平衡性能 |
| Qwen2.5-7B-Instruct | 16GB | 生产使用 |
| Llama-3.1-8B-Instruct | 16GB | 生产使用 |
| Qwen2.5-14B-Instruct | 28GB | 高质量输出 |

### 5.8 Ollama 替代方案（更简单）

如果 vLLM 安装遇到问题，可以考虑使用 Ollama：

```bash
# 安装 Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 拉取模型
ollama pull qwen2.5:7b

# 启动服务（Ollama 自动在 11434 端口提供服务）
ollama serve

# QueryMind 配置
LLM_PROVIDER=ollama
LLM_MODEL=qwen2.5:7b
LLM_BASE_URL=http://localhost:11434/v1
```

---

## 6. 环境变量配置

### 创建 .env 文件

```bash
cd /path/to/QueryMind/src
cp .env.example .env
nano .env
```

### 配置内容示例

```env
# ============================================================
# Mem0 Agent Memory 配置
# ============================================================
MEM0_EMBEDDER_PROVIDER=openai
MEM0_EMBEDDER_MODEL=text-embedding-3-small

MEM0_LLM_PROVIDER=openai
MEM0_LLM_MODEL=gpt-4o-mini

MEM0_VECTOR_STORE_PROVIDER=pgvector
MEM0_PGVECTOR_HOST=localhost
MEM0_PGVECTOR_PORT=5432
MEM0_PGVECTOR_DATABASE=mem0
MEM0_PGVECTOR_USERNAME=querymind
MEM0_PGVECTOR_PASSWORD=your_postgres_password

# ============================================================
# Neo4j Schema Memory 配置
# ============================================================
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your_neo4j_password
NEO4J_DATABASE=neo4j

# ============================================================
# Schema Memory 向量层配置
# ============================================================
EMBEDDING_PROVIDER=openai
EMBEDDING_MODEL=text-embedding-3-small

LLM_PROVIDER=openai
LLM_MODEL=gpt-4o-mini

VECTOR_STORE_PROVIDER=pgvector
PGVECTOR_HOST=localhost
PGVECTOR_PORT=5432
PGVECTOR_DATABASE=mem0
PGVECTOR_USERNAME=querymind
PGVECTOR_PASSWORD=your_postgres_password

# ============================================================
# API Keys
# ============================================================
OPENAI_API_KEY=your_openai_api_key

# MiniMax API（如果使用）
MINIMAX_API_KEY=your_minimax_api_key

# ============================================================
# Audit Logger 配置
# ============================================================
AUDIT_DB_HOST=localhost
AUDIT_DB_PORT=5432
AUDIT_DB_NAME=querymind
AUDIT_DB_USER=querymind
AUDIT_DB_PASSWORD=your_postgres_password
```

---

## 7. 服务启动与验证

### 启动顺序

```bash
# 1. 确保 PostgreSQL 运行
sudo systemctl status postgresql
# 如未运行：sudo systemctl start postgresql

# 2. 确保 Neo4j 运行
/opt/neo4j/bin/neo4j status
# 如未运行：/opt/neo4j/bin/neo4j start

# 3. 验证服务端口
ss -tlnp | grep -E '5432|7687|7474'
```

### 验证数据库连接

```bash
# 验证 PostgreSQL
psql -h localhost -U querymind -d mem0 -c "SELECT 1;"

# 验证 pgvector
psql -h localhost -U querymind -d mem0 -c "CREATE EXTENSION IF NOT EXISTS vector; SELECT 1 FROM pg_extension WHERE extname = 'vector';"

# 验证 Neo4j
curl -s http://localhost:7474 | head -5
```

### 启动 QueryMind

```bash
cd /path/to/QueryMind/src
python3 my_agent.py
```

---

## 8. 故障排查

### PostgreSQL 问题

```bash
# 查看状态
sudo systemctl status postgresql

# 查看日志
sudo tail -f /var/log/postgresql/postgresql-16-main.log

# 检查配置
sudo -u postgres psql -c "SHOW listen_addresses;"
sudo -u postgres psql -c "SHOW port;"

# 重置密码（如需要）
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'new_password';"
```

### Neo4j 问题

```bash
# 查看日志
tail -f /opt/neo4j/logs/neo4j.log
tail -f /opt/neo4j/logs/debug.log

# 清理并重启
/opt/neo4j/bin/neo4j stop
rm -rf /opt/neo4j/data/databases/*
/opt/neo4j/bin/neo4j start

# 检查内存设置
free -h
```

### Python 依赖问题

```bash
# 清理并重新安装
pip uninstall -y querymind mem0ai
uv sync --refresh
# 或
pip install -e . --force-reinstall
```

### 常见端口冲突

```bash
# 查找占用端口的进程
sudo lsof -i :5432
sudo lsof -i :7687
sudo lsof -i :7474

# 杀死占用进程
sudo kill -9 <PID>
```

---

## 📝 快速安装脚本（可选）

如果需要一键安装，可以执行以下脚本：

```bash
#!/bin/bash
set -e

echo "=== QueryMind 基础设施安装脚本 ==="

# 安装基础依赖
sudo apt update
sudo apt install -y postgresql postgresql-contrib wget curl

# 安装 Neo4j
cd /opt
sudo wget -q https://dist.neo4j.org/neo4j-5.18.0-linux.tar.gz
sudo tar -xzf neo4j-5.18.0-linux.tar.gz
sudo mv neo4j-5.18.0 neo4j

# ... 继续其他步骤

echo "=== 安装完成 ==="
```

---

## 📞 获取帮助

如果遇到问题，请检查：
1. 服务日志文件
2. 系统日志 `/var/log/syslog`
3. 网络连通性 `curl -v`
