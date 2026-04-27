"""
Table Schema memory storage models and types.
"""

from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class RelationshipType(str, Enum):
    """Relationship types between tables."""
    ONE_TO_ONE = "ONE_TO_ONE"
    ONE_TO_MANY = "ONE_TO_MANY"
    MANY_TO_MANY = "MANY_TO_MANY"


class BusinessContext(BaseModel):
    """Business context for a table - used for vector search."""
    model_config = ConfigDict(frozen=True)

    domain: str = Field(description="Business domain: e.g., 'Order', 'Inventory', 'User'")
    description: str = Field(description="Business description of the table, used for vector retrieval.")
    keywords: Optional[List[str]] = Field(default=None, description="Keywords for search enhancement")


class ForeignKeyReference(BaseModel):
    """Structured foreign key reference."""

    table_name: str
    schema_name: Optional[str] = "public"
    column_name: str

    @property
    def full_path(self) -> str:
        return f"{self.schema_name}.{self.table_name}.{self.column_name}"


class FieldDefinition(BaseModel):
    """Field/column definition within a table."""

    field_name: str
    data_type: str
    ordinal_position: int = 0

    is_primary_key: bool = False
    is_foreign_key: bool = False
    is_nullable: bool = True
    is_unique: bool = False

    foreign_key: Optional[ForeignKeyReference] = None


    description: Optional[str] = Field(  
        default=None,  
        description="Technical description of the column"  
    )  
    business_meaning: Optional[str] = Field(  
        default=None,  
        description="Business-level explanation of what this field represents"  
    )  
    example_values: Optional[List[str]] = Field(  
        default=None,  
        description="Representative sample values for this column"  
    )  
    enums: Optional[List[str]] = Field(  
        default=None,  
        description="Allowed enum values if the column is an enumeration type")  


class TableRelationship(BaseModel):
    """Relationship definition between tables."""

    from_table: str
    from_field: str
    to_table: str
    to_field: str
    relationship_type: RelationshipType = RelationshipType.ONE_TO_MANY
    description: Optional[str] = Field(  
        default=None,  
        description="Optional description of the business meaning of this join"  
    )


class TableSchema(BaseModel):
    """Complete table schema definition."""

    table_name: str
    schema_name: str = "public"
    database_name: Optional[str] = None

    ddl: str

    field_definitions: List[FieldDefinition] = Field(default_factory=list)
    relationships: List[TableRelationship] = Field(default_factory=list)
    business_context: BusinessContext

    @property
    def full_name(self) -> str:
        parts = [p for p in [self.database_name, self.schema_name, self.table_name] if p]
        return ".".join(parts)

    @property
    def primary_key_fields(self) -> List[str]:
        return [f.field_name for f in self.field_definitions if f.is_primary_key]

    def to_summary(self) -> str:
        """Brief abstract for listing."""
        return f"{self.full_name}: {self.business_context.description}"

    def to_system_prompt(self) -> str:
        """Comprehensive information for System Prompt/Messages injection."""
        fields_desc = "\n".join([
            f"  - {f.field_name} ({f.data_type}): {f.business_meaning or f.description or ''}"
            for f in self.field_definitions
        ])
        return f"""Table: {self.full_name}
Domain: {self.business_context.domain}
Description: {self.business_context.description}
Fields/Columns:
{fields_desc}
Primary Key: {', '.join(self.primary_key_fields) or 'None'}"""

    def to_vector_text(self) -> str:
        """Text representation for vector embedding and search."""
        parts = [
            self.full_name,
            self.business_context.domain,
            self.business_context.description,
        ]
        if self.business_context.keywords:
            parts.append(" ".join(self.business_context.keywords))
        for f in self.field_definitions:
            parts.append(f.field_name)
            if f.business_meaning:
                parts.append(f.business_meaning)
        return " | ".join(filter(None, parts))


class SchemaSearchResult(BaseModel):
    """Represents a search result from schema memory storage."""

    table_schema: TableSchema
    similarity_score: float
    rank: int
    match_reason: Optional[str] = None
    graph_hops: Optional[int] = None
