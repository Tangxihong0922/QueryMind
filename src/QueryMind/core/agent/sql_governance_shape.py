from __future__ import annotations
"""
Pure SQL-governance shape/profile helpers shared by the agent and harness.

This module intentionally avoids importing the stateful governance manager so it
can be reused from both the agent package and the evaluation harness without
circular dependencies.
"""

import logging
import os
import re
from dataclasses import asdict, dataclass, field
from typing import Any, Dict, Iterable, List, Optional, Sequence

import sqlglot
from sqlglot import exp
from sqlglot.errors import ParseError

logger = logging.getLogger(__name__)


def _safe_int(value: Any, default: int) -> int:
    try:
        return int(value)
    except Exception:
        return default


def _safe_float(value: Any, default: float) -> float:
    try:
        return float(value)
    except Exception:
        return default


def _safe_bool(value: Any, default: bool) -> bool:
    if value is None:
        return default
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return bool(value)

    normalized = str(value).strip().lower()
    if normalized in {"1", "true", "yes", "on"}:
        return True
    if normalized in {"0", "false", "no", "off"}:
        return False
    return default


def _normalize_text(value: Optional[str]) -> str:
    return " ".join((value or "").strip().split()).lower()


def _dedupe_preserve_order(values: Iterable[str]) -> List[str]:
    seen = set()
    items: List[str] = []
    for value in values:
        normalized = str(value).strip()
        if not normalized or normalized in seen:
            continue
        seen.add(normalized)
        items.append(normalized)
    return items


def _collapse_sql(sql: Optional[str]) -> str:
    return re.sub(r"\s+", " ", (sql or "").strip())


def _normalize_dialect(dialect: Optional[str]) -> Optional[str]:
    normalized = str(dialect or "").strip().lower()
    return normalized or None


def _parse_sqlglot_statements(
    sql: str,
    *,
    dialect: Optional[str] = None,
) -> List[exp.Expression]:
    collapsed = _collapse_sql(sql)
    if not collapsed:
        return []

    read_dialect = _normalize_dialect(dialect)
    try:
        if read_dialect:
            parsed = sqlglot.parse(collapsed, read=read_dialect)
        else:
            parsed = sqlglot.parse(collapsed)
        return [statement for statement in parsed if isinstance(statement, exp.Expression)]
    except ParseError:
        return []
    except Exception:
        return []


def _find_primary_select(
    statements: Sequence[exp.Expression],
) -> Optional[exp.Select]:
    for statement in statements:
        if statement is None:
            continue
        if isinstance(statement, exp.Select):
            return statement
        select = statement.find(exp.Select)
        if isinstance(select, exp.Select):
            return select
    return None


def _expression_name(expression: exp.Expression) -> str:
    rendered = expression.sql()
    return rendered.split("(", 1)[0].strip().upper()


def _table_reference_name(table: exp.Table) -> str:
    parts = []
    for part in getattr(table, "parts", []) or []:
        name = getattr(part, "name", None)
        if name:
            parts.append(str(name))
    if parts:
        return ".".join(parts)
    return table.name or table.sql()


def _relation_alias_name(expression: Optional[exp.Expression]) -> Optional[str]:
    if expression is None:
        return None

    alias_or_name = getattr(expression, "alias_or_name", None)
    if isinstance(alias_or_name, str) and alias_or_name.strip():
        return alias_or_name.strip()

    alias = getattr(getattr(expression, "alias", None), "name", None)
    if isinstance(alias, str) and alias.strip():
        return alias.strip()

    name = getattr(expression, "name", None)
    if isinstance(name, str) and name.strip():
        return name.strip()

    return None


def _is_metadata_reference(reference: str) -> bool:
    normalized = reference.strip().lower()
    if not normalized:
        return False
    if normalized.startswith("information_schema."):
        return True
    if normalized.startswith("pg_catalog."):
        return True
    if normalized.startswith("sys."):
        return True
    if normalized in {
        "pg_tables",
        "pg_indexes",
        "pg_class",
        "pg_attribute",
        "pg_constraint",
        "pg_namespace",
        "pg_database",
        "pg_type",
    }:
        return True
    return False


def _collect_window_function_names(
    window_expressions: Iterable[exp.Expression],
) -> List[str]:
    names: List[str] = []
    for window in window_expressions:
        this = getattr(window, "this", None)
        if this is None and not isinstance(window, exp.Window):
            this = window
        if this is None:
            continue
        names.append(_expression_name(this))
    return _dedupe_preserve_order(names)


_NAVIGATION_WINDOW_FUNCTION_NAMES = {
    "LAG",
    "LEAD",
    "FIRST_VALUE",
    "LAST_VALUE",
}


_RANKING_WINDOW_FUNCTION_NAMES = {
    "ROW_NUMBER",
    "RANK",
    "DENSE_RANK",
    "NTILE",
    "CUME_DIST",
    "PERCENT_RANK",
}


_WINDOW_FUNCTION_NAMES = _NAVIGATION_WINDOW_FUNCTION_NAMES | _RANKING_WINDOW_FUNCTION_NAMES


def _window_function_name_set(values: Iterable[str]) -> set[str]:
    return {
        str(value).strip().upper()
        for value in values
        if str(value).strip()
    }


def _is_true_aggregate_function_name(name: str) -> bool:
    return str(name).strip().upper() in {
        "COUNT",
        "SUM",
        "AVG",
        "MIN",
        "MAX",
        "STDDEV",
        "STDDEV_POP",
        "STDDEV_SAMP",
        "VARIANCE",
        "STRING_AGG",
    }


def _window_partition_is_constant(window: exp.Window, *, dialect: Optional[str] = None) -> bool:
    partition_by = window.args.get("partition_by") or []
    if not partition_by:
        return False

    return all(
        _is_constant_expression(expression.sql(dialect=dialect))
        for expression in partition_by
        if expression is not None
    )


def _join_side(join: exp.Join) -> str:
    side = str(join.args.get("side") or "").strip().upper()
    kind = str(join.args.get("kind") or "").strip().upper()
    if side:
        return side
    if kind in {"LEFT", "RIGHT", "FULL"}:
        return kind
    return ""


def _is_null_filter_expression(expression: exp.Expression) -> bool:
    if isinstance(expression, exp.Is):
        return isinstance(expression.args.get("expression"), exp.Null)
    return False


def _strong_navigation_window_cue(message: str) -> bool:
    return bool(
        re.search(
            r"\b(previous|prior|next|running total|cumulative|moving average|lag|lead|first value|first_value|last value|last_value)\b",
            _normalize_text(message),
        )
    )


def _strong_ranking_window_cue(message: str) -> bool:
    return bool(
        re.search(
            r"\b(rank|ranking|top\s+\d+|row number|row_number|dense rank|dense_rank|ntile|cume dist|cume_dist|percent rank|percent_rank)\b",
            _normalize_text(message),
        )
    )


def _strong_exclusion_cue(message: str) -> bool:
    return bool(
        re.search(
            r"\b(without|missing|unmatched|orphan(?:ed)?|anti[- ]?join|not exists)\b",
            _normalize_text(message),
        )
    )


def _find_top_level_keyword(
    sql: str,
    keywords: Sequence[str],
    *,
    start_index: int = 0,
) -> tuple[int, Optional[str]]:
    """Find the first top-level keyword occurrence while skipping subqueries."""
    upper = sql.upper()
    keyword_pool = [keyword.upper() for keyword in keywords]
    depth = 0
    in_single_quote = False
    in_double_quote = False
    index = start_index

    while index < len(upper):
        char = upper[index]
        if char == "'" and not in_double_quote:
            in_single_quote = not in_single_quote
            index += 1
            continue
        if char == '"' and not in_single_quote:
            in_double_quote = not in_double_quote
            index += 1
            continue
        if in_single_quote or in_double_quote:
            index += 1
            continue

        if char == "(":
            depth += 1
            index += 1
            continue
        if char == ")":
            depth = max(0, depth - 1)
            index += 1
            continue

        if depth == 0:
            for keyword in keyword_pool:
                if not upper.startswith(keyword, index):
                    continue
                before_ok = index == 0 or not (
                    upper[index - 1].isalnum() or upper[index - 1] == "_"
                )
                after_index = index + len(keyword)
                after_ok = after_index >= len(upper) or not (
                    upper[after_index].isalnum() or upper[after_index] == "_"
                )
                if before_ok and after_ok:
                    return index, keyword

        index += 1

    return -1, None


