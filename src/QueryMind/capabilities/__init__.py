"""
Capabilities module.

This package contains abstractions for tool capabilities - reusable utilities
that tools can compose via dependency injection.
"""

from .file_system import CommandResult, FileSearchMatch, FileSystem
from .sql_runner import RunSqlToolArgs, SqlRunner
from .schema_memory import SchemaMemory
from .schema_extracter import SchemaExtractor, SchemaSyncEngine
from .schema_management import SchemaManagementService

__all__ = [
    "FileSystem",
    "FileSearchMatch",
    "CommandResult",
    "SqlRunner",
    "RunSqlToolArgs",
    "SchemaMemory",
    "SchemaExtractor",
    "SchemaSyncEngine",
    "SchemaManagementService",
]
