"""
Resource Schemas
Request/Response models for resource library endpoints
"""

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.resource import ResourceType


class ResourceBase(BaseModel):
    """Base resource schema"""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    resource_type: ResourceType
    category_id: Optional[int] = None


class ResourceCreate(ResourceBase):
    """Schema for creating a resource"""
    content: Optional[str] = None
    file_url: Optional[str] = None
    external_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    tags: Optional[str] = None
    difficulty: Optional[str] = None


class ResourceUpdate(BaseModel):
    """Schema for updating resource"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    content: Optional[str] = None
    file_url: Optional[str] = None
    external_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    tags: Optional[str] = None
    difficulty: Optional[str] = None
    is_published: Optional[bool] = None


class ResourceResponse(ResourceBase):
    """Schema for resource response"""
    id: int
    content: Optional[str] = None
    file_url: Optional[str] = None
    external_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    author_id: Optional[int] = None
    tags: Optional[str] = None
    difficulty: Optional[str] = None
    views: int
    downloads: int
    is_published: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class ResourceSummary(BaseModel):
    """Simplified resource schema for listings"""
    id: int
    title: str
    description: Optional[str] = None
    resource_type: ResourceType
    thumbnail_url: Optional[str] = None
    views: int
    
    model_config = ConfigDict(from_attributes=True)
