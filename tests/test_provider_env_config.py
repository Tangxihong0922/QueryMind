from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from my_agent import resolve_agent_llm_settings  # noqa: E402
from QueryMind.integrations.agentmemory import create_config_from_env  # noqa: E402
from QueryMind.integrations.schemamemory import Mem0VectorConfig  # noqa: E402
from mem0.configs.llms.openai import OpenAIConfig  # noqa: E402


def test_deepseek_agent_and_siliconflow_memory_are_separate(monkeypatch) -> None:
    monkeypatch.setenv("DEEPSEEK_API_KEY", "test-deepseek-key")
    monkeypatch.setenv("SILICONFLOW_API_KEY", "test-siliconflow-key")
    monkeypatch.setenv("AGENT_LLM_MODEL", "deepseek-v4-flash")
    monkeypatch.setenv("AGENT_LLM_BASE_URL", "https://api.deepseek.com")
    monkeypatch.setenv("MEM0_EMBEDDER_MODEL", "BAAI/bge-m3")
    monkeypatch.setenv("MEM0_EMBEDDER_BASE_URL", "https://api.siliconflow.cn/v1")
    monkeypatch.setenv("MEM0_EMBEDDING_DIM", "1024")
    monkeypatch.setenv("MEM0_EMBEDDER_SEND_DIMENSIONS", "false")
    monkeypatch.setenv("MEM0_LLM_MODEL", "Qwen/Qwen3-8B")
    monkeypatch.setenv("MEM0_LLM_BASE_URL", "https://api.siliconflow.cn/v1")
    monkeypatch.setenv("EMBEDDING_MODEL", "BAAI/bge-m3")
    monkeypatch.setenv("EMBEDDING_BASE_URL", "https://api.siliconflow.cn/v1")
    monkeypatch.setenv("EMBEDDING_DIM", "1024")
    monkeypatch.setenv("EMBEDDING_SEND_DIMENSIONS", "false")
    monkeypatch.setenv("LLM_MODEL", "Qwen/Qwen3-8B")
    monkeypatch.setenv("LLM_BASE_URL", "https://api.siliconflow.cn/v1")

    model, api_key, base_url, extra_body = resolve_agent_llm_settings()
    agent_memory = create_config_from_env()
    schema_memory = Mem0VectorConfig.from_env()

    assert model == "deepseek-v4-flash"
    assert api_key == "test-deepseek-key"
    assert base_url == "https://api.deepseek.com"
    assert extra_body == {"thinking": {"type": "disabled"}}
    assert agent_memory.embedder.api_key == "test-siliconflow-key"
    assert agent_memory.embedder.embedding_dims == 1024
    assert agent_memory.embedder.send_embedding_dims is False
    assert agent_memory.llm.api_key == "test-siliconflow-key"
    agent_llm_config = agent_memory.llm.to_mem0_config()["config"]
    assert agent_llm_config["openai_base_url"] == "https://api.siliconflow.cn/v1"
    OpenAIConfig(**agent_llm_config)
    assert schema_memory.embedder.api_key == "test-siliconflow-key"
    assert schema_memory.embedder.embedding_dims == 1024
    assert schema_memory.embedder.send_embedding_dims is False
    assert schema_memory.llm is not None
    assert schema_memory.llm.api_key == "test-siliconflow-key"
    schema_llm_config = schema_memory.llm.to_mem0_config()["config"]
    assert schema_llm_config["openai_base_url"] == "https://api.siliconflow.cn/v1"
    OpenAIConfig(**schema_llm_config)
    agent_memory_payload = agent_memory.to_mem0_dict()
    schema_memory_payload = schema_memory.to_mem0_config()
    assert "embedding_dims" not in agent_memory_payload["embedder"]["config"]
    assert "embedding_dims" not in schema_memory_payload["embedder"]["config"]
    assert agent_memory_payload["vector_store"]["config"]["embedding_model_dims"] == 1024
    assert schema_memory_payload["vector_store"]["config"]["embedding_model_dims"] == 1024


def test_explicit_component_keys_override_shared_key(monkeypatch) -> None:
    for name in ("LLM_PROVIDER", "LLM_MODEL", "LLM_BASE_URL"):
        monkeypatch.delenv(name, raising=False)

    monkeypatch.setenv("SILICONFLOW_API_KEY", "shared-key")
    monkeypatch.setenv("MEM0_EMBEDDER_API_KEY", "memory-embedder-key")
    monkeypatch.setenv("MEM0_LLM_API_KEY", "memory-llm-key")
    monkeypatch.setenv("EMBEDDING_API_KEY", "schema-embedder-key")
    monkeypatch.setenv("LLM_API_KEY", "schema-llm-key")

    agent_memory = create_config_from_env()
    schema_memory = Mem0VectorConfig.from_env()

    assert agent_memory.embedder.api_key == "memory-embedder-key"
    assert agent_memory.llm.api_key == "memory-llm-key"
    assert schema_memory.embedder.api_key == "schema-embedder-key"
    assert schema_memory.llm is not None
    assert schema_memory.llm.api_key == "schema-llm-key"
