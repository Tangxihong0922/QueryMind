"""Plotly-based chart generator with automatic chart type selection."""

from __future__ import annotations

from typing import Any, Dict, List, Optional, Tuple, cast
import json
import re

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import plotly.io as pio


class PlotlyChartGenerator:
    """Generate Plotly charts using heuristics based on DataFrame characteristics."""

    THEME_COLORS = {
        "navy": "#023d60",
        "cream": "#e7e1cf",
        "teal": "#15a8a8",
        "orange": "#fe5d26",
        "magenta": "#bf1363",
    }

    COLOR_PALETTE = ["#15a8a8", "#fe5d26", "#bf1363", "#023d60"]

    IDENTIFIER_HINTS = ("id", "uuid", "guid", "key", "code")
    DIMENSION_HINTS = (
        "name",
        "label",
        "category",
        "type",
        "group",
        "class",
        "location",
        "warehouse",
        "region",
        "department",
        "product",
        "status",
        "year",
        "month",
        "quarter",
        "week",
        "day",
        "date",
        "time",
    )
    MEASURE_HINT_WEIGHTS = {
        "quantity": 80,
        "qty": 80,
        "count": 70,
        "amount": 70,
        "total": 60,
        "value": 50,
        "price": 50,
        "cost": 50,
        "sales": 45,
        "revenue": 45,
        "score": 20,
        "rating": 20,
    }

    def generate_chart(
        self,
        df: pd.DataFrame,
        title: str = "Chart",
        chart_type: Optional[str] = None,
    ) -> Tuple[Dict[str, Any], str]:
        """Generate a Plotly chart from a DataFrame."""
        if df.empty:
            raise ValueError("Cannot visualize empty DataFrame")

        normalized_chart_type = self._normalize_chart_type(chart_type)
        textual_cols = self._select_textual_columns(df)
        numeric_cols = self._select_numeric_columns(df)
        datetime_cols = self._select_datetime_columns(df)
        dimension_cols = self._infer_dimension_columns(df, textual_cols, numeric_cols)
        measure_cols = self._infer_measure_columns(df, numeric_cols)

        primary_dimension = self._choose_primary_dimension(df, dimension_cols, textual_cols)
        secondary_dimension = self._choose_secondary_dimension(
            df, dimension_cols, primary_dimension
        )
        primary_measure = self._choose_primary_measure(df, measure_cols)

        # Respect explicit requests first.
        if normalized_chart_type in {"bar", "grouped_bar"}:
            fig, actual_chart_type = self._create_bar_family_chart(
                df,
                title,
                dimension_cols=dimension_cols,
                measure_cols=measure_cols,
            )
            return json.loads(pio.to_json(fig)), actual_chart_type

        if normalized_chart_type == "pie":
            fig = self._create_pie_chart(df, title, dimension_cols, measure_cols, donut=False)
            return json.loads(pio.to_json(fig)), "pie"

        if normalized_chart_type == "donut":
            fig = self._create_pie_chart(df, title, dimension_cols, measure_cols, donut=True)
            return json.loads(pio.to_json(fig)), "donut"

        if normalized_chart_type == "scatter":
            source_cols = measure_cols or numeric_cols
            if len(source_cols) >= 2:
                fig = self._create_scatter_plot(df, source_cols[0], source_cols[1], title)
                return json.loads(pio.to_json(fig)), "scatter"

        if normalized_chart_type == "line":
            source_cols = measure_cols or numeric_cols
            if datetime_cols and source_cols:
                fig = self._create_time_series_chart(df, datetime_cols[0], source_cols, title)
                return json.loads(pio.to_json(fig)), "line"

        if normalized_chart_type == "histogram":
            source_cols = measure_cols or numeric_cols
            if source_cols:
                fig = self._create_histogram(df, source_cols[0], title)
                return json.loads(pio.to_json(fig)), "histogram"

        if normalized_chart_type == "table":
            fig = self._create_table(df, title)
            return json.loads(pio.to_json(fig)), "table"

        # Heuristics.
        if datetime_cols and (measure_cols or numeric_cols):
            fig = self._create_time_series_chart(
                df, datetime_cols[0], measure_cols or numeric_cols, title
            )
            actual_chart_type = "line"
        elif primary_dimension and secondary_dimension:
            fig, actual_chart_type = self._create_bar_family_chart(
                df,
                title,
                dimension_cols=dimension_cols,
                measure_cols=measure_cols,
            )
        elif primary_dimension and (primary_measure or measure_cols):
            fig = self._create_bar_chart(
                df,
                primary_dimension,
                primary_measure or measure_cols[0],
                title,
            )
            actual_chart_type = "bar"
        elif primary_dimension:
            fig = self._create_category_count_bar(df, primary_dimension, title)
            actual_chart_type = "bar"
        elif len(measure_cols) >= 3 or len(numeric_cols) >= 3:
            fig = self._create_correlation_heatmap(df, measure_cols or numeric_cols, title)
            actual_chart_type = "heatmap"
        elif len(measure_cols) >= 2 or len(numeric_cols) >= 2:
            source_cols = measure_cols or numeric_cols
            fig = self._create_scatter_plot(df, source_cols[0], source_cols[1], title)
            actual_chart_type = "scatter"
        elif len(measure_cols) == 1 or len(numeric_cols) == 1:
            source_col = measure_cols[0] if measure_cols else numeric_cols[0]
            fig = self._create_histogram(df, source_col, title)
            actual_chart_type = "histogram"
        elif self._should_use_pie_chart(df, dimension_cols, measure_cols):
            fig = self._create_pie_chart(df, title, dimension_cols, measure_cols, donut=False)
            actual_chart_type = "pie"
        else:
            fig, actual_chart_type = self._fallback_chart(
                df, title, primary_dimension, primary_measure, numeric_cols
            )

        result = json.loads(pio.to_json(fig))
        return result, actual_chart_type

    def _normalize_chart_type(self, chart_type: Optional[str]) -> Optional[str]:
        if not chart_type:
            return None
        normalized = chart_type.strip().lower()
        aliases = {
            "grouped-bar": "grouped_bar",
            "grouped bar": "grouped_bar",
            "bar-chart": "bar",
            "pie chart": "pie",
            "donut chart": "donut",
            "scatter plot": "scatter",
        }
        return aliases.get(normalized, normalized)

    def _normalize_column_name(self, column_name: str) -> str:
        return re.sub(r"[^a-z0-9]+", "", column_name.lower())

    def _is_textual_series(self, series: pd.Series) -> bool:
        dtype = series.dtype
        return (
            dtype == object
            or isinstance(dtype, pd.CategoricalDtype)
            or pd.api.types.is_string_dtype(dtype)
        )

    def _is_datetime_series(self, series: pd.Series) -> bool:
        dtype = series.dtype
        return pd.api.types.is_datetime64_any_dtype(dtype) or isinstance(dtype, pd.DatetimeTZDtype)

    def _is_numeric_series(self, series: pd.Series) -> bool:
        dtype = series.dtype
        return pd.api.types.is_numeric_dtype(dtype) and not pd.api.types.is_bool_dtype(dtype)

    def _select_textual_columns(self, df: pd.DataFrame) -> List[str]:
        return [column for column in df.columns if self._is_textual_series(df[column])]

    def _select_numeric_columns(self, df: pd.DataFrame) -> List[str]:
        return [column for column in df.columns if self._is_numeric_series(df[column])]

    def _select_datetime_columns(self, df: pd.DataFrame) -> List[str]:
        return [column for column in df.columns if self._is_datetime_series(df[column])]

    def _looks_like_identifier_column(self, column_name: str) -> bool:
        lower = column_name.lower().strip()
        return lower in self.IDENTIFIER_HINTS or any(
            lower.endswith(hint) for hint in self.IDENTIFIER_HINTS
        )

    def _looks_like_dimension_name(self, column_name: str) -> bool:
        normalized = self._normalize_column_name(column_name)
        return any(hint in normalized for hint in self.DIMENSION_HINTS)

    def _looks_like_measure_name(self, column_name: str) -> bool:
        normalized = self._normalize_column_name(column_name)
        return any(hint in normalized for hint in self.MEASURE_HINT_WEIGHTS)

    def _cardinality_metrics(self, series: pd.Series) -> Tuple[int, float]:
        unique_count = int(series.nunique(dropna=True))
        unique_ratio = unique_count / max(len(series), 1)
        return unique_count, unique_ratio

    def _numeric_dimension_score(self, df: pd.DataFrame, column_name: str) -> int:
        series = df[column_name]
        unique_count, unique_ratio = self._cardinality_metrics(series)
        score = 0

        if self._looks_like_identifier_column(column_name):
            score += 100
        if self._looks_like_dimension_name(column_name):
            score += 25
        if self._is_textual_series(series):
            score += 60

        if unique_count <= 12:
            score += 20
        if unique_ratio <= 0.5:
            score += 15
        if unique_ratio <= 0.25:
            score += 10

        if pd.api.types.is_integer_dtype(series):
            score += 5
        if pd.api.types.is_bool_dtype(series):
            score += 10
        if pd.api.types.is_float_dtype(series):
            score -= 10

        return score

    def _numeric_measure_score(self, df: pd.DataFrame, column_name: str) -> int:
        series = df[column_name]
        unique_count, unique_ratio = self._cardinality_metrics(series)
        score = 0

        if self._looks_like_measure_name(column_name):
            score += 80
        if pd.api.types.is_float_dtype(series):
            score += 25
        if pd.api.types.is_integer_dtype(series):
            score += 10
        if unique_count >= 5:
            score += 15
        if unique_count >= 10:
            score += 10
        if unique_ratio >= 0.5:
            score += 10
        if unique_ratio >= 0.8:
            score += 5

        if self._looks_like_identifier_column(column_name):
            score -= 50
        if self._is_textual_series(series):
            score -= 20

        return score

    def _classify_numeric_column(self, df: pd.DataFrame, column_name: str) -> str:
        """Classify a numeric column as a dimension or measure."""
        dimension_score = self._numeric_dimension_score(df, column_name)
        measure_score = self._numeric_measure_score(df, column_name)
        return "dimension" if dimension_score >= measure_score else "measure"

    def _infer_dimension_columns(
        self,
        df: pd.DataFrame,
        textual_cols: List[str],
        numeric_cols: List[str],
    ) -> List[str]:
        dimension_cols = list(textual_cols)
        for column in numeric_cols:
            if self._classify_numeric_column(df, column) == "dimension":
                dimension_cols.append(column)
        return [column for column in df.columns if column in dimension_cols]

    def _infer_measure_columns(self, df: pd.DataFrame, numeric_cols: List[str]) -> List[str]:
        measure_cols = [column for column in numeric_cols if self._classify_numeric_column(df, column) == "measure"]
        if measure_cols:
            return measure_cols

        # If nothing scores as a measure, keep the raw numeric columns as a fallback.
        return numeric_cols

    def _choose_primary_dimension(
        self,
        df: pd.DataFrame,
        dimension_cols: List[str],
        textual_cols: List[str],
    ) -> Optional[str]:
        if not dimension_cols:
            return None

        textual_candidates = [
            column for column in dimension_cols if column in textual_cols and not self._looks_like_identifier_column(column)
        ]
        if textual_candidates:
            candidates = textual_candidates
        else:
            candidates = [column for column in dimension_cols if column in textual_cols] or dimension_cols

        textual_set = set(textual_cols)
        return max(
            candidates,
            key=lambda column: (
                self._numeric_dimension_score(df, column)
                + (10 if column in textual_set else 0),
                -df.columns.get_loc(column),
            ),
        )

    def _choose_secondary_dimension(
        self,
        df: pd.DataFrame,
        dimension_cols: List[str],
        primary_dimension: Optional[str],
    ) -> Optional[str]:
        candidates = [column for column in dimension_cols if column != primary_dimension]
        if not candidates:
            return None

        return max(
            candidates,
            key=lambda column: (
                100 - int(df[column].nunique(dropna=True)),
                self._numeric_dimension_score(df, column),
                -df.columns.get_loc(column),
            ),
        )

    def _choose_primary_measure(
        self, df: pd.DataFrame, measure_cols: List[str]
    ) -> Optional[str]:
        if not measure_cols:
            return None

        return max(
            measure_cols,
            key=lambda column: (
                self._numeric_measure_score(df, column),
                -df.columns.get_loc(column),
            ),
        )

    def _should_use_pie_chart(
        self,
        df: pd.DataFrame,
        dimension_cols: List[str],
        measure_cols: List[str],
    ) -> bool:
        if len(dimension_cols) != 1 or len(measure_cols) != 1:
            return False
        if len(df) > 50:
            return False
        unique_categories = df[dimension_cols[0]].nunique(dropna=True)
        return 2 <= unique_categories <= 12

    def _format_category_series(self, series: pd.Series) -> pd.Series:
        return series.map(lambda value: "Missing" if pd.isna(value) else str(value))

    def _apply_standard_layout(self, fig: go.Figure) -> go.Figure:
        fig.update_layout(
            font={"color": self.THEME_COLORS["navy"]},
            autosize=True,
            colorway=self.COLOR_PALETTE,
        )
        return fig

    def _create_histogram(self, df: pd.DataFrame, column: str, title: str) -> go.Figure:
        fig = px.histogram(
            df,
            x=column,
            title=title,
            color_discrete_sequence=[self.THEME_COLORS["teal"]],
        )
        fig.update_layout(xaxis_title=column, yaxis_title="Count", showlegend=False)
        self._apply_standard_layout(fig)
        return fig

    def _create_bar_chart(
        self, df: pd.DataFrame, x_col: str, y_col: str, title: str
    ) -> go.Figure:
        agg_df = df.groupby(x_col, dropna=False)[y_col].sum().reset_index()
        agg_df[x_col] = self._format_category_series(agg_df[x_col])
        fig = px.bar(
            agg_df,
            x=x_col,
            y=y_col,
            title=title,
            color_discrete_sequence=[self.THEME_COLORS["orange"]],
        )
        fig.update_layout(xaxis_title=x_col, yaxis_title=y_col)
        self._apply_standard_layout(fig)
        return fig

    def _create_category_count_bar(
        self, df: pd.DataFrame, category_col: str, title: str
    ) -> go.Figure:
        counts = df[category_col].value_counts(dropna=False).reset_index()
        counts.columns = [category_col, "count"]
        counts[category_col] = self._format_category_series(counts[category_col])
        fig = px.bar(
            counts,
            x=category_col,
            y="count",
            title=title,
            color_discrete_sequence=[self.THEME_COLORS["teal"]],
        )
        fig.update_layout(xaxis_title=category_col, yaxis_title="Count")
        self._apply_standard_layout(fig)
        return fig

    def _create_scatter_plot(
        self, df: pd.DataFrame, x_col: str, y_col: str, title: str
    ) -> go.Figure:
        fig = px.scatter(
            df,
            x=x_col,
            y=y_col,
            title=title,
            color_discrete_sequence=[self.THEME_COLORS["magenta"]],
        )
        fig.update_layout(xaxis_title=x_col, yaxis_title=y_col)
        self._apply_standard_layout(fig)
        return fig

    def _create_correlation_heatmap(
        self, df: pd.DataFrame, columns: List[str], title: str
    ) -> go.Figure:
        corr_matrix = df[columns].corr()
        vanna_colorscale = [
            [0.0, self.THEME_COLORS["navy"]],
            [0.5, self.THEME_COLORS["cream"]],
            [1.0, self.THEME_COLORS["teal"]],
        ]
        fig = cast(
            go.Figure,
            px.imshow(
                corr_matrix,
                title=title,
                labels=dict(color="Correlation"),
                x=columns,
                y=columns,
                color_continuous_scale=vanna_colorscale,
                zmin=-1,
                zmax=1,
            ),
        )
        self._apply_standard_layout(fig)
        return fig

    def _create_time_series_chart(
        self, df: pd.DataFrame, time_col: str, value_cols: List[str], title: str
    ) -> go.Figure:
        fig = go.Figure()

        for index, column in enumerate(value_cols[:5]):
            color = self.COLOR_PALETTE[index % len(self.COLOR_PALETTE)]
            fig.add_trace(
                go.Scatter(
                    x=df[time_col],
                    y=df[column],
                    mode="lines",
                    name=column,
                    line=dict(color=color),
                )
            )

        fig.update_layout(
            title=title,
            xaxis_title=time_col,
            yaxis_title="Value",
            hovermode="x unified",
        )
        self._apply_standard_layout(fig)
        return fig

    def _create_bar_family_chart(
        self,
        df: pd.DataFrame,
        title: str,
        dimension_cols: List[str],
        measure_cols: List[str],
    ) -> Tuple[go.Figure, str]:
        """Create either a grouped bar or a simple bar depending on the data."""
        textual_cols = self._select_textual_columns(df)
        primary_dimension = self._choose_primary_dimension(df, dimension_cols, textual_cols)
        secondary_dimension = self._choose_secondary_dimension(
            df, dimension_cols, primary_dimension
        )
        primary_measure = self._choose_primary_measure(df, measure_cols)

        if primary_dimension and secondary_dimension:
            if primary_measure:
                grouped = (
                    df.groupby([primary_dimension, secondary_dimension], dropna=False)[
                        primary_measure
                    ]
                    .sum()
                    .reset_index()
                )
                grouped[primary_dimension] = self._format_category_series(grouped[primary_dimension])
                grouped[secondary_dimension] = self._format_category_series(
                    grouped[secondary_dimension]
                )
                fig = px.bar(
                    grouped,
                    x=primary_dimension,
                    y=primary_measure,
                    color=secondary_dimension,
                    title=title,
                    barmode="group",
                    color_discrete_sequence=self.COLOR_PALETTE,
                )
                fig.update_layout(
                    xaxis_title=primary_dimension, yaxis_title=primary_measure
                )
                self._apply_standard_layout(fig)
                return fig, "grouped_bar"

            grouped = (
                df.groupby([primary_dimension, secondary_dimension], dropna=False)
                .size()
                .reset_index(name="count")
            )
            grouped[primary_dimension] = self._format_category_series(grouped[primary_dimension])
            grouped[secondary_dimension] = self._format_category_series(
                grouped[secondary_dimension]
            )
            fig = px.bar(
                grouped,
                x=primary_dimension,
                y="count",
                color=secondary_dimension,
                title=title,
                barmode="group",
                color_discrete_sequence=self.COLOR_PALETTE,
            )
            fig.update_layout(xaxis_title=primary_dimension, yaxis_title="Count")
            self._apply_standard_layout(fig)
            return fig, "grouped_bar"

        if primary_dimension and primary_measure:
            return self._create_bar_chart(df, primary_dimension, primary_measure, title), "bar"

        if primary_dimension:
            return self._create_category_count_bar(df, primary_dimension, title), "bar"

        if len(measure_cols) >= 2:
            return self._create_scatter_plot(df, measure_cols[0], measure_cols[1], title), "scatter"

        if measure_cols:
            return self._create_histogram(df, measure_cols[0], title), "histogram"

        if len(df.columns) >= 2:
            return self._create_generic_chart(df, df.columns[0], df.columns[1], title), "bar"

        return self._create_table(df, title), "table"

    def _create_pie_chart(
        self,
        df: pd.DataFrame,
        title: str,
        dimension_cols: List[str],
        measure_cols: List[str],
        donut: bool = False,
    ) -> go.Figure:
        category_col = self._choose_primary_dimension(
            df, dimension_cols, self._select_textual_columns(df)
        )
        value_col = self._choose_primary_measure(df, measure_cols)

        if category_col and value_col:
            aggregated = df.groupby(category_col, dropna=False)[value_col].sum().reset_index()
            names_col = category_col
            values_col = value_col
        elif category_col:
            aggregated = df[category_col].value_counts(dropna=False).reset_index()
            aggregated.columns = [category_col, "count"]
            names_col = category_col
            values_col = "count"
        else:
            if len(df.columns) < 2:
                raise ValueError("Pie charts require at least two columns or one categorical column")
            names_col = df.columns[0]
            values_col = df.columns[1]
            aggregated = df[[names_col, values_col]].copy()

        aggregated[names_col] = self._format_category_series(aggregated[names_col])

        fig = px.pie(
            aggregated,
            names=names_col,
            values=values_col,
            title=title,
            color_discrete_sequence=self.COLOR_PALETTE,
            hole=0.45 if donut else 0.0,
        )
        fig.update_layout(showlegend=True)
        self._apply_standard_layout(fig)
        return fig

    def _create_generic_chart(
        self, df: pd.DataFrame, col1: str, col2: str, title: str
    ) -> go.Figure:
        if self._is_numeric_series(df[col1]) and self._is_numeric_series(df[col2]):
            return self._create_scatter_plot(df, col1, col2, title)

        df_copy = df[[col1, col2]].copy()
        df_copy[col1] = self._format_category_series(df_copy[col1])
        fig = px.bar(
            df_copy,
            x=col1,
            y=col2,
            title=title,
            color_discrete_sequence=[self.THEME_COLORS["orange"]],
        )
        fig.update_layout(xaxis_title=col1, yaxis_title=col2)
        self._apply_standard_layout(fig)
        return fig

    def _create_table(self, df: pd.DataFrame, title: str) -> go.Figure:
        header_values = list(df.columns)
        cell_values = [df[column].tolist() for column in df.columns]

        fig = go.Figure(
            data=[
                go.Table(
                    header=dict(
                        values=header_values,
                        fill_color=self.THEME_COLORS["navy"],
                        font=dict(color="white", size=12),
                        align="left",
                    ),
                    cells=dict(
                        values=cell_values,
                        fill_color=[
                            [
                                self.THEME_COLORS["cream"] if index % 2 == 0 else "white"
                                for index in range(len(df))
                            ]
                        ],
                        font=dict(color=self.THEME_COLORS["navy"], size=11),
                        align="left",
                    ),
                )
            ]
        )

        fig.update_layout(title=title, font={"color": self.THEME_COLORS["navy"]})
        return fig

    def _fallback_chart(
        self,
        df: pd.DataFrame,
        title: str,
        primary_dimension: Optional[str],
        primary_measure: Optional[str],
        numeric_cols: List[str],
    ) -> Tuple[go.Figure, str]:
        if primary_dimension and primary_measure:
            return self._create_bar_chart(df, primary_dimension, primary_measure, title), "bar"

        if len(numeric_cols) >= 2:
            return self._create_scatter_plot(df, numeric_cols[0], numeric_cols[1], title), "scatter"

        if numeric_cols:
            return self._create_histogram(df, numeric_cols[0], title), "histogram"

        if len(df.columns) >= 2:
            return self._create_generic_chart(df, df.columns[0], df.columns[1], title), "bar"

        return self._create_table(df, title), "table"
