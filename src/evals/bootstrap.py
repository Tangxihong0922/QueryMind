"""Shared bootstrap helpers for evaluation entry points."""

from __future__ import annotations

import hashlib
import logging
import os
import sys
import threading
from pathlib import Path
from typing import Optional

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parents[1]
SRC_DIR = REPO_ROOT / "src"
DEFAULT_OUTPUT_ROOT = REPO_ROOT / "eval_output"
DEFAULT_RESULTS_ROOT = DEFAULT_OUTPUT_ROOT / "eval_results"
DEFAULT_DATASET_PATH = SRC_DIR / "evals" / "datasets" / "basic.yaml"
DEFAULT_RESUME_ROOT = DEFAULT_OUTPUT_ROOT / "resume_points"
DEFAULT_REPORT_ROOT = DEFAULT_RESULTS_ROOT

if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from dotenv import load_dotenv
from tqdm import tqdm

from QueryMind.core.evaluation import EvaluationRuntime
from QueryMind.core.llm import LlmService
from QueryMind.core.recovery import ExponentialBackoffStrategy
from QueryMind.integrations.llmservice import AnthropicLlmService, OpenAILlmService


def load_environment() -> None:
    """Load the repo-local .env file."""
    load_dotenv(REPO_ROOT / ".env", override=True)


def resolve_env_path(name: str, default: Path) -> Path:
    raw_value = os.getenv(name)
    if not raw_value:
        return default

    path = Path(raw_value).expanduser()
    if path.is_absolute():
        return path
    return (REPO_ROOT / path).resolve()


def should_show_progress() -> bool:
    mode = os.getenv("EVAL_PROGRESS", "auto").strip().lower()
    if mode in {"0", "false", "off", "no", "disable", "disabled"}:
        return False
    if mode in {"1", "true", "on", "yes", "enable", "enabled"}:
        return True
    return sys.stderr.isatty() or sys.stdout.isatty()


class TqdmProgressReporter:
    """Terminal progress reporter for agent and judge phases."""

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._agent_bar = None
        self._judge_bar = None
        self._agent_failures = 0
        self._judge_failures = 0

    def set_totals(
        self,
        *,
        agent_total: int,
        judge_total: int,
        evaluator_names: list[str],
        agent_initial: int = 0,
        judge_initial: int = 0,
    ) -> None:
        judge_desc = "Judge"
        if evaluator_names:
            judge_desc = f"Judge ({', '.join(evaluator_names)})"

        self._agent_bar = tqdm(
            total=agent_total,
            initial=agent_initial,
            desc="Agent",
            position=0,
            leave=True,
            dynamic_ncols=True,
            file=sys.stderr,
        )
        self._judge_bar = tqdm(
            total=judge_total,
            initial=judge_initial,
            desc=judge_desc,
            position=1,
            leave=True,
            dynamic_ncols=True,
            file=sys.stderr,
        )

    def on_agent_done(self, test_case, agent_result) -> None:
        with self._lock:
            if self._agent_bar is None:
                return
            if getattr(agent_result, "error", None):
                self._agent_failures += 1
            self._agent_bar.update(1)
            if self._agent_failures:
                self._agent_bar.set_postfix(fail=self._agent_failures, refresh=False)

    def on_evaluator_done(self, test_case, evaluator_name, result) -> None:
        with self._lock:
            if self._judge_bar is None:
                return
            if not getattr(result, "passed", False):
                self._judge_failures += 1
            self._judge_bar.update(1)
            if self._judge_failures:
                self._judge_bar.set_postfix(fail=self._judge_failures, refresh=False)

    def close(self) -> None:
        with self._lock:
            if self._agent_bar is not None:
                self._agent_bar.close()
                self._agent_bar = None
            if self._judge_bar is not None:
                self._judge_bar.close()
                self._judge_bar = None


class _TqdmLoggingHandler(logging.StreamHandler):
    """Log handler that plays nicely with tqdm progress bars."""

    def emit(self, record: logging.LogRecord) -> None:
        try:
            msg = self.format(record)
            tqdm.write(msg, file=self.stream)
            self.flush()
        except Exception:
            self.handleError(record)


