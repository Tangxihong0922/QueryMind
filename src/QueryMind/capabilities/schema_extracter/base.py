from __future__ import annotations
"""
Schema Extractor base class and Schema Sync Engine.

This module provides:
- SchemaExtractor: Abstract base class for extracting database schemas
- SchemaSyncEngine: Lifecycle management for SchemaMemory initialization and sync
"""

import asyncio
import re
import logging
import time
from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any, TYPE_CHECKING, TypeVar, Type, Set

from datetime import datetime, timezone

from .models import InitResult, SchemaExtractResult, SchemaExtractSummary

if TYPE_CHECKING:
    from ..schema_memory.models import TableSchema
    from ..schema_memory.base import SchemaMemory
    from ..agent_memory import AgentMemory

logger = logging.getLogger(__name__)


class SchemaExtractor(ABC):
    """
    Abstract base class for extracting database schemas.
    
    Implement this interface to create database-specific extractors
    for PostgreSQL, MySQL, MSSQL, SQLite, etc.
    
    Example:
        >>> class PostgresSchemaExtractor(SchemaExtractor):
        ...     async def extract_all_tables(self) -> List[TableSchema]:
        ...         # Implementation
        ...         pass
    """

    @abstractmethod
    async def extract_all_tables(self) -> List[TableSchema]:
        """
        Extract schemas for all tables in the database.
        
        Returns:
            List of TableSchema objects representing all tables
            
        Raises:
            Exception: If extraction fails
        """
        pass

    @abstractmethod
    async def extract_table(
        self,
        table_name: str,
        schema_name: str = "public"
    ) -> Optional[TableSchema]:
        """
        Extract schema for a specific table.
        
        Args:
            table_name: Name of the table to extract
            schema_name: Name of the schema (default: "public")
            
        Returns:
            TableSchema for the specified table, or None if not found
        """
        pass

    @abstractmethod
    async def list_tables(self, schema_name: str = "public") -> List[str]:
        """
        List all table names in a schema.
        
        Args:
            schema_name: Name of the schema
            
        Returns:
            List of table names
        """
        pass

    @property
    @abstractmethod
    def source_info(self) -> str:
        """
        Get information about the data source.
        
        Returns:
            String describing the source (e.g., "PostgreSQL: mydb@localhost:5432")
        """
        pass


T = TypeVar('T', bound=SchemaExtractor)


