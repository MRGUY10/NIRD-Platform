"""
Badge and UserBadge Models
Achievement/badge system for gamification
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Badge(Base):
    __tablename__ = "badges"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text)
    icon_url = Column(String(500))
    
    # Criteria (stored as JSON or specific fields)
    criteria_description = Column(Text)
    
    # Points or rarity
    rarity = Column(String(50))  # common, rare, epic, legendary
    
    # Relationships
    user_badges = relationship("UserBadge", back_populates="badge", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Badge {self.name}>"


class UserBadge(Base):
    __tablename__ = "user_badges"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    badge_id = Column(Integer, ForeignKey("badges.id"), nullable=False)
    
    earned_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="badges")
    badge = relationship("Badge", back_populates="user_badges")
    
    def __repr__(self):
        return f"<UserBadge user_id={self.user_id} badge_id={self.badge_id}>"
