"""
Forum Schemas
Request/Response models for forum and comment endpoints
"""

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
from app.schemas.user import UserSummary


class ForumPostBase(BaseModel):
    """Base forum post schema"""
    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=1)
    category_id: Optional[int] = None


class ForumPostCreate(ForumPostBase):
    """Schema for creating a forum post"""
    pass


class ForumPostUpdate(BaseModel):
    """Schema for updating forum post"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    content: Optional[str] = None
    is_pinned: Optional[bool] = None
    is_locked: Optional[bool] = None


class ForumPostResponse(ForumPostBase):
    """Schema for forum post response"""
    id: int
    author_id: int
    is_pinned: bool
    is_locked: bool
    views: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class ForumPostWithAuthor(ForumPostResponse):
    """Forum post with author details"""
    author: UserSummary
    comments_count: int = 0


class ForumPostSummary(BaseModel):
    """Simplified forum post schema for listings"""
    id: int
    title: str
    author_id: int
    views: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# Comment Schemas
class CommentBase(BaseModel):
    """Base comment schema"""
    content: str = Field(..., min_length=1)


class CommentCreate(CommentBase):
    """Schema for creating a comment"""
    forum_post_id: Optional[int] = None
    parent_comment_id: Optional[int] = None


class CommentUpdate(BaseModel):
    """Schema for updating comment"""
    content: str = Field(..., min_length=1)


class CommentResponse(CommentBase):
    """Schema for comment response"""
    id: int
    author_id: int
    forum_post_id: Optional[int] = None
    parent_comment_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class CommentWithAuthor(CommentResponse):
    """Comment with author details"""
    author: UserSummary
    replies: List['CommentWithAuthor'] = []


# Allow forward references
CommentWithAuthor.model_rebuild()
