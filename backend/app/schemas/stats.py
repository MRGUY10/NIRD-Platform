"""
Statistics Schemas
Request/Response models for analytics and statistics endpoints
"""

from pydantic import BaseModel, ConfigDict
from typing import Dict, List, Optional
from datetime import datetime


class ImpactMetrics(BaseModel):
    """Environmental impact calculations"""
    devices_saved: int
    co2_reduced_kg: float
    money_saved_eur: float
    trees_equivalent: float
    
    model_config = ConfigDict(from_attributes=True)


class TopTeam(BaseModel):
    """Top team summary"""
    team_id: int
    team_name: str
    school_name: Optional[str]
    total_points: int
    rank: int
    
    model_config = ConfigDict(from_attributes=True)


class GlobalStats(BaseModel):
    """Global platform statistics"""
    total_users: int
    total_teams: int
    total_schools: int
    total_missions: int
    total_submissions: int
    approved_submissions: int
    total_points_awarded: int
    total_resources: int
    total_forum_posts: int
    active_users_last_30_days: int
    
    # Impact metrics
    impact: ImpactMetrics
    
    # Top performers
    top_teams: List[TopTeam]
    
    model_config = ConfigDict(from_attributes=True)


class CategoryStats(BaseModel):
    """Statistics by category"""
    category_name: str
    missions_count: int
    submissions_count: int
    completion_rate: float


class ImpactCalculator(BaseModel):
    """Environmental impact calculation"""
    devices_saved: int = 0
    co2_reduced_kg: float = 0.0
    money_saved_euros: float = 0.0
    open_source_adoptions: int = 0


class ImpactCalculatorInput(BaseModel):
    """Input for impact calculator"""
    missions_completed: int
    mission_categories: Dict[str, int]  # category -> count


class RegionalStats(BaseModel):
    """Statistics by region"""
    region: str
    schools_count: int
    teams_count: int
    total_points: int


class TimeSeriesData(BaseModel):
    """Time series data point"""
    date: str
    value: int


class ChartData(BaseModel):
    """Generic chart data"""
    labels: List[str]
    values: List[int]


class TeamActivityDay(BaseModel):
    """Daily team activity summary"""
    date: str
    missions_completed: int
    points_earned: int
    
    model_config = ConfigDict(from_attributes=True)


class TeamMemberStats(BaseModel):
    """Individual team member statistics"""
    user_id: int
    username: str
    full_name: str
    missions_completed: int
    points_contributed: int
    badges_earned: int
    
    model_config = ConfigDict(from_attributes=True)


class TopCategory(BaseModel):
    """Category with completion count"""
    category_name: str
    missions_completed: int
    
    model_config = ConfigDict(from_attributes=True)


class TeamStats(BaseModel):
    """Detailed team analytics"""
    team_id: int
    team_name: str
    school_name: Optional[str]
    
    # Overall metrics
    total_points: int
    total_missions_completed: int
    badges_earned: int
    current_rank: Optional[int]
    
    # Impact metrics
    impact: ImpactMetrics
    
    # Activity over time (last 30 days)
    activity_timeline: List[TeamActivityDay]
    
    # Member contributions
    member_stats: List[TeamMemberStats]
    
    # Strengths (most completed mission categories)
    top_categories: List[TopCategory]
    
    model_config = ConfigDict(from_attributes=True)
