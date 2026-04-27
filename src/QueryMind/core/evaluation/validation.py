"""Dataset validation helpers for QueryMind evaluation."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional

import yaml


DEFAULT_SPEC_PATH = Path(__file__).resolve().parents[2] / "evals" / "datasets" / "test_case_spec.yaml"
if not DEFAULT_SPEC_PATH.exists():
    DEFAULT_SPEC_PATH = Path(__file__).resolve().parents[3] / "evals" / "datasets" / "test_case_spec.yaml"
_MISSING = object()


@dataclass(frozen=True)
class ValidationIssue:
    """One validation issue discovered while checking a dataset."""

    path: str
    message: str

    def format(self) -> str:
        return f"{self.path}: {self.message}"


class DatasetValidationError(ValueError):
    """Raised when a dataset fails schema validation."""

    def __init__(self, issues: List[ValidationIssue], *, source: Optional[str] = None) -> None:
        self.issues = issues
        self.source = source
        prefix = f"Dataset validation failed for {source}" if source else "Dataset validation failed"
        details = "\n".join(f"- {issue.format()}" for issue in issues)
        super().__init__(f"{prefix}\n{details}")


class EvaluationDatasetValidator:
    """Validate evaluation datasets against the canonical test case spec."""

    def __init__(self, spec: Dict[str, Any], *, source: Optional[str] = None) -> None:
        self.spec = spec
        self.source = source
        self.required_fields = list(spec.get("required_fields", []))
        self.field_specs = dict(spec.get("test_case_fields", {}))

    @classmethod
    def from_yaml(cls, path: str | Path = DEFAULT_SPEC_PATH) -> "EvaluationDatasetValidator":
        with open(path, "r", encoding="utf-8") as handle:
            spec = yaml.safe_load(handle) or {}
        return cls(spec, source=str(path))

    @classmethod
    def default(cls) -> "EvaluationDatasetValidator":
        return cls.from_yaml(DEFAULT_SPEC_PATH)

    def validate(self, data: Dict[str, Any], *, source: Optional[str] = None) -> None:
        issues = self.collect_issues(data)
        if issues:
            raise DatasetValidationError(issues, source=source or self.source)

    def collect_issues(self, data: Dict[str, Any]) -> List[ValidationIssue]:
        issues: List[ValidationIssue] = []
        if not isinstance(data, dict):
            return [ValidationIssue(path="$", message="Dataset must be a mapping")]

        dataset = data.get("dataset", data)
        if not isinstance(dataset, dict):
            return [ValidationIssue(path="$", message="Dataset root must be a mapping")]

        test_cases = dataset.get("test_cases", _MISSING)
        if test_cases is _MISSING:
            issues.append(ValidationIssue(path="dataset.test_cases", message="Missing test_cases list"))
            return issues

        if not isinstance(test_cases, list):
            issues.append(ValidationIssue(path="dataset.test_cases", message="test_cases must be a list"))
            return issues

        if not test_cases:
            issues.append(ValidationIssue(path="dataset.test_cases", message="test_cases must not be empty"))
            return issues

        seen_ids: set[str] = set()
        for index, test_case in enumerate(test_cases):
            issues.extend(self._collect_test_case_issues(test_case, f"dataset.test_cases[{index}]"))
            if isinstance(test_case, dict):
                test_case_id = test_case.get("id")
                if isinstance(test_case_id, str) and test_case_id.strip():
                    if test_case_id in seen_ids:
                        issues.append(
                            ValidationIssue(
                                path=f"dataset.test_cases[{index}].id",
                                message=f"Duplicate test case id '{test_case_id}'",
                            )
                        )
                    else:
                        seen_ids.add(test_case_id)

        return issues

    def _collect_test_case_issues(self, test_case: Any, path: str) -> List[ValidationIssue]:
        issues: List[ValidationIssue] = []
        if not isinstance(test_case, dict):
            return [ValidationIssue(path=path, message="Test case must be a mapping")]

        for field_name in self.required_fields:
            if field_name not in test_case:
                issues.append(ValidationIssue(path=f"{path}.{field_name}", message="Missing required field"))

        for field_name, field_spec in self.field_specs.items():
            if field_name not in test_case:
                continue
            issues.extend(self._validate_field(test_case[field_name], field_spec, f"{path}.{field_name}"))

        return issues

    def _validate_field(
        self,
        value: Any,
        field_spec: Dict[str, Any],
        path: str,
    ) -> List[ValidationIssue]:
        issues: List[ValidationIssue] = []
        required = bool(field_spec.get("required", False))

        if value is _MISSING:
            if required:
                issues.append(ValidationIssue(path=path, message="Missing required field"))
            return issues

        type_name = field_spec.get("type")
        if type_name == "string":
            if not isinstance(value, str):
                issues.append(ValidationIssue(path=path, message="Expected string"))
        elif type_name == "integer":
            if not isinstance(value, int) or isinstance(value, bool):
                issues.append(ValidationIssue(path=path, message="Expected integer"))
        elif type_name == "list[string]":
            if not isinstance(value, list):
                issues.append(ValidationIssue(path=path, message="Expected list[string]"))
            elif any(not isinstance(item, str) for item in value):
                issues.append(ValidationIssue(path=path, message="Expected every item to be a string"))
        elif type_name == "object":
            if not isinstance(value, dict):
                issues.append(ValidationIssue(path=path, message="Expected object"))
        elif type_name is not None:
            issues.append(ValidationIssue(path=path, message=f"Unsupported field type '{type_name}'"))

        allowed_values = field_spec.get("allowed_values")
        if allowed_values and value is not None:
            if type_name == "list[string]" and isinstance(value, list):
                invalid_items = [item for item in value if item not in allowed_values]
                if invalid_items:
                    issues.append(
                        ValidationIssue(
                            path=path,
                            message=f"Contains invalid values: {invalid_items}",
                        )
                    )
            elif type_name != "object" and value not in allowed_values:
                issues.append(
                    ValidationIssue(
                        path=path,
                        message=f"Invalid value '{value}'. Allowed values: {allowed_values}",
                    )
                )

        nested_fields = field_spec.get("fields", {})
        if type_name == "object" and isinstance(value, dict) and nested_fields:
            for nested_name, nested_spec in nested_fields.items():
                nested_value = value.get(nested_name, _MISSING)
                issues.extend(
                    self._validate_field(
                        nested_value,
                        nested_spec,
                        f"{path}.{nested_name}",
                    )
                )

        return issues
