from __future__ import annotations

from pathlib import Path
import sys
import asyncio

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from QueryMind.integrations.plotly import PlotlyChartGenerator  # noqa: E402
from QueryMind.tools.visualize_data import VisualizeDataTool  # noqa: E402
from QueryMind.capabilities.agent_memory import AgentMemory  # noqa: E402
from QueryMind.core.tool import ToolContext  # noqa: E402
from QueryMind.core.user import User  # noqa: E402


class DummyAgentMemory(AgentMemory):
    async def save_tool_usage(self, *args, **kwargs):
        return None

    async def save_text_memory(self, *args, **kwargs):
        raise NotImplementedError

    async def search_similar_usage(self, *args, **kwargs):
        return []

    async def search_text_memories(self, *args, **kwargs):
        return []

    async def get_recent_memories(self, *args, **kwargs):
        return []

    async def get_recent_text_memories(self, *args, **kwargs):
        return []

    async def delete_by_id(self, *args, **kwargs):
        return False

    async def delete_text_memory(self, *args, **kwargs):
        return False

    async def clear_memories(self, *args, **kwargs):
        return 0


class DummyFileSystem:
    def __init__(self, content: str):
        self.content = content

    async def read_file(self, filename, context):
        return self.content


def make_context() -> ToolContext:
    return ToolContext(
        user=User(id="u1", username="tester", email="tester@example.com", group_memberships=[]),
        conversation_id="c1",
        request_id="r1",
        agent_memory=DummyAgentMemory(),
    )


def test_generator_prefers_explicit_pie_chart() -> None:
    df = pd.DataFrame({"Category": ["A", "B", "C"], "Value": [10, 20, 30]})
    generator = PlotlyChartGenerator()

    figure, chart_type = generator.generate_chart(df, title="Demo", chart_type="pie")

    assert chart_type == "pie"
    assert figure["data"][0]["type"] == "pie"


def test_generator_uses_grouped_bar_for_multiple_categorical_columns() -> None:
    df = pd.DataFrame(
        {
            "warehouse": ["A", "A", "B", "B"],
            "product": ["x", "y", "x", "y"],
        }
    )
    generator = PlotlyChartGenerator()

    figure, chart_type = generator.generate_chart(df, title="Grouped")

    assert chart_type == "grouped_bar"
    assert figure["data"][0]["type"] == "bar"
    assert figure["layout"]["barmode"] == "group"


def test_visualize_data_tool_reports_real_chart_type() -> None:
    csv_content = "Category,Value\nA,10\nB,20\nC,30\n"
    tool = VisualizeDataTool(
        file_system=DummyFileSystem(csv_content),
        plotly_generator=PlotlyChartGenerator(),
    )

    result = asyncio.run(
        tool.execute(
            make_context(),
            tool.get_args_schema()(filename="demo.csv", chart_type="pie"),
        )
    )

    assert result.success is True
    assert "pie visualization" in result.result_for_llm
    assert result.metadata["actual_chart_type"] == "pie"
    assert result.ui_component.rich_component.chart_type == "pie"
