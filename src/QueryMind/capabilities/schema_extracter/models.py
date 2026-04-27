"""
Models for schema extraction operations.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, TYPE_CHECKING
from datetime import datetime

if TYPE_CHECKING:
    from ..schema_memory.models import TableSchema


class SchemaExtractResult(BaseModel):
    """Result of a single schema extraction operation."""
    
    table_schema: "TableSchema"
    extracted_at: datetime = Field(default_factory=datetime.utcnow)
    extraction_duration_ms: Optional[float] = None
    
    # Extraction metadata
    table_name: str
    schema_name: str
    database_name: Optional[str] = None
    
    # Field count for quick validation
    field_count: int = 0
    
    class Config:
        arbitrary_types_allowed = True


class SchemaExtractSummary(BaseModel):
    """Summary of a batch schema extraction."""
    
    total_tables: int
    successful_extractions: int
    failed_extractions: int
    
    total_fields: int
    total_foreign_keys: int
    
    duration_ms: float
    
    errors: List[str] = Field(default_factory=list)
    
    # Table-level results
    tables: List[SchemaExtractResult] = Field(default_factory=list)
    
    @property
    def success_rate(self) -> float:
        """Calculate success rate percentage."""
        if self.total_tables == 0:
            return 0.0
        return (self.successful_extractions / self.total_tables) * 100


class InitResult(BaseModel):
    """Result of SchemaMemory initialization operation."""
    
    success: bool
    
    # Operation type
    operation: str = Field(description="Operation type: 'full_init', 'incremental', 'sync'")
    
    # Counts
    tables_processed: int = 0
    tables_created: int = 0
    tables_updated: int = 0
    tables_deleted: int = 0
    tables_skipped_existing: int = 0
    
    # Statistics
    duration_ms: float
    started_at: datetime
    completed_at: Optional[datetime] = None
    
    # Error information
    error_message: Optional[str] = None
    error_details: List[str] = Field(default_factory=list)
    stopped_early: bool = False
    abort_reason: Optional[str] = None
    
    # Metadata
    source: Optional[str] = Field(default=None, description="Extractor source info")
    force: bool = False
    
    @property
    def summary(self) -> str:
        """Generate human-readable summary."""
        if self.success:
            base = (
                f"SchemaMemory initialization completed successfully.\n"
                f"  - Tables processed: {self.tables_processed}\n"
                f"  - Created: {self.tables_created}\n"
                f"  - Updated: {self.tables_updated}\n"
                f"  - Skipped existing: {self.tables_skipped_existing}\n"
                f"  - Duration: {self.duration_ms:.2f}ms"
            )
            if self.error_details:
                return (
                    base
                    + f"\n  - Skipped: {len(self.error_details)}"
                    + "\n  - Status: completed with warnings"
                )
            return base
        else:
            return (
                f"SchemaMemory initialization aborted.\n"
                f"  - Error: {self.abort_reason or self.error_message}\n"
                f"  - Tables processed before failure: {self.tables_processed}"
                + ("\n  - Status: stopped early" if self.stopped_early else "")
            )
