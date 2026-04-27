"""
Neo4j Graph Store - Graph structure storage for table schemas.

This module provides Neo4j-based storage for table schema metadata,
supporting custom node types (Table, Field, BusinessDomain) and
relationship types (HAS_FIELD, BELONGS_TO_DOMAIN, FK_TO, REFERENCES).

Graph Schema:
    Nodes:
        - (:Table {table_name, schema_name, database_name, vector_id, domain, description, keywords})
        - (:Field {field_name, data_type, business_meaning, is_primary_key, is_foreign_key})
        - (:BusinessDomain {domain})
    
    Relationships:
        - (:Table)-[:HAS_FIELD]->(:Field)
        - (:Table)-[:BELONGS_TO_DOMAIN]->(:BusinessDomain)
        - (:Table)-[:FK_TO {relationship_type}]->(:Table)
        - (:Field)-[:REFERENCES]->(:Field)
"""

from __future__ import annotations

import asyncio
from typing import List, Optional, Dict, Any, TYPE_CHECKING
from dataclasses import dataclass

try:
    from neo4j import GraphDatabase, Transaction
    NEO4J_AVAILABLE = True
except ImportError:
    NEO4J_AVAILABLE = False

from .neo4j_config import Neo4jConfig

if TYPE_CHECKING:
    from QueryMind.capabilities.schema_memory.models import (
        TableSchema,
        FieldDefinition,
        TableRelationship,
        SchemaSearchResult,
    )


DEFAULT_GRAPH_RELATIONSHIP_TYPES = ("FK_TO", "REFERENCES")
DEFAULT_TABLE_HOP_RELATIONSHIP_TYPES = ("FK_TO",)


def _normalize_relationship_types(
    relationship_types: Optional[List[str]],
    *,
    default_types: tuple[str, ...],
) -> List[str]:
    """Normalize relationship types for Cypher relationship patterns."""
    cleaned: List[str] = []
    candidates = relationship_types if relationship_types else list(default_types)

    for rel_type in candidates:
        normalized = str(rel_type).strip().lstrip(":")
        if not normalized or normalized in cleaned:
            continue
        cleaned.append(normalized)

    return cleaned or list(default_types)


def _build_relationship_pattern(
    relationship_types: Optional[List[str]],
    max_hops: int,
    *,
    min_hops: int = 1,
    default_types: tuple[str, ...] = DEFAULT_GRAPH_RELATIONSHIP_TYPES,
) -> str:
    """Build a valid Cypher variable-length relationship pattern."""
    types = _normalize_relationship_types(
        relationship_types,
        default_types=default_types,
    )
    return f":{'|'.join(types)}*{min_hops}..{max_hops}"


@dataclass
class TableNode:
    """Represents a Table node in Neo4j."""
    table_name: str
    schema_name: str
    database_name: Optional[str]
    domain: str
    description: str
    vector_id: Optional[str] = None
    full_name: Optional[str] = None  # Computed: schema.table or db.schema.table


@dataclass
class FieldNode:
    """Represents a Field node in Neo4j."""
    field_name: str
    data_type: str
    business_meaning: Optional[str]
    is_primary_key: bool
    is_foreign_key: bool