def _extract_top_level_clause(
    sql: str,
    start_keywords: Sequence[str],
    end_keywords: Sequence[str],
) -> str:
    collapsed = _collapse_sql(sql)
    if not collapsed:
        return ""

    start_index, start_keyword = _find_top_level_keyword(collapsed, start_keywords)
    if start_index < 0 or not start_keyword:
        return ""

    clause_start = start_index + len(start_keyword)
    end_index, _ = _find_top_level_keyword(
        collapsed, end_keywords, start_index=clause_start
    )
    if end_index < 0:
        end_index = len(collapsed)

    return collapsed[clause_start:end_index].strip()


def _split_top_level_commas(text: str) -> List[str]:
    items: List[str] = []
    if not text:
        return items

    depth = 0
    in_single_quote = False
    in_double_quote = False
    start = 0

    for index, char in enumerate(text):
        if char == "'" and not in_double_quote:
            in_single_quote = not in_single_quote
        elif char == '"' and not in_single_quote:
            in_double_quote = not in_double_quote
        elif not in_single_quote and not in_double_quote:
            if char == "(":
                depth += 1
            elif char == ")":
                depth = max(0, depth - 1)
            elif char == "," and depth == 0:
                item = text[start:index].strip()
                if item:
                    items.append(item)
                start = index + 1

    tail = text[start:].strip()
    if tail:
        items.append(tail)
    return items


def _strip_select_prefix(select_clause: str) -> str:
    clause = select_clause.strip()
    upper = clause.upper()
    if upper.startswith("DISTINCT "):
        return clause[9:].strip()
    if upper.startswith("ALL "):
        return clause[4:].strip()
    if upper.startswith("TOP "):
        return clause
    return clause


def _is_aggregate_expression(fragment: str) -> bool:
    return bool(
        re.search(
            r"\b(COUNT|SUM|AVG|MIN|MAX|STDDEV|STDDEV_POP|STDDEV_SAMP|VARIANCE|STRING_AGG)\s*\(",
            fragment,
            re.IGNORECASE,
        )
    )


def _is_window_expression(fragment: str) -> bool:
    return bool(
        re.search(
            r"\b(OVER\s*\(|LAG\s*\(|LEAD\s*\(|ROW_NUMBER\s*\(|RANK\s*\(|DENSE_RANK\s*\(|NTILE\s*\(|FIRST_VALUE\s*\(|LAST_VALUE\s*\(|CUME_DIST\s*\(|PERCENT_RANK\s*\()",
            fragment,
            re.IGNORECASE,
        )
    )


def _is_constant_expression(fragment: str) -> bool:
    normalized = fragment.strip()
    if not normalized:
        return True
    return bool(
        re.fullmatch(
            r"(NULL|TRUE|FALSE|\d+(?:\.\d+)?|'[^']*'|\"[^\"]*\")",
            normalized,
            re.IGNORECASE,
        )
    )


def _extract_table_references(sql: str) -> List[str]:
    tables: List[str] = []
    for match in re.finditer(
        r"\b(?:FROM|JOIN)\s+([A-Za-z_][\w$]*(?:\.[A-Za-z_][\w$]*){0,2})",
        sql,
        re.IGNORECASE,
    ):
        table_name = match.group(1).strip()
        if table_name not in tables:
            tables.append(table_name)
    return tables


def _infer_semantic_intents(message: Optional[str]) -> List[str]:
    text = _normalize_text(message)
    if not text:
        return []

    intents: List[str] = []

    if re.search(
        r"\b(previous|prior|last|next|running|cumulative|moving|rank|ranking|top\s+\d+|row number|row_number|dense rank|dense_rank|lag|lead|first value|first_value|last value|last_value|ntile|percentile|cume dist|cume_dist|percent rank|percent_rank)\b",
        text,
    ):
        intents.extend(["window", "ranking"])

    if re.search(
        r"\b(total|sum|count|average|avg|min|max|subtotal|grand total|summary|rollup|grouping sets?)\b",
        text,
    ):
        intents.append("aggregation")

    if re.search(
        r"\b(for each|per|group by|grouped by|each)\b",
        text,
    ):
        intents.append("grouping")

    if re.search(
        r"\b(rollup|grouping sets?|subtotal|grand total|hierarchy|levels?)\b",
        text,
    ):
        intents.append("rollup")

    if re.search(
        r"\b(join|related tables?|combine|matched with|along with|with their|paired with|relationship)\b",
        text,
    ):
        intents.append("join")

    if re.search(
        r"\b(order by|sorted|ascending|descending|top\s+\d+|top n)\b",
        text,
    ):
        intents.append("ordering")

    if re.search(
        r"\b(union(?:\s+all)?|intersect|except)\b",
        text,
    ):
        intents.append("set_operation")

    if re.search(
        r"\b(time series|time-series|trend|trends|over time|by date|by day|by week|by month|by quarter|by year|monthly|quarterly|yearly|daily|weekly|mtd|qtd|ytd|mom|mom growth|yoy|year over year|month over month)\b",
        text,
    ):
        intents.append("time_series")

    return _dedupe_preserve_order(intents)


@dataclass(slots=True)
class SqlShapeAnalysis:
    """Lightweight SQL shape analysis for governance checks."""

    sql: str
    normalized_sql: str
    statement_count: int = 0
    has_select: bool = False
    has_from: bool = False
    has_where: bool = False
    has_join: bool = False
    has_cross_join: bool = False
    has_on: bool = False
    has_using: bool = False
    join_count: int = 0
    has_group_by: bool = False
    has_having: bool = False
    has_order_by: bool = False
    has_window_order_by: bool = False
    has_distinct: bool = False
    has_limit: bool = False
    has_over: bool = False
    has_partition_by: bool = False
    has_constant_partition_by: bool = False
    has_window_frame: bool = False
    has_window_function: bool = False
    has_navigation_window_function: bool = False
    has_ranking_window_function: bool = False
    has_aggregation: bool = False
    has_subquery: bool = False
    cte_count: int = 0
    has_rollup: bool = False
    has_grouping_sets: bool = False
    has_grouping: bool = False
    has_outer_join: bool = False
    has_outer_join_null_filter: bool = False
    has_set_operation: bool = False
    has_time_series: bool = False
    outer_join_count: int = 0
    null_filter_count: int = 0
    metadata_query: bool = False
    table_references: List[str] = field(default_factory=list)
    select_items: List[str] = field(default_factory=list)
    group_by_items: List[str] = field(default_factory=list)
    aggregate_projection_count: int = 0
    non_aggregate_projection_count: int = 0
    window_function_names: List[str] = field(default_factory=list)
    feature_names: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


