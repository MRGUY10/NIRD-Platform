"""
Notification Model
User notifications system
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.core.database import Base


class NotificationType(str, enum.Enum):
    """Notification types"""
    MISSION_APPROVED = "mission_approved"
    MISSION_REJECTED = "mission_rejected"
    RANK_CHANGED = "rank_changed"
    BADGE_EARNED = "badge_earned"
    TEAM_INVITE = "team_invite"
    NEW_MISSION = "new_mission"
    COMMENT_REPLY = "comment_reply"
    SYSTEM = "system"


class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Notification content
    type = Column(Enum(NotificationType), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text)
    
    # Link/action
    action_url = Column(String(500))
    
    # Status
    is_read = Column(Boolean, default=False, index=True)
    
    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    read_at = Column(DateTime(timezone=True))
    
    # Relationships
    user = relationship("User", back_populates="notifications")
    
    def __repr__(self):
        return f"<Notification {self.type} for user_id={self.user_id}>"
