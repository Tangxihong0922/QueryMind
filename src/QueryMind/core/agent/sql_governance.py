from __future__ import annotations
"""
Shared SQL-governance state machine and compatibility facade.

The pure shape/profile/rejection logic and prompt rendering live in helper
modules so this module can focus on state tracking, freeze decisions, and
request metadata assembly.
"""

import asyncio
import logging
import os
from dataclasses import dataclass, field
from typing import Any, Dict, Iterable, List, Optional, Sequence

from .sql_governance_prompt import (
    DEFAULT_SQL_GOVERNANCE_PROMPT,
    DEFAULT_SQL_GOVERNANCE_RECAP,
    build_sql_governance_prompt_block,
    build_sql_governance_recap_block,
)
from .sql_governance_shape import (
    SqlGovernanceProfile,
    _collapse_sql,
    _dedupe_preserve_order,
    _normalize_text,
    _profile_category_hints,
    _profile_gap_categories,
    _resolve_sql_family_state,
    _safe_bool,
    _safe_float,
    _safe_int,
    _shape_family_signature,
    _shape_signature_from_features,
    analyze_sql_shape,
    analyze_sql_text,
    build_sql_governance_profile,
    infer_profile_from_message,
    parse_sql_governance_profile,
    sql_governance_rejection_reason,
    sql_semantics_rejection_reason,
    sql_skeleton_freeze_rejection_reason,
)

logger = logging.getLogger(__name__)

@dataclass(slots=True)
class SqlGovernancePolicy:
    """Policy knobs for SQL strategy governance."""

    max_query_length: int = 10000
    max_subqueries: int = 5
    max_cte_depth: int = 3
    max_joins: int = 15
    recap_trigger_ratio: float = 0.7
    recap_min_tool_iterations: int = 4
    freeze_trigger_ratio: float = 0.65
    freeze_min_tool_iterations: int = 8
    freeze_min_best_sql_support: int = 2
    system_prompt_block: str = DEFAULT_SQL_GOVERNANCE_PROMPT
    recap_message: str = DEFAULT_SQL_GOVERNANCE_RECAP

    @classmethod
    def from_env(cls, prefix: str = "SQL_GOVERNANCE_") -> "SqlGovernancePolicy":
        """Build a policy from environment variables."""
        return cls(
            max_query_length=_safe_int(os.getenv(f"{prefix}MAX_QUERY_LENGTH"), 10000),
            max_subqueries=_safe_int(os.getenv(f"{prefix}MAX_SUBQUERIES"), 5),
            max_cte_depth=_safe_int(os.getenv(f"{prefix}MAX_CTE_DEPTH"), 3),
            max_joins=_safe_int(os.getenv(f"{prefix}MAX_JOINS"), 15),
            recap_trigger_ratio=_safe_float(
                os.getenv(f"{prefix}RECAP_TRIGGER_RATIO"), 0.7
            ),
            recap_min_tool_iterations=_safe_int(
                os.getenv(f"{prefix}RECAP_MIN_TOOL_ITERATIONS"), 4
            ),
            freeze_trigger_ratio=_safe_float(
                os.getenv(f"{prefix}FREEZE_TRIGGER_RATIO"), 0.65
            ),
            freeze_min_tool_iterations=_safe_int(
                os.getenv(f"{prefix}FREEZE_MIN_TOOL_ITERATIONS"), 8
            ),
            freeze_min_best_sql_support=_safe_int(
                os.getenv(f"{prefix}FREEZE_MIN_BEST_SQL_SUPPORT"), 2
            ),
        )


