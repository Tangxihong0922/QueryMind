"""
PostgreSQL implementation of SqlRunner interface.
"""

from typing import Optional

import pandas as pd

from QueryMind.capabilities.sql_runner import SqlRunner, RunSqlToolArgs
from QueryMind.core.tool import ToolContext


class PostgresRunner(SqlRunner):
    """PostgreSQL implementation of the SqlRunner interface."""

    def __init__(
        self,
        connection_string: Optional[str] = None,
        host: Optional[str] = None,
        port: Optional[int] = 5432,
        database: Optional[str] = None,
        user: Optional[str] = None,
        password: Optional[str] = None,
        **kwargs,
    ):
        """Initialize with PostgreSQL connection parameters.

        You can either provide a connection_string OR individual parameters (host, database, etc.).
        If connection_string is provided, it takes precedence.

        Args:
            connection_string: PostgreSQL connection string (e.g., "postgresql://user:password@host:port/database")
            host: Database host address
            port: Database port (default: 5432)
            database: Database name
            user: Database user
            password: Database password
            **kwargs: Additional psycopg2 connection parameters (sslmode, connect_timeout, etc.)
        """
        try:
            import psycopg2
            import psycopg2.extras

            self.psycopg2 = psycopg2
        except Exception as e:
            raise ImportError(
                "psycopg2 package is required. Install with: pip install psycopg2-binary"
            ) from e

        if connection_string:
            self.connection_string = connection_string
            self.connection_params = None
        elif host and database and user:
            self.connection_string = None
            self.connection_params = {
                "host": host,
                "port": port,
                "database": database,
                "user": user,
                "password": password,
                **kwargs,
            }
        else:
            raise ValueError(
                "Either provide connection_string OR (host, database, and user) parameters"
            )

    async def run_sql(
        self, args: RunSqlToolArgs, context: ToolContext
    ) -> pd.DataFrame:
        """Execute SQL query against PostgreSQL database and return results as DataFrame.

        Args:
            args: SQL query arguments
            context: Tool execution context

        Returns:
            DataFrame with query results

        Raises:
            psycopg2.Error: If query execution fails
        """
        # Connect to the database using either connection string or parameters
        if self.connection_string:
            conn = self.psycopg2.connect(self.connection_string)
        else:
            conn = self.psycopg2.connect(**self.connection_params)

        cursor = conn.cursor(cursor_factory=self.psycopg2.extras.RealDictCursor)

        try:
            # Execute the query
            cursor.execute(args.sql)

            # Treat any statement that produces a result set as a read query.
            # This correctly handles SELECT as well as CTE-based queries that
            # start with WITH but still return rows.
            if cursor.description is not None:
                rows = cursor.fetchall()
                columns = [desc[0] for desc in cursor.description]
                if not rows:
                    return pd.DataFrame(columns=columns)

                results_data = [dict(row) for row in rows]
                return pd.DataFrame(results_data, columns=columns)

            # For non-result statements (INSERT, UPDATE, DELETE, etc.)
            conn.commit()
            rows_affected = cursor.rowcount
            return pd.DataFrame({"rows_affected": [rows_affected]})

        finally:
            cursor.close()
            conn.close()
