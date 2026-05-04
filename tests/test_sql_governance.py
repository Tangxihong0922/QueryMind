from __future__ import annotations

import asyncio
from pathlib import Path
import sys
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from QueryMind.core.agent.sql_governance import (  # noqa: E402
    SqlGovernancePolicy,
    SqlGovernanceManager,
    build_sql_governance_stack,
    build_sql_governance_profile,
    build_sql_governance_recap_block,
    analyze_sql_shape,
    sql_governance_rejection_reason,
    sql_semantics_rejection_reason,
)
from QueryMind.core.evaluation.base import SqlTestCase  # noqa: E402
from QueryMind.core.evaluation.runtime import EvaluationRuntime, NoOpAgentMemory  # noqa: E402
from QueryMind.core.llm import LlmMessage, LlmRequest  # noqa: E402
from QueryMind.core.hook.sql_governance import SqlGovernanceHook  # noqa: E402
from QueryMind.core.middleware.sql_governance import SqlGovernanceMiddleware  # noqa: E402
from QueryMind.core.tool import ToolContext, ToolRejection  # noqa: E402
from QueryMind.core.tool.models import ToolResult  # noqa: E402
from QueryMind.core.user import User  # noqa: E402
from QueryMind.server.base.chat_handler import ChatHandler  # noqa: E402
from QueryMind.capabilities.sql_runner.models import RunSqlToolArgs  # noqa: E402
from QueryMind.tools.run_sql import RunSqlTool  # noqa: E402
from QueryMind.rls_registry import RLSToolRegistry  # noqa: E402


def _make_user() -> User:
    return User(
        id="u1",
        username="tester",
        email="tester@example.com",
        group_memberships=["user"],
    )


def _make_sql_request(
    *,
    conversation_id: str,
    request_id: str,
    system_prompt: str = "base prompt",
    tool_iterations: int = 0,
    max_tool_iterations: int = 8,
    message: str = "show windowed sales by customer",
    metadata: dict[str, object] | None = None,
) -> LlmRequest:
    combined_metadata: dict[str, object] = {
        "conversation_id": conversation_id,
        "request_id": request_id,
        "tool_iterations": tool_iterations,
        "max_tool_iterations": max_tool_iterations,
    }
    if metadata:
        combined_metadata.update(metadata)

    return LlmRequest(
        messages=[LlmMessage(role="user", content=message)],
        tools=[],
        user=_make_user(),
        system_prompt=system_prompt,
        metadata=combined_metadata,
    )


def test_sql_governance_profile_inference_from_tags() -> None:
    profile = build_sql_governance_profile(
        tags=["window", "join", "ordering"],
        query="return rows ordered by customer",
        source="case",
    )

    assert profile.categories == ["window", "join", "ordering"]
    assert "case" in profile.signature()


def test_sql_governance_profile_inference_covers_set_operation_and_time_series() -> None:
    profile = build_sql_governance_profile(
        tags=["set_operation", "time_series"],
        query="show trends by month and combine with prior periods using union",
        source="case",
    )

    assert "set_operation" in profile.categories
    assert "time_series" in profile.categories


def test_analyze_sql_shape_is_none_safe(monkeypatch) -> None:
    import QueryMind.core.agent.sql_governance_shape as sql_governance_shape_module

    monkeypatch.setattr(
        sql_governance_shape_module,
        "_parse_sqlglot_statements",
        lambda *args, **kwargs: [None],
    )

    shape = analyze_sql_shape("SELECT 1")

    assert shape.has_select is True
    assert shape.statement_count == 1


def test_sql_governance_rejects_metadata_introspection() -> None:
    reason = sql_governance_rejection_reason(
        "SELECT * FROM information_schema.tables",
        context_metadata={"evaluation": True},
    )

    assert reason is not None
    assert "Metadata introspection" in reason


def test_sql_governance_allows_metadata_introspection_via_shared_env(monkeypatch) -> None:
    monkeypatch.setenv("ALLOW_METADATA_QUERY", "true")

    reason = sql_governance_rejection_reason(
        "SELECT * FROM information_schema.tables",
        context_metadata={"evaluation": True},
    )

    assert reason is None


def test_sql_semantics_rejects_window_query_missing_over() -> None:
    reason = sql_semantics_rejection_reason(
        "SELECT sale_date, LAG(amount) FROM sales",
        user_message="show previous sale by customer",
        semantics_config={"enabled": True},
    )

    assert reason is not None
    assert "navigation" in reason.lower()


def test_sql_semantics_rejects_aggregate_without_group_by() -> None:
    reason = sql_semantics_rejection_reason(
        "SELECT department, SUM(sales) FROM sales",
        user_message="show total sales by department",
        semantics_config={"enabled": True},
    )

    assert reason is not None
    assert "GROUP BY" in reason


def test_sql_semantics_allows_correlated_subquery_for_join_intent() -> None:
    reason = sql_semantics_rejection_reason(
        """
        SELECT c.customer_id
        FROM customers c
        WHERE EXISTS (
            SELECT 1
            FROM orders o
            WHERE o.customer_id = c.customer_id
        )
        """,
        user_message="join customers and orders",
        semantics_config={"enabled": True},
    )

    assert reason is None


