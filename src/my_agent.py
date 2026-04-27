"""
QueryMind Agent - Main Entry Point

FILE DESCRIPTION
This file configures and launches the QueryMind SQL Query Agent. QueryMind is
a modular framework for building LLM-powered agents specialized in natural
language to SQL translation with RAG capabilities.

ARCHITECTURE OVERVIEW

1. LLM Service (AnthropicLlmService)
   - Handles LLM communication with MiniMax-M2.7 model
   
2. Agent Memory (Mem0AgentMemory)
   - Persistent memory for storing and retrieving Q&A interactions
   - Uses PgVector for vector storage
   
3. Schema Memory (Neo4jMem0SchemaMemory)
   - Stores database schema in hybrid vector + graph structure
   - Neo4j: Graph relationships (tables, foreign keys)
   - PgVector: Semantic search for natural language queries
   
4. Tool Registry (RLSToolRegistry)
   - SQL injection prevention via pattern matching
   - Territory-based Row-Level Security (RLS)
   - Tool access control by user groups

5. Workflow Handler
   - SchemaInitWorkflow: /init_schema command for schema sync
   - SchemaManagementWorkflow: Admin schema operations

CONTEXT ENHANCEMENT PIPELINE

Enhancers (LLM Context):
  - SchemaContextEnhancer: Injects schema retrieval rules into system prompt
    * Search mode selection rules (hybrid/vector/graph/expand)
    * Tool usage guidelines
  - DefaultLlmContextEnhancer: Injects agent memory (Text Memory) into LLM context

Enrichers (Tool Context):
  - SchemaRetrieveContextEnricher: Injects expand mode context
    * Retrieves conversation history from FileSystemConversationStore
    * Extracts seed_tables from previous schema_retrieve results
    * Enables iterative schema exploration

SCHEMA MANAGEMENT

Neo4jMem0SchemaManagementService:
  - Admin operations for schema memory
  - Uses LLM for auto-generating table descriptions
  - Manages schema metadata and business context

Schema Context Enhancer:
  - Injects search mode rules into LLM prompts
  - Supports 4 search modes:
    * hybrid: Balanced (default) - vector + graph
    * vector: Semantic similarity search
    * graph: FK relationship exploration
    * expand: Seed-based table expansion

ERROR RECOVERY

ExponentialBackoffStrategy:
  - Transient error handling with retry logic
  - Delay sequence: 1s -> 2s -> 4s -> ... (exponential)
  - Max retries: 3 (configurable)
  - Jitter: Random 0-50% to prevent thundering herd
  - Max delay cap: 30 seconds

AUDIT & OBSERVABILITY

Audit Logger (PostgresAuditLogger):
  - Lazy initialization (connects on first use)
  - Logs: tool access, invocations, results
  - Stores in PostgreSQL with indexes
  - Configurable via constructor parameters

Observability (PrometheusObservabilityProvider):
  - Spans: Request tracing
  - Metrics: Performance monitoring
  - Prometheus-compatible export

AVAILABLE TOOLS
Core Tools (user, admin):
  - run_sql: Execute SQL queries
  - schema_retrieve: Retrieve schema information

Memory Tools (user, admin):
  - save_question_tool_args: Save correct Q&A pairs
  - search_saved_correct_tool_uses: Search saved examples
  - save_text_memory: Save text to memory

Python Tools (admin only):
  - run_python_file: Execute Python files
  - pip_install: Install Python packages

File Tools (admin only):
  - list_files, search_files, read_file, write_file

Visualization Tools (admin only):
  - visualize_data: Generate data visualizations

CONFIGURATION REQUIREMENTS
1. PostgresRunner: connection_string OR (host, port, database, user, password)
2. PostgresSchemaExtractor: connection_string OR individual params
3. PostgresAuditLogger: password must be set for postgres user
4. Mem0: MEM0_PGVECTOR_* or PGVECTOR_*, OPENAI_API_KEY
5. Neo4j: NEO4J_PASSWORD

See .env.example for all environment variables.

LAUNCH INSTRUCTIONS
1. cp .env.example .env && edit .env
2. pip install -r requirements.txt
3. python my_agent.py

Server starts on http://0.0.0.0:8000
"""
import sys
import os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"), override=True)

