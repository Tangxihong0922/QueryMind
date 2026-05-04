from __future__ import annotations

from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from QueryMind.core.evaluation import (  # noqa: E402
    AgentResult,
    EvaluationReport,
    EvaluationResult,
    SqlExecutionArtifact,
    SqlTestCase,
)


def _make_result(
    *,
    test_case_id: str,
    passed: bool,
    agent_success: bool,
    score: float,
    execution_time_ms: float,
    difficulty: str = "medium",
    category: str = "analytics",
    source: str = "generated",
    query_language: str = "sql",
) -> EvaluationResult:
    test_case = SqlTestCase(
        id=test_case_id,
        database_id="demo_db",
        dialect="postgres",
        query="SELECT 1",
        ground_truth_sql="SELECT 1",
        difficulty=difficulty,
        metadata={
            "category": category,
            "source": source,
            "query_language": query_language,
        },
    )
    agent_result = AgentResult(
        test_case_id=test_case_id,
        database_id="demo_db",
        conversation_id="conv-1",
        user_id="user-1",
        execution_time_ms=execution_time_ms,
    )
    agent_artifact = SqlExecutionArtifact(
        sql_text="SELECT 1",
        success=agent_success,
        execution_time_ms=execution_time_ms,
    )
    return EvaluationResult(
        test_case=test_case,
        agent_result=agent_result,
        agent_artifact=agent_artifact,
        score=score,
        passed=passed,
        reason="ok" if passed else "failed",
        execution_time_ms=execution_time_ms,
    )


def test_save_html_includes_models_filter_and_two_decimal_rates(tmp_path: Path) -> None:
    report = EvaluationReport(
        dataset_name="demo dataset",
        results=[
            _make_result(
                test_case_id="case-1",
                passed=True,
                agent_success=True,
                score=1.0,
                execution_time_ms=120.0,
            ),
            _make_result(
                test_case_id="case-2",
                passed=False,
                agent_success=False,
                score=0.0,
                execution_time_ms=180.0,
            ),
        ],
        evaluator_names=["sql_accuracy"],
        metadata={
            "config_snapshot": {
                "agent_model": "deepseek-v4-flash",
                "judge_model": "deepseek-v4-flash",
            }
        },
    )

    output_path = tmp_path / "evaluation_report.html"
    report.save_html(output_path)
    html = output_path.read_text(encoding="utf-8")

    assert "Agent Model" in html
    assert "Judge Model" in html
    assert "deepseek-v4-flash" in html
    assert 'id="pass-filter"' in html
    assert 'id="sql-execution-filter"' in html
    assert "<th>SQL Execution</th>" in html
    assert '<option value="PASS">PASS</option>' in html
    assert '<option value="FAIL">FAIL</option>' in html
    assert '<option value="SUCCESS">SUCCESS</option>' in html
    assert 'data-passed="PASS"' in html
    assert 'data-passed="FAIL"' in html
    assert 'data-sql-execution="SUCCESS"' in html
    assert 'data-sql-execution="FAIL"' in html
    assert "row.dataset.passed === passStatus" in html
    assert "row.dataset.sqlExecution === sqlExecution" in html
    assert "50.00%" in html
    assert "50.0%" not in html
