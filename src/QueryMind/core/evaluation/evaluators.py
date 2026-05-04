"""SQL evaluation logic for QueryMind."""

from __future__ import annotations

import json
import logging
import math
import re
import time
import uuid
from decimal import Decimal
from typing import Any, Dict, List, Optional

import pandas as pd

from QueryMind.capabilities.sql_runner import RunSqlToolArgs
from QueryMind.core.llm import LlmMessage, LlmRequest, LlmService
from QueryMind.core.tool import ToolContext
from QueryMind.core.user import User

from .sql_policy import is_read_only_sql
from .base import (
    AgentResult,
    EvaluationResult,
    Evaluator,
    JudgeInput,
    JudgeResult,
    SqlExecutionArtifact,
    SqlTestCase,
)
from .runtime import EvaluationRuntimeResolver, NoOpAgentMemory


logger = logging.getLogger(__name__)


DEFAULT_ISSUE_TAG_PENALTIES: Dict[str, float] = {
    "missing_sql": 1.0,
    "execution_error": 1.0,
    "ground_truth_failure": 1.0,
    "dataset_error": 1.0,
    "judge_parse_failure": 1.0,
    "wrong_semantics": 0.5,
    "wrong_result_preview": 0.3,
    "wrong_columns": 0.2,
    "wrong_order_by": 0.1,
    "formatting_only": 0.05,
}


def _strip_code_fences(text: str) -> str:
    stripped = text.strip()
    if stripped.startswith("```"):
        stripped = re.sub(r"^```[a-zA-Z0-9_-]*\n", "", stripped)
        stripped = re.sub(r"\n```$", "", stripped)
    return stripped.strip()


def _balanced_json_candidates(text: str) -> List[str]:
    """Extract balanced JSON object candidates from free-form text."""
    if not text:
        return []

    candidates: List[str] = []
    seen: set[str] = set()

    for start_match in re.finditer(r"\{", text):
        start = start_match.start()
        depth = 0
        in_string = False
        escape = False

        for index in range(start, len(text)):
            char = text[index]

            if escape:
                escape = False
                continue
            if char == "\\":
                escape = True
                continue
            if char == '"':
                in_string = not in_string
                continue
            if in_string:
                continue
            if char == "{":
                depth += 1
            elif char == "}":
                depth -= 1
                if depth == 0:
                    candidate = text[start : index + 1].strip()
                    if candidate and candidate not in seen:
                        seen.add(candidate)
                        candidates.append(candidate)
                    break

    return candidates


def _json_candidate_sources(text: str) -> List[tuple[str, str]]:
    """Collect candidate payloads from fenced JSON blocks and raw text."""
    stripped = (text or "").strip()
    if not stripped:
        return []

    candidates: List[tuple[str, str]] = []
    seen: set[str] = set()

    fenced_blocks = re.findall(r"```(?:json)?\s*([\s\S]*?)\s*```", stripped, re.IGNORECASE)
    sources = [block.strip() for block in fenced_blocks if block.strip()]
    sources.append(stripped)

    for index, source in enumerate(sources):
        label = "fenced" if index < len(fenced_blocks) else "raw"
        for candidate in _balanced_json_candidates(source):
            if candidate not in seen:
                seen.add(candidate)
                candidates.append((label, candidate))

        if source.startswith("{") and source.endswith("}") and source not in seen:
            seen.add(source)
            candidates.append((label, source))

    return candidates


def _load_json_like(payload: str) -> Dict[str, Any]:
    cleaned = payload.strip()
    if not cleaned:
        raise ValueError("Empty JSON payload")

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError:
        cleaned = re.sub(r",(\s*[}\]])", r"\1", cleaned)
        data = json.loads(cleaned)

    if not isinstance(data, dict):
        raise ValueError("Judge output did not contain a JSON object")

    return data


def _parse_judge_output(raw_output: str) -> tuple[Dict[str, Any], str]:
    last_error: Optional[Exception] = None
    for source_label, candidate in _json_candidate_sources(raw_output):
        try:
            return _load_json_like(candidate), source_label
        except Exception as exc:  # pragma: no cover - defensive fallback
            last_error = exc

    raise ValueError("Judge output could not be parsed as structured JSON") from last_error


