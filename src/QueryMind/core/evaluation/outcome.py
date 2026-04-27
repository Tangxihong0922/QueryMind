"""Expected-outcome evaluation logic for QueryMind."""

from __future__ import annotations

import re
from typing import Any, Dict, List, Optional

from .base import AgentResult, EvaluationResult, Evaluator, ExpectedOutcome, SqlTestCase


def _tool_names(agent_result: AgentResult) -> List[str]:
    return [record.tool_name for record in agent_result.tool_calls]


def _normalize_text(value: Optional[str]) -> str:
    return re.sub(r"\s+", " ", (value or "").strip().lower())


def _answer_surface_text(value: Optional[str]) -> str:
    """Prefer SQL code blocks when present, otherwise fall back to the full answer."""
    text = value or ""
    if not text.strip():
        return ""

    blocks = re.findall(r"```(?:sql)?\s*([\s\S]*?)\s*```", text, re.IGNORECASE)
    if blocks:
        return "\n".join(block.strip() for block in blocks if block.strip())
    return text


def _fragment_matches(text: str, fragment: str) -> bool:
    normalized_text = _normalize_text(text)
    normalized_fragment = _normalize_text(fragment)
    if not normalized_fragment:
        return True
    if " " in normalized_fragment:
        return normalized_fragment in normalized_text
    return re.search(
        rf"(?<!\w){re.escape(normalized_fragment)}(?!\w)",
        normalized_text,
    ) is not None


def _ordered_subsequence_match(actual: List[str], expected: List[str]) -> tuple[bool, List[int], Optional[str]]:
    """Return whether expected appears as an ordered subsequence of actual."""
    matched_positions: List[int] = []
    search_from = 0

    for expected_tool in expected:
        match_index: Optional[int] = None
        for index in range(search_from, len(actual)):
            if actual[index] == expected_tool:
                match_index = index
                break

        if match_index is None:
            return False, matched_positions, expected_tool

        matched_positions.append(match_index)
        search_from = match_index + 1

    return True, matched_positions, None


class ExpectedOutcomeEvaluator(Evaluator):
    """Check tool usage, final answer content, and runtime against expectations."""

    @property
    def name(self) -> str:
        return "expected_outcome"

    async def evaluate(self, test_case: SqlTestCase, agent_result: AgentResult) -> EvaluationResult:
        if agent_result.error:
            return EvaluationResult(
                test_case=test_case,
                agent_result=agent_result,
                score=0.0,
                passed=False,
                reason=f"Agent execution failed: {agent_result.error}",
                issue_tags=["agent_failure"],
                execution_time_ms=agent_result.execution_time_ms,
                metadata={"failure_type": "agent_failure", "evaluator": self.name},
            )

        expected = test_case.expected_outcome
        if not expected or (
            not expected.tools_called
            and not expected.final_answer_contains
            and expected.max_execution_time_ms is None
        ):
            return EvaluationResult(
                test_case=test_case,
                agent_result=agent_result,
                score=1.0,
                passed=True,
                reason="No expected outcome defined",
                issue_tags=[],
                execution_time_ms=agent_result.execution_time_ms,
                metadata={
                    "evaluation_type": self.name,
                    "skipped": True,
                    "evaluator": self.name,
                },
            )

        checks: List[Dict[str, Any]] = []
        failed_tags: List[str] = []

        actual_tools = _tool_names(agent_result)
        if expected.tools_called:
            passed, matched_positions, missing_tool = _ordered_subsequence_match(
                actual_tools, expected.tools_called
            )
            reason = (
                "Tool call key path matched as an ordered subsequence"
                if passed
                else (
                    f"Expected key path {expected.tools_called} not found in "
                    f"actual trace {actual_tools}; missing {missing_tool!r}"
                )
            )
            checks.append(
                {
                    "name": "tools_called",
                    "passed": passed,
                    "expected": expected.tools_called,
                    "actual": actual_tools,
                    "matched_positions": matched_positions,
                    "reason": reason,
                    "comparison_mode": "ordered_subsequence",
                }
            )
            if not passed:
                failed_tags.append("tools_called_mismatch")

        if expected.final_answer_contains:
            final_answer = _answer_surface_text(agent_result.final_answer)
            if not final_answer.strip():
                passed = False
                missing = list(expected.final_answer_contains)
                reason = "Final answer was absent or empty"
                failed_tags.append("final_answer_absent")
            else:
                missing = [
                    fragment
                    for fragment in expected.final_answer_contains
                    if not _fragment_matches(final_answer, fragment)
                ]
                passed = not missing
                reason = (
                    "Final answer contained all required SQL fragments"
                    if passed
                    else f"Missing final-answer fragments: {missing}"
                )
                if not passed:
                    failed_tags.append("final_answer_fragment_mismatch")
            checks.append(
                {
                    "name": "final_answer_contains",
                    "passed": passed,
                    "expected": expected.final_answer_contains,
                    "actual": agent_result.final_answer,
                    "checked_surface": final_answer,
                    "reason": reason,
                    "comparison_mode": "normalized_contains",
                }
            )

        if expected.max_execution_time_ms is not None:
            passed = agent_result.execution_time_ms <= expected.max_execution_time_ms
            reason = (
                "Execution time within limit"
                if passed
                else (
                    f"Execution time {agent_result.execution_time_ms:.2f}ms exceeded "
                    f"{expected.max_execution_time_ms}ms"
                )
            )
            checks.append(
                {
                    "name": "max_execution_time_ms",
                    "passed": passed,
                    "expected": expected.max_execution_time_ms,
                    "actual": agent_result.execution_time_ms,
                    "reason": reason,
                }
            )
            if not passed:
                failed_tags.append("execution_time_exceeded")

        active_checks = len(checks)
        passed_checks = sum(1 for check in checks if check["passed"])
        score = passed_checks / active_checks if active_checks else 1.0
        passed = not failed_tags
        reason = (
            "Expected outcome satisfied"
            if passed
            else "; ".join(check["reason"] for check in checks if not check["passed"])
        )

        return EvaluationResult(
            test_case=test_case,
            agent_result=agent_result,
            score=score,
            passed=passed,
            reason=reason,
            issue_tags=failed_tags,
            execution_time_ms=agent_result.execution_time_ms,
            metadata={
                "evaluation_type": self.name,
                "check_results": checks,
                "expected_outcome": expected.model_dump(mode="json"),
                "actual": {
                    "tool_calls": actual_tools,
                    "final_answer": agent_result.final_answer,
                    "execution_time_ms": agent_result.execution_time_ms,
                },
                "evaluator": self.name,
            },
        )
