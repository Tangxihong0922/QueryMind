"""
Schema Management Workflow Handler.

This module provides WorkflowHandlers for SchemaMemory management commands:
- /schema_list: List all tables with completeness status
- /schema_detail [table]: View/edit single table schema
- /schema_enrich: AI-powered enrichment for incomplete schemas
"""

from __future__ import annotations

import logging
import re
from typing import TYPE_CHECKING, List, Optional, Dict, Any
from .base import WorkflowHandler, WorkflowResult

if TYPE_CHECKING:
    from ..agent.agent import Agent
    from ..user.models import User
    from ..storage import Conversation
    from ...capabilities.schema_management import SchemaManagementService
    from ...components import UiComponent

logger = logging.getLogger(__name__)


class SchemaManagementWorkflow(WorkflowHandler):
    """
    Workflow handler for SchemaMemory management commands.
    
    Supported commands:
        /schema_list              - List all tables with status
        /schema_list incomplete  - List only incomplete tables
        /schema_detail <table>    - View/edit single table
        /schema_enrich           - AI enrich incomplete schemas
        /schema_enrich <table>   - AI enrich specific table
    
    Permissions:
        - All commands require 'admin' group membership.
    
    Example:
        >>> from QueryMind.core.workflow import SchemaManagementWorkflow
        >>> 
        >>> workflow = SchemaManagementWorkflow(
        ...     schema_management_service=service
        ... )
        >>> 
        >>> agent = Agent(
        ...     workflow_handler=workflow,
        ...     ...
        ... )
    """

    def __init__(
        self,
        schema_management_service: "SchemaManagementService",
    ):
        """
        Initialize the schema management workflow.
        
        Args:
            schema_management_service: SchemaManagementService instance
        """
        self._service = schema_management_service

    async def try_handle(
        self,
        agent: "Agent",
        user: "User",
        conversation: "Conversation",
        message: str
    ) -> WorkflowResult:
        """
        Attempt to handle schema management commands.
        
        Args:
            agent: Agent instance
            user: Current user
            conversation: Current conversation
            message: User message
            
        Returns:
            WorkflowResult indicating whether command was handled
        """
        from ...components import UiComponent
        from ...components.rich import RichTextComponent, StatusCardComponent, CardComponent
        from ...components.rich.schema_management import SchemaListComponent, SchemaDetailComponent
        from ...components.simple import SimpleTextComponent
        
        # Check for schema commands
        normalized = message.strip().lower()
        
        # Check permissions
        if "admin" not in user.group_memberships:
            # Allow non-admins to view basic info but not management
            if normalized.startswith("/schema_"):
                return WorkflowResult(
                    should_skip_llm=True,
                    components=[
                        UiComponent(
                            rich_component=RichTextComponent(
                                content="# 🔒 Access Denied\n\n"
                                       "Schema management commands are only available to administrators.",
                                markdown=True,
                            ),
                            simple_component=None,
                        )
                    ],
                )
            # Not a schema command, pass through
            return WorkflowResult(should_skip_llm=False)
        
        # Parse command
        if normalized == "/schema_list" or normalized.startswith("/schema_list "):
            return await self._handle_schema_list(agent, user, conversation, message)
        
        elif normalized.startswith("/schema_detail"):
            return await self._handle_schema_detail(agent, user, conversation, message)
        
        elif normalized.startswith("/schema_enrich"):
            return await self._handle_schema_enrich(agent, user, conversation, message)
        
        # Not our command
        return WorkflowResult(should_skip_llm=False)

    async def _handle_schema_list(
        self,
        agent: "Agent",
        user: "User",
        conversation: "Conversation",
        message: str,
    ) -> WorkflowResult:
        """Handle /schema_list command."""
        from ...components import UiComponent
        from ...components.rich import RichTextComponent, CardComponent
        from ...components.rich.schema_management import SchemaListComponent
        from ...components.simple import SimpleTextComponent
        from ...core.tool import ToolContext
        
        # Parse options
        incomplete_only = "incomplete" in message.lower()
        
        # Create context
        context = ToolContext(
            user=user,
            conversation_id=conversation.id,
            request_id="schema-list",
            agent_memory=agent.agent_memory if hasattr(agent, 'agent_memory') else None,
        )
        
        try:
            # Get statistics
            stats = await self._service.get_statistics(context)
            
            # Get table list
            items = await self._service.list_tables(
                context,
                incomplete_only=incomplete_only,
                limit=50,
            )
            
            # Build statistics summary
            stats_content = self._build_stats_text(stats)
            
            # Build list component
            list_component = SchemaListComponent.from_list_items(
                items=items,
                statistics=stats,
                page_size=20,
            )
            
            # Build header
            header_content = (
                f"# 📋 Schema Management\n\n"
                f"{stats_content}\n\n"
                f"**Options:**\n"
                f"- `/schema_detail <table>` - View or edit table details\n"
                f"- `/schema_enrich` - Let AI fill in missing metadata"
            )
            
            components = [
                UiComponent(
                    rich_component=RichTextComponent(
                        content=header_content,
                        markdown=True,
                    ),
                    simple_component=None,
                ),
                UiComponent(
                    rich_component=list_component,
                    simple_component=SimpleTextComponent(
                        text=f"SchemaMemory: {stats['total_tables']} tables, {stats['completeness_rate']:.1f}% complete"
                    ),
                ),
            ]
            
            return WorkflowResult(
                should_skip_llm=True,
                components=components,
            )
            
        except Exception as e:
            logger.error(f"Error in schema list: {e}", exc_info=True)
            return WorkflowResult(
                should_skip_llm=True,
                components=[
                    UiComponent(
                        rich_component=RichTextComponent(
                            content=f"# ❌ Error\n\nFailed to load SchemaMemory: {str(e)}",
                            markdown=True,
                        ),
                        simple_component=None,
                    )
                ],
            )

    async def _handle_schema_detail(
        self,
        agent: "Agent",
        user: "User",
        conversation: "Conversation",
        message: str,
    ) -> WorkflowResult:
        """Handle /schema_detail command."""
        from ...components import UiComponent
        from ...components.rich import RichTextComponent, CardComponent
        from ...components.rich.schema_management import SchemaDetailComponent
        from ...components.simple import SimpleTextComponent
        from ...core.tool import ToolContext
        
        # Parse table name
        match = re.match(r'/schema_detail\s+(?:(\w+)\.)?(\w+)', message.strip(), re.IGNORECASE)
        
        if not match:
            return WorkflowResult(
                should_skip_llm=True,
                components=[
                    UiComponent(
                        rich_component=RichTextComponent(
                            content="# ℹ️ Usage\n\n"
                                   "`/schema_detail <schema>.<table>` or `/schema_detail <table>`\n\n"
                                   "Example: `/schema_detail public.customers`",
                            markdown=True,
                        ),
                        simple_component=None,
                    )
                ],
            )
        
        schema_name = match.group(1) or "public"
        table_name = match.group(2)
        
        # Create context
        context = ToolContext(
            user=user,
            conversation_id=conversation.id,
            request_id="schema-detail",
            agent_memory=agent.agent_memory if hasattr(agent, 'agent_memory') else None,
        )
        
        try:
            # Get table
            table = await self._service.get_table(
                table_name=table_name,
                context=context,
                schema_name=schema_name,
            )
            
            if not table:
                return WorkflowResult(
                    should_skip_llm=True,
                    components=[
                        UiComponent(
                            rich_component=RichTextComponent(
                                content=f"# ❌ Not Found\n\n"
                                       f"Table `{schema_name}.{table_name}` not found in SchemaMemory.",
                                markdown=True,
                            ),
                            simple_component=None,
                        )
                    ],
                )
            
            # Calculate completeness
            from ...capabilities.schema_management.models import SchemaListItem
            item = self._service._calculate_completeness(table)
            
            # Build detail component
            detail_component = SchemaDetailComponent.from_table_schema(
                table_schema=table,
                is_editable=True,
                completeness_score=item.completeness_score,
                missing_fields=item.missing_fields,
            )
            
            # Build header
            header_content = (
                f"# 📋 {schema_name}.{table_name}\n\n"
                f"**Domain:** {table.business_context.domain}\n"
                f"**Description:** {table.business_context.description or '(none)'}\n"
                f"**Completeness:** {item.status_icon} {item.completeness_score:.0f}% - {item.status_text}\n\n"
                f"Fields ({len(table.field_definitions)}) | Foreign Keys ({len(table.relationships)})"
            )
            
            components = [
                UiComponent(
                    rich_component=RichTextComponent(
                        content=header_content,
                        markdown=True,
                    ),
                    simple_component=None,
                ),
                UiComponent(
                    rich_component=detail_component,
                    simple_component=SimpleTextComponent(
                        text=f"{table_name}: {item.completeness_score:.0f}% complete"
                    ),
                ),
            ]
            
            return WorkflowResult(
                should_skip_llm=True,
                components=components,
            )
            
        except Exception as e:
            logger.error(f"Error in schema detail: {e}", exc_info=True)
            return WorkflowResult(
                should_skip_llm=True,
                components=[
                    UiComponent(
                        rich_component=RichTextComponent(
                            content=f"# ❌ Error\n\nFailed to load table: {str(e)}",
                            markdown=True,
                        ),
                        simple_component=None,
                    )
                ],
            )

    async def _handle_schema_enrich(
        self,
        agent: "Agent",
        user: "User",
        conversation: "Conversation",
        message: str,
    ) -> WorkflowResult:
        """Handle /schema_enrich command."""
        from ...components import UiComponent
        from ...components.rich import RichTextComponent, StatusCardComponent, CardComponent
        from ...components.simple import SimpleTextComponent
        from ...core.tool import ToolContext
        
        # Check if LLM is available
        if not self._service._llm:
            return WorkflowResult(
                should_skip_llm=True,
                components=[
                    UiComponent(
                        rich_component=StatusCardComponent(
                            title="AI Enrichment Unavailable",
                            status="warning",
                            description="LLM service not configured. Cannot perform AI enrichment.",
                            icon="⚠️",
                        ),
                        simple_component=SimpleTextComponent(
                            text="AI enrichment requires LLM service"
                        ),
                    )
                ],
            )
        
        # Parse specific table if provided
        match = re.match(r'/schema_enrich\s+(?:(\w+)\.)?(\w+)', message.strip(), re.IGNORECASE)
        
        # Create context
        context = ToolContext(
            user=user,
            conversation_id=conversation.id,
            request_id="schema-enrich",
            agent_memory=agent.agent_memory if hasattr(agent, 'agent_memory') else None,
        )
        
        try:
            tables_to_enrich = []
            
            if match:
                # Enrich specific table
                schema_name = match.group(1) or "public"
                table_name = match.group(2)
                
                table = await self._service.get_table(
                    table_name=table_name,
                    context=context,
                    schema_name=schema_name,
                )
                
                if table:
                    tables_to_enrich = [table]
                else:
                    return WorkflowResult(
                        should_skip_llm=True,
                        components=[
                            UiComponent(
                                rich_component=RichTextComponent(
                                    content=f"# ❌ Not Found\n\n"
                                           f"Table `{schema_name}.{table_name}` not found.",
                                    markdown=True,
                                ),
                                simple_component=None,
                            )
                        ],
                    )
            else:
                # Enrich all incomplete tables
                items = await self._service.list_tables(
                    context,
                    incomplete_only=True,
                    limit=20,
                )
                
                if not items:
                    return WorkflowResult(
                        should_skip_llm=True,
                        components=[
                            UiComponent(
                                rich_component=RichTextComponent(
                                    content="# ✅ All Complete\n\n"
                                           "All tables in SchemaMemory have complete BusinessContext!",
                                    markdown=True,
                                ),
                                simple_component=None,
                            )
                        ],
                    )
                
                tables_to_enrich = [item.table_schema for item in items]
            
            # Show progress
            yield_status = [
                UiComponent(
                    rich_component=StatusCardComponent(
                        title="AI Enrichment Started",
                        status="running",
                        description=f"Enriching {len(tables_to_enrich)} table(s)...",
                        icon="🤖",
                    ),
                    simple_component=SimpleTextComponent(
                        text=f"AI enrichment started for {len(tables_to_enrich)} tables"
                    ),
                )
            ]
            
            # Perform enrichment
            result = await self._service.enrich_with_llm(
                tables=tables_to_enrich,
                context=context,
                auto_save=True,
            )
            
            # Build result
            if result.successful > 0:
                result_content = (
                    f"# ✅ Enrichment Complete\n\n"
                    f"**Processed:** {result.total} tables\n"
                    f"**Success:** {result.successful}\n"
                    f"**Failed:** {result.failed}\n\n"
                )
                
                # Show successful results
                for r in result.results[:5]:
                    if r.success:
                        result_content += f"- ✅ {r.table_name}: {r.domain or 'updated'}\n"
                    else:
                        result_content += f"- ❌ {r.table_name}: {r.error}\n"
                
                if len(result.results) > 5:
                    result_content += f"\n... and {len(result.results) - 5} more"
            else:
                result_content = (
                    f"# ❌ Enrichment Failed\n\n"
                    f"All {result.total} tables failed to enrich."
                )
            
            return WorkflowResult(
                should_skip_llm=True,
                components=[
                    UiComponent(
                        rich_component=RichTextComponent(
                            content=result_content,
                            markdown=True,
                        ),
                        simple_component=SimpleTextComponent(
                            text=f"Enrichment: {result.successful}/{result.total} successful"
                        ),
                    )
                ],
            )
            
        except Exception as e:
            logger.error(f"Error in schema enrich: {e}", exc_info=True)
            return WorkflowResult(
                should_skip_llm=True,
                components=[
                    UiComponent(
                        rich_component=RichTextComponent(
                            content=f"# ❌ Error\n\nFailed to enrich: {str(e)}",
                            markdown=True,
                        ),
                        simple_component=None,
                    )
                ],
            )

    def _build_stats_text(self, stats: Dict[str, Any]) -> str:
        """Build statistics text."""
        total = stats.get('total_tables', 0)
        complete = stats.get('complete_tables', 0)
        partial = stats.get('partial_tables', 0)
        incomplete = stats.get('incomplete_tables', 0)
        rate = stats.get('completeness_rate', 0)
        
        return (
            f"| Metric | Value |\n"
            f"|------|----|\n"
            f"| Total Tables | {total} |\n"
            f"| Complete | ✅ {complete} |\n"
            f"| Partially Missing | ⚠️ {partial} |\n"
            f"| Severely Missing | ❌ {incomplete} |\n"
            f"| Completeness Rate | {rate:.1f}% |"
        )

    async def get_starter_ui(
        self,
        agent: "Agent",
        user: "User",
        conversation: "Conversation"
    ) -> Optional[List["UiComponent"]]:
        """Provide starter UI with schema management info for admins."""
        from ...components import UiComponent
        from ...components.rich import RichTextComponent
        
        # Only show for admins
        if "admin" not in user.group_memberships:
            return None
        
        content = (
            "## 🔧 Admin: Schema Management\n\n"
            "**Commands:**\n"
            "- `/schema_list` - List all tables with completeness status\n"
            "- `/schema_list incomplete` - List only incomplete tables\n"
            "- `/schema_detail <table>` - View/edit table details\n"
            "- `/schema_enrich` - AI enrich all incomplete tables\n"
            "- `/schema_enrich <table>` - AI enrich specific table"
        )
        
        return [
            UiComponent(
                rich_component=RichTextComponent(content=content, markdown=True),
                simple_component=None,
            )
        ]
