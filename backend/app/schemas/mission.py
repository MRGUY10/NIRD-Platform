"""
Mission Schemas
Request/Response models for mission-related endpoints
"""

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.mission import MissionDifficulty, MissionStatus


class CategorySummary(BaseModel):
    """Simplified category schema"""
    id: int
    name: str
    
    model_config = ConfigDict(from_attributes=True)


class MissionBase(BaseModel):
    """Base mission schema"""
    title: str = Field(..., min_length=1, max_length=255)
    description: str


class MissionCreate(MissionBase):
    """Schema for creating a mission"""
    category_id: int
    difficulty: MissionDifficulty = MissionDifficulty.MEDIUM
    points: int = Field(..., ge=0)
    requires_photo: bool = False
    requires_file: bool = False
    requires_description: bool = True


class MissionUpdate(BaseModel):
    """Schema for updating mission info"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    difficulty: Optional[MissionDifficulty] = None
    points: Optional[int] = Field(None, ge=0)
    requires_photo: Optional[bool] = None
    requires_file: Optional[bool] = None
    requires_description: Optional[bool] = None
    is_active: Optional[bool] = None


class MissionResponse(MissionBase):
    """Schema for mission response"""
    id: int
    category_id: int
    difficulty: MissionDifficulty
    points: int
    requires_photo: bool
    requires_file: bool
    requires_description: bool
    is_active: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class MissionWithCategory(MissionResponse):
    """Mission response with category information"""
    category: Optional[CategorySummary] = None
    
    model_config = ConfigDict(from_attributes=True)


class MissionWithDetails(MissionResponse):
    """Mission response with additional details"""
    category: Optional[CategorySummary] = None
    submission_count: int = 0
    approved_count: int = 0


class MissionSummary(BaseModel):
    """Simplified mission schema for listings"""
    id: int
    title: str
    difficulty: MissionDifficulty
    points: int
    is_active: bool
    category_id: Optional[int] = None
    
    model_config = ConfigDict(from_attributes=True)


# Submission Schemas

class SubmissionBase(BaseModel):
    """Base submission schema"""
    description: str


class SubmissionCreate(SubmissionBase):
    """Schema for creating a submission"""
    photo_url: Optional[str] = None
    file_url: Optional[str] = None


class SubmissionUpdate(BaseModel):
    """Schema for updating a submission"""
    description: Optional[str] = None
    photo_url: Optional[str] = None
    file_url: Optional[str] = None


class SubmissionResponse(SubmissionBase):
    """Schema for submission response"""
    id: int
    mission_id: int
    team_id: int
    submitted_by: int
    photo_url: Optional[str] = None
    file_url: Optional[str] = None
    status: MissionStatus
    reviewed_by: Optional[int] = None
    review_comment: Optional[str] = None
    submitted_at: datetime
    reviewed_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class SubmissionReview(BaseModel):
    """Schema for reviewing a submission"""
    status: MissionStatus = Field(..., description="Must be APPROVED or REJECTED")
    review_comment: Optional[str] = None


class SubmissionWithDetails(SubmissionResponse):
    """Submission with mission and team details"""
    mission: MissionSummary
    team_name: str
    submitted_by_username: str
    
    model_config = ConfigDict(from_attributes=True)


# Aliases for backward compatibility
MissionSubmissionCreate = SubmissionCreate
MissionSubmissionUpdate = SubmissionUpdate
MissionSubmissionResponse = SubmissionResponse
MissionSubmissionWithDetails = SubmissionWithDetails
