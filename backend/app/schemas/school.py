"""
School Schemas
Request/Response models for school-related endpoints
"""

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional


class SchoolBase(BaseModel):
    """Base school schema"""
    name: str = Field(..., min_length=1, max_length=255)
    address: Optional[str] = None
    city: Optional[str] = None
    region: Optional[str] = None
    postal_code: Optional[str] = None
    country: str = "France"


class SchoolCreate(SchoolBase):
    """Schema for creating a school"""
    email: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class SchoolUpdate(BaseModel):
    """Schema for updating school info"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    address: Optional[str] = None
    city: Optional[str] = None
    region: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None


class SchoolResponse(SchoolBase):
    """Schema for school response"""
    id: int
    email: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    
    model_config = ConfigDict(from_attributes=True)


class SchoolSummary(BaseModel):
    """Simplified school schema for listings"""
    id: int
    name: str
    city: Optional[str] = None
    region: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)
