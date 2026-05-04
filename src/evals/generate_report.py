"""Generate evaluation reports from persisted resume points."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
SRC_DIR = SCRIPT_DIR.parent
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from evals.bootstrap import DEFAULT_REPORT_ROOT, DEFAULT_RESUME_ROOT
from evals.reporting import save_report_artifacts
from evals.resume_store import EvaluationRunStore


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate QueryMind evaluation reports")
    parser.add_argument("--run-id", help="Resume-point run id to load")
    parser.add_argument("--run-dir", help="Explicit run directory to load")
    parser.add_argument(
        "--resume-root",
        default=str(DEFAULT_RESUME_ROOT),
        help="Directory that stores resume points",
    )
    parser.add_argument(
        "--output-dir",
        help="Directory for generated reports (defaults to eval_output/<run_id>_<model>)",
    )
    parser.add_argument(
        "--latest",
        action="store_true",
        help="Use the latest stored run when run-id/run-dir is not provided",
    )
    return parser.parse_args()


def resolve_store(args: argparse.Namespace) -> EvaluationRunStore:
    if args.run_dir:
        return EvaluationRunStore.open_existing(Path(args.run_dir))

    resume_root = Path(args.resume_root)
    if args.run_id:
        return EvaluationRunStore.open_existing(resume_root / args.run_id)

    if args.latest:
        store = EvaluationRunStore.find_latest(resume_root, only_incomplete=False)
        if store is None:
            raise FileNotFoundError(f"No checkpoint found in {resume_root}")
        return store

    raise ValueError("Specify --run-id, --run-dir, or --latest")


def main() -> None:
    args = parse_args()
    store = resolve_store(args)
    report_root = Path(args.output_dir).expanduser() if args.output_dir else DEFAULT_REPORT_ROOT
    output_dir = store.report_output_dir(report_root)
    report = save_report_artifacts(store, output_dir)
    print(f"Report generated: {output_dir}")
    print(f"Run status: {report.run_status()}")
    progress = report.run_progress()
    if progress:
        print(f"Progress: {progress}")


if __name__ == "__main__":
    main()
