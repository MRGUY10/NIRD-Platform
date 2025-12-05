"""
Notification Schemas
Request/Response models for notification endpoints
"""

from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.notification import NotificationType


class NotificationCreate(BaseModel):
    """Schema for creating a notification"""
    user_id: int
    type: NotificationType
    title: str
    message: Optional[str] = None
    action_url: Optional[str] = None


class NotificationResponse(BaseModel):
    """Schema for notification response"""
    id: int
    user_id: int
    type: NotificationType
    title: str
    message: Optional[str] = None
    action_url: Optional[str] = None
    is_read: bool
    created_at: datetime
    read_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class NotificationMarkRead(BaseModel):
    """Schema for marking notification as read"""
    is_read: bool = True


class NotificationUpdate(BaseModel):
    """Schema for updating notification"""
    is_read: Optional[bool] = None