def analyze_sql_shape(
    sql: str,
    *,
    dialect: Optional[str] = None,
) -> SqlShapeAnalysis:
    """Extract higher-level SQL shape information using sqlglot AST parsing."""
    normalized = _collapse_sql(sql)
    upper = normalized.upper()
    read_dialect = _normalize_dialect(dialect)
    cte_count = len(re.findall(r"\bWITH\b", upper))
    parsed_statements = [
        statement
        for statement in _parse_sqlglot_statements(normalized, dialect=read_dialect)
        if statement is not None
    ]

    if parsed_statements:
        select_nodes: List[exp.Select] = []
        table_nodes: List[exp.Table] = []
        join_nodes: List[exp.Join] = []
        window_nodes: List[exp.Window] = []
        group_nodes: List[exp.Group] = []
        grouping_nodes: List[exp.Grouping] = []
        aggregate_nodes: List[exp.AggFunc] = []
        subquery_nodes: List[exp.Subquery] = []
        cte_nodes: List[exp.CTE] = []

        for statement in parsed_statements:
            if statement is None:
                continue
            select_nodes.extend(list(statement.find_all(exp.Select)))
            table_nodes.extend(list(statement.find_all(exp.Table)))
            join_nodes.extend(list(statement.find_all(exp.Join)))
            window_nodes.extend(list(statement.find_all(exp.Window)))
            group_nodes.extend(list(statement.find_all(exp.Group)))
            grouping_nodes.extend(list(statement.find_all(exp.Grouping)))
            aggregate_nodes.extend(list(statement.find_all(exp.AggFunc)))
            subquery_nodes.extend(list(statement.find_all(exp.Subquery)))
            cte_nodes.extend(list(statement.find_all(exp.CTE)))

        primary_select = _find_primary_select(parsed_statements)
        select_items: List[str] = []
        group_by_items: List[str] = []
        aggregate_projection_count = 0
        non_aggregate_projection_count = 0
        window_function_names: List[str] = []
        has_constant_partition_by = False
        has_navigation_window_function = False
        has_ranking_window_function = False
        outer_join_count = 0
        outer_join_aliases: set[str] = set()
        relation_aliases_in_order: List[str] = []

        if primary_select is not None:
            from_clause = primary_select.args.get("from_")
            if isinstance(from_clause, exp.From):
                base_alias = _relation_alias_name(from_clause.this)
                if base_alias:
                    relation_aliases_in_order.append(base_alias.upper())

        if primary_select is not None:
            select_items = [
                expression.sql(dialect=read_dialect)
                for expression in primary_select.expressions
            ]
            group = primary_select.args.get("group")
            if isinstance(group, exp.Group):
                group_by_items = [
                    expression.sql(dialect=read_dialect)
                    for expression in group.expressions
                ]
                for rollup in group.args.get("rollup") or []:
                    group_by_items.extend(
                        expression.sql(dialect=read_dialect)
                        for expression in getattr(rollup, "expressions", []) or []
                    )
                for grouping_sets in group.args.get("grouping_sets") or []:
                    group_by_items.extend(
                        expression.sql(dialect=read_dialect)
                        for expression in getattr(grouping_sets, "expressions", []) or []
                    )

            for expression in primary_select.expressions:
                base_expression = (
                    expression.this if isinstance(expression, exp.Alias) else expression
                )
                window_expressions = list(base_expression.find_all(exp.Window))
                window_function_nodes: List[exp.Expression] = []
                if not window_expressions:
                    window_function_nodes = [
                        node
                        for node in base_expression.walk()
                        if isinstance(node, exp.AggFunc)
                        and _expression_name(node) in _WINDOW_FUNCTION_NAMES
                    ]
                if window_expressions or window_function_nodes:
                    window_function_names.extend(
                        _collect_window_function_names(window_expressions)
                    )
                    window_function_names.extend(
                        _collect_window_function_names(window_function_nodes)
                    )
                    for window in window_expressions:
                        if _window_partition_is_constant(window, dialect=read_dialect):
                            has_constant_partition_by = True
                        window_name = (
                            _expression_name(window.this) if window.this is not None else ""
                        )
                        if window_name in _NAVIGATION_WINDOW_FUNCTION_NAMES:
                            has_navigation_window_function = True
                        if window_name in _RANKING_WINDOW_FUNCTION_NAMES:
                            has_ranking_window_function = True
                    for node in window_function_nodes:
                        window_name = _expression_name(node)
                        if window_name in _NAVIGATION_WINDOW_FUNCTION_NAMES:
                            has_navigation_window_function = True
                        if window_name in _RANKING_WINDOW_FUNCTION_NAMES:
                            has_ranking_window_function = True
                    continue
                if any(
                    isinstance(node, exp.Grouping) for node in base_expression.walk()
                ):
                    continue
                agg_function_names = [
                    _expression_name(node)
                    for node in base_expression.walk()
                    if isinstance(node, exp.AggFunc)
                ]
                if any(
                    _is_true_aggregate_function_name(name)
                    for name in agg_function_names
                ):
                    aggregate_projection_count += 1
                    continue
                if any(
                    name in _WINDOW_FUNCTION_NAMES for name in agg_function_names
                ):
                    window_function_names.extend(
                        name for name in agg_function_names if name in _WINDOW_FUNCTION_NAMES
                    )
                    if any(
                        name in _NAVIGATION_WINDOW_FUNCTION_NAMES
                        for name in agg_function_names
                    ):
                        has_navigation_window_function = True
                    if any(
                        name in _RANKING_WINDOW_FUNCTION_NAMES
                        for name in agg_function_names
                    ):
                        has_ranking_window_function = True
                    continue
                if _is_constant_expression(base_expression.sql(dialect=read_dialect)):
                    continue
                non_aggregate_projection_count += 1

        has_select = bool(select_nodes)
        has_from = any(
            isinstance(select, exp.Select) and select.args.get("from_") is not None
            for select in select_nodes
        ) or any(statement.find(exp.From) is not None for statement in parsed_statements)
        has_where = any(
            isinstance(select, exp.Select) and select.args.get("where") is not None
            for select in select_nodes
        ) or any(statement.find(exp.Where) is not None for statement in parsed_statements)
        has_join = bool(join_nodes)
        has_cross_join = any(
            str(join.args.get("kind") or "").upper() == "CROSS"
            for join in join_nodes
        )
        has_on = any(join.args.get("on") is not None for join in join_nodes)
        has_using = any(join.args.get("using") is not None for join in join_nodes)
        join_count = len(join_nodes)
        has_group_by = any(
            isinstance(select, exp.Select) and select.args.get("group") is not None
            for select in select_nodes
        ) or bool(group_nodes)
        has_having = any(
            isinstance(select, exp.Select) and select.args.get("having") is not None
            for select in select_nodes
        ) or any(statement.find(exp.Having) is not None for statement in parsed_statements)
        has_order_by = any(
            getattr(statement, "args", {}).get("order") is not None
            for statement in parsed_statements
        )
        has_window_order_by = any(
            window.args.get("order") is not None for window in window_nodes
        )
        has_distinct = any(
            getattr(select, "args", {}).get("distinct") is not None
            for select in select_nodes
        ) or any(
            getattr(statement, "args", {}).get("distinct") is not None
            for statement in parsed_statements
        )
        has_limit = any(
            getattr(statement, "args", {}).get("limit") is not None
            for statement in parsed_statements
        )
        has_over = bool(window_nodes)
        has_partition_by = any(bool(window.args.get("partition_by")) for window in window_nodes)
        has_window_frame = any(window.args.get("spec") is not None for window in window_nodes)
        has_window_function = bool(window_nodes)
        has_navigation_window_function = any(
            _expression_name(window.this) in _NAVIGATION_WINDOW_FUNCTION_NAMES
            for window in window_nodes
            if window.this is not None
        )
        has_aggregation = any(
            _is_true_aggregate_function_name(_expression_name(node))
            for node in aggregate_nodes
        )
        has_subquery = bool(subquery_nodes) or len(select_nodes) > len(parsed_statements)
        has_rollup = any(statement.find(exp.Rollup) is not None for statement in parsed_statements)
        has_grouping_sets = any(
            statement.find(exp.GroupingSets) is not None for statement in parsed_statements
        )
        has_grouping = bool(grouping_nodes)
        has_set_operation = bool(
            re.search(r"\bUNION\b|\bINTERSECT\b|\bEXCEPT\b", upper)
        )
        has_time_series = bool(
            re.search(
                r"\b(date_trunc|date_part|extract|current_date|current_timestamp|interval|year\s*\(|month\s*\(|quarter\s*\(|week\s*\(|day\s*\(|timestamp|time series|time-series|over time|by date|by day|by week|by month|by quarter|by year)\b",
                upper,
            )
        )
        table_references = _dedupe_preserve_order(
            _table_reference_name(table) for table in table_nodes
        )
        metadata_query = any(_is_metadata_reference(reference) for reference in table_references)

        for join in join_nodes:
            side = _join_side(join)
            join_alias = _relation_alias_name(join.this)
            if side in {"LEFT", "RIGHT", "FULL"}:
                outer_join_count += 1
            if side == "LEFT":
                if join_alias:
                    outer_join_aliases.add(join_alias.upper())
            elif side == "RIGHT":
                outer_join_aliases.update(relation_aliases_in_order)
            elif side == "FULL":
                outer_join_aliases.update(relation_aliases_in_order)
                if join_alias:
                    outer_join_aliases.add(join_alias.upper())
            if join_alias:
                relation_aliases_in_order.append(join_alias.upper())

        null_filter_aliases: set[str] = set()
        for statement in parsed_statements:
            for where_node in statement.find_all(exp.Where):
                for node in where_node.this.walk():
                    if not _is_null_filter_expression(node):
                        continue
                    target = node.this
                    if isinstance(target, exp.Column):
                        target_alias = str(target.table or "").strip().upper()
                        if target_alias:
                            null_filter_aliases.add(target_alias)

        has_outer_join = outer_join_count > 0
        has_outer_join_null_filter = bool(outer_join_aliases & null_filter_aliases)

        feature_names: List[str] = []
        if has_join:
            feature_names.append("join")
        if has_group_by:
            feature_names.append("group_by")
        if has_order_by:
            feature_names.append("order_by")
        if has_distinct:
            feature_names.append("distinct")
        if has_having:
            feature_names.append("having")
        if has_over:
            feature_names.append("window")
        if has_partition_by:
            feature_names.append("partition_by")
        if has_rollup:
            feature_names.append("rollup")
        if has_grouping_sets:
            feature_names.append("grouping_sets")
        if has_grouping:
            feature_names.append("grouping")
        if has_window_frame:
            feature_names.append("window_frame")
        if has_aggregation:
            feature_names.append("aggregation")
        if has_navigation_window_function:
            feature_names.append("navigation_window")
        if has_ranking_window_function:
            feature_names.append("ranking_window")
        if has_window_order_by and "window" not in feature_names:
            feature_names.append("window")

        cte_count = len(cte_nodes)
        return SqlShapeAnalysis(
            sql=sql,
            normalized_sql=normalized,
            statement_count=len(parsed_statements),
            has_select=has_select,
            has_from=has_from,
            has_where=has_where,
            has_join=has_join,
            has_cross_join=has_cross_join,
            has_on=has_on,
            has_using=has_using,
            join_count=join_count,
            has_group_by=has_group_by,
            has_having=has_having,
            has_order_by=has_order_by,
            has_window_order_by=has_window_order_by,
            has_distinct=has_distinct,
            has_limit=has_limit,
            has_over=has_over,
            has_partition_by=has_partition_by,
            has_window_frame=has_window_frame,
            has_window_function=has_window_function,
            has_navigation_window_function=has_navigation_window_function,
            has_constant_partition_by=has_constant_partition_by,
            has_ranking_window_function=has_ranking_window_function,
            has_aggregation=has_aggregation,
            has_subquery=has_subquery,
            cte_count=cte_count,
            has_rollup=has_rollup,
            has_grouping_sets=has_grouping_sets,
            has_grouping=has_grouping,
            has_outer_join=has_outer_join,
            has_outer_join_null_filter=has_outer_join_null_filter,
            has_set_operation=has_set_operation,
            has_time_series=has_time_series,
            outer_join_count=outer_join_count,
            null_filter_count=len(null_filter_aliases),
            metadata_query=metadata_query,
            table_references=table_references,
            select_items=select_items,
            group_by_items=group_by_items,
            aggregate_projection_count=aggregate_projection_count,
            non_aggregate_projection_count=non_aggregate_projection_count,
            window_function_names=_dedupe_preserve_order(window_function_names),
            feature_names=_dedupe_preserve_order(feature_names),
        )

    upper = normalized.upper()
    select_clause = _extract_top_level_clause(
        normalized,
        ["SELECT"],
        ["FROM", "WHERE", "GROUP BY", "HAVING", "ORDER BY", "LIMIT", "UNION", "INTERSECT", "EXCEPT"],
    )
    group_by_clause = _extract_top_level_clause(
        normalized,
        ["GROUP BY"],
        ["HAVING", "ORDER BY", "LIMIT", "UNION", "INTERSECT", "EXCEPT"],
    )

    select_items = _split_top_level_commas(_strip_select_prefix(select_clause))
    group_by_items = _split_top_level_commas(group_by_clause)

    aggregate_projection_count = 0
    non_aggregate_projection_count = 0
    window_function_names: List[str] = []
    for item in select_items:
        if _is_window_expression(item):
            window_function_names.extend(
                re.findall(
                    r"\b(LAG|LEAD|ROW_NUMBER|RANK|DENSE_RANK|NTILE|FIRST_VALUE|LAST_VALUE|CUME_DIST|PERCENT_RANK)\b",
                    item,
                    re.IGNORECASE,
                )
            )
            continue
        if _is_aggregate_expression(item):
            aggregate_projection_count += 1
            continue
        if _is_constant_expression(item):
            continue
        non_aggregate_projection_count += 1

    feature_names: List[str] = []
    feature_patterns = [
        (r"\bJOIN\b", "join"),
        (r"\bGROUP BY\b", "group_by"),
        (r"\bORDER BY\b", "order_by"),
        (r"\bDISTINCT\b", "distinct"),
        (r"\bHAVING\b", "having"),
        (r"\bOVER\s*\(", "window"),
        (r"\bPARTITION BY\b", "partition_by"),
        (r"\bROLLUP\b", "rollup"),
        (r"\bGROUPING SETS?\b", "grouping_sets"),
        (r"\bGROUPING\b", "grouping"),
        (r"\bWINDOW\b", "window_clause"),
        (r"\bCOUNT\s*\(", "aggregation"),
        (r"\bSUM\s*\(", "aggregation"),
        (r"\bAVG\s*\(", "aggregation"),
        (r"\bMIN\s*\(", "aggregation"),
        (r"\bMAX\s*\(", "aggregation"),
        (r"\bROW_NUMBER\s*\(", "ranking_window"),
        (r"\bRANK\s*\(", "ranking_window"),
        (r"\bDENSE_RANK\s*\(", "ranking_window"),
        (r"\bNTILE\s*\(", "ranking_window"),
        (r"\bLAG\s*\(", "navigation_window"),
        (r"\bLEAD\s*\(", "navigation_window"),
        (r"\bFIRST_VALUE\s*\(", "navigation_window"),
        (r"\bLAST_VALUE\s*\(", "navigation_window"),
        (r"\bCUME_DIST\s*\(", "ranking_window"),
        (r"\bPERCENT_RANK\s*\(", "ranking_window"),
    ]
    for pattern, name in feature_patterns:
        if re.search(pattern, upper, re.IGNORECASE):
            feature_names.append(name)

    has_navigation_window_function = bool(
        re.search(r"\b(LAG\s*\(|LEAD\s*\(|FIRST_VALUE\s*\(|LAST_VALUE\s*\()", upper)
    )
    has_ranking_window_function = bool(
        re.search(
            r"\b(ROW_NUMBER\s*\(|RANK\s*\(|DENSE_RANK\s*\(|NTILE\s*\(|CUME_DIST\s*\(|PERCENT_RANK\s*\()",
            upper,
        )
    )
    has_constant_partition_by = bool(
        re.search(r"\bPARTITION BY\s+(1|TRUE|FALSE|NULL|'[^']*'|\"[^\"]*\")\b", upper)
    )
    has_outer_join = bool(re.search(r"\b(LEFT|RIGHT|FULL)\s+JOIN\b", upper))
    has_outer_join_null_filter = bool(
        has_outer_join and re.search(r"\bIS\s+NULL\b", upper)
    )

    return SqlShapeAnalysis(
        sql=sql,
        normalized_sql=normalized,
        statement_count=1 if normalized else 0,
        has_select=bool(re.search(r"\bSELECT\b", upper)),
        has_from=bool(re.search(r"\bFROM\b", upper)),
        has_where=bool(re.search(r"\bWHERE\b", upper)),
        has_join=bool(re.search(r"\bJOIN\b", upper)),
        has_cross_join=bool(re.search(r"\bCROSS\s+JOIN\b", upper)),
        has_on=bool(re.search(r"\bON\b", upper)),
        has_using=bool(re.search(r"\bUSING\b", upper)),
        join_count=len(re.findall(r"\bJOIN\b", upper)),
        has_group_by=bool(re.search(r"\bGROUP BY\b", upper)),
        has_having=bool(re.search(r"\bHAVING\b", upper)),
        has_order_by=bool(re.search(r"\bORDER BY\b", upper)),
        has_window_order_by=bool(re.search(r"\bOVER\s*\(.*\bORDER BY\b", upper)),
        has_distinct=bool(re.search(r"\bDISTINCT\b", upper)),
        has_limit=bool(re.search(r"\bLIMIT\b", upper)),
        has_over=bool(re.search(r"\bOVER\s*\(", upper)),
        has_partition_by=bool(re.search(r"\bPARTITION BY\b", upper)),
        has_constant_partition_by=has_constant_partition_by,
        has_window_frame=bool(
            re.search(r"\b(RANGE|ROWS)\s+BETWEEN\b", upper)
            or re.search(r"\bUNBOUNDED PRECEDING\b", upper)
            or re.search(r"\bCURRENT ROW\b", upper)
        ),
        has_window_function=bool(
            re.search(
                r"\b(OVER\s*\(|LAG\s*\(|LEAD\s*\(|ROW_NUMBER\s*\(|RANK\s*\(|DENSE_RANK\s*\(|NTILE\s*\(|FIRST_VALUE\s*\(|LAST_VALUE\s*\(|CUME_DIST\s*\(|PERCENT_RANK\s*\()",
                upper,
            )
        ),
        has_navigation_window_function=has_navigation_window_function,
        has_ranking_window_function=has_ranking_window_function,
        has_aggregation=bool(
            re.search(r"\b(COUNT|SUM|AVG|MIN|MAX|STDDEV|STDDEV_POP|STDDEV_SAMP|VARIANCE|STRING_AGG)\s*\(", upper)
        ),
        has_subquery=bool(re.search(r"\(\s*SELECT\b", upper)),
        has_rollup=bool(re.search(r"\bROLLUP\b", upper)),
        has_grouping_sets=bool(re.search(r"\bGROUPING SETS?\b", upper)),
        has_grouping=bool(re.search(r"\bGROUPING\b", upper)),
        has_set_operation=bool(re.search(r"\bUNION\b|\bINTERSECT\b|\bEXCEPT\b", upper)),
        has_outer_join=has_outer_join,
        has_outer_join_null_filter=has_outer_join_null_filter,
        outer_join_count=len(re.findall(r"\b(LEFT|RIGHT|FULL)\s+JOIN\b", upper)),
        null_filter_count=len(re.findall(r"\bIS\s+NULL\b", upper)),
        metadata_query=bool(
            re.search(r"\b(INFORMATION_SCHEMA|PG_CATALOG|SYS\.)\b", upper)
        )
        or bool(re.search(r"(INFORMATION_SCHEMA|PG_CATALOG|SYS\.)", upper)),
        table_references=_extract_table_references(normalized),
        select_items=select_items,
        group_by_items=group_by_items,
        aggregate_projection_count=aggregate_projection_count,
        non_aggregate_projection_count=non_aggregate_projection_count,
        cte_count=cte_count,
        window_function_names=_dedupe_preserve_order(window_function_names),
        feature_names=_dedupe_preserve_order(feature_names),
    )