# 添加 src 目录到 Python 路径，以便直接导入 QueryMind 本地模块
sys.path.insert(0, BASE_DIR)

# Tool loop ceiling for long-running tasks.
# Adjust here, or override with MAX_TOOL_ITERATIONS in the environment.
MAX_TOOL_ITERATIONS = int(os.getenv("MAX_TOOL_ITERATIONS", "25"))

from QueryMind.core import Agent, AgentConfig, ToolRegistry
from QueryMind.core.agent import build_schema_governance_stack, build_sql_governance_stack
from QueryMind.core.user import User, UserResolver, RequestContext
from QueryMind.core.workflow import DefaultWorkflowHandler, SchemaInitWorkflow, SchemaManagementWorkflow,CompositeWorkflowHandler
from QueryMind.core.enhancer import SchemaContextEnhancer, DefaultLlmContextEnhancer, CompositeLlmContextEnhancer
from QueryMind.core.enricher import SchemaRetrieveContextEnricher
from QueryMind.core.recovery import ExponentialBackoffStrategy
from QueryMind.capabilities import SchemaSyncEngine
from QueryMind.capabilities.schema_management import (
    build_enrich_output_config,
    build_enrich_response_format,
)
from QueryMind.integrations.llmservice import AnthropicLlmService, OpenAILlmService
from QueryMind.integrations.local import FileSystemConversationStore
from QueryMind.integrations.sqlrunner import PostgresRunner
from QueryMind.integrations.agentmemory import Mem0AgentMemory, create_config_from_env
from QueryMind.integrations.schemamemory import Neo4jConfig, Mem0VectorConfig, Neo4jMem0SchemaMemory
from QueryMind.integrations.schemaextractor import PostgresSchemaExtractor
from QueryMind.integrations.schemamanagement import Neo4jMem0SchemaManagementService
from QueryMind.integrations.observer import PrometheusObservabilityProvider
from QueryMind.integrations.auditlogger import PostgresAuditLogger

from QueryMind.tools import (
    # File system
    SearchFilesTool, 
    ListFilesTool, 
    ReadFileTool, 
    WriteFileTool,
    # Python tools
    PipInstallTool,
    RunPythonFileTool,
    # SQL
    RunSqlTool,
    # Visualization
    VisualizeDataTool,
    # Agent Memory
    SaveQuestionToolArgsTool, 
    SearchSavedCorrectToolUsesTool, 
    SaveTextMemoryTool,
    # Schema Retrieve
    SchemaRetrieveTool)

from QueryMind.server.fastapi import QueryMindFastAPIServer

# RLS Registry - extends ToolRegistry with SQL injection protection and Territory-based RLS
from rls_registry import RLSToolRegistry

BUSINESS_SCHEMAS = ["person", "humanresources", "production", "purchasing", "sales"]

# Recovery Strategy
recovery_strategy = ExponentialBackoffStrategy()
# DeepSeek Thinking Mode
DEEPSEEK_EXTRA_BODY = {"thinking": {"type": "disabled"}}

# LLM Service: Anthropic Compatible
llm_service = AnthropicLlmService(
    model="Minimax-M2.7",
    api_key=os.getenv("MINIMAX_API_KEY"),
    base_url=os.getenv("MINIMAX_BASE_URL"),
    error_recovery_strategy=recovery_strategy,
)
print("✅ LLM Service initialized")

# LLM Service: OpenAI Compatible
llm_service = OpenAILlmService(
    model="deepseek-v4-flash",
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url=os.getenv("DEEPSEEK_BASE_URL"),
    error_recovery_strategy=recovery_strategy,
    extra_body=DEEPSEEK_EXTRA_BODY,
)
print("✅ LLM Service initialized")

# Schema Enrich Service:
schema_enrich_llm_service = AnthropicLlmService(
    model="Minimax-M2.7",
    api_key=os.getenv("MINIMAX_API_KEY"),
    base_url=os.getenv("MINIMAX_BASE_URL"),
    default_output_config=build_enrich_output_config(),
    error_recovery_strategy=recovery_strategy,
)

schema_enrich_llm_service = OpenAILlmService(
    model="deepseek-v4-flash",
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url=os.getenv("DEEPSEEK_BASE_URL"),
    response_format=build_enrich_response_format(),
    error_recovery_strategy=recovery_strategy,
    extra_body=DEEPSEEK_EXTRA_BODY,
)
print("✅ Schema Enrich LLM Service initialized")

