from __future__ import annotations
"""
Prompt rendering helpers for SQL governance.

This module keeps all prompt prose and recap generation separate from the state
machine so `sql_governance.py` can stay focused on runtime decisions.
"""

import re
from dataclasses import dataclass, field
from typing import Any, Dict, Iterable, List, Optional, Sequence

from .sql_governance_shape import (
    _collapse_sql,
    _dedupe_preserve_order,
    _normalize_text,
    _strong_exclusion_cue,
    _strong_grouping_cue,
    _strong_navigation_window_cue,
    _strong_ranking_window_cue,
    _strong_rollup_cue,
    _strong_window_cue,
)

DEFAULT_SQL_GOVERNANCE_PROMPT = """
## SQL Governance

- Avoid metadata introspection queries unless they are explicitly allowed.
- Keep the current row grain stable and move to `run_sql` once the table path is clear.
"""

DEFAULT_SQL_GOVERNANCE_RECAP = """
## SQL Self-Check Reminder

Keep the current row grain stable and rewrite from scratch only where the shape drifted.
"""


@dataclass(slots=True)
class SqlGovernanceProfile:
    """Task profile inferred from a test case or the user's query."""

    source: str = "unknown"
    categories: List[str] = field(default_factory=list)
    notes: List[str] = field(default_factory=list)
    allow_metadata_query: bool = False

    def signature(self) -> str:
        parts = [self.source, *self.categories, *self.notes]
        return "|".join(_dedupe_preserve_order(parts))


def _profile_category_hints(category: str) -> List[str]:
    hints = {
        "window": "Preserve the window shape and keep the row order stable.",
        "ranking": "Use a windowed ranking pattern when the task asks for ordering within a group.",
        "aggregation": "Preserve row grain before adding a grouped summary.",
        "grouping": "Keep non-aggregated projections aligned with the grouped summary.",
        "join": "Preserve join coverage and avoid shrinking the result too early.",
        "ordering": "Add only the requested ordering.",
        "distinct": "Use DISTINCT only if the result must be deduplicated.",
        "subquery": "A nested form is acceptable when it keeps the main path stable.",
        "filtering": "Keep the predicate set tight and avoid widening the projection.",
        "set_operation": "Keep UNION / INTERSECT / EXCEPT semantics intact; do not collapse them into plain filtering.",
        "time_series": "Keep the time grain and time ordering explicit; do not reduce it to a generic date filter.",
    }
    hint = hints.get(category)
    return [hint] if hint else []


def build_sql_governance_profile(
    *,
    tags: Optional[Iterable[str]] = None,
    query: Optional[str] = None,
    category: Optional[str] = None,
    source: str = "unknown",
) -> SqlGovernanceProfile:
    """Infer a profile from dataset tags or a free-form query."""
    raw_tags = [str(tag).strip().lower() for tag in tags or [] if str(tag).strip()]
    inferred: List[str] = []

    tag_pool = set(raw_tags)
    if category:
        tag_pool.add(str(category).strip().lower())

    if any(tag in tag_pool for tag in {"window", "ranking"}):
        inferred.append("window")
    if "ranking" in tag_pool:
        inferred.append("ranking")
    if any(tag in tag_pool for tag in {"aggregation", "group_by", "grouping", "having"}):
        inferred.append("aggregation")
    if any(tag in tag_pool for tag in {"group_by", "grouping", "having"}):
        inferred.append("grouping")
    if any(tag in tag_pool for tag in {"join", "multi_table"}):
        inferred.append("join")
    if "ordering" in tag_pool:
        inferred.append("ordering")
    if "distinct" in tag_pool:
        inferred.append("distinct")
    if "subquery" in tag_pool:
        inferred.append("subquery")
    if any(tag in tag_pool for tag in {"filtering", "date_filter", "numeric_filter", "text_filter", "null_handling", "comparison"}):
        inferred.append("filtering")
    if "set_operation" in tag_pool:
        inferred.append("set_operation")
    if "time_series" in tag_pool:
        inferred.append("time_series")

    query_text = _normalize_text(query)
    if query_text:
        if re.search(r"\b(over|partition by|row_number|rank|dense_rank|lag|lead|first_value|last_value|ntile|cume_dist|percent_rank)\b", query_text):
            inferred.extend(["window", "ranking"])
        if re.search(r"\b(group by|having|rollup|grouping sets?)\b", query_text):
            inferred.extend(["aggregation", "grouping"])
        if re.search(r"\b(join|left join|right join|full outer join|inner join|outer join)\b", query_text):
            inferred.append("join")
        if re.search(r"\b(order by|sorted|ascending|descending)\b", query_text):
            inferred.append("ordering")
        if re.search(r"\bdistinct\b", query_text):
            inferred.append("distinct")
        if re.search(r"\b(subquery|nested query|in\s*\()\b", query_text):
            inferred.append("subquery")
        if re.search(r"\b(union(?:\s+all)?|intersect|except)\b", query_text):
            inferred.append("set_operation")
        if re.search(
            r"\b(time series|time-series|trend|trends|over time|by date|by day|by week|by month|by quarter|by year|monthly|quarterly|yearly|daily|weekly|mtd|qtd|ytd|mom|mom growth|yoy|year over year|month over month)\b",
            query_text,
        ):
            inferred.append("time_series")

    categories = _dedupe_preserve_order(inferred)
    notes = _dedupe_preserve_order(raw_tags)
    if category:
        notes = _dedupe_preserve_order([*notes, str(category).strip().lower()])

    return SqlGovernanceProfile(
        source=source,
        categories=categories,
        notes=notes,
    )


