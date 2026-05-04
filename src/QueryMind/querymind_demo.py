"""QueryMind demo orchestrator."""

from __future__ import annotations

import argparse
import os
import signal
import subprocess
import sys
import time
import urllib.request
from pathlib import Path
from typing import Optional

REPO_ROOT = Path(__file__).resolve().parents[2]
PYTHON = sys.executable
AGENT_SCRIPT = REPO_ROOT / "my_agent.py"
WEB_SCRIPT = REPO_ROOT / "webcomponent_demo.py"

DEFAULT_AGENT_HOST = os.getenv("QUERYMIND_AGENT_HOST", "0.0.0.0")
DEFAULT_AGENT_PORT = int(os.getenv("QUERYMIND_AGENT_PORT", "8000"))
DEFAULT_WEB_HOST = os.getenv("QUERYMIND_WEB_HOST", "127.0.0.1")
DEFAULT_WEB_PORT = int(os.getenv("QUERYMIND_WEB_PORT", "8080"))
DEFAULT_API_BASE = os.getenv("QUERYMIND_API_BASE")
DEFAULT_STARTUP_TIMEOUT = float(os.getenv("QUERYMIND_STARTUP_TIMEOUT", "90"))
DEFAULT_POLL_INTERVAL = float(os.getenv("QUERYMIND_POLL_INTERVAL", "1.0"))


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="QueryMind unified demo launcher")
    subparsers = parser.add_subparsers(dest="command", required=True)

    agent_parser = subparsers.add_parser("agent-only", help="Start the agent backend only")
    agent_parser.add_argument("--host", default=DEFAULT_AGENT_HOST, help="Backend bind host")
    agent_parser.add_argument("--port", type=int, default=DEFAULT_AGENT_PORT, help="Backend port")

    web_parser = subparsers.add_parser("web-only", help="Start the frontend demo only")
    web_parser.add_argument("--host", default=DEFAULT_WEB_HOST, help="Web bind host")
    web_parser.add_argument("--port", type=int, default=DEFAULT_WEB_PORT, help="Web port")
    web_parser.add_argument(
        "--api-base",
        default=DEFAULT_API_BASE,
        help="Backend base URL used by the demo page",
    )
    web_parser.add_argument(
        "--no-open",
        action="store_true",
        help="Start the server without opening the browser",
    )

    demo_parser = subparsers.add_parser(
        "demo",
        help="Start backend and frontend together and open the demo",
    )
    demo_parser.add_argument("--agent-host", default=DEFAULT_AGENT_HOST, help="Backend bind host")
    demo_parser.add_argument("--agent-port", type=int, default=DEFAULT_AGENT_PORT, help="Backend port")
    demo_parser.add_argument("--web-host", default=DEFAULT_WEB_HOST, help="Web bind host")
    demo_parser.add_argument("--web-port", type=int, default=DEFAULT_WEB_PORT, help="Web port")
    demo_parser.add_argument(
        "--api-base",
        default=None,
        help="Backend base URL used by the demo page",
    )
    demo_parser.add_argument(
        "--health-url",
        default=None,
        help="Health-check URL used to wait for backend readiness",
    )
    demo_parser.add_argument(
        "--startup-timeout",
        type=float,
        default=DEFAULT_STARTUP_TIMEOUT,
        help="Seconds to wait for backend readiness before failing",
    )
    demo_parser.add_argument(
        "--poll-interval",
        type=float,
        default=DEFAULT_POLL_INTERVAL,
        help="Seconds between health-check polls",
    )
    demo_parser.add_argument(
        "--no-open",
        action="store_true",
        help="Start the demo without opening the browser",
    )

    return parser.parse_args()


def _launch_process(script: Path, args: list[str]) -> subprocess.Popen[str]:
    if not script.exists():
        raise FileNotFoundError(f"Missing launcher: {script}")
    cmd = [PYTHON, str(script), *args]
    return subprocess.Popen(cmd)


def _public_host(bind_host: str) -> str:
    if bind_host in {"0.0.0.0", "::"}:
        return "127.0.0.1"
    return bind_host


def _wait_for_health(url: str, timeout: float, poll_interval: float) -> None:
    deadline = time.monotonic() + timeout
    last_error: Optional[Exception] = None
    while time.monotonic() < deadline:
        try:
            with urllib.request.urlopen(url, timeout=5) as response:
                if 200 <= getattr(response, "status", 200) < 300:
                    return
        except Exception as exc:  # noqa: BLE001
            last_error = exc
        time.sleep(poll_interval)

    raise TimeoutError(f"Backend did not become healthy at {url!r}") from last_error


def _terminate_process(proc: subprocess.Popen[str]) -> None:
    if proc.poll() is not None:
        return

    try:
        if os.name == "nt":
            proc.terminate()
        else:
            proc.send_signal(signal.SIGINT)
        proc.wait(timeout=10)
    except Exception:  # noqa: BLE001
        try:
            proc.kill()
        except Exception:  # noqa: BLE001
            pass


def _run_agent_only(args: argparse.Namespace) -> int:
    proc = _launch_process(AGENT_SCRIPT, ["--host", args.host, "--port", str(args.port)])
    return proc.wait()


def _run_web_only(args: argparse.Namespace) -> int:
    api_base = args.api_base or DEFAULT_API_BASE or f"http://127.0.0.1:{DEFAULT_AGENT_PORT}"
    web_args = [
        "--host",
        args.host,
        "--port",
        str(args.port),
        "--api-base",
        api_base,
    ]
    if args.no_open:
        web_args.append("--no-open")
    proc = _launch_process(WEB_SCRIPT, web_args)
    return proc.wait()


def _run_demo(args: argparse.Namespace) -> int:
    api_base = args.api_base or f"http://{_public_host(args.agent_host)}:{args.agent_port}"
    health_url = args.health_url or f"{api_base.rstrip('/')}/health"

    agent_proc = _launch_process(
        AGENT_SCRIPT,
        ["--host", args.agent_host, "--port", str(args.agent_port)],
    )
    web_proc: Optional[subprocess.Popen[str]] = None

    try:
        _wait_for_health(health_url, args.startup_timeout, args.poll_interval)
        web_args = [
            "--host",
            args.web_host,
            "--port",
            str(args.web_port),
            "--api-base",
            api_base,
        ]
        if args.no_open:
            web_args.append("--no-open")
        web_proc = _launch_process(WEB_SCRIPT, web_args)
        return web_proc.wait()
    finally:
        if web_proc is not None:
            _terminate_process(web_proc)
        _terminate_process(agent_proc)


def main() -> int:
    args = parse_args()
    if args.command == "agent-only":
        return _run_agent_only(args)
    if args.command == "web-only":
        return _run_web_only(args)
    if args.command == "demo":
        return _run_demo(args)
    raise ValueError(f"Unsupported command: {args.command!r}")


if __name__ == "__main__":
    raise SystemExit(main())
