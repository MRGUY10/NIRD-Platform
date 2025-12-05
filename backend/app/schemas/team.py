"""
Team Schemas
Request/Response models for team-related endpoints
"""

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
from app.schemas.user import UserSummary
from app.schemas.school import SchoolSummary


class TeamBase(BaseModel):
    """Base team schema"""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None


class TeamCreate(TeamBase):
    """Schema for creating a team"""
    school_id: Optional[int] = None


class TeamUpdate(BaseModel):
    """Schema for updating team info"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: Optional[bool] = None


class TeamMemberAdd(BaseModel):
    """Schema for adding member to team"""
    user_id: int
    is_captain: bool = False


class TeamResponse(TeamBase):
    """Schema for team response"""
    id: int
    school_id: Optional[int] = None
    avatar_url: Optional[str] = None
    total_points: int
    missions_completed: int
    current_rank: Optional[int] = None
    is_active: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class TeamWithMembers(TeamResponse):
    """Team response with members list"""
    members: List[UserSummary] = []
    school: Optional[SchoolSummary] = None


class TeamSummary(BaseModel):
    """Simplified team schema for listings"""
    id: int
    name: str
    avatar_url: Optional[str] = None
    total_points: int
    current_rank: Optional[int] = None
    
    model_config = ConfigDict(from_attributes=True)


class TeamStats(BaseModel):
    """Team statistics"""
    total_points: int
    missions_completed: int
    current_rank: Optional[int] = None
    members_count: int
    pending_submissions: int
    approved_submissions: int
