"""Core abstractions for QueryMind evaluation.

This module defines the SQL-evaluation-specific data model used by the
evaluation runner, judge, and reporting layers.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field

from QueryMind.core.user import User


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


class ExpectedOutcome(BaseModel):
    """Optional behavior contract for a test case."""

    model_config = ConfigDict(extra="allow")

    tools_called: List[str] = Field(default_factory=list)
    final_answer_contains: List[str] = Field(default_factory=list)
    max_execution_time_ms: Optional[int] = None


class SqlTestCase(BaseModel):
    """A single SQL evaluation test case."""

    model_config = ConfigDict(extra="allow")

    id: str
    database_id: str
    dialect: str
    query: str
    ground_truth_sql: str
    conversation_id: Optional[str] = None
    user_id: Optional[str] = None
    username: Optional[str] = None
    email: Optional[str] = None
    user_groups: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    difficulty: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    expected_outcome: Optional[ExpectedOutcome] = None

    def build_user(self, default_user: Optional[User] = None) -> User:
        """Build a QueryMind user for this test case."""
        if self.user_id is None and default_user is not None:
            return default_user

        user_id = self.user_id or (default_user.id if default_user else "evaluation")
        username = self.username or (default_user.username if default_user else user_id)
        email = self.email or (default_user.email if default_user else f"{user_id}@example.com")
        groups = self.user_groups or (default_user.group_memberships if default_user else [])

        return User(
            id=user_id,
            username=username,
            email=email,
            group_memberships=list(groups),
        )

    @property
    def effective_conversation_id(self) -> str:
        """Conversation ID to use for the test case."""
        return self.conversation_id or f"eval-{self.id}"

    def classification_dimensions(self) -> Dict[str, str]:
        """Return the dimensions used for report grouping and filtering."""
        metadata = self.metadata or {}
        return {
            "difficulty": self.difficulty or "unspecified",
            "category": str(metadata.get("category") or "unspecified"),
            "source": str(metadata.get("source") or "unspecified"),
            "query_language": str(metadata.get("query_language") or "unspecified"),
        }


class ToolInvocationRecord(BaseModel):
    """One tool invocation captured from the agent trace."""

    tool_call_id: str
    tool_name: str
    arguments: Dict[str, Any] = Field(default_factory=dict)
    result_text: Optional[str] = None
    success: Optional[bool] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class AgentResult(BaseModel):
    """Captured output from running an agent on one test case."""

    test_case_id: str
    database_id: str
    conversation_id: str
    user_id: str
    final_answer: Optional[str] = None
    tool_calls: List[ToolInvocationRecord] = Field(default_factory=list)
    execution_time_ms: float = 0.0
    error: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

    def get_tool_calls(self, tool_name: Optional[str] = None) -> List[ToolInvocationRecord]:
        if tool_name is None:
            return list(self.tool_calls)
        return [item for item in self.tool_calls if item.tool_name == tool_name]

    def get_primary_sql(self, tool_name: str = "run_sql") -> Optional[str]:
        """Return the last SQL text captured from a tool call."""
        for record in reversed(self.tool_calls):
            if record.tool_name != tool_name:
                continue
            sql = record.arguments.get("sql")
            if isinstance(sql, str) and sql.strip():
                return sql.strip()
        return None


class SqlExecutionArtifact(BaseModel):
    """Normalized SQL execution artifact used by the judge."""

    sql_text: str
    success: bool
    error_message: Optional[str] = None
    row_count: int = 0
    column_names: List[str] = Field(default_factory=list)
    preview_column_names: List[str] = Field(default_factory=list)
    preview_rows: List[Dict[str, Any]] = Field(default_factory=list)
    truncated: bool = False
    execution_time_ms: float = 0.0
    sql_features: List[str] = Field(default_factory=list)
    dialect: Optional[str] = None


class JudgeInput(BaseModel):
    """Structured input passed to the LLM judge."""

    query: str
    database_id: str
    dialect: str
    ground_truth_sql: str
    ground_truth_preview_column_names: List[str] = Field(default_factory=list)
    ground_truth_result_preview: List[Dict[str, Any]] = Field(default_factory=list)
    ground_truth_row_count: int = 0
    ground_truth_truncated: bool = False
    ground_truth_error: Optional[str] = None
    agent_sql: str
    agent_preview_column_names: List[str] = Field(default_factory=list)
    agent_result_preview: List[Dict[str, Any]] = Field(default_factory=list)
    agent_row_count: int = 0
    agent_truncated: bool = False
    agent_error: Optional[str] = None
    sql_features: Dict[str, List[str]] = Field(default_factory=dict)
    trace_summary: Dict[str, Any] = Field(default_factory=dict)


class JudgeResult(BaseModel):
    """Structured result returned by the LLM judge."""

    passed: bool
    score: float
    reason: str
    issue_tags: List[str] = Field(default_factory=list)
    confidence: float = 0.0
    execution_time_ms: float = 0.0
    raw_output: str = ""
    parsed_output: Dict[str, Any] = Field(default_factory=dict)
    parse_source: Optional[str] = None


class EvaluationResult(BaseModel):
    """Complete result for one evaluated test case."""

    test_case: SqlTestCase
    agent_result: AgentResult
    agent_artifact: Optional[SqlExecutionArtifact] = None
    ground_truth_artifact: Optional[SqlExecutionArtifact] = None
    judge_input: Optional[JudgeInput] = None
    judge_result: Optional[JudgeResult] = None
    score: float = 0.0
    passed: bool = False
    reason: str = ""
    issue_tags: List[str] = Field(default_factory=list)
    execution_time_ms: float = 0.0
    metadata: Dict[str, Any] = Field(default_factory=dict)

    @property
    def database_id(self) -> str:
        return self.test_case.database_id


class Evaluator(ABC):
    """Base class for evaluation logic."""

    @property
    @abstractmethod
    def name(self) -> str:
        raise NotImplementedError

    @abstractmethod
    async def evaluate(
        self,
        test_case: SqlTestCase,
        agent_result: AgentResult,
    ) -> EvaluationResult:
        raise NotImplementedError