def configure_logging(log_file: Optional[Path] = None) -> None:
    """Configure console and optional file logging for evaluation scripts."""
    console_level_name = (
        os.getenv("EVAL_CONSOLE_LOG_LEVEL")
        or os.getenv("EVAL_LOG_LEVEL")
        or os.getenv("LOG_LEVEL")
        or "WARNING"
    )
    console_level_name = console_level_name.strip().upper()
    console_level = getattr(logging, console_level_name, logging.WARNING)
    file_level_name = os.getenv("EVAL_FILE_LOG_LEVEL") or "DEBUG"
    file_level_name = file_level_name.strip().upper()
    file_level = getattr(logging, file_level_name, logging.DEBUG)

    root = logging.getLogger()
    root.handlers.clear()
    root.setLevel(logging.DEBUG)

    formatter = logging.Formatter("%(asctime)s %(levelname)s %(name)s: %(message)s")
    if should_show_progress():
        console_handler: logging.Handler = _TqdmLoggingHandler(stream=sys.stderr)
    else:
        console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    console_handler.setLevel(console_level)
    root.addHandler(console_handler)

    if log_file is not None:
        log_file.parent.mkdir(parents=True, exist_ok=True)
        file_handler = logging.FileHandler(log_file, encoding="utf-8")
        file_handler.setFormatter(formatter)
        file_handler.setLevel(file_level)
        root.addHandler(file_handler)

    noisy_loggers = [
        "httpx",
        "httpcore",
        "neo4j",
        "neo4j.notifications",
        "anthropic",
        "anthropic._base_client",
        "openai",
        "openai._base_client",
        "mem0",
        "urllib3",
        "QueryMind.core.agent.agent",
        "QueryMind.integrations.llmservice.anthropic.llm",
        "QueryMind.integrations.llmservice.openai.llm",
        "QueryMind.integrations.llmservice.openai.responses",
        "QueryMind.integrations.schemamemory.vector_layer.vector_store",
        "QueryMind.tools.schema_retrieve",
    ]
    for name in noisy_loggers:
        logging.getLogger(name).setLevel(logging.WARNING)


def build_recovery_strategy() -> ExponentialBackoffStrategy:
    """Build the shared evaluation recovery strategy from env."""
    return ExponentialBackoffStrategy(
        max_retries=int(os.getenv("EVAL_RECOVERY_MAX_RETRIES", "5")),
        base_delay_ms=int(os.getenv("EVAL_RECOVERY_BASE_DELAY_MS", "1000")),
        max_delay_ms=int(os.getenv("EVAL_RECOVERY_MAX_DELAY_MS", "30000")),
        include_jitter=os.getenv("EVAL_RECOVERY_INCLUDE_JITTER", "true").lower()
        == "true",
    )


def build_llm_service(
    prefix: str,
    recovery_strategy: ExponentialBackoffStrategy | None = None,
    provider: str | None = None,
) -> LlmService:
    """Build an LLM client from env."""
    provider = (
        provider
        or os.getenv(f"{prefix}_LLM_PROVIDER")
        or os.getenv("LLM_PROVIDER")
        or "minimax"
    ).strip().lower()

    model = os.getenv(f"{prefix}_MODEL")
    api_key = os.getenv(f"{prefix}_API_KEY")
    base_url = os.getenv(f"{prefix}_BASE_URL")

    if provider in {"minimax", "anthropic"}:
        if not model:
            model = os.getenv("MINIMAX_LLM_MODEL", "Minimax-M2.7")
        if not api_key:
            api_key = os.getenv("MINIMAX_API_KEY", "")
        if not base_url:
            base_url = os.getenv("MINIMAX_BASE_URL", "https://api.minimaxi.com/anthropic")
        if not base_url:
            base_url = "https://api.minimaxi.com/anthropic"
        return AnthropicLlmService(
            model=model,
            api_key=api_key,
            base_url=base_url,
            error_recovery_strategy=recovery_strategy,
        )

    if provider == "deepseek":
        if not model:
            model = os.getenv("DEEPSEEK_LLM_MODEL", "deepseek-v4-flash")
        if not api_key:
            api_key = os.getenv("DEEPSEEK_API_KEY", "")
        if not base_url:
            base_url = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com")

        return OpenAILlmService(
            model=model,
            api_key=api_key,
            base_url=base_url,
            error_recovery_strategy=recovery_strategy,
            extra_body={"thinking": {"type": "disabled"}},
        )

    if provider == "openai":
        if not model:
            model = os.getenv("OPENAI_LLM_MODEL", "gpt-5.4-mini")
        if not api_key:
            api_key = os.getenv("OPENAI_API_KEY", "")
        if not base_url:
            base_url = os.getenv("OPENAI_BASE_URL", "https://api.ikuncode.cc/v1")

        return OpenAILlmService(
            model=model,
            api_key=api_key,
            base_url=base_url,
            error_recovery_strategy=recovery_strategy,
        )

    raise ValueError(f"Unsupported LLM provider: {provider!r}")


def resolve_evaluation_providers(cli_provider: str | None = None) -> tuple[str, str]:
    """Resolve the agent and judge providers for an evaluation run.

    CLI `--provider` or `EVAL_PROVIDER` overrides both sides.
    Otherwise, the per-role env vars are honored.
    """
    override = (cli_provider or os.getenv("EVAL_PROVIDER") or "").strip().lower()
    if override:
        if override not in {"deepseek", "minimax", "openai"}:
            raise ValueError("Provider must be in 'deepseek','minimax' or 'openai'")
        return override, override

    agent_provider = (
        os.getenv("EVAL_AGENT_LLM_PROVIDER") or "minimax"
    ).strip().lower()
    judge_provider = (
        os.getenv("EVAL_JUDGE_LLM_PROVIDER") or agent_provider
    ).strip().lower()

    for provider in (agent_provider, judge_provider):
        if provider not in {"deepseek", "minimax", "openai"}:
            raise ValueError(
                f"Unsupported evaluation provider: {provider!r}"
            )

    return agent_provider, judge_provider