# User Resolver
class SimpleUserResolver(UserResolver):
    async def resolve_user(self, request_context: RequestContext) -> User:
        return User(
            id="admin",
            username="Xihong",
            email="admin@querymind",
            group_memberships=["admin", "user"],
        )
user_resolver = SimpleUserResolver()

# Agent Memory & Schema Memory
agent_mem = Mem0AgentMemory(config=create_config_from_env())
print("✅ Agent Memory initialized")
schema_mem = Neo4jMem0SchemaMemory(
    neo4j_config=Neo4jConfig.from_env(),
    mem0_config=Mem0VectorConfig.from_env(),
)
print("✅ Schema Memory initialized")

# Schema Management Service
schema_manage = Neo4jMem0SchemaManagementService(
    schema_memory=schema_mem,
    llm_service=llm_service,
    structured_llm_service=schema_enrich_llm_service,
)

# Workflow Handler
workflow_handler = CompositeWorkflowHandler([
    DefaultWorkflowHandler(),
    SchemaInitWorkflow(
        schema_sync_engine=SchemaSyncEngine(
            schema_mem,
            agent_mem,
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
        )),
    SchemaManagementWorkflow(schema_management_service=schema_manage)
])

# LLM Context Enhancer & Tool Context Enricher
schema_governance = build_schema_governance_stack()
sql_governance = build_sql_governance_stack()
enhancer = CompositeLlmContextEnhancer([
    schema_governance.enhancer,                 # 注入 schema 治理提示
    SchemaContextEnhancer(),                    # 注入 schema 检索规则和结果
    DefaultLlmContextEnhancer(agent_memory=agent_mem),      # 注入 Text Memory
])
enricher = [SchemaRetrieveContextEnricher(conversation_store=FileSystemConversationStore())]

# SQL Tool Setting
sql_runner = RunSqlTool(
    sql_runner=PostgresRunner(
        host="127.0.0.1",
        port="5432",
        database="adventureworks",
        user="querymind",
        password="querymind",
    )
)

# Observability
observability_provider = PrometheusObservabilityProvider()

# Audit Logger
audit_logger = PostgresAuditLogger(
    host="127.0.0.1",
    port=5432,
    database="postgres",
    user="querymind",
    password="querymind",  # Set your password here
    table_name="audit_events",
    schema_name="public",
)

# RLS-based Tool Registry 
registry = RLSToolRegistry(
    config_path="rls_config.yaml",
    audit_logger=audit_logger,
)
print("✅ Tool Registry initialized")

# Tools Register Function
def register_tools(registry: ToolRegistry):
    core_tools = [
        (sql_runner, ["user", "admin"]),
        (SchemaRetrieveTool(schema_memory=schema_mem), ["user", "admin"]),
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
    visualize_tool = [(VisualizeDataTool(), ["admin"])]

    for tool_list in [core_tools, memory_tools, python_tools, file_tools, visualize_tool]:
        for tool, groups in tool_list:
            registry.register_local_tool(tool, access_groups=groups)

# Create My Agent
agent_config = AgentConfig(
    max_tool_iterations=MAX_TOOL_ITERATIONS,
    schema_search_default_threshold=0.4 ,
)
agent = Agent(
    llm_service=llm_service,
    tool_registry=registry,
    user_resolver=user_resolver,
    agent_memory=agent_mem,
    config=agent_config,
    schema_memory=schema_mem,
    schema_management_service=schema_manage,
    conversation_store=FileSystemConversationStore(),
    workflow_handler=workflow_handler,
    hooks=[schema_governance.hook, sql_governance.hook],
    llm_middlewares=[schema_governance.middleware, sql_governance.middleware],
    llm_context_enhancer=enhancer,
    context_enrichers=enricher,
    error_recovery_strategy=recovery_strategy,
    schema_governance_manager=schema_governance.manager,
)

# Register Tools
register_tools(registry)

# Create FastAPI server
server = QueryMindFastAPIServer(agent)

# Run the server
print("✅ Server started on 0.0.0.0:8000")
server.run(host="0.0.0.0", port=8000)