def test_sql_semantics_rejects_navigation_window_misuse() -> None:
    reason = sql_semantics_rejection_reason(
        "SELECT ROW_NUMBER() OVER (ORDER BY sale_date) FROM sales",
        user_message="show previous sale by customer",
        semantics_config={"enabled": True},
    )

    assert reason is not None
    assert "navigation" in reason.lower()


def test_sql_semantics_rejects_constant_partition_for_navigation_window() -> None:
    reason = sql_semantics_rejection_reason(
        "SELECT LAG(amount) OVER (PARTITION BY 1 ORDER BY sale_date) FROM sales",
        user_message="show previous sale by customer",
        semantics_config={"enabled": True},
    )

    assert reason is not None
    assert "PARTITION BY 1" in reason


def test_sql_semantics_rejects_outer_join_null_filter_drift() -> None:
    reason = sql_semantics_rejection_reason(
        "SELECT a.id FROM a LEFT JOIN b ON a.id = b.id WHERE b.id IS NULL",
        user_message="join tables a and b",
        semantics_config={"enabled": True},
    )

    assert reason is not None
    assert "OUTER JOIN" in reason


def test_sql_semantics_rejects_row_grain_mismatch() -> None:
    reason = sql_semantics_rejection_reason(
        "SELECT department, SUM(sales) FROM sales",
        user_message="show total sales by department",
        semantics_config={"enabled": True, "check_row_grain": True},
    )

    assert reason is not None
    assert "row grain" in reason.lower()


def test_sql_governance_middleware_injects_baseline_prompt_without_static_checklist() -> None:
    profile = build_sql_governance_profile(
        tags=["window", "join"],
        query="show windowed sales by customer",
        source="case",
    )
    manager = SqlGovernanceManager()
    middleware = SqlGovernanceMiddleware(manager)
    request = LlmRequest(
        messages=[LlmMessage(role="user", content="show windowed sales by customer")],
        tools=[],
        user=_make_user(),
        system_prompt="base prompt",
        metadata={
            "conversation_id": "conv-1",
            "request_id": "req-1",
            "sql_governance_profile": {
                "source": profile.source,
                "categories": profile.categories,
                "notes": profile.notes,
                "allow_metadata_query": profile.allow_metadata_query,
            },
        },
    )

    updated = asyncio.run(middleware.before_llm_request(request))

    assert "SQL Governance" in (updated.system_prompt or "")
    assert "Avoid metadata introspection queries" in (updated.system_prompt or "")
    assert "Keep the current row grain" in (updated.system_prompt or "")
    assert "Task Profile" not in (updated.system_prompt or "")
    assert "Missing From Last Attempt" not in (updated.system_prompt or "")
    assert "sql_governance_profile" not in (updated.metadata or {})
    assert "sql_profile" not in (updated.metadata or {})
    assert updated.metadata.get("sql_governance", {}).get("sql_family") is not None


def test_sql_governance_recap_includes_set_operation_and_time_series_guidance() -> None:
    recap = build_sql_governance_recap_block(
        build_sql_governance_profile(
            tags=["set_operation", "time_series"],
            query="union monthly trends",
            source="case",
        ),
        ["set_operation", "time_series"],
        sql_family="set_operation",
        row_grain_state={
            "expected": "detail",
            "observed": "detail",
            "status": "aligned",
        },
        last_sql_shape={
            "has_set_operation": True,
            "has_time_series": True,
        },
        last_sql_text="SELECT date_trunc('month', order_date), SUM(total) FROM sales UNION SELECT date_trunc('month', order_date), SUM(total) FROM archived_sales",
    )

    assert "set operation semantics stable" in recap.lower()
    assert "time grain stable" in recap.lower()


def test_sql_governance_middleware_injects_recap_after_failed_sql_attempt() -> None:
    manager = SqlGovernanceManager()
    middleware = SqlGovernanceMiddleware(manager)
    request = _make_sql_request(
        conversation_id="conv-1",
        request_id="req-1",
    )

    asyncio.run(middleware.before_llm_request(request))
    asyncio.run(
        manager.observe_sql_result(
            conversation_id="conv-1",
            request_id="req-1",
            result_metadata={
                "tool_name": "run_sql",
                "conversation_id": "conv-1",
                "request_id": "req-1",
                "error": "syntax error",
            },
            success=False,
        )
    )

    followup = _make_sql_request(
        conversation_id="conv-1",
        request_id="req-2",
        tool_iterations=1,
    )
    updated = asyncio.run(middleware.before_llm_request(followup))

    assert "SQL Self-Check Reminder" not in (updated.system_prompt or "")
    assert "Avoid metadata introspection queries" in (updated.system_prompt or "")


def test_sql_governance_recap_is_empty_without_anchor_or_drift() -> None:
    manager = SqlGovernanceManager()

    recap = asyncio.run(manager.build_recap_block(conversation_id="conv-empty"))

    assert recap == ""