def _semantic_message_text(
    *,
    user_message: Optional[str] = None,
    context_metadata: Optional[Dict[str, Any]] = None,
) -> str:
    metadata = context_metadata or {}
    return user_message or str(metadata.get("raw_user_message") or metadata.get("query") or "")


def _strong_grouping_cue(message: str) -> bool:
    return bool(
        re.search(
            r"\b(for each|per\s+\w+|each\s+\w+|group by|grouped by|by territory|by department|by category|by product|by customer|by year|by month|by quarter)\b",
            _normalize_text(message),
        )
    )


def _strong_window_cue(message: str) -> bool:
    return bool(
        re.search(
            r"\b(previous|prior|last|next|running total|cumulative|moving average|windowed|windowing|rank|top\s+\d+|row number|row_number|dense rank|dense_rank|lag|lead|first value|first_value|last value|last_value|ntile|percentile|cume dist|cume_dist|percent rank|percent_rank)\b",
            _normalize_text(message),
        )
    )


def _strong_rollup_cue(message: str) -> bool:
    return bool(
        re.search(
            r"\b(rollup|grouping sets?|subtotals?|grand total|hierarchy|levels?)\b",
            _normalize_text(message),
        )
    )


def _row_grain_rejection_reason(
    *,
    analysis: SqlShapeAnalysis,
    message_text: str,
    semantics_config: Dict[str, Any],
    repair_mode: bool = False,
) -> Optional[str]:
    if not semantics_config.get("check_row_grain", True):
        return None

    normalized_message = _normalize_text(message_text)
    profile = build_sql_governance_profile(query=message_text, source="message")
    expected_row_grain = _expected_row_grain_label(
        message_text=message_text,
        profile=profile,
        family=None,
    )

    if analysis.has_outer_join_null_filter and not _strong_exclusion_cue(normalized_message):
        if repair_mode:
            return (
                "You already have a candidate skeleton. Keep outer-join coverage "
                "intact and move the NULL filter off the orphan side."
            )
        return (
            "An OUTER JOIN is being collapsed by a NULL filter on the outer side. "
            "Rewrite from scratch and preserve the intended join coverage."
        )

    if (
        analysis.has_aggregation
        and not analysis.has_group_by
        and not analysis.has_over
        and int(analysis.aggregate_projection_count or 0) > 0
        and int(analysis.non_aggregate_projection_count or 0) > 0
    ):
        if repair_mode:
            return (
                "You already have a candidate skeleton. Keep the current row "
                "grain stable and add GROUP BY only around the detail columns that "
                "need summarizing."
            )
        return (
            "Aggregates are mixed with detail columns but no GROUP BY was found. "
            "Rewrite from scratch and preserve the intended row grain."
        )

    if (
        analysis.has_group_by
        and not (analysis.has_rollup or analysis.has_grouping_sets or analysis.has_grouping)
        and int(analysis.non_aggregate_projection_count or 0)
        > max(1, len(analysis.group_by_items))
    ):
        if repair_mode:
            return (
                "You already have a candidate skeleton. Keep the grouped row "
                "grain aligned with the projected detail columns."
            )
        return (
            "The SELECT list and GROUP BY grain do not match. Rewrite from scratch "
            "and align the projection with the grouped row grain."
        )

    if (
        (expected_row_grain == "subtotal" or _strong_rollup_cue(normalized_message))
        and not (analysis.has_rollup or analysis.has_grouping_sets or analysis.has_grouping)
    ):
        if repair_mode:
            return (
                "You already have a candidate skeleton. Keep the subtotal grain "
                "explicit and add ROLLUP/GROUPING SETS/GROUPING()."
            )
        return (
            "The question calls for subtotals or hierarchy totals, but no "
            "ROLLUP/GROUPING SETS/GROUPING() was found. Rewrite from scratch and "
            "keep the subtotal grain explicit."
        )

    return None


