"""
FastAPI server factory for QueryMind Agents.
"""

import inspect
from contextlib import asynccontextmanager
from typing import Any, Dict, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from ..base import ChatHandler
from .routes import register_chat_routes, register_metrics_routes, register_schema_routes

import logging

logger = logging.getLogger(__name__)


class QueryMindFastAPIServer:
    """FastAPI server factory for QueryMind Agents."""

    def __init__(self, agent: Any, config: Optional[Dict[str, Any]] = None):
        """Initialize FastAPI server.

        Args:
            agent: The agent to serve
            config: Optional server configuration
        """
        self.agent = agent
        self.config = config or {}
        self.chat_handler = ChatHandler(agent)

    def _find_schema_memory_from_workflow(self):
        """Extract schema_memory from workflow_handler if available.
        
        Returns:
            SchemaMemory instance if found, None otherwise
        """
        if not hasattr(self.agent, 'workflow_handler') or self.agent.workflow_handler is None:
            return None
            
        wh = self.agent.workflow_handler
        # Handle CompositeWorkflowHandler which has _handlers list
        if hasattr(wh, '_handlers'):
            for handler in wh._handlers:
                if handler.__class__.__name__ == 'SchemaInitWorkflow':
                    engine = getattr(handler, '_engine', None)
                    if engine is not None:
                        return getattr(engine, '_schema_memory', None)
        
        # Handle single workflow handler
        if hasattr(wh, '_engine'):
            return getattr(wh._engine, '_schema_memory', None)
            
        return None

    @asynccontextmanager
    async def _lifespan_handler(self, app: FastAPI):
        """Lifespan context manager for application startup/shutdown.
        
        Handles SchemaMemory cold-start initialization on application startup.
        """
        schema_mem = None
        
        # Find SchemaMemory from multiple sources
        # 1. Check agent.schema_memory directly
        if hasattr(self.agent, 'schema_memory') and self.agent.schema_memory is not None:
            schema_mem = self.agent.schema_memory
        # 2. Check workflow_handler (CompositeWorkflowHandler -> SchemaInitWorkflow -> engine)
        elif hasattr(self.agent, 'workflow_handler'):
            schema_mem = self._find_schema_memory_from_workflow()
        
        # Startup: Initialize SchemaMemory if found
        if schema_mem is not None:
            try:
                logger.info("Initializing SchemaMemory on startup...")
                if hasattr(schema_mem, 'initialize'):
                    await schema_mem.initialize()
                logger.info("SchemaMemory initialized successfully")
            except Exception as e:
                logger.warning(f"SchemaMemory initialization failed on startup: {e}")
                # Don't fail startup if schema init fails
        else:
            logger.info("No SchemaMemory found - use /init_schema command to initialize manually")
        
        yield
        
        # Shutdown: cleanup SchemaMemory if found
        if schema_mem is not None:
            if hasattr(schema_mem, 'close'):
                try:
                    close_result = schema_mem.close()
                    if inspect.isawaitable(close_result):
                        await close_result
                    logger.info("SchemaMemory closed")
                except Exception as e:
                    logger.warning(f"SchemaMemory close failed: {e}")

    def create_app(self) -> FastAPI:
        """Create configured FastAPI app.

        Returns:
            Configured FastAPI application
        """
        # Create lifespan context manager for startup/shutdown
        async def lifespan(app: FastAPI):
            async with self._lifespan_handler(app):
                yield
        
        # Create FastAPI app
        app_config = self.config.get("fastapi", {})
        app = FastAPI(
            title="QueryMind Agents API",
            description="API server for QueryMind Agents framework",
            version="0.1.0",
            lifespan=lifespan,  # Add lifespan handler
            **app_config,
        )

        # Configure CORS if enabled
        cors_config = self.config.get("cors", {})
        if cors_config.get("enabled", True):
            cors_params = {k: v for k, v in cors_config.items() if k != "enabled"}

            # Set sensible defaults
            cors_params.setdefault("allow_origins", ["*"])
            cors_params.setdefault("allow_credentials", True)
            cors_params.setdefault("allow_methods", ["*"])
            cors_params.setdefault("allow_headers", ["*"])

            app.add_middleware(CORSMiddleware, **cors_params)

        # Add static file serving in dev mode
        dev_mode = self.config.get("dev_mode", False)
        if dev_mode:
            static_folder = self.config.get("static_folder", "static")
            try:
                import os

                if os.path.exists(static_folder):
                    app.mount(
                        "/static", StaticFiles(directory=static_folder), name="static"
                    )
            except Exception:
                pass  # Static files not available

        # Register routes
        register_chat_routes(app, self.chat_handler, self.config)
        register_metrics_routes(app, self.agent, self.config)
        register_schema_routes(app, self.agent, self.config)

        # Add health check
        @app.get("/health")
        async def health_check() -> Dict[str, str]:
            return {"status": "healthy", "service": "querymind"}

        return app

    def run(self, **kwargs: Any) -> None:
        """Run the FastAPI server.

        This method automatically detects if running in an async environment
        (Jupyter, Colab, IPython, etc.) and handles accordingly.

        Args:
            **kwargs: Arguments passed to uvicorn configuration
        """
        import sys
        import asyncio
        import uvicorn

        # Check if we're in an environment with a running event loop FIRST
        in_async_env = False
        try:
            asyncio.get_running_loop()
            in_async_env = True
        except RuntimeError:
            in_async_env = False

        # If in async environment, apply nest_asyncio BEFORE creating the app
        if in_async_env:
            try:
                import nest_asyncio

                nest_asyncio.apply()
            except ImportError:
                print("Warning: nest_asyncio not installed. Installing...")
                import subprocess

                subprocess.check_call(
                    [sys.executable, "-m", "pip", "install", "nest_asyncio"]
                )
                import nest_asyncio

                nest_asyncio.apply()

        # Now create the app after nest_asyncio is applied
        app = self.create_app()

        # Set defaults
        run_kwargs = {"host": "0.0.0.0", "port": 8000, "log_level": "info", **kwargs}

        # Get the port and other config from run_kwargs
        port = run_kwargs.get("port", 8000)
        host = run_kwargs.get("host", "0.0.0.0")
        log_level = run_kwargs.get("log_level", "info")

        # Check if we're specifically in Google Colab for port forwarding
        in_colab = "google.colab" in sys.modules

        if in_colab:
            try:
                from google.colab import output

                output.serve_kernel_port_as_window(port)
                from google.colab.output import eval_js

                print("Your app is running at:")
                print(eval_js(f"google.colab.kernel.proxyPort({port})"))
            except Exception as e:
                print(f"Warning: Could not set up Colab port forwarding: {e}")
                print(f"Your app is running at: http://localhost:{port}")
        else:
            print("Your app is running at:")
            print(f"http://localhost:{port}")

        if in_async_env:
            # In Jupyter/Colab, create config with loop="asyncio" and use asyncio.run()
            config = uvicorn.Config(
                app, host=host, port=port, log_level=log_level, loop="asyncio"
            )
            server = uvicorn.Server(config)
            asyncio.run(server.serve())
        else:
            # Normal execution outside of Jupyter/Colab
            uvicorn.run(app, **run_kwargs)
