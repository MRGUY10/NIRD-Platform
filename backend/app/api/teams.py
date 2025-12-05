"""
Team Management API Endpoints
Handles team CRUD operations, member management, and team statistics
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.models.user import User, UserRole
from app.models.team import Team, TeamMember
from app.models.school import School
from app.schemas.team import (
    TeamCreate, TeamUpdate, TeamResponse, TeamWithMembers, 
    TeamSummary, TeamStats, TeamMemberAdd
)

router = APIRouter(tags=["Teams"])


@router.get("", response_model=List[TeamSummary])
async def list_teams(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    school_id: Optional[int] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """
    Get list of all teams with pagination.
    
    - **skip**: Number of teams to skip (pagination)
    - **limit**: Maximum number of teams to return
    - **school_id**: Filter by school ID
    - **is_active**: Filter by active status
    """
    query = db.query(Team)
    
    if school_id is not None:
        query = query.filter(Team.school_id == school_id)
    
    if is_active is not None:
        query = query.filter(Team.is_active == is_active)
    
    # Order by points (leaderboard order)
    query = query.order_by(desc(Team.total_points))
    
    teams = query.offset(skip).limit(limit).all()
    return teams


@router.get("/leaderboard", response_model=List[TeamSummary])
async def get_leaderboard(
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Get top teams by points (leaderboard).
    
    - **limit**: Number of top teams to return (default: 10)
    """
    teams = db.query(Team)\
        .filter(Team.is_active == True)\
        .order_by(desc(Team.total_points))\
        .limit(limit)\
        .all()
    
    return teams


@router.post("", response_model=TeamResponse, status_code=status.HTTP_201_CREATED)
async def create_team(
    team_data: TeamCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new team.
    
    - **name**: Team name (unique)
    - **description**: Optional team description
    - **school_id**: Optional school association
    
    Note: Only students can create teams, creator becomes captain automatically.
    """
    # Check if user is a student
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can create teams"
        )
    
    # Check if team name already exists
    existing_team = db.query(Team).filter(Team.name == team_data.name).first()
    if existing_team:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Team name already exists"
        )
    
    # Verify school exists if provided
    if team_data.school_id:
        school = db.query(School).filter(School.id == team_data.school_id).first()
        if not school:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="School not found"
            )
    
    # Check if user is already in a team
    existing_membership = db.query(TeamMember).filter(
        TeamMember.user_id == current_user.id
    ).first()
    if existing_membership:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You are already a member of a team"
        )
    
    # Create team
    db_team = Team(
        name=team_data.name,
        description=team_data.description,
        school_id=team_data.school_id
    )
    db.add(db_team)
    db.flush()  # Get team ID
    
    # Add creator as captain
    team_member = TeamMember(
        team_id=db_team.id,
        user_id=current_user.id,
        is_captain=True
    )
    db.add(team_member)
    
    db.commit()
    db.refresh(db_team)
    
    return db_team


@router.get("/my-team", response_model=TeamWithMembers)
async def get_my_team(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get the current user's team.
    
    Returns 404 if user is not in a team.
    """
    # Check if user is a student
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only students can be in teams"
        )
    
    # Find user's team membership
    membership = db.query(TeamMember).filter(
        TeamMember.user_id == current_user.id
    ).first()
    
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="You are not in any team"
        )
    
    # Get team
    team = db.query(Team).filter(Team.id == membership.team_id).first()
    
    # Get team members with user data
    members = db.query(User).join(TeamMember).filter(
        TeamMember.team_id == team.id
    ).all()
    
    # Convert to dict and add members list
    team_dict = {
        "id": team.id,
        "name": team.name,
        "description": team.description,
        "school_id": team.school_id,
        "avatar_url": team.avatar_url,
        "total_points": team.total_points,
        "missions_completed": team.missions_completed,
        "current_rank": team.current_rank,
        "is_active": team.is_active,
        "created_at": team.created_at,
        "members": members,
        "school": team.school
    }
    
    return team_dict


@router.get("/{team_id}", response_model=TeamWithMembers)
async def get_team(
    team_id: int,
    db: Session = Depends(get_db)
):
    """
    Get detailed team information with members list.
    
    - **team_id**: Team ID
    """
    team = db.query(Team).filter(Team.id == team_id).first()
    
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    # Get team members with user data
    members = db.query(User).join(TeamMember).filter(
        TeamMember.team_id == team_id
    ).all()
    
    # Convert to dict and add members list
    team_dict = {
        "id": team.id,
        "name": team.name,
        "description": team.description,
        "school_id": team.school_id,
        "avatar_url": team.avatar_url,
        "total_points": team.total_points,
        "missions_completed": team.missions_completed,
        "current_rank": team.current_rank,
        "is_active": team.is_active,
        "created_at": team.created_at,
        "members": members,
        "school": team.school
    }
    
    return team_dict


