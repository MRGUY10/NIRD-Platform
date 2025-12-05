"""
User Schemas
Request/Response models for user-related endpoints
"""

from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.user import UserRole


# Base schemas
class UserBase(BaseModel):
    """Base user schema with common fields"""
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=100)
    full_name: Optional[str] = None


# Request schemas
class UserCreate(UserBase):
    """Schema for user registration"""
    password: str = Field(..., min_length=6)
    role: UserRole = UserRole.STUDENT
    school_id: Optional[int] = None


class UserUpdate(BaseModel):
    """Schema for updating user profile"""
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    email: Optional[EmailStr] = None


class UserLogin(BaseModel):
    """Schema for user login"""
    username: str
    password: str


class PasswordChange(BaseModel):
    """Schema for password change"""
    current_password: str
    new_password: str = Field(..., min_length=8, max_length=100)


# Response schemas
class UserResponse(UserBase):
    """Schema for user response"""
    id: int
    role: UserRole
    is_active: bool
    is_verified: bool
    avatar_url: Optional[str] = None
    created_at: datetime
    last_login: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class UserSummary(BaseModel):
    """Simplified user schema for listings"""
    id: int
    username: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    role: UserRole
    
    model_config = ConfigDict(from_attributes=True)


class UserStats(BaseModel):
    """User statistics"""
    total_submissions: int
    approved_submissions: int
    badges_earned: int
    teams_count: int
