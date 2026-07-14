"""
FastAPI route implementations for QueryMind Agents.
"""

import logging
import json
import traceback
from datetime import timezone
from typing import Any, AsyncGenerator, Dict, List, Optional

from fastapi import FastAPI, HTTPException, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse, HTMLResponse

from ..base import ChatHandler, ChatRequest, ChatResponse


logger = logging.getLogger(__name__)


def _normalize_display_text(text: str, max_length: int) -> str:
    """Normalize text for compact UI display."""
    normalized = " ".join(text.split())
    if len(normalized) <= max_length:
        return normalized
    return normalized[: max_length - 1].rstrip() + "…"


def _conversation_title(conversation: Any) -> str:
    """Use the persisted LLM title, falling back to the first user message."""
    metadata = getattr(conversation, "metadata", {}) or {}
    generated_title = str(metadata.get("title") or "").strip()
    if generated_title:
        return _normalize_display_text(generated_title, 72)

    for message in getattr(conversation, "messages", []):
        if getattr(message, "role", None) == "user" and getattr(message, "content", ""):
            return _normalize_display_text(message.content, 72)
    return "Untitled conversation"


def _conversation_preview(conversation: Any) -> str:
    """Build a short preview from the latest message content."""
    messages = getattr(conversation, "messages", [])
    if not messages:
        return ""
    last_message = messages[-1]
    content = getattr(last_message, "content", "") or ""
    if not content:
        return ""
    return _normalize_display_text(content, 120)


def _conversation_summary(conversation: Any) -> Optional[Dict[str, Any]]:
    """Convert a conversation to a history list item.

    Empty starter conversations are skipped so the history drawer only shows
    sessions with at least one real user message.
    """
    messages = getattr(conversation, "messages", [])
    has_user_message = any(getattr(message, "role", None) == "user" for message in messages)
    if not has_user_message:
        return None

    last_message = messages[-1] if messages else None

    return {
        "conversation_id": getattr(conversation, "id", ""),
        "title": _conversation_title(conversation),
        "preview": _conversation_preview(conversation),
        "message_count": len(messages),
        "created_at": getattr(conversation, "created_at", None).isoformat()
        if getattr(conversation, "created_at", None)
        else "",
        "updated_at": getattr(conversation, "updated_at", None).isoformat()
        if getattr(conversation, "updated_at", None)
        else "",
        "last_role": getattr(last_message, "role", None) if last_message else None,
    }


async def _load_visible_conversations(store: Any, user: Any) -> List[Any]:
    """Load all visible conversations for a user, excluding empty sessions."""
    conversations: List[Any] = []
    page_size = 100
    offset = 0

    while True:
        page = await store.list_conversations(user, limit=page_size, offset=offset)
        if not page:
            break

        conversations.extend(page)
        if len(page) < page_size:
            break

        offset += page_size

    def _sort_key(conversation: Any) -> float:
        updated_at = getattr(conversation, "updated_at", None)
        if updated_at is None:
            return 0.0
        if getattr(updated_at, "tzinfo", None) is None:
            updated_at = updated_at.replace(tzinfo=timezone.utc)
        return updated_at.timestamp()

    conversations.sort(key=_sort_key, reverse=True)
    return [conversation for conversation in conversations if _conversation_summary(conversation)]


