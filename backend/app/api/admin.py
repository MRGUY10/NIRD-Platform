"""
Admin Panel API
Endpoints for platform administration and management
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, and_, or_
from typing import List, Optional
from datetime import datetime, timedelta
import csv
import io

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.models.user import User, UserRole
from app.models.team import Team, TeamMember
from app.models.mission import Mission, MissionSubmission, MissionStatus
from app.models.resource import Resource
from app.models.forum import ForumPost, Comment
from app.models.school import School
from app.schemas.admin import (
    DashboardStats, UserManagementSummary, UserUpdate,
    TeamManagementSummary, TeamUpdateAdmin, PendingSubmissionSummary,
    ExportRequest, ExportResponse
)
from app.schemas.user import UserResponse
from app.schemas.team import TeamResponse

router = APIRouter(tags=["Admin"], dependencies=[Depends(require_admin)])


@router.get("/dashboard", response_model=DashboardStats)
async def get_admin_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get comprehensive platform overview for admin dashboard.
    
    Returns statistics on users, teams, missions, content, and engagement.
    Only accessible by administrators.
    """
    today = datetime.utcnow().date()
    week_ago = datetime.utcnow() - timedelta(days=7)
    
    # User metrics
    total_users = db.query(func.count(User.id)).scalar() or 0
    new_users_today = db.query(func.count(User.id)).filter(
        func.date(User.created_at) == today
    ).scalar() or 0
    new_users_this_week = db.query(func.count(User.id)).filter(
        User.created_at >= week_ago
    ).scalar() or 0
    active_users_today = db.query(func.count(User.id)).filter(
        func.date(User.last_login) == today
    ).scalar() or 0
    
    # Users by role
    users_by_role_query = db.query(
        User.role,
        func.count(User.id).label('count')
    ).group_by(User.role).all()
    users_by_role = {r.role.value: r.count for r in users_by_role_query}
    
    # Team metrics
    total_teams = db.query(func.count(Team.id)).scalar() or 0
    active_teams = db.query(func.count(Team.id)).filter(
        Team.missions_completed > 0
    ).scalar() or 0
    teams_without_members = db.query(func.count(Team.id)).outerjoin(
        TeamMember
    ).filter(
        TeamMember.id == None
    ).scalar() or 0
    
    # Mission metrics
    total_missions = db.query(func.count(Mission.id)).scalar() or 0
    active_missions = db.query(func.count(Mission.id)).filter(
        Mission.is_active == True
    ).scalar() or 0
    pending_submissions = db.query(func.count(MissionSubmission.id)).filter(
        MissionSubmission.status == MissionStatus.PENDING
    ).scalar() or 0
    approved_submissions_today = db.query(func.count(MissionSubmission.id)).filter(
        and_(
            MissionSubmission.status == MissionStatus.APPROVED,
            func.date(MissionSubmission.reviewed_at) == today
        )
    ).scalar() or 0
    
    # Content metrics
    total_resources = db.query(func.count(Resource.id)).scalar() or 0
    total_forum_posts = db.query(func.count(ForumPost.id)).scalar() or 0
    total_comments = db.query(func.count(Comment.id)).scalar() or 0
    
    # Engagement metrics
    avg_missions_per_team = db.query(
        func.avg(Team.missions_completed)
    ).scalar() or 0.0
    
    team_sizes = db.query(
        func.count(TeamMember.user_id)
    ).join(Team).group_by(Team.id).all()
    avg_team_size = sum([t[0] for t in team_sizes]) / len(team_sizes) if team_sizes else 0.0
    
    return DashboardStats(
        total_users=total_users,
        new_users_today=new_users_today,
        new_users_this_week=new_users_this_week,
        active_users_today=active_users_today,
        users_by_role=users_by_role,
        total_teams=total_teams,
        active_teams=active_teams,
        teams_without_members=teams_without_members,
        total_missions=total_missions,
        active_missions=active_missions,
        pending_submissions=pending_submissions,
        approved_submissions_today=approved_submissions_today,
        total_resources=total_resources,
        total_forum_posts=total_forum_posts,
        total_comments=total_comments,
        avg_missions_per_team=round(float(avg_missions_per_team), 2),
        avg_team_size=round(avg_team_size, 2)
    )


