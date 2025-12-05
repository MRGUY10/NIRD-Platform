"""
LeaderboardSnapshot Model
Historical ranking data for tracking progress over time
"""

from sqlalchemy import Column, Integer, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class LeaderboardSnapshot(Base):
    __tablename__ = "leaderboard_snapshots"
    
    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    
    # Snapshot data
    rank = Column(Integer, nullable=False, index=True)
    points = Column(Integer, nullable=False)
    missions_completed = Column(Integer, nullable=False)
    
    # Period identifier (for filtering by time)
    period_type = Column(String(50), index=True)  # daily, weekly, monthly, all-time
    period_date = Column(DateTime(timezone=True), index=True)  # Start of the period
    
    # Timestamp
    snapshot_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    # Relationships
    team = relationship("Team", back_populates="leaderboard_snapshots")
    
    def __repr__(self):
        return f"<LeaderboardSnapshot team_id={self.team_id} rank={self.rank} at {self.snapshot_at}>"