def build_runtime_from_env(provider: str | None = None) -> EvaluationRuntime:
    """Build a single evaluation runtime from environment variables."""
    from QueryMind.integrations.schemamemory import (
        Mem0VectorConfig,
        Neo4jConfig,
        Neo4jMem0SchemaMemory,
    )

    database_id = os.getenv("EVAL_DATABASE_ID", "adventureworks")
    dialect = os.getenv("EVAL_DB_DIALECT", "postgres").lower()
    schema_sync_mode = os.getenv("EVAL_SCHEMA_SYNC_MODE", "sync").strip().lower()
    if schema_sync_mode not in {"sync", "reuse_existing"}:
        raise ValueError(
            "EVAL_SCHEMA_SYNC_MODE must be either 'sync' or 'reuse_existing'"
        )

    recovery_strategy = build_recovery_strategy()
    agent_llm = build_llm_service(
        "EVAL_AGENT",
        recovery_strategy=recovery_strategy,
        provider=provider,
    )
    max_tool_iterations = int(os.getenv("EVAL_MAX_TOOL_ITERATIONS", "25"))
    business_schemas = ["person", "humanresources", "production", "purchasing", "sales"]

    neo4j_config = Neo4jConfig.from_env()
    mem0_config = Mem0VectorConfig.from_env()
    schema_memory = Neo4jMem0SchemaMemory(
        neo4j_config=neo4j_config,
        mem0_config=mem0_config,
    )

    schema_extractor = None

    if dialect == "sqlite":
        from QueryMind.integrations.schemaextractor import SqliteSchemaExtractor
        from QueryMind.integrations.sqlrunner import SqliteRunner

        if not os.getenv("EVAL_SQLITE_DATABASE_PATH"):
            raise ValueError("EVAL_SQLITE_DATABASE_PATH is required for sqlite")
        database_path = resolve_env_path(
            "EVAL_SQLITE_DATABASE_PATH",
            REPO_ROOT / "evaluation.sqlite",
        )
        sql_runner = SqliteRunner(database_path=database_path)
        if schema_sync_mode == "sync":
            schema_extractor = SqliteSchemaExtractor(database_path=database_path)
    elif dialect == "mssql":
        from QueryMind.integrations.schemaextractor import MSSQLSchemaExtractor
        from QueryMind.integrations.sqlrunner import MSSQLRunner

        odbc_conn_str = os.getenv("EVAL_MSSQL_ODBC_CONN_STR")
        if not odbc_conn_str:
            raise ValueError("EVAL_MSSQL_ODBC_CONN_STR is required for mssql")
        sql_runner = MSSQLRunner(odbc_conn_str=odbc_conn_str)
        if schema_sync_mode == "sync":
            schema_extractor = MSSQLSchemaExtractor(odbc_conn_str=odbc_conn_str)
    else:
        from QueryMind.integrations.schemaextractor import PostgresSchemaExtractor
        from QueryMind.integrations.sqlrunner import PostgresRunner

        connection_string = os.getenv("EVAL_POSTGRES_CONNECTION_STRING")
        if connection_string:
            sql_runner = PostgresRunner(connection_string=connection_string)
            if schema_sync_mode == "sync":
                schema_extractor = PostgresSchemaExtractor(
                    connection_string=connection_string,
                    allowed_schemas=business_schemas,
                )
        else:
            host = os.getenv("EVAL_POSTGRES_HOST", "localhost")
            port = int(os.getenv("EVAL_POSTGRES_PORT", "5432"))
            database = os.getenv("EVAL_POSTGRES_DATABASE")
            user = os.getenv("EVAL_POSTGRES_USER")
            password = os.getenv("EVAL_POSTGRES_PASSWORD")
            if not database or not user:
                raise ValueError(
                    "EVAL_POSTGRES_DATABASE and EVAL_POSTGRES_USER are required for postgres"
                )
            sql_runner = PostgresRunner(
                host=host,
                port=port,
                database=database,
                user=user,
                password=password,
            )
            if schema_sync_mode == "sync":
                schema_extractor = PostgresSchemaExtractor(
                    host=host,
                    port=port,
                    database=database,
                    user=user,
                    password=password,
                    allowed_schemas=business_schemas,
                )

    runtime = EvaluationRuntime(
        database_id=database_id,
        dialect=dialect,
        sql_runner=sql_runner,
        schema_extractor=schema_extractor,
        agent_llm_service=agent_llm,
        schema_memory=schema_memory,
        schema_sync_mode=schema_sync_mode,
        allow_write_sql=os.getenv("EVAL_ALLOW_WRITE_SQL", "false").lower() == "true",
    )
    runtime.agent_config.max_tool_iterations = max_tool_iterations
    return runtime


def dataset_hash(path: Path) -> str:
    """Compute a stable hash for a dataset file."""
    digest = hashlib.sha256()
    with open(path, "rb") as handle:
        for chunk in iter(lambda: handle.read(65536), b""):
            digest.update(chunk)
    return digest.hexdigest()
