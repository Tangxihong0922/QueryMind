"""QueryMind backend launcher."""

from __future__ import annotations

import os
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
SRC_DIR = SCRIPT_DIR / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from QueryMind.runtime_paths import load_repo_env, resolve_data_dir

load_repo_env()

CONVERSATIONS_DIR = resolve_data_dir("QUERYMIND_CONVERSATIONS_DIR", "conversations")
QUERY_RESULTS_DIR = resolve_data_dir("QUERYMIND_QUERY_RESULTS_DIR", "query_results")
MAX_TOOL_ITERATIONS = int(os.getenv("MAX_TOOL_ITERATIONS", "25"))

from QueryMind.core import Agent, AgentConfig, ToolRegistry  # noqa: E402
from QueryMind.core.agent import (  # noqa: E402
    build_schema_governance_stack,
    build_sql_governance_stack,
)
from QueryMind.core.enhancer import (  # noqa: E402
    CompositeLlmContextEnhancer,
    DefaultLlmContextEnhancer,
    SchemaContextEnhancer,
)
from QueryMind.core.enricher import SchemaRetrieveContextEnricher  # noqa: E402
from QueryMind.core.recovery import ExponentialBackoffStrategy  # noqa: E402
from QueryMind.core.user import RequestContext, User, UserResolver  # noqa: E402
from QueryMind.core.workflow import (  # noqa: E402
    CompositeWorkflowHandler,
    DefaultWorkflowHandler,
    SchemaInitWorkflow,
    SchemaManagementWorkflow,
)
from QueryMind.capabilities import SchemaSyncEngine  # noqa: E402
from QueryMind.capabilities.schema_management import (  # noqa: E402
    build_enrich_response_format,
)
from QueryMind.integrations.agentmemory import (  # noqa: E402
    Mem0AgentMemory,
    create_config_from_env,
)
from QueryMind.integrations.auditlogger import PostgresAuditLogger  # noqa: E402
from QueryMind.integrations.llmservice import OpenAILlmService  # noqa: E402
from QueryMind.integrations.local import FileSystemConversationStore  # noqa: E402
from QueryMind.integrations.observer import PrometheusObservabilityProvider  # noqa: E402
from QueryMind.integrations.schemamemory import (  # noqa: E402
    Mem0VectorConfig,
    Neo4jConfig,
    Neo4jMem0SchemaMemory,
)
from QueryMind.integrations.schemamanagement import (  # noqa: E402
    Neo4jMem0SchemaManagementService,
)
from QueryMind.integrations.schemaextractor import PostgresSchemaExtractor  # noqa: E402
from QueryMind.integrations.sqlrunner import PostgresRunner  # noqa: E402
from QueryMind.server.fastapi import QueryMindFastAPIServer  # noqa: E402
from QueryMind.tools import (  # noqa: E402
    ListFilesTool,
    PipInstallTool,
    LocalFileSystem,
    ReadFileTool,
    RunPythonFileTool,
    RunSqlTool,
    SaveQuestionToolArgsTool,
    SaveTextMemoryTool,
    SchemaRetrieveTool,
    SearchFilesTool,
    SearchSavedCorrectToolUsesTool,
    VisualizeDataTool,
    WriteFileTool,
)
from QueryMind.rls_registry import RLSToolRegistry  # noqa: E402


BUSINESS_SCHEMAS = ["person", "humanresources", "production", "purchasing", "sales"]
DEEPSEEK_EXTRA_BODY = {"thinking": {"type": "disabled"}}
DEFAULT_AGENT_HOST = os.getenv("QUERYMIND_AGENT_HOST", "0.0.0.0")
DEFAULT_AGENT_PORT = int(os.getenv("QUERYMIND_AGENT_PORT", "8000"))


class SimpleUserResolver(UserResolver):
    async def resolve_user(self, request_context: RequestContext) -> User:
        return User(
            id="admin",
            username="Xihong",
            email="admin@querymind",
            group_memberships=["admin", "user"],
        )


def register_tools(registry: ToolRegistry, schema_memory: Neo4jMem0SchemaMemory) -> None:
    results_file_system = LocalFileSystem(working_directory=str(QUERY_RESULTS_DIR))

    core_tools = [
        (
            RunSqlTool(
                sql_runner=PostgresRunner(
                    host="127.0.0.1",
                    port="5432",
                    database="adventureworks",
                    user="querymind",
                    password="querymind",
                ),
                file_system=results_file_system,
            ),
            ["user", "admin"],
        ),
        (SchemaRetrieveTool(schema_memory=schema_memory), ["user", "admin"]),
    ]
    memory_tools = [
        (SaveQuestionToolArgsTool(), ["user", "admin"]),
        (SearchSavedCorrectToolUsesTool(), ["user", "admin"]),
        (SaveTextMemoryTool(), ["user", "admin"]),
    ]
    python_tools = [
        (RunPythonFileTool(), ["admin"]),
        (PipInstallTool(), ["admin"]),
    ]
    file_tools = [
        (ListFilesTool(), ["admin"]),
        (SearchFilesTool(), ["admin"]),
        (ReadFileTool(), ["admin"]),
        (WriteFileTool(), ["admin"]),
    ]
    visualize_tools = [(VisualizeDataTool(file_system=results_file_system), ["admin"])]

    for tool_list in [core_tools, memory_tools, python_tools, file_tools, visualize_tools]:
        for tool, groups in tool_list:
            registry.register_local_tool(tool, access_groups=groups)


