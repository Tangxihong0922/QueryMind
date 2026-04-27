"""Helpers for building reports from persisted evaluation runs."""

from __future__ import annotations

from pathlib import Path
from typing import List

from QueryMind.core.evaluation import EvaluationReport, EvaluationResult

try:  # noqa: E402
    from .resume_store import EvaluationRunStore
except ImportError:  # pragma: no cover - script execution fallback
    from resume_store import EvaluationRunStore


def load_deduplicated_results(store: EvaluationRunStore) -> List[EvaluationResult]:
    """Load results from disk and keep the latest result for each test case id."""
    ordered: dict[str, EvaluationResult] = {}
    for result in store.load_results():
        ordered[result.test_case.id] = result
    return list(ordered.values())


def build_report_from_store(store: EvaluationRunStore) -> EvaluationReport:
    results = load_deduplicated_results(store)
    completed_ids = [result.test_case.id for result in results]
    checkpoint = store.checkpoint
    report = EvaluationReport(
        dataset_name=checkpoint.dataset_name,
        results=results,
        evaluator_names=checkpoint.evaluator_names,
        metadata={
            "run_id": checkpoint.run_id,
            "run_status": checkpoint.status,
            "completed_test_cases": len(results),
            "total_test_cases": checkpoint.total_test_cases,
            "completed_test_case_ids": completed_ids,
            "dataset_path": checkpoint.dataset_path,
            "dataset_hash": checkpoint.dataset_hash,
            "dataset_description": checkpoint.dataset_description,
            "config_snapshot": checkpoint.config_snapshot,
            "checkpoint_path": str(store.checkpoint_path),
            "results_path": str(store.results_path),
            "log_path": str(store.log_path),
            "error": checkpoint.error,
        },
    )
    report.enrich_metadata()
    return report


def save_report_artifacts(store: EvaluationRunStore, output_dir: Path) -> EvaluationReport:
    report = build_report_from_store(store)
    output_dir.mkdir(parents=True, exist_ok=True)
    report.save_json(output_dir / "evaluation_report.json")
    report.save_csv(output_dir / "evaluation_report.csv")
    report.save_markdown(output_dir / "evaluation_report.md")
    report.save_html(output_dir / "evaluation_report.html")
    return report