@dataclass(slots=True)
class SqlGovernanceState:
    """Conversation-scoped SQL governance state."""

    conversation_id: str
    profile: Optional[SqlGovernanceProfile] = None
    profile_signature: Optional[str] = None
    last_user_message: Optional[str] = None
    last_request_id: Optional[str] = None
    last_recap_request_id: Optional[str] = None
    sql_attempts: int = 0
    sql_successes: int = 0
    sql_failures: int = 0
    metadata_query_failures: int = 0
    last_sql_result_success: Optional[bool] = None
    last_sql_result_has_metadata_query: bool = False
    last_sql_text: Optional[str] = None
    last_sql_signature: Optional[str] = None
    last_sql_core_signature: Optional[str] = None
    last_sql_canonical_signature: Optional[str] = None
    last_success_sql_canonical_signature: Optional[str] = None
    last_sql_features: Dict[str, Any] = field(default_factory=dict)
    last_gap_categories: List[str] = field(default_factory=list)
    last_tool_iterations: Optional[int] = None
    last_max_tool_iterations: Optional[int] = None
    last_result_metadata: Dict[str, Any] = field(default_factory=dict)
    last_rejection_reason: Optional[str] = None
    last_rejection_reason_count: int = 0
    same_success_sql_canonical_streak: int = 0
    turn_local_repair_mode: bool = False
    sql_family: Optional[str] = None
    sql_family_candidates: List[str] = field(default_factory=list)
    row_grain_state: Dict[str, Any] = field(default_factory=dict)
    best_sql_text: Optional[str] = None
    best_sql_shape: Dict[str, Any] = field(default_factory=dict)
    best_sql_signature: Optional[str] = None
    best_sql_core_signature: Optional[str] = None
    best_sql_canonical_signature: Optional[str] = None
    best_sql_gap_categories: List[str] = field(default_factory=list)
    best_sql_support_count: int = 0
    sql_exploration_frozen: bool = False
    frozen_sql_text: Optional[str] = None
    frozen_sql_shape: Dict[str, Any] = field(default_factory=dict)
    frozen_sql_signature: Optional[str] = None
    frozen_sql_core_signature: Optional[str] = None
    frozen_sql_canonical_signature: Optional[str] = None
    freeze_reason: Optional[str] = None
    freeze_trigger_tool_iterations: Optional[int] = None
    freeze_trigger_max_tool_iterations: Optional[int] = None
    last_freeze_evaluation: Dict[str, Any] = field(default_factory=dict)


def _profile_has_signal(profile: Optional[SqlGovernanceProfile]) -> bool:
    if profile is None:
        return False
    return bool(profile.categories or profile.notes or profile.allow_metadata_query)


def _sql_rejection_reason_text(result_metadata: Dict[str, Any]) -> str:
    for key in ("error", "reason", "result_for_llm", "content"):
        value = result_metadata.get(key)
        if isinstance(value, str) and value.strip():
            return _normalize_text(value)
    return ""


def _sql_turn_local_repair_mode(state: "SqlGovernanceState", *, policy: Optional["SqlGovernancePolicy"] = None) -> bool:
    anchor_tier = _sql_anchor_tier_from_state(state, policy=policy)
    if anchor_tier not in {"candidate", "validated"}:
        return False
    if state.sql_exploration_frozen:
        return False

    row_grain_status = str(state.row_grain_state.get("status") or "").strip().lower()
    if row_grain_status != "aligned":
        return False

    if state.same_success_sql_canonical_streak >= 2:
        return True
    if state.last_rejection_reason_count >= 2:
        return True
    return False


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
    notes = []
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
    state: "SqlGovernanceState",
    *,
    policy: Optional["SqlGovernancePolicy"] = None,
) -> Dict[str, Any]:
    anchor_tier = _sql_anchor_tier_from_state(state, policy=policy)
    anchor_text = state.frozen_sql_text or state.best_sql_text
    anchor_shape = dict(state.frozen_sql_shape or state.best_sql_shape)
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
        "row_grain_state": dict(state.row_grain_state),
        "freeze_reason": state.freeze_reason,
        "best_sql_preview": anchor_preview,
    }


def _sql_anchor_tier_from_state(
    state: "SqlGovernanceState",
    *,
    policy: Optional["SqlGovernancePolicy"] = None,
) -> Optional[str]:
    if state.sql_exploration_frozen and state.frozen_sql_text and state.frozen_sql_shape:
        if not _is_metadata_shape(state.frozen_sql_shape):
            return "frozen"

    if not state.best_sql_text or not state.best_sql_shape:
        return None
    if _is_metadata_shape(state.best_sql_shape):
        return None

    effective_policy = policy or SqlGovernancePolicy.from_env()
    min_support = max(2, effective_policy.freeze_min_best_sql_support)
    row_grain_status = str(state.row_grain_state.get("status") or "").strip().lower()

    if (
        state.best_sql_support_count >= min_support
        and row_grain_status == "aligned"
        and not state.best_sql_gap_categories
    ):
        return "validated"

    return "candidate"


