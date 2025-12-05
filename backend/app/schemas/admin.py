"""
Admin Schemas
Request/response models for admin panel endpoints
"""

from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


class DashboardStats(BaseModel):
    """Admin dashboard overview statistics"""
    # User metrics
    total_users: int
    new_users_today: int
    new_users_this_week: int
    active_users_today: int
    users_by_role: Dict[str, int]
    
    # Team metrics
    total_teams: int
    active_teams: int
    teams_without_members: int
    
    # Mission metrics
    total_missions: int
    active_missions: int
    pending_submissions: int
    approved_submissions_today: int
    
    # Content metrics
    total_resources: int
    total_forum_posts: int
    total_comments: int
    
    # Engagement metrics
    avg_missions_per_team: float
    avg_team_size: float
    
    model_config = ConfigDict(from_attributes=True)


class UserManagementSummary(BaseModel):
    """User summary for admin panel"""
    id: int
    username: str
    email: str
    full_name: str
    role: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    last_login: Optional[datetime]
    team_name: Optional[str]
    missions_completed: int
    total_points: int
    
    model_config = ConfigDict(from_attributes=True)


class UserUpdate(BaseModel):
    """Schema for admin updating user details"""
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[str] = None
    full_name: Optional[str] = Field(None, min_length=1, max_length=100)
    role: Optional[str] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None


class TeamManagementSummary(BaseModel):
    """Team summary for admin panel"""
    id: int
    name: str
    description: Optional[str]
    school_name: Optional[str]
    member_count: int
    total_points: int
    missions_completed: int
    created_at: datetime
    is_active: bool
    
    model_config = ConfigDict(from_attributes=True)


class TeamUpdateAdmin(BaseModel):
    """Schema for admin updating team details"""
    name: Optional[str] = Field(None, min_length=3, max_length=100)
    description: Optional[str] = None
    school_id: Optional[int] = None
    total_points: Optional[int] = None
    missions_completed: Optional[int] = None


class PendingSubmissionSummary(BaseModel):
    """Submission summary for admin review"""
    id: int
    mission_id: int
    mission_title: str
    team_id: int
    team_name: str
    submitted_by_id: int
    submitted_by_name: str
    description: str
    photo_url: Optional[str]
    file_url: Optional[str]
    submitted_at: datetime
    days_pending: int
    
    model_config = ConfigDict(from_attributes=True)


class ExportRequest(BaseModel):
    """Request for exporting platform data"""
    report_type: str = Field(..., description="Type: users, teams, missions, submissions, full")
    format: str = Field(default="json", description="Format: json or csv")
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    filters: Optional[Dict[str, Any]] = None


class ExportResponse(BaseModel):
    """Response for export request"""
    report_type: str
    format: str
    record_count: int
    generated_at: datetime
    data: Any
    
    model_config = ConfigDict(from_attributes=True)
