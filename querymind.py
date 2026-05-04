"""Executable wrapper for the QueryMind unified launcher."""

from __future__ import annotations

import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
SRC_DIR = SCRIPT_DIR / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from QueryMind.querymind_demo import main


if __name__ == "__main__":
    raise SystemExit(main())