def parse_sql_governance_profile(data: Any) -> Optional[SqlGovernanceProfile]:
    """Parse a profile from request metadata or a raw dict."""
    if data is None:
        return None
    if isinstance(data, SqlGovernanceProfile):
        return data
    if not isinstance(data, dict):
        return None

    categories = data.get("categories")
    if not categories:
        categories = data.get("tags") or data.get("focus") or []

    notes = data.get("notes") or data.get("hint_tags") or []
    if not categories and not notes:
        runtime_profile = _profile_from_runtime_profile_snapshot(data)
        if runtime_profile is not None:
            return runtime_profile
    return SqlGovernanceProfile(
        source=str(data.get("source") or "metadata"),
        categories=_dedupe_preserve_order(categories),
        notes=_dedupe_preserve_order(notes),
        allow_metadata_query=bool(data.get("allow_metadata_query", False)),
    )


def infer_profile_from_message(message: str) -> SqlGovernanceProfile:
    """Heuristically infer a profile from a user message."""
    return build_sql_governance_profile(query=message, source="message")


def _profile_gap_categories(profile: Optional[SqlGovernanceProfile], features: Dict[str, Any]) -> List[str]:
    if not profile:
        return []

    categories = set(profile.categories)
    gaps: List[str] = []

    if "window" in categories and not features.get("has_over"):
        gaps.append("window")
    if "ranking" in categories and not features.get("has_ranking_window_function"):
        gaps.append("ranking")
    if "aggregation" in categories and not features.get("has_aggregation"):
        gaps.append("aggregation")
    if "grouping" in categories and not features.get("has_group_by"):
        gaps.append("grouping")
    if "join" in categories and not features.get("has_join"):
        gaps.append("join")
    if "ordering" in categories and not features.get("has_order_by"):
        gaps.append("ordering")
    if "distinct" in categories and not features.get("has_distinct"):
        gaps.append("distinct")
    if "subquery" in categories and not features.get("has_subquery"):
        gaps.append("subquery")
    if "filtering" in categories and not features.get("has_where"):
        gaps.append("filtering")
    if "grouping" in categories and not features.get("has_group_by") and not features.get("has_over"):
        gaps.append("grouping")
    if "set_operation" in categories and not features.get("has_set_operation"):
        gaps.append("set_operation")
    if "time_series" in categories and not features.get("has_time_series"):
        gaps.append("time_series")

    return _dedupe_preserve_order(gaps)


