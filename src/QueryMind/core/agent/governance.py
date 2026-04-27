from __future__ import annotations
"""
Shared schema-governance helpers for agent and evaluation harnesses.

This module keeps the runtime policy/state separate from the Agent abstract
interfaces so both my_agent and evaluation can reuse the same controls.
"""

import asyncio
import os
from dataclasses import dataclass, field
from typing import Any, Dict, Optional


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


def _normalize_text(value: Optional[str]) -> str:
    return " ".join((value or "").strip().split()).lower()


DEFAULT_SCHEMA_GOVERNANCE_PROMPT = """
## Schema Governance

- schema_locked: false
- Treat `schema_retrieve` as discovery support, not as the final answer.
- Stop exploring schema once the key tables, join path, filters, grouping,
  and ordering are clear enough to draft SQL directly.
- Once you have enough schema context, switch to SQL draft mode: write one
  concrete query and call `run_sql`.
- Avoid repeated schema exploration loops or broad metadata queries that do
  not reduce uncertainty.
"""

DEFAULT_SCHEMA_GOVERNANCE_LOCKED_PROMPT = """
## Schema Governance

- schema_locked: true
- `schema_retrieve` is locked for this turn.
- Enter SQL draft mode now.
- Draft one concrete SQL query from the schema already discovered.
- Call `run_sql` instead of exploring more schema.
"""

DEFAULT_SCHEMA_GOVERNANCE_RECAP = """
## Core Objective Reminder

You already have enough context to move forward. Do not call `schema_retrieve`
again unless a missing table or join path truly blocks the SQL draft.
Your next assistant response should be a concrete SQL draft and a `run_sql`
call. Focus on the minimum necessary tables, joins, filters, grouping, and
ordering, then execute `run_sql`.
"""


@dataclass(slots=True)
class SchemaGovernancePolicy:
    """Policy knobs for schema-retrieval governance."""

    schema_tool_name: str = "schema_retrieve"
    schema_retrieve_max_calls: int = 3
    schema_retrieve_max_failures: int = 2
    schema_retrieve_successes_to_lock: int = 2
    schema_retrieve_same_query_limit: int = 2
    schema_retrieve_no_new_tables_limit: int = 2
    schema_retrieve_empty_results_limit: int = 2
    recap_trigger_ratio: float = 0.7
    recap_min_tool_iterations: int = 4
    system_prompt_block: str = DEFAULT_SCHEMA_GOVERNANCE_PROMPT
    recap_message: str = DEFAULT_SCHEMA_GOVERNANCE_RECAP

    @classmethod
    def from_env(cls, prefix: str = "SCHEMA_GOVERNANCE_") -> "SchemaGovernancePolicy":
        """Build a policy from environment variables."""
        return cls(
            schema_retrieve_max_calls=_safe_int(
                os.getenv(f"{prefix}SCHEMA_RETRIEVE_MAX_CALLS"), 3
            ),
            schema_retrieve_max_failures=_safe_int(
                os.getenv(f"{prefix}SCHEMA_RETRIEVE_MAX_FAILURES"), 2
            ),
            schema_retrieve_successes_to_lock=_safe_int(
                os.getenv(f"{prefix}SCHEMA_RETRIEVE_SUCCESSES_TO_LOCK"), 2
            ),
            schema_retrieve_same_query_limit=_safe_int(
                os.getenv(f"{prefix}SCHEMA_RETRIEVE_SAME_QUERY_LIMIT"), 2
            ),
            schema_retrieve_no_new_tables_limit=_safe_int(
                os.getenv(f"{prefix}SCHEMA_RETRIEVE_NO_NEW_TABLES_LIMIT"), 2
            ),
            schema_retrieve_empty_results_limit=_safe_int(
                os.getenv(f"{prefix}SCHEMA_RETRIEVE_EMPTY_RESULTS_LIMIT"), 2
            ),
            recap_trigger_ratio=_safe_float(
                os.getenv(f"{prefix}RECAP_TRIGGER_RATIO"), 0.7
            ),
            recap_min_tool_iterations=_safe_int(
                os.getenv(f"{prefix}RECAP_MIN_TOOL_ITERATIONS"), 4
            ),
        )


@dataclass(slots=True)
class SchemaGovernanceState:
    """Conversation-scoped state for schema governance."""

    conversation_id: str
    schema_retrieve_calls: int = 0
    schema_retrieve_successes: int = 0
    schema_retrieve_failures: int = 0
    consecutive_same_query_calls: int = 0
    consecutive_no_new_tables: int = 0
    consecutive_empty_results: int = 0
    last_schema_query: Optional[str] = None
    seen_schema_tables: set[str] = field(default_factory=set)
    schema_locked: bool = False
    lock_reason: Optional[str] = None
    last_schema_metadata: Dict[str, Any] = field(default_factory=dict)
    last_schema_summary: Dict[str, Any] = field(default_factory=dict)
    last_recap_request_id: Optional[str] = None


@dataclass(slots=True)
class SchemaGovernanceStack:
    """Convenience wrapper for the hook/middleware/enhancer trio."""

    policy: SchemaGovernancePolicy
    manager: "SchemaGovernanceManager"
    hook: Any
    middleware: Any
    enhancer: Any


