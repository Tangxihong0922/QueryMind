"""Checkpoint and incremental result storage for evaluation runs."""

from __future__ import annotations

import json
import os
import re
import threading
import uuid
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple

from QueryMind.core.evaluation import EvaluationResult


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _safe_load_json(path: Path) -> Dict[str, Any]:
    if not path.exists():
        return {}
    with open(path, "r", encoding="utf-8") as handle:
        return json.load(handle)


def _write_json_atomic(path: Path, payload: Dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = path.with_suffix(path.suffix + f".{uuid.uuid4().hex}.tmp")
    with open(tmp_path, "w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2, ensure_ascii=False)
        handle.flush()
        os.fsync(handle.fileno())
    os.replace(tmp_path, path)


def compute_file_hash(path: Path) -> str:
    import hashlib

    digest = hashlib.sha256()
    with open(path, "rb") as handle:
        for chunk in iter(lambda: handle.read(65536), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _slugify_model_name(value: Any) -> str:
    text = str(value or "").strip().lower()
    if not text:
        return ""
    text = re.sub(r"[^a-z0-9.]+", "_", text)
    text = re.sub(r"_+", "_", text)
    return text.strip("._")


@dataclass
class ResumeCheckpoint:
    run_id: str
    dataset_path: str
    dataset_hash: str
    dataset_name: str
    dataset_description: str
    total_test_cases: int
    evaluator_names: List[str]
    config_snapshot: Dict[str, Any]
    created_at: str = field(default_factory=_utc_now)
    updated_at: str = field(default_factory=_utc_now)
    status: str = "running"
    completed_test_case_ids: List[str] = field(default_factory=list)
    completed_count: int = 0
    error: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, payload: Dict[str, Any]) -> "ResumeCheckpoint":
        return cls(
            run_id=str(payload.get("run_id") or ""),
            dataset_path=str(payload.get("dataset_path") or ""),
            dataset_hash=str(payload.get("dataset_hash") or ""),
            dataset_name=str(payload.get("dataset_name") or "Unnamed Dataset"),
            dataset_description=str(payload.get("dataset_description") or ""),
            total_test_cases=int(payload.get("total_test_cases") or 0),
            evaluator_names=list(payload.get("evaluator_names") or []),
            config_snapshot=dict(payload.get("config_snapshot") or {}),
            created_at=str(payload.get("created_at") or _utc_now()),
            updated_at=str(payload.get("updated_at") or _utc_now()),
            status=str(payload.get("status") or "running"),
            completed_test_case_ids=list(payload.get("completed_test_case_ids") or []),
            completed_count=int(payload.get("completed_count") or 0),
            error=payload.get("error"),
        )


class EvaluationRunStore:
    """Manage a single evaluation run directory."""

    def __init__(self, run_dir: Path, checkpoint: ResumeCheckpoint) -> None:
        self.run_dir = run_dir
        self.checkpoint_path = run_dir / "checkpoint.json"
        self.results_path = run_dir / "results.jsonl"
        self.log_path = run_dir / "run.log"
        self.checkpoint = checkpoint
        self._lock = threading.Lock()
        self._completed_ids = set(checkpoint.completed_test_case_ids)

    @classmethod
    def create_new(
        cls,
        root_dir: Path,
        *,
        dataset_path: Path,
        dataset_hash: str,
        dataset_name: str,
        dataset_description: str,
        total_test_cases: int,
        evaluator_names: List[str],
        config_snapshot: Dict[str, Any],
        run_id: Optional[str] = None,
    ) -> "EvaluationRunStore":
        run_id = run_id or f"{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:8]}"
        if not run_id:
            run_id = uuid.uuid4().hex[:12]
        run_dir = root_dir / run_id
        run_dir.mkdir(parents=True, exist_ok=False)
        checkpoint = ResumeCheckpoint(
            run_id=run_id,
            dataset_path=str(dataset_path),
            dataset_hash=dataset_hash,
            dataset_name=dataset_name,
            dataset_description=dataset_description,
            total_test_cases=total_test_cases,
            evaluator_names=evaluator_names,
            config_snapshot=config_snapshot,
            status="running",
        )
        store = cls(run_dir, checkpoint)
        store._write_checkpoint()
        return store

    @classmethod
    def open_existing(cls, run_dir: Path) -> "EvaluationRunStore":
        checkpoint_path = run_dir / "checkpoint.json"
        payload = _safe_load_json(checkpoint_path)
        if not payload:
            raise FileNotFoundError(f"Missing checkpoint.json in {run_dir}")
        return cls(run_dir, ResumeCheckpoint.from_dict(payload))

    @classmethod
    def find_latest(
        cls,
        root_dir: Path,
        *,
        dataset_hash: Optional[str] = None,
        only_incomplete: bool = True,
    ) -> Optional["EvaluationRunStore"]:
        candidates: List[Tuple[datetime, Path, ResumeCheckpoint]] = []
        if not root_dir.exists():
            return None

        for item in root_dir.iterdir():
            if not item.is_dir():
                continue
            checkpoint_path = item / "checkpoint.json"
            if not checkpoint_path.exists():
                continue
            try:
                checkpoint = ResumeCheckpoint.from_dict(_safe_load_json(checkpoint_path))
            except Exception:
                continue

            if dataset_hash and checkpoint.dataset_hash != dataset_hash:
                continue
            if only_incomplete and checkpoint.status == "completed":
                continue

            try:
                updated_at = datetime.fromisoformat(checkpoint.updated_at)
            except Exception:
                updated_at = datetime.fromtimestamp(item.stat().st_mtime, tz=timezone.utc)

            candidates.append((updated_at, item, checkpoint))

        if not candidates:
            return None

        _, run_dir, checkpoint = sorted(candidates, key=lambda item: item[0])[-1]
        return cls(run_dir, checkpoint)

    def refresh_from_disk(self) -> None:
        payload = _safe_load_json(self.checkpoint_path)
        if not payload:
            return
        self.checkpoint = ResumeCheckpoint.from_dict(payload)
        self._completed_ids = set(self.checkpoint.completed_test_case_ids)

    def hydrate_completed_ids(self, *, persist: bool = True) -> set[str]:
        """Merge checkpoint and result-file completion state into memory."""
        ids = set(self.checkpoint.completed_test_case_ids)
        ids.update(self._completed_ids_from_results())
        if ids != self._completed_ids:
            self._completed_ids = ids
            self.checkpoint.completed_test_case_ids = sorted(ids)
            self.checkpoint.completed_count = len(ids)
            self.checkpoint.updated_at = _utc_now()
            if persist:
                self._write_checkpoint()
        return set(self._completed_ids)

    def completed_test_case_ids(self) -> set[str]:
        return set(self._completed_ids)

    def append_result(self, result: EvaluationResult) -> None:
        test_case_id = result.test_case.id
        serialized = json.dumps(result.model_dump(mode="json"), ensure_ascii=False)

        with self._lock:
            if test_case_id in self._completed_ids:
                return

            self.results_path.parent.mkdir(parents=True, exist_ok=True)
            with open(self.results_path, "a", encoding="utf-8") as handle:
                handle.write(serialized)
                handle.write("\n")
                handle.flush()
                os.fsync(handle.fileno())

            self._completed_ids.add(test_case_id)
            self.checkpoint.completed_test_case_ids = sorted(self._completed_ids)
            self.checkpoint.completed_count = len(self._completed_ids)
            self.checkpoint.status = "running"
            self.checkpoint.updated_at = _utc_now()
            self._write_checkpoint()

    def mark_status(self, status: str, *, error: Optional[str] = None) -> None:
        with self._lock:
            self.checkpoint.status = status
            self.checkpoint.error = error
            self.checkpoint.updated_at = _utc_now()
            self.checkpoint.completed_test_case_ids = sorted(self._completed_ids)
            self.checkpoint.completed_count = len(self.checkpoint.completed_test_case_ids)
            self._write_checkpoint()

    def load_results(self, *, allow_partial_tail: bool = True) -> List[EvaluationResult]:
        results: List[EvaluationResult] = []
        if not self.results_path.exists():
            return results

        with open(self.results_path, "r", encoding="utf-8") as handle:
            lines = handle.readlines()

        last_nonempty = -1
        for index, line in enumerate(lines):
            if line.strip():
                last_nonempty = index

        for index, line in enumerate(lines):
            stripped = line.strip()
            if not stripped:
                continue
            try:
                payload = json.loads(stripped)
                results.append(EvaluationResult.model_validate(payload))
            except Exception:
                if allow_partial_tail and index == last_nonempty:
                    break
                raise
        return results

    def load_completed_ids_from_results(self) -> set[str]:
        return self._completed_ids_from_results()

    def _completed_ids_from_results(self) -> set[str]:
        completed: set[str] = set()
        for result in self.load_results():
            completed.add(result.test_case.id)
        return completed

    def _report_directory_name(self) -> str:
        agent_model = _slugify_model_name(self.checkpoint.config_snapshot.get("agent_model"))
        judge_model = _slugify_model_name(self.checkpoint.config_snapshot.get("judge_model"))

        suffix = ""
        if agent_model:
            suffix = agent_model
            if judge_model and judge_model != agent_model:
                suffix = f"{suffix}_judge_{judge_model}"

        return f"{self.checkpoint.run_id}_{suffix}" if suffix else self.checkpoint.run_id

    def _write_checkpoint(self) -> None:
        _write_json_atomic(self.checkpoint_path, self.checkpoint.to_dict())

    def report_output_dir(self, root_dir: Path) -> Path:
        if root_dir.name == "eval_output":
            root_dir = root_dir / "eval_results"
        desired_name = self._report_directory_name()
        if root_dir.name in {self.checkpoint.run_id, desired_name}:
            return root_dir
        return root_dir / desired_name