def analyze_sql_text(sql: str, *, dialect: Optional[str] = None) -> Dict[str, Any]:
    """Extract lightweight shape features from a SQL statement."""
    shape = analyze_sql_shape(sql, dialect=dialect)
    upper = shape.normalized_sql.upper()

    features: Dict[str, Any] = {
        "sql": sql,
        "length": len(sql or ""),
        "statement_count": shape.statement_count,
        "has_select": shape.has_select,
        "has_from": shape.has_from,
        "has_where": shape.has_where,
        "has_join": shape.has_join,
        "has_cross_join": shape.has_cross_join,
        "has_on": shape.has_on,
        "has_using": shape.has_using,
        "join_count": shape.join_count,
        "has_group_by": shape.has_group_by,
        "has_having": shape.has_having,
        "has_order_by": shape.has_order_by,
        "has_window_order_by": shape.has_window_order_by,
        "has_limit": shape.has_limit,
        "has_distinct": shape.has_distinct,
        "has_over": shape.has_over,
        "has_partition_by": shape.has_partition_by,
        "has_constant_partition_by": shape.has_constant_partition_by,
        "has_window_frame": shape.has_window_frame,
        "has_window_clause": bool(re.search(r"\bWINDOW\b", upper)),
        "has_window_function": shape.has_window_function,
        "has_navigation_window_function": shape.has_navigation_window_function,
        "has_ranking_window_function": shape.has_ranking_window_function,
        "has_aggregation": shape.has_aggregation,
        "has_subquery": shape.has_subquery,
        "subquery_count": len(re.findall(r"\(\s*SELECT\b", upper)),
        "cte_count": len(re.findall(r"\bWITH\b", upper)),
        "metadata_query": shape.metadata_query,
        "table_reference_count": len(shape.table_references),
        "table_references": list(shape.table_references),
        "select_items": list(shape.select_items),
        "group_by_items": list(shape.group_by_items),
        "aggregate_projection_count": shape.aggregate_projection_count,
        "non_aggregate_projection_count": shape.non_aggregate_projection_count,
        "window_function_names": list(shape.window_function_names),
        "feature_names": list(shape.feature_names),
        "has_rollup": shape.has_rollup,
        "has_grouping_sets": shape.has_grouping_sets,
        "has_grouping": shape.has_grouping,
        "has_outer_join": shape.has_outer_join,
        "has_outer_join_null_filter": shape.has_outer_join_null_filter,
        "outer_join_count": shape.outer_join_count,
        "null_filter_count": shape.null_filter_count,
        "sql_family": _shape_family_signature(
            {
                "has_navigation_window_function": shape.has_navigation_window_function,
                "has_ranking_window_function": shape.has_ranking_window_function,
                "has_over": shape.has_over,
                "has_rollup": shape.has_rollup,
                "has_grouping_sets": shape.has_grouping_sets,
                "has_grouping": shape.has_grouping,
                "has_group_by": shape.has_group_by,
                "has_having": shape.has_having,
                "has_join": shape.has_join,
                "has_subquery": shape.has_subquery,
            }
        ),
        "row_grain": _row_grain_label_from_features(
            {
                "has_rollup": shape.has_rollup,
                "has_grouping_sets": shape.has_grouping_sets,
                "has_grouping": shape.has_grouping,
                "has_group_by": shape.has_group_by,
                "has_having": shape.has_having,
                "has_aggregation": shape.has_aggregation,
                "aggregate_projection_count": shape.aggregate_projection_count,
                "non_aggregate_projection_count": shape.non_aggregate_projection_count,
                "has_over": shape.has_over,
            }
        ),
    }
    return features


def _shape_family_signature(features: Dict[str, Any]) -> str:
    if features.get("has_navigation_window_function"):
        return "navigation"
    if features.get("has_ranking_window_function"):
        return "ranking"
    if features.get("has_over"):
        return "window"
    if features.get("has_rollup"):
        return "rollup"
    if features.get("has_grouping_sets"):
        return "grouping_sets"
    if features.get("has_grouping"):
        return "grouping"
    if features.get("has_group_by") or features.get("has_having"):
        return "aggregation"
    if features.get("has_join"):
        return "join"
    if features.get("has_subquery"):
        return "subquery"
    return "detail"