def sql_semantics_rejection_reason(
    sql: str,
    *,
    user_message: Optional[str] = None,
    context_metadata: Optional[Dict[str, Any]] = None,
    semantics_config: Optional[Dict[str, Any]] = None,
    dialect: Optional[str] = None,
) -> Optional[str]:
    """Return a high-confidence rejection reason for obvious SQL shape drift."""
    config = dict(semantics_config or {})
    if not config.get("enabled", True):
        return None

    metadata_dialect = None
    if context_metadata:
        metadata_dialect = context_metadata.get("dialect")
    analysis = analyze_sql_shape(sql, dialect=dialect or metadata_dialect)
    if analysis.metadata_query:
        return None

    message_text = _semantic_message_text(
        user_message=user_message,
        context_metadata=context_metadata,
    )
    intents = set(_infer_semantic_intents(message_text))
    profile = build_sql_governance_profile(query=message_text, source="message")
    intents.update(profile.categories)
    navigation_cue = _strong_navigation_window_cue(message_text)
    ranking_cue = _strong_ranking_window_cue(message_text)
    exclusion_cue = _strong_exclusion_cue(message_text)

    governance_metadata: Dict[str, Any] = {}
    runtime_profile: Dict[str, Any] = {}
    if isinstance(context_metadata, dict):
        maybe_governance = context_metadata.get("sql_governance")
        if isinstance(maybe_governance, dict):
            governance_metadata = maybe_governance
        else:
            governance_metadata = context_metadata

        maybe_runtime = context_metadata.get("runtime_profile")
        if isinstance(maybe_runtime, dict):
            runtime_profile = maybe_runtime

    rejection_reason_streak = _safe_int(
        governance_metadata.get("last_rejection_reason_count"), 0
    )
    turn_local_repair_mode = bool(governance_metadata.get("turn_local_repair_mode"))
    anchor_tier = str(runtime_profile.get("anchor_tier") or "").strip().lower()
    repair_snapshot = _sql_repair_strategy_from_snapshot(
        sql_family=str(
            runtime_profile.get("sql_family")
            or governance_metadata.get("sql_family")
            or ""
        ),
        features=analysis.to_dict(),
        row_grain_state=runtime_profile.get("row_grain_state")
        or governance_metadata.get("row_grain_state"),
        gap_categories=governance_metadata.get("last_gap_categories"),
    )
    anchor_visible = anchor_tier in {"candidate", "validated"} or turn_local_repair_mode
    repair_mode = turn_local_repair_mode or rejection_reason_streak >= 2
    if repair_snapshot.get("repair_strategy") == "structural_rewrite":
        repair_mode = False
    repair_prefix = (
        "You already have a candidate skeleton. "
        if anchor_visible and repair_snapshot.get("repair_strategy") != "structural_rewrite"
        else ""
    )

    row_grain_reason = _row_grain_rejection_reason(
        analysis=analysis,
        message_text=message_text,
        semantics_config=config,
        repair_mode=repair_mode,
    )
    if row_grain_reason:
        return row_grain_reason

    if config.get("check_window", True) and (
        "window" in intents
        or "ranking" in intents
        or navigation_cue
        or ranking_cue
        or _strong_window_cue(message_text)
    ):
        if config.get("check_navigation_window", True):
            if navigation_cue:
                if analysis.has_ranking_window_function:
                    if repair_mode:
                        return (
                            f"{repair_prefix}Keep the current window path stable "
                            "and use LAG/LEAD/FIRST_VALUE/LAST_VALUE instead of "
                            "ranking windows."
                        )
                    return (
                        "Navigation-style SQL is using ranking windows instead of "
                        "LAG/LEAD/FIRST_VALUE/LAST_VALUE. Rewrite from scratch and "
                        "choose the navigation family."
                    )
                if not analysis.has_navigation_window_function:
                    if repair_mode:
                        return (
                            f"{repair_prefix}Keep the current window path stable "
                            "and add LAG/LEAD/FIRST_VALUE/LAST_VALUE."
                        )
                    return (
                        "Navigation-style SQL is missing a navigation window function. "
                        "Rewrite from scratch and use LAG/LEAD/FIRST_VALUE/LAST_VALUE."
                    )
                if not analysis.has_over:
                    if repair_mode:
                        return (
                            f"{repair_prefix}Keep the current window path stable "
                            "and add OVER with the right PARTITION BY and ORDER BY."
                        )
                    return (
                        "Navigation-style SQL is missing OVER. Rewrite from scratch and "
                        "add the navigation window definition."
                    )
            if ranking_cue:
                if analysis.has_navigation_window_function:
                    if repair_mode:
                        return (
                            f"{repair_prefix}Keep the current window path stable "
                            "and use ROW_NUMBER/RANK/DENSE_RANK/NTILE instead of "
                            "navigation windows."
                        )
                    return (
                        "Ranking-style SQL is using navigation windows instead of "
                        "ROW_NUMBER/RANK/DENSE_RANK/NTILE. Rewrite from scratch and "
                        "choose the ranking family."
                    )
                if not analysis.has_ranking_window_function:
                    if repair_mode:
                        return (
                            f"{repair_prefix}Keep the current window path stable "
                            "and add a ROW_NUMBER/RANK/DENSE_RANK/NTILE window."
                        )
                    return (
                        "Ranking-style SQL is missing a ranking window function. "
                        "Rewrite from scratch and use ROW_NUMBER/RANK/DENSE_RANK/NTILE."
                    )
                if not analysis.has_over:
                    if repair_mode:
                        return (
                            f"{repair_prefix}Keep the current window path stable "
                            "and add OVER with the right PARTITION BY and ORDER BY."
                        )
                    return (
                        "Ranking-style SQL is missing OVER. Rewrite from scratch and "
                        "add the ranking window definition."
                    )
        if not analysis.has_over:
            if repair_mode:
                return (
                    f"{repair_prefix}Keep the current window path stable and add "
                    "OVER with the right PARTITION BY and ORDER BY."
                )
            return (
                "Window-style SQL is missing OVER. Rewrite from scratch and add the "
                "required window definition."
            )
        if analysis.has_navigation_window_function and not analysis.has_window_order_by:
            if repair_mode:
                return (
                    f"{repair_prefix}Keep the current window path stable and add "
                    "the requested ORDER BY."
                )
            return (
                "Window navigation SQL is missing ORDER BY. Rewrite from scratch and "
                "add the window ordering."
            )
        if (
            config.get("require_partition_by_for_window_cues", True)
            and (_strong_window_cue(message_text) or _strong_grouping_cue(message_text))
            and not analysis.has_partition_by
            and analysis.has_over
        ):
            if repair_mode:
                return (
                    f"{repair_prefix}Keep the current window path stable and add "
                    "the right PARTITION BY key."
                )
            return (
                "The window query appears to require partitioning, but PARTITION BY "
                "is missing. Rewrite from scratch and add the partition key."
            )

    if config.get("check_partition_constant", True) and analysis.has_constant_partition_by:
        if analysis.has_navigation_window_function or _strong_grouping_cue(message_text):
            if repair_mode:
                return (
                    f"{repair_prefix}Keep the current window path stable and "
                    "replace PARTITION BY 1 with the real grouping key."
                )
            return (
                "PARTITION BY 1 collapses the window grain. Rewrite from scratch and "
                "partition by the real grouping key."
            )

    if config.get("check_aggregation", True) and (
        "aggregation" in intents or "grouping" in intents or _strong_grouping_cue(message_text)
    ):
        if analysis.has_aggregation and not analysis.has_group_by and not analysis.has_over:
            if analysis.non_aggregate_projection_count > 0 and analysis.aggregate_projection_count > 0:
                if repair_mode:
                    return (
                        f"{repair_prefix}Keep the current row grain stable and add "
                        "GROUP BY only around the detail columns that need "
                        "summarizing."
                    )
                return (
                    "Aggregates are mixed with detail columns but no GROUP BY was "
                    "found. Rewrite from scratch and preserve the intended row grain."
                )
            if _strong_grouping_cue(message_text):
                if repair_mode:
                    return (
                        f"{repair_prefix}Keep the grouped row grain stable and "
                        "make the GROUP BY explicit."
                    )
                return (
                    "The question calls for grouped output, but no GROUP BY was "
                    "found. Rewrite from scratch and make the grouping explicit."
                )
        if analysis.has_having and not analysis.has_group_by:
            if repair_mode:
                return (
                    f"{repair_prefix}Keep the grouped row grain stable and only "
                    "use HAVING with an explicit GROUP BY."
                )
            return (
                "HAVING was used without GROUP BY. Rewrite from scratch and make the "
                "grouping explicit."
            )
        if analysis.has_group_by and not (
            analysis.has_rollup or analysis.has_grouping_sets or analysis.has_grouping
        ):
            group_by_count = max(1, len(analysis.group_by_items))
            if analysis.non_aggregate_projection_count > group_by_count:
                if repair_mode:
                    return (
                        f"{repair_prefix}Keep the grouped row grain aligned with "
                        "the projected detail columns."
                    )
                return (
                    "The SELECT list and GROUP BY grain do not match. Rewrite from "
                    "scratch with the correct grouping."
                )

    if config.get("check_outer_join_null_filter", True) and analysis.has_outer_join_null_filter:
        if not exclusion_cue:
            if repair_mode:
                return (
                    f"{repair_prefix}Keep outer-join coverage intact and move the "
                    "NULL filter off the orphan side."
                )
            return (
                "An OUTER JOIN is being collapsed by a NULL filter on the outer side. "
                "Rewrite from scratch and preserve the intended join coverage."
            )

    if config.get("check_rollup", True) and (
        "rollup" in intents or _strong_rollup_cue(message_text)
    ):
        if not (analysis.has_rollup or analysis.has_grouping_sets or analysis.has_grouping):
            if repair_mode:
                return (
                    f"{repair_prefix}Keep the subtotal grain explicit and add "
                    "ROLLUP/GROUPING SETS/GROUPING()."
                )
            return (
                "The question calls for subtotals or hierarchy totals, but no "
                "ROLLUP/GROUPING SETS/GROUPING() was found."
            )

    if config.get("check_join", True) and "join" in intents:
        multi_table = len(analysis.table_references) >= 2
        if multi_table and not analysis.has_join and not analysis.has_subquery and not analysis.has_where:
            if repair_mode:
                return (
                    f"{repair_prefix}Keep the current anchor table stable and "
                    "connect the tables with a valid join or correlated subquery."
                )
            return (
                "The question appears to span multiple tables, but the SQL does not "
                "establish the relationship. Rewrite from scratch and use an "
                "explicit join or a valid correlated subquery."
            )

    return None



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
        "window": "Use the right window family and preserve OVER / PARTITION BY / ORDER BY.",
        "ranking": "Use ROW_NUMBER / RANK / DENSE_RANK / NTILE when the task asks for ranking.",
        "aggregation": "Preserve row grain before adding GROUP BY / HAVING.",
        "grouping": "Keep non-aggregated projections aligned with GROUP BY.",
        "join": "Do not collapse outer joins into orphan-only filters.",
        "ordering": "Add the requested ORDER BY.",
        "distinct": "Use DISTINCT only if the result must be deduplicated.",
        "subquery": "A nested query is acceptable when it simplifies the main path.",
        "filtering": "Keep the predicate set tight and push filters into WHERE.",
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
            r"\b(time series|time-series|trend|trends|over time|by day|by week|by month|by quarter|by year|monthly|quarterly|yearly|daily|weekly|mtd|qtd|ytd|mom|mom growth|yoy|year over year|month over month)\b",
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


