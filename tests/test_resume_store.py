from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from evals.resume_store import EvaluationRunStore, ResumeCheckpoint  # noqa: E402


def _make_store(tmp_path: Path, run_id: str = "20260423_000000_deadbeef") -> EvaluationRunStore:
    checkpoint = ResumeCheckpoint(
        run_id=run_id,
        dataset_path="/tmp/dataset.yaml",
        dataset_hash="hash",
        dataset_name="demo",
        dataset_description="demo",
        total_test_cases=1,
        evaluator_names=["sql_accuracy"],
        config_snapshot={},
        created_at=datetime.now(timezone.utc).isoformat(),
        updated_at=datetime.now(timezone.utc).isoformat(),
    )
    return EvaluationRunStore(tmp_path / run_id, checkpoint)


def test_report_output_dir_appends_run_id(tmp_path: Path) -> None:
    store = _make_store(tmp_path)

    assert (
        store.report_output_dir(tmp_path / "eval_output" / "eval_results")
        == tmp_path / "eval_output" / "eval_results" / store.checkpoint.run_id
    )


def test_report_output_dir_keeps_explicit_run_dir(tmp_path: Path) -> None:
    store = _make_store(tmp_path)
    explicit = tmp_path / "eval_output" / "eval_results" / store.checkpoint.run_id

    assert store.report_output_dir(explicit) == explicit


def test_report_output_dir_appends_model_suffix(tmp_path: Path) -> None:
    store = _make_store(tmp_path)
    store.checkpoint.config_snapshot = {
        "agent_model": "deepseek-v4-flash",
        "judge_model": "deepseek-v4-flash",
    }

    expected = (
        tmp_path
        / "eval_output"
        / "eval_results"
        / f"{store.checkpoint.run_id}_deepseek_v4_flash"
    )

    assert store.report_output_dir(tmp_path / "eval_output" / "eval_results") == expected


def test_report_output_dir_includes_judge_suffix_when_models_differ(tmp_path: Path) -> None:
    store = _make_store(tmp_path)
    store.checkpoint.config_snapshot = {
        "agent_model": "deepseek-v4-flash",
        "judge_model": "Minimax-M2.7",
    }

    expected = (
        tmp_path
        / "eval_output"
        / "eval_results"
        / f"{store.checkpoint.run_id}_deepseek_v4_flash_judge_minimax_m2.7"
    )

    assert store.report_output_dir(tmp_path / "eval_output" / "eval_results") == expected


def test_find_latest_filters_by_evaluator_names(tmp_path: Path) -> None:
    old_store = _make_store(tmp_path, run_id="20260423_000000_old")
    old_store.checkpoint.evaluator_names = ["sql_accuracy", "expected_outcome"]
    old_store.checkpoint.updated_at = "2024-01-01T00:00:00+00:00"
    old_store._write_checkpoint()

    new_store = _make_store(tmp_path, run_id="20260423_000001_new")
    new_store.checkpoint.evaluator_names = ["sql_accuracy"]
    new_store.checkpoint.updated_at = "2024-01-02T00:00:00+00:00"
    new_store._write_checkpoint()

    found = EvaluationRunStore.find_latest(
        tmp_path,
        dataset_hash="hash",
        evaluator_names=["sql_accuracy"],
        only_incomplete=True,
    )

    assert found is not None
    assert found.checkpoint.evaluator_names == ["sql_accuracy"]
