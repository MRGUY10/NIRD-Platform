"""
Mission and MissionSubmission Models
Handles NIRD missions and team submissions
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.core.database import Base


class MissionDifficulty(str, enum.Enum):
    """Mission difficulty levels"""
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"
    EXPERT = "expert"


class MissionStatus(str, enum.Enum):
    """Mission submission status"""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class Mission(Base):
    __tablename__ = "missions"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=False)
    difficulty = Column(Enum(MissionDifficulty), default=MissionDifficulty.MEDIUM, nullable=False, index=True)
    points = Column(Integer, nullable=False, index=True)
    
    # Category
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    
    # Requirements and instructions
    requirements = Column(Text)
    instructions = Column(Text)
    
    # Proof requirements
    requires_photo = Column(Boolean, default=False)
    requires_description = Column(Boolean, default=True)
    requires_file = Column(Boolean, default=False)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    category = relationship("Category", back_populates="missions")
    submissions = relationship("MissionSubmission", back_populates="mission", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Mission {self.title} - {self.points} pts>"


class MissionSubmission(Base):
    __tablename__ = "mission_submissions"
    
    id = Column(Integer, primary_key=True, index=True)
    mission_id = Column(Integer, ForeignKey("missions.id"), nullable=False)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    submitted_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Submission content
    description = Column(Text)
    photo_url = Column(String(500))
    file_url = Column(String(500))
    
    # Status and review
    status = Column(Enum(MissionStatus), default=MissionStatus.PENDING, nullable=False, index=True)
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    review_comment = Column(Text)
    
    # Timestamps
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    reviewed_at = Column(DateTime(timezone=True))
    
    # Relationships
    mission = relationship("Mission", back_populates="submissions")
    team = relationship("Team", back_populates="mission_submissions")
    submitted_by_user = relationship("User", foreign_keys=[submitted_by], back_populates="mission_submissions")
    reviewed_by_user = relationship("User", foreign_keys=[reviewed_by])
    
    def __repr__(self):
        return f"<MissionSubmission mission_id={self.mission_id} team_id={self.team_id} status={self.status}>"
