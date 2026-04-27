"""
Models for Schema Management.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, TYPE_CHECKING

if TYPE_CHECKING:
    from ..schema_memory.models import TableSchema


class SchemaListItem(BaseModel):
    """
    Schema list item with completeness metadata.
    
    This model represents a table in the schema list with
    information about data completeness.
    """
    
    table_schema: "TableSchema"
    
    # Completeness status
    is_complete: bool = Field(
        description="Whether all required fields are populated"
    )
    
    missing_fields: List[str] = Field(
        default_factory=list,
        description="List of missing/incomplete field names"
    )
    
    # Counts
    field_count: int = Field(
        default=0,
        description="Total number of fields"
    )
    
    complete_field_count: int = Field(
        default=0,
        description="Number of fields with business_meaning"
    )
    
    fk_count: int = Field(
        default=0,
        description="Number of foreign key relationships"
    )
    
    # Completeness score (0-100)
    completeness_score: float = Field(
        default=0.0,
        ge=0.0,
        le=100.0,
        description="Percentage of completeness"
    )
    
    @property
    def status_icon(self) -> str:
        """Get status icon based on completeness."""
        if self.completeness_score >= 90:
            return "✅"
        elif self.completeness_score >= 50:
            return "⚠️"
        else:
            return "❌"
    
    @property
    def status_text(self) -> str:
        """Get status text based on completeness."""
        if self.completeness_score >= 90:
            return "Complete"
        elif self.completeness_score >= 50:
            return "Partially Missing"
        else:
            return "Severely Missing"
    
    def get_missing_summary(self) -> str:
        """Get human-readable missing summary."""
        if not self.missing_fields:
            return "None"
        
        # Group by type
        domain_missing = "domain" in self.missing_fields
        desc_missing = "description" in self.missing_fields
        field_missing = [f for f in self.missing_fields if f.startswith("field:")]
        
        parts = []
        if domain_missing:
            parts.append("Domain")
        if desc_missing:
            parts.append("Description")
        if field_missing:
            parts.append(f"{len(field_missing)} field business meanings")
        
        return ", ".join(parts) if parts else "None"


class EnrichPrompt(BaseModel):
    """
    Prompt template for AI enrichment.
    """
    
    table_name: str
    schema_name: str = "public"
    field_names: List[str]
    field_types: Dict[str, str]  # field_name -> data_type
    existing_description: Optional[str] = None
    missing_field_names: List[str] = Field(default_factory=list)
    
    def to_prompt(self) -> str:
        """Generate enrichment prompt for LLM."""
        field_list = "\n".join(
            f"- {name} ({self.field_types.get(name, 'unknown')})"
            for name in self.field_names
        )
        missing_field_list = "\n".join(
            f"- {name}" for name in self.missing_field_names
        ) or "- None"
        
        existing = (
            f"Existing description: {self.existing_description}"
            if self.existing_description
            else "Existing description: None"
        )
        
        return f"""You are a database business analyst. Please enrich the following table with BusinessContext information.

Table: {self.schema_name}.{self.table_name}
{existing}
Field list:
{field_list}

Fields missing business meaning:
{missing_field_list}

Return the result in the following JSON format (return JSON only, nothing else):
{{
    "domain": "Business domain (for example: Customer, Order, Product)",
    "description": "Short business description of the table (1-2 sentences)",
    "keywords": ["keyword1", "keyword2", "keyword3"],
    "field_meanings": {{
        "field_name_1": "Business meaning of the field"
    }}
}}

Requirements:
0. Output exactly one JSON object that can be parsed directly by json.loads. Do not include markdown, code fences, comments, or any explanatory text.
1. domain should be concise, usually a single business noun
2. description should explain the table's purpose from a business perspective
3. keywords should help semantic search and include typical usage scenarios
4. field_meanings must at least cover all fields listed as missing business meaning; you may add other fields if you are confident
5. Each field meaning should be concise, ideally one sentence"""


ENRICH_OUTPUT_SCHEMA: Dict[str, Any] = {
    "type": "object",
    "properties": {
        "domain": {
            "type": "string",
            "description": "Business domain name",
        },
        "description": {
            "type": "string",
            "description": "Business description of the table",
        },
        "keywords": {
            "type": "array",
            "items": {"type": "string"},
            "description": "Search keywords",
        },
        "field_meanings": {
            "type": "object",
            "additionalProperties": {"type": "string"},
            "description": "Field business meanings",
        },
    },
    "required": ["domain", "description", "keywords", "field_meanings"],
    "additionalProperties": False,
}


def build_enrich_output_config() -> Dict[str, Any]:
    """Build Anthropic structured output config for schema enrichment."""
    return {
        "format": {
            "type": "json_schema",
            "schema": ENRICH_OUTPUT_SCHEMA,
        }
    }


def build_enrich_response_format() -> Dict[str, Any]:
    """Build OpenAI response_format config for schema enrichment."""
    return {
        "type": "json_schema",
        "json_schema": {
            "name": "schema_enrich",
            "schema": ENRICH_OUTPUT_SCHEMA,
            "strict": True,
        },
    }


class EnrichResult(BaseModel):
    """
    Result from AI enrichment.
    """
    
    table_name: str
    domain: Optional[str] = None
    description: Optional[str] = None
    keywords: List[str] = Field(default_factory=list)
    field_meanings: Dict[str, str] = Field(default_factory=dict)
    
    # Metadata
    success: bool = True
    error: Optional[str] = None


class EnrichBatchResult(BaseModel):
    """
    Batch enrichment result.
    """
    
    total: int
    successful: int
    failed: int
    
    results: List[EnrichResult] = Field(default_factory=list)
    
    @property
    def success_rate(self) -> float:
        """Calculate success rate."""
        if self.total == 0:
            return 0.0
        return (self.successful / self.total) * 100

    @property
    def tables_enriched(self) -> int:
        """Backward-compatible alias for successful enrichments."""
        return self.successful

    @property
    def tables_failed(self) -> int:
        """Backward-compatible alias for failed enrichments."""
        return self.failed


# Resolve forward references eagerly so runtime SchemaListItem construction works
# regardless of import order.
from ..schema_memory.models import TableSchema  # noqa: E402

SchemaListItem.model_rebuild(_types_namespace={"TableSchema": TableSchema})
