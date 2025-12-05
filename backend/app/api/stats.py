"""
Statistics API
Endpoints for analytics and impact calculations
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, desc
from typing import List
from datetime import datetime, timedelta

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.team import Team
from app.models.mission import Mission, MissionSubmission
from app.models.resource import Resource
from app.models.forum import ForumPost
from app.models.category import Category
from app.models.badge import UserBadge
from app.models.school import School
from app.schemas.stats import (
    GlobalStats, TeamStats, ImpactMetrics, TopTeam,
    TeamActivityDay, TeamMemberStats, TopCategory
)

router = APIRouter(tags=["Statistics"])


def calculate_impact(devices_saved: int) -> ImpactMetrics:
    """
    Calculate environmental impact metrics based on devices saved
    
    Assumptions:
    - Each device saved reduces e-waste by ~2kg
    - Average CO2 from electronics manufacturing: 80kg per device
    - Average device cost: €300
    - One tree absorbs ~21kg CO2 per year
    """
    co2_reduced = devices_saved * 80.0  # kg
    money_saved = devices_saved * 300.0  # euros
    trees_equivalent = round(co2_reduced / 21.0, 2)
    
    return ImpactMetrics(
        devices_saved=devices_saved,
        co2_reduced_kg=round(co2_reduced, 2),
        money_saved_eur=round(money_saved, 2),
        trees_equivalent=trees_equivalent
    )


@router.get("/global", response_model=GlobalStats)
async def get_global_stats(db: Session = Depends(get_db)):
    """
    Get global community statistics and impact metrics.
    
    Returns:
    - Total users, teams, schools, missions, submissions
    - Community impact (devices saved, CO2 reduced, money saved)
    - Top performing teams
    - Active user count
    """
    # Basic counts
    total_users = db.query(func.count(User.id)).scalar() or 0
    total_teams = db.query(func.count(Team.id)).scalar() or 0
    total_schools = db.query(func.count(School.id)).scalar() or 0
    total_missions = db.query(func.count(Mission.id)).scalar() or 0
    total_submissions = db.query(func.count(MissionSubmission.id)).scalar() or 0
    total_resources = db.query(func.count(Resource.id)).filter(
        Resource.is_published == True
    ).scalar() or 0
    total_forum_posts = db.query(func.count(ForumPost.id)).scalar() or 0
    
    # Approved submissions
    approved_submissions = db.query(func.count(MissionSubmission.id)).filter(
        MissionSubmission.status == "approved"
    ).scalar() or 0
    
    # Total points awarded
    total_points = db.query(func.sum(Mission.points)).join(
        MissionSubmission
    ).filter(
        MissionSubmission.status == "approved"
    ).scalar() or 0
    
    # Active users in last 30 days
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    active_users = db.query(func.count(func.distinct(User.id))).filter(
        User.last_login >= thirty_days_ago
    ).scalar() or 0
    
    # Calculate devices saved (estimate: 1 device per 3 approved submissions)
    devices_saved = approved_submissions // 3
    impact = calculate_impact(devices_saved)
    
    # Top teams
    top_teams_query = db.query(
        Team.id,
        Team.name,
        School.name.label("school_name"),
        func.sum(Mission.points).label("total_points")
    ).join(
        MissionSubmission, Team.id == MissionSubmission.team_id
    ).join(
        Mission, MissionSubmission.mission_id == Mission.id
    ).outerjoin(
        School, Team.school_id == School.id
    ).filter(
        MissionSubmission.status == "approved"
    ).group_by(
        Team.id, Team.name, School.name
    ).order_by(
        desc("total_points")
    ).limit(5).all()
    
    top_teams = [
        TopTeam(
            team_id=t.id,
            team_name=t.name,
            school_name=t.school_name,
            total_points=int(t.total_points or 0),
            rank=idx + 1
        )
        for idx, t in enumerate(top_teams_query)
    ]
    
    return GlobalStats(
        total_users=total_users,
        total_teams=total_teams,
        total_schools=total_schools,
        total_missions=total_missions,
        total_submissions=total_submissions,
        approved_submissions=approved_submissions,
        total_points_awarded=int(total_points),
        total_resources=total_resources,
        total_forum_posts=total_forum_posts,
        active_users_last_30_days=active_users,
        impact=impact,
        top_teams=top_teams
    )


@router.get("/team/{team_id}", response_model=TeamStats)
async def get_team_stats(
    team_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get detailed analytics for a specific team.
    
    Returns:
    - Team overview (name, school, points, rank)
    - Environmental impact of team's actions
    - Activity timeline (last 30 days)
    - Individual member contributions
    - Top categories where team excels
    """
    # Get team
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    # Get school name
    school_name = None
    if team.school_id:
        school = db.query(School).filter(School.id == team.school_id).first()
        if school:
            school_name = school.name
    
    # Total points and missions completed
    team_stats_query = db.query(
        func.count(MissionSubmission.id).label("missions_completed"),
        func.sum(Mission.points).label("total_points")
    ).join(
        Mission, MissionSubmission.mission_id == Mission.id
    ).filter(
        and_(
            MissionSubmission.team_id == team_id,
            MissionSubmission.status == "approved"
        )
    ).first()
    
    total_missions_completed = team_stats_query.missions_completed or 0
    total_points = int(team_stats_query.total_points or 0)
    
    # Calculate team rank
    all_teams_points = db.query(
        Team.id,
        func.sum(Mission.points).label("points")
    ).join(
        MissionSubmission, Team.id == MissionSubmission.team_id
    ).join(
        Mission, MissionSubmission.mission_id == Mission.id
    ).filter(
        MissionSubmission.status == "approved"
    ).group_by(
        Team.id
    ).order_by(
        desc("points")
    ).all()
    
    current_rank = None
    for idx, t in enumerate(all_teams_points):
        if t.id == team_id:
            current_rank = idx + 1
            break
    
    # Impact calculation
    devices_saved = total_missions_completed // 3
    impact = calculate_impact(devices_saved)
    
    # Activity timeline (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    activity = db.query(
        func.date(MissionSubmission.submitted_at).label("date"),
        func.count(MissionSubmission.id).label("missions_completed"),
        func.sum(Mission.points).label("points_earned")
    ).join(
        Mission, MissionSubmission.mission_id == Mission.id
    ).filter(
        and_(
            MissionSubmission.team_id == team_id,
            MissionSubmission.status == "approved",
            MissionSubmission.submitted_at >= thirty_days_ago
        )
    ).group_by(
        func.date(MissionSubmission.submitted_at)
    ).order_by(
        func.date(MissionSubmission.submitted_at)
    ).all()
    
    activity_timeline = [
        TeamActivityDay(
            date=str(a.date),
            missions_completed=a.missions_completed,
            points_earned=int(a.points_earned or 0)
        )
        for a in activity
    ]
    
    # Member contributions
    from app.models.team import TeamMember
    member_contributions = db.query(
        User.id,
        User.username,
        User.full_name,
        func.count(MissionSubmission.id).label("missions_completed"),
        func.sum(Mission.points).label("points_contributed"),
        func.count(UserBadge.id).label("badges_earned")
    ).join(
        TeamMember, User.id == TeamMember.user_id
    ).outerjoin(
        MissionSubmission, and_(
            User.id == MissionSubmission.submitted_by,
            MissionSubmission.team_id == team_id,
            MissionSubmission.status == "approved"
        )
    ).outerjoin(
        Mission, MissionSubmission.mission_id == Mission.id
    ).outerjoin(
        UserBadge, User.id == UserBadge.user_id
    ).filter(
        TeamMember.team_id == team_id
    ).group_by(
        User.id, User.username, User.full_name
    ).all()
    
    member_stats = [
        TeamMemberStats(
            user_id=m.id,
            username=m.username,
            full_name=m.full_name,
            missions_completed=m.missions_completed or 0,
            points_contributed=int(m.points_contributed or 0),
            badges_earned=m.badges_earned or 0
        )
        for m in member_contributions
    ]
    
    # Top categories
    top_cats = db.query(
        Category.name,
        func.count(MissionSubmission.id).label("count")
    ).join(
        Mission, Category.id == Mission.category_id
    ).join(
        MissionSubmission, Mission.id == MissionSubmission.mission_id
    ).filter(
        and_(
            MissionSubmission.team_id == team_id,
            MissionSubmission.status == "approved"
        )
    ).group_by(
        Category.name
    ).order_by(
        desc("count")
    ).limit(5).all()
    
    top_categories = [
        TopCategory(
            category_name=c.name,
            missions_completed=c.count
        )
        for c in top_cats
    ]
    
    # Total badges earned by team members
    badges_earned = db.query(
        func.count(UserBadge.id)
    ).join(
        TeamMember, UserBadge.user_id == TeamMember.user_id
    ).filter(
        TeamMember.team_id == team_id
    ).scalar() or 0
    
    return TeamStats(
        team_id=team.id,
        team_name=team.name,
        school_name=school_name,
        total_points=total_points,
        total_missions_completed=total_missions_completed,
        badges_earned=badges_earned,
        current_rank=current_rank,
        impact=impact,
        activity_timeline=activity_timeline,
        member_stats=member_stats,
        top_categories=top_categories
    )