def _shape_signature_from_features(
    features: Dict[str, Any],
    *,
    core: bool = False,
    canonical: bool = False,
) -> str:
    table_references = _dedupe_preserve_order(
        str(reference).strip().lower()
        for reference in features.get("table_references") or []
        if str(reference).strip()
    )
    if canonical:
        table_references = sorted(table_references)
    feature_names = _dedupe_preserve_order(
        str(name).strip().lower()
        for name in features.get("feature_names") or []
        if str(name).strip()
    )
    if canonical:
        feature_names = sorted(feature_names)
    window_function_names = _dedupe_preserve_order(
        str(name).strip().upper()
        for name in features.get("window_function_names") or []
        if str(name).strip()
    )
    if canonical:
        window_function_names = sorted(window_function_names)

    parts = [
        f"tables={','.join(table_references)}",
        f"family={_shape_family_signature(features)}",
        "join="
        f"{int(bool(features.get('has_join')))}:"
        f"{int(features.get('join_count') or 0)}:"
        f"{int(bool(features.get('has_cross_join')))}:"
        f"{int(bool(features.get('has_outer_join')))}:"
        f"{int(features.get('outer_join_count') or 0)}:"
        f"{int(bool(features.get('has_outer_join_null_filter')))}",
        f"group_by={int(bool(features.get('has_group_by')))}",
        f"having={int(bool(features.get('has_having')))}",
        f"aggregation={int(bool(features.get('has_aggregation')))}:"
        f"{int(features.get('aggregate_projection_count') or 0)}:"
        f"{int(features.get('non_aggregate_projection_count') or 0)}",
        f"subquery={int(bool(features.get('has_subquery')))}",
        f"rollup={int(bool(features.get('has_rollup')))}",
        f"grouping_sets={int(bool(features.get('has_grouping_sets')))}",
        f"grouping={int(bool(features.get('has_grouping')))}",
        f"distinct={int(bool(features.get('has_distinct')))}",
        f"limit={int(bool(features.get('has_limit')))}",
    ]

    if not core:
        parts.extend(
            [
                f"order_by={int(bool(features.get('has_order_by')))}",
                f"window_order_by={int(bool(features.get('has_window_order_by')))}",
                f"partition_by={int(bool(features.get('has_partition_by')))}",
                f"window_frame={int(bool(features.get('has_window_frame')))}",
                f"constant_partition_by={int(bool(features.get('has_constant_partition_by')))}",
                f"window_functions={','.join(window_function_names)}",
                f"feature_names={','.join(feature_names)}",
            ]
        )

    return "|".join(parts)


_SQL_FAMILY_PRIORITY: List[str] = [
    "navigation",
    "ranking",
    "rollup",
    "grouping",
    "aggregation",
    "join",
    "subquery",
    "ordering",
    "filtering",
    "detail",
]

_SQL_FAMILY_FALLBACKS: Dict[str, str] = {
    "navigation": "ranking",
    "ranking": "navigation",
    "rollup": "grouping",
    "grouping": "aggregation",
    "aggregation": "grouping",
    "join": "subquery",
    "subquery": "join",
    "ordering": "detail",
    "filtering": "detail",
    "detail": "detail",
}


def _row_grain_label_from_features(features: Dict[str, Any]) -> str:
    if features.get("has_rollup") or features.get("has_grouping_sets") or features.get(
        "has_grouping"
    ):
        return "subtotal"
    if features.get("has_group_by") or features.get("has_having"):
        return "grouped"
    if features.get("has_aggregation"):
        if (
            int(features.get("aggregate_projection_count") or 0) > 0
            and int(features.get("non_aggregate_projection_count") or 0) > 0
        ):
            return "mixed"
        return "summary"
    if features.get("has_over"):
        return "detail"
    return "detail"


def _expected_row_grain_label(
    *,
    message_text: str,
    profile: Optional[SqlGovernanceProfile] = None,
    family: Optional[str] = None,
) -> str:
    categories = {
        str(category).strip().lower()
        for category in (profile.categories if profile else [])
        if str(category).strip()
    }
    normalized_message = _normalize_text(message_text)

    if "rollup" in categories or _strong_rollup_cue(normalized_message):
        return "subtotal"

    if family in {"navigation", "ranking", "join", "subquery", "ordering", "filtering"}:
        return "detail"
    if (
        family in {"aggregation", "grouping"}
    ):
        return "grouped"
    if family == "rollup":
        return "subtotal"

    if (
        {"aggregation", "grouping"} & categories
        or _strong_grouping_cue(normalized_message)
    ):
        return "grouped"

    return "detail"