@router.get("/users", response_model=List[UserManagementSummary])
async def list_users_admin(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    role: Optional[UserRole] = None,
    is_active: Optional[bool] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List all users with admin details.
    
    Supports filtering by role, active status, and search query.
    """
    query = db.query(
        User.id,
        User.username,
        User.email,
        User.full_name,
        User.role,
        User.is_active,
        User.is_verified,
        User.created_at,
        User.last_login,
        Team.name.label("team_name"),
        func.count(MissionSubmission.id).label("missions_completed"),
        func.sum(Mission.points).label("total_points")
    ).outerjoin(
        TeamMember, User.id == TeamMember.user_id
    ).outerjoin(
        Team, TeamMember.team_id == Team.id
    ).outerjoin(
        MissionSubmission, and_(
            User.id == MissionSubmission.submitted_by,
            MissionSubmission.status == MissionStatus.APPROVED
        )
    ).outerjoin(
        Mission, MissionSubmission.mission_id == Mission.id
    )
    
    # Apply filters
    if role:
        query = query.filter(User.role == role)
    
    if is_active is not None:
        query = query.filter(User.is_active == is_active)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                User.username.ilike(search_term),
                User.email.ilike(search_term),
                User.full_name.ilike(search_term)
            )
        )
    
    users = query.group_by(
        User.id, User.username, User.email, User.full_name,
        User.role, User.is_active, User.is_verified,
        User.created_at, User.last_login, Team.name
    ).order_by(
        desc(User.created_at)
    ).offset(skip).limit(limit).all()
    
    return [
        UserManagementSummary(
            id=u.id,
            username=u.username,
            email=u.email,
            full_name=u.full_name,
            role=u.role.value,
            is_active=u.is_active,
            is_verified=u.is_verified,
            created_at=u.created_at,
            last_login=u.last_login,
            team_name=u.team_name,
            missions_completed=u.missions_completed or 0,
            total_points=int(u.total_points or 0)
        )
        for u in users
    ]


@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user_admin(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get detailed information about a specific user"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user_admin(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update user details as admin.
    
    Can modify username, email, role, active status, etc.
    """
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check for username conflicts
    if user_data.username and user_data.username != user.username:
        existing = db.query(User).filter(
            User.username == user_data.username
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
    
    # Check for email conflicts
    if user_data.email and user_data.email != user.email:
        existing = db.query(User).filter(
            User.email == user_data.email
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    
    # Update fields
    update_data = user_data.model_dump(exclude_unset=True)
    
    # Convert role string to enum if provided
    if 'role' in update_data:
        try:
            update_data['role'] = UserRole(update_data['role'].upper())
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid role"
            )
    
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    
    return user


@router.delete("/users/{user_id}")
async def delete_user_admin(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a user (soft delete by deactivating).
    
    Does not actually remove from database, just sets is_active to False.
    """
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prevent self-deletion
    if user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )
    
    # Soft delete
    user.is_active = False
    db.commit()
    
    return {"message": f"User {user.username} deactivated successfully"}


@router.get("/teams", response_model=List[TeamManagementSummary])
async def list_teams_admin(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    school_id: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List all teams with admin details.
    
    Supports filtering by school and search query.
    """
    query = db.query(
        Team.id,
        Team.name,
        Team.description,
        School.name.label("school_name"),
        Team.total_points,
        Team.missions_completed,
        Team.created_at,
        func.count(TeamMember.user_id).label("member_count")
    ).outerjoin(
        School, Team.school_id == School.id
    ).outerjoin(
        TeamMember, Team.id == TeamMember.team_id
    )
    
    # Apply filters
    if school_id:
        query = query.filter(Team.school_id == school_id)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(Team.name.ilike(search_term))
    
    teams = query.group_by(
        Team.id, Team.name, Team.description, School.name,
        Team.total_points, Team.missions_completed, Team.created_at
    ).order_by(
        desc(Team.created_at)
    ).offset(skip).limit(limit).all()
    
    return [
        TeamManagementSummary(
            id=t.id,
            name=t.name,
            description=t.description,
            school_name=t.school_name,
            member_count=t.member_count,
            total_points=t.total_points,
            missions_completed=t.missions_completed,
            created_at=t.created_at,
            is_active=t.missions_completed > 0 or t.member_count > 0
        )
        for t in teams
    ]


@router.put("/teams/{team_id}", response_model=TeamResponse)
async def update_team_admin(
    team_id: int,
    team_data: TeamUpdateAdmin,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update team details as admin.
    
    Can modify name, description, points, missions count, etc.
    """
    team = db.query(Team).filter(Team.id == team_id).first()
    
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    # Check for name conflicts
    if team_data.name and team_data.name != team.name:
        existing = db.query(Team).filter(Team.name == team_data.name).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Team name already taken"
            )
    
    # Update fields
    update_data = team_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(team, field, value)
    
    db.commit()
    db.refresh(team)
    
    return team


@router.get("/submissions", response_model=List[PendingSubmissionSummary])
async def list_pending_submissions_admin(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    status_filter: Optional[MissionStatus] = MissionStatus.PENDING,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List mission submissions for admin review.
    
    Defaults to showing pending submissions, but can filter by status.
    """
    query = db.query(
        MissionSubmission.id,
        MissionSubmission.mission_id,
        Mission.title.label("mission_title"),
        MissionSubmission.team_id,
        Team.name.label("team_name"),
        MissionSubmission.submitted_by,
        User.full_name.label("submitted_by_name"),
        MissionSubmission.description,
        MissionSubmission.photo_url,
        MissionSubmission.file_url,
        MissionSubmission.submitted_at
    ).join(
        Mission, MissionSubmission.mission_id == Mission.id
    ).join(
        Team, MissionSubmission.team_id == Team.id
    ).join(
        User, MissionSubmission.submitted_by == User.id
    )
    
    if status_filter:
        query = query.filter(MissionSubmission.status == status_filter)
    
    submissions = query.order_by(
        desc(MissionSubmission.submitted_at)
    ).offset(skip).limit(limit).all()
    
    result = []
    for s in submissions:
        days_pending = (datetime.utcnow() - s.submitted_at).days
        result.append(PendingSubmissionSummary(
            id=s.id,
            mission_id=s.mission_id,
            mission_title=s.mission_title,
            team_id=s.team_id,
            team_name=s.team_name,
            submitted_by_id=s.submitted_by,
            submitted_by_name=s.submitted_by_name,
            description=s.description,
            photo_url=s.photo_url,
            file_url=s.file_url,
            submitted_at=s.submitted_at,
            days_pending=days_pending
        ))
    
    return result


@router.post("/reports/export", response_model=ExportResponse)
async def export_platform_data(
    export_request: ExportRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Export platform data for reporting.
    
    Supports exporting users, teams, missions, submissions, or full data.
    Can output as JSON or CSV format.
    """
    data = []
    record_count = 0
    
    if export_request.report_type == "users":
        users = db.query(User).all()
        data = [
            {
                "id": u.id,
                "username": u.username,
                "email": u.email,
                "full_name": u.full_name,
                "role": u.role.value,
                "is_active": u.is_active,
                "created_at": u.created_at.isoformat()
            }
            for u in users
        ]
        record_count = len(data)
    
    elif export_request.report_type == "teams":
        teams = db.query(Team).all()
        data = [
            {
                "id": t.id,
                "name": t.name,
                "total_points": t.total_points,
                "missions_completed": t.missions_completed,
                "created_at": t.created_at.isoformat()
            }
            for t in teams
        ]
        record_count = len(data)
    
    elif export_request.report_type == "missions":
        missions = db.query(Mission).all()
        data = [
            {
                "id": m.id,
                "title": m.title,
                "points": m.points,
                "difficulty": m.difficulty.value,
                "is_active": m.is_active,
                "created_at": m.created_at.isoformat()
            }
            for m in missions
        ]
        record_count = len(data)
    
    elif export_request.report_type == "submissions":
        submissions = db.query(MissionSubmission).all()
        data = [
            {
                "id": s.id,
                "mission_id": s.mission_id,
                "team_id": s.team_id,
                "status": s.status.value,
                "submitted_at": s.submitted_at.isoformat()
            }
            for s in submissions
        ]
        record_count = len(data)
    
    elif export_request.report_type == "full":
        data = {
            "users_count": db.query(func.count(User.id)).scalar(),
            "teams_count": db.query(func.count(Team.id)).scalar(),
            "missions_count": db.query(func.count(Mission.id)).scalar(),
            "submissions_count": db.query(func.count(MissionSubmission.id)).scalar(),
            "exported_at": datetime.utcnow().isoformat()
        }
        record_count = 1
    
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid report type"
        )
    
    return ExportResponse(
        report_type=export_request.report_type,
        format=export_request.format,
        record_count=record_count,
        generated_at=datetime.utcnow(),
        data=data
    )
