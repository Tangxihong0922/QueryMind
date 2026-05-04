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

    assert store.report_output_dir(tmp_path / "eval_output") == tmp_path / "eval_output" / store.checkpoint.run_id


def test_report_output_dir_keeps_explicit_run_dir(tmp_path: Path) -> None:
    store = _make_store(tmp_path)
    explicit = tmp_path / "eval_output" / store.checkpoint.run_id

    assert store.report_output_dir(explicit) == explicit


def test_report_output_dir_appends_model_suffix(tmp_path: Path) -> None:
    store = _make_store(tmp_path)
    store.checkpoint.config_snapshot = {
        "agent_model": "deepseek-v4-flash",
        "judge_model": "deepseek-v4-flash",
    }

    expected = tmp_path / "eval_output" / f"{store.checkpoint.run_id}_deepseek_v4_flash"

    assert store.report_output_dir(tmp_path / "eval_output") == expected


def test_report_output_dir_includes_judge_suffix_when_models_differ(tmp_path: Path) -> None:
    store = _make_store(tmp_path)
    store.checkpoint.config_snapshot = {
        "agent_model": "deepseek-v4-flash",
        "judge_model": "Minimax-M2.7",
    }

    expected = (
        tmp_path
        / "eval_output"
        / f"{store.checkpoint.run_id}_deepseek_v4_flash_judge_minimax_m2.7"
    )

    assert store.report_output_dir(tmp_path / "eval_output") == expected