def _normalize_scalar(value: Any) -> Any:
    if value is None:
        return None
    if isinstance(value, float) and math.isnan(value):
        return None
    if isinstance(value, Decimal):
        return str(value)
    if hasattr(value, "isoformat"):
        try:
            return value.isoformat()
        except Exception:
            pass
    if isinstance(value, (bytes, bytearray)):
        return value.decode("utf-8", errors="replace")
    return value


def _make_unique_preview_column_names(column_names: List[Any]) -> List[str]:
    """Return stable, unique preview column names without dropping duplicates."""
    seen: set[str] = set()
    counts: Dict[str, int] = {}
    unique_names: List[str] = []

    for raw_name in column_names:
        base_name = str(raw_name)
        counts[base_name] = counts.get(base_name, 0) + 1

        candidate = base_name if counts[base_name] == 1 else f"{base_name}__{counts[base_name]}"
        while candidate in seen:
            counts[base_name] += 1
            candidate = f"{base_name}__{counts[base_name]}"

        seen.add(candidate)
        unique_names.append(candidate)

    return unique_names


def _normalize_rows(
    df: pd.DataFrame, preview_rows: int
) -> tuple[List[Dict[str, Any]], List[str], int, bool]:
    row_count = len(df)
    truncated = row_count > preview_rows
    preview_df = df.head(preview_rows) if row_count else df.head(0)
    preview_column_names = _make_unique_preview_column_names(list(preview_df.columns))
    preview: List[Dict[str, Any]] = []

    if row_count:
        for row in preview_df.itertuples(index=False, name=None):
            preview.append(
                {
                    column_name: _normalize_scalar(value)
                    for column_name, value in zip(preview_column_names, row)
                }
            )

    return preview, preview_column_names, row_count, truncated


def _sql_features(sql: str) -> List[str]:
    normalized = re.sub(r"\s+", " ", sql.strip()).upper()
    features = []
    for pattern, name in [
        (r"\bJOIN\b", "join"),
        (r"\bGROUP BY\b", "group_by"),
        (r"\bORDER BY\b", "order_by"),
        (r"\bDISTINCT\b", "distinct"),
        (r"\bLIMIT\b", "limit"),
        (r"\bHAVING\b", "having"),
        (r"\bUNION\b", "union"),
        (r"\bCOUNT\s*\(", "aggregation"),
        (r"\bSUM\s*\(", "aggregation"),
        (r"\bAVG\s*\(", "aggregation"),
        (r"\bMIN\s*\(", "aggregation"),
        (r"\bMAX\s*\(", "aggregation"),
        (r"\bCASE\b", "case_expression"),
    ]:
        if re.search(pattern, normalized, re.IGNORECASE):
            features.append(name)
    return sorted(set(features))


def _build_trace_summary(agent_result: AgentResult) -> Dict[str, Any]:
    run_sql_calls = agent_result.get_tool_calls("run_sql")
    return {
        "test_case_id": agent_result.test_case_id,
        "tool_count": len(agent_result.tool_calls),
        "run_sql_call_count": len(run_sql_calls),
        "tool_names": [record.tool_name for record in agent_result.tool_calls],
        "has_final_answer": bool(agent_result.final_answer),
    }


def _build_sql_context(test_case: SqlTestCase, user: User) -> ToolContext:
    return ToolContext(
        user=user,
        conversation_id=test_case.effective_conversation_id,
        request_id=str(uuid.uuid4()),
        agent_memory=NoOpAgentMemory(),
        metadata={
            "evaluation": True,
            "database_id": test_case.database_id,
            "dialect": test_case.dialect,
            "test_case_id": test_case.id,
        },
    )


async def _execute_sql(
    runtime: Any,
    test_case: SqlTestCase,
    sql_text: str,
    *,
    allow_write_sql: bool,
    preview_rows: int,
) -> SqlExecutionArtifact:
    start = time.perf_counter()

    if not allow_write_sql and not is_read_only_sql(sql_text):
        return SqlExecutionArtifact(
            sql_text=sql_text,
            success=False,
            error_message="Non-read-only SQL blocked during evaluation",
            execution_time_ms=(time.perf_counter() - start) * 1000,
            sql_features=_sql_features(sql_text),
            dialect=test_case.dialect,
        )

    user = test_case.build_user(runtime.default_user)
    context = _build_sql_context(test_case, user)

    try:
        df = await runtime.sql_runner.run_sql(RunSqlToolArgs(sql=sql_text), context)
        preview, preview_column_names, row_count, truncated = _normalize_rows(
            df, preview_rows
        )
        return SqlExecutionArtifact(
            sql_text=sql_text,
            success=True,
            row_count=row_count,
            column_names=list(df.columns),
            preview_column_names=preview_column_names,
            preview_rows=preview,
            truncated=truncated,
            execution_time_ms=(time.perf_counter() - start) * 1000,
            sql_features=_sql_features(sql_text),
            dialect=test_case.dialect,
        )
    except Exception as exc:
        return SqlExecutionArtifact(
            sql_text=sql_text,
            success=False,
            error_message=str(exc),
            execution_time_ms=(time.perf_counter() - start) * 1000,
            sql_features=_sql_features(sql_text),
            dialect=test_case.dialect,
        )


