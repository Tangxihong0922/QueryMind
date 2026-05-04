"""Launch the QueryMind webcomponent demo from the repository root."""

from __future__ import annotations

import argparse
import html
import os
import re
import threading
import time
import webbrowser
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

REPO_ROOT = Path(__file__).resolve().parent
WEB_DIR = REPO_ROOT / "frontends" / "webcomponent"
DEMO_HTML = WEB_DIR / "demo.html"
STATIC_BUNDLE = WEB_DIR / "static" / "querymind-components.js"
DIST_BUNDLE = WEB_DIR / "dist" / "querymind-components.js"
DEFAULT_HOST = os.getenv("QUERYMIND_WEB_HOST", "127.0.0.1")
DEFAULT_PORT = int(os.getenv("QUERYMIND_WEB_PORT", "8080"))
DEFAULT_API_BASE = os.getenv("QUERYMIND_API_BASE", "http://localhost:8000")


def _browser_host(bind_host: str) -> str:
    if bind_host in {"0.0.0.0", "::"}:
        return "localhost"
    return bind_host


def _bundle_source() -> Path:
    if STATIC_BUNDLE.exists():
        return STATIC_BUNDLE
    return DIST_BUNDLE


def _ensure_assets() -> None:
    if not DEMO_HTML.exists():
        raise FileNotFoundError(f"Missing demo page: {DEMO_HTML}")
    if not _bundle_source().exists():
        raise FileNotFoundError(
            "Missing webcomponent bundle. Run `npm run build` inside "
            f"{WEB_DIR} before launching the demo."
        )


class DemoHandler(SimpleHTTPRequestHandler):
    """Serve the demo HTML and static bundle from the webcomponent directory."""

    def __init__(self, *args, api_base: str, **kwargs):
        self._api_base = api_base
        super().__init__(*args, directory=str(WEB_DIR), **kwargs)

    def log_message(self, format: str, *args) -> None:  # noqa: A003
        # Keep the launcher output focused on the startup status.
        return

    def do_GET(self) -> None:  # noqa: N802
        path = urlsplit(self.path).path
        if path in {"", "/", "/index.html", "/demo.html"}:
            self._serve_demo()
            return
        if path == "/static/querymind-components.js":
            self._serve_bundle()
            return
        super().do_GET()

    def _serve_demo(self) -> None:
        html_text = DEMO_HTML.read_text(encoding="utf-8")
        rewritten = re.sub(
            r'api-base="[^"]*"',
            f'api-base="{html.escape(self._api_base, quote=True)}"',
            html_text,
            count=1,
        )
        payload = rewritten.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def _serve_bundle(self) -> None:
        bundle = _bundle_source()
        payload = bundle.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", "application/javascript; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Launch the QueryMind web demo")
    parser.add_argument("--host", default=DEFAULT_HOST, help="Host interface to bind")
    parser.add_argument(
        "--port",
        type=int,
        default=DEFAULT_PORT,
        help="Port for the local static server",
    )
    parser.add_argument(
        "--api-base",
        default=DEFAULT_API_BASE,
        help="Backend base URL used by the demo page",
    )
    parser.add_argument(
        "--no-open",
        action="store_true",
        help="Start the server without opening the browser",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    _ensure_assets()

    handler = partial(DemoHandler, api_base=args.api_base)
    server = ThreadingHTTPServer((args.host, args.port), handler)
    browser_url = f"http://{_browser_host(args.host)}:{args.port}/demo.html"

    print(f"Serving QueryMind web demo from {WEB_DIR}")
    print(f"Demo page: {browser_url}")
    print(f"Backend API base: {args.api_base}")

    if not args.no_open:
        threading.Thread(
            target=lambda: (time.sleep(0.5), webbrowser.open(browser_url, new=2)),
            daemon=True,
        ).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down demo server...")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
