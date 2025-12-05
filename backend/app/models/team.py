"""
Team and TeamMember Models
Handles team management and membership
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Team(Base):
    __tablename__ = "teams"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text)
    avatar_url = Column(String(500))
    
    # School association
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=True)
    
    # Statistics
    total_points = Column(Integer, default=0, index=True)
    missions_completed = Column(Integer, default=0)
    current_rank = Column(Integer, index=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    school = relationship("School", back_populates="teams")
    members = relationship("TeamMember", back_populates="team", cascade="all, delete-orphan")
    mission_submissions = relationship("MissionSubmission", back_populates="team", cascade="all, delete-orphan")
    leaderboard_snapshots = relationship("LeaderboardSnapshot", back_populates="team", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Team {self.name} - {self.total_points} pts>"


class TeamMember(Base):
    __tablename__ = "team_members"
    
    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    is_captain = Column(Boolean, default=False)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    team = relationship("Team", back_populates="members")
    user = relationship("User", back_populates="team_memberships")
    
    def __repr__(self):
        return f"<TeamMember team_id={self.team_id} user_id={self.user_id}>"
