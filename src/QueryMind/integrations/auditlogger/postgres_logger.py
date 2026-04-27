"""
PostgreSQL audit logger implementation.

This module provides an AuditLogger that stores audit events in PostgreSQL,
supporting querying and analysis of audit trails.
"""

import json
import logging
from contextlib import contextmanager
from datetime import datetime, timezone
from typing import Any, Dict, Iterator, List, Optional

import psycopg2
from psycopg2 import pool
from psycopg2.extras import RealDictCursor

from QueryMind.core.audit import AuditEvent, AuditEventType, AuditLogger

logger = logging.getLogger(__name__)


class PostgresAuditLogger(AuditLogger):
    """Audit logger that stores events in PostgreSQL.

    This implementation uses a connection pool for efficient database operations
    and automatically creates the required table schema if it doesn't exist.

    Example:
        logger = PostgresAuditLogger(
            host="localhost",
            port=5432,
            database="querymind",
            user="admin",
            password="secret",
        )

        agent = Agent(
            llm_service=...,
            audit_logger=logger,
        )

        # Query audit events
        events = await logger.query_events(
            filters={"event_type": "tool_invocation"},
            limit=100,
        )
    """

    def __init__(
        self,
        host: str = "localhost",
        port: int = 5432,
        database: str = "querymind",
        user: str = "postgres",
        password: str = "",
        connection_string: Optional[str] = None,
        min_connections: int = 1,
        max_connections: int = 10,
        table_name: str = "audit_events",
        schema_name: str = "public",
    ):
        """Initialize the PostgreSQL audit logger.

        This implementation uses lazy initialization - the connection pool is not
        created until the first database operation is performed.

        Args:
            host: PostgreSQL server host
            port: PostgreSQL server port
            database: Database name
            user: Database user
            password: Database password
            connection_string: Full connection string (overrides individual params)
            min_connections: Minimum pool size
            max_connections: Maximum pool size
            table_name: Name of the audit events table
            schema_name: Schema containing the table
        """
        self.table_name = table_name
        self.schema_name = schema_name
        self.full_table_name = f"{schema_name}.{table_name}"
        self.min_connections = min_connections
        self.max_connections = max_connections
        self._table_initialized = False

        # Build connection string if not provided
        if connection_string is None:
            self._connection_string = (
                f"host={host} port={port} dbname={database} "
                f"user={user} password={password}"
            )
        else:
            self._connection_string = connection_string

        # Connection pool is created lazily on first use
        self._pool = None

    def _ensure_pool(self) -> None:
        """Lazily create the connection pool on first use."""
        if self._pool is not None:
            return

        try:
            self._pool = pool.ThreadedConnectionPool(
                minconn=self.min_connections,
                maxconn=self.max_connections,
                dsn=self._connection_string,
            )
            logger.info(f"PostgreSQL connection pool created lazily")
        except psycopg2.Error as e:
            logger.error(f"Failed to create connection pool: {e}")
            raise

    @property
    def pool(self):
        """Property to maintain backwards compatibility."""
        return self._pool

    def _ensure_table(self) -> None:
        """Create the audit events table if it doesn't exist."""
        create_table_sql = f"""
        CREATE TABLE IF NOT EXISTS {self.full_table_name} (
            event_id UUID PRIMARY KEY,
            event_type VARCHAR(50) NOT NULL,
            timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),

            -- User context
            user_id VARCHAR(255) NOT NULL,
            username VARCHAR(255),
            user_email VARCHAR(255),
            user_groups TEXT[],

            -- Request context
            conversation_id VARCHAR(255) NOT NULL,
            request_id VARCHAR(255) NOT NULL,
            remote_addr VARCHAR(45),

            -- Event-specific data (JSONB for flexibility)
            details JSONB DEFAULT '{{}}',

            -- Privacy markers
            contains_pii BOOLEAN DEFAULT FALSE,
            redacted_fields TEXT[],

            -- Tool-specific fields (nullable, only for tool events)
            tool_name VARCHAR(255),
            tool_call_id VARCHAR(255),
            access_granted BOOLEAN,
            required_groups TEXT[],
            reason TEXT,
            parameters JSONB,
            parameters_sanitized BOOLEAN DEFAULT FALSE,
            success BOOLEAN,
            error TEXT,
            execution_time_ms FLOAT,
            result_size_bytes BIGINT,
            ui_component_type VARCHAR(100),

            -- AI response fields
            response_length_chars INTEGER,
            response_length_tokens INTEGER,
            response_text TEXT,
            response_hash VARCHAR(64),
            model_name VARCHAR(100),
            temperature FLOAT,
            tool_calls_count INTEGER,
            tool_names TEXT[],

            -- Feature access fields
            feature_name VARCHAR(100),

            -- Indexes
            CONSTRAINT valid_event_type CHECK (event_type IN (
                'tool_access_check', 'ui_feature_access_check',
                'tool_invocation', 'tool_result',
                'message_received', 'ai_response_generated', 'conversation_created',
                'access_denied', 'authentication_attempt'
            ))
        );

        -- Create indexes for common query patterns
        CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON {self.full_table_name} (timestamp DESC);
        CREATE INDEX IF NOT EXISTS idx_audit_user_id ON {self.full_table_name} (user_id);
        CREATE INDEX IF NOT EXISTS idx_audit_conversation_id ON {self.full_table_name} (conversation_id);
        CREATE INDEX IF NOT EXISTS idx_audit_event_type ON {self.full_table_name} (event_type);
        CREATE INDEX IF NOT EXISTS idx_audit_tool_name ON {self.full_table_name} (tool_name) WHERE tool_name IS NOT NULL;
        """

        try:
            with self.pool.getconn() as conn:
                with conn.cursor() as cur:
                    cur.execute(create_table_sql)
                conn.commit()
                logger.info(f"Audit table {self.full_table_name} ready")
        except psycopg2.Error as e:
            logger.error(f"Failed to create audit table: {e}")
            raise
        finally:
            self._return_all_connections()

    def _return_all_connections(self) -> None:
        """Return all connections to the pool."""
        # Note: ThreadedConnectionPool doesn't have a direct "return all" method
        # Connections are returned individually via putconn()
        pass

    def _build_event_details(self, event: AuditEvent) -> Dict[str, Any]:
        """Merge typed event fields into the JSON details payload."""
        details = dict(event.details or {})
        for key in (
            "tool_name",
            "tool_call_id",
            "access_granted",
            "required_groups",
            "reason",
            "parameters",
            "parameters_sanitized",
            "success",
            "error",
            "execution_time_ms",
            "result_size_bytes",
            "ui_component_type",
            "response_length_chars",
            "response_length_tokens",
            "response_text",
            "response_hash",
            "model_name",
            "temperature",
            "tool_calls_count",
            "tool_names",
            "feature_name",
        ):
            value = getattr(event, key, None)
            if value is not None:
                details[key] = value
        return details

    @contextmanager
    def _get_connection(self) -> Iterator:
        """Get a connection from the pool as a context manager."""
        self._ensure_pool()
        # Ensure table exists on first use
        if not self._table_initialized:
            self._ensure_table()
            self._table_initialized = True
        conn = self._pool.getconn()
        try:
            yield conn
        finally:
            self._pool.putconn(conn)

    async def log_event(self, event: AuditEvent) -> None:
        """Log an audit event to PostgreSQL.

        Args:
            event: The audit event to log
        """
        details = self._build_event_details(event)
        insert_sql = f"""
        INSERT INTO {self.full_table_name} (
            event_id, event_type, timestamp,
            user_id, username, user_email, user_groups,
            conversation_id, request_id, remote_addr,
            details, contains_pii, redacted_fields,
            tool_name, tool_call_id, access_granted, required_groups, reason,
            parameters, parameters_sanitized,
            success, error, execution_time_ms, result_size_bytes, ui_component_type,
            response_length_chars, response_length_tokens, response_text,
            response_hash, model_name, temperature, tool_calls_count, tool_names,
            feature_name
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
        )
        ON CONFLICT (event_id) DO NOTHING
        """

        try:
            with self._get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(insert_sql, (
                        # Base event
                        event.event_id,
                        event.event_type.value,
                        event.timestamp,
                        # User context
                        event.user_id,
                        event.username,
                        event.user_email,
                        event.user_groups,
                        # Request context
                        event.conversation_id,
                        event.request_id,
                        event.remote_addr,
                        # Details
                        json.dumps(details),
                        event.contains_pii,
                        event.redacted_fields,
                        # Tool event fields
                        details.get("tool_name"),
                        details.get("tool_call_id"),
                        details.get("access_granted"),
                        details.get("required_groups"),
                        details.get("reason"),
                        json.dumps(details.get("parameters")) if details.get("parameters") is not None else None,
                        details.get("parameters_sanitized"),
                        # Tool result fields
                        details.get("success"),
                        details.get("error"),
                        details.get("execution_time_ms"),
                        details.get("result_size_bytes"),
                        details.get("ui_component_type"),
                        # AI response fields
                        details.get("response_length_chars"),
                        details.get("response_length_tokens"),
                        details.get("response_text"),
                        details.get("response_hash"),
                        details.get("model_name"),
                        details.get("temperature"),
                        details.get("tool_calls_count"),
                        details.get("tool_names"),
                        # Feature access
                        details.get("feature_name"),
                    ))
                conn.commit()
                logger.debug(f"Audit event logged: {event.event_id}")
        except psycopg2.Error as e:
            logger.error(f"Failed to log audit event: {e}")
            # Don't raise - audit logging should not break the operation
        except Exception as e:
            logger.error(f"Unexpected error logging audit event: {e}")

    async def query_events(
        self,
        filters: Optional[Dict[str, Any]] = None,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None,
        limit: int = 100,
    ) -> List[AuditEvent]:
        """Query audit events from PostgreSQL.

        Args:
            filters: Filter criteria (user_id, event_type, conversation_id, tool_name)
            start_time: Filter events after this time
            end_time: Filter events before this time
            limit: Maximum number of events to return

        Returns:
            List of matching audit events
        """
        filters = filters or {}

        # Build WHERE clause dynamically
        conditions = []
        params = []

        if "user_id" in filters:
            conditions.append("user_id = %s")
            params.append(filters["user_id"])

        if "event_type" in filters:
            conditions.append("event_type = %s")
            params.append(filters["event_type"])

        if "conversation_id" in filters:
            conditions.append("conversation_id = %s")
            params.append(filters["conversation_id"])

        if "tool_name" in filters:
            conditions.append("tool_name = %s")
            params.append(filters["tool_name"])

        if "request_id" in filters:
            conditions.append("request_id = %s")
            params.append(filters["request_id"])

        if start_time:
            conditions.append("timestamp >= %s")
            params.append(start_time)

        if end_time:
            conditions.append("timestamp <= %s")
            params.append(end_time)

        where_clause = " AND ".join(conditions) if conditions else "1=1"

        query_sql = f"""
        SELECT * FROM {self.full_table_name}
        WHERE {where_clause}
        ORDER BY timestamp DESC
        LIMIT %s
        """
        params.append(limit)

        events = []
        try:
            with self._get_connection() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(query_sql, params)
                    rows = cur.fetchall()

                    for row in rows:
                        event = self._row_to_event(row)
                        if event:
                            events.append(event)

            logger.debug(f"Query returned {len(events)} audit events")
        except psycopg2.Error as e:
            logger.error(f"Failed to query audit events: {e}")

        return events

    def _row_to_event(self, row: Dict[str, Any]) -> Optional[AuditEvent]:
        """Convert a database row to an AuditEvent."""
        try:
            event_type = row.get("event_type")
            if not event_type:
                return None

            # Build details dict based on event type
            details = row.get("details") or {}
            if row.get("tool_name"):
                details["tool_name"] = row["tool_name"]
            if row.get("tool_call_id"):
                details["tool_call_id"] = row["tool_call_id"]
            if row.get("access_granted") is not None:
                details["access_granted"] = row["access_granted"]
            if row.get("required_groups"):
                details["required_groups"] = row["required_groups"]
            if row.get("reason"):
                details["reason"] = row["reason"]
            if row.get("parameters"):
                details["parameters"] = row["parameters"]
            if row.get("parameters_sanitized") is not None:
                details["parameters_sanitized"] = row["parameters_sanitized"]
            if row.get("success") is not None:
                details["success"] = row["success"]
            if row.get("error"):
                details["error"] = row["error"]
            if row.get("execution_time_ms") is not None:
                details["execution_time_ms"] = row["execution_time_ms"]
            if row.get("result_size_bytes") is not None:
                details["result_size_bytes"] = row["result_size_bytes"]
            if row.get("ui_component_type"):
                details["ui_component_type"] = row["ui_component_type"]
            if row.get("response_length_chars") is not None:
                details["response_length_chars"] = row["response_length_chars"]
            if row.get("response_length_tokens") is not None:
                details["response_length_tokens"] = row["response_length_tokens"]
            if row.get("response_text"):
                details["response_text"] = row["response_text"]
            if row.get("response_hash"):
                details["response_hash"] = row["response_hash"]
            if row.get("model_name"):
                details["model_name"] = row["model_name"]
            if row.get("temperature") is not None:
                details["temperature"] = row["temperature"]
            if row.get("tool_calls_count") is not None:
                details["tool_calls_count"] = row["tool_calls_count"]
            if row.get("tool_names"):
                details["tool_names"] = row["tool_names"]
            if row.get("feature_name"):
                details["feature_name"] = row["feature_name"]

            return AuditEvent(
                event_id=str(row["event_id"]),
                event_type=AuditEventType(row["event_type"]),
                timestamp=row["timestamp"],
                user_id=row["user_id"],
                username=row.get("username"),
                user_email=row.get("user_email"),
                user_groups=row.get("user_groups") or [],
                conversation_id=row["conversation_id"],
                request_id=row["request_id"],
                remote_addr=row.get("remote_addr"),
                details=details,
                contains_pii=row.get("contains_pii", False),
                redacted_fields=row.get("redacted_fields") or [],
            )
        except Exception as e:
            logger.error(f"Failed to convert row to AuditEvent: {e}")
            return None

    def close(self) -> None:
        """Close the connection pool."""
        if self._pool is not None:
            self._pool.closeall()
            self._pool = None
            logger.info("PostgreSQL connection pool closed")

    def __enter__(self) -> "PostgresAuditLogger":
        return self

    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        self.close()
