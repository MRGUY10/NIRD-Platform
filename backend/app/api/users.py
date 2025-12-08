"""
User Profile and Rankings API
Endpoints for user profiles, rankings, and level system
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.core.dependencies import get_current_user, get_current_active_user
from app.models.user import User, UserRole
from app.models.mission import MissionSubmission
from app.models.badge import UserBadge
from app.models.team import TeamMember, Team
from app.schemas.user import UserResponse, UserWithStats

router = APIRouter(tags=["Users"])


def calculate_user_level(total_points: int) -> dict:
    """
    Calculate user level and rank based on total points.
    
    Level system:
    - Novice: 0-99 points
    - Explorer: 100-249 points
    - Contributor: 250-499 points
    - Champion: 500-999 points
    - Master: 1000-1999 points
    - Legend: 2000+ points
    """
    levels = [
        {"name": "Novice", "min_points": 0, "max_points": 99, "color": "#6B7280"},
        {"name": "Explorer", "min_points": 100, "max_points": 249, "color": "#10B981"},
        {"name": "Contributor", "min_points": 250, "max_points": 499, "color": "#3B82F6"},
        {"name": "Champion", "min_points": 500, "max_points": 999, "color": "#8B5CF6"},
        {"name": "Master", "min_points": 1000, "max_points": 1999, "color": "#F59E0B"},
        {"name": "Legend", "min_points": 2000, "max_points": 999999, "color": "#EF4444"},
    ]
    
    current_level = levels[0]
    for level in levels:
        if level["min_points"] <= total_points <= level["max_points"]:
            current_level = level
            break
    
    # Calculate progress to next level
    next_level_points = current_level["max_points"] + 1
    progress_percentage = 0
    if current_level["name"] != "Legend":
        points_in_level = total_points - current_level["min_points"]
        level_range = current_level["max_points"] - current_level["min_points"] + 1
        progress_percentage = min(100, (points_in_level / level_range) * 100)
    
    return {
        "level_name": current_level["name"],
        "level_color": current_level["color"],
        "current_points": total_points,
        "min_points": current_level["min_points"],
        "max_points": current_level["max_points"],
        "progress_percentage": round(progress_percentage, 2),
        "next_level_points": next_level_points if current_level["name"] != "Legend" else None
    }


@router.get("/me/stats", response_model=UserWithStats)
async def get_my_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get current user's detailed statistics including:
    - Total points earned
    - Level and rank
    - Missions completed
    - Badges earned
    - Team information
    """
    # Calculate total points from approved submissions
    from app.models.mission import Mission
    
    total_points = db.query(
        func.coalesce(func.sum(Mission.points), 0)
    ).join(
        MissionSubmission, MissionSubmission.mission_id == Mission.id
    ).join(
        TeamMember, TeamMember.team_id == MissionSubmission.team_id
    ).filter(
        TeamMember.user_id == current_user.id,
        MissionSubmission.status == "approved"
    ).scalar() or 0
    
    # Get approved missions count
    missions_completed = db.query(func.count(MissionSubmission.id)).join(
        TeamMember, TeamMember.team_id == MissionSubmission.team_id
    ).filter(
        TeamMember.user_id == current_user.id,
        MissionSubmission.status == "approved"
    ).scalar() or 0
    
    # Get badges count
    badges_earned = db.query(func.count(UserBadge.id)).filter(
        UserBadge.user_id == current_user.id
    ).scalar() or 0
    
    # Get team information
    team_membership = db.query(TeamMember).filter(
        TeamMember.user_id == current_user.id
    ).first()
    
    team_info = None
    if team_membership:
        team = team_membership.team
        team_info = {
            "team_id": team.id,
            "team_name": team.name,
            "role": team_membership.role
        }
    
    # Calculate level and rank
    level_info = calculate_user_level(int(total_points))
    
    # Get global rank
    user_ranks = db.query(
        User.id,
        func.row_number().over(
            order_by=desc(func.coalesce(func.sum(Mission.points), 0))
        ).label('rank')
    ).outerjoin(
        TeamMember, TeamMember.user_id == User.id
    ).outerjoin(
        MissionSubmission,
        MissionSubmission.team_id == TeamMember.team_id
    ).outerjoin(
        Mission, Mission.id == MissionSubmission.mission_id
    ).filter(
        (MissionSubmission.status == "approved") | (MissionSubmission.id == None)
    ).group_by(User.id).subquery()
    
    user_rank_result = db.query(user_ranks.c.rank).filter(
        user_ranks.c.id == current_user.id
    ).scalar()
    
    global_rank = user_rank_result or 0
    
    return {
        **current_user.__dict__,
        "total_points": int(total_points),
        "missions_completed": missions_completed,
        "badges_earned": badges_earned,
        "team": team_info,
        "level": level_info,
        "global_rank": global_rank
    }


