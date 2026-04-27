"""
Audit logger implementations for PostgreSQL storage.

This module provides audit loggers that store events in PostgreSQL,
enabling querying and analysis of audit trails.
"""

from .postgres_logger import PostgresAuditLogger

__all__ = ["PostgresAuditLogger"]
