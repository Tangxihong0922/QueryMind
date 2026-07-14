from __future__ import annotations

from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from QueryMind.integrations.schemamemory.graph_layer.graph_store import (  # noqa: E402
    _build_relationship_pattern,
    _resolve_relationship_table,
)


def test_build_relationship_pattern_uses_valid_cypher_syntax() -> None:
    assert _build_relationship_pattern(None, 2) == ":FK_TO|REFERENCES*1..2"


def test_build_relationship_pattern_strips_colons_and_duplicates() -> None:
    assert _build_relationship_pattern(
        ["FK_TO", ":REFERENCES", "FK_TO"],
        2,
    ) == ":FK_TO|REFERENCES*1..2"


def test_build_relationship_pattern_can_restrict_to_single_type() -> None:
    assert _build_relationship_pattern(
        None,
        3,
        min_hops=0,
        default_types=("FK_TO",),
    ) == ":FK_TO*0..3"


def test_resolve_relationship_table_prefers_explicit_schema() -> None:
    assert _resolve_relationship_table("person", "person", "sales") == (
        "person",
        "person",
    )


def test_resolve_relationship_table_supports_legacy_dotted_name() -> None:
    assert _resolve_relationship_table("person.person", None, "sales") == (
        "person",
        "person",
    )


def test_resolve_relationship_table_falls_back_to_source_schema() -> None:
    assert _resolve_relationship_table("currency", None, "sales") == (
        "sales",
        "currency",
    )