@router.get("/rankings", response_model=List[UserWithStats])
async def get_user_rankings(
    limit: int = Query(default=50, le=100),
    skip: int = Query(default=0, ge=0),
    role: Optional[UserRole] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get user rankings leaderboard.
    
    - **limit**: Number of users to return (max 100)
    - **skip**: Number of users to skip for pagination
    - **role**: Filter by user role (optional)
    """
    # Build base query
    from app.models.mission import Mission
    
    query = db.query(
        User,
        func.coalesce(func.sum(Mission.points), 0).label('total_points'),
        func.count(func.distinct(MissionSubmission.id)).label('missions_completed')
    ).outerjoin(
        TeamMember, TeamMember.user_id == User.id
    ).outerjoin(
        MissionSubmission,
        MissionSubmission.team_id == TeamMember.team_id
    ).outerjoin(
        Mission, Mission.id == MissionSubmission.mission_id
    ).filter(
        User.is_active == True
    )
    
    # Apply role filter if specified
    if role:
        query = query.filter(User.role == role)
    
    # Filter only approved submissions
    query = query.filter(
        (MissionSubmission.status == "approved") | (MissionSubmission.id == None)
    )
    
    # Group and order
    query = query.group_by(User.id).order_by(desc('total_points')).limit(limit).offset(skip)
    
    results = query.all()
    
    # Build response with rankings
    rankings = []
    for idx, (user, total_points, missions_completed) in enumerate(results):
        # Get badges count
        badges_earned = db.query(func.count(UserBadge.id)).filter(
            UserBadge.user_id == user.id
        ).scalar() or 0
        
        # Get team info
        team_membership = db.query(TeamMember).filter(
            TeamMember.user_id == user.id
        ).first()
        
        team_info = None
        if team_membership:
            team = team_membership.team
            team_info = {
                "team_id": team.id,
                "team_name": team.name,
                "role": team_membership.role
            }
        
        level_info = calculate_user_level(int(total_points))
        
        rankings.append({
            **user.__dict__,
            "total_points": int(total_points),
            "missions_completed": int(missions_completed),
            "badges_earned": badges_earned,
            "team": team_info,
            "level": level_info,
            "global_rank": skip + idx + 1
        })
    
    return rankings


@router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific user's profile by ID.
    """
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


@router.get("/{user_id}/stats", response_model=UserWithStats)
async def get_user_stats(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get detailed statistics for a specific user.
    """
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Calculate stats (similar to get_my_stats)
    from app.models.mission import Mission
    
    total_points = db.query(
        func.coalesce(func.sum(Mission.points), 0)
    ).join(
        MissionSubmission, MissionSubmission.mission_id == Mission.id
    ).join(
        TeamMember, TeamMember.team_id == MissionSubmission.team_id
    ).filter(
        TeamMember.user_id == user.id,
        MissionSubmission.status == "approved"
    ).scalar() or 0
    
    missions_completed = db.query(func.count(MissionSubmission.id)).join(
        TeamMember, TeamMember.team_id == MissionSubmission.team_id
    ).filter(
        TeamMember.user_id == user.id,
        MissionSubmission.status == "approved"
    ).scalar() or 0
    
    badges_earned = db.query(func.count(UserBadge.id)).filter(
        UserBadge.user_id == user.id
    ).scalar() or 0
    
    team_membership = db.query(TeamMember).filter(
        TeamMember.user_id == user.id
    ).first()
    
    team_info = None
    if team_membership:
        team = team_membership.team
        team_info = {
            "team_id": team.id,
            "team_name": team.name,
            "role": team_membership.role
        }
    
    level_info = calculate_user_level(int(total_points))
    
    return {
        **user.__dict__,
        "total_points": int(total_points),
        "missions_completed": missions_completed,
        "badges_earned": badges_earned,
        "team": team_info,
        "level": level_info,
        "global_rank": 0  # Could calculate if needed
    }
