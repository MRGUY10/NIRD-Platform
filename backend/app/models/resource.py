"""
Resource Model
Library of guides, tutorials, and documentation
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.core.database import Base


class ResourceType(str, enum.Enum):
    """Resource types"""
    GUIDE = "guide"
    TUTORIAL = "tutorial"
    DOCUMENTATION = "documentation"
    VIDEO = "video"
    SCRIPT = "script"
    TOOL = "tool"


class Resource(Base):
    __tablename__ = "resources"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text)
    content = Column(Text)
    
    # Type and category
    resource_type = Column(Enum(ResourceType), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    
    # Files and links
    file_url = Column(String(500))
    external_url = Column(String(500))
    thumbnail_url = Column(String(500))
    
    # Metadata
    author_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    tags = Column(Text)  # Comma-separated or JSON
    difficulty = Column(String(50))
    
    # Stats
    views = Column(Integer, default=0)
    downloads = Column(Integer, default=0)
    
    # Status
    is_published = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    category = relationship("Category")
    author = relationship("User")
    
    def __repr__(self):
        return f"<Resource {self.title} ({self.resource_type})>"
