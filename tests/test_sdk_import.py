from __future__ import annotations

from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))


def test_sdk_imports_are_available() -> None:
    import QueryMind
    from QueryMind.rls_registry import RLSToolRegistry
    from QueryMind.tools import LocalFileSystem, RunSqlTool

    assert QueryMind.__version__ == "0.1.0"
    assert RLSToolRegistry.__name__ == "RLSToolRegistry"
    assert LocalFileSystem.__name__ == "LocalFileSystem"
    assert RunSqlTool.__name__ == "RunSqlTool"