def _sql_anchor_preview_from_state(state: "SqlGovernanceState") -> str:
    anchor_text = state.frozen_sql_text or state.best_sql_text
    if not anchor_text:
        return ""
    preview = _collapse_sql(anchor_text)
    if len(preview) > 160:
        preview = f"{preview[:157]}..."
    return preview


def _sql_anchor_family_from_state(state: "SqlGovernanceState") -> Optional[str]:
    anchor_shape = state.frozen_sql_shape or state.best_sql_shape
    if isinstance(anchor_shape, dict) and anchor_shape:
        family = _shape_family_signature(anchor_shape)
        if family:
            return family
    if state.sql_exploration_frozen and state.sql_family:
        return state.sql_family
    return state.sql_family


def _sql_should_emit_recap(
    state: "SqlGovernanceState",
    *,
    policy: Optional["SqlGovernancePolicy"] = None,
) -> bool:
    anchor_tier = _sql_anchor_tier_from_state(state, policy=policy)
    if state.sql_exploration_frozen:
        return False

    row_grain_status = str(state.row_grain_state.get("status") or "").strip().lower()
    anchor_family = str(_sql_anchor_family_from_state(state) or "").strip().lower()
    current_family = str(state.sql_family or "").strip().lower()
    has_drift = (
        state.last_sql_result_success is False
        or state.last_sql_result_has_metadata_query
        or row_grain_status == "mismatch"
        or bool(state.last_gap_categories)
        or (anchor_family and current_family and anchor_family != current_family)
    )

    if anchor_tier in {"candidate", "validated"}:
        if has_drift or state.turn_local_repair_mode:
            return True
        return False

    if state.last_rejection_reason_count >= 2:
        return True

    return False


@dataclass(slots=True)
class SqlGovernanceStack:
    """Convenience wrapper for the hook/middleware bundle."""

    policy: SqlGovernancePolicy
    manager: "SqlGovernanceManager"
    hook: Any
    middleware: Any