def register_chat_routes(
    app: FastAPI, chat_handler: ChatHandler, config: Optional[Dict[str, Any]] = None
) -> None:
    """Register chat routes on FastAPI app.

    Args:
        app: FastAPI application
        chat_handler: Chat handler instance
        config: Server configuration
    """
    config = config or {}

    async def _get_current_user(request: Request) -> Any:
        """Resolve the current user for chat history routes."""
        from ...core.user import User

        user_resolver = getattr(chat_handler.agent, "user_resolver", None)
        if user_resolver is None:
            return User(
                id="admin",
                username="admin",
                email="admin@local",
                group_memberships=["admin"],
            )

        from ...core.user.request_context import RequestContext

        request_context = RequestContext(
            metadata={
                "headers": dict(request.headers),
                "cookies": dict(request.cookies),
            }
        )
        user = await user_resolver.resolve_user(request_context)

        if not isinstance(user, User):
            user = User(
                id=getattr(user, "id", "unknown"),
                username=getattr(user, "username", "unknown"),
                email=getattr(user, "email", ""),
                group_memberships=getattr(user, "group_memberships", []),
            )

        return user

    def _get_conversation_store() -> Any:
        """Return the active conversation store from the agent."""
        store = getattr(chat_handler.agent, "conversation_store", None)
        if store is None:
            raise HTTPException(
                status_code=500,
                detail="Conversation store not configured",
            )
        return store

    @app.get("/", response_class=HTMLResponse)
    async def index() -> str:
        """Serve the main chat interface."""
        dev_mode = config.get("dev_mode", False)
        cdn_url = config.get("cdn_url", "https://cdn.jsdelivr.net/npm/@querymind/webcomponent")
        api_base_url = config.get("api_base_url", "")

        # Return a simple HTML page that loads the web component
        if dev_mode:
            return """
            <!DOCTYPE html>
            <html>
            <head>
                <title>QueryMind Chat</title>
                <script type="module" src="http://localhost:5173/src/index.ts"></script>
            </head>
            <body>
                <vanna-chat 
                    api-base="http://localhost:8000" 
                    sse-endpoint="/api/querymind/v1/chat_sse"
                    ws-endpoint="/api/querymind/v1/chat_websocket"
                    poll-endpoint="/api/querymind/v1/chat_poll">
                </vanna-chat>
            </body>
            </html>
            """
        else:
            return f"""
            <!DOCTYPE html>
            <html>
            <head>
                <title>QueryMind Chat</title>
                <script src="{cdn_url}/dist/querymind-chat.umd.js"></script>
            </head>
            <body>
                <vanna-chat 
                    api-base="{api_base_url}" 
                    sse-endpoint="/api/querymind/v1/chat_sse"
                    ws-endpoint="/api/querymind/v1/chat_websocket"
                    poll-endpoint="/api/querymind/v1/chat_poll">
                </vanna-chat>
            </body>
            </html>
            """

    @app.post("/api/querymind/v1/chat_sse")
    async def chat_sse(
        chat_request: ChatRequest, http_request: Request
    ) -> StreamingResponse:
        """Server-Sent Events endpoint for streaming chat."""
        async def generate() -> AsyncGenerator[str, None]:
            """Generate SSE stream."""
            try:
                async for chunk in chat_handler.handle_stream(chat_request):
                    chunk_json = chunk.model_dump_json()
                    yield f"data: {chunk_json}\n\n"
                yield "data: [DONE]\n\n"
            except Exception as e:
                traceback.print_exc()
                error_data = {
                    "type": "error",
                    "data": {"message": str(e)},
                    "conversation_id": chat_request.conversation_id or "",
                    "request_id": chat_request.request_id or "",
                }
                yield f"data: {json.dumps(error_data)}\n\n"

        return StreamingResponse(
            generate(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",  # Disable nginx buffering
            },
        )

    @app.websocket("/api/querymind/v1/chat_websocket")
    async def chat_websocket(websocket: WebSocket) -> None:
        """WebSocket endpoint for real-time chat."""
        await websocket.accept()

        try:
            while True:
                # Receive message
                try:
                    data = await websocket.receive_json()
                    chat_request = ChatRequest(**data)
                except Exception as e:
                    traceback.print_exc()
                    await websocket.send_json(
                        {
                            "type": "error",
                            "data": {"message": f"Invalid request: {str(e)}"},
                        }
                    )
                    continue

                # Stream response
                try:
                    async for chunk in chat_handler.handle_stream(chat_request):
                        await websocket.send_json(chunk.model_dump())

                    # Send completion signal
                    await websocket.send_json(
                        {
                            "type": "completion",
                            "data": {"status": "done"},
                            "conversation_id": chunk.conversation_id
                            if "chunk" in locals()
                            else "",
                            "request_id": chunk.request_id
                            if "chunk" in locals()
                            else "",
                        }
                    )

                except Exception as e:
                    traceback.print_exc()
                    await websocket.send_json(
                        {
                            "type": "error",
                            "data": {"message": str(e)},
                            "conversation_id": chat_request.conversation_id or "",
                            "request_id": chat_request.request_id or "",
                        }
                    )

        except WebSocketDisconnect:
            pass
        except Exception as e:
            traceback.print_exc()
            try:
                await websocket.send_json(
                    {
                        "type": "error",
                        "data": {"message": f"WebSocket error: {str(e)}"},
                    }
                )
            except Exception:
                pass
            finally:
                await websocket.close()

    @app.post("/api/querymind/v1/chat_poll")
    async def chat_poll(
        chat_request: ChatRequest, http_request: Request
    ) -> ChatResponse:
        """Polling endpoint for chat."""
        try:
            result = await chat_handler.handle_poll(chat_request)
            return result
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

    @app.get("/api/querymind/v1/chat/conversations")
    async def list_conversations(
        request: Request,
        limit: int = 50,
        offset: int = 0,
    ) -> Dict[str, Any]:
        """List chat conversations for the current user."""
        user = await _get_current_user(request)
        store = _get_conversation_store()

        try:
            conversations = await _load_visible_conversations(store, user)
            total_count = len(conversations)
            page = conversations[offset : offset + limit] if limit > 0 else conversations[offset:]

            return {
                "conversations": [
                    summary
                    for summary in (
                        _conversation_summary(conversation) for conversation in page
                    )
                    if summary is not None
                ],
                "pagination": {
                    "limit": limit,
                    "offset": offset,
                    "total_count": total_count,
                    "has_more": offset + limit < total_count if limit > 0 else False,
                },
            }
        except HTTPException:
            raise
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(
                status_code=500,
                detail=f"Failed to list conversations: {str(e)}",
            )

    @app.get("/api/querymind/v1/chat/conversations/{conversation_id}")
    async def get_conversation(
        request: Request,
        conversation_id: str,
    ) -> Dict[str, Any]:
        """Get a single conversation with full message history."""
        user = await _get_current_user(request)
        store = _get_conversation_store()

        try:
            conversation = await store.get_conversation(conversation_id, user)
            if conversation is None:
                raise HTTPException(status_code=404, detail="Conversation not found")

            summary = _conversation_summary(conversation)

            return {
                "conversation_id": conversation.id,
                "title": summary["title"] if summary else "Untitled conversation",
                "preview": summary["preview"] if summary else "",
                "message_count": len(conversation.messages),
                "created_at": conversation.created_at.isoformat(),
                "updated_at": conversation.updated_at.isoformat(),
                "metadata": getattr(conversation, "metadata", {}),
                "messages": [
                    message.model_dump(mode="json")
                    for message in conversation.messages
                ],
            }
        except HTTPException:
            raise
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(
                status_code=500,
                detail=f"Failed to get conversation: {str(e)}",
            )

    @app.delete("/api/querymind/v1/chat/conversations/{conversation_id}")
    async def delete_conversation(
        request: Request,
        conversation_id: str,
    ) -> Dict[str, Any]:
        """Delete a conversation for the current user."""
        user = await _get_current_user(request)
        store = _get_conversation_store()

        try:
            deleted = await store.delete_conversation(conversation_id, user)
            if not deleted:
                raise HTTPException(status_code=404, detail="Conversation not found")

            return {
                "success": True,
                "conversation_id": conversation_id,
                "message": "Conversation deleted",
            }
        except HTTPException:
            raise
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(
                status_code=500,
                detail=f"Failed to delete conversation: {str(e)}",
            )