@router.get("/my-stats")
async def get_my_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get current user's statistics.
    
    Returns:
    - Total missions completed
    - Total points earned
    - User's rank (among all students or within their team)
    - Badges earned
    """
    # Get user's team memberships
    from app.models.team import TeamMember
    
    team_membership = db.query(TeamMember).filter(
        TeamMember.user_id == current_user.id
    ).first()
    
    # Count missions completed (approved submissions where user is submitter)
    missions_completed = db.query(func.count(MissionSubmission.id)).filter(
        and_(
            MissionSubmission.submitted_by == current_user.id,
            MissionSubmission.status == "approved"
        )
    ).scalar() or 0
    
    # Calculate total points earned
    total_points = db.query(func.sum(Mission.points)).join(
        MissionSubmission, Mission.id == MissionSubmission.mission_id
    ).filter(
        and_(
            MissionSubmission.submitted_by == current_user.id,
            MissionSubmission.status == "approved"
        )
    ).scalar() or 0
    
    # Count badges earned
    badges_earned = db.query(func.count(UserBadge.id)).filter(
        UserBadge.user_id == current_user.id
    ).scalar() or 0
    
    # Calculate user's rank among all students with same role
    user_ranks = db.query(
        User.id,
        func.sum(Mission.points).label('points')
    ).join(
        MissionSubmission, MissionSubmission.submitted_by == User.id
    ).join(
        Mission, MissionSubmission.mission_id == Mission.id
    ).filter(
        and_(
            User.role == current_user.role,
            MissionSubmission.status == "approved"
        )
    ).group_by(User.id).order_by(desc('points')).all()
    
    # Find current user's rank
    user_rank = None
    for rank, (user_id, points) in enumerate(user_ranks, start=1):
        if user_id == current_user.id:
            user_rank = rank
            break
    
    # If user has no submissions yet, they're unranked
    if user_rank is None:
        # Count total users with same role who have points
        total_ranked_users = len(user_ranks)
        user_rank = total_ranked_users + 1
    
    return {
        "missions_completed": missions_completed,
        "total_points": int(total_points) if total_points else 0,
        "badges_earned": badges_earned,
        "rank": user_rank,
        "team_id": team_membership.team_id if team_membership else None
    }
