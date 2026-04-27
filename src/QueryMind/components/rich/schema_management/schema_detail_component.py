"""
Schema Detail Component for displaying and editing single table schema.
"""

from typing import List, Optional, Dict, Any
from pydantic import Field

from ....core.rich_component import RichComponent, ComponentType


class SchemaDetailComponent(RichComponent):
    """
    Component for displaying and editing single table schema.
    
    Features:
    - BusinessContext editing
    - Field list with edit capability
    - Foreign key relationships display
    - AI enrich button
    - Save/Cancel actions
    
    Example:
        >>> component = SchemaDetailComponent(
        ...     table_name="customers",
        ...     schema=table_schema,
        ...     is_editable=True
        ... )
    """
    
    type: ComponentType = ComponentType.CARD
    
    # Table identification
    table_name: str
    schema_name: str = "public"
    
    # Schema data
    domain: str
    description: str
    keywords: List[str] = Field(default_factory=list)
    
    # Fields
    fields: List[Dict[str, Any]] = Field(default_factory=list)
    
    # Foreign keys
    foreign_keys: List[Dict[str, Any]] = Field(default_factory=list)
    
    # Completeness
    completeness_score: float = 0.0
    missing_fields: List[str] = Field(default_factory=list)
    
    # State
    is_editable: bool = False
    is_saving: bool = False
    has_changes: bool = False
    
    # Actions
    show_enrich_button: bool = True
    show_save_button: bool = True
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for frontend rendering."""
        return {
            "type": "schema_detail",
            "table_name": self.table_name,
            "schema_name": self.schema_name,
            "business_context": {
                "domain": self.domain,
                "description": self.description,
                "keywords": self.keywords,
            },
            "fields": self.fields,
            "foreign_keys": self.foreign_keys,
            "completeness": {
                "score": self.completeness_score,
                "missing_fields": self.missing_fields,
            },
            "state": {
                "is_editable": self.is_editable,
                "is_saving": self.is_saving,
                "has_changes": self.has_changes,
            },
            "actions": {
                "show_enrich_button": self.show_enrich_button,
                "show_save_button": self.show_save_button,
            },
        }

    def serialize_for_frontend(self) -> Dict[str, Any]:
        """Serialize with the schema-specific frontend type."""
        payload = super().serialize_for_frontend()
        payload["type"] = "schema_detail"
        data = self.to_dict()
        data.pop("type", None)
        payload["data"] = data
        return payload
    
    @classmethod
    def from_table_schema(
        cls,
        table_schema: Any,
        *,
        is_editable: bool = False,
        **kwargs
    ) -> "SchemaDetailComponent":
        """
        Create SchemaDetailComponent from TableSchema.
        
        Args:
            table_schema: TableSchema model
            is_editable: Whether fields are editable
            **kwargs: Additional options
        """
        # Build fields list
        fields = []
        for field in table_schema.field_definitions:
            fk_ref = None
            if field.foreign_key:
                fk_ref = {
                    "table": field.foreign_key.table_name,
                    "column": field.foreign_key.column_name,
                }
            
            fields.append({
                "field_name": field.field_name,
                "data_type": field.data_type,
                "is_primary_key": field.is_primary_key,
                "is_foreign_key": field.is_foreign_key,
                "is_nullable": field.is_nullable,
                "business_meaning": field.business_meaning or "",
                "description": field.description or "",
                "foreign_key": fk_ref,
                "is_missing_meaning": not field.business_meaning,
            })
        
        # Build foreign keys list
        foreign_keys = []
        for rel in table_schema.relationships:
            foreign_keys.append({
                "from_field": rel.from_field,
                "to_table": rel.to_table,
                "to_field": rel.to_field,
                "description": rel.description,
            })
        
        return cls(
            table_name=table_schema.table_name,
            schema_name=table_schema.schema_name,
            domain=table_schema.business_context.domain,
            description=table_schema.business_context.description,
            keywords=table_schema.business_context.keywords or [],
            fields=fields,
            foreign_keys=foreign_keys,
            is_editable=is_editable,
            **kwargs
        )


class FieldEditRow(RichComponent):
    """
    Editable field row component.
    
    Used within SchemaDetailComponent for inline editing.
    """
    
    type: ComponentType = ComponentType.CARD
    
    field_name: str
    data_type: str
    business_meaning: str
    description: str
    is_missing: bool = False
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": "field_edit_row",
            "field_name": self.field_name,
            "data_type": self.data_type,
            "business_meaning": self.business_meaning,
            "description": self.description,
            "is_missing": self.is_missing,
        }
