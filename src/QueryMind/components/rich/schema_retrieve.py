"""
Schema retrieve UI component for displaying schema search results.
"""

from typing import List, Optional
from pydantic import BaseModel, Field

from ...core.rich_component import RichComponent, ComponentType


class SchemaRetrieveCardComponent(RichComponent):
    """UI component for displaying schema retrieval results.

    This component displays a collapsible card with schema search results,
    showing matched tables with their fields in a markdown-friendly format.

    Example UI output:
        📋 Schema检索结果 [⚖️ 混合搜索] ▼

        ### `sales.orders`
        **业务域**: Order
        **描述**: 订单主表，记录所有订单信息

        | 字段名       | 类型       | 主键 | 外键 | 业务含义         |
        |-------------|------------|------|------|-------------------|
        | order_id    | bigint     | ✓    |      | 订单唯一标识       |
        | customer_id | bigint     |      | ✓    | 客户ID             |

    Attributes:
        title: Card title, defaults to "Schema检索结果"
        search_mode: Search mode used for retrieval (hybrid/vector/graph/expand)
        query: Original search query
        tables: List of table schemas to display
        total_count: Total number of results
        collapsible: Whether the card can be collapsed
        collapsed: Initial collapsed state
    """

    type: ComponentType = ComponentType.CARD
    title: str = "Schema检索结果"
    subtitle: Optional[str] = None
    content: str = ""
    search_mode: str = "hybrid"
    query: str = ""
    tables: List["SchemaTableDisplay"] = Field(default_factory=list)
    total_count: int = 0
    collapsible: bool = True
    collapsed: bool = False
    icon: Optional[str] = "📋"
    markdown: bool = True

    model_config = {"arbitrary_types_allowed": True}


class SchemaTableDisplay(BaseModel):
    """Display information for a single table in schema retrieval results.

    Attributes:
        full_name: Full table name with schema (e.g., "sales.orders")
        schema_name: Schema name (e.g., "sales")
        table_name: Table name (e.g., "orders")
        domain: Business domain (e.g., "Order")
        description: Business description of the table
        fields: List of field information
        similarity_score: Optional relevance score
        match_reason: Optional explanation of why this table matched
    """

    full_name: str
    schema_name: str = "public"
    table_name: str
    domain: str
    description: str = ""
    fields: List["SchemaFieldDisplay"] = Field(default_factory=list)
    similarity_score: Optional[float] = None
    match_reason: Optional[str] = None


class SchemaFieldDisplay(BaseModel):
    """Display information for a single field/column.

    Attributes:
        field_name: Column name
        data_type: Database data type
        is_primary_key: Whether this is a primary key
        is_foreign_key: Whether this is a foreign key
        is_nullable: Whether the column allows NULL
        business_meaning: Business-level description of the field
        foreign_key_ref: Optional FK reference (e.g., "public.users.id")
    """

    field_name: str
    data_type: str
    is_primary_key: bool = False
    is_foreign_key: bool = False
    is_nullable: bool = True
    business_meaning: str = ""
    foreign_key_ref: Optional[str] = None
