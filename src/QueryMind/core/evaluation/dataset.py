"""Dataset loader for QueryMind SQL evaluation."""

from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any, Dict, List, Optional

from .base import SqlTestCase
from .validation import EvaluationDatasetValidator


@lru_cache(maxsize=1)
def _default_validator() -> EvaluationDatasetValidator:
    return EvaluationDatasetValidator.default()


class EvaluationDataset:
    """Collection of SQL evaluation test cases."""

    def __init__(self, name: str, test_cases: List[SqlTestCase], description: str = ""):
        self.name = name
        self.test_cases = test_cases
        self.description = description

    @classmethod
    def from_yaml(cls, path: str | Path) -> "EvaluationDataset":
        try:
            import yaml
        except ImportError as exc:
            raise ImportError(
                "PyYAML is required to load YAML datasets. Install pyyaml or use JSON."
            ) from exc

        with open(path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)
        return cls._from_dict(data, source=str(path))

    @classmethod
    def from_json(cls, path: str | Path) -> "EvaluationDataset":
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return cls._from_dict(data, source=str(path))

    @classmethod
    def _from_dict(cls, data: Dict[str, Any], *, source: Optional[str] = None) -> "EvaluationDataset":
        _default_validator().validate(data, source=source)
        dataset = data.get("dataset", data)
        name = dataset.get("name", "Unnamed Dataset")
        description = dataset.get("description", "")

        test_cases = [cls._parse_test_case(item) for item in dataset.get("test_cases", [])]
        return cls(name=name, test_cases=test_cases, description=description)

    @staticmethod
    def _parse_test_case(data: Dict[str, Any]) -> SqlTestCase:
        return SqlTestCase.model_validate(data)

    def save_yaml(self, path: str | Path) -> None:
        try:
            import yaml
        except ImportError as exc:
            raise ImportError(
                "PyYAML is required to save YAML datasets. Install pyyaml or use JSON."
            ) from exc

        with open(path, "w", encoding="utf-8") as f:
            yaml.safe_dump(self._to_dict(), f, sort_keys=False, allow_unicode=True)

    def save_json(self, path: str | Path) -> None:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(self._to_dict(), f, indent=2, ensure_ascii=False)

    def _to_dict(self) -> Dict[str, Any]:
        return {
            "dataset": {
                "name": self.name,
                "description": self.description,
                "test_cases": [case.model_dump(mode="json") for case in self.test_cases],
            }
        }

    def filter_by_metadata(self, **kwargs: Any) -> "EvaluationDataset":
        filtered = [
            case
            for case in self.test_cases
            if all(case.metadata.get(key) == value for key, value in kwargs.items())
        ]
        return EvaluationDataset(
            name=f"{self.name} (filtered)",
            test_cases=filtered,
            description=f"Filtered from: {self.description}",
        )

    def group_by_database(self) -> Dict[str, List[SqlTestCase]]:
        grouped: Dict[str, List[SqlTestCase]] = {}
        for case in self.test_cases:
            grouped.setdefault(case.database_id, []).append(case)
        return grouped

    def __len__(self) -> int:
        return len(self.test_cases)

    def __iter__(self):
        return iter(self.test_cases)

    def __repr__(self) -> str:
        return f"EvaluationDataset(name='{self.name}', test_cases={len(self.test_cases)})"