@router.put("/{team_id}", response_model=TeamResponse)
async def update_team(
    team_id: int,
    team_data: TeamUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update team information.
    
    - **name**: New team name (optional)
    - **description**: New description (optional)
    - **avatar_url**: New avatar URL (optional)
    - **is_active**: Active status (admin only)
    
    Note: Only team captain or admin can update team info.
    """
    team = db.query(Team).filter(Team.id == team_id).first()
    
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    # Check permissions: must be captain or admin
    if current_user.role != UserRole.ADMIN:
        team_member = db.query(TeamMember).filter(
            TeamMember.team_id == team_id,
            TeamMember.user_id == current_user.id,
            TeamMember.is_captain == True
        ).first()
        
        if not team_member:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only team captain or admin can update team info"
            )
    
    # Check if new name conflicts with existing team
    if team_data.name and team_data.name != team.name:
        existing_team = db.query(Team).filter(Team.name == team_data.name).first()
        if existing_team:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Team name already exists"
            )
    
    # Update fields
    update_data = team_data.model_dump(exclude_unset=True)
    
    # Only admin can change is_active status
    if 'is_active' in update_data and current_user.role != UserRole.ADMIN:
        del update_data['is_active']
    
    for field, value in update_data.items():
        setattr(team, field, value)
    
    db.commit()
    db.refresh(team)
    
    return team


@router.delete("/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_team(
    team_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a team.
    
    Note: Only team captain or admin can delete the team.
    This will also remove all team members and mission submissions.
    """
    team = db.query(Team).filter(Team.id == team_id).first()
    
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    # Check permissions
    if current_user.role != UserRole.ADMIN:
        team_member = db.query(TeamMember).filter(
            TeamMember.team_id == team_id,
            TeamMember.user_id == current_user.id,
            TeamMember.is_captain == True
        ).first()
        
        if not team_member:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only team captain or admin can delete team"
            )
    
    db.delete(team)
    db.commit()


@router.post("/{team_id}/members", status_code=status.HTTP_201_CREATED)
async def add_team_member(
    team_id: int,
    member_data: TeamMemberAdd,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add a member to the team.
    
    - **user_id**: ID of user to add
    - **is_captain**: Whether user should be captain (default: False)
    
    Note: Only team captain or admin can add members.
    """
    team = db.query(Team).filter(Team.id == team_id).first()
    
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    # Check permissions
    if current_user.role != UserRole.ADMIN:
        team_member = db.query(TeamMember).filter(
            TeamMember.team_id == team_id,
            TeamMember.user_id == current_user.id,
            TeamMember.is_captain == True
        ).first()
        
        if not team_member:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only team captain or admin can add members"
            )
    
    # Check if user exists
    user = db.query(User).filter(User.id == member_data.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if user is a student
    if user.role != UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only students can join teams"
        )
    
    # Check if user is already in this team
    existing_membership = db.query(TeamMember).filter(
        TeamMember.team_id == team_id,
        TeamMember.user_id == member_data.user_id
    ).first()
    
    if existing_membership:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already a member of this team"
        )
    
    # Check if user is in another team
    other_membership = db.query(TeamMember).filter(
        TeamMember.user_id == member_data.user_id
    ).first()
    
    if other_membership:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already in another team"
        )
    
    # Add member
    new_member = TeamMember(
        team_id=team_id,
        user_id=member_data.user_id,
        is_captain=member_data.is_captain
    )
    db.add(new_member)
    db.commit()
    
    return {"message": "Member added successfully", "user_id": member_data.user_id}


@router.delete("/{team_id}/members/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_team_member(
    team_id: int,
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Remove a member from the team.
    
    Note: Team captain, the member themselves, or admin can remove a member.
    Cannot remove the last captain.
    """
    team = db.query(Team).filter(Team.id == team_id).first()
    
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    # Get member to remove
    member = db.query(TeamMember).filter(
        TeamMember.team_id == team_id,
        TeamMember.user_id == user_id
    ).first()
    
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found in team"
        )
    
    # Check permissions
    is_captain = db.query(TeamMember).filter(
        TeamMember.team_id == team_id,
        TeamMember.user_id == current_user.id,
        TeamMember.is_captain == True
    ).first()
    
    can_remove = (
        current_user.role == UserRole.ADMIN or
        is_captain is not None or
        current_user.id == user_id
    )
    
    if not can_remove:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions to remove member"
        )
    
    # Check if this is the last captain
    if member.is_captain:
        captain_count = db.query(TeamMember).filter(
            TeamMember.team_id == team_id,
            TeamMember.is_captain == True
        ).count()
        
        if captain_count <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot remove the last captain. Assign another captain first."
            )
    
    db.delete(member)
    db.commit()


@router.get("/{team_id}/stats", response_model=TeamStats)
async def get_team_stats(
    team_id: int,
    db: Session = Depends(get_db)
):
    """
    Get team statistics.
    
    - **team_id**: Team ID
    
    Returns total points, missions completed, rank, member count, and submission stats.
    """
    team = db.query(Team).filter(Team.id == team_id).first()
    
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    # Count members
    members_count = db.query(TeamMember).filter(TeamMember.team_id == team_id).count()
    
    # Count submissions by status
    from app.models.mission import MissionSubmission, MissionStatus
    
    pending_count = db.query(MissionSubmission).filter(
        MissionSubmission.team_id == team_id,
        MissionSubmission.status == MissionStatus.PENDING
    ).count()
    
    approved_count = db.query(MissionSubmission).filter(
        MissionSubmission.team_id == team_id,
        MissionSubmission.status == MissionStatus.APPROVED
    ).count()
    
    return TeamStats(
        total_points=team.total_points,
        missions_completed=team.missions_completed,
        current_rank=team.current_rank,
        members_count=members_count,
        pending_submissions=pending_count,
        approved_submissions=approved_count
    )
