"""
RLS (Row-Level Security) Registry for QueryMind.

This module provides RLSToolRegistry that extends ToolRegistry with:
- SQL Injection Prevention
- Territory-Based Row-Level Security (RLS)
- Query Complexity Limits

Usage:
    from QueryMind.rls_registry import RLSToolRegistry

    registry = RLSToolRegistry()
"""

import re
import logging
from typing import Any, Dict, List, Optional, Type, TypeVar, Union

import yaml
from importlib import resources
from pathlib import Path

from QueryMind.core.registry import ToolRegistry
from QueryMind.core.agent.sql_governance import (
    SqlGovernancePolicy,
    sql_governance_rejection_reason,
    sql_semantics_rejection_reason,
    sql_skeleton_freeze_rejection_reason,
)
from QueryMind.core.tool import Tool, ToolContext, ToolRejection
from QueryMind.core.user import User
from QueryMind.capabilities.sql_runner.models import RunSqlToolArgs

logger = logging.getLogger(__name__)

T = TypeVar("T")


class RLSToolRegistry(ToolRegistry):
    """ToolRegistry with RLS and SQL injection protection.
    
    Extends the base ToolRegistry to intercept and transform SQL queries
    before execution, applying row-level security based on user groups.
    """
    
    def __init__(
        self,
        config_path: str = "rls_config.yaml",
        audit_logger=None,
        audit_config=None,
    ):
        """Initialize RLS Registry.
        
        Args:
            config_path: Path to rls_config.yaml
            audit_logger: Optional audit logger
            audit_config: Optional audit config
        """
        super().__init__(audit_logger=audit_logger, audit_config=audit_config)
        self._load_config(config_path)
        self._sql_governance_policy = SqlGovernancePolicy.from_env()
    
    def _load_config(self, config_path: str) -> None:
        """Load RLS configuration from YAML file."""
        path = Path(config_path)
        if not path.exists():
            package_resource = resources.files("QueryMind").joinpath(config_path)
            if package_resource.is_file():
                with package_resource.open("r", encoding="utf-8") as f:
                    self.config = yaml.safe_load(f)
                logger.info(f"Loaded RLS config from package resource {config_path}")
                return

            # Try relative to this file's directory as a final fallback.
            path = Path(__file__).parent / config_path

        if path.exists():
            with open(path, "r", encoding="utf-8") as f:
                self.config = yaml.safe_load(f)
            logger.info(f"Loaded RLS config from {path}")
            return

        logger.warning(f"RLS config not found at {path}, using defaults")
        self.config = self._default_config()
    
    def _default_config(self) -> Dict[str, Any]:
        """Return default RLS configuration."""
        return {
            "territory_rls": {"enabled": False, "group_territory_mapping": {}, "protected_tables": []},
            "sql_injection": {"enabled": True, "forbidden_patterns": []},
            "sql_semantics": {
                "enabled": True,
                "check_row_grain": True,
                "check_window": True,
                "check_navigation_window": True,
                "check_aggregation": True,
                "check_rollup": True,
                "check_join": True,
                "check_partition_constant": True,
                "check_outer_join_null_filter": True,
                "require_partition_by_for_window_cues": True,
            },
            "query_limits": {"enabled": True, "max_query_length": 10000},
            "audit": {"log_sql_transformations": True, "log_rejected_queries": True},
        }
    
    # ========================================================================
    # SQL Injection Prevention
    # ========================================================================
    
    def _detect_sql_injection(self, sql: str) -> Optional[str]:
        """Check for SQL injection patterns.
        
        Args:
            sql: SQL query string
            
        Returns:
            Rejection reason string if injection detected, None otherwise
        """
        if not self.config.get("sql_injection", {}).get("enabled", True):
            return None

        allowed_metadata = self.config.get("sql_injection", {}).get(
            "allowed_metadata_patterns",
            [],
        )
        is_metadata_introspection = False
        for item in allowed_metadata:
            pattern = item.get("pattern", "") if isinstance(item, dict) else item
            case_sensitive = item.get("case_sensitive", True) if isinstance(item, dict) else False
            flags = 0 if case_sensitive else re.IGNORECASE
            if re.search(pattern, sql, flags):
                is_metadata_introspection = True
                break
        
        forbidden = self.config.get("sql_injection", {}).get("forbidden_patterns", [])
        system_catalog_pattern = "(pg_|pg_catalog|information_schema|sys\\.)"
        
        for item in forbidden:
            pattern = item.get("pattern", "") if isinstance(item, dict) else item
            case_sensitive = item.get("case_sensitive", True) if isinstance(item, dict) else False
            if is_metadata_introspection and pattern == system_catalog_pattern:
                continue
            
            flags = 0 if case_sensitive else re.IGNORECASE
            if re.search(pattern, sql, flags):
                reason = item.get("description", "SQL injection pattern detected") if isinstance(item, dict) else "SQL injection detected"
                logger.warning(f"SQL injection blocked: {reason} - pattern: {pattern}")
                return reason
        
        return None
    
    # ========================================================================
    # Query Complexity Validation
    # ========================================================================
    
    def _validate_query_complexity(self, sql: str) -> Optional[str]:
        """Validate query doesn't exceed complexity limits.
        
        Args:
            sql: SQL query string
            
        Returns:
            Rejection reason if too complex, None otherwise
        """
        if not self.config.get("query_limits", {}).get("enabled", True):
            return None
        
        limits = self.config.get("query_limits", {})
        
        # Check query length
        max_length = limits.get("max_query_length", 10000)
        if len(sql) > max_length:
            return f"Query exceeds maximum length ({len(sql)} > {max_length})"
        
        # Count subqueries
        max_subqueries = limits.get("max_subqueries", 5)
        subquery_count = len(re.findall(r"\(\s*SELECT\s", sql, re.IGNORECASE))
        if subquery_count > max_subqueries:
            return f"Query has too many subqueries ({subquery_count} > {max_subqueries})"
        
        # Count CTEs
        max_cte = limits.get("max_cte_depth", 3)
        cte_count = len(re.findall(r"\bWITH\s+", sql, re.IGNORECASE))
        if cte_count > max_cte:
            return f"Query has too many CTEs ({cte_count} > {max_cte})"
        
        # Count JOINs
        max_joins = limits.get("max_joins", 15)
        join_count = len(re.findall(r"\bJOIN\s+", sql, re.IGNORECASE))
        if join_count > max_joins:
            return f"Query has too many JOINs ({join_count} > {max_joins})"
        
        return None
    
    # ========================================================================
    # Territory-Based RLS
    # ========================================================================
    
    def _get_user_territories(self, user: User) -> List[int]:
        """Get list of territory IDs user can access.
        
        Args:
            user: User object with group_memberships
            
        Returns:
            List of allowed TerritoryIDs (empty list = no access)
        """
        mapping = self.config.get("territory_rls", {}).get("group_territory_mapping", {})
        
        allowed_territories = set()
        for group in user.group_memberships:
            territories = mapping.get(group, [])
            allowed_territories.update(territories)
        
        return list(allowed_territories)
    
    def _should_apply_rls(self, sql: str) -> bool:
        """Check if RLS should be applied to this query.
        
        Args:
            sql: SQL query string
            
        Returns:
            True if RLS should be applied
        """
        if not self.config.get("territory_rls", {}).get("enabled", False):
            return False
        
        # Only apply RLS to SELECT queries
        sql_upper = sql.strip().upper()
        if not sql_upper.startswith("SELECT"):
            return False
        
        # Check if query references protected tables
        protected = self.config.get("territory_rls", {}).get("protected_tables", [])
        for table_config in protected:
            table_name = table_config.get("table", "")
            if table_name.lower() in sql.lower():
                return True
        
        return False
    
    def _extract_table_references(self, sql: str) -> List[str]:
        """Extract table references from SQL query.
        
        Args:
            sql: SQL query string
            
        Returns:
            List of table names found in FROM/JOIN clauses
        """
        tables = []
        
        # Match FROM and JOIN clauses
        pattern = r"(?:FROM|JOIN)\s+([a-zA-Z_][a-zA-Z0-9_\.]*)"
        tables = re.findall(pattern, sql, re.IGNORECASE)
        
        return tables
    
    def _apply_territory_rls(self, sql: str, user: User) -> str:
        """Apply territory-based RLS to SQL query.
        
        This method modifies the SQL to inject WHERE clauses that filter
        data based on the user's allowed territories.
        
        Args:
            sql: Original SQL query
            user: User with group memberships
            
        Returns:
            Modified SQL with RLS WHERE clauses injected
        """
        territories = self._get_user_territories(user)
        
        if not territories:
            # User has no territory access - return query that returns nothing
            logger.info(f"User {user.id} has no territory access, query will return empty")
            # Find first FROM table and add WHERE 1=0 (or we could prepend LIMIT 0)
            return re.sub(
                r"(WHERE\s+.*)$",
                r"WHERE 1=0 AND \1",
                sql,
                flags=re.IGNORECASE
            )
        
        protected = self.config.get("territory_rls", {}).get("protected_tables", [])
        table_territory_map = {t.get("table", "").lower(): t for t in protected}
        
        modified_sql = sql
        
        # Process each protected table
        for table_name, table_config in table_territory_map.items():
            territory_col = table_config.get("territory_column", "")
            join_table = table_config.get("join_table", "")
            join_col = table_config.get("join_column", "")
            via_col = table_config.get("via_territory_column", "")
            
            # Check if this table is referenced in the query
            if table_name.lower() not in modified_sql.lower():
                continue
            
            if territory_col:
                # Direct territory column - inject WHERE clause
                territory_list = ",".join(str(t) for t in territories)
                
                # Check if WHERE clause already exists
                if re.search(r"\bWHERE\b", modified_sql, re.IGNORECASE):
                    # Append to existing WHERE
                    pattern = rf"({re.escape(table_name)}\s+)(AS\s+\w+\s+)?"
                    if re.search(pattern, modified_sql, re.IGNORECASE):
                        # Table has alias with WHERE - use comma approach
                        pass
                    
                    # Simple approach: add AND to existing WHERE for this table
                    # We need to be smarter about aliases...
                    
                    # For now, if WHERE exists and table is referenced directly,
                    # we add: AND (table.TerritoryID IN (...) OR table.TerritoryID IS NULL)
                    if f"{table_name}." in modified_sql.upper():
                        alias_match = re.search(
                            rf"{re.escape(table_name)}\s+(AS\s+)?(\w+)",
                            modified_sql,
                            re.IGNORECASE
                        )
                        if alias_match:
                            alias = alias_match.group(2)
                            new_condition = f"({alias}.{territory_col} IN ({territory_list}) OR {alias}.{territory_col} IS NULL)"
                        else:
                            new_condition = f"({table_name}.{territory_col} IN ({territory_list}) OR {table_name}.{territory_col} IS NULL)"
                        
                        # Append after WHERE
                        modified_sql = re.sub(
                            r"(WHERE\s+)(.*)$",
                            lambda m: f"{m.group(1)}{m.group(2)} AND {new_condition}",
                            modified_sql,
                            flags=re.IGNORECASE | re.DOTALL
                        )
                else:
                    # No WHERE - add after FROM clause
                    # Find the FROM clause for this table
                    from_pattern = rf"FROM\s+{re.escape(table_name)}(?:\s+AS\s+\w+)?(?:\s*,\s*|\s+(?:LEFT|RIGHT|INNER|OUTER|CROSS)?\s*JOIN|WHERE|GROUP|ORDER|LIMIT)"
                    match = re.search(from_pattern, modified_sql, re.IGNORECASE)
                    if match:
                        insert_pos = match.end()
                        new_condition = f" WHERE {table_name}.{territory_col} IN ({territory_list}) OR {table_name}.{territory_col} IS NULL"
                        modified_sql = modified_sql[:insert_pos] + new_condition + modified_sql[insert_pos:]
        
        if modified_sql != sql and self.config.get("audit", {}).get("log_sql_transformations", True):
            logger.info(f"RLS applied for user {user.id}: territories={territories}")
        
        return modified_sql
    
    # ========================================================================
    # Main transform_args implementation
    # ========================================================================
    
    async def transform_args(
        self,
        tool: Tool[T],
        args: T,
        user: User,
        context: ToolContext,
    ) -> Union[T, ToolRejection]:
        """Transform and validate tool arguments based on RLS policies.
        
        This method is called by the base ToolRegistry.execute() method
        before passing arguments to the tool's execute() method.
        
        For SQL tools:
        1. Check for SQL injection patterns
        2. Validate query complexity
        3. Validate SQL shape semantics
        4. Apply territory-based RLS
        
        Args:
            tool: The tool being executed
            args: Already Pydantic-validated arguments
            user: The user executing the tool
            context: Full execution context
            
        Returns:
            Either:
            - Transformed arguments (may be unchanged)
            - ToolRejection with explanation
        """
        # Only process run_sql tool
        if tool.name not in ("run_sql", "RunSqlTool"):
            return args
        
        # Ensure args is RunSqlToolArgs
        if not isinstance(args, RunSqlToolArgs):
            return args
        
        sql = args.sql
        original_sql = sql

        # 1. SQL Injection Detection
        injection_reason = self._detect_sql_injection(sql)
        if injection_reason:
            if self.config.get("audit", {}).get("log_rejected_queries", True):
                logger.warning(f"SQL injection rejected for user {user.id}: {injection_reason}")
            return ToolRejection(reason=f"SQL rejected: {injection_reason}")
        
        # 2. Query Complexity Validation
        complexity_reason = self._validate_query_complexity(sql)
        if complexity_reason:
            return ToolRejection(reason=f"Query rejected: {complexity_reason}")

        # 3. SQL Semantics Validation
        semantics_reason = sql_semantics_rejection_reason(
            original_sql,
            user_message=context.raw_user_message,
            context_metadata=context.metadata,
            semantics_config=self.config.get("sql_semantics", {}),
            dialect=str(context.metadata.get("dialect") or "").strip() or None,
        )
        if semantics_reason:
            if self.config.get("audit", {}).get("log_rejected_queries", True):
                logger.warning(
                    f"SQL semantics rejected for user {user.id}: {semantics_reason}"
                )
            return ToolRejection(reason=f"SQL rejected: {semantics_reason}")

        # 4. Territory-Based RLS
        if self._should_apply_rls(sql):
            sql = self._apply_territory_rls(sql, user)
            
            # Log transformation if enabled
            if (
                self.config.get("audit", {}).get("log_sql_transformations", True) 
                and sql != original_sql
            ):
                logger.info(
                    f"RLS Transformation for user {user.id}: "
                    f"territories={self._get_user_territories(user)}"
                )
            
            # Update args with transformed SQL
            args.sql = sql

        governance_reason = sql_governance_rejection_reason(
            sql,
            context_metadata=context.metadata,
            policy=self._sql_governance_policy,
            dialect=str(context.metadata.get("dialect") or "").strip() or None,
        )
        if governance_reason:
            if self.config.get("audit", {}).get("log_rejected_queries", True):
                logger.warning(
                    f"SQL governance rejected for user {user.id}: {governance_reason}"
                )
            return ToolRejection(reason=f"SQL rejected: {governance_reason}")

        freeze_reason = sql_skeleton_freeze_rejection_reason(
            sql,
            context_metadata=context.metadata,
            dialect=str(context.metadata.get("dialect") or "").strip() or None,
        )
        if freeze_reason:
            if self.config.get("audit", {}).get("log_rejected_queries", True):
                logger.warning(
                    f"SQL frozen skeleton rejected for user {user.id}: {freeze_reason}"
                )
            return ToolRejection(reason=f"SQL rejected: {freeze_reason}")

        return args


# ========================================================================
# Convenience function for creating RLS-enabled registry
# ========================================================================

def create_rls_registry(
    config_path: str = "rls_config.yaml",
    audit_logger=None,
) -> RLSToolRegistry:
    """Create an RLS-enabled ToolRegistry.
    
    Args:
        config_path: Path to rls_config.yaml
        audit_logger: Optional audit logger
        
    Returns:
        Configured RLSToolRegistry instance
    """
    return RLSToolRegistry(
        config_path=config_path,
        audit_logger=audit_logger,
    )
