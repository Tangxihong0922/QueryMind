from __future__ import annotations

from pathlib import Path
from types import SimpleNamespace
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from QueryMind.evaluation_cli import (  # noqa: E402
    build_evaluator_names,
    should_include_expected_outcome,
)


def test_build_evaluator_names_supports_sql_accuracy_only() -> None:
    assert build_evaluator_names(include_expected_outcome=False) == ["sql_accuracy"]
    assert build_evaluator_names(include_expected_outcome=True) == [
        "sql_accuracy",
        "expected_outcome",
    ]


def test_should_include_expected_outcome_respects_flag_and_env(monkeypatch) -> None:
    monkeypatch.delenv("EVAL_SKIP_EXPECTED_OUTCOME", raising=False)

    assert should_include_expected_outcome(SimpleNamespace(skip_expected_outcome=False)) is True
    assert should_include_expected_outcome(SimpleNamespace(skip_expected_outcome=True)) is False

    monkeypatch.setenv("EVAL_SKIP_EXPECTED_OUTCOME", "true")
    assert should_include_expected_outcome(SimpleNamespace(skip_expected_outcome=False)) is False