def build_agent() -> Agent:
    recovery_strategy = ExponentialBackoffStrategy()

    llm_service = OpenAILlmService(
        model="deepseek-v4-flash",
        api_key=os.getenv("DEEPSEEK_API_KEY"),
        base_url=os.getenv("DEEPSEEK_BASE_URL"),
        error_recovery_strategy=recovery_strategy,
        extra_body=DEEPSEEK_EXTRA_BODY,
    )
    schema_enrich_llm_service = OpenAILlmService(
        model="deepseek-v4-flash",
        api_key=os.getenv("DEEPSEEK_API_KEY"),
        base_url=os.getenv("DEEPSEEK_BASE_URL"),
        response_format=build_enrich_response_format(),
        error_recovery_strategy=recovery_strategy,
        extra_body=DEEPSEEK_EXTRA_BODY,
    )

    agent_memory = Mem0AgentMemory(config=create_config_from_env())
    schema_memory = Neo4jMem0SchemaMemory(
        neo4j_config=Neo4jConfig.from_env(),
        mem0_config=Mem0VectorConfig.from_env(),
    )

    schema_management_service = Neo4jMem0SchemaManagementService(
        schema_memory=schema_memory,
        llm_service=llm_service,
        structured_llm_service=schema_enrich_llm_service,
    )

    workflow_handler = CompositeWorkflowHandler(
        [
            DefaultWorkflowHandler(),
            SchemaInitWorkflow(
                schema_sync_engine=SchemaSyncEngine(
                    schema_memory,
                    agent_memory,
                    request_delay=1.0,
                    save_retry_attempts=3,
                    save_retry_delay=1.0,
                    max_consecutive_failures=5,
                    max_consecutive_same_errors=3,
                    max_consecutive_transient_failures=8,
                    resume_existing_tables=True,
                ),
                extractor=PostgresSchemaExtractor(
                    host="127.0.0.1",
                    port="5432",
                    database="adventureworks",
                    user="querymind",
                    password="querymind",
                    allowed_schemas=BUSINESS_SCHEMAS,
                ),
            ),
            SchemaManagementWorkflow(schema_management_service=schema_management_service),
        ]
    )

    schema_governance = build_schema_governance_stack()
    sql_governance = build_sql_governance_stack()
    enhancer = CompositeLlmContextEnhancer(
        [
            schema_governance.enhancer,
            SchemaContextEnhancer(),
            DefaultLlmContextEnhancer(agent_memory=agent_memory),
        ]
    )

    conversation_store = FileSystemConversationStore(base_dir=str(CONVERSATIONS_DIR))
    context_enrichers = [
        SchemaRetrieveContextEnricher(conversation_store=conversation_store)
    ]

    registry = RLSToolRegistry(
        audit_logger=PostgresAuditLogger(
            host="127.0.0.1",
            port=5432,
            database="postgres",
            user="querymind",
            password="querymind",
            table_name="audit_events",
            schema_name="public",
        ),
    )
    register_tools(registry, schema_memory)

    agent_config = AgentConfig(
        max_tool_iterations=MAX_TOOL_ITERATIONS,
        schema_search_default_threshold=0.4,
    )

    return Agent(
        llm_service=llm_service,
        tool_registry=registry,
        user_resolver=SimpleUserResolver(),
        agent_memory=agent_memory,
        config=agent_config,
        schema_memory=schema_memory,
        schema_management_service=schema_management_service,
        conversation_store=conversation_store,
        workflow_handler=workflow_handler,
        hooks=[schema_governance.hook, sql_governance.hook],
        llm_middlewares=[schema_governance.middleware, sql_governance.middleware],
        llm_context_enhancer=enhancer,
        context_enrichers=context_enrichers,
        error_recovery_strategy=recovery_strategy,
        schema_governance_manager=schema_governance.manager,
        observability_provider=PrometheusObservabilityProvider(),
    )


def main() -> None:
    import argparse

    parser = argparse.ArgumentParser(description="Run the QueryMind backend server")
    parser.add_argument("--host", default=DEFAULT_AGENT_HOST, help="Backend bind host")
    parser.add_argument("--port", type=int, default=DEFAULT_AGENT_PORT, help="Backend port")
    args = parser.parse_args()

    agent = build_agent()
    server = QueryMindFastAPIServer(agent)
    print(f"✅ Server started on {args.host}:{args.port}")
    server.run(host=args.host, port=args.port)


if __name__ == "__main__":
    main()
