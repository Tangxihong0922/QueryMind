"""
Schema Init Workflow Handler.

This module provides a WorkflowHandler implementation for schema initialization,
allowing administrators to trigger SchemaMemory initialization via the /init_schema command.
"""

from __future__ import annotations

import html
import logging
import traceback
from typing import TYPE_CHECKING, List, Optional

from .base import WorkflowHandler, WorkflowResult

if TYPE_CHECKING:
    from ..agent.agent import Agent
    from ..user.models import User
    from ..storage import Conversation
    from ...capabilities.schema_extracter import SchemaExtractor, SchemaSyncEngine
    from ...components import UiComponent
    
logger = logging.getLogger(__name__)


class SchemaInitWorkflow(WorkflowHandler):
    """
    Workflow handler for SchemaMemory initialization commands.
    
    This workflow allows administrators to trigger schema initialization
    using the /init_schema command.
    
    Supported Commands:
        /init_schema      - Full initialization (upsert mode)
        /init_schema force - Clear existing data and reinitialize
    
    Permissions:
        - Only users with 'admin' group membership can execute this command.
    
    Example:
        >>> from QueryMind.core.workflow import SchemaInitWorkflow
        >>> 
        >>> workflow = SchemaInitWorkflow(
        ...     schema_sync_engine=engine,
        ...     extractor=PostgresSchemaExtractor(connection_string="...")
        ... )
        >>> 
        >>> # Add to Agent
        >>> agent = Agent(
        ...     workflow_handler=workflow,
        ...     ...
        ... )
    """

    def __init__(
        self,
        schema_sync_engine: "SchemaSyncEngine",
        extractor: Optional["SchemaExtractor"] = None,
    ):
        """
        Initialize the schema init workflow.
        
        Args:
            schema_sync_engine: SchemaSyncEngine instance for initialization
            extractor: Optional default extractor; can be set via set_extractor()
        """
        self._engine = schema_sync_engine
        self._extractor = extractor

    def set_extractor(self, extractor: "SchemaExtractor") -> None:
        """
        Set or update the schema extractor.
        
        Args:
            extractor: SchemaExtractor implementation
        """
        self._extractor = extractor

    async def try_handle(
        self,
        agent: "Agent",
        user: "User",
        conversation: "Conversation",
        message: str
    ) -> WorkflowResult:
        """
        Attempt to handle the /init_schema command.
        
        Args:
            agent: Agent instance
            user: Current user
            conversation: Current conversation
            message: User message
            
        Returns:
            WorkflowResult indicating whether the command was handled
        """
        from ...components import UiComponent
        from ...components.rich import RichTextComponent, StatusCardComponent, CardComponent
        from ...components.simple import SimpleTextComponent
        
        # Check for /init_schema command
        normalized = message.strip().lower()
        
        if not normalized.startswith("/init_schema"):
            # Not our command, pass through
            return WorkflowResult(should_skip_llm=False)
        
        # Check permissions
        if "admin" not in user.group_memberships:
            return WorkflowResult(
                should_skip_llm=True,
                components=[
                    UiComponent(
                        rich_component=RichTextComponent(
                            content="# 🔒 Access Denied\n\n"
                                   "The `/init_schema` command is only available to administrators.\n\n"
                                   "If you need access, please contact your system administrator.",
                            markdown=True,
                        ),
                        simple_component=None,
                    )
                ],
            )
        
        # Parse command options
        force = "force" in normalized
        
        if not self._extractor:
            return WorkflowResult(
                should_skip_llm=True,
                components=[
                    UiComponent(
                        rich_component=StatusCardComponent(
                            title="Schema Init Error",
                            status="error",
                            description="No schema extractor configured. Cannot initialize SchemaMemory.",
                            icon="⚠️",
                        ),
                        simple_component=SimpleTextComponent(
                            text="Error: No schema extractor configured"
                        ),
                    )
                ],
            )
        
        # Execute initialization
        try:
            # Execute the actual initialization
            return await self.execute_init(
                extractor=self._extractor,
                force=force,
            )
            
        except Exception as e:
            logger.error(f"Error in schema init workflow: {e}", exc_info=True)
            return WorkflowResult(
                should_skip_llm=True,
                components=[
                    UiComponent(
                        rich_component=StatusCardComponent(
                            title="Schema Init Error",
                            status="error",
                            description=f"Failed to start initialization: {str(e)}",
                            icon="❌",
                        ),
                        simple_component=SimpleTextComponent(
                            text=f"Error: {str(e)}"
                        ),
                    )
                ],
            )

    async def execute_init(
        self,
        extractor: Optional["SchemaExtractor"] = None,
        force: bool = False,
    ) -> WorkflowResult:
        """
        Execute the schema initialization.
        
        This method should be called separately to execute the actual initialization
        after the initial status has been yielded.
        
        Args:
            extractor: SchemaExtractor to use (defaults to configured extractor)
            force: Whether to force full reinitialization
            
        Returns:
            WorkflowResult with initialization results
        """
        from ...components import UiComponent
        from ...components.rich import RichTextComponent, StatusCardComponent, CardComponent
        from ...components.simple import SimpleTextComponent
        
        use_extractor = extractor or self._extractor
        
        if not use_extractor:
            return WorkflowResult(
                should_skip_llm=True,
                components=[
                    UiComponent(
                        rich_component=StatusCardComponent(
                            title="Schema Init Error",
                            status="error",
                            description="No schema extractor configured",
                            icon="⚠️",
                        ),
                        simple_component=SimpleTextComponent(
                            text="Error: No schema extractor configured"
                        ),
                    )
                ],
            )
        
        try:
            # Execute initialization
            result = await self._engine.initialize(
                extractor=use_extractor,
                force=force,
            )
            
            # Build result components
            # Check for errors - if error_details exists and is not empty, treat as failure
            has_errors = bool(result.error_details)

            if result.success and not has_errors:
                # Complete success - no errors at all
                content = (
                    f"# ✅ Schema Init Complete\n\n"
                    f"**Source:** {result.source or 'Unknown'}\n\n"
                    f"**Results:**\n"
                    f"- Tables processed: {result.tables_processed}\n"
                    f"- Created: {result.tables_created}\n"
                    f"- Updated: {result.tables_updated}\n"
                    f"- Skipped existing: {result.tables_skipped_existing}\n"
                    f"- Duration: {result.duration_ms:.2f}ms\n"
                )
                
                card = CardComponent(
                    title="Schema Init Complete",
                    content=content,
                    icon="✅",
                    status="success",
                    markdown=True,
                )
                
                return WorkflowResult(
                    should_skip_llm=True,
                    components=[
                        UiComponent(
                            rich_component=card,
                            simple_component=SimpleTextComponent(
                                text=(
                                    f"Schema init complete: {result.tables_processed} tables processed, "
                                    f"{result.tables_skipped_existing} skipped, "
                                    f"in {result.duration_ms:.2f}ms"
                                )
                            ),
                        )
                    ],
                )
            elif result.success and has_errors:
                skipped_tables = len(result.error_details)
                sample_errors = "".join(
                    f"<li>{html.escape(err)}</li>" for err in result.error_details[:5]
                )
                content = (
                    f"Initialization completed with warnings after processing "
                    f"{result.tables_processed} table(s).<br>"
                    f"<strong>Skipped existing:</strong> {result.tables_skipped_existing}<br>"
                    f"<strong>Skipped tables:</strong> {skipped_tables}<br>"
                    f"<strong>Sample errors:</strong><ul>{sample_errors}</ul>"
                )

                card = StatusCardComponent(
                    title="⚠️ Schema Init Completed with Warnings",
                    status="warning",
                    description=content,
                    icon="⚠️",
                    metadata={
                        "tables_processed": result.tables_processed,
                        "tables_created": result.tables_created,
                        "tables_updated": result.tables_updated,
                        "tables_skipped_existing": result.tables_skipped_existing,
                        "skipped_tables": skipped_tables,
                        "error_samples": result.error_details[:5],
                    },
                )

                return WorkflowResult(
                    should_skip_llm=True,
                    components=[
                        UiComponent(
                            rich_component=card,
                            simple_component=SimpleTextComponent(
                                text=(
                                    f"Schema init completed with warnings: "
                                    f"{skipped_tables} table(s) skipped"
                                )
                            ),
                        )
                    ],
                )
            else:
                # Failure result (either result.success=False or has errors)
                failure_reason = result.abort_reason or result.error_message
                if not failure_reason and result.error_details:
                    failure_reason = result.error_details[0]
                sample_errors = "".join(
                    f"<li>{html.escape(err)}</li>" for err in result.error_details[:5]
                )
                samples_html = (
                    f"<br><strong>Sample errors:</strong><ul>{sample_errors}</ul>"
                    if sample_errors
                    else ""
                )

                description = (
                    f"Initialization stopped after processing {result.tables_processed} table(s).<br>"
                    f"<strong>Skipped existing:</strong> {result.tables_skipped_existing}<br>"
                    f"<strong>Reason:</strong> {html.escape(failure_reason or 'Unknown error')}"
                    f"{samples_html}"
                )

                card = StatusCardComponent(
                    title="❌ Schema Init Stopped" if result.stopped_early else "❌ Schema Init Failed",
                    status="error",
                    description=description,
                    icon="❌",
                    metadata={
                        "tables_processed": result.tables_processed,
                        "tables_created": result.tables_created,
                        "tables_updated": result.tables_updated,
                        "tables_skipped_existing": result.tables_skipped_existing,
                        "failure_reason": failure_reason or "Unknown error",
                        "stopped_early": result.stopped_early,
                        "error_samples": result.error_details[:5],
                    },
                )
                
                return WorkflowResult(
                    should_skip_llm=True,
                    components=[
                        UiComponent(
                            rich_component=card,
                            simple_component=SimpleTextComponent(
                                text=f"Schema init failed: {failure_reason or 'Unknown error'}"
                            ),
                        )
                    ],
                )
                
        except Exception as e:
            logger.error(f"Schema init error: {e}", exc_info=True)
            return WorkflowResult(
                should_skip_llm=True,
                components=[
                    UiComponent(
                        rich_component=StatusCardComponent(
                            title="Schema Init Error",
                            status="error",
                            description=f"Unexpected error: {str(e)}",
                            icon="❌",
                        ),
                        simple_component=SimpleTextComponent(
                            text=f"Error: {str(e)}"
                        ),
                    )
                ],
            )

    async def get_starter_ui(
        self,
        agent: "Agent",
        user: "User",
        conversation: "Conversation"
    ) -> Optional[List["UiComponent"]]:
        """
        Provide starter UI with schema init info for admins.
        
        Args:
            agent: Agent instance
            user: Current user
            conversation: Current conversation
            
        Returns:
            Optional list of UI components
        """
        from ...components import UiComponent
        from ...components.rich import RichTextComponent
        
        # Only show for admins
        if "admin" not in user.group_memberships:
            return None
        
        # Check if extractor is configured
        if not self._extractor:
            return None
        
        content = (
            "## 🔧 Admin: Schema Management\n\n"
            "Use `/init_schema` to synchronize database schema with SchemaMemory.\n\n"
            "**Options:**\n"
            "- `/init_schema` - Upsert mode (update existing, add new)\n"
            "- `/init_schema force` - Full reinitialization (clear & reload)\n"
        )
        
        return [
            UiComponent(
                rich_component=RichTextComponent(content=content, markdown=True),
                simple_component=None,
            )
        ]
