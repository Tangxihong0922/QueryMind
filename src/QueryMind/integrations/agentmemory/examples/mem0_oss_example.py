"""
Mem0 OSS AgentMemory 使用示例

这个文件展示了如何使用 Mem0AgentMemory 实现 AgentMemory 接口，
支持自定义 LLM、Embedder 和 Vector Store 服务。
"""

import asyncio
from QueryMind.integrations.agentmemory.mem0.oss import (
    Mem0AgentMemory,
    Mem0OSSConfig,
    EmbedderConfig,
    LLMConfig,
    VectorStoreConfig,
    RerankerConfig,
)


async def basic_example():
    """基本使用示例 - 使用 PostgreSQL/pgvector"""
    
    # 1. 创建配置
    config = Mem0OSSConfig(
        embedder=EmbedderConfig(
            provider="openai",
            model="text-embedding-3-small",
            api_key="sk-your-openai-key"
        ),
        llm=LLMConfig(
            provider="openai",
            model="gpt-4o-mini",
            api_key="sk-your-openai-key"
        ),
        vector_store=VectorStoreConfig(
            provider="pgvector",
            host="localhost",
            port=5432,
            database="mem0",
            username="postgres",
            password="your-password"
        )
    )
    
    # 2. 创建 AgentMemory 实例
    memory = Mem0AgentMemory(
        config=config,
        default_user_id="user_001",
        default_agent_id="sql_agent_001"
    )
    
    # 3. 创建上下文 (使用 QueryMind ToolContext 结构)
    from QueryMind.core.tool import ToolContext
    from QueryMind.core.user.models import User
    
    # 创建 User 对象
    user = User(id="user_001", username="alice", email="alice@example.com")
    
    # 创建 ToolContext，agent_id 通过 metadata 传递
    context = ToolContext(
        user=user,
        conversation_id="session_001",  # 作为 Mem0 run_id
        request_id="req_001",
        agent_memory=memory,
        metadata={
            "agent_id": "sql_agent_001"  # Mem0 agent_id 从这里获取
        }
    )
    
    # 4. 保存工具使用记录
    await memory.save_tool_usage(
        question="Show me the total sales for each department",
        tool_name="sql_query",
        args={"sql": "SELECT department, SUM(sales) FROM orders GROUP BY department"},
        context=context,
        success=True
    )
    
    await memory.save_tool_usage(
        question="What are the top 10 customers by revenue?",
        tool_name="sql_query",
        args={"sql": "SELECT customer_name, SUM(amount) as total FROM orders GROUP BY customer_name ORDER BY total DESC LIMIT 10"},
        context=context,
        success=True
    )
    
    # 5. 搜索相似使用
    results = await memory.search_similar_usage(
        question="sales statistics",
        context=context,
        limit=5
    )
    
    print(f"Found {len(results)} similar tool usages:")
    for result in results:
        print(f"  - {result.memory.question} (score: {result.similarity_score:.2f})")
    
    # 6. 获取最近的记忆
    recent = await memory.get_recent_memories(context, limit=5)
    print(f"\nRecent memories: {len(recent)}")
    
    # 7. 保存文本记忆
    text_mem = await memory.save_text_memory(
        content="用户偏好使用图表展示销售数据",
        context=context
    )
    print(f"Text memory created: {text_mem.memory_id}")
    
    # 8. 关闭资源
    memory.close()


def example_with_ollama():
    """使用 Ollama 本地模型示例"""
    
    config = Mem0OSSConfig(
        embedder=EmbedderConfig(
            provider="ollama",
            model="nomic-embed-text",
            base_url="http://localhost:11434"  # Ollama 默认地址
        ),
        llm=LLMConfig(
            provider="ollama",
            model="llama3.2",
            base_url="http://localhost:11434"
        ),
        vector_store=VectorStoreConfig(
            provider="chroma",  # 使用 ChromaDB 本地存储
            persist_directory="./mem0_data"
        )
    )
    
    memory = Mem0AgentMemory(config=config)
    
    # ... 使用方式同上
    
    memory.close()


def example_with_qdrant():
    """使用 Qdrant 示例"""
    
    config = Mem0OSSConfig(
        embedder=EmbedderConfig(
            provider="openai",
            model="text-embedding-3-small",
            api_key="sk-your-openai-key"
        ),
        llm=LLMConfig(
            provider="openai",
            model="gpt-4o-mini",
            api_key="sk-your-openai-key"
        ),
        vector_store=VectorStoreConfig(
            provider="qdrant",
            collection_name="my_agent_memory",
            qdrant_url="http://localhost:6333",
            qdrant_api_key="your-qdrant-api-key"  # 如果需要
        )
    )
    
    memory = Mem0AgentMemory(config=config)
    memory.close()


def example_with_reranker():
    """使用 Reranker 增强搜索示例"""
    
    config = Mem0OSSConfig(
        embedder=EmbedderConfig(
            provider="openai",
            model="text-embedding-3-small",
            api_key="sk-your-openai-key"
        ),
        llm=LLMConfig(
            provider="openai",
            model="gpt-4o-mini",
            api_key="sk-your-openai-key"
        ),
        vector_store=VectorStoreConfig(
            provider="pgvector",
            host="localhost",
            port=5432,
            database="mem0",
            password="secret"
        ),
        reranker=RerankerConfig(
            provider="cohere",
            model="rerank-english-v2.0",
            api_key="your-cohere-key"
        )
    )
    
    memory = Mem0AgentMemory(
        config=config,
        enable_reranker=True  # 启用 reranker
    )
    memory.close()


async def context_manager_example():
    """使用上下文管理器示例"""
    
    config = Mem0OSSConfig(
        embedder=EmbedderConfig(
            provider="openai",
            model="text-embedding-3-small",
            api_key="sk-your-openai-key"
        ),
        llm=LLMConfig(
            provider="openai",
            model="gpt-4o-mini",
            api_key="sk-your-openai-key"
        ),
        vector_store=VectorStoreConfig(
            provider="pgvector",
            host="localhost",
            port=5432,
            database="mem0",
            password="secret"
        )
    )
    
    # 使用上下文管理器，自动关闭资源
    with Mem0AgentMemory(config=config) as memory:
        from QueryMind.core.tool import ToolContext
        from QueryMind.core.user.models import User
        
        user = User(id="user_001")
        context = ToolContext(
            user=user,
            conversation_id="session_001",
            request_id="req_001",
            agent_memory=memory,
            metadata={"agent_id": "test_agent"}
        )
        
        await memory.save_tool_usage(
            question="Test question",
            tool_name="test_tool",
            args={},
            context=context
        )


if __name__ == "__main__":
    print("Running basic example...")
    asyncio.run(basic_example())