class SqlAccuracyEvaluator(Evaluator):
    """Judge SQL generation accuracy using execution evidence and an LLM judge."""

    def __init__(
        self,
        runtime_resolver: EvaluationRuntimeResolver,
        judge_llm: LlmService,
        *,
        pass_threshold: float = 0.7,
        preview_rows: int = 10,
        allow_write_sql: bool = False,
        issue_tag_penalties: Optional[Dict[str, float]] = None,
    ) -> None:
        self.runtime_resolver = runtime_resolver
        self.judge_llm = judge_llm
        self.pass_threshold = pass_threshold
        self.preview_rows = preview_rows
        self.allow_write_sql = allow_write_sql
        self.issue_tag_penalties = issue_tag_penalties or DEFAULT_ISSUE_TAG_PENALTIES

    def _normalize_issue_tags(self, issue_tags: List[str]) -> List[str]:
        """Collapse overlapping judge tags to a single primary issue tag.

        The judge can sometimes emit multiple labels for the same underlying
        issue, e.g. ``wrong_result_preview`` plus ``wrong_columns``. Scoring
        should be driven by the strongest issue, not by stacking overlapping
        penalties.
        """
        deduped: List[str] = []
        seen: set[str] = set()
        for raw_tag in issue_tags:
            tag = str(raw_tag).strip()
            if not tag or tag in seen:
                continue
            seen.add(tag)
            deduped.append(tag)

        if not deduped:
            return []

        priority_groups = [
            {"missing_sql", "execution_error", "ground_truth_failure", "dataset_error", "judge_parse_failure"},
            {"wrong_semantics"},
            {"wrong_result_preview"},
            {"wrong_columns"},
            {"wrong_order_by"},
            {"formatting_only"},
        ]

        for group in priority_groups:
            for tag in deduped:
                if tag in group:
                    return [tag]

        return [deduped[0]]

    @property
    def name(self) -> str:
        return "sql_accuracy"

    async def evaluate(
        self, test_case: SqlTestCase, agent_result: AgentResult
    ) -> EvaluationResult:
        if agent_result.error:
            return EvaluationResult(
                test_case=test_case,
                agent_result=agent_result,
                score=0.0,
                passed=False,
                reason=f"Agent execution failed: {agent_result.error}",
                issue_tags=["agent_failure"],
                execution_time_ms=agent_result.execution_time_ms,
                metadata={"failure_type": "agent_failure"},
            )

        runtime = await self.runtime_resolver.resolve(test_case)
        agent_sql = agent_result.get_primary_sql()
        if not agent_sql:
            return EvaluationResult(
                test_case=test_case,
                agent_result=agent_result,
                score=0.0,
                passed=False,
                reason="No run_sql call was captured from the agent",
                issue_tags=["missing_sql"],
                execution_time_ms=agent_result.execution_time_ms,
                metadata={"failure_type": "missing_sql"},
            )

        ground_truth_artifact = await _execute_sql(
            runtime,
            test_case,
            test_case.ground_truth_sql,
            allow_write_sql=self.allow_write_sql,
            preview_rows=self.preview_rows,
        )
        agent_artifact = await _execute_sql(
            runtime,
            test_case,
            agent_sql,
            allow_write_sql=self.allow_write_sql,
            preview_rows=self.preview_rows,
        )

        if not ground_truth_artifact.success:
            return EvaluationResult(
                test_case=test_case,
                agent_result=agent_result,
                agent_artifact=agent_artifact,
                ground_truth_artifact=ground_truth_artifact,
                score=0.0,
                passed=False,
                reason=f"Ground truth SQL failed to execute: {ground_truth_artifact.error_message}",
                issue_tags=["ground_truth_failure"],
                execution_time_ms=agent_result.execution_time_ms,
                metadata={"failure_type": "ground_truth_failure"},
            )

        if not agent_artifact.success:
            return EvaluationResult(
                test_case=test_case,
                agent_result=agent_result,
                agent_artifact=agent_artifact,
                ground_truth_artifact=ground_truth_artifact,
                score=0.0,
                passed=False,
                reason=f"Agent SQL failed to execute: {agent_artifact.error_message}",
                issue_tags=["execution_error"],
                execution_time_ms=agent_result.execution_time_ms,
                metadata={"failure_type": "execution_error"},
            )

        judge_input = JudgeInput(
            query=test_case.query,
            database_id=test_case.database_id,
            dialect=test_case.dialect,
            ground_truth_sql=test_case.ground_truth_sql,
            ground_truth_preview_column_names=ground_truth_artifact.preview_column_names,
            ground_truth_result_preview=ground_truth_artifact.preview_rows,
            ground_truth_row_count=ground_truth_artifact.row_count,
            ground_truth_truncated=ground_truth_artifact.truncated,
            ground_truth_error=ground_truth_artifact.error_message,
            agent_sql=agent_sql,
            agent_preview_column_names=agent_artifact.preview_column_names,
            agent_result_preview=agent_artifact.preview_rows,
            agent_row_count=agent_artifact.row_count,
            agent_truncated=agent_artifact.truncated,
            agent_error=agent_artifact.error_message,
            sql_features={
                "ground_truth": ground_truth_artifact.sql_features,
                "agent": agent_artifact.sql_features,
            },
            trace_summary=_build_trace_summary(agent_result),
        )

        judge_result = await self._run_judge(judge_input)
        if judge_result.parse_source == "failed":
            fallback_result = self._fallback_judge_from_artifacts(
                test_case,
                agent_artifact,
                ground_truth_artifact,
            )
            if fallback_result is not None:
                logger.warning(
                    "Judge output parse failed for test_case=%s; using artifact fallback",
                    test_case.id,
                )
                judge_result = fallback_result

        score = judge_result.score
        passed = score >= self.pass_threshold

        return EvaluationResult(
            test_case=test_case,
            agent_result=agent_result,
            agent_artifact=agent_artifact,
            ground_truth_artifact=ground_truth_artifact,
            judge_input=judge_input,
            judge_result=judge_result,
            score=score,
            passed=passed,
            reason=judge_result.reason,
            issue_tags=judge_result.issue_tags,
            execution_time_ms=agent_result.execution_time_ms,
            metadata={
                "database_id": test_case.database_id,
                "dialect": test_case.dialect,
                "run_sql_calls": len(agent_result.get_tool_calls("run_sql")),
                "judge_parse_source": judge_result.parse_source,
            },
        )

    async def _run_judge(self, judge_input: JudgeInput) -> JudgeResult:
        prompt = self._build_judge_prompt(judge_input)
        request = LlmRequest(
            user=User(
                id="judge",
                username="judge",
                email="judge@example.com",
                group_memberships=["judge"],
            ),
            messages=[LlmMessage(role="user", content=prompt)],
            temperature=0.0,
            max_tokens=1024,
            stream=False,
            system_prompt=(
                "You are a strict SQL evaluation judge. "
                "Return exactly one raw JSON object with keys passed, issue_tags, reason, and confidence. "
                "Do not use markdown fences, code blocks, or prose."
            ),
        )

        try:
            response = await self.judge_llm.send_request(request)
        except Exception as exc:
            logger.warning(
                "Judge LLM request failed for test_case=%s after retries: %s",
                judge_input.trace_summary.get("test_case_id", judge_input.database_id),
                exc,
            )
            return JudgeResult(
                passed=False,
                score=0.0,
                reason=f"Judge request failed after retries: {exc}",
                issue_tags=["judge_request_failed"],
                confidence=0.0,
                raw_output="",
                parsed_output={"error": str(exc)},
            )

        raw_output = response.content or ""

        try:
            parsed, parse_source = _parse_judge_output(raw_output)
        except Exception as exc:
            logger.warning(
                "Judge output parse failed for test_case=%s: %s",
                judge_input.trace_summary.get("test_case_id", judge_input.database_id),
                exc,
            )
            return JudgeResult(
                passed=False,
                score=0.0,
                reason="Judge output could not be parsed as JSON",
                issue_tags=["judge_parse_failure"],
                confidence=0.0,
                raw_output=raw_output,
                parsed_output={},
                parse_source="failed",
            )

        issue_tags = self._normalize_issue_tags(
            [str(tag) for tag in parsed.get("issue_tags", []) if str(tag).strip()]
        )
        if not issue_tags and not parsed.get("passed", False):
            issue_tags = ["wrong_semantics"]

        score = self._score_from_tags(issue_tags)
        reason = str(parsed.get("reason", "")).strip() or "No reason provided"
        confidence = float(parsed.get("confidence", 0.0) or 0.0)
        passed = score >= self.pass_threshold

        return JudgeResult(
            passed=passed,
            score=score,
            reason=reason,
            issue_tags=issue_tags,
            confidence=confidence,
            raw_output=raw_output,
            parsed_output=parsed,
            parse_source=parse_source,
        )

    def _fallback_judge_from_artifacts(
        self,
        test_case: SqlTestCase,
        agent_artifact: Optional[SqlExecutionArtifact],
        ground_truth_artifact: Optional[SqlExecutionArtifact],
    ) -> Optional[JudgeResult]:
        """Use execution artifacts when the judge output is not parseable."""
        if agent_artifact is None or ground_truth_artifact is None:
            return None

        if (
            agent_artifact.column_names == ground_truth_artifact.column_names
            and agent_artifact.row_count == ground_truth_artifact.row_count
            and agent_artifact.preview_rows == ground_truth_artifact.preview_rows
            and agent_artifact.truncated == ground_truth_artifact.truncated
        ):
            return JudgeResult(
                passed=True,
                score=0.95,
                reason=(
                    "Judge output could not be parsed, but the execution artifacts "
                    "matched exactly; treated as formatting_only."
                ),
                issue_tags=["formatting_only"],
                confidence=0.0,
                raw_output="",
                parsed_output={"fallback": "artifact_match"},
                parse_source="artifact_fallback",
            )

        return JudgeResult(
            passed=False,
            score=0.5,
            reason=(
                "Judge output could not be parsed, and execution artifacts did not "
                "match exactly enough to treat the result as formatting-only."
            ),
            issue_tags=["wrong_semantics"],
            confidence=0.0,
            raw_output="",
            parsed_output={
                "fallback": "artifact_mismatch",
                "test_case_id": test_case.id,
            },
            parse_source="artifact_fallback",
        )

    def _score_from_tags(self, issue_tags: List[str]) -> float:
        issue_tags = self._normalize_issue_tags(issue_tags)
        score = 1.0
        for tag in dict.fromkeys(issue_tags):
            score -= self.issue_tag_penalties.get(tag, 0.1)
        return max(0.0, min(1.0, score))

    def _build_judge_prompt(self, judge_input: JudgeInput) -> str:
        return f"""You are judging SQL generation quality for an agent.

Decide based ONLY on the supplied query, SQL, execution previews, row counts, and errors.
The preview column name arrays are already disambiguated for duplicate labels using
stable suffixes like `__2`. Treat those preview names as positional labels for the
result preview, not as semantic changes to the query result.
Ignore formatting-only differences when the results are the same.
Return at most one primary issue tag. If several tags seem applicable, choose the
single strongest tag that still explains the evidence.
If the execution previews match but aliases/whitespace differ, use formatting_only.
If the first 10 rows differ materially, use wrong_result_preview.
If the columns differ materially, use wrong_columns.
If ordering is the main issue, use wrong_order_by.
If the SQL is missing or failed to execute, use missing_sql or execution_error.

Return JSON only with this shape:
{{
  "passed": true,
  "issue_tags": ["formatting_only"],
  "reason": "short reason",
  "confidence": 0.93
}}

Return exactly one raw JSON object. Do not wrap it in markdown fences or add prose.

Issue tag options:
- missing_sql
- execution_error
- ground_truth_failure
- dataset_error
- wrong_semantics
- wrong_result_preview
- wrong_columns
- wrong_order_by
- formatting_only

Evaluation input:
{judge_input.model_dump_json(indent=2, ensure_ascii=False, exclude={"trace_summary"})}
"""