def test_sql_governance_middleware_injects_recap_after_shape_gap() -> None:
    profile = build_sql_governance_profile(
        tags=["window"],
        query="show previous sale by customer",
        source="case",
    )
    manager = SqlGovernanceManager()
    middleware = SqlGovernanceMiddleware(manager)
    first_request = _make_sql_request(
        conversation_id="conv-2",
        request_id="req-1",
        metadata={
            "sql_governance_profile": {
                "source": profile.source,
                "categories": profile.categories,
                "notes": profile.notes,
                "allow_metadata_query": profile.allow_metadata_query,
            }
        },
    )

    asyncio.run(middleware.before_llm_request(first_request))
    asyncio.run(
        manager.observe_sql_result(
            conversation_id="conv-2",
            request_id="req-1",
            result_metadata={
                "tool_name": "run_sql",
                "conversation_id": "conv-2",
                "request_id": "req-1",
                "executed_sql": "SELECT sale_date, LAG(amount) FROM sales",
                "dialect": "postgres",
            },
            success=True,
        )
    )

    followup = _make_sql_request(
        conversation_id="conv-2",
        request_id="req-2",
        tool_iterations=1,
    )
    updated = asyncio.run(middleware.before_llm_request(followup))
    recap_block = asyncio.run(
        manager.build_recap_block(conversation_id="conv-2")
    )

    assert "SQL Self-Check Reminder" in (updated.system_prompt or "")
    assert "row grain stable" in (updated.system_prompt or "").lower()
    assert "window shape" in (updated.system_prompt or "").lower()
    assert "window shape" in recap_block.lower()
    assert "LAG" not in recap_block
    assert "ROW_NUMBER" not in recap_block


def test_sql_governance_middleware_injects_grouped_output_positive_recap_after_shape_gap() -> None:
    profile = build_sql_governance_profile(
        tags=["aggregation", "grouping"],
        query="show total sales by department",
        source="case",
    )
    manager = SqlGovernanceManager()
    middleware = SqlGovernanceMiddleware(manager)
    first_request = _make_sql_request(
        conversation_id="conv-agg",
        request_id="req-1",
        metadata={
            "sql_governance_profile": {
                "source": profile.source,
                "categories": profile.categories,
                "notes": profile.notes,
                "allow_metadata_query": profile.allow_metadata_query,
            }
        },
    )

    asyncio.run(middleware.before_llm_request(first_request))
    asyncio.run(
        manager.observe_sql_result(
            conversation_id="conv-agg",
            request_id="req-1",
            result_metadata={
                "tool_name": "run_sql",
                "conversation_id": "conv-agg",
                "request_id": "req-1",
                "executed_sql": "SELECT department, SUM(sales) FROM sales",
                "dialect": "postgres",
            },
            success=True,
        )
    )

    followup = _make_sql_request(
        conversation_id="conv-agg",
        request_id="req-2",
        tool_iterations=1,
    )
    updated = asyncio.run(middleware.before_llm_request(followup))

    assert "row grain" in (updated.system_prompt or "").lower()
    assert "grouped summary" in (updated.system_prompt or "").lower()
    assert "GROUP BY" not in (updated.system_prompt or "")


def test_sql_governance_middleware_merges_runtime_snapshot_into_metadata() -> None:
    manager = SqlGovernanceManager()
    middleware = SqlGovernanceMiddleware(manager)
    request = _make_sql_request(
        conversation_id="conv-3",
        request_id="req-1",
    )

    asyncio.run(middleware.before_llm_request(request))
    asyncio.run(
        manager.observe_sql_result(
            conversation_id="conv-3",
            request_id="req-1",
            result_metadata={
                "tool_name": "run_sql",
                "conversation_id": "conv-3",
                "request_id": "req-1",
                "executed_sql": "SELECT ROW_NUMBER() OVER (ORDER BY id) FROM sales",
                "dialect": "postgres",
            },
            success=True,
        )
    )

    followup = _make_sql_request(
        conversation_id="conv-3",
        request_id="req-2",
        tool_iterations=1,
    )
    updated = asyncio.run(middleware.before_llm_request(followup))

    sql_governance = updated.metadata.get("sql_governance", {})
    last_sql_summary = updated.metadata.get("last_sql_summary", {})
    last_sql_shape = updated.metadata.get("last_sql_shape", {})

    assert sql_governance.get("last_sql_result_success") is True
    assert sql_governance.get("last_sql_text") == "SELECT ROW_NUMBER() OVER (ORDER BY id) FROM sales"
    assert sql_governance.get("sql_family") == "ranking"
    assert sql_governance.get("row_grain_state", {}).get("observed") == "detail"
    assert updated.metadata.get("runtime_profile", {}).get("anchor_tier") == "candidate"
    assert updated.metadata.get("runtime_profile", {}).get("sql_family") == "ranking"
    assert last_sql_summary.get("summary_text", "").startswith("run_sql[success]")
    assert last_sql_shape.get("has_over") is True
    assert last_sql_shape.get("has_ranking_window_function") is True


def test_sql_governance_profile_seeds_turn_local_family_state_before_first_sql() -> None:
    profile = build_sql_governance_profile(
        query="show previous sale by customer",
        source="case",
    )
    manager = SqlGovernanceManager()
    middleware = SqlGovernanceMiddleware(manager)
    request = LlmRequest(
        messages=[LlmMessage(role="user", content="show previous sale by customer")],
        tools=[],
        user=_make_user(),
        system_prompt="base prompt",
        metadata={
            "conversation_id": "conv-family",
            "request_id": "req-1",
            "sql_governance_profile": {
                "source": profile.source,
                "categories": profile.categories,
                "notes": profile.notes,
                "allow_metadata_query": profile.allow_metadata_query,
            },
        },
    )

    updated = asyncio.run(middleware.before_llm_request(request))
    governance = updated.metadata.get("sql_governance", {})
    row_grain_state = governance.get("row_grain_state", {})

    assert governance.get("sql_family") == "navigation"
    assert governance.get("sql_family_candidates", [])[0] == "navigation"
    assert row_grain_state.get("expected") == "detail"
    assert row_grain_state.get("status") == "aligned"
    assert "Keep the current row grain" in (updated.system_prompt or "")