class SqlGovernanceManager:
    """Track SQL strategy state for one or more conversations."""

    def __init__(self, policy: Optional[SqlGovernancePolicy] = None) -> None:
        self.policy = policy or SqlGovernancePolicy.from_env()
        self._states: Dict[str, SqlGovernanceState] = {}
        self._lock = asyncio.Lock()

    async def get_state(self, conversation_id: str) -> SqlGovernanceState:
        if not conversation_id:
            conversation_id = "unknown"

        async with self._lock:
            state = self._states.get(conversation_id)
            if state is None:
                state = SqlGovernanceState(conversation_id=conversation_id)
                self._states[conversation_id] = state
            return state

    async def register_request_profile(
        self,
        *,
        conversation_id: str,
        request_id: Optional[str],
        profile: Optional[SqlGovernanceProfile],
        user_message: Optional[str] = None,
    ) -> SqlGovernanceState:
        state = await self.get_state(conversation_id)
        async with self._lock:
            current = self._states[state.conversation_id]
            current.last_request_id = request_id
            profile = profile if _profile_has_signal(profile) else None
            current.profile = profile
            current.profile_signature = profile.signature() if profile else None
            if user_message is not None:
                current.last_user_message = user_message

            strategy_snapshot = _resolve_sql_family_state(
                profile=current.profile,
                features=current.last_sql_features,
                last_gap_categories=current.last_gap_categories,
                user_message=current.last_user_message,
                current_family=current.sql_family,
            )
            current.sql_family = strategy_snapshot["sql_family"]
            current.sql_family_candidates = list(
                strategy_snapshot["sql_family_candidates"]
            )
            current.row_grain_state = dict(strategy_snapshot["row_grain_state"])
            return current

    async def observe_sql_result(
        self,
        *,
        conversation_id: str,
        request_id: Optional[str],
        result_metadata: Dict[str, Any],
        success: bool,
    ) -> SqlGovernanceState:
        state = await self.get_state(conversation_id)
        async with self._lock:
            current = self._states[state.conversation_id]
            current.last_result_metadata = dict(result_metadata or {})
            current.last_sql_result_success = success
            current.sql_attempts += 1
            if success:
                current.sql_successes += 1
            else:
                current.sql_failures += 1

            sql_text = (
                current.last_result_metadata.get("executed_sql")
                or current.last_result_metadata.get("sql")
                or current.last_sql_text
            )
            current.last_tool_iterations = _safe_int(
                current.last_result_metadata.get("tool_iterations"), 0
            )
            current.last_max_tool_iterations = _safe_int(
                current.last_result_metadata.get("max_tool_iterations"), 0
            )
            if isinstance(sql_text, str) and sql_text.strip():
                current.last_sql_text = sql_text.strip()
                sql_dialect = current.last_result_metadata.get("dialect")
                if sql_dialect is not None:
                    sql_dialect = str(sql_dialect).strip() or None
                current.last_sql_features = analyze_sql_text(
                    current.last_sql_text,
                    dialect=sql_dialect,
                )
                current.last_sql_signature = _shape_signature_from_features(
                    current.last_sql_features,
                    core=False,
                )
                current.last_sql_core_signature = _shape_signature_from_features(
                    current.last_sql_features,
                    core=True,
                )
                current.last_sql_canonical_signature = _shape_signature_from_features(
                    current.last_sql_features,
                    core=True,
                    canonical=True,
                )
                current.last_sql_result_has_metadata_query = bool(
                    current.last_sql_features.get("metadata_query")
                )
                if current.last_sql_result_has_metadata_query:
                    current.metadata_query_failures += 1
                current.last_gap_categories = _profile_gap_categories(
                    current.profile,
                    current.last_sql_features,
                )
            else:
                current.last_sql_result_has_metadata_query = False
                current.last_gap_categories = []
                current.last_sql_signature = None
                current.last_sql_core_signature = None
                current.last_sql_canonical_signature = None

            rejection_reason = _sql_rejection_reason_text(current.last_result_metadata)
            if success:
                if (
                    current.last_sql_canonical_signature
                    and not current.last_sql_result_has_metadata_query
                ):
                    if (
                        current.last_success_sql_canonical_signature
                        == current.last_sql_canonical_signature
                    ):
                        current.same_success_sql_canonical_streak = max(
                            1, current.same_success_sql_canonical_streak + 1
                        )
                    else:
                        current.same_success_sql_canonical_streak = 1
                    current.last_success_sql_canonical_signature = (
                        current.last_sql_canonical_signature
                    )
                else:
                    current.same_success_sql_canonical_streak = 0
                    current.last_success_sql_canonical_signature = None
                current.last_rejection_reason = None
                current.last_rejection_reason_count = 0
            else:
                if rejection_reason:
                    if rejection_reason == current.last_rejection_reason:
                        current.last_rejection_reason_count += 1
                    else:
                        current.last_rejection_reason = rejection_reason
                        current.last_rejection_reason_count = 1
                else:
                    current.last_rejection_reason = None
                    current.last_rejection_reason_count = 0

            strategy_snapshot = _resolve_sql_family_state(
                profile=current.profile,
                features=current.last_sql_features,
                last_gap_categories=current.last_gap_categories,
                user_message=current.last_user_message,
                current_family=current.sql_family,
            )
            current.sql_family = strategy_snapshot["sql_family"]
            current.sql_family_candidates = list(
                strategy_snapshot["sql_family_candidates"]
            )
            current.row_grain_state = dict(strategy_snapshot["row_grain_state"])

            if (
                success
                and current.last_sql_text
                and current.last_sql_core_signature
                and not current.last_sql_result_has_metadata_query
                and not current.sql_exploration_frozen
            ):
                current_gap_count = len(current.last_gap_categories)
                best_gap_count = len(current.best_sql_gap_categories)
                current_core_signature = current.last_sql_core_signature
                current_canonical_signature = (
                    current.last_sql_canonical_signature or current_core_signature
                )
                current_full_signature = current.last_sql_signature

                if not current.best_sql_canonical_signature:
                    current.best_sql_text = current.last_sql_text
                    current.best_sql_shape = dict(current.last_sql_features)
                    current.best_sql_signature = current_full_signature
                    current.best_sql_core_signature = current_core_signature
                    current.best_sql_canonical_signature = current_canonical_signature
                    current.best_sql_gap_categories = list(current.last_gap_categories)
                    current.best_sql_support_count = 1
                elif (
                    current_canonical_signature
                    == current.best_sql_canonical_signature
                    and current_gap_count <= best_gap_count
                ):
                    current.best_sql_text = current.last_sql_text
                    current.best_sql_shape = dict(current.last_sql_features)
                    current.best_sql_signature = current_full_signature
                    current.best_sql_core_signature = current_core_signature
                    current.best_sql_canonical_signature = current_canonical_signature
                    current.best_sql_gap_categories = list(current.last_gap_categories)
                    current.best_sql_support_count += 1
                elif current_gap_count < best_gap_count:
                    current.best_sql_text = current.last_sql_text
                    current.best_sql_shape = dict(current.last_sql_features)
                    current.best_sql_signature = current_full_signature
                    current.best_sql_core_signature = current_core_signature
                    current.best_sql_canonical_signature = current_canonical_signature
                    current.best_sql_gap_categories = list(current.last_gap_categories)
                    current.best_sql_support_count = 1

            current.turn_local_repair_mode = _sql_turn_local_repair_mode(
                current,
                policy=self.policy,
            )

            freeze_threshold = max(
                self.policy.freeze_min_tool_iterations,
                int(current.last_max_tool_iterations * self.policy.freeze_trigger_ratio)
                if current.last_max_tool_iterations and current.last_max_tool_iterations > 0
                else self.policy.freeze_min_tool_iterations,
            )
            freeze_reason_detail: Optional[str] = None
            should_freeze = False
            anchor_tier = _sql_anchor_tier_from_state(current, policy=self.policy)
            profile_state = (
                "present" if _profile_has_signal(current.profile) else "missing"
            )
            if current.sql_exploration_frozen:
                freeze_reason_detail = "already_frozen"
            elif current.best_sql_canonical_signature is None:
                freeze_reason_detail = "no_valid_skeleton"
            elif anchor_tier != "validated":
                freeze_reason_detail = f"anchor_not_validated:{anchor_tier or 'missing'}"
            elif current.last_tool_iterations is None:
                freeze_reason_detail = "missing_tool_iterations"
            elif current.last_tool_iterations < freeze_threshold:
                freeze_reason_detail = (
                    f"below_threshold:{current.last_tool_iterations}/{freeze_threshold}"
                )
            else:
                should_freeze = True
                freeze_reason_detail = "freeze"

            current.last_freeze_evaluation = {
                "decision": "frozen" if should_freeze else "not_frozen",
                "reason": freeze_reason_detail,
                "profile_state": profile_state,
                "tool_iterations": current.last_tool_iterations,
                "max_tool_iterations": current.last_max_tool_iterations,
                "threshold": freeze_threshold,
                "anchor_tier": anchor_tier,
                "best_sql_support_count": current.best_sql_support_count,
                "best_sql_gap_categories": list(current.best_sql_gap_categories),
                "best_sql_core_signature": current.best_sql_core_signature,
                "best_sql_canonical_signature": current.best_sql_canonical_signature,
                "current_sql_core_signature": current.last_sql_core_signature,
                "current_sql_canonical_signature": current.last_sql_canonical_signature,
                "same_success_sql_canonical_streak": current.same_success_sql_canonical_streak,
                "last_rejection_reason": current.last_rejection_reason,
                "last_rejection_reason_count": current.last_rejection_reason_count,
                "turn_local_repair_mode": current.turn_local_repair_mode,
            }

            if current.last_tool_iterations is not None and current.last_tool_iterations >= freeze_threshold:
                logger.info(
                    "SQL freeze evaluation: conversation_id=%s decision=%s reason=%s "
                    "tool_iterations=%s threshold=%s best_support=%s best_gap_count=%s "
                    "anchor_tier=%s best_canonical=%s current_canonical=%s",
                    current.conversation_id,
                    current.last_freeze_evaluation["decision"],
                    current.last_freeze_evaluation["reason"],
                    current.last_tool_iterations,
                    freeze_threshold,
                    current.best_sql_support_count,
                    len(current.best_sql_gap_categories),
                    anchor_tier,
                    current.best_sql_canonical_signature,
                    current.last_sql_canonical_signature,
                )

            should_freeze = (
                should_freeze
                and not current.sql_exploration_frozen
            )
            if should_freeze:
                current.sql_exploration_frozen = True
                current.frozen_sql_text = current.best_sql_text
                current.frozen_sql_shape = dict(current.best_sql_shape)
                current.frozen_sql_signature = current.best_sql_signature
                current.frozen_sql_core_signature = current.best_sql_core_signature
                current.frozen_sql_canonical_signature = (
                    current.best_sql_canonical_signature
                )
                current.freeze_reason = (
                    "Validated SQL skeleton frozen at "
                    f"{current.last_tool_iterations}/{current.last_max_tool_iterations or 'unknown'} "
                    "tool iterations"
                )
                current.freeze_trigger_tool_iterations = current.last_tool_iterations
                current.freeze_trigger_max_tool_iterations = current.last_max_tool_iterations
                logger.info(
                    "SQL skeleton frozen: conversation_id=%s tool_iterations=%s "
                    "threshold=%s support=%s freeze_reason=%s canonical_signature=%s",
                    current.conversation_id,
                    current.last_tool_iterations,
                    freeze_threshold,
                    current.best_sql_support_count,
                    current.freeze_reason,
                    current.frozen_sql_canonical_signature,
                )

            current.last_request_id = request_id or current.last_request_id
            return current

    async def build_request_metadata(
        self,
        *,
        conversation_id: str,
    ) -> Dict[str, Any]:
        """Return a compact snapshot suitable for request.metadata."""
        state = await self.get_state(conversation_id)
        async with self._lock:
            current = self._states[state.conversation_id]
            if (
                current.sql_attempts == 0
                and current.last_sql_text is None
                and not current.last_gap_categories
                and not current.sql_family
                and not current.row_grain_state
                and not current.best_sql_text
                and not current.frozen_sql_text
            ):
                return {}

            last_sql_shape = dict(current.last_sql_features)
            runtime_profile = _build_runtime_profile_snapshot(current)
            feature_names = _dedupe_preserve_order(
                current.last_sql_features.get("feature_names") or []
            )
            summary_text = ""
            if current.last_sql_text:
                sql_preview = current.last_sql_text.strip()
                if len(sql_preview) > 180:
                    sql_preview = f"{sql_preview[:177]}..."
                outcome = "success" if current.last_sql_result_success else "failure"
                feature_preview = ", ".join(feature_names[:4]) if feature_names else ""
                if feature_preview:
                    summary_text = (
                        f"run_sql[{outcome}] features={feature_preview} sql='{sql_preview}'"
                    )
                else:
                    summary_text = f"run_sql[{outcome}] sql='{sql_preview}'"

            return {
                "sql_governance": {
                    "conversation_id": current.conversation_id,
                    "sql_attempts": current.sql_attempts,
                    "sql_successes": current.sql_successes,
                    "sql_failures": current.sql_failures,
                    "metadata_query_failures": current.metadata_query_failures,
                    "last_sql_result_success": current.last_sql_result_success,
                    "last_sql_result_has_metadata_query": current.last_sql_result_has_metadata_query,
                    "last_sql_text": current.last_sql_text,
                    "last_sql_signature": current.last_sql_signature,
                    "last_sql_core_signature": current.last_sql_core_signature,
                    "last_sql_canonical_signature": current.last_sql_canonical_signature,
                    "last_success_sql_canonical_signature": current.last_success_sql_canonical_signature,
                    "last_sql_shape": last_sql_shape,
                    "last_gap_categories": list(current.last_gap_categories),
                    "last_tool_iterations": current.last_tool_iterations,
                    "last_max_tool_iterations": current.last_max_tool_iterations,
                    "same_success_sql_canonical_streak": current.same_success_sql_canonical_streak,
                    "last_rejection_reason": current.last_rejection_reason,
                    "last_rejection_reason_count": current.last_rejection_reason_count,
                    "turn_local_repair_mode": current.turn_local_repair_mode,
                    "sql_family": current.sql_family,
                    "sql_family_candidates": list(current.sql_family_candidates),
                    "row_grain_state": dict(current.row_grain_state),
                    "best_sql_text": current.best_sql_text,
                    "best_sql_shape": dict(current.best_sql_shape),
                    "best_sql_signature": current.best_sql_signature,
                    "best_sql_core_signature": current.best_sql_core_signature,
                    "best_sql_canonical_signature": current.best_sql_canonical_signature,
                    "best_sql_gap_categories": list(current.best_sql_gap_categories),
                    "best_sql_support_count": current.best_sql_support_count,
                    "sql_exploration_frozen": current.sql_exploration_frozen,
                    "frozen_sql_text": current.frozen_sql_text,
                    "frozen_sql_shape": dict(current.frozen_sql_shape),
                    "frozen_sql_signature": current.frozen_sql_signature,
                    "frozen_sql_core_signature": current.frozen_sql_core_signature,
                    "frozen_sql_canonical_signature": current.frozen_sql_canonical_signature,
                    "freeze_reason": current.freeze_reason,
                    "freeze_trigger_tool_iterations": current.freeze_trigger_tool_iterations,
                    "freeze_trigger_max_tool_iterations": current.freeze_trigger_max_tool_iterations,
                    "last_freeze_evaluation": dict(current.last_freeze_evaluation),
                },
                "runtime_profile": runtime_profile,
                "last_sql_summary": {
                    "summary_text": summary_text,
                    "sql_text": current.last_sql_text,
                    "feature_names": feature_names,
                    "gap_categories": list(current.last_gap_categories),
                    "success": current.last_sql_result_success,
                    "sql_family": current.sql_family,
                    "row_grain_state": dict(current.row_grain_state),
                },
                "last_sql_shape": last_sql_shape,
                "sql_family": current.sql_family,
                "sql_family_candidates": list(current.sql_family_candidates),
                "row_grain_state": dict(current.row_grain_state),
            }

    async def should_inject_recap(
        self,
        *,
        conversation_id: str,
        request_id: Optional[str],
    ) -> bool:
        state = await self.get_state(conversation_id)
        async with self._lock:
            current = self._states[state.conversation_id]
            if current.last_recap_request_id == request_id:
                return False
            should_recap = _sql_should_emit_recap(
                current,
                policy=self.policy,
            )
            if should_recap:
                current.last_recap_request_id = request_id
                return True
            return False

    async def build_prompt_block(
        self,
        *,
        conversation_id: str,
        request_id: Optional[str],
        fallback_profile: Optional[SqlGovernanceProfile] = None,
    ) -> str:
        state = await self.get_state(conversation_id)
        async with self._lock:
            current = self._states[state.conversation_id]
            return build_sql_governance_prompt_block(
                sql_exploration_frozen=current.sql_exploration_frozen,
                freeze_reason=current.freeze_reason,
                frozen_sql_signature=current.frozen_sql_signature,
                best_sql_text=current.best_sql_text,
                frozen_sql_text=current.frozen_sql_text,
                anchor_tier=_sql_anchor_tier_from_state(current, policy=self.policy),
                sql_family=_sql_anchor_family_from_state(current),
                turn_local_repair_mode=current.turn_local_repair_mode,
            )

    async def build_recap_block(
        self,
        *,
        conversation_id: str,
        fallback_profile: Optional[SqlGovernanceProfile] = None,
    ) -> str:
        state = await self.get_state(conversation_id)
        async with self._lock:
            current = self._states[state.conversation_id]
            if not _sql_should_emit_recap(current, policy=self.policy):
                return ""
            return build_sql_governance_recap_block(
                None,
                current.last_gap_categories,
                sql_family=_sql_anchor_family_from_state(current),
                row_grain_state=current.row_grain_state,
                last_sql_shape=current.last_sql_features,
                last_sql_text=current.last_sql_text,
                turn_local_repair_mode=current.turn_local_repair_mode,
                rejection_reason_streak=current.last_rejection_reason_count,
                )


def build_sql_governance_stack(
    policy: Optional[SqlGovernancePolicy] = None,
) -> SqlGovernanceStack:
    """Create the reusable SQL governance bundle.

    The hook enforces SQL policies at tool-execution time. The middleware
    tracks governance state and injects a short reactive SQL recap only after a
    failed attempt, a visible shape gap, or a long tool loop.
    """
    from ..hook.sql_governance import SqlGovernanceHook
    from ..middleware.sql_governance import SqlGovernanceMiddleware

    effective_policy = policy or SqlGovernancePolicy.from_env()
    manager = SqlGovernanceManager(effective_policy)
    return SqlGovernanceStack(
        policy=effective_policy,
        manager=manager,
        hook=SqlGovernanceHook(manager),
        middleware=SqlGovernanceMiddleware(manager),
    )