def _runtime_profile_categories_from_snapshot(
    data: Dict[str, Any],
) -> List[str]:
    categories: List[str] = []
    sql_family = str(data.get("sql_family") or "").strip().lower()
    row_grain_state = data.get("row_grain_state")
    if not isinstance(row_grain_state, dict):
        row_grain_state = {}

    expected_row_grain = str(row_grain_state.get("expected") or "").strip().lower()
    observed_row_grain = str(row_grain_state.get("observed") or "").strip().lower()
    row_status = str(row_grain_state.get("status") or "").strip().lower()

    if sql_family in {"navigation", "ranking"}:
        categories.append("window")
    if sql_family == "ranking":
        categories.append("ranking")
    if sql_family == "rollup":
        categories.extend(["rollup", "grouping"])
    if sql_family in {"aggregation", "grouping"}:
        categories.extend(["aggregation", "grouping"])
    if sql_family == "join":
        categories.append("join")
    if sql_family == "subquery":
        categories.append("subquery")
    if sql_family == "set_operation":
        categories.append("set_operation")
    if sql_family == "time_series":
        categories.append("time_series")
    if sql_family == "ordering":
        categories.append("ordering")
    if sql_family == "filtering":
        categories.append("filtering")
    if sql_family == "detail":
        categories.append("detail")

    if expected_row_grain == "subtotal" or observed_row_grain == "subtotal":
        categories.extend(["rollup", "grouping"])
    elif expected_row_grain == "grouped" or observed_row_grain in {"grouped", "summary"}:
        categories.extend(["aggregation", "grouping"])
    elif row_status and not categories:
        categories.append("detail")
    elif row_status == "aligned" and sql_family in {"navigation", "ranking"}:
        categories.append("window")

    return _dedupe_preserve_order(categories)


