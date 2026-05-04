"""Generic SQL query execution tool with dependency injection."""

from typing import Any, Dict, List, Optional, Type, cast
import uuid
from QueryMind.core.tool import Tool, ToolContext, ToolResult
from QueryMind.components import (
    UiComponent,
    DataFrameComponent,
    NotificationComponent,
    ComponentType,
    SimpleTextComponent,
)
from QueryMind.capabilities.sql_runner import SqlRunner, RunSqlToolArgs
from QueryMind.capabilities.file_system import FileSystem
from QueryMind.integrations.local import LocalFileSystem


class RunSqlTool(Tool[RunSqlToolArgs]):
    """Tool that executes SQL queries using an injected SqlRunner implementation."""

    def __init__(
        self,
        sql_runner: SqlRunner,
        file_system: Optional[FileSystem] = None,
        custom_tool_name: Optional[str] = None,
        custom_tool_description: Optional[str] = None,
    ):
        """Initialize the tool with a SqlRunner implementation.

        Args:
            sql_runner: SqlRunner implementation that handles actual query execution
            file_system: FileSystem implementation for saving results (defaults to LocalFileSystem)
            custom_tool_name: Optional custom name for the tool (overrides default "run_sql")
            custom_tool_description: Optional custom description for the tool (overrides default description)
        """
        self.sql_runner = sql_runner
        self.file_system = file_system or LocalFileSystem()
        self._custom_name = custom_tool_name
        self._custom_description = custom_tool_description

    @property
    def name(self) -> str:
        return self._custom_name if self._custom_name else "run_sql"

    @property
    def description(self) -> str:
        return (
            self._custom_description
            if self._custom_description
            else "Execute SQL queries against the configured database"
        )
    
    @property
    def access_groups(self) -> List[str]:
        return []

    def get_args_schema(self) -> Type[RunSqlToolArgs]:
        return RunSqlToolArgs

    async def execute(self, context: ToolContext, args: RunSqlToolArgs) -> ToolResult:
        """Execute a SQL query using the injected SqlRunner."""
        try:
            # Use the injected SqlRunner to execute the query
            df = await self.sql_runner.run_sql(args, context)

            is_rows_affected_result = list(df.columns) == ["rows_affected"]

            if not is_rows_affected_result:
                # Handle read-style queries that return rows, including CTEs
                # that begin with WITH but still produce a result set.
                results_data = df.to_dict("records")
                columns = df.columns.tolist()
                row_count = len(df)

                # Write DataFrame to CSV file for downstream tools
                file_id = str(uuid.uuid4())[:8]
                filename = f"query_results_{file_id}.csv"
                csv_content = df.to_csv(index=False)
                await self.file_system.write_file(
                    filename, csv_content, context, overwrite=True
                )

                # Create result text for LLM with truncated results
                results_preview = csv_content
                if len(results_preview) > 1000:
                    results_preview = (
                        results_preview[:1000]
                        + "\n(Results truncated to 1000 characters. FOR LARGE RESULTS YOU DO NOT NEED TO SUMMARIZE THESE RESULTS OR PROVIDE OBSERVATIONS. THE NEXT STEP SHOULD BE A VISUALIZE_DATA CALL)"
                    )

                result = f"{results_preview}\n\nResults saved to file: {filename}\n\n**IMPORTANT: FOR VISUALIZE_DATA USE FILENAME: {filename}**"

                # Create DataFrame component for UI
                dataframe_component = DataFrameComponent.from_records(
                    records=cast(List[Dict[str, Any]], results_data),
                    title="Query Results",
                    description=f"SQL query returned {row_count} rows with {len(columns)} columns",
                )

                ui_component = UiComponent(
                    rich_component=dataframe_component,
                    simple_component=SimpleTextComponent(text=result),
                )

                metadata = {
                    "row_count": row_count,
                    "columns": columns,
                    "results": results_data,
                    "output_file": filename,
                    "executed_sql": args.sql.strip(),
                }
            else:
                # The SqlRunner returned a one-column rows_affected frame.
                rows_affected = (
                    int(df.iloc[0]["rows_affected"]) if not df.empty else 0
                )
                result = (
                    f"Query executed successfully. {rows_affected} row(s) affected."
                )

                metadata = {
                    "rows_affected": rows_affected,
                    "executed_sql": args.sql.strip(),
                }
                ui_component = UiComponent(
                    rich_component=NotificationComponent(
                        type=ComponentType.NOTIFICATION, level="success", message=result
                    ),
                    simple_component=SimpleTextComponent(text=result),
                )

            return ToolResult(
                success=True,
                result_for_llm=result,
                ui_component=ui_component,
                metadata=metadata,
            )

        except Exception as e:
            error_message = f"Error executing query: {str(e)}"
            return ToolResult(
                success=False,
                result_for_llm=error_message,
                ui_component=UiComponent(
                    rich_component=NotificationComponent(
                        type=ComponentType.NOTIFICATION,
                        level="error",
                        message=error_message,
                ),
                simple_component=SimpleTextComponent(text=error_message),
            ),
                error=str(e),
                metadata={
                    "error_type": "sql_error",
                    "executed_sql": args.sql.strip(),
                    "query_type": args.sql.strip().upper().split()[0]
                    if args.sql.strip()
                    else "UNKNOWN",
                },
            )