class SchemaGovernanceManager:
    """Track per-conversation schema exploration state."""

    def __init__(self, policy: Optional[SchemaGovernancePolicy] = None) -> None:
        self.policy = policy or SchemaGovernancePolicy.from_env()
        self._states: Dict[str, SchemaGovernanceState] = {}
        self._lock = asyncio.Lock()

    async def get_state(self, conversation_id: str) -> SchemaGovernanceState:
        """Return the mutable state for a conversation."""
        if not conversation_id:
            conversation_id = "unknown"

        async with self._lock:
            state = self._states.get(conversation_id)
            if state is None:
                state = SchemaGovernanceState(conversation_id=conversation_id)
                self._states[conversation_id] = state
            return state

    async def observe_schema_result(
        self,
        *,
        conversation_id: str,
        request_id: Optional[str],
        result_metadata: Dict[str, Any],
        success: bool,
    ) -> SchemaGovernanceState:
        """Update state after a schema_retrieve tool execution."""
        result_metadata = dict(result_metadata or {})
        state = await self.get_state(conversation_id)
        async with self._lock:
            current = self._states[state.conversation_id]
            current.last_schema_metadata = dict(result_metadata or {})

            current.schema_retrieve_calls += 1
            raw_selected_tables = result_metadata.get("selected_tables") or []
            selected_tables = []
            seen_local = set()
            for table in raw_selected_tables:
                table_name = str(table).strip()
                if not table_name or table_name in seen_local:
                    continue
                seen_local.add(table_name)
                selected_tables.append(table_name)

            total_results = int(
                result_metadata.get("total_results") or len(selected_tables) or 0
            )
            new_tables = [
                table for table in selected_tables if table not in current.seen_schema_tables
            ]

            if success and selected_tables:
                current.schema_retrieve_successes += 1
            else:
                current.schema_retrieve_failures += 1

            normalized_query = _normalize_text(result_metadata.get("query"))
            if normalized_query:
                if normalized_query == current.last_schema_query:
                    current.consecutive_same_query_calls += 1
                else:
                    current.consecutive_same_query_calls = 1
                    current.last_schema_query = normalized_query

            if total_results <= 0:
                current.consecutive_empty_results += 1
                current.consecutive_no_new_tables += 1
            else:
                current.consecutive_empty_results = 0
                if new_tables:
                    current.consecutive_no_new_tables = 0
                    current.seen_schema_tables.update(selected_tables)
                else:
                    current.consecutive_no_new_tables += 1

            self._update_lock_state(current)
            current.last_schema_summary = self._build_schema_summary(
                current,
                result_metadata=result_metadata,
                selected_tables=selected_tables,
                new_tables=new_tables,
                total_results=total_results,
                success=success,
            )
            return current

    async def should_inject_recap(
        self,
        *,
        conversation_id: str,
        request_id: Optional[str],
        tool_iterations: int,
        max_tool_iterations: int,
    ) -> bool:
        """Return True when the runtime should restate the core objective."""
        if not request_id:
            return False

        state = await self.get_state(conversation_id)
        async with self._lock:
            current = self._states[state.conversation_id]
            if current.last_recap_request_id == request_id:
                return False

            threshold = max(
                self.policy.recap_min_tool_iterations,
                int(max_tool_iterations * self.policy.recap_trigger_ratio),
            )
            schema_call_threshold = max(
                2,
                min(self.policy.schema_retrieve_max_calls, 3),
            )
            should_recap = (
                current.schema_locked
                or current.schema_retrieve_calls >= schema_call_threshold
                or tool_iterations >= threshold
            )
            if should_recap:
                current.last_recap_request_id = request_id
                return True
            return False

    async def should_hide_schema_tool(
        self,
        *,
        conversation_id: str,
    ) -> tuple[bool, Optional[str]]:
        """Return whether schema_retrieve should be removed from the tool list."""
        state = await self.get_state(conversation_id)
        async with self._lock:
            current = self._states[state.conversation_id]
            if current.schema_locked:
                return True, current.lock_reason
            return False, None

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
                current.schema_retrieve_calls == 0
                and not current.last_schema_summary
            ):
                return {}

            snapshot = {
                "schema_governance": {
                    "conversation_id": current.conversation_id,
                    "schema_retrieve_calls": current.schema_retrieve_calls,
                    "schema_retrieve_successes": current.schema_retrieve_successes,
                    "schema_retrieve_failures": current.schema_retrieve_failures,
                    "consecutive_same_query_calls": current.consecutive_same_query_calls,
                    "consecutive_no_new_tables": current.consecutive_no_new_tables,
                    "consecutive_empty_results": current.consecutive_empty_results,
                    "schema_locked": current.schema_locked,
                    "lock_reason": current.lock_reason,
                    "last_schema_query": current.last_schema_query,
                },
                "last_schema_summary": dict(current.last_schema_summary),
            }
            return snapshot

    async def build_prompt_block(self, *, conversation_id: str) -> str:
        """Render the governance prompt block for the current conversation."""
        state = await self.get_state(conversation_id)
        async with self._lock:
            current = self._states[state.conversation_id]
            lines = [
                (
                    DEFAULT_SCHEMA_GOVERNANCE_LOCKED_PROMPT
                    if current.schema_locked
                    else self.policy.system_prompt_block
                ).strip()
            ]

            summary_text = str(
                (current.last_schema_summary or {}).get("summary_text") or ""
            ).strip()
            if summary_text:
                lines.extend(["", "Latest schema snapshot:", f"- {summary_text}"])
            elif current.schema_locked and current.lock_reason:
                lines.extend(["", f"Lock reason: {current.lock_reason}"])

            return "\n".join(line for line in lines if line).strip()

    def _build_schema_summary(
        self,
        state: SchemaGovernanceState,
        *,
        result_metadata: Dict[str, Any],
        selected_tables: list[str],
        new_tables: list[str],
        total_results: int,
        success: bool,
    ) -> Dict[str, Any]:
        """Build a compact summary of the latest schema retrieval result."""
        query = str(result_metadata.get("query") or "")
        search_mode = str(result_metadata.get("search_mode") or "unknown")
        graph_hint = str(result_metadata.get("graph_hint") or "none")
        selected_table_refs = list(result_metadata.get("selected_table_refs") or [])
        lock_reason = state.lock_reason

        if selected_tables:
            preview_tables = selected_tables[:4]
            preview = ", ".join(preview_tables)
            if len(selected_tables) > len(preview_tables):
                preview = f"{preview}, ... (+{len(selected_tables) - len(preview_tables)})"
            summary_text = (
                f"schema_retrieve[{search_mode}] query='{query}' -> "
                f"{len(selected_tables)} table(s): {preview}"
            )
            if new_tables:
                summary_text += f" | new={len(new_tables)}"
            else:
                summary_text += " | new=0"
        else:
            summary_text = (
                f"schema_retrieve[{search_mode}] query='{query}' -> 0 table(s)"
            )

        if lock_reason:
            summary_text += f" | lock={lock_reason}"

        return {
            "tool_name": self.policy.schema_tool_name,
            "query": query,
            "search_mode": search_mode,
            "graph_hint": graph_hint,
            "success": success,
            "total_results": total_results,
            "selected_tables": selected_tables,
            "new_tables": new_tables,
            "selected_table_refs": selected_table_refs,
            "schema_retrieve_calls": state.schema_retrieve_calls,
            "schema_retrieve_successes": state.schema_retrieve_successes,
            "schema_retrieve_failures": state.schema_retrieve_failures,
            "consecutive_same_query_calls": state.consecutive_same_query_calls,
            "consecutive_no_new_tables": state.consecutive_no_new_tables,
            "consecutive_empty_results": state.consecutive_empty_results,
            "schema_locked": state.schema_locked,
            "lock_reason": lock_reason,
            "summary_text": summary_text,
        }

    def _update_lock_state(self, state: SchemaGovernanceState) -> None:
        """Apply the policy's lock heuristics to a mutable state object."""
        if state.schema_locked:
            return

        if state.schema_retrieve_successes >= self.policy.schema_retrieve_successes_to_lock:
            state.schema_locked = True
            state.lock_reason = "enough_schema"
            return

        if (
            state.consecutive_empty_results
            >= self.policy.schema_retrieve_empty_results_limit
        ):
            state.schema_locked = True
            state.lock_reason = "schema_retrieve_empty_results"
            return

        if (
            state.consecutive_no_new_tables
            >= self.policy.schema_retrieve_no_new_tables_limit
        ):
            state.schema_locked = True
            state.lock_reason = "schema_retrieve_no_new_tables"
            return

        if state.schema_retrieve_calls >= self.policy.schema_retrieve_max_calls:
            state.schema_locked = True
            state.lock_reason = "schema_retrieve_budget"
            return

        if state.schema_retrieve_failures >= self.policy.schema_retrieve_max_failures:
            state.schema_locked = True
            state.lock_reason = "schema_retrieve_failures"
            return

        if (
            state.consecutive_same_query_calls
            >= self.policy.schema_retrieve_same_query_limit
        ):
            state.schema_locked = True
            state.lock_reason = "repeated_schema_query"


def build_schema_governance_stack(
    policy: Optional[SchemaGovernancePolicy] = None,
) -> SchemaGovernanceStack:
    """Create a reusable governance hook/middleware/enhancer bundle."""
    from ..enhancer.schema_governance import SchemaGovernanceEnhancer
    from ..hook.schema_governance import SchemaGovernanceHook
    from ..middleware.schema_governance import SchemaGovernanceMiddleware

    effective_policy = policy or SchemaGovernancePolicy.from_env()
    manager = SchemaGovernanceManager(effective_policy)
    return SchemaGovernanceStack(
        policy=effective_policy,
        manager=manager,
        hook=SchemaGovernanceHook(manager),
        middleware=SchemaGovernanceMiddleware(manager),
        enhancer=SchemaGovernanceEnhancer(manager),
    )