def _resolve_sql_family_state(
    *,
    profile: Optional[SqlGovernanceProfile] = None,
    features: Optional[Dict[str, Any]] = None,
    last_gap_categories: Optional[Iterable[str]] = None,
    user_message: Optional[str] = None,
    current_family: Optional[str] = None,
) -> Dict[str, Any]:
    feature_map = dict(features or {})
    message_text = _semantic_message_text(user_message=user_message, context_metadata=None)
    if not message_text and profile:
        message_text = " ".join(
            [
                profile.source,
                *profile.categories,
                *profile.notes,
            ]
        )

    categories = {
        str(category).strip().lower()
        for category in (profile.categories if profile else [])
        if str(category).strip()
    }
    gaps = {
        str(gap).strip().lower()
        for gap in (last_gap_categories or [])
        if str(gap).strip()
    }
    has_signal = bool(message_text.strip() or categories or feature_map or gaps or current_family)
    if not has_signal:
        return {
            "sql_family": None,
            "sql_family_candidates": [],
            "row_grain_state": {},
        }

    scores: Dict[str, int] = {family: 0 for family in _SQL_FAMILY_PRIORITY}
    scores["detail"] = 1
    if current_family in scores:
        scores[current_family] += 1

    normalized_message = _normalize_text(message_text)

    if _strong_navigation_window_cue(normalized_message):
        scores["navigation"] += 6
    if _strong_ranking_window_cue(normalized_message):
        scores["ranking"] += 6
    if _strong_window_cue(normalized_message):
        scores["navigation"] += 2
        scores["ranking"] += 2
        scores["navigation"] += 1
    if _strong_rollup_cue(normalized_message):
        scores["rollup"] += 6
        scores["grouping"] += 2
        scores["aggregation"] += 1
    if _strong_grouping_cue(normalized_message):
        scores["grouping"] += 4
        scores["aggregation"] += 2
    if _strong_exclusion_cue(normalized_message):
        scores["join"] += 1
    if re.search(r"\b(join|left join|right join|full outer join|inner join|outer join)\b", normalized_message):
        scores["join"] += 4
        scores["subquery"] += 1
    if re.search(r"\b(subquery|nested query|exists\s*\(|not exists\s*\()\b", normalized_message):
        scores["subquery"] += 4
    if re.search(r"\b(order by|sorted|ascending|descending|ordered|top\s+\d+)\b", normalized_message):
        scores["ordering"] += 4
    if re.search(r"\b(where|filter|filters|filtered|constraint|conditions?)\b", normalized_message):
        scores["filtering"] += 3

    if "window" in categories:
        scores["navigation"] += 2
        scores["ranking"] += 2
    if "ranking" in categories:
        scores["ranking"] += 4
    if "aggregation" in categories:
        scores["aggregation"] += 4
    if "grouping" in categories:
        scores["grouping"] += 4
    if "join" in categories:
        scores["join"] += 4
    if "ordering" in categories:
        scores["ordering"] += 4
    if "distinct" in categories:
        scores["detail"] += 1
    if "subquery" in categories:
        scores["subquery"] += 4
    if "filtering" in categories:
        scores["filtering"] += 4
    if "rollup" in categories:
        scores["rollup"] += 4

    if feature_map:
        if feature_map.get("has_navigation_window_function"):
            scores["navigation"] += 6
            scores["detail"] += 1
        if feature_map.get("has_ranking_window_function"):
            scores["ranking"] += 6
            scores["detail"] += 1
        if feature_map.get("has_over"):
            scores["navigation"] += 1
            scores["ranking"] += 1
            scores["detail"] += 1
        if feature_map.get("has_rollup"):
            scores["rollup"] += 6
            scores["grouping"] += 2
        if feature_map.get("has_grouping_sets"):
            scores["rollup"] += 5
            scores["grouping"] += 3
        if feature_map.get("has_grouping"):
            scores["grouping"] += 5
            scores["rollup"] += 2
        if feature_map.get("has_group_by") or feature_map.get("has_having"):
            scores["aggregation"] += 5
            scores["grouping"] += 4
        if feature_map.get("has_aggregation"):
            scores["aggregation"] += 3
        if feature_map.get("has_join"):
            scores["join"] += 5
        if feature_map.get("has_subquery"):
            scores["subquery"] += 5
        if feature_map.get("has_order_by"):
            scores["ordering"] += 4
        if feature_map.get("has_where"):
            scores["filtering"] += 2
        if feature_map.get("has_outer_join"):
            scores["join"] += 2
        if feature_map.get("has_outer_join_null_filter"):
            scores["join"] += 1

    for gap in gaps:
        if gap in scores:
            scores[gap] += 2
        if gap == "window":
            scores["navigation"] += 1
            scores["ranking"] += 1
        elif gap == "ranking":
            scores["ranking"] += 1
        elif gap == "aggregation":
            scores["aggregation"] += 1
            scores["grouping"] += 1
        elif gap == "grouping":
            scores["grouping"] += 1
            scores["aggregation"] += 1
        elif gap == "join":
            scores["join"] += 1
            scores["subquery"] += 1
        elif gap == "subquery":
            scores["subquery"] += 1
            scores["join"] += 1
        elif gap == "rollup":
            scores["rollup"] += 1
            scores["grouping"] += 1
        elif gap == "ordering":
            scores["ordering"] += 1
        elif gap == "filtering":
            scores["filtering"] += 1

    sorted_families = sorted(
        scores.items(),
        key=lambda item: (
            item[1],
            -_SQL_FAMILY_PRIORITY.index(item[0]),
        ),
        reverse=True,
    )

    primary_family = sorted_families[0][0] if sorted_families else "detail"
    fallback_family = None
    for family, score in sorted_families[1:]:
        if family != primary_family and score > 0:
            fallback_family = family
            break
    if fallback_family is None:
        fallback_family = _SQL_FAMILY_FALLBACKS.get(primary_family)

    candidates = _dedupe_preserve_order(
        [primary_family, fallback_family] if fallback_family else [primary_family]
    )

    observed_row_grain = _row_grain_label_from_features(feature_map)
    expected_row_grain = _expected_row_grain_label(
        message_text=message_text,
        profile=profile,
        family=primary_family,
    )

    row_grain_reason = "aligned"
    if feature_map.get("has_outer_join_null_filter"):
        row_grain_reason = "outer join coverage is collapsing into orphan-only rows"
    elif observed_row_grain == "mixed":
        row_grain_reason = "aggregate/detail grain drift"
    elif expected_row_grain == "subtotal" and observed_row_grain != "subtotal":
        row_grain_reason = "subtotal grain is missing rollup/grouping sets"
    elif (
        expected_row_grain == "grouped"
        and observed_row_grain in {"detail", "summary"}
    ):
        row_grain_reason = "grouped output is still at detail grain"
    elif expected_row_grain == "detail" and observed_row_grain in {"grouped", "summary", "subtotal"}:
        row_grain_reason = "detail rows are being collapsed too early"
    elif expected_row_grain != observed_row_grain:
        row_grain_reason = f"expected {expected_row_grain}, observed {observed_row_grain}"

    row_grain_status = "aligned" if row_grain_reason == "aligned" else "mismatch"

    return {
        "sql_family": primary_family,
        "sql_family_candidates": candidates,
        "row_grain_state": {
            "expected": expected_row_grain,
            "observed": observed_row_grain,
            "status": row_grain_status,
            "reason": row_grain_reason,
        },
    }


