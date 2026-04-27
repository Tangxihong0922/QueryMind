"""Shared SQL policy helpers for QueryMind evaluation."""

from __future__ import annotations

import re


_LEADING_COMMENT_PATTERN = re.compile(
    r"^\s*(?:--[^\n]*\n\s*|/\*.*?\*/\s*)*",
    re.DOTALL,
)


def normalize_sql_start(sql: str) -> str:
    """Strip leading comments and whitespace before SQL classification."""
    cleaned = _LEADING_COMMENT_PATTERN.sub("", sql or "")
    return cleaned.lstrip().lstrip("(").lstrip().upper()


def is_read_only_sql(sql: str) -> bool:
    """Return True for SQL that should be allowed in evaluation runs."""
    normalized = normalize_sql_start(sql)
    return normalized.startswith("SELECT") or normalized.startswith("WITH")
