"""Evaluation reporting for QueryMind."""

from __future__ import annotations

import csv
import html
import json
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field

from .base import EvaluationResult


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


class EvaluationReport(BaseModel):
    """Report for one evaluation run."""

    dataset_name: str
    results: List[EvaluationResult]
    evaluator_names: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    timestamp: datetime = Field(default_factory=_utc_now)

    def pass_rate(self) -> float:
        if not self.results:
            return 0.0
        return sum(1 for item in self.results if item.passed) / len(self.results)

    def average_score(self) -> float:
        if not self.results:
            return 0.0
        return sum(item.score for item in self.results) / len(self.results)

    def average_execution_time(self) -> float:
        if not self.results:
            return 0.0
        return sum(item.execution_time_ms for item in self.results) / len(self.results)

    def execution_success_rate(self) -> float:
        if not self.results:
            return 0.0
        successful = sum(
            1
            for item in self.results
            if item.agent_artifact is not None and item.agent_artifact.success
        )
        return successful / len(self.results)

    def issue_tag_distribution(self) -> Dict[str, int]:
        counter: Counter[str] = Counter()
        for result in self.results:
            counter.update(result.issue_tags)
        return dict(counter)

    def run_status(self) -> str:
        return str(self.metadata.get("run_status") or "completed")

    def run_progress(self) -> Optional[str]:
        completed = self.metadata.get("completed_test_cases")
        total = self.metadata.get("total_test_cases")
        if completed is None or total is None:
            return None
        return f"{completed}/{total}"

    def classification_summaries(self) -> Dict[str, List[Dict[str, Any]]]:
        return {
            field: self._build_classification_summary(field)
            for field in self.classification_fields()
        }

    def evaluator_summaries(self) -> List[Dict[str, Any]]:
        grouped: Dict[str, List[EvaluationResult]] = defaultdict(list)
        for result in self.results:
            for evaluator_name, evaluator_result in self._per_evaluator_results(result).items():
                grouped[evaluator_name].append(evaluator_result)

        ordered_names = list(self.evaluator_names)
        for name in grouped:
            if name not in ordered_names:
                ordered_names.append(name)

        summaries: List[Dict[str, Any]] = []
        for name in ordered_names:
            items = grouped.get(name, [])
            if not items:
                continue
            summaries.append(
                {
                    "evaluator_name": name,
                    "count": len(items),
                    "pass_count": sum(1 for item in items if item.passed),
                    "pass_rate": sum(1 for item in items if item.passed) / len(items),
                    "average_score": sum(item.score for item in items) / len(items),
                    "average_execution_time_ms": sum(item.execution_time_ms for item in items)
                    / len(items),
                    "issue_tags": dict(
                        Counter(tag for item in items for tag in item.issue_tags)
                    ),
                }
            )
        return summaries

    def classification_fields(self) -> List[str]:
        return ["difficulty", "category", "source", "query_language"]

    def enrich_metadata(self) -> None:
        self.metadata["classification_summaries"] = self.classification_summaries()
        self.metadata["evaluator_summaries"] = self.evaluator_summaries()
        self.metadata["classification_fields"] = self.classification_fields()

    def get_failures(self) -> List[EvaluationResult]:
        return [item for item in self.results if not item.passed]

    def _config_snapshot(self) -> Dict[str, Any]:
        snapshot = self.metadata.get("config_snapshot")
        return snapshot if isinstance(snapshot, dict) else {}

    def _metadata_value(self, key: str) -> Any:
        snapshot = self._config_snapshot()
        if key in snapshot and snapshot[key] not in (None, ""):
            return snapshot[key]

        value = self.metadata.get(key)
        if value not in (None, ""):
            return value
        return None

    def _evaluation_model_info(self) -> List[tuple[str, str]]:
        return [
            ("Agent Model", str(self._metadata_value("agent_model") or "n/a")),
            ("Judge Model", str(self._metadata_value("judge_model") or "n/a")),
        ]

    def _sql_execution_status(self, result: EvaluationResult) -> str:
        artifact = result.agent_artifact
        return "SUCCESS" if artifact is not None and artifact.success else "FAIL"

    def print_summary(self) -> None:
        self.enrich_metadata()
        print(f"\n{'=' * 80}")
        print(f"EVALUATION REPORT: {self.dataset_name}")
        print(f"{'=' * 80}")
        print(f"Timestamp: {self.timestamp.isoformat()}")
        print(f"Run Status: {self.run_status()}")
        progress = self.run_progress()
        if progress:
            print(f"Progress: {progress}")
        print(f"Test Cases: {len(self.results)}")
        if self.evaluator_names:
            print(f"Evaluators: {', '.join(self.evaluator_names)}")
        print(f"Pass Rate: {self.pass_rate():.2%}")
        print(f"Average Score: {self.average_score():.2f}")
        print(f"Execution Success Rate: {self.execution_success_rate():.2%}")
        print(f"Average Time: {self.average_execution_time():.0f}ms")
        print(f"{'=' * 80}\n")

    def save_json(self, path: str | Path) -> None:
        self.enrich_metadata()
        with open(path, "w", encoding="utf-8") as f:
            json.dump(self.model_dump(mode="json"), f, indent=2, ensure_ascii=False)

    def save_csv(self, path: str | Path) -> None:
        self.enrich_metadata()
        with open(path, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(
                [
                    "test_case_id",
                    "database_id",
                    "dialect",
                    "difficulty",
                    "category",
                    "source",
                    "query_language",
                    "passed",
                    "score",
                    "reason",
                    "issue_tags",
                    "execution_time_ms",
                    "evaluator_breakdown",
                    "agent_sql",
                    "ground_truth_sql",
                ]
            )
            for result in self.results:
                classifications = result.test_case.classification_dimensions()
                writer.writerow(
                    [
                        result.test_case.id,
                        result.test_case.database_id,
                        result.test_case.dialect,
                        classifications["difficulty"],
                        classifications["category"],
                        classifications["source"],
                        classifications["query_language"],
                        result.passed,
                        f"{result.score:.4f}",
                        result.reason,
                        ",".join(result.issue_tags),
                        f"{result.execution_time_ms:.2f}",
                        self._format_evaluator_breakdown(result),
                        result.agent_artifact.sql_text if result.agent_artifact else "",
                        result.ground_truth_artifact.sql_text if result.ground_truth_artifact else "",
                    ]
                )

    def save_markdown(self, path: str | Path) -> None:
        self.enrich_metadata()
        lines = [
            f"# Evaluation Report: {self.dataset_name}",
            "",
            f"- Timestamp: {self.timestamp.isoformat()}",
            f"- Run status: {self.run_status()}",
            f"- Test cases: {len(self.results)}",
            f"- Evaluators: {', '.join(self.evaluator_names) if self.evaluator_names else 'n/a'}",
            f"- Pass rate: {self.pass_rate():.2%}",
            f"- Average score: {self.average_score():.2f}",
            "",
            "## Evaluator Summary",
            "| Evaluator | Cases | Pass Rate | Avg Score | Avg Time (ms) |",
            "|---|---:|---:|---:|---:|",
        ]
        for summary in self.evaluator_summaries():
            lines.append(
                f"| {summary['evaluator_name']} | {summary['count']} | "
                f"{summary['pass_rate']:.2%} | {summary['average_score']:.2f} | "
                f"{summary['average_execution_time_ms']:.0f} |"
            )

        for field, rows in self.classification_summaries().items():
            lines.extend(
                [
                    "",
                    f"## {self._classification_label(field)} Breakdown",
                    "| Value | Cases | Pass Rate | Avg Score | Avg Time (ms) |",
                    "|---|---:|---:|---:|---:|",
                ]
            )
            for row in rows:
                lines.append(
                    f"| {row['value']} | {row['count']} | {row['pass_rate']:.2%} | "
                    f"{row['average_score']:.2f} | {row['average_execution_time_ms']:.0f} |"
                )

        lines.extend(
            [
                "",
                "| Test Case | DB | Difficulty | Category | Source | Language | Pass | Score | Evaluators | Reason |",
                "|---|---|---|---|---|---|---:|---:|---|---|",
            ]
        )
        for result in self.results:
            reason = result.reason.replace("|", "\\|")
            classifications = result.test_case.classification_dimensions()
            lines.append(
                f"| {result.test_case.id} | {result.test_case.database_id} | "
                f"{classifications['difficulty']} | {classifications['category']} | "
                f"{classifications['source']} | {classifications['query_language']} | "
                f"{result.passed} | {result.score:.2f} | "
                f"{self._format_evaluator_breakdown(result).replace('|', ';')} | {reason} |"
            )
        Path(path).write_text("\n".join(lines), encoding="utf-8")

    def save_html(self, path: str | Path) -> None:
        self.enrich_metadata()
        rows = []
        for result in self.results:
            classifications = result.test_case.classification_dimensions()
            pass_label = "PASS" if result.passed else "FAIL"
            sql_execution_status = self._sql_execution_status(result)
            rows.append(
                "<tr"
                f' data-difficulty="{html.escape(classifications["difficulty"], quote=True)}"'
                f' data-category="{html.escape(classifications["category"], quote=True)}"'
                f' data-source="{html.escape(classifications["source"], quote=True)}"'
                f' data-query-language="{html.escape(classifications["query_language"], quote=True)}"'
                f' data-passed="{pass_label}"'
                f' data-sql-execution="{sql_execution_status}"'
                ">"
                f"<td>{html.escape(result.test_case.id)}</td>"
                f"<td>{html.escape(result.test_case.database_id)}</td>"
                f"<td>{html.escape(classifications['difficulty'])}</td>"
                f"<td>{html.escape(classifications['category'])}</td>"
                f"<td>{html.escape(classifications['source'])}</td>"
                f"<td>{html.escape(classifications['query_language'])}</td>"
                f"<td>{pass_label}</td>"
                f"<td>{sql_execution_status}</td>"
                f"<td>{result.score:.2f}</td>"
                f"<td>{html.escape(self._format_evaluator_breakdown(result))}</td>"
                f"<td>{html.escape(result.reason)}</td>"
                "</tr>"
            )

        classification_sections = []
        for field, rows_summary in self.classification_summaries().items():
            table_rows = []
            for row in rows_summary:
                table_rows.append(
                    "<tr>"
                    f"<td>{html.escape(str(row['value']))}</td>"
                    f"<td>{row['count']}</td>"
                    f"<td>{row['pass_rate']:.2%}</td>"
                    f"<td>{row['average_score']:.2f}</td>"
                    f"<td>{row['average_execution_time_ms']:.0f}</td>"
                    "</tr>"
                )
            classification_sections.append(
                f"<section class='summary-block'><h3>{html.escape(self._classification_label(field))} Breakdown</h3>"
                "<table>"
                "<thead><tr><th>Value</th><th>Cases</th><th>Pass Rate</th><th>Avg Score</th><th>Avg Time (ms)</th></tr></thead>"
                f"<tbody>{''.join(table_rows)}</tbody>"
                "</table></section>"
            )

        evaluator_rows = []
        for summary in self.evaluator_summaries():
            evaluator_rows.append(
                "<tr>"
                f"<td>{html.escape(summary['evaluator_name'])}</td>"
                f"<td>{summary['count']}</td>"
                f"<td>{summary['pass_rate']:.2%}</td>"
                f"<td>{summary['average_score']:.2f}</td>"
                f"<td>{summary['average_execution_time_ms']:.0f}</td>"
                "</tr>"
            )

        difficulty_options = self._classification_options("difficulty")
        category_options = self._classification_options("category")
        source_options = self._classification_options("source")
        language_options = self._classification_options("query_language")
        model_info_rows = "".join(
            f"<div class='model-row'><span>{html.escape(label)}</span>"
            f"<strong>{html.escape(value)}</strong></div>"
            for label, value in self._evaluation_model_info()
        )
        run_status = self.run_status()
        progress = self.run_progress()
        banner = ""
        if run_status and run_status != "completed":
            progress_text = f" ({progress})" if progress else ""
            banner = (
                f"<section class='banner warning'><strong>Partial run</strong>"
                f"<span> - status: {html.escape(run_status)}{html.escape(progress_text)}</span>"
                "</section>"
            )

        html_text = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>QueryMind Evaluation Report</title>
<style>
body {{ font-family: Arial, sans-serif; margin: 24px; color: #1f1f1f; background: #fff; }}
section {{ margin-bottom: 24px; }}
.banner {{ padding: 12px 16px; border-radius: 10px; margin-bottom: 16px; }}
.banner.warning {{ background: #fff8e1; border: 1px solid #f2c94c; color: #6b4f00; }}
.report-header {{ display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; margin-bottom: 8px; flex-wrap: wrap; }}
.report-title {{ min-width: 0; flex: 1 1 320px; }}
.model-card {{ flex: 0 1 360px; padding: 14px 16px; border: 1px solid #d7dde5; border-radius: 14px; background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%); box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06); }}
.model-card .card-label {{ font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; }}
.model-row {{ display: flex; justify-content: space-between; gap: 16px; padding: 8px 0; border-top: 1px solid #e8edf3; }}
.model-row:first-of-type {{ border-top: 0; padding-top: 0; }}
.model-row span {{ color: #475569; }}
.model-row strong {{ color: #0f172a; text-align: right; word-break: break-word; }}
.metrics {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 24px; }}
.metric {{ padding: 12px 16px; border: 1px solid #ddd; border-radius: 10px; background: #fafafa; }}
.metric .label {{ font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.04em; }}
.metric .value {{ font-size: 24px; font-weight: 700; margin-top: 4px; }}
.filters {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 16px; }}
.filters label {{ display: block; font-size: 12px; color: #444; margin-bottom: 4px; }}
.filters select {{ width: 100%; padding: 8px; }}
table {{ border-collapse: collapse; width: 100%; }}
th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
th {{ background: #f5f5f5; }}
tbody tr:nth-child(even) {{ background: #fcfcfc; }}
.summary-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }}
.summary-block table {{ margin-top: 8px; }}
.muted {{ color: #666; font-size: 12px; }}
</style>
</head>
<body>
<div class="report-header">
  <div class="report-title">
    <h1>{html.escape(self.dataset_name)}</h1>
    <p class="muted">Timestamp: {self.timestamp.isoformat()}</p>
  </div>
  <aside class="model-card">
    <div class="card-label">Batch Models</div>
    {model_info_rows}
  </aside>
</div>
{banner}
<div class="metrics">
  <div class="metric"><div class="label">Test Cases</div><div class="value">{len(self.results)}</div></div>
  <div class="metric"><div class="label">Run Status</div><div class="value">{html.escape(run_status)}</div></div>
  <div class="metric"><div class="label">Pass Rate</div><div class="value">{self.pass_rate():.2%}</div></div>
  <div class="metric"><div class="label">Average Score</div><div class="value">{self.average_score():.2f}</div></div>
  <div class="metric"><div class="label">Execution Success Rate</div><div class="value">{self.execution_success_rate():.2%}</div></div>
</div>
<section>
<h2>Evaluator Summary</h2>
<table>
<thead><tr><th>Evaluator</th><th>Cases</th><th>Pass Rate</th><th>Avg Score</th><th>Avg Time (ms)</th></tr></thead>
<tbody>
{''.join(evaluator_rows)}
</tbody>
</table>
</section>
<section class="summary-grid">
{''.join(classification_sections)}
</section>
<section>
<h2>Result Filters</h2>
<div class="filters">
  <div><label for="pass-filter">Pass / Fail</label><select id="pass-filter" onchange="applyFilters()"><option value="all">All</option><option value="PASS">PASS</option><option value="FAIL">FAIL</option></select></div>
  <div><label for="sql-execution-filter">SQL Execution</label><select id="sql-execution-filter" onchange="applyFilters()"><option value="all">All</option><option value="SUCCESS">SUCCESS</option><option value="FAIL">FAIL</option></select></div>
  <div><label for="difficulty-filter">Difficulty</label><select id="difficulty-filter" onchange="applyFilters()">{self._render_select_options(difficulty_options)}</select></div>
  <div><label for="category-filter">Category</label><select id="category-filter" onchange="applyFilters()">{self._render_select_options(category_options)}</select></div>
  <div><label for="source-filter">Source</label><select id="source-filter" onchange="applyFilters()">{self._render_select_options(source_options)}</select></div>
  <div><label for="language-filter">Query Language</label><select id="language-filter" onchange="applyFilters()">{self._render_select_options(language_options)}</select></div>
</div>
<p class="muted"><span id="visible-count">{len(self.results)}</span> / {len(self.results)} visible</p>
</section>
<section>
<h2>Results</h2>
<table>
<thead>
<tr><th>Test Case</th><th>Database</th><th>Difficulty</th><th>Category</th><th>Source</th><th>Language</th><th>Pass</th><th>SQL Execution</th><th>Score</th><th>Evaluators</th><th>Reason</th></tr>
</thead>
<tbody id="results-body">
{''.join(rows)}
</tbody>
</table>
</section>
<script>
function applyFilters() {{
  const passStatus = document.getElementById('pass-filter').value;
  const sqlExecution = document.getElementById('sql-execution-filter').value;
  const difficulty = document.getElementById('difficulty-filter').value;
  const category = document.getElementById('category-filter').value;
  const source = document.getElementById('source-filter').value;
  const language = document.getElementById('language-filter').value;
  const rows = document.querySelectorAll('#results-body tr');
  let visible = 0;
  rows.forEach((row) => {{
    const matches = (!passStatus || passStatus === 'all' || row.dataset.passed === passStatus)
      && (!sqlExecution || sqlExecution === 'all' || row.dataset.sqlExecution === sqlExecution)
      && (!difficulty || difficulty === 'all' || row.dataset.difficulty === difficulty)
      && (!category || category === 'all' || row.dataset.category === category)
      && (!source || source === 'all' || row.dataset.source === source)
      && (!language || language === 'all' || row.dataset.queryLanguage === language);
    row.style.display = matches ? '' : 'none';
    if (matches) {{
      visible += 1;
    }}
  }});
  document.getElementById('visible-count').textContent = String(visible);
}}
window.addEventListener('DOMContentLoaded', applyFilters);
</script>
</body>
</html>
"""
        Path(path).write_text(html_text, encoding="utf-8")

    def _classification_value(self, result: EvaluationResult, field: str) -> str:
        labels = result.test_case.classification_dimensions()
        return labels.get(field, "unspecified")

    def _build_classification_summary(self, field: str) -> List[Dict[str, Any]]:
        grouped: Dict[str, List[EvaluationResult]] = defaultdict(list)
        for result in self.results:
            grouped[self._classification_value(result, field)].append(result)

        rows = []
        for value, items in sorted(grouped.items(), key=lambda item: (-len(item[1]), item[0])):
            count = len(items)
            pass_count = sum(1 for item in items if item.passed)
            rows.append(
                {
                    "value": value,
                    "count": count,
                    "pass_count": pass_count,
                    "pass_rate": pass_count / count if count else 0.0,
                    "average_score": sum(item.score for item in items) / count if count else 0.0,
                    "average_execution_time_ms": sum(item.execution_time_ms for item in items)
                    / count if count else 0.0,
                }
            )
        return rows

    def _per_evaluator_results(self, result: EvaluationResult) -> Dict[str, EvaluationResult]:
        entries = result.metadata.get("per_evaluator_results", []) if result.metadata else []
        mapped: Dict[str, EvaluationResult] = {}
        for entry in entries:
            if not isinstance(entry, dict):
                continue
            evaluator_name = entry.get("evaluator_name")
            payload = entry.get("result")
            if not evaluator_name or not isinstance(payload, dict):
                continue
            try:
                mapped[str(evaluator_name)] = EvaluationResult.model_validate(payload)
            except Exception:
                continue
        return mapped

    def _format_evaluator_breakdown(self, result: EvaluationResult) -> str:
        mapping = self._per_evaluator_results(result)
        ordered_names = list(self.evaluator_names)
        for name in mapping:
            if name not in ordered_names:
                ordered_names.append(name)

        parts = []
        for name in ordered_names:
            evaluator_result = mapping.get(name)
            if evaluator_result is None:
                continue
            parts.append(
                f"{name}: {evaluator_result.score:.2f} "
                f"({'PASS' if evaluator_result.passed else 'FAIL'})"
            )
        return " | ".join(parts)

    def _classification_options(self, field: str) -> List[str]:
        options = [row["value"] for row in self._build_classification_summary(field)]
        return options

    def _render_select_options(self, options: List[str]) -> str:
        rendered = ['<option value="all">All</option>']
        for option in options:
            rendered.append(
                f'<option value="{html.escape(option, quote=True)}">{html.escape(option)}</option>'
            )
        return "".join(rendered)

    def _classification_label(self, field: str) -> str:
        labels = {
            "difficulty": "Difficulty",
            "category": "Category",
            "source": "Source",
            "query_language": "Query Language",
        }
        return labels.get(field, field.replace("_", " ").title())


class ComparisonReport(BaseModel):
    """Comparison across multiple evaluation reports."""

    reports: Dict[str, EvaluationReport]
    timestamp: datetime = Field(default_factory=_utc_now)

    def best_by_score(self) -> str:
        return max(self.reports.items(), key=lambda item: item[1].average_score())[0]
