"""
Category Schemas
Request/Response models for category-related endpoints
"""

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional


class CategoryBase(BaseModel):
    """Base category schema"""
    name: str = Field(..., min_length=1, max_length=100)
    slug: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = Field(None, pattern=r'^#[0-9A-Fa-f]{6}$')


class CategoryCreate(CategoryBase):
    """Schema for creating a category"""
    pass


class CategoryUpdate(BaseModel):
    """Schema for updating category"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = Field(None, pattern=r'^#[0-9A-Fa-f]{6}$')


class CategoryResponse(CategoryBase):
    """Schema for category response"""
    id: int
    
    model_config = ConfigDict(from_attributes=True)


class CategoryWithCount(CategoryResponse):
    """Category with mission count"""
    missions_count: int = 0