def _profile_from_runtime_profile_snapshot(
    data: Any,
) -> Optional[SqlGovernanceProfile]:
    if not isinstance(data, dict):
        return None

    categories = _runtime_profile_categories_from_snapshot(data)
    notes: List[str] = []
    anchor_tier = str(data.get("anchor_tier") or "").strip().lower()
    freeze_reason = str(data.get("freeze_reason") or "").strip()
    row_grain_state = data.get("row_grain_state")
    if anchor_tier:
        notes.append(f"anchor_tier={anchor_tier}")
    if freeze_reason:
        notes.append(f"freeze_reason={freeze_reason}")
    if isinstance(row_grain_state, dict):
        row_status = str(row_grain_state.get("status") or "").strip().lower()
        if row_status:
            notes.append(f"row_grain={row_status}")

    if not (categories or notes):
        return None

    return SqlGovernanceProfile(
        source="runtime",
        categories=categories,
        notes=_dedupe_preserve_order(notes),
    )


def _is_metadata_shape(features: Optional[Dict[str, Any]]) -> bool:
    if not isinstance(features, dict):
        return False
    return bool(features.get("metadata_query"))


def _build_runtime_profile_snapshot(
    state: Any,
    *,
    policy: Optional[Any] = None,
) -> Dict[str, Any]:
    anchor_tier = _sql_anchor_tier_from_state(state, policy=policy)
    anchor_text = getattr(state, "frozen_sql_text", None) or getattr(
        state, "best_sql_text", None
    )
    anchor_shape = dict(
        getattr(state, "frozen_sql_shape", None)
        or getattr(state, "best_sql_shape", None)
        or {}
    )
    if (
        anchor_tier is None
        or not anchor_text
        or not anchor_shape
        or _is_metadata_shape(anchor_shape)
    ):
        return {}

    anchor_preview = _sql_anchor_preview_from_state(state)

    return {
        "source": "runtime",
        "anchor_tier": anchor_tier,
        "sql_family": _sql_anchor_family_from_state(state),
        "row_grain_state": dict(getattr(state, "row_grain_state", {}) or {}),
        "freeze_reason": getattr(state, "freeze_reason", None),
        "best_sql_preview": anchor_preview,
    }


def _sql_anchor_tier_from_state(
    state: Any,
    *,
    policy: Optional[Any] = None,
) -> Optional[str]:
    if (
        bool(getattr(state, "sql_exploration_frozen", False))
        and getattr(state, "frozen_sql_text", None)
        and getattr(state, "frozen_sql_shape", None)
    ):
        if not _is_metadata_shape(getattr(state, "frozen_sql_shape", None)):
            return "frozen"

    if not getattr(state, "best_sql_text", None) or not getattr(
        state, "best_sql_shape", None
    ):
        return None
    if _is_metadata_shape(getattr(state, "best_sql_shape", None)):
        return None

    min_support = max(2, int(getattr(policy, "freeze_min_best_sql_support", 2) or 2))
    row_grain_state = getattr(state, "row_grain_state", {}) or {}
    row_grain_status = str(row_grain_state.get("status") or "").strip().lower()

    if (
        int(getattr(state, "best_sql_support_count", 0) or 0) >= min_support
        and row_grain_status == "aligned"
        and not getattr(state, "best_sql_gap_categories", [])
    ):
        return "validated"

    return "candidate"


def _sql_anchor_preview_from_state(state: Any) -> str:
    anchor_text = getattr(state, "frozen_sql_text", None) or getattr(
        state, "best_sql_text", None
    )
    if not anchor_text:
        return ""
    preview = _collapse_sql(anchor_text)
    if len(preview) > 160:
        preview = f"{preview[:157]}..."
    return preview


def _sql_anchor_family_from_state(state: Any) -> Optional[str]:
    anchor_shape = getattr(state, "frozen_sql_shape", None) or getattr(
        state, "best_sql_shape", None
    )
    if isinstance(anchor_shape, dict) and anchor_shape:
        family = _shape_family_signature(anchor_shape)
        if family:
            return family
    if bool(getattr(state, "sql_exploration_frozen", False)) and getattr(
        state, "sql_family", None
    ):
        return getattr(state, "sql_family")
    return getattr(state, "sql_family", None)


def _sql_should_emit_recap(
    state: Any,
    *,
    policy: Optional[Any] = None,
) -> bool:
    anchor_tier = _sql_anchor_tier_from_state(state, policy=policy)
    if anchor_tier not in {"candidate", "validated"}:
        return False
    if bool(getattr(state, "sql_exploration_frozen", False)):
        return False

    row_grain_state = getattr(state, "row_grain_state", {}) or {}
    row_grain_status = str(row_grain_state.get("status") or "").strip().lower()
    anchor_family = str(_sql_anchor_family_from_state(state) or "").strip().lower()
    current_family = str(getattr(state, "sql_family", None) or "").strip().lower()
    has_drift = (
        getattr(state, "last_sql_result_success", None) is False
        or bool(getattr(state, "last_sql_result_has_metadata_query", False))
        or row_grain_status == "mismatch"
        or bool(getattr(state, "last_gap_categories", []))
        or (anchor_family and current_family and anchor_family != current_family)
    )
    return has_drift


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
        "cte_count": shape.cte_count,
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
        "has_set_operation": shape.has_set_operation,
        "has_time_series": shape.has_time_series,
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
                "has_set_operation": shape.has_set_operation,
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
    if features.get("has_set_operation"):
        return "set_operation"
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
    "set_operation",
    "time_series",
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
    "set_operation": "detail",
    "time_series": "detail",
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
    if re.search(r"\b(union(?:\s+all)?|intersect|except)\b", normalized_message):
        scores["set_operation"] += 6
        scores["detail"] += 1
    if re.search(
        r"\b(time series|time-series|trend|trends|over time|by day|by week|by month|by quarter|by year|monthly|quarterly|yearly|daily|weekly|mtd|qtd|ytd|mom|mom growth|yoy|year over year|month over month)\b",
        normalized_message,
    ):
        scores["time_series"] += 6
        scores["filtering"] += 1
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
    if "set_operation" in categories:
        scores["set_operation"] += 4
    if "time_series" in categories:
        scores["time_series"] += 4

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
        if feature_map.get("has_set_operation"):
            scores["set_operation"] += 6
            scores["detail"] += 1
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

    if feature_map.get("has_ranking_window_function") and not feature_map.get(
        "has_navigation_window_function"
    ):
        scores["ranking"] += 1

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
        elif gap == "set_operation":
            scores["set_operation"] += 1
            scores["detail"] += 1
        elif gap == "time_series":
            scores["time_series"] += 1
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
    primary_score = sorted_families[0][1] if sorted_families else 0
    current_score = scores.get(current_family, 0) if current_family in scores else 0
    if (
        current_family in scores
        and current_family != primary_family
        and current_score > 0
        and current_score >= max(0, primary_score - 1)
    ):
        primary_family = current_family
        primary_score = current_score

    if feature_map.get("has_ranking_window_function"):
        ranking_score = scores.get("ranking", 0)
        navigation_score = scores.get("navigation", 0)
        if ranking_score >= navigation_score:
            primary_family = "ranking"
            primary_score = ranking_score

    explicit_rollup_cue = _strong_rollup_cue(normalized_message)
    weak_rollup_signal = (
        primary_family == "rollup"
        and not explicit_rollup_cue
        and not feature_map.get("has_rollup")
        and not feature_map.get("has_grouping_sets")
        and not feature_map.get("has_grouping")
        and (scores.get("grouping", 0) > 0 or scores.get("aggregation", 0) > 0)
    )
    if weak_rollup_signal:
        demoted_family = (
            "grouping"
            if scores.get("grouping", 0) >= scores.get("aggregation", 0)
            else "aggregation"
        )
        if scores.get(demoted_family, 0) > 0:
            primary_family = demoted_family
            primary_score = scores[demoted_family]

    fallback_family = None
    for family, score in sorted_families:
        if family == primary_family:
            continue
        if score > 0:
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



