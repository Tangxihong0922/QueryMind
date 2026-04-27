from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from evals.bootstrap import resolve_evaluation_providers  # noqa: E402


def test_resolve_evaluation_providers_uses_role_specific_env(monkeypatch) -> None:
    monkeypatch.delenv("EVAL_PROVIDER", raising=False)
    monkeypatch.setenv("EVAL_AGENT_LLM_PROVIDER", "minimax")
    monkeypatch.setenv("EVAL_JUDGE_LLM_PROVIDER", "deepseek")

    agent_provider, judge_provider = resolve_evaluation_providers()

    assert agent_provider == "minimax"
    assert judge_provider == "deepseek"


def test_resolve_evaluation_providers_cli_override_wins(monkeypatch) -> None:
    monkeypatch.setenv("EVAL_AGENT_LLM_PROVIDER", "minimax")
    monkeypatch.setenv("EVAL_JUDGE_LLM_PROVIDER", "deepseek")

    agent_provider, judge_provider = resolve_evaluation_providers("deepseek")

    assert agent_provider == "deepseek"
    assert judge_provider == "deepseek"
