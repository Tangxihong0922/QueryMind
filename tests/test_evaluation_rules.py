from __future__ import annotations

import asyncio
from pathlib import Path
import sys
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from QueryMind.core.evaluation.base import (  # noqa: E402
    AgentResult,
    ExpectedOutcome,
    SqlTestCase,
    ToolInvocationRecord,
)
from QueryMind.core.evaluation.evaluators import (  # noqa: E402
    SqlAccuracyEvaluator,
    _parse_judge_output,
)
from QueryMind.core.evaluation.outcome import ExpectedOutcomeEvaluator  # noqa: E402


def _make_test_case(expected_outcome: ExpectedOutcome | None = None) -> SqlTestCase:
    return SqlTestCase(
        id="sql_test",
        database_id="adventureworks",
        dialect="postgres",
        query="demo query",
        ground_truth_sql="SELECT 1",
        expected_outcome=expected_outcome,
    )


def _make_agent_result(tool_names: list[str], final_answer: str) -> AgentResult:
    return AgentResult(
        test_case_id="sql_test",
        database_id="adventureworks",
        conversation_id="conv-1",
        user_id="u1",
        final_answer=final_answer,
        tool_calls=[
            ToolInvocationRecord(
                tool_call_id=f"tool-{index}",
                tool_name=name,
                arguments={},
            )
            for index, name in enumerate(tool_names, start=1)
        ],
        execution_time_ms=1234.0,
    )


def test_expected_outcome_tools_called_allows_key_path_subsequence() -> None:
    test_case = _make_test_case(
        ExpectedOutcome(
            tools_called=["schema_retrieve", "schema_retrieve", "run_sql"],
        )
    )
    agent_result = _make_agent_result(
        ["schema_retrieve", "schema_retrieve", "schema_retrieve", "run_sql"],
        "SELECT 1",
    )

    result = asyncio.run(ExpectedOutcomeEvaluator().evaluate(test_case, agent_result))

    assert result.passed is True
    tools_check = next(
        check for check in result.metadata["check_results"] if check["name"] == "tools_called"
    )
    assert tools_check["matched_positions"] == [0, 1, 3]


def test_expected_outcome_tools_called_requires_order() -> None:
    test_case = _make_test_case(
        ExpectedOutcome(
            tools_called=["schema_retrieve", "schema_retrieve", "run_sql"],
        )
    )
    agent_result = _make_agent_result(
        ["schema_retrieve", "run_sql", "schema_retrieve"],
        "SELECT 1",
    )

    result = asyncio.run(ExpectedOutcomeEvaluator().evaluate(test_case, agent_result))

    assert result.passed is False
    tools_check = next(
        check for check in result.metadata["check_results"] if check["name"] == "tools_called"
    )
    assert tools_check["passed"] is False


def test_expected_outcome_final_answer_checks_sql_surface() -> None:
    test_case = _make_test_case(
        ExpectedOutcome(
            final_answer_contains=["SELECT", "FROM", "GROUP BY", "ORDER BY"],
        )
    )
    agent_result = _make_agent_result(
        ["run_sql"],
        "Here is the SQL:\n```sql\nSELECT customerid, SUM(freight)\nFROM sales.salesorderheader\nGROUP BY customerid\nORDER BY customerid ASC;\n```",
    )

    result = asyncio.run(ExpectedOutcomeEvaluator().evaluate(test_case, agent_result))

    assert result.passed is True


def test_expected_outcome_short_keyword_uses_word_boundary() -> None:
    test_case = _make_test_case(
        ExpectedOutcome(
            final_answer_contains=["IN"],
        )
    )
    agent_result = _make_agent_result(["run_sql"], "The word information appears here.")

    result = asyncio.run(ExpectedOutcomeEvaluator().evaluate(test_case, agent_result))

    assert result.passed is False


def test_expected_outcome_final_answer_absent_uses_distinct_tag() -> None:
    test_case = _make_test_case(
        ExpectedOutcome(final_answer_contains=["SELECT"]),
    )
    agent_result = _make_agent_result(["run_sql"], "")

    result = asyncio.run(ExpectedOutcomeEvaluator().evaluate(test_case, agent_result))

    assert result.passed is False
    assert "final_answer_absent" in result.issue_tags
    assert "final_answer_fragment_mismatch" not in result.issue_tags


def test_expected_outcome_final_answer_fragment_mismatch_uses_distinct_tag() -> None:
    test_case = _make_test_case(
        ExpectedOutcome(final_answer_contains=["SELECT", "ORDER BY"]),
    )
    agent_result = _make_agent_result(["run_sql"], "```sql\nSELECT 1\n```")

    result = asyncio.run(ExpectedOutcomeEvaluator().evaluate(test_case, agent_result))

    assert result.passed is False
    assert "final_answer_fragment_mismatch" in result.issue_tags
    assert "final_answer_absent" not in result.issue_tags


def test_parse_judge_output_recovers_json_from_prose() -> None:
    raw_output = (
        "I checked an example {ignore this} before the actual decision:\n"
        "{\n"
        '  "passed": false,\n'
        '  "issue_tags": ["wrong_semantics"],\n'
        '  "reason": "Rows differ",\n'
        '  "confidence": 0.82\n'
        "}\n"
        "Thanks."
    )

    parsed, source = _parse_judge_output(raw_output)

    assert source == "raw"
    assert parsed["passed"] is False
    assert parsed["issue_tags"] == ["wrong_semantics"]
    assert parsed["reason"] == "Rows differ"


def test_sql_accuracy_falls_back_to_artifact_match_when_judge_parse_fails() -> None:
    evaluator = SqlAccuracyEvaluator(
        runtime_resolver=SimpleNamespace(),
        judge_llm=SimpleNamespace(),
    )
    artifact = SimpleNamespace(
        column_names=["id", "name"],
        row_count=2,
        preview_rows=[{"id": 1, "name": "a"}, {"id": 2, "name": "b"}],
        truncated=False,
    )

    judge_result = evaluator._fallback_judge_from_artifacts(
        _make_test_case(),
        artifact,
        artifact,
    )

    assert judge_result is not None
    assert judge_result.passed is True
    assert judge_result.issue_tags == ["formatting_only"]