class SchemaSyncEngine:
    """
    Engine for SchemaMemory synchronization operations.
    
    This class handles:
    - SchemaMemory initialization (full/force)
    - Incremental updates (reserved for future)
    - Background sync (reserved for future)
    
    The engine uses an existing SchemaMemory instance and performs
    cover-write (upsert) operations on it.
    
    Example:
        >>> engine = SchemaSyncEngine(schema_memory)
        >>> result = await engine.initialize(extractor)
        >>> print(result.summary)
    """

    def __init__(
        self,
        schema_memory: "SchemaMemory",
        agent_memory: "AgentMemory",
        batch_size: int = 50,
        request_delay: float = 1.0,
        save_retry_attempts: int = 3,
        save_retry_delay: float = 1.0,
        max_consecutive_failures: int = 5,
        max_consecutive_same_errors: int = 3,
        max_consecutive_transient_failures: int = 8,
        resume_existing_tables: bool = False,
        stop_on_first_error: bool = False,
    ):
        """
        Initialize the sync engine.
        
        Args:
            schema_memory: Existing SchemaMemory instance (will be used, not created)
            agent_memory: AgentMemory instance for tool context
            batch_size: Number of tables to process in each batch
            request_delay: Delay in seconds between each table save (to avoid rate limits)
            save_retry_attempts: Max retries for transient per-table save errors
            save_retry_delay: Base delay in seconds between retries
            max_consecutive_failures: Abort after this many consecutive non-transient failures
            max_consecutive_same_errors: Abort after this many repeated same non-transient errors
            max_consecutive_transient_failures: Abort after this many consecutive transient failures
            resume_existing_tables: If True, skip tables already present in SchemaMemory
            stop_on_first_error: If True, abort on the first table save failure
        """
        self._schema_memory = schema_memory
        self._agent_memory = agent_memory
        self._batch_size = batch_size
        self._request_delay = request_delay
        self._save_retry_attempts = save_retry_attempts
        self._save_retry_delay = save_retry_delay
        self._max_consecutive_failures = max_consecutive_failures
        self._max_consecutive_same_errors = max_consecutive_same_errors
        self._max_consecutive_transient_failures = max_consecutive_transient_failures
        self._resume_existing_tables = resume_existing_tables
        self._stop_on_first_error = stop_on_first_error

    async def initialize(
        self,
        extractor: SchemaExtractor,
        *,
        force: bool = False,
    ) -> InitResult:
        """
        Initialize SchemaMemory with extracted schemas.
        
        This operation performs a full initialization:
        1. Extract all tables from the database
        2. Cover-write each table to SchemaMemory (upsert)
        3. Return initialization statistics
        
        Args:
            extractor: SchemaExtractor implementation for the target database
            force: If True, clear existing data before initialization
            force: If True, clear existing data before initialization

        Returns:
            InitResult with operation statistics
        """
        start_time = time.time()
        started_at = datetime.now(timezone.utc)
        
        try:
            logger.info(f"Starting SchemaMemory initialization (force={force})")
            
            # Step 1: Initialize schema memory connection if needed
            if hasattr(self._schema_memory, 'initialize'):
                await self._schema_memory.initialize()
            
            # Step 2: Clear existing data if force=True
            if force:
                logger.info("Force mode: clearing existing SchemaMemory data")
                await self._schema_memory.clear_all()
            
            # Step 3: Extract all tables
            logger.info("Extracting schemas from database...")
            extract_start = time.time()
            tables = await extractor.extract_all_tables()
            extract_duration = (time.time() - extract_start) * 1000
            logger.info(f"Extracted {len(tables)} tables in {extract_duration:.2f}ms")
            
            # Step 4: Save tables to SchemaMemory in batches
            tables_created = 0
            tables_updated = 0
            errors = []
            tables_processed = 0
            tables_skipped_existing = 0
            consecutive_non_transient_failures = 0
            consecutive_transient_failures = 0
            consecutive_same_non_transient_errors = 0
            last_non_transient_error_signature: Optional[str] = None
            
            # Create a minimal ToolContext for the operations
            from ...core.tool import ToolContext
            from ...core.user import User
            
            # Create a minimal context for save operations
            context = ToolContext(
                user=User(id="system", username="schema_init"),
                conversation_id="schema-init",
                request_id="schema-init",
                agent_memory=self._agent_memory,
            )

            existing_table_names: Set[str] = set()
            if self._resume_existing_tables and not force:
                existing_table_names = await self._load_existing_table_names(context)
                if existing_table_names:
                    logger.info(
                        "Resume mode: found %s existing table(s) in SchemaMemory; "
                        "they will be skipped",
                        len(existing_table_names),
                    )
            
            # Process in batches
            for i in range(0, len(tables), self._batch_size):
                batch = tables[i:i + self._batch_size]
                batch_num = (i // self._batch_size) + 1
                total_batches = (len(tables) + self._batch_size - 1) // self._batch_size
                
                logger.info(
                    f"Processing batch {batch_num}/{total_batches} "
                    f"({len(batch)} tables)"
                )

                for table_schema in batch:
                    full_name = table_schema.full_name
                    if existing_table_names and full_name in existing_table_names:
                        tables_skipped_existing += 1
                        logger.info("Skipping already initialized table %s", full_name)
                        continue

                    tables_processed += 1
                    try:
                        full_name = await self._save_table_schema_with_retry(
                            schema=table_schema,
                            context=context,
                        )
                        
                        # Track counts (save_table_schema handles upsert internally)
                        if full_name:
                            if force or self._resume_existing_tables:
                                tables_created += 1
                            else:
                                tables_updated += 1
                        consecutive_non_transient_failures = 0
                        consecutive_transient_failures = 0
                        consecutive_same_non_transient_errors = 0
                        last_non_transient_error_signature = None
                            
                    except Exception as e:
                        error_category = self._classify_error(e)
                        error_signature = self._build_error_signature(e)
                        error_message = (
                            f"{table_schema.full_name}: {self._summarize_error(e)}"
                        )
                        logger.error(
                            f"Failed to save table {table_schema.full_name}: {e}",
                            exc_info=True,
                        )
                        errors.append(error_message)
                        if error_category == "transient":
                            consecutive_transient_failures += 1
                            consecutive_non_transient_failures = 0
                            consecutive_same_non_transient_errors = 0
                            last_non_transient_error_signature = None
                        else:
                            consecutive_non_transient_failures += 1
                            consecutive_transient_failures = 0
                            if error_signature == last_non_transient_error_signature:
                                consecutive_same_non_transient_errors += 1
                            else:
                                consecutive_same_non_transient_errors = 1
                                last_non_transient_error_signature = error_signature

                        abort_reason = self._get_abort_reason(
                            error_category=error_category,
                            error_message=error_message,
                            consecutive_non_transient_failures=consecutive_non_transient_failures,
                            consecutive_same_non_transient_errors=consecutive_same_non_transient_errors,
                            consecutive_transient_failures=consecutive_transient_failures,
                        )
                        if abort_reason:
                            total_duration = (time.time() - start_time) * 1000
                            return InitResult(
                                success=False,
                                operation="full_init",
                                tables_processed=tables_processed,
                                tables_created=tables_created,
                                tables_updated=tables_updated,
                                tables_skipped_existing=tables_skipped_existing,
                                duration_ms=total_duration,
                                started_at=started_at,
                                completed_at=datetime.now(timezone.utc),
                                source=extractor.source_info,
                                force=force,
                                error_message=abort_reason or error_message,
                                error_details=errors.copy(),
                                stopped_early=True,
                                abort_reason=abort_reason or error_message,
                            )
                    
                    # Delay between requests to avoid rate limiting
                    if self._request_delay > 0:
                        await asyncio.sleep(self._request_delay)
            
            # Step 5: Calculate statistics
            total_duration = (time.time() - start_time) * 1000
            
            result = InitResult(
                success=True,
                operation="full_init",
                tables_processed=tables_processed,
                tables_created=tables_created,
                tables_updated=tables_updated,
                tables_skipped_existing=tables_skipped_existing,
                duration_ms=total_duration,
                started_at=started_at,
                completed_at=datetime.now(timezone.utc),
                source=extractor.source_info,
                force=force,
                error_details=errors,
            )
            
            logger.info(f"SchemaMemory initialization completed: {result.summary}")
            return result
            
        except Exception as e:
            total_duration = (time.time() - start_time) * 1000
            logger.error(f"SchemaMemory initialization failed: {e}", exc_info=True)
            
            return InitResult(
                success=False,
                operation="full_init",
                duration_ms=total_duration,
                started_at=started_at,
                completed_at=datetime.now(timezone.utc),
                error_message=str(e),
                source=extractor.source_info if 'extractor' in locals() else None,
                force=force,
                tables_skipped_existing=tables_skipped_existing if 'tables_skipped_existing' in locals() else 0,
                stopped_early=True,
                abort_reason=str(e),
            )

    async def _save_table_schema_with_retry(
        self,
        schema: "TableSchema",
        context: "ToolContext",
    ) -> str:
        """Save one table schema with bounded retry for transient failures."""
        delay = self._save_retry_delay
        last_error: Optional[Exception] = None

        for attempt in range(1, self._save_retry_attempts + 1):
            try:
                return await self._schema_memory.save_table_schema(
                    schema=schema,
                    context=context,
                )
            except Exception as exc:
                last_error = exc
                if attempt >= self._save_retry_attempts or not self._is_transient_error(exc):
                    raise

                logger.warning(
                    "Transient schema save error for %s (attempt %s/%s): %s; retrying in %.1fs",
                    schema.full_name,
                    attempt,
                    self._save_retry_attempts,
                    self._summarize_error(exc),
                    delay,
                )
                await asyncio.sleep(delay)
                delay *= 2

        if last_error is not None:
            raise last_error
        raise RuntimeError("Unexpected save retry failure")

    async def _load_existing_table_names(self, context: "ToolContext") -> Set[str]:
        """Load table full names already present in SchemaMemory."""
        if not hasattr(self._schema_memory, "list_tables"):
            return set()

        existing: Set[str] = set()
        offset = 0
        page_size = 1000

        while True:
            try:
                tables = await self._schema_memory.list_tables(
                    context,
                    limit=page_size,
                    offset=offset,
                )
            except Exception as exc:
                logger.warning(
                    "Failed to load existing schema tables for resume mode: %s",
                    self._summarize_error(exc),
                )
                return set()

            if not tables:
                break

            for table_schema in tables:
                full_name = getattr(table_schema, "full_name", None)
                if full_name:
                    existing.add(full_name)

            if len(tables) < page_size:
                break

            offset += page_size

        return existing

    def _get_abort_reason(
        self,
        *,
        error_category: str,
        error_message: str,
        consecutive_non_transient_failures: int,
        consecutive_same_non_transient_errors: int,
        consecutive_transient_failures: int,
    ) -> Optional[str]:
        """Decide whether initialization should abort early and return the reason."""
        if self._stop_on_first_error:
            return f"Stopped on first table failure: {error_message}"

        if error_category == "fatal":
            return f"Fatal schema init error: {error_message}"

        if error_category == "transient":
            if consecutive_transient_failures >= self._max_consecutive_transient_failures:
                return (
                    "Repeated transient failures "
                    f"({consecutive_transient_failures} in a row): {error_message}"
                )
            return None

        if consecutive_same_non_transient_errors >= self._max_consecutive_same_errors:
            return (
                "Repeated same non-transient error "
                f"({consecutive_same_non_transient_errors} in a row): {error_message}"
            )

        if consecutive_non_transient_failures >= self._max_consecutive_failures:
            return (
                "Too many consecutive non-transient failures "
                f"({consecutive_non_transient_failures} in a row): {error_message}"
            )

        return None

    def _summarize_error(self, error: Exception, *, max_length: int = 240) -> str:
        """Return a compact error string for user-facing output."""
        text = self._error_text(error)
        if len(text) <= max_length:
            return text
        return text[: max_length - 3] + "..."

    def _error_text(self, error: Exception) -> str:
        """Build a stable error text from an exception chain."""
        parts = [error.__class__.__name__]
        code = getattr(error, "code", None)
        if code:
            parts.append(str(code))

        message = str(error).strip()
        if message:
            parts.append(message)

        cause = getattr(error, "__cause__", None)
        if cause is not None and cause is not error:
            cause_message = str(cause).strip()
            if cause_message and cause_message != message:
                parts.append(cause.__class__.__name__)
                parts.append(cause_message)

        return " | ".join(parts)

    def _build_error_signature(self, error: Exception) -> str:
        """Normalize errors so repeated systemic failures can be detected."""
        text = self._error_text(error).lower()
        text = re.sub(r"\s+", " ", text).strip()

        if any(token in text for token in ("429", "rate limit", "too many requests")):
            return "rate_limit"
        if any(token in text for token in ("timeout", "timed out", "deadline exceeded")):
            return "timeout"
        if "connection refused" in text or "connection reset" in text:
            return "connection"
        if "invalid input" in text and "syntax" in text:
            return "syntax"

        return f"{error.__class__.__name__}:{text[:160]}"

    def _classify_error(self, error: Exception) -> str:
        """Classify errors into fatal, transient, or recoverable groups."""
        text = self._error_text(error).lower()

        fatal_tokens = (
            "syntax",
            "invalid input",
            "permission denied",
            "unauthorized",
            "forbidden",
            "authentication failed",
            "not configured",
            "unsupported",
        )
        if any(token in text for token in fatal_tokens):
            return "fatal"

        return "transient" if self._is_transient_error(error) else "recoverable"

    def _is_transient_error(self, error: Exception) -> bool:
        """Return True for errors worth retrying."""
        signature = self._build_error_signature(error)
        return signature in {"rate_limit", "timeout", "connection"}

    async def incremental_update(
        self,
        extractor: SchemaExtractor,
        since: datetime,
    ) -> InitResult:
        """
        Perform incremental update based on modification time.
        
        NOTE: This is a reserved method for future implementation.
        Current version performs full initialization via agent startup.
        
        Args:
            extractor: SchemaExtractor implementation
            since: Only include tables modified since this time
            
        Returns:
            InitResult with operation statistics
            
        Raises:
            NotImplementedError: This method is not yet implemented
        """
        raise NotImplementedError(
            "Incremental update is reserved for future implementation. "
            "Use initialize() for full initialization."
        )

    async def start_background_sync(
        self,
        extractor: SchemaExtractor,
        interval_seconds: int = 3600,
    ) -> None:
        """
        Start background synchronization.
        
        NOTE: This is a reserved method for future implementation.
        
        Args:
            extractor: SchemaExtractor implementation
            interval_seconds: Sync interval in seconds
            
        Raises:
            NotImplementedError: This method is not yet implemented
        """
        raise NotImplementedError(
            "Background sync is reserved for future implementation."
        )

    def get_statistics(self) -> Dict[str, Any]:
        """
        Get current SchemaMemory statistics.
        
        Returns:
            Dictionary with storage statistics
        """
        if hasattr(self._schema_memory, 'get_statistics'):
            return self._schema_memory.get_statistics()
        return {}
