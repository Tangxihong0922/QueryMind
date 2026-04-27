from __future__ import annotations

from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from QueryMind.components.rich.schema_management import (  # noqa: E402
    SchemaDetailComponent,
    SchemaListComponent,
)


def test_schema_list_serializes_with_schema_specific_type() -> None:
    component = SchemaListComponent(title="SchemaMemory Management")

    payload = component.serialize_for_frontend()

    assert payload["type"] == "schema_list"
    assert payload["data"]["title"] == "SchemaMemory Management"


def test_schema_detail_serializes_with_schema_specific_type() -> None:
    component = SchemaDetailComponent(
        table_name="department",
        domain="HumanResources",
        description="Department master table",
        keywords=["department", "organization"],
        completeness_score=100,
    )

    payload = component.serialize_for_frontend()

    assert payload["type"] == "schema_detail"
    assert payload["data"]["table_name"] == "department"
    assert payload["data"]["business_context"] == {
        "domain": "HumanResources",
        "description": "Department master table",
        "keywords": ["department", "organization"],
    }
    assert payload["data"]["completeness"] == {
        "score": 100,
        "missing_fields": [],
    }