def test_sql_governance_middleware_shows_candidate_anchor_and_local_repair_mode() -> None:
    policy = SqlGovernancePolicy(
        freeze_trigger_ratio=0.95,
        freeze_min_tool_iterations=10,
        freeze_min_best_sql_support=3,
    )
    manager = SqlGovernanceManager(policy)
    sql = "SELECT ROW_NUMBER() OVER (ORDER BY id) FROM sales"

    for index in (1, 2):
        asyncio.run(
            manager.observe_sql_result(
                conversation_id="conv-candidate-repair",
                request_id=f"req-{index}",
                result_metadata={
                    "tool_name": "run_sql",
                    "conversation_id": "conv-candidate-repair",
                    "request_id": f"req-{index}",
                    "executed_sql": sql,
                    "dialect": "postgres",
                    "tool_iterations": index,
                    "max_tool_iterations": 20,
                },
                success=True,
            )
        )

    prompt_block = asyncio.run(
        manager.build_prompt_block(
            conversation_id="conv-candidate-repair",
            request_id="req-3",
        )
    )
    snapshot = asyncio.run(
        manager.build_request_metadata(conversation_id="conv-candidate-repair")
    )

    assert "Candidate anchor" in prompt_block
    assert "Local repair mode" in prompt_block
    assert "frozen" not in prompt_block.lower()
    assert snapshot["sql_governance"]["turn_local_repair_mode"] is True
    assert snapshot["sql_governance"]["same_success_sql_canonical_streak"] >= 2


def test_sql_governance_freezes_valid_anchor_without_profile() -> None:
    policy = SqlGovernancePolicy(
        freeze_trigger_ratio=0.5,
        freeze_min_tool_iterations=2,
        freeze_min_best_sql_support=2,
    )
    manager = SqlGovernanceManager(policy)
    sql = "SELECT ROW_NUMBER() OVER (ORDER BY id) FROM sales"

    for index in (1, 2):
        asyncio.run(
            manager.observe_sql_result(
                conversation_id="conv-freeze-no-profile",
                request_id=f"req-{index}",
                result_metadata={
                    "tool_name": "run_sql",
                    "conversation_id": "conv-freeze-no-profile",
                    "request_id": f"req-{index}",
                    "executed_sql": sql,
                    "dialect": "postgres",
                    "tool_iterations": index,
                    "max_tool_iterations": 4,
                },
                success=True,
            )
        )

    snapshot = asyncio.run(
        manager.build_request_metadata(conversation_id="conv-freeze-no-profile")
    )
    governance = snapshot["sql_governance"]

    assert governance["sql_exploration_frozen"] is True
    assert governance["best_sql_support_count"] >= 2
    assert governance["last_freeze_evaluation"]["reason"] == "freeze"
    assert governance["last_freeze_evaluation"]["profile_state"] == "missing"
    assert snapshot["runtime_profile"]["source"] == "runtime"
    assert snapshot["runtime_profile"]["anchor_tier"] == "frozen"
    assert snapshot["runtime_profile"]["sql_family"] == "ranking"
    assert "ROW_NUMBER" in snapshot["runtime_profile"]["best_sql_preview"]


def test_sql_governance_anchor_tier_progresses_before_freeze() -> None:
    policy = SqlGovernancePolicy(
        freeze_trigger_ratio=0.95,
        freeze_min_tool_iterations=10,
        freeze_min_best_sql_support=2,
    )
    manager = SqlGovernanceManager(policy)
    sql = "SELECT ROW_NUMBER() OVER (ORDER BY id) FROM sales"

    asyncio.run(
        manager.observe_sql_result(
            conversation_id="conv-anchor-tier",
            request_id="req-1",
            result_metadata={
                "tool_name": "run_sql",
                "conversation_id": "conv-anchor-tier",
                "request_id": "req-1",
                "executed_sql": sql,
                "dialect": "postgres",
                "tool_iterations": 1,
                "max_tool_iterations": 20,
            },
            success=True,
        )
    )
    snapshot1 = asyncio.run(
        manager.build_request_metadata(conversation_id="conv-anchor-tier")
    )

    assert snapshot1["runtime_profile"]["anchor_tier"] == "candidate"
    assert snapshot1["sql_governance"]["best_sql_support_count"] == 1
    assert snapshot1["sql_governance"]["sql_exploration_frozen"] is False

    asyncio.run(
        manager.observe_sql_result(
            conversation_id="conv-anchor-tier",
            request_id="req-2",
            result_metadata={
                "tool_name": "run_sql",
                "conversation_id": "conv-anchor-tier",
                "request_id": "req-2",
                "executed_sql": sql,
                "dialect": "postgres",
                "tool_iterations": 2,
                "max_tool_iterations": 20,
            },
            success=True,
        )
    )
    snapshot2 = asyncio.run(
        manager.build_request_metadata(conversation_id="conv-anchor-tier")
    )

    assert snapshot2["runtime_profile"]["anchor_tier"] == "validated"
    assert snapshot2["sql_governance"]["best_sql_support_count"] == 2
    assert snapshot2["sql_governance"]["sql_exploration_frozen"] is False


