"""
Schema List Component for displaying SchemaMemory table list with completeness status.
"""

from typing import List, Optional, Dict, Any
from pydantic import Field

from ....core.rich_component import RichComponent, ComponentType


class SchemaListComponent(RichComponent):
    """
    Component for displaying SchemaMemory table list.
    
    This component shows:
    - Statistics summary
    - Filterable table list
    - Completeness indicators
    - Quick actions (view, edit, enrich)
    
    Example:
        >>> component = SchemaListComponent(
        ...     title="SchemaMemory Management",
        ...     tables=items,
        ...     statistics=stats
        ... )
    """
    
    type: ComponentType = ComponentType.CARD
    
    # Title
    title: str = "SchemaMemory Management"
    
    # Table list data
    tables: List[Dict[str, Any]] = Field(default_factory=list)
    
    # Statistics
    statistics: Dict[str, Any] = Field(default_factory=dict)
    
    # Display options
    show_actions: bool = True
    compact_mode: bool = False
    
    # Filter state
    search_query: Optional[str] = None
    domain_filter: Optional[str] = None
    show_incomplete_only: bool = False
    
    # Pagination
    page: int = 1
    page_size: int = 20
    total_count: int = 0
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for frontend rendering."""
        return {
            "type": "schema_list",
            "title": self.title,
            "tables": self.tables,
            "statistics": self.statistics,
            "show_actions": self.show_actions,
            "compact_mode": self.compact_mode,
            "filters": {
                "search_query": self.search_query,
                "domain_filter": self.domain_filter,
                "show_incomplete_only": self.show_incomplete_only,
            },
            "pagination": {
                "page": self.page,
                "page_size": self.page_size,
                "total_count": self.total_count,
                "total_pages": (self.total_count + self.page_size - 1) // self.page_size,
            },
        }

    def serialize_for_frontend(self) -> Dict[str, Any]:
        """Serialize with the schema-specific frontend type."""
        payload = super().serialize_for_frontend()
        payload["type"] = "schema_list"
        return payload
    
    @classmethod
    def from_list_items(
        cls,
        items: List[Any],
        statistics: Dict[str, Any],
        *,
        page: int = 1,
        page_size: int = 20,
        **kwargs
    ) -> "SchemaListComponent":
        """
        Create SchemaListComponent from SchemaListItem models.
        
        Args:
            items: List of SchemaListItem
            statistics: Statistics dict
            page: Current page
            page_size: Items per page
            **kwargs: Additional component options
        """
        tables = []
        for item in items:
            table = item.table_schema
            tables.append({
                "full_name": table.full_name,
                "table_name": table.table_name,
                "schema_name": table.schema_name,
                "domain": table.business_context.domain,
                "description": table.business_context.description,
                "field_count": item.field_count,
                "fk_count": item.fk_count,
                "completeness_score": item.completeness_score,
                "is_complete": item.is_complete,
                "status_icon": item.status_icon,
                "status_text": item.status_text,
                "missing_summary": item.get_missing_summary(),
                "complete_field_count": item.complete_field_count,
            })
        
        return cls(
            tables=tables,
            statistics=statistics,
            page=page,
            page_size=page_size,
            total_count=len(items),
            **kwargs
        )


class SchemaListRowComponent(RichComponent):
    """
    Single row in the schema list (for inline display).
    
    This is a lighter version for use within other components.
    """
    
    type: ComponentType = ComponentType.CARD
    
    full_name: str
    table_name: str
    schema_name: str
    domain: str
    description: str
    field_count: int
    fk_count: int
    
    completeness_score: float
    is_complete: bool
    status_icon: str
    status_text: str
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": "schema_list_row",
            "full_name": self.full_name,
            "table_name": self.table_name,
            "schema_name": self.schema_name,
            "domain": self.domain,
            "description": self.description,
            "field_count": self.field_count,
            "fk_count": self.fk_count,
            "completeness_score": self.completeness_score,
            "is_complete": self.is_complete,
            "status_icon": self.status_icon,
            "status_text": self.status_text,
        }
