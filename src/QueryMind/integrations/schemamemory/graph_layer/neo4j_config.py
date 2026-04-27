"""
Neo4j configuration for Schema Memory.

This module provides configuration management for Neo4j connections
used in the Schema Memory implementation.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from typing import Optional, Dict, Any
from urllib.parse import urlparse


@dataclass
class Neo4jConfig:
    """
    Configuration for Neo4j connection.
    
    Attributes:
        uri: Neo4j connection URI (e.g., "bolt://localhost:7687")
        username: Neo4j username
        password: Neo4j password
        database: Database name (default: "neo4j")
        max_connection_lifetime: Max connection lifetime in seconds
        max_connection_pool_size: Max connection pool size
        connection_acquisition_timeout: Connection acquisition timeout in seconds
        encrypted: Whether to use encrypted connection
        trust: Trust strategy ("TRUST_ALL_CERTIFICATES", "TRUST_SIGNED_CERTIFICATES")
        
    Example:
        >>> config = Neo4jConfig(
        ...     uri="bolt://localhost:7687",
        ...     username="neo4j",
        ...     password="secret"
        ... )
    """
    
    uri: str = "bolt://localhost:7687"
    username: str = "neo4j"
    password: str = "password"
    database: str = "neo4j"
    
    # Connection pool settings
    max_connection_lifetime: int = 3600
    max_connection_pool_size: int = 50
    connection_acquisition_timeout: int = 60
    
    # TLS settings
    encrypted: bool = False
    trust: str = "TRUST_ALL_CERTIFICATES"
    
    # Additional config
    extra_config: Dict[str, Any] = field(default_factory=dict)
    
    def __post_init__(self):
        """Validate configuration after initialization."""
        if not self.uri:
            raise ValueError("Neo4j URI is required")
        if not self.username:
            raise ValueError("Neo4j username is required")
    
    @property
    def parsed_uri(self) -> Optional[urlparse]:
        """Parse the URI for host/port information."""
        try:
            return urlparse(self.uri)
        except Exception:
            return None
    
    def to_neo4j_driver_config(self) -> Dict[str, Any]:
        """
        Convert to neo4j-driver configuration.
        
        Returns:
            Dict suitable for GraphDatabase.driver()
        """
        config = {
            "max_connection_lifetime": self.max_connection_lifetime,
            "max_connection_pool_size": self.max_connection_pool_size,
            "connection_acquisition_timeout": self.connection_acquisition_timeout,
            "encrypted": self.encrypted,
        }
        # Only add trust parameter when encrypted=True (newer neo4j 5.x+ drivers)
        # When encrypted=False, trust is not needed
        if self.encrypted:
            config["trust"] = self.trust
        config.update(self.extra_config)
        return config
    
    @classmethod
    def from_env(cls) -> "Neo4jConfig":
        """
        Create Neo4jConfig from environment variables.
        
        Environment variables:
            - NEO4J_URI: Neo4j connection URI
            - NEO4J_USERNAME: Neo4j username
            - NEO4J_PASSWORD: Neo4j password
            - NEO4J_DATABASE: Database name
        """
        return cls(
            uri=os.getenv("NEO4J_URI", "bolt://localhost:7687"),
            username=os.getenv("NEO4J_USERNAME", "neo4j"),
            password=os.getenv("NEO4J_PASSWORD", "password"),
            database=os.getenv("NEO4J_DATABASE", "neo4j"),
        )


class Neo4jConfigFactory:
    """
    Factory for creating Neo4jConfig instances.
    
    Provides various creation methods for different scenarios.
    """
    
    @staticmethod
    def create_local() -> Neo4jConfig:
        """Create config for local Neo4j instance."""
        return Neo4jConfig(
            uri="bolt://localhost:7687",
            username="neo4j",
            password="password",
            database="neo4j",
        )
    
    @staticmethod
    def create_from_env() -> Neo4jConfig:
        """Create config from environment variables."""
        return Neo4jConfig.from_env()
    
    @staticmethod
    def create_from_dict(data: Dict[str, Any]) -> Neo4jConfig:
        """Create config from dictionary."""
        return Neo4jConfig(**data)
    
    @staticmethod
    def create_from_url(url: str, database: str = "neo4j") -> Neo4jConfig:
        """
        Create config from a Neo4j connection URL.
        
        Supports formats:
            - bolt://localhost:7687
            - neo4j://localhost:7687
            - http://localhost:7474 (converted to bolt)
        
        Args:
            url: Neo4j connection URL
            database: Database name
            
        Returns:
            Neo4jConfig instance
        """
        # Convert neo4j:// to bolt:// if needed
        if url.startswith("neo4j://"):
            url = url.replace("neo4j://", "bolt://", 1)
        elif url.startswith("http://") or url.startswith("https://"):
            # Convert HTTP to bolt
            parsed = urlparse(url)
            host = parsed.hostname or "localhost"
            port = parsed.port or 7687
            url = f"bolt://{host}:{port}"
        
        # Extract credentials from URL if present
        parsed = urlparse(url)
        if parsed.username and parsed.password:
            return Neo4jConfig(
                uri=url,
                username=parsed.username,
                password=parsed.password,
                database=database,
            )
        else:
            return Neo4jConfig(uri=url, database=database)