def register_metrics_routes(
    app: FastAPI, agent: Any, config: Optional[Dict[str, Any]] = None
) -> None:
    """Register Prometheus metrics routes on FastAPI app.

    Args:
        app: FastAPI application
        agent: The agent instance (used to access observability_provider)
        config: Server configuration
    """
    config = config or {}

    @app.get("/metrics")
    async def metrics() -> Any:
        """Prometheus metrics endpoint.

        Returns metrics in Prometheus exposition format for scraping.
        """
        try:
            from starlette.responses import Response
            from prometheus_client import CONTENT_TYPE_LATEST

            # Check if agent has observability_provider
            observability_provider = getattr(agent, "observability_provider", None)

            if observability_provider is not None:
                # Use the agent's observability provider
                metrics_content = observability_provider.get_metrics()
            else:
                # Fallback: import and use default registry
                from prometheus_client import generate_latest

                metrics_content = generate_latest()

            return Response(
                content=metrics_content,
                media_type=CONTENT_TYPE_LATEST,
            )
        except Exception as e:
            # If prometheus_client is not installed, return error
            from starlette.responses import Response

            return Response(
                content=f"# Error: {str(e)}\n",
                media_type="text/plain",
                status_code=500,
            )


def register_schema_routes(
    app: FastAPI, agent: Any, config: Optional[Dict[str, Any]] = None
) -> None:
    """Register Schema Management API routes on FastAPI app.

    These routes provide the backend API for the Schema Management frontend page.
    All routes require admin authentication.

    Routes:
        GET  /api/querymind/v1/schema/tables           - List all tables with completeness
        GET  /api/querymind/v1/schema/tables/{full_name} - Get table detail
        PUT  /api/querymind/v1/schema/tables/{full_name}/metadata - Update table metadata
        POST /api/querymind/v1/schema/tables/{full_name}/enrich - AI enrich table
        DELETE /api/querymind/v1/schema/tables/{full_name} - Delete a table from schema memory
        POST /api/querymind/v1/schema/tables/delete - Batch delete tables from schema memory

    Args:
        app: FastAPI application
        agent: The agent instance (used to access schema_management_service)
        config: Server configuration
    """
    config = config or {}

    async def _get_current_user(request: Request) -> Any:
        """Extract and resolve current user from request.
        
        Returns:
            User object with group_memberships
            
        Raises:
            HTTPException: If user is not authenticated or not admin
        """
        from ...core.user import User
        
        # Get user resolver from agent
        user_resolver = getattr(agent, 'user_resolver', None)
        if user_resolver is None:
            # Fallback: create a default admin user for testing
            return User(
                id="admin",
                username="admin",
                email="admin@local",
                group_memberships=["admin"]
            )
        
        # Create request context from HTTP request
        from ...core.user.request_context import RequestContext
        
        headers = dict(request.headers)
        cookies = dict(request.cookies)
        
        request_context = RequestContext(
            metadata={
                "headers": headers,
                "cookies": cookies,
            }
        )
        
        # Resolve user
        user = await user_resolver.resolve_user(request_context)
        
        # DEBUG: Log user info
        import logging
        logger = logging.getLogger(__name__)
        logger.info(f"[SCHEMA_API] user_resolver={user_resolver}, user={user}, group_memberships={getattr(user, 'group_memberships', 'N/A')}")
        
        return user

    async def _check_admin(user: Any) -> None:
        """Check if user has admin group membership.
        
        Raises:
            HTTPException: If user is not admin
        """
        if "admin" not in (user.group_memberships or []):
            raise HTTPException(
                status_code=403,
                detail="Admin access required for schema management"
            )

    def _create_tool_context(user: Any, request_id: str = "schema-api") -> Any:
        """Create a ToolContext for service calls.
        
        Args:
            user: Current user
            request_id: Request ID for tracing
            
        Returns:
            ToolContext instance
        """
        from ...core.tool import ToolContext
        from ...core.user import User
        
        # Ensure user is a proper User object
        if not isinstance(user, User):
            user = User(
                id=getattr(user, 'id', 'unknown'),
                username=getattr(user, 'username', 'unknown'),
                email=getattr(user, 'email', ''),
                group_memberships=getattr(user, 'group_memberships', [])
            )
        
        return ToolContext(
            user=user,
            conversation_id="schema-api",
            request_id=request_id,
            agent_memory=getattr(agent, 'agent_memory', None),
            schema_memory=getattr(agent, 'schema_memory', None),
            schema_management_service=getattr(agent, 'schema_management_service', None),
        )

    @app.get("/api/querymind/v1/schema/tables")
    async def list_tables(
        request: Request,
        domain: Optional[str] = None,
        incomplete_only: bool = False,
        search: Optional[str] = None,
        limit: int = 100,
        offset: int = 0,
    ) -> Dict[str, Any]:
        """List all tables with completeness metadata.
        
        Returns tables with their completeness scores, domain, and status icons.
        """
        user = await _get_current_user(request)
        await _check_admin(user)
        
        service = getattr(agent, 'schema_management_service', None)
        if service is None:
            raise HTTPException(
                status_code=500,
                detail="Schema management service not configured"
            )
        
        context = _create_tool_context(user)
        
        try:
            stats = await service.get_statistics(context)
            tables = await service.list_tables(
                context,
                domain_filter=domain,
                incomplete_only=incomplete_only,
                search_query=search,
                limit=limit,
                offset=offset,
            )
            
            # Convert to frontend format
            table_list = []
            for item in tables:
                table_list.append({
                    "table_name": item.table_schema.table_name,
                    "schema_name": item.table_schema.schema_name,
                    "full_name": f"{item.table_schema.schema_name}.{item.table_schema.table_name}",
                    "domain": item.table_schema.business_context.domain or "",
                    "description": item.table_schema.business_context.description or "",
                    "completeness_score": item.completeness_score / 100,  # Convert to 0-1 range
                    "field_count": item.field_count,
                    "complete_field_count": item.complete_field_count,
                    "is_complete": item.is_complete,
                    "status_icon": "✅" if item.is_complete else "⚠️",
                })
            
            total_tables = stats.get("total_tables", len(table_list))
            page_size = limit if limit > 0 else len(table_list) or 1

            return {
                "tables": table_list,
                "statistics": {
                    "total_tables": stats.get("total_tables", len(table_list)),
                    "complete_tables": stats.get("complete_tables", 0),
                    "partial_tables": stats.get("partial_tables", 0),
                    "incomplete_tables": stats.get("incomplete_tables", 0),
                },
                "pagination": {
                    "page": (offset // page_size) + 1 if page_size > 0 else 1,
                    "page_size": page_size,
                    "total_count": total_tables,
                    "total_pages": (total_tables + page_size - 1) // page_size if page_size > 0 else 1,
                },
            }
            
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Failed to list tables: {str(e)}")

    @app.get("/api/querymind/v1/schema/tables/{full_name}")
    async def get_table_detail(
        request: Request,
        full_name: str,
    ) -> Dict[str, Any]:
        """Get detailed schema information for a specific table.
        
        Args:
            full_name: Table full name in format 'schema.table'
        """
        user = await _get_current_user(request)
        await _check_admin(user)
        
        service = getattr(agent, 'schema_management_service', None)
        if service is None:
            raise HTTPException(
                status_code=500,
                detail="Schema management service not configured"
            )
        
        context = _create_tool_context(user)
        
        # Parse schema and table name
        parts = full_name.rsplit(".", 1)
        if len(parts) != 2:
            raise HTTPException(status_code=400, detail="Invalid table name format. Use 'schema.table'")
        
        schema_name, table_name = parts
        
        try:
            table = await service.get_table(table_name, context, schema_name=schema_name)
            
            if table is None:
                raise HTTPException(status_code=404, detail=f"Table not found: {full_name}")

            completeness = service._calculate_completeness(table)
            
            # Build response in frontend format
            fields = []
            for field in table.field_definitions:
                fields.append({
                    "field_name": field.field_name,
                    "data_type": field.data_type,
                    "is_nullable": field.is_nullable,
                    "is_primary_key": field.is_primary_key,
                    "is_foreign_key": field.is_foreign_key,
                    "business_meaning": field.business_meaning or "",
                    "is_missing_meaning": not bool(field.business_meaning),
                })
            
            foreign_keys = []
            for rel in table.relationships:
                foreign_keys.append({
                    "from_field": rel.from_field,
                    "to_table": rel.to_table,
                    "to_field": rel.to_field,
                    "description": rel.description or "",
                })
            
            return {
                "table_name": table.table_name,
                "schema_name": table.schema_name,
                "business_context": {
                    "domain": table.business_context.domain or "",
                    "description": table.business_context.description or "",
                    "keywords": table.business_context.keywords or [],
                },
                "fields": fields,
                "foreign_keys": foreign_keys,
                "completeness": {
                    "score": completeness.completeness_score / 100,
                    "missing_fields": completeness.missing_fields,
                },
            }
            
        except HTTPException:
            raise
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Failed to get table: {str(e)}")

    @app.put("/api/querymind/v1/schema/tables/{full_name}/metadata")
    async def update_table_metadata(
        request: Request,
        full_name: str,
        metadata: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Update table metadata (domain, description, keywords, field meanings).
        
        Args:
            full_name: Table full name in format 'schema.table'
            metadata: Dict with optional keys: domain, description, keywords, field_meanings
        """
        user = await _get_current_user(request)
        await _check_admin(user)
        
        service = getattr(agent, 'schema_management_service', None)
        if service is None:
            raise HTTPException(
                status_code=500,
                detail="Schema management service not configured"
            )
        
        context = _create_tool_context(user)
        
        # Parse schema and table name
        parts = full_name.rsplit(".", 1)
        if len(parts) != 2:
            raise HTTPException(status_code=400, detail="Invalid table name format")
        
        schema_name, table_name = parts
        
        try:
            # Extract field_meanings if present
            raw_field_updates = metadata.get("field_meanings") or {}
            field_updates = {}
            if isinstance(raw_field_updates, dict):
                for field_name, meaning in raw_field_updates.items():
                    if isinstance(meaning, dict):
                        field_updates[field_name] = meaning
                    else:
                        field_updates[field_name] = {
                            "business_meaning": meaning or "",
                        }
            
            success = await service.update_table(
                table_name=table_name,
                context=context,
                schema_name=schema_name,
                domain=metadata.get("domain"),
                description=metadata.get("description"),
                keywords=metadata.get("keywords"),
                field_updates=field_updates,
            )
            
            if success:
                return {"success": True, "message": f"Updated metadata for {full_name}"}
            else:
                raise HTTPException(status_code=500, detail="Failed to update metadata")
                
        except HTTPException:
            raise
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Failed to update metadata: {str(e)}")

    @app.post("/api/querymind/v1/schema/tables/{full_name}/enrich")
    async def enrich_table(
        request: Request,
        full_name: str,
    ) -> Dict[str, Any]:
        """AI-enrich a table's schema using LLM.
        
        This generates business context and field meanings automatically.
        
        Args:
            full_name: Table full name in format 'schema.table'
        """
        user = await _get_current_user(request)
        await _check_admin(user)
        
        service = getattr(agent, 'schema_management_service', None)
        if service is None:
            raise HTTPException(
                status_code=500,
                detail="Schema management service not configured"
            )
        
        # Check if LLM service is available
        if service.llm_service is None:
            raise HTTPException(
                status_code=500,
                detail="LLM service not configured for enrichment"
            )
        
        context = _create_tool_context(user)
        
        # Parse schema and table name
        parts = full_name.rsplit(".", 1)
        if len(parts) != 2:
            raise HTTPException(status_code=400, detail="Invalid table name format")
        
        schema_name, table_name = parts
        
        try:
            # Get the table first
            table = await service.get_table(table_name, context, schema_name=schema_name)
            
            if table is None:
                raise HTTPException(status_code=404, detail=f"Table not found: {full_name}")
            
            # Enrich with LLM
            result = await service.enrich_with_llm([table], context, auto_save=False)
            result_data = result.model_dump()

            if result.successful == 0:
                failure_reason = "Unknown enrichment error"
                if result.results:
                    failure_reason = result.results[0].error or failure_reason
                logger.error(
                    "Enrichment failed for %s: %s",
                    full_name,
                    failure_reason,
                )
                raise HTTPException(
                    status_code=500,
                    detail=f"Failed to enrich {full_name}: {failure_reason}",
                )
            
            return {
                "success": True,
                "message": f"Enriched {full_name}",
                **result_data,
                "tables_enriched": result.successful,
                "tables_failed": result.failed,
            }
                
        except HTTPException:
            raise
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Failed to enrich: {str(e)}")

    @app.delete("/api/querymind/v1/schema/tables/{full_name}")
    async def delete_table(
        request: Request,
        full_name: str,
    ) -> Dict[str, Any]:
        """Delete a table from schema memory."""
        user = await _get_current_user(request)
        await _check_admin(user)

        service = getattr(agent, 'schema_management_service', None)
        if service is None:
            raise HTTPException(
                status_code=500,
                detail="Schema management service not configured"
            )

        context = _create_tool_context(user)

        parts = full_name.rsplit(".", 1)
        if len(parts) != 2:
            raise HTTPException(status_code=400, detail="Invalid table name format")

        schema_name, table_name = parts

        try:
            success = await service.delete_table(
                table_name=table_name,
                context=context,
                schema_name=schema_name,
            )

            if not success:
                raise HTTPException(status_code=404, detail=f"Table not found or already deleted: {full_name}")

            return {
                "success": True,
                "message": f"Deleted {full_name}",
                "full_name": full_name,
            }
        except HTTPException:
            raise
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Failed to delete {full_name}: {str(e)}")

    @app.post("/api/querymind/v1/schema/tables/delete")
    async def delete_tables(
        request: Request,
        payload: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Delete multiple tables from schema memory."""
        user = await _get_current_user(request)
        await _check_admin(user)

        service = getattr(agent, 'schema_management_service', None)
        if service is None:
            raise HTTPException(
                status_code=500,
                detail="Schema management service not configured"
            )

        context = _create_tool_context(user)

        full_names = payload.get("full_names") or []
        if not isinstance(full_names, list) or not full_names:
            raise HTTPException(status_code=400, detail="full_names must be a non-empty list")

        normalized: List[str] = [item.strip() for item in full_names if isinstance(item, str) and item.strip()]
        if not normalized:
            raise HTTPException(status_code=400, detail="full_names must contain at least one table name")

        results = await service.delete_tables(normalized, context)
        deleted = [name for name, ok in zip(normalized, results) if ok]
        failed = [name for name, ok in zip(normalized, results) if not ok]

        return {
            "success": len(failed) == 0,
            "message": f"Deleted {len(deleted)} of {len(normalized)} table(s)",
            "deleted": deleted,
            "failed": failed,
            "results": [
                {"full_name": name, "success": ok}
                for name, ok in zip(normalized, results)
            ],
        }