def test_sql_governance_family_router_prefers_join_with_subquery_fallback() -> None:
    profile = build_sql_governance_profile(
        query="join customers and orders",
        source="case",
    )
    manager = SqlGovernanceManager()
    asyncio.run(
        manager.register_request_profile(
            conversation_id="conv-router-join",
            request_id="req-1",
            profile=profile,
            user_message="join customers and orders",
        )
    )

    snapshot = asyncio.run(
        manager.build_request_metadata(conversation_id="conv-router-join")
    )
    governance = snapshot["sql_governance"]

    assert governance["sql_family"] == "join"
    assert governance["sql_family_candidates"][:2] == ["join", "subquery"]


def test_sql_governance_family_router_prefers_rollup_for_subtotal_tasks() -> None:
    profile = build_sql_governance_profile(
        query="show subtotals by territory",
        source="case",
    )
    manager = SqlGovernanceManager()
    asyncio.run(
        manager.register_request_profile(
            conversation_id="conv-router-rollup",
            request_id="req-1",
            profile=profile,
            user_message="show subtotals by territory",
        )
    )

    snapshot = asyncio.run(
        manager.build_request_metadata(conversation_id="conv-router-rollup")
    )
    governance = snapshot["sql_governance"]

    assert governance["sql_family"] == "rollup"
    assert governance["sql_family_candidates"][0] == "rollup"
    assert governance["row_grain_state"]["expected"] == "subtotal"


def test_sql_governance_family_router_routes_grouping_level_cue_to_rollup() -> None:
    profile = build_sql_governance_profile(
        query="return name, jobtitle, grouping level and employee count by department",
        source="case",
    )
    manager = SqlGovernanceManager()
    asyncio.run(
        manager.register_request_profile(
            conversation_id="conv-router-grouped",
            request_id="req-1",
            profile=profile,
            user_message="return name, jobtitle, grouping level and employee count by department",
        )
    )

    snapshot = asyncio.run(
        manager.build_request_metadata(conversation_id="conv-router-grouped")
    )
    governance = snapshot["sql_governance"]

    assert governance["sql_family"] == "rollup"
    assert governance["sql_family_candidates"][0] == "rollup"
    assert governance["row_grain_state"]["expected"] == "subtotal"


def test_sql_governance_middleware_backoff_uses_filtering_positive_recap() -> None:
    profile = build_sql_governance_profile(
        tags=["filtering", "date_filter"],
        query="show sales by date",
        source="case",
    )
    manager = SqlGovernanceManager()
    middleware = SqlGovernanceMiddleware(manager)
    first_request = _make_sql_request(
        conversation_id="conv-filtering-backoff",
        request_id="req-1",
        message="show sales by date",
        metadata={
            "sql_governance_profile": {
                "source": profile.source,
                "categories": profile.categories,
                "notes": profile.notes,
                "allow_metadata_query": profile.allow_metadata_query,
            }
        },
    )

    asyncio.run(middleware.before_llm_request(first_request))
    asyncio.run(
        manager.observe_sql_result(
            conversation_id="conv-filtering-backoff",
            request_id="req-1",
            result_metadata={
                "tool_name": "run_sql",
                "conversation_id": "conv-filtering-backoff",
                "request_id": "req-1",
                "executed_sql": (
                    "SELECT order_date, total FROM sales "
                    "WHERE order_date >= DATE '2024-01-01'"
                ),
                "dialect": "postgres",
                "tool_iterations": 1,
                "max_tool_iterations": 20,
            },
            success=True,
        )
    )
    asyncio.run(
        manager.observe_sql_result(
            conversation_id="conv-filtering-backoff",
            request_id="req-2",
            result_metadata={
                "tool_name": "run_sql",
                "conversation_id": "conv-filtering-backoff",
                "request_id": "req-2",
                "error": "Window-style SQL is missing OVER",
            },
            success=False,
        )
    )
    asyncio.run(
        manager.observe_sql_result(
            conversation_id="conv-filtering-backoff",
            request_id="req-3",
            result_metadata={
                "tool_name": "run_sql",
                "conversation_id": "conv-filtering-backoff",
                "request_id": "req-3",
                "error": "Window-style SQL is missing OVER",
            },
            success=False,
        )
    )

    recap_block = asyncio.run(
        manager.build_recap_block(conversation_id="conv-filtering-backoff")
    )
    snapshot = asyncio.run(
        manager.build_request_metadata(conversation_id="conv-filtering-backoff")
    )

    assert "original projection" in recap_block.lower()
    assert "date predicate" in recap_block.lower()
    assert "candidate skeleton" in recap_block.lower()
    assert snapshot["sql_governance"]["last_rejection_reason_count"] == 2
    assert snapshot["sql_governance"]["turn_local_repair_mode"] is True


