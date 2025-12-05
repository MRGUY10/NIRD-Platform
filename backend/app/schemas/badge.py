"""
Badge Schemas
Request/Response models for badge-related endpoints
"""

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime


class BadgeBase(BaseModel):
    """Base badge schema"""
    name: str = Field(..., min_length=1, max_length=100)
    slug: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    icon: Optional[str] = None


class BadgeCreate(BadgeBase):
    """Schema for creating a badge"""
    pass


class BadgeUpdate(BaseModel):
    """Schema for updating badge"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    slug: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    icon: Optional[str] = None


class BadgeResponse(BadgeBase):
    """Schema for badge response"""
    id: int
    
    model_config = ConfigDict(from_attributes=True)


class UserBadgeResponse(BaseModel):
    """Schema for user badge (earned badge)"""
    id: int
    badge_id: int
    badge_name: str
    badge_slug: str
    badge_description: Optional[str]
    badge_icon: Optional[str]
    earned_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class BadgeAward(BaseModel):
    """Schema for awarding badge to user"""
    user_id: int
    badge_id: int