class Neo4jGraphStore:
    """
    Neo4j-based graph store for table schema metadata.
    
    This store manages the graph structure for table schemas,
    supporting FK traversal, domain filtering, and graph-based queries.
    
    Attributes:
        config: Neo4j connection configuration
        driver: Neo4j driver instance (lazy initialized)
    
    Example:
        >>> store = Neo4jGraphStore(config=Neo4jConfig(uri="bolt://localhost:7687"))
        >>> await store.initialize()  # Create constraints/indexes
        >>> await store.save_table_schema(schema)
        >>> related = await store.find_related_tables("orders", max_hops=2)
    """
    
    # Cypher query templates
    CREATE_CONSTRAINTS = [
        "CREATE CONSTRAINT table_name_unique IF NOT EXISTS "
        "FOR (t:Table) REQUIRE (t.table_name, t.schema_name) IS UNIQUE",
    ]
    
    CREATE_INDEXES = [
        "CREATE INDEX table_domain_index IF NOT EXISTS FOR (t:Table) ON (t.domain)",
        "CREATE INDEX field_name_index IF NOT EXISTS FOR (f:Field) ON (f.field_name)",
        "CREATE INDEX domain_name_index IF NOT EXISTS FOR (d:BusinessDomain) ON (d.domain)",
    ]
    
    def __init__(self, config: Neo4jConfig):
        if not NEO4J_AVAILABLE:
            raise ImportError(
                "neo4j is required for Neo4jGraphStore. Install with: pip install neo4j"
            )
        
        self._config = config
        self._driver = None
    
    @property
    def driver(self):
        """Get or create Neo4j driver (lazy initialization)."""
        if self._driver is None:
            self._driver = GraphDatabase.driver(
                self._config.uri,
                auth=(self._config.username, self._config.password),
                **self._config.to_neo4j_driver_config()
            )
        return self._driver
    
    async def initialize(self) -> None:
        """
        Initialize Neo4j schema: create constraints and indexes.
        
        Should be called once after store creation.
        """
        def _init(tx: Transaction):
            # Create constraints
            for constraint in self.CREATE_CONSTRAINTS:
                try:
                    tx.run(constraint)
                except Exception:
                    pass  # Ignore if already exists
            
            # Create indexes
            for index in self.CREATE_INDEXES:
                try:
                    tx.run(index)
                except Exception:
                    pass  # Ignore if already exists
        
        await asyncio.get_event_loop().run_in_executor(
            None, lambda: self.driver.session().execute_write(_init)
        )
    
    def close(self) -> None:
        """Close the Neo4j driver."""
        if self._driver is not None:
            self._driver.close()
            self._driver = None
    
    def _get_table_full_name(self, schema_name: str, table_name: str, database_name: Optional[str] = None) -> str:
        """Generate full table name."""
        parts = [p for p in [database_name, schema_name, table_name] if p]
        return ".".join(parts)
    
    # ==================== CRUD Operations ====================
    
    async def save_table_schema(self, schema: "TableSchema", vector_id: Optional[str] = None) -> str:
        """
        Save or update a table schema in Neo4j.
        
        Creates:
            - Table node with properties
            - Field nodes for each column
            - BusinessDomain node
            - HAS_FIELD relationships
            - BELONGS_TO_DOMAIN relationship
            - FK_TO relationships (from TableRelationship)
        
        Args:
            schema: TableSchema to save
            vector_id: Optional Mem0 memory ID for vector linking
            
        Returns:
            Table full name as unique identifier
        """
        full_name = self._get_table_full_name(
            schema.schema_name, schema.table_name, schema.database_name
        )
        
        def _save(tx: Transaction) -> str:
            # 1. Create/merge Table node
            tx.run("""
                MERGE (t:Table {table_name: $table_name, schema_name: $schema_name})
                SET t.database_name = $database_name,
                    t.domain = $domain,
                    t.description = $description,
                    t.keywords = $keywords,
                    t.full_name = $full_name
            """, 
                table_name=schema.table_name,
                schema_name=schema.schema_name,
                database_name=schema.database_name,
                domain=schema.business_context.domain,
                description=schema.business_context.description,
                keywords=schema.business_context.keywords or [],
                full_name=full_name,
                vector_id=vector_id
            )

            # Keep the table linked to exactly one business domain.
            # This avoids duplicate table rows when list queries expand
            # over multiple BELONGS_TO_DOMAIN relationships after enrichment.
            tx.run("""
                MATCH (t:Table {table_name: $table_name, schema_name: $schema_name})
                OPTIONAL MATCH (t)-[old_rel:BELONGS_TO_DOMAIN]->(:BusinessDomain)
                DELETE old_rel
            """,
                table_name=schema.table_name,
                schema_name=schema.schema_name,
            )

            if vector_id is not None:
                tx.run("""
                    MATCH (t:Table {table_name: $table_name, schema_name: $schema_name})
                    SET t.vector_id = $vector_id
                """,
                    table_name=schema.table_name,
                    schema_name=schema.schema_name,
                    vector_id=vector_id,
                )
            
            # 2. Create/merge BusinessDomain node
            tx.run("""
                MERGE (d:BusinessDomain {domain: $domain})
            """, domain=schema.business_context.domain)
            
            # 3. Link Table to BusinessDomain
            tx.run("""
                MATCH (t:Table {table_name: $table_name, schema_name: $schema_name})
                MATCH (d:BusinessDomain {domain: $domain})
                MERGE (t)-[:BELONGS_TO_DOMAIN]->(d)
            """, 
                table_name=schema.table_name,
                schema_name=schema.schema_name,
                domain=schema.business_context.domain
            )
            
            # 4. Create Field nodes and HAS_FIELD relationships
            for field in schema.field_definitions:
                tx.run("""
                    MERGE (f:Field {
                        field_name: $field_name,
                        table_name: $table_name,
                        schema_name: $schema_name
                    })
                    SET f.data_type = $data_type,
                        f.business_meaning = $business_meaning,
                        f.is_primary_key = $is_primary_key,
                        f.is_foreign_key = $is_foreign_key,
                        f.description = $description,
                        f.ordinal_position = $ordinal_position
                """,
                    field_name=field.field_name,
                    table_name=schema.table_name,
                    schema_name=schema.schema_name,
                    data_type=field.data_type,
                    business_meaning=field.business_meaning,
                    is_primary_key=field.is_primary_key,
                    is_foreign_key=field.is_foreign_key,
                    description=field.description,
                    ordinal_position=field.ordinal_position
                )
                
                # Link Table to Field
                tx.run("""
                    MATCH (t:Table {table_name: $table_name, schema_name: $schema_name})
                    MATCH (f:Field {field_name: $field_name, table_name: $table_name})
                    MERGE (t)-[:HAS_FIELD]->(f)
                """,
                    table_name=schema.table_name,
                    schema_name=schema.schema_name,
                    field_name=field.field_name
                )
                
                # Create REFERENCES relationship for FK fields
                if field.is_foreign_key and field.foreign_key:
                    fk = field.foreign_key
                    tx.run("""
                        MATCH (f:Field {field_name: $field_name, table_name: $table_name, schema_name: $schema_name})
                        MERGE (ref:Field {
                            field_name: $fk_column,
                            table_name: $fk_table,
                            schema_name: $fk_schema
                        })
                        MERGE (f)-[:REFERENCES]->(ref)
                    """,
                        field_name=field.field_name,
                        table_name=schema.table_name,
                        schema_name=schema.schema_name,
                        fk_column=fk.column_name,
                        fk_table=fk.table_name,
                        fk_schema=fk.schema_name or "public"
                    )
            
            # 5. Create FK_TO relationships between tables
            for rel in schema.relationships:
                tx.run("""
                    MATCH (from:Table {table_name: $from_table, schema_name: $from_schema})
                    MATCH (to:Table {table_name: $to_table, schema_name: $to_schema})
                    MERGE (from)-[r:FK_TO]->(to)
                    SET r.relationship_type = $rel_type,
                        r.from_field = $from_field,
                        r.to_field = $to_field,
                        r.description = $description
                """,
                    from_table=rel.from_table,
                    from_schema=schema.schema_name,
                    to_table=rel.to_table,
                    to_schema=rel.to_table.split('.')[0] if '.' in rel.to_table else schema.schema_name,
                    rel_type=rel.relationship_type.value if hasattr(rel.relationship_type, 'value') else str(rel.relationship_type),
                    from_field=rel.from_field,
                    to_field=rel.to_field,
                    description=rel.description
                )
            
            return full_name
        
        await asyncio.get_event_loop().run_in_executor(
            None, lambda: self.driver.session().execute_write(_save)
        )
        return full_name
    
    async def get_table_schema(
        self,
        table_name: str,
        schema_name: str = "public",
        database_name: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        """
        Get a table schema from Neo4j.
        
        Args:
            table_name: Table name
            schema_name: Schema name (default: "public")
            database_name: Optional database name
            
        Returns:
            Dict with table properties, fields, and relationships
        """
        def _get(tx: Transaction) -> Optional[Dict[str, Any]]:
            result = tx.run("""
                MATCH (t:Table {table_name: $table_name, schema_name: $schema_name})
                WHERE ($database_name IS NULL OR t.database_name = $database_name)
                OPTIONAL MATCH (t)-[:HAS_FIELD]->(f:Field)
                OPTIONAL MATCH (t)-[:BELONGS_TO_DOMAIN]->(d:BusinessDomain)
                OPTIONAL MATCH (t)-[fk:FK_TO]->(related:Table)
                OPTIONAL MATCH (t)<-[ref_in:FK_TO]-(ref_table:Table)
                WITH t,
                     collect(DISTINCT f) as fields,
                     collect(DISTINCT d) as domains,
                     collect(DISTINCT {rel: fk, table: related}) as fk_relations,
                     collect(DISTINCT ref_table) as referencing_tables
                RETURN t, fields, head(domains) as d,
                       fk_relations, referencing_tables
            """,
                table_name=table_name,
                schema_name=schema_name,
                database_name=database_name
            )
            
            records = list(result)
            if not records:
                return None
            
            record = records[0]
            table_node = record["t"]
            fields = record["fields"]
            domain_node = record["d"]
            fk_relations = record["fk_relations"]
            referencing_tables = record["referencing_tables"]
            
            return {
                "table": dict(table_node),
                "fields": [dict(f) for f in fields if f],
                "domain": dict(domain_node) if domain_node else None,
                "fk_relations": [
                    {"type": r["rel"].type, "target": dict(r["table"])}
                    for r in fk_relations if r.get("rel") and r.get("table")
                ],
                "referencing_tables": [dict(t) for t in referencing_tables if t]
            }
        
        return await asyncio.get_event_loop().run_in_executor(
            None, lambda: self.driver.session().execute_read(_get)
        )
    
    async def delete_table_schema(
        self,
        table_name: str,
        schema_name: str = "public"
    ) -> bool:
        """
        Delete a table schema from Neo4j.
        
        Args:
            table_name: Table name
            schema_name: Schema name
            
        Returns:
            True if deleted, False if not found
        """
        def _delete(tx: Transaction) -> bool:
            result = tx.run("""
                MATCH (t:Table {table_name: $table_name, schema_name: $schema_name})
                OPTIONAL MATCH (t)-[:HAS_FIELD]->(f:Field)
                WITH t, collect(DISTINCT f) AS fields
                FOREACH (field IN fields | DETACH DELETE field)
                DETACH DELETE t
                RETURN 1 as deleted
            """, table_name=table_name, schema_name=schema_name)
            
            record = list(result)
            if record:
                return record[0]["deleted"] > 0
            return False
        
        return await asyncio.get_event_loop().run_in_executor(
            None, lambda: self.driver.session().execute_write(_delete)
        )
    
    # ==================== Graph Queries ====================
    
    async def find_related_tables(
        self,
        table_name: str,
        schema_name: str = "public",
        max_hops: int = 2,
        relationship_types: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """
        Find tables related through FK relationships.
        
        Args:
            table_name: Starting table name
            schema_name: Schema name
            max_hops: Maximum number of hops
            relationship_types: Optional filter for relationship types
            
            Returns:
            List of related tables with hop count and relationship info
        """
        def _find(tx: Transaction) -> List[Dict[str, Any]]:
            rel_pattern = _build_relationship_pattern(
                relationship_types,
                max_hops,
                min_hops=1,
            )
            
            result = tx.run(f"""
                MATCH path = (start:Table {{table_name: $table_name, schema_name: $schema_name}})
                    -[{rel_pattern}]-(related:Table)
                WHERE start <> related
                WITH related, path, length(path) as hops
                RETURN related, min(hops) as min_hops, collect(DISTINCT relationships(path)) as rels
                ORDER BY min_hops
                LIMIT 20
            """,
                table_name=table_name,
                schema_name=schema_name
            )
            
            return [
                {
                    "table": dict(record["related"]),
                    "hops": record["min_hops"],
                    "relationships": record["rels"]
                }
                for record in result
            ]
        
        return await asyncio.get_event_loop().run_in_executor(
            None, lambda: self.driver.session().execute_read(_find)
        )
    
    async def find_tables_by_field(
        self,
        field_name: str,
        exact_match: bool = False,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Find tables by field name.
        
        Args:
            field_name: Field/column name to search for
            exact_match: If True, exact match; if False, case-insensitive contains
            limit: Maximum results
            
        Returns:
            List of tables with the matching field
        """
        def _find(tx: Transaction) -> List[Dict[str, Any]]:
            if exact_match:
                result = tx.run("""
                    MATCH (t:Table)-[:HAS_FIELD]->(f:Field {field_name: $field_name})
                    RETURN t, f
                    LIMIT $limit
                """, field_name=field_name, limit=limit)
            else:
                result = tx.run("""
                    MATCH (t:Table)-[:HAS_FIELD]->(f:Field)
                    WHERE toLower(f.field_name) CONTAINS toLower($field_name)
                    RETURN t, f
                    LIMIT $limit
                """, field_name=field_name, limit=limit)
            
            return [
                {"table": dict(record["t"]), "field": dict(record["f"])}
                for record in result
            ]
        
        return await asyncio.get_event_loop().run_in_executor(
            None, lambda: self.driver.session().execute_read(_find)
        )
    
    async def find_tables_by_domain(
        self,
        domain: str,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """
        Find all tables in a business domain.
        
        Args:
            domain: Business domain name
            limit: Maximum results
            
        Returns:
            List of tables in the domain
        """
        def _find(tx: Transaction) -> List[Dict[str, Any]]:
            result = tx.run("""
                MATCH (t:Table)-[:BELONGS_TO_DOMAIN]->(d:BusinessDomain {domain: $domain})
                RETURN t
                ORDER BY t.table_name
                LIMIT $limit
            """, domain=domain, limit=limit)
            
            return [{"table": dict(record["t"])} for record in result]
        
        return await asyncio.get_event_loop().run_in_executor(
            None, lambda: self.driver.session().execute_read(_find)
        )
    
    async def list_all_tables(
        self,
        domain_filter: Optional[str] = None,
        limit: int = 100,
        offset: int = 0
    ) -> List[Dict[str, Any]]:
        """
        List all tables, optionally filtered by domain.
        
        Args:
            domain_filter: Optional domain to filter by
            limit: Maximum results
            offset: Pagination offset
            
        Returns:
            List of tables
        """
        def _list(tx: Transaction) -> List[Dict[str, Any]]:
            if domain_filter:
                result = tx.run("""
                    MATCH (t:Table)-[:BELONGS_TO_DOMAIN]->(d:BusinessDomain {domain: $domain})
                    OPTIONAL MATCH (t)-[:HAS_FIELD]->(f:Field)
                    WITH t, head(collect(DISTINCT d)) as d, collect(DISTINCT f) as fields
                    ORDER BY t.schema_name, t.table_name
                    SKIP $offset
                    LIMIT $limit
                    RETURN t, d, fields
                """, domain=domain_filter, offset=offset, limit=limit)
            else:
                result = tx.run("""
                    MATCH (t:Table)
                    OPTIONAL MATCH (t)-[:BELONGS_TO_DOMAIN]->(d:BusinessDomain)
                    OPTIONAL MATCH (t)-[:HAS_FIELD]->(f:Field)
                    WITH t, head(collect(DISTINCT d)) as d, collect(DISTINCT f) as fields
                    ORDER BY t.schema_name, t.table_name
                    SKIP $offset
                    LIMIT $limit
                    RETURN t, d, fields
                """, offset=offset, limit=limit)
            
            return [
                {
                    "table": dict(record["t"]),
                    "domain": dict(record["d"]) if record["d"] else None,
                    "fields": [dict(field) for field in record["fields"] if field],
                }
                for record in result
            ]
        
        return await asyncio.get_event_loop().run_in_executor(
            None, lambda: self.driver.session().execute_read(_list)
        )
    
    async def get_table_hops_score(
        self,
        source_table: str,
        target_table: str,
        max_hops: int = 3
    ) -> Optional[float]:
        """
        Calculate graph-based relevance score between two tables.
        
        Score = 1 / (hops + 1) - closer tables get higher scores.
        
        Args:
            source_table: Source table full name
            target_table: Target table full name
            max_hops: Maximum traversal depth
            
        Returns:
            Score (0-1) or None if not reachable
        """
        parts = source_table.split('.')
        source_table_name = parts[-1]
        source_schema = parts[-2] if len(parts) > 1 else "public"
        
        parts = target_table.split('.')
        target_table_name = parts[-1]
        target_schema = parts[-2] if len(parts) > 1 else "public"
        
        def _score(tx: Transaction) -> Optional[float]:
            rel_pattern = _build_relationship_pattern(
                None,
                max_hops,
                min_hops=0,
                default_types=DEFAULT_TABLE_HOP_RELATIONSHIP_TYPES,
            )
            result = tx.run(f"""
                MATCH path = shortestPath(
                    (s:Table {table_name: $source_table, schema_name: $source_schema})
                    -[{rel_pattern}]-
                    (t:Table {table_name: $target_table, schema_name: $target_schema})
                )
                WITH length(path) as hops
                RETURN 1.0 / (hops + 1) as score
            """,
                source_table=source_table_name,
                source_schema=source_schema,
                target_table=target_table_name,
                target_schema=target_schema,
            )
            
            records = list(result)
            if records:
                return records[0]["score"]
            return None
        
        return await asyncio.get_event_loop().run_in_executor(
            None, lambda: self.driver.session().execute_read(_score)
        )
    
    async def get_statistics(self) -> Dict[str, int]:
        """
        Get statistics about stored schemas.
        
        Returns:
            Dict with counts of tables, fields, domains, and relationships
        """
        def _stats(tx: Transaction) -> Dict[str, int]:
            result = tx.run("""
                MATCH (t:Table) 
                OPTIONAL MATCH (t)-[:HAS_FIELD]->(f:Field)
                OPTIONAL MATCH (t)-[:BELONGS_TO_DOMAIN]->(d:BusinessDomain)
                OPTIONAL MATCH (t)-[r:FK_TO]->(:Table)
                RETURN count(DISTINCT t) as tables, 
                       count(DISTINCT f) as fields, 
                       count(DISTINCT d) as domains,
                       count(r) as relationships
            """)
            
            record = list(result)[0]
            return {
                "tables": record["tables"],
                "fields": record["fields"],
                "domains": record["domains"],
                "relationships": record["relationships"]
            }
        
        return await asyncio.get_event_loop().run_in_executor(
            None, lambda: self.driver.session().execute_read(_stats)
        )
    
    async def clear_all(self) -> None:
        """
        Clear all data from the graph store.
        
        WARNING: This deletes all nodes and relationships!
        """
        def _clear(tx: Transaction):
            tx.run("MATCH (n) DETACH DELETE n")
        
        await asyncio.get_event_loop().run_in_executor(
            None, lambda: self.driver.session().execute_write(_clear)
        )
    
    def __enter__(self):
        """Context manager entry."""
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.close()
        return False