def test_sql_semantics_rejects_window_query_with_local_repair_backoff() -> None:
    reason = sql_semantics_rejection_reason(
        "SELECT LAG(amount) FROM sales",
        user_message="show previous sale by customer",
        context_metadata={
            "runtime_profile": {
                "anchor_tier": "candidate",
                "sql_family": "navigation",
                "row_grain_state": {
                    "expected": "detail",
                    "observed": "detail",
                    "status": "aligned",
                },
            },
            "sql_governance": {
                "last_rejection_reason_count": 2,
                "turn_local_repair_mode": True,
            },
        },
        semantics_config={"enabled": True},
    )

    assert reason is not None
    assert "rewrite from scratch" not in reason.lower()
    assert "current window path stable" in reason.lower()


def test_sql_governance_recap_prefers_projection_and_date_predicate_for_filtering() -> None:
    recap = build_sql_governance_recap_block(
        None,
        ["filtering"],
        sql_family="filtering",
        row_grain_state={
            "expected": "detail",
            "observed": "detail",
            "status": "aligned",
        },
        last_sql_shape={"has_where": True},
        last_sql_text="SELECT businessentityid, salesytd, current_date, newdate FROM sales.salesperson WHERE salesytd <> 0 AND current_date + interval '2 day' IS NOT NULL",
        turn_local_repair_mode=True,
        rejection_reason_streak=2,
    )

    assert "original projection" in recap.lower()
    assert "date predicate" in recap.lower()


def test_sql_governance_ignores_metadata_sql_as_anchor() -> None:
    policy = SqlGovernancePolicy(
        freeze_trigger_ratio=0.5,
        freeze_min_tool_iterations=2,
        freeze_min_best_sql_support=2,
    )
    manager = SqlGovernanceManager(policy)
    sql = "SELECT * FROM information_schema.tables"

    for index in (1, 2):
        asyncio.run(
            manager.observe_sql_result(
                conversation_id="conv-metadata-anchor",
                request_id=f"req-{index}",
                result_metadata={
                    "tool_name": "run_sql",
                    "conversation_id": "conv-metadata-anchor",
                    "request_id": f"req-{index}",
                    "executed_sql": sql,
                    "dialect": "postgres",
                    "tool_iterations": index,
                    "max_tool_iterations": 4,
                },
                success=True,
            )
        )

    snapshot = asyncio.run(
        manager.build_request_metadata(conversation_id="conv-metadata-anchor")
    )
    governance = snapshot["sql_governance"]

    assert governance["metadata_query_failures"] == 2
    assert governance["best_sql_canonical_signature"] is None
    assert governance["sql_exploration_frozen"] is False
    assert governance["last_freeze_evaluation"]["reason"] == "no_valid_skeleton"
    assert snapshot["runtime_profile"] == {}


def test_sql_governance_freezes_verified_skeleton_after_threshold() -> None:
    policy = SqlGovernancePolicy(
        freeze_trigger_ratio=0.5,
        freeze_min_tool_iterations=2,
        freeze_min_best_sql_support=2,
    )
    manager = SqlGovernanceManager(policy)
    profile = build_sql_governance_profile(
        tags=["join"],
        query="join customers and orders",
        source="case",
    )

    asyncio.run(
        manager.register_request_profile(
            conversation_id="conv-freeze",
            request_id="req-1",
            profile=profile,
        )
    )

    frozen_sql = (
        "SELECT c.customer_id "
        "FROM customers c FULL OUTER JOIN orders o ON c.customer_id = o.customer_id"
    )
    for index in (1, 2):
        asyncio.run(
            manager.observe_sql_result(
                conversation_id="conv-freeze",
                request_id=f"req-{index}",
                result_metadata={
                    "tool_name": "run_sql",
                    "conversation_id": "conv-freeze",
                    "request_id": f"req-{index}",
                    "executed_sql": frozen_sql,
                    "dialect": "postgres",
                    "tool_iterations": index,
                    "max_tool_iterations": 4,
                },
                success=True,
            )
        )

    snapshot = asyncio.run(
        manager.build_request_metadata(conversation_id="conv-freeze")
    )
    governance = snapshot["sql_governance"]

    assert governance["sql_exploration_frozen"] is True
    assert governance["best_sql_core_signature"] == governance["frozen_sql_core_signature"]
    assert governance["best_sql_support_count"] >= 2
    assert "frozen" in (governance["freeze_reason"] or "").lower()
    assert governance["last_freeze_evaluation"]["decision"] == "frozen"

    prompt_block = asyncio.run(
        manager.build_prompt_block(
            conversation_id="conv-freeze",
            request_id="req-3",
        )
    )
    recap_block = asyncio.run(
        manager.build_recap_block(conversation_id="conv-freeze")
    )

    assert "frozen anchor" in prompt_block.lower()
    assert "full outer join" in prompt_block.lower()
    assert recap_block == ""


