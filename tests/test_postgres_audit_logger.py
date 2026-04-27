from __future__ import annotations

import asyncio
import json
from contextlib import contextmanager
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from QueryMind.core.audit import ToolInvocationEvent, ToolResultEvent  # noqa: E402
from QueryMind.integrations.auditlogger import PostgresAuditLogger  # noqa: E402


class _DummyCursor:
    def __init__(self):
        self.executed = []

    def execute(self, sql, params):
        self.executed.append((sql, params))

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False


class _DummyConnection:
    def __init__(self):
        self.cursor_obj = _DummyCursor()
        self.commits = 0

    def cursor(self):
        return self.cursor_obj

    def commit(self):
        self.commits += 1


def test_postgres_audit_logger_persists_tool_fields():
    logger = PostgresAuditLogger.__new__(PostgresAuditLogger)
    logger.full_table_name = "public.audit_events"
    logger._table_initialized = True
    logger._pool = None
    dummy_conn = _DummyConnection()

    @contextmanager
    def fake_connection():
        yield dummy_conn

    logger._get_connection = fake_connection

    invocation = ToolInvocationEvent(
        user_id="u1",
        username="tester",
        user_email="tester@example.com",
        user_groups=["admin"],
        conversation_id="c1",
        request_id="r1",
        tool_call_id="call-1",
        tool_name="run_sql",
        parameters={"sql": "SELECT 1"},
        parameters_sanitized=False,
    )
    result = ToolResultEvent(
        user_id="u1",
        username="tester",
        user_email="tester@example.com",
        user_groups=["admin"],
        conversation_id="c1",
        request_id="r1",
        tool_call_id="call-1",
        tool_name="run_sql",
        success=True,
        error=None,
        execution_time_ms=12.5,
        result_size_bytes=32,
        ui_component_type="CardComponent",
    )

    asyncio.run(logger.log_event(invocation))
    asyncio.run(logger.log_event(result))

    invocation_params = dummy_conn.cursor_obj.executed[0][1]
    result_params = dummy_conn.cursor_obj.executed[1][1]

    assert json.loads(invocation_params[10])["tool_name"] == "run_sql"
    assert json.loads(invocation_params[10])["tool_call_id"] == "call-1"
    assert json.loads(invocation_params[10])["parameters"] == {"sql": "SELECT 1"}
    assert invocation_params[13] == "run_sql"
    assert invocation_params[14] == "call-1"
    assert json.loads(invocation_params[18]) == {"sql": "SELECT 1"}

    assert json.loads(result_params[10])["tool_name"] == "run_sql"
    assert json.loads(result_params[10])["tool_call_id"] == "call-1"
    assert json.loads(result_params[10])["success"] is True
    assert result_params[13] == "run_sql"
    assert result_params[14] == "call-1"
    assert result_params[20] is True
