"""Execution runner for QueryMind evaluation."""

from __future__ import annotations

import asyncio
import inspect
import logging
import time
from typing import Any, Callable, List, Optional

from QueryMind.core.components import UiComponent

from .base import AgentResult, EvaluationResult, Evaluator, SqlTestCase, ToolInvocationRecord
from .dataset import EvaluationDataset
from .report import EvaluationReport
from .runtime import EvaluationRuntimeResolver

logger = logging.getLogger(__name__)


class EvaluationRunner:
    """Run SQL evaluation test cases against QueryMind agents."""

    def __init__(
        self,
        evaluators: List[Evaluator],
        runtime_resolver: EvaluationRuntimeResolver,
        max_concurrency: int = 4,
        observability_provider: Any = None,
        progress_callback: Any = None,
        result_callback: Optional[Callable[[EvaluationResult], Any]] = None,
        skip_test_case_ids: Optional[set[str]] = None,
        progress_initial_completed: int = 0,
    ) -> None:
        self.evaluators = evaluators
        self.runtime_resolver = runtime_resolver
        self.max_concurrency = max_concurrency
        self.observability_provider = observability_provider
        self.progress_callback = progress_callback
        self.result_callback = result_callback
        self.skip_test_case_ids = skip_test_case_ids or set()
        self.progress_initial_completed = progress_initial_completed
        self._semaphore = asyncio.Semaphore(max_concurrency)

    async def run_evaluation(self, dataset: EvaluationDataset) -> EvaluationReport:
        runtimes = {}
        for test_case in dataset.test_cases:
            runtime = await self.runtime_resolver.resolve(test_case)
            runtimes[runtime.database_id] = runtime

        await asyncio.gather(*(runtime.ensure_initialized() for runtime in runtimes.values()))

        if self.progress_callback and hasattr(self.progress_callback, "set_totals"):
            agent_bar = getattr(self.progress_callback, "_agent_bar", None)
            judge_bar = getattr(self.progress_callback, "_judge_bar", None)
            if agent_bar is None and judge_bar is None:
                progress_kwargs = {
                    "agent_total": len(dataset.test_cases),
                    "judge_total": len(dataset.test_cases) * len(self.evaluators),
                    "evaluator_names": [e.name for e in self.evaluators],
                    "agent_initial": self.progress_initial_completed,
                    "judge_initial": self.progress_initial_completed * len(self.evaluators),
                }
                try:
                    self.progress_callback.set_totals(**progress_kwargs)
                except TypeError:
                    self.progress_callback.set_totals(
                        agent_total=progress_kwargs["agent_total"],
                        judge_total=progress_kwargs["judge_total"],
                        evaluator_names=progress_kwargs["evaluator_names"],
                    )

        try:
            pending_test_cases = [
                test_case
                for test_case in dataset.test_cases
                if test_case.id not in self.skip_test_case_ids
            ]
            results = await asyncio.gather(
                *(self._run_single_test_case(test_case) for test_case in pending_test_cases)
            )
            report = EvaluationReport(
                dataset_name=dataset.name,
                results=results,
                evaluator_names=[e.name for e in self.evaluators],
                metadata={"description": dataset.description},
            )
            report.enrich_metadata()
            return report
        finally:
            if self.progress_callback and hasattr(self.progress_callback, "close"):
                self.progress_callback.close()

    async def _run_single_test_case(self, test_case: SqlTestCase) -> EvaluationResult:
        async with self._semaphore:
            components: List[UiComponent] = []
            error: Optional[str] = None
            conversation = None
            session = None
            user_id = "unknown"
            conversation_id = test_case.effective_conversation_id
            execution_time_ms = 0.0
            agent_start: float | None = None
            trace_error: Optional[str] = None

            try:
                runtime = await self.runtime_resolver.resolve(test_case)
                session = await runtime.create_session(test_case)
                user_id = session.user.id
                conversation_id = session.conversation_id
                agent_start = time.perf_counter()
                async for component in session.agent.send_message(
                    request_context=session.request_context,
                    message=test_case.query,
                    conversation_id=session.conversation_id,
                ):
                    components.append(component)
                execution_time_ms = (time.perf_counter() - agent_start) * 1000
            except Exception as exc:
                error = str(exc)
                logger.exception("Evaluation failed for test_case=%s", test_case.id)
                if agent_start is not None:
                    execution_time_ms = (time.perf_counter() - agent_start) * 1000

            if session is not None and conversation is None:
                try:
                    conversation = await session.conversation_store.get_conversation(
                        session.conversation_id, session.user
                    )
                except Exception as exc:
                    trace_error = str(exc)
                    logger.exception(
                        "Trace retrieval failed for test_case=%s",
                        test_case.id,
                    )
                    conversation = None

            if error is None and trace_error is not None:
                error = trace_error

            tool_calls, final_answer = self._extract_trace(conversation)

            metadata = {
                "component_count": len(components),
                "conversation_message_count": len(conversation.messages)
                if conversation
                else 0,
                "agent_run_time_ms": execution_time_ms,
            }
            if trace_error is not None:
                metadata["trace_load_error"] = trace_error

            agent_result = AgentResult(
                test_case_id=test_case.id,
                database_id=test_case.database_id,
                conversation_id=conversation_id,
                user_id=user_id,
                final_answer=final_answer,
                tool_calls=tool_calls,
                execution_time_ms=execution_time_ms,
                error=error,
                metadata=metadata,
            )

            if self.progress_callback and hasattr(self.progress_callback, "on_agent_done"):
                self.progress_callback.on_agent_done(test_case, agent_result)

            eval_results: List[EvaluationResult] = []
            for evaluator in self.evaluators:
                try:
                    result = await evaluator.evaluate(test_case, agent_result)
                except Exception as exc:
                    logger.exception(
                        "Evaluator %s failed for test_case=%s",
                        evaluator.name,
                        test_case.id,
                    )
                    result = EvaluationResult(
                        test_case=test_case,
                        agent_result=agent_result,
                        score=0.0,
                        passed=False,
                        reason=f"Evaluator {evaluator.name} failed: {exc}",
                        issue_tags=["evaluator_error"],
                        execution_time_ms=agent_result.execution_time_ms,
                        metadata={
                            "failure_type": "evaluator_error",
                            "evaluator": evaluator.name,
                            "exception_type": type(exc).__name__,
                        },
                    )
                eval_results.append(result)
                if self.progress_callback and hasattr(
                    self.progress_callback, "on_evaluator_done"
                ):
                    self.progress_callback.on_evaluator_done(
                        test_case,
                        evaluator.name,
                        result,
                    )

            # For now, keep the first evaluator as the canonical result.
            # The report can still inspect the per-evaluator outcomes through metadata.
            canonical = (
                eval_results[0]
                if eval_results
                else EvaluationResult(
                    test_case=test_case,
                    agent_result=agent_result,
                    score=0.0,
                    passed=False,
                    reason="No evaluators configured",
                    issue_tags=["evaluation_error"],
                    execution_time_ms=execution_time_ms,
                )
            )
            canonical.metadata["canonical_evaluator_name"] = (
                self.evaluators[0].name if self.evaluators else None
            )
            canonical.metadata["per_evaluator_results"] = [
                {
                    "evaluator_name": evaluator.name,
                    "result": result.model_dump(mode="json"),
                }
                for evaluator, result in zip(self.evaluators, eval_results)
            ]

            if self.result_callback is not None:
                result_value = self.result_callback(canonical)
                if inspect.isawaitable(result_value):
                    await result_value

            return canonical

    def _extract_trace(
        self, conversation: Any
    ) -> tuple[List[ToolInvocationRecord], Optional[str]]:
        if not conversation:
            return [], None

        tool_results: dict[str, str] = {}
        records: List[ToolInvocationRecord] = []
        final_answer: Optional[str] = None

        for message in conversation.messages:
            if message.role == "tool" and message.tool_call_id:
                tool_results[message.tool_call_id] = message.content
                continue

            if message.role != "assistant":
                continue

            if message.tool_calls:
                for tool_call in message.tool_calls:
                    records.append(
                        ToolInvocationRecord(
                            tool_call_id=tool_call.id,
                            tool_name=tool_call.name,
                            arguments=dict(tool_call.arguments),
                            result_text=tool_results.get(tool_call.id),
                        )
                    )
            elif message.content.strip():
                final_answer = message.content.strip()

        return records, final_answer