def build_sql_governance_prompt_block(
    profile: Optional[SqlGovernanceProfile] = None,
    *,
    missing_categories: Optional[Iterable[str]] = None,
    sql_exploration_frozen: bool = False,
    freeze_reason: Optional[str] = None,
    frozen_sql_signature: Optional[str] = None,
    best_sql_text: Optional[str] = None,
    frozen_sql_text: Optional[str] = None,
    anchor_tier: Optional[str] = None,
    sql_family: Optional[str] = None,
    turn_local_repair_mode: bool = False,
) -> str:
    """Render a reusable SQL governance prompt block."""
    if sql_exploration_frozen:
        frozen_preview = _collapse_sql(frozen_sql_text or best_sql_text or "")
        if len(frozen_preview) > 160:
            frozen_preview = f"{frozen_preview[:157]}..."
        prompt_parts = [
            "## SQL Governance",
            "",
            "- A validated SQL skeleton is frozen for this turn.",
            "- Keep the current FROM/JOIN/GROUP/OVER shape stable and only make local fixes.",
        ]
        if frozen_preview:
            prompt_parts.append(f"- Frozen anchor: {frozen_preview}")
        prompt_parts.append("- Do not restart schema exploration.")
        if freeze_reason:
            prompt_parts.append(f"- Freeze reason: {freeze_reason}")
        return "\n".join(prompt_parts).strip()

    prompt_parts = [
        "## SQL Governance",
        "",
        "- Avoid metadata introspection queries unless they are explicitly allowed.",
        "- Keep the current row grain stable and call `run_sql` once the table path is clear.",
    ]
    guidance_categories = _dedupe_preserve_order(
        [
            *[
                category
                for category in (profile.categories if profile else [])
                if category in {"set_operation", "time_series"}
            ],
            *[
                category
                for category in (missing_categories or [])
                if category in {"set_operation", "time_series"}
            ],
        ]
    )
    for category in guidance_categories:
        hints = _profile_category_hints(category)
        if hints:
            prompt_parts.extend(["", f"- {hints[0]}"])
    if anchor_tier in {"candidate", "validated"}:
        anchor_preview = _collapse_sql(best_sql_text or "")
        if len(anchor_preview) > 160:
            anchor_preview = f"{anchor_preview[:157]}..."
        anchor_label = "Candidate anchor" if anchor_tier == "candidate" else "Validated anchor"
        family_suffix = f" for the {sql_family} family" if sql_family else ""
        if anchor_preview:
            prompt_parts.append(
                f"- {anchor_label}{family_suffix}: {anchor_preview}. Keep the current skeleton stable and only make local fixes."
            )
        else:
            prompt_parts.append(
                f"- {anchor_label}{family_suffix}: keep the current skeleton stable and only make local fixes."
            )
        if turn_local_repair_mode:
            prompt_parts.append(
                "- Local repair mode is active: keep the same canonical path and only repair the last drift."
            )
    return "\n".join(prompt_parts).strip()


