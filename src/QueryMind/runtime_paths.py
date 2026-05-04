"""Helpers for resolving repository-level runtime paths."""

from __future__ import annotations

import os
from pathlib import Path


def _repo_root() -> Path:
    return Path(__file__).resolve().parents[2]


def repo_root() -> Path:
    """Return the repository root directory."""
    return _repo_root()


def load_repo_env() -> None:
    """Load the repository-local .env file."""
    from dotenv import load_dotenv

    load_dotenv(_repo_root() / ".env", override=True)


def resolve_repo_path(value: str | None, default: Path) -> Path:
    """Resolve an environment-supplied path relative to the repository root."""
    if not value:
        return default

    path = Path(value).expanduser()
    if path.is_absolute():
        return path
    return (_repo_root() / path).resolve()


def resolve_data_dir(env_name: str, default_name: str) -> Path:
    """Resolve a directory path, creating it if necessary."""
    path = resolve_repo_path(os.getenv(env_name), _repo_root() / default_name)
    path.mkdir(parents=True, exist_ok=True)
    return path