def _sql_repair_strategy_from_snapshot(
    *,
    sql_family: Optional[str] = None,
    features: Optional[Dict[str, Any]] = None,
    row_grain_state: Optional[Dict[str, Any]] = None,
    gap_categories: Optional[Iterable[str]] = None,
) -> Dict[str, Any]:
    """Classify a SQL turn as local repair or structural rewrite."""
    feature_map = dict(features or {})
    row_state = dict(row_grain_state or {})
    family = str(
        sql_family or feature_map.get("sql_family") or ""
    ).strip().lower()

    expected_row_grain = str(row_state.get("expected") or "").strip().lower()
    observed_row_grain = str(row_state.get("observed") or "").strip().lower()
    row_status = str(row_state.get("status") or "").strip().lower()

    cte_count = _safe_int(feature_map.get("cte_count"), 0)
    has_group_by = bool(feature_map.get("has_group_by"))
    has_rollup = bool(feature_map.get("has_rollup"))
    has_grouping_sets = bool(feature_map.get("has_grouping_sets"))
    has_grouping = bool(feature_map.get("has_grouping"))
    has_aggregation = bool(feature_map.get("has_aggregation"))
    aggregate_projection_count = _safe_int(
        feature_map.get("aggregate_projection_count"), 0
    )
    non_aggregate_projection_count = _safe_int(
        feature_map.get("non_aggregate_projection_count"), 0
    )
    group_by_items = [
        str(item).strip()
        for item in feature_map.get("group_by_items") or []
        if str(item).strip()
    ]
    gap_set = {
        str(gap).strip().lower()
        for gap in (gap_categories or [])
        if str(gap).strip()
    }

    structural_reasons: List[str] = []
    structural = False

    if family in {"aggregation", "grouping", "rollup"}:
        structural = True
        structural_reasons.append(f"family={family}")

    if has_rollup or has_grouping_sets or has_grouping:
        structural = True
        structural_reasons.append("grouped_shape")

    grouped_projection_mismatch = (
        has_group_by
        and non_aggregate_projection_count > max(1, len(group_by_items))
    )
    mixed_aggregate_shape = (
        has_aggregation
        and not has_group_by
        and aggregate_projection_count > 0
        and non_aggregate_projection_count > 0
    )
    grouped_row_grain_mismatch = (
        has_group_by
        and (
            row_status != "aligned"
            or expected_row_grain in {"grouped", "subtotal"}
            or observed_row_grain in {"grouped", "summary", "subtotal"}
            or grouped_projection_mismatch
        )
    )
    structural_grouping_gap = bool(gap_set & {"aggregation", "grouping", "rollup"})

    if mixed_aggregate_shape or grouped_row_grain_mismatch:
        structural = True
        structural_reasons.append("grouped_summary_needs_rebuild")

    if cte_count >= 2 and (
        family in {"aggregation", "grouping", "rollup"}
        or has_group_by
        or has_rollup
        or has_grouping_sets
        or has_grouping
        or expected_row_grain in {"grouped", "subtotal"}
        or structural_grouping_gap
    ):
        structural = True
        structural_reasons.append(f"cte_count={cte_count}")

    if structural_grouping_gap and not structural:
        structural = True
        structural_reasons.append("shape_gap=aggregation/grouping/rollup")

    strategy = "structural_rewrite" if structural else "local_repair"
    reason = "; ".join(_dedupe_preserve_order(structural_reasons)) if structural else ""

    return {
        "repair_strategy": strategy,
        "repair_reason": reason,
        "repair_signals": _dedupe_preserve_order(structural_reasons),
        "cte_count": cte_count,
        "group_by_items": list(group_by_items),
    }


def sql_governance_rejection_reason(
    sql: str,
    *,
    context_metadata: Optional[Dict[str, Any]] = None,
    policy: Optional["SqlGovernancePolicy"] = None,
    dialect: Optional[str] = None,
) -> Optional[str]:
    """Return a rejection reason for unsafe SQL, or None if acceptable."""
    metadata = context_metadata or {}
    if _safe_bool(metadata.get("allow_metadata_query"), False):
        return None
    if _safe_bool(os.getenv("ALLOW_METADATA_QUERY"), False):
        return None

    metadata_dialect = None
    if context_metadata:
        metadata_dialect = context_metadata.get("dialect")

    sql_features = analyze_sql_text(sql, dialect=dialect or metadata_dialect)
    if sql_features.get("metadata_query"):
        return "Metadata introspection queries are not allowed for NL2SQL tasks"

    cleaned = (sql or "").strip()
    max_query_length = int(getattr(policy, "max_query_length", 10000) or 10000)
    max_subqueries = int(getattr(policy, "max_subqueries", 5) or 5)
    max_cte_depth = int(getattr(policy, "max_cte_depth", 3) or 3)
    max_joins = int(getattr(policy, "max_joins", 15) or 15)

    if len(cleaned) > max_query_length:
        return f"Query exceeds maximum length ({len(cleaned)} > {max_query_length})"

    subquery_count = len(re.findall(r"\(\s*SELECT\b", cleaned, re.IGNORECASE))
    if subquery_count > max_subqueries:
        return f"Query has too many subqueries ({subquery_count} > {max_subqueries})"

    cte_count = int(sql_features.get("cte_count") or 0)
    if cte_count > max_cte_depth:
        return f"Query has too many CTEs ({cte_count} > {max_cte_depth})"

    join_count = len(re.findall(r"\bJOIN\b", cleaned, re.IGNORECASE))
    if join_count > max_joins:
        return f"Query has too many JOINs ({join_count} > {max_joins})"

    return None


def sql_skeleton_freeze_rejection_reason(
    sql: str,
    *,
    context_metadata: Optional[Dict[str, Any]] = None,
    dialect: Optional[str] = None,
) -> Optional[str]:
    """Return a rejection reason when a frozen SQL skeleton would be violated."""
    metadata = context_metadata or {}
    governance = metadata.get("sql_governance")
    if not isinstance(governance, dict):
        governance = {}

    frozen_flag = bool(
        governance.get("sql_exploration_frozen")
        or metadata.get("sql_exploration_frozen")
    )
    if not frozen_flag:
        return None

    frozen_core_signature = (
        governance.get("frozen_sql_core_signature")
        or metadata.get("frozen_sql_core_signature")
        or governance.get("best_sql_core_signature")
        or metadata.get("best_sql_core_signature")
    )
    frozen_canonical_signature = (
        governance.get("frozen_sql_canonical_signature")
        or metadata.get("frozen_sql_canonical_signature")
        or governance.get("best_sql_canonical_signature")
        or metadata.get("best_sql_canonical_signature")
    )
    frozen_sql_shape = governance.get("frozen_sql_shape") or metadata.get(
        "frozen_sql_shape"
    )
    if not frozen_core_signature and isinstance(frozen_sql_shape, dict):
        frozen_core_signature = _shape_signature_from_features(
            frozen_sql_shape,
            core=True,
        )
    if not frozen_canonical_signature and isinstance(frozen_sql_shape, dict):
        frozen_canonical_signature = _shape_signature_from_features(
            frozen_sql_shape,
            core=True,
            canonical=True,
        )

    current_features = analyze_sql_text(
        sql,
        dialect=dialect or metadata.get("dialect"),
    )
    current_core_signature = _shape_signature_from_features(current_features, core=True)
    current_canonical_signature = _shape_signature_from_features(
        current_features,
        core=True,
        canonical=True,
    )

    if (
        current_canonical_signature == frozen_canonical_signature
        or current_core_signature == frozen_core_signature
    ):
        return None

    return (
        "SQL exploration is frozen for this turn. Keep the validated skeleton "
        "and only make local fixes."
    )