def _build_sql_governance_positive_recap(
    *,
    sql_family: Optional[str] = None,
    row_grain_state: Optional[Dict[str, Any]] = None,
    last_sql_shape: Optional[Dict[str, Any]] = None,
    missing_categories: Optional[Iterable[str]] = None,
    last_sql_text: Optional[str] = None,
    turn_local_repair_mode: bool = False,
    rejection_reason_streak: int = 0,
) -> str:
    """Build a short positive guidance line based on the observed SQL family."""
    shape = dict(last_sql_shape or {})
    row_state = dict(row_grain_state or {})
    family = str(sql_family or "").strip().lower()
    categories = {
        str(category).strip().lower()
        for category in (missing_categories or [])
        if str(category).strip()
    }

    has_navigation_window = bool(shape.get("has_navigation_window_function"))
    has_ranking_window = bool(shape.get("has_ranking_window_function"))
    has_window = bool(shape.get("has_over") or shape.get("has_window_function"))
    has_group_by = bool(shape.get("has_group_by"))
    has_aggregation = bool(shape.get("has_aggregation"))
    has_join = bool(shape.get("has_join"))
    has_outer_join = bool(shape.get("has_outer_join"))
    has_outer_join_null_filter = bool(shape.get("has_outer_join_null_filter"))
    has_subquery = bool(shape.get("has_subquery"))
    has_rollup = bool(shape.get("has_rollup"))
    has_grouping_sets = bool(shape.get("has_grouping_sets"))
    has_grouping = bool(shape.get("has_grouping"))
    has_order_by = bool(shape.get("has_order_by"))
    has_where = bool(shape.get("has_where"))
    has_set_operation = bool(shape.get("has_set_operation"))
    has_time_series = bool(shape.get("has_time_series"))
    date_filter_cue = bool(
        re.search(
            r"\b(date|date_part|year|month|quarter|current_date|now|interval|today|yesterday)\b",
            _normalize_text(last_sql_text or ""),
        )
    )
    expected_row_grain = str(row_state.get("expected") or "").strip().lower()
    observed_row_grain = str(row_state.get("observed") or "").strip().lower()
    row_grain_status = str(row_state.get("status") or "").strip().lower()
    navigation_cue = _strong_navigation_window_cue(last_sql_text or "")
    ranking_cue = _strong_ranking_window_cue(last_sql_text or "")
    rollup_cue = _strong_rollup_cue(last_sql_text or "")
    grouping_cue = _strong_grouping_cue(last_sql_text or "")
    join_cue = bool(
        re.search(
            r"\b(join|related tables?|combine|matched with|along with)\b",
            _normalize_text(last_sql_text or ""),
        )
    )

    repair_mode = turn_local_repair_mode or rejection_reason_streak >= 2
    if repair_mode:
        if expected_row_grain == "subtotal" or has_rollup or has_grouping_sets or has_grouping or rollup_cue or categories & {"rollup"}:
            row_sentence = "You already have a usable candidate skeleton; keep the subtotal grain stable first."
        elif expected_row_grain == "grouped" or has_group_by or grouping_cue or categories & {"aggregation", "grouping"}:
            row_sentence = "You already have a usable candidate skeleton; keep the grouped summary stable first."
        elif has_outer_join_null_filter:
            row_sentence = "You already have a usable candidate skeleton; keep the coverage intact first."
        else:
            row_sentence = "You already have a usable candidate skeleton; keep the current row grain stable first."
    elif (
        row_grain_status == "mismatch"
        or expected_row_grain in {"grouped", "subtotal"}
        or observed_row_grain in {"summary", "mixed"}
        or has_aggregation
        or has_group_by
        or has_outer_join_null_filter
    ):
        if expected_row_grain == "subtotal" or has_rollup or has_grouping_sets or has_grouping or rollup_cue or categories & {"rollup"}:
            row_sentence = "Keep the subtotal grain stable first."
        elif expected_row_grain == "grouped" or has_group_by or grouping_cue or categories & {"aggregation", "grouping"}:
            row_sentence = "Keep the grouped summary stable first."
        elif has_outer_join_null_filter:
            row_sentence = "Keep the coverage intact first."
        else:
            row_sentence = "Keep the current row grain stable first."
    else:
        row_sentence = "Keep the current row grain stable first."

    family_sentence = ""
    if family in {"navigation", "ranking"} or has_window or navigation_cue or ranking_cue or categories & {"window", "ranking"}:
        if family == "navigation" or has_navigation_window or navigation_cue:
            family_sentence = "Then keep the same window shape stable and preserve the local row-to-row comparison path."
        elif family == "ranking" or has_ranking_window or ranking_cue:
            family_sentence = "Then keep the same window shape stable and preserve the intended row ordering."
        else:
            family_sentence = "Then keep the current window shape stable."
    elif family == "rollup" or has_rollup or has_grouping_sets or has_grouping or rollup_cue or categories & {"rollup"}:
        family_sentence = "Then keep the grouped summary stable and add subtotal logic only when the question explicitly asks for it."
    elif family in {"aggregation", "grouping"} or has_aggregation or has_group_by or grouping_cue or categories & {"aggregation", "grouping"}:
        family_sentence = "Then keep the grouped summary stable and do not widen the result beyond the requested grain."
    elif family == "join" or has_join or join_cue or categories & {"join"}:
        if has_outer_join or has_outer_join_null_filter:
            family_sentence = "Then preserve the existing coverage and avoid shrinking it."
        elif has_subquery:
            family_sentence = "Then keep the current path stable; a nested form is acceptable if it preserves coverage better."
        else:
            family_sentence = "Then keep the current join path stable."
    elif family == "subquery" or has_subquery or categories & {"subquery"}:
        family_sentence = "Then keep the main path stable and use nesting only if it preserves coverage better."
    elif family == "set_operation" or has_set_operation or categories & {"set_operation"}:
        family_sentence = "Then keep the set operation semantics stable and preserve the UNION / INTERSECT / EXCEPT structure."
    elif family == "time_series" or has_time_series or categories & {"time_series"}:
        family_sentence = "Then keep the time grain stable and preserve the temporal ordering or grouping."
    elif family == "ordering" or has_order_by or categories & {"ordering"}:
        family_sentence = "Then keep the current projection stable and add only the requested ordering."
    elif family == "filtering" or has_where or categories & {"filtering"}:
        if date_filter_cue:
            family_sentence = "Then keep the original projection stable and only tighten the date predicate."
        else:
            family_sentence = "Then keep the original projection stable and only tighten the relevant filters."
    elif last_sql_text:
        family_sentence = "Then keep the current SQL shape stable and repair only the last observed drift."

    sentences = [sentence for sentence in [row_sentence, family_sentence] if sentence]
    if not sentences:
        return ""
    return ". ".join(sentence.rstrip(". ") for sentence in sentences).strip() + "."


def build_sql_governance_recap_block(
    profile: Optional[SqlGovernanceProfile],
    missing_categories: Iterable[str],
    *,
    sql_family: Optional[str] = None,
    row_grain_state: Optional[Dict[str, Any]] = None,
    last_sql_shape: Optional[Dict[str, Any]] = None,
    last_sql_text: Optional[str] = None,
    sql_exploration_frozen: bool = False,
    turn_local_repair_mode: bool = False,
    rejection_reason_streak: int = 0,
) -> str:
    """Render a short recap message for a repeated SQL attempt."""
    if sql_exploration_frozen:
        return ""
    missing = _dedupe_preserve_order(missing_categories)
    positive_recap = _build_sql_governance_positive_recap(
        sql_family=sql_family,
        row_grain_state=row_grain_state,
        last_sql_shape=last_sql_shape,
        missing_categories=missing,
        last_sql_text=last_sql_text,
        turn_local_repair_mode=turn_local_repair_mode,
        rejection_reason_streak=rejection_reason_streak,
    )

    if positive_recap:
        return "\n".join(
            [
                "## SQL Self-Check Reminder",
                positive_recap,
            ]
        ).strip()

    return ""