def test_sql_governance_freezes_equivalent_join_skeletons_and_logs(caplog) -> None:
    policy = SqlGovernancePolicy(
        freeze_trigger_ratio=0.5,
        freeze_min_tool_iterations=2,
        freeze_min_best_sql_support=2,
    )
    manager = SqlGovernanceManager(policy)
    profile = build_sql_governance_profile(
        tags=["join"],
        query="join customers and orders",
        source="case",
    )

    asyncio.run(
        manager.register_request_profile(
            conversation_id="conv-freeze-canonical",
            request_id="req-1",
            profile=profile,
        )
    )

    sql_a = (
        "SELECT c.customer_id "
        "FROM customers c FULL OUTER JOIN orders o ON c.customer_id = o.customer_id"
    )
    sql_b = (
        "SELECT o.customer_id "
        "FROM orders o FULL OUTER JOIN customers c ON c.customer_id = o.customer_id"
    )

    with caplog.at_level("INFO"):
        asyncio.run(
            manager.observe_sql_result(
                conversation_id="conv-freeze-canonical",
                request_id="req-1",
                result_metadata={
                    "tool_name": "run_sql",
                    "conversation_id": "conv-freeze-canonical",
                    "request_id": "req-1",
                    "executed_sql": sql_a,
                    "dialect": "postgres",
                    "tool_iterations": 1,
                    "max_tool_iterations": 4,
                },
                success=True,
            )
        )
        asyncio.run(
            manager.observe_sql_result(
                conversation_id="conv-freeze-canonical",
                request_id="req-2",
                result_metadata={
                    "tool_name": "run_sql",
                    "conversation_id": "conv-freeze-canonical",
                    "request_id": "req-2",
                    "executed_sql": sql_b,
                    "dialect": "postgres",
                    "tool_iterations": 2,
                    "max_tool_iterations": 4,
                },
                success=True,
            )
        )

    snapshot = asyncio.run(
        manager.build_request_metadata(conversation_id="conv-freeze-canonical")
    )
    governance = snapshot["sql_governance"]

    assert governance["sql_exploration_frozen"] is True
    assert governance["best_sql_support_count"] >= 2
    assert governance["best_sql_canonical_signature"] == governance["frozen_sql_canonical_signature"]
    assert governance["last_freeze_evaluation"]["decision"] == "frozen"
    assert "freeze evaluation" in caplog.text.lower()
    assert "sql skeleton frozen" in caplog.text.lower()


def test_sql_governance_middleware_consumes_runtime_profile_when_explicit_profile_missing() -> None:
    manager = SqlGovernanceManager()
    sql = "SELECT ROW_NUMBER() OVER (ORDER BY id) FROM sales"

    asyncio.run(
        manager.observe_sql_result(
            conversation_id="conv-runtime-profile",
            request_id="req-1",
            result_metadata={
                "tool_name": "run_sql",
                "conversation_id": "conv-runtime-profile",
                "request_id": "req-1",
                "executed_sql": sql,
                "dialect": "postgres",
                "tool_iterations": 1,
                "max_tool_iterations": 4,
            },
            success=True,
        )
    )
    snapshot = asyncio.run(
        manager.build_request_metadata(conversation_id="conv-runtime-profile")
    )

    middleware = SqlGovernanceMiddleware(manager)
    request = LlmRequest(
        messages=[LlmMessage(role="user", content="show results")],
        tools=[],
        user=_make_user(),
        system_prompt="base prompt",
        metadata={
            "conversation_id": "conv-runtime-profile",
            "request_id": "req-2",
            "runtime_profile": snapshot["runtime_profile"],
        },
    )

    updated = asyncio.run(middleware.before_llm_request(request))
    state = asyncio.run(manager.get_state("conv-runtime-profile"))

    assert state.profile is not None
    assert state.profile.source == "runtime"
    assert state.sql_family == "ranking"
    assert updated.metadata["runtime_profile"]["source"] == "runtime"


def test_sql_governance_hook_writes_runtime_snapshot_to_result_metadata() -> None:
    manager = SqlGovernanceManager()
    hook = SqlGovernanceHook(manager)
    result = ToolResult(
        success=True,
        result_for_llm="ok",
        metadata={
            "tool_name": "run_sql",
            "conversation_id": "conv-4",
            "request_id": "req-1",
            "executed_sql": "SELECT ROW_NUMBER() OVER (ORDER BY id) FROM sales",
            "dialect": "postgres",
        },
    )

    asyncio.run(hook.after_tool(result))

    assert result.metadata["sql_governance"]["last_sql_result_success"] is True
    assert result.metadata["last_sql_shape"]["has_over"] is True
    assert result.metadata["last_sql_summary"]["summary_text"].startswith(
        "run_sql[success]"
    )


class _DummySchemaMemory:
    async def initialize(self) -> None:
        return None


class _RuntimeDummySqlRunner:
    async def run_sql(self, *args, **kwargs):
        return None


def test_evaluation_runtime_does_not_embed_sql_governance_profile_metadata(monkeypatch) -> None:
    class _DummyAgent:
        def __init__(self, **kwargs):
            self.kwargs = kwargs

    import QueryMind.core.evaluation.runtime as runtime_module

    monkeypatch.setattr(runtime_module, "Agent", _DummyAgent)

    runtime = EvaluationRuntime(
        database_id="adventureworks",
        dialect="postgres",
        sql_runner=_RuntimeDummySqlRunner(),
        schema_extractor=None,
        agent_llm_service=SimpleNamespace(model="dummy"),
        schema_memory=_DummySchemaMemory(),
        schema_sync_mode="reuse_existing",
    )
    test_case = SqlTestCase(
        id="sql_test",
        database_id="adventureworks",
        dialect="postgres",
        query="show windowed sales by customer",
        ground_truth_sql="SELECT 1",
        tags=["window", "join"],
        metadata={"category": "window", "source": "manual", "query_language": "en"},
    )

    session = asyncio.run(runtime.create_session(test_case))

    assert "sql_governance_profile" not in session.request_context.metadata
    assert session.request_context.metadata["allow_metadata_query"] is False
    assert "sql_governance_allow_metadata_query" not in session.request_context.metadata


