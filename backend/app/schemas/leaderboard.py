"""
Leaderboard Schemas
Request/Response models for leaderboard endpoints
"""

from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime


class LeaderboardEntry(BaseModel):
    """Single leaderboard entry"""
    rank: int
    team_id: int
    team_name: str
    school_name: Optional[str] = None
    avatar_url: Optional[str] = None
    total_points: int
    missions_completed: int
    approved_submissions: int
    average_score: float = 0.0
    rank_change: int = 0  # Positive = moved up, Negative = moved down
    
    model_config = ConfigDict(from_attributes=True)


class LeaderboardResponse(BaseModel):
    """Leaderboard response with rankings"""
    entries: List[LeaderboardEntry]
    total_teams: int
    last_updated: datetime
    filters: Optional[dict] = None


class TeamRankHistory(BaseModel):
    """Team ranking history"""
    team_id: int
    team_name: str
    history: List['RankSnapshot']


class RankSnapshot(BaseModel):
    """Historical rank snapshot"""
    rank: int
    points: int
    missions_completed: int
    snapshot_at: datetime
    period_type: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)


# Allow forward references
TeamRankHistory.model_rebuild()


class LeaderboardStats(BaseModel):
    """Global leaderboard statistics"""
    total_teams: int
    total_points_awarded: int
    total_missions_completed: int
    active_schools: int
    average_team_score: float
    top_team_points: int
    most_active_team: Optional[str] = None
    most_improved_team: Optional[str] = None
    last_updated: datetime
