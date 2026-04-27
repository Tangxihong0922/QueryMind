"""
Prometheus observability provider for QueryMind.

This provider collects telemetry data and exposes it in Prometheus format
via the /metrics endpoint for scraping by Prometheus server.
"""

import logging
from typing import Any, Dict, Optional

from prometheus_client import (
    Counter,
    Histogram,
    Gauge,
    CollectorRegistry,
    generate_latest,
    CONTENT_TYPE_LATEST,
)

from QueryMind.core.observability import ObservabilityProvider, Span, Metric

logger = logging.getLogger(__name__)


class PrometheusObservabilityProvider(ObservabilityProvider):
    """
    Prometheus implementation of ObservabilityProvider.

    This provider collects metrics about agent execution and exposes them
    in Prometheus format for scraping.

    Metrics collected:
        - agent_requests_total: Total number of agent requests
        - agent_request_duration_seconds: Request duration histogram
        - agent_errors_total: Total number of errors
        - tool_executions_total: Total tool executions by tool name
        - tool_duration_seconds: Tool execution duration histogram
        - llm_requests_total: Total LLM requests
        - llm_request_duration_seconds: LLM request duration histogram
        - llm_tokens_total: Total tokens used (input/output)
        - conversation_load_duration_seconds: Conversation load duration
        - context_enrichment_duration_seconds: Context enrichment duration

    Example:
        ```python
        from QueryMind.integrations.observer import PrometheusObservabilityProvider

        provider = PrometheusObservabilityProvider()

        agent = Agent(
            ...
            observability_provider=provider,
            ...
        )
        ```

    To expose metrics, add to your FastAPI app:
        ```python
        from starlette.responses import Response

        @app.get("/metrics")
        def metrics():
            return Response(
                content=generate_latest(),
                media_type=CONTENT_TYPE_LATEST
            )
        ```
    """

    def __init__(self, registry: Optional[CollectorRegistry] = None):
        """
        Initialize the Prometheus observability provider.

        Args:
            registry: Optional Prometheus CollectorRegistry. If not provided,
                     the default global registry is used.
        """
        self.registry = registry or CollectorRegistry()

        # Agent-level metrics
        self.agent_requests_total = Counter(
            "agent_requests_total",
            "Total number of agent requests",
            registry=self.registry,
        )

        self.agent_request_duration_seconds = Histogram(
            "agent_request_duration_seconds",
            "Agent request duration in seconds",
            buckets=(0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0),
            registry=self.registry,
        )

        self.agent_errors_total = Counter(
            "agent_errors_total",
            "Total number of agent errors",
            ["error_type"],
            registry=self.registry,
        )

        # Tool execution metrics
        self.tool_executions_total = Counter(
            "tool_executions_total",
            "Total tool executions",
            ["tool_name", "success"],
            registry=self.registry,
        )

        self.tool_duration_seconds = Histogram(
            "tool_duration_seconds",
            "Tool execution duration in seconds",
            ["tool_name"],
            buckets=(0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0),
            registry=self.registry,
        )

        # LLM metrics
        self.llm_requests_total = Counter(
            "llm_requests_total",
            "Total LLM requests",
            registry=self.registry,
        )

        self.llm_request_duration_seconds = Histogram(
            "llm_request_duration_seconds",
            "LLM request duration in seconds",
            buckets=(0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0, 30.0),
            registry=self.registry,
        )

        self.llm_tokens_total = Counter(
            "llm_tokens_total",
            "Total LLM tokens used",
            ["token_type"],
            registry=self.registry,
        )

        # Context enrichment metrics
        self.context_enrichment_duration_seconds = Histogram(
            "context_enrichment_duration_seconds",
            "Context enrichment duration in seconds",
            registry=self.registry,
        )

        self.conversation_load_duration_seconds = Histogram(
            "conversation_load_duration_seconds",
            "Conversation load duration in seconds",
            registry=self.registry,
        )

        # Active operations gauge
        self.active_operations = Gauge(
            "agent_active_operations",
            "Number of active operations",
            ["operation_type"],
            registry=self.registry,
        )

    async def record_metric(
        self,
        name: str,
        value: float,
        unit: str = "",
        tags: Optional[Dict[str, str]] = None,
    ) -> None:
        """
        Record a metric measurement.

        Args:
            name: Metric name (e.g., "agent.request.duration")
            value: Metric value
            unit: Unit of measurement (e.g., "ms", "tokens")
            tags: Additional tags/labels for the metric
        """
        tags = tags or {}
        labels = ",".join([f'{k}="{v}"' for k, v in tags.items()])

        try:
            # Agent metrics
            if name == "agent.message.duration":
                # Convert ms to seconds if needed
                duration = value / 1000.0 if unit == "ms" else value
                self.agent_request_duration_seconds.observe(duration)
                self.agent_requests_total.inc()

            elif name == "agent.error.count":
                error_type = tags.get("error_type", "unknown")
                self.agent_errors_total.labels(error_type=error_type).inc()

            # Tool metrics
            elif name == "agent.tool.duration":
                tool_name = tags.get("tool", "unknown")
                duration = value / 1000.0 if unit == "ms" else value
                self.tool_duration_seconds.labels(tool_name=tool_name).observe(duration)

            elif name.startswith("tool.execution"):
                tool_name = tags.get("tool", "unknown")
                success = tags.get("success", "true")
                self.tool_executions_total.labels(
                    tool_name=tool_name, success=success
                ).inc()

            # LLM metrics
            elif name == "llm.request.duration":
                duration = value / 1000.0 if unit == "ms" else value
                self.llm_request_duration_seconds.observe(duration)
                self.llm_requests_total.inc()

            elif "token" in name.lower():
                token_type = tags.get("type", "unknown")
                self.llm_tokens_total.labels(token_type=token_type).inc(value)

            # Context enrichment
            elif name == "agent.enrichment.duration":
                duration = value / 1000.0 if unit == "ms" else value
                self.context_enrichment_duration_seconds.observe(duration)

            elif name == "agent.conversation.load.duration":
                duration = value / 1000.0 if unit == "ms" else value
                self.conversation_load_duration_seconds.observe(duration)

            # User resolution
            elif name == "agent.user_resolution.duration":
                duration = value / 1000.0 if unit == "ms" else value
                # Could add a separate histogram if needed

            else:
                logger.debug(f"Unhandled metric: {name}={value} {unit} {tags}")

        except Exception as e:
            logger.error(f"Error recording metric {name}: {e}")

    async def create_span(
        self, name: str, attributes: Optional[Dict[str, Any]] = None
    ) -> Span:
        """
        Create a new span for tracing.

        Args:
            name: Span name/operation
            attributes: Initial span attributes

        Returns:
            Span object to track the operation
        """
        # Track active operations
        if "tool.execute" in name:
            self.active_operations.labels(operation_type="tool").inc()
        elif "llm" in name:
            self.active_operations.labels(operation_type="llm").inc()

        span = Span(name=name, attributes=attributes or {})

        # Store reference to provider for metrics on end_span
        span._provider = self

        return span

    async def end_span(self, span: Span) -> None:
        """
        End a span and record metrics.

        Args:
            span: The span to end
        """
        span.end()

        # Decrement active operations
        if "tool.execute" in span.name:
            self.active_operations.labels(operation_type="tool").dec()
        elif "llm" in span.name:
            self.active_operations.labels(operation_type="llm").dec()

        # Record duration metrics based on span name
        duration_ms = span.duration_ms()
        if duration_ms is not None:
            if "agent.tool.execute" in span.name:
                tool_name = span.attributes.get("tool_name", "unknown")
                self.tool_duration_seconds.labels(tool_name=tool_name).observe(
                    duration_ms / 1000.0
                )
                success = str(span.attributes.get("success", True)).lower()
                self.tool_executions_total.labels(
                    tool_name=tool_name, success=success
                ).inc()

            elif "llm.request" in span.name:
                self.llm_request_duration_seconds.observe(duration_ms / 1000.0)
                self.llm_requests_total.inc()

            elif "llm.stream" in span.name:
                # Stream duration already counted in llm.request
                pass

            elif "agent.message" in span.name:
                self.agent_request_duration_seconds.observe(duration_ms / 1000.0)
                self.agent_requests_total.inc()

            elif "agent.enrichment" in span.name:
                self.context_enrichment_duration_seconds.observe(duration_ms / 1000.0)

            elif "agent.conversation.load" in span.name:
                self.conversation_load_duration_seconds.observe(duration_ms / 1000.0)

    def get_metrics(self) -> bytes:
        """
        Get all metrics in Prometheus format.

        Returns:
            Metrics in Prometheus exposition format
        """
        return generate_latest(self.registry)

    def get_content_type(self) -> str:
        """
        Get the content type for Prometheus metrics.

        Returns:
            Content type string
        """
        return CONTENT_TYPE_LATEST