def test_chat_handler_populates_shared_allow_metadata_query_flag(monkeypatch) -> None:
    monkeypatch.setenv("ALLOW_METADATA_QUERY", "true")

    handler = ChatHandler(agent=SimpleNamespace())
    request_context = handler._create_request_context(
        conversation_id="conv-1",
        request_id="req-1",
        metadata={"user": _make_user()},
    )

    assert request_context.metadata["allow_metadata_query"] is True
    assert "sql_governance_allow_metadata_query" not in request_context.metadata


def test_sql_governance_stack_exposes_no_enhancer() -> None:
    stack = build_sql_governance_stack()

    assert not hasattr(stack, "enhancer")


class _RejectingSqlRunner:
    async def run_sql(self, *args, **kwargs):
        raise AssertionError("run_sql should not be called when governance rejects")


def test_rls_registry_rejects_metadata_introspection_via_transform_args() -> None:
    registry = RLSToolRegistry(config_path="missing-rls-config.yaml")
    tool = RunSqlTool(sql_runner=_RejectingSqlRunner())
    user = _make_user()
    context = ToolContext(
        user=user,
        conversation_id="conv-1",
        request_id="req-1",
        agent_memory=NoOpAgentMemory(),
        metadata={
            "evaluation": True,
            "database_id": "adventureworks",
            "dialect": "postgres",
        },
    )

    result = asyncio.run(
        registry.transform_args(
            tool=tool,
            args=RunSqlToolArgs(sql="SELECT * FROM information_schema.tables"),
            user=user,
            context=context,
        )
    )

    assert isinstance(result, ToolRejection)
    assert "Metadata introspection" in result.reason


def test_rls_registry_rejects_semantic_drift_via_transform_args() -> None:
    registry = RLSToolRegistry(config_path="missing-rls-config.yaml")
    tool = RunSqlTool(sql_runner=_RejectingSqlRunner())
    user = _make_user()
    context = ToolContext(
        user=user,
        conversation_id="conv-1",
        request_id="req-1",
        agent_memory=NoOpAgentMemory(),
        raw_user_message="show previous sale by customer",
        metadata={
            "evaluation": True,
            "database_id": "adventureworks",
            "dialect": "postgres",
        },
    )

    result = asyncio.run(
        registry.transform_args(
            tool=tool,
            args=RunSqlToolArgs(sql="SELECT sale_date, LAG(amount) FROM sales"),
            user=user,
            context=context,
        )
    )

    assert isinstance(result, ToolRejection)
    assert "navigation" in result.reason.lower()


def test_rls_registry_rejects_drift_after_sql_skeleton_freeze() -> None:
    policy = SqlGovernancePolicy(
        freeze_trigger_ratio=0.5,
        freeze_min_tool_iterations=2,
        freeze_min_best_sql_support=2,
    )
    manager = SqlGovernanceManager(policy)
    profile = build_sql_governance_profile(
        tags=["join"],
        query="join customers and orders",
        source="case",
    )

    asyncio.run(
        manager.register_request_profile(
            conversation_id="conv-freeze-registry",
            request_id="req-1",
            profile=profile,
        )
    )

    frozen_sql = (
        "SELECT c.customer_id "
        "FROM customers c FULL OUTER JOIN orders o ON c.customer_id = o.customer_id"
    )
    for index in (1, 2):
        asyncio.run(
            manager.observe_sql_result(
                conversation_id="conv-freeze-registry",
                request_id=f"req-{index}",
                result_metadata={
                    "tool_name": "run_sql",
                    "conversation_id": "conv-freeze-registry",
                    "request_id": f"req-{index}",
                    "executed_sql": frozen_sql,
                    "dialect": "postgres",
                    "tool_iterations": index,
                    "max_tool_iterations": 4,
                },
                success=True,
            )
        )

    snapshot = asyncio.run(
        manager.build_request_metadata(conversation_id="conv-freeze-registry")
    )

    registry = RLSToolRegistry(config_path="missing-rls-config.yaml")
    tool = RunSqlTool(sql_runner=_RejectingSqlRunner())
    user = _make_user()
    context = ToolContext(
        user=user,
        conversation_id="conv-freeze-registry",
        request_id="req-3",
        agent_memory=NoOpAgentMemory(),
        raw_user_message="join customers and orders",
        metadata={
            "evaluation": True,
            "database_id": "adventureworks",
            "dialect": "postgres",
            **snapshot,
        },
    )

    result = asyncio.run(
        registry.transform_args(
            tool=tool,
            args=RunSqlToolArgs(
                sql=(
                    "SELECT c.customer_id "
                    "FROM customers c INNER JOIN orders o ON c.customer_id = o.customer_id"
                )
            ),
            user=user,
            context=context,
        )
    )

    assert isinstance(result, ToolRejection)
    assert "frozen" in result.reason.lower()
