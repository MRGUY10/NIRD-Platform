"""
Mission Management API
Endpoints for mission CRUD, submissions, and approvals
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.models.user import User, UserRole
from app.models.mission import Mission, MissionSubmission, MissionStatus, MissionDifficulty
from app.models.team import Team, TeamMember
from app.models.category import Category
from app.schemas.mission import (
    MissionCreate, MissionUpdate, MissionResponse, MissionWithDetails,
    SubmissionCreate, SubmissionUpdate, SubmissionResponse, SubmissionReview,
    MissionSummary
)

router = APIRouter(tags=["Missions"])


@router.get("", response_model=List[MissionSummary])
async def list_missions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    category_id: Optional[int] = None,
    difficulty: Optional[MissionDifficulty] = None,
    is_active: Optional[bool] = True,
    db: Session = Depends(get_db)
):
    """
    List all missions with optional filters.
    
    - **skip**: Number of missions to skip (pagination)
    - **limit**: Maximum number of missions to return
    - **category_id**: Filter by category ID
    - **difficulty**: Filter by difficulty (EASY, MEDIUM, HARD)
    - **is_active**: Filter by active status (default: True)
    """
    query = db.query(Mission)
    
    if category_id is not None:
        query = query.filter(Mission.category_id == category_id)
    
    if difficulty is not None:
        query = query.filter(Mission.difficulty == difficulty)
    
    if is_active is not None:
        query = query.filter(Mission.is_active == is_active)
    
    missions = query.order_by(Mission.created_at.desc()).offset(skip).limit(limit).all()
    
    return missions


@router.get("/my-submissions", response_model=List[SubmissionResponse])
async def get_my_submissions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all submissions from the current user's team.
    
    Returns 404 if user is not in a team.
    """
    # Check if user is a student
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only students can have submissions"
        )
    
    # Find user's team
    membership = db.query(TeamMember).filter(
        TeamMember.user_id == current_user.id
    ).first()
    
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="You are not in any team"
        )
    
    # Get team submissions
    submissions = db.query(MissionSubmission).filter(
        MissionSubmission.team_id == membership.team_id
    ).order_by(MissionSubmission.submitted_at.desc()).all()
    
    return submissions


@router.post("", response_model=MissionResponse, status_code=status.HTTP_201_CREATED)
async def create_mission(
    mission_data: MissionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new mission.
    
    Only teachers and admins can create missions.
    
    - **title**: Mission title (unique)
    - **description**: Mission description
    - **category_id**: Category ID
    - **difficulty**: Difficulty level (EASY, MEDIUM, HARD)
    - **points**: Points awarded for completion
    """
    # Check if user is teacher or admin
    if current_user.role not in [UserRole.TEACHER, UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers and admins can create missions"
        )
    
    # Check if mission title already exists
    existing_mission = db.query(Mission).filter(
        Mission.title == mission_data.title
    ).first()
    
    if existing_mission:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mission title already exists"
        )
    
    # Verify category exists (only if provided)
    if mission_data.category_id is not None:
        category = db.query(Category).filter(
            Category.id == mission_data.category_id
        ).first()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found"
            )
    
    # Create mission
    db_mission = Mission(
        title=mission_data.title,
        description=mission_data.description,
        category_id=mission_data.category_id,
        difficulty=mission_data.difficulty,
        points=mission_data.points,
        requires_photo=mission_data.requires_photo,
        requires_file=mission_data.requires_file,
        requires_description=mission_data.requires_description,
        is_active=True
    )
    
    db.add(db_mission)
    db.commit()
    db.refresh(db_mission)
    
    return db_mission


@router.get("/{mission_id}", response_model=MissionWithDetails)
async def get_mission(
    mission_id: int,
    db: Session = Depends(get_db)
):
    """
    Get detailed mission information.
    
    - **mission_id**: Mission ID
    """
    mission = db.query(Mission).filter(Mission.id == mission_id).first()
    
    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mission not found"
        )
    
    # Get submission count
    submission_count = db.query(MissionSubmission).filter(
        MissionSubmission.mission_id == mission_id
    ).count()
    
    # Get approved count
    approved_count = db.query(MissionSubmission).filter(
        MissionSubmission.mission_id == mission_id,
        MissionSubmission.status == MissionStatus.APPROVED
    ).count()
    
    # Convert to dict and add counts
    mission_dict = {
        "id": mission.id,
        "title": mission.title,
        "description": mission.description,
        "category_id": mission.category_id,
        "difficulty": mission.difficulty,
        "points": mission.points,
        "requires_photo": mission.requires_photo,
        "requires_file": mission.requires_file,
        "requires_description": mission.requires_description,
        "is_active": mission.is_active,
        "created_at": mission.created_at,
        "category": mission.category,
        "submission_count": submission_count,
        "approved_count": approved_count
    }
    
    return mission_dict


@router.put("/{mission_id}", response_model=MissionResponse)
async def update_mission(
    mission_id: int,
    mission_data: MissionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update mission information.
    
    Only teachers and admins can update missions.
    """
    # Check if user is teacher or admin
    if current_user.role not in [UserRole.TEACHER, UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers and admins can update missions"
        )
    
    # Get mission
    mission = db.query(Mission).filter(Mission.id == mission_id).first()
    
    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mission not found"
        )
    
    # Check if new title conflicts with existing mission
    if mission_data.title and mission_data.title != mission.title:
        existing_mission = db.query(Mission).filter(
            Mission.title == mission_data.title
        ).first()
        
        if existing_mission:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Mission title already exists"
            )
    
    # Update fields
    if mission_data.title is not None:
        mission.title = mission_data.title
    if mission_data.description is not None:
        mission.description = mission_data.description
    if mission_data.difficulty is not None:
        mission.difficulty = mission_data.difficulty
    if mission_data.points is not None:
        mission.points = mission_data.points
    if mission_data.requires_photo is not None:
        mission.requires_photo = mission_data.requires_photo
    if mission_data.requires_file is not None:
        mission.requires_file = mission_data.requires_file
    if mission_data.requires_description is not None:
        mission.requires_description = mission_data.requires_description
    if mission_data.is_active is not None:
        mission.is_active = mission_data.is_active
    
    db.commit()
    db.refresh(mission)
    
    return mission


@router.delete("/{mission_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_mission(
    mission_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a mission.
    
    Only admins can delete missions.
    This will also delete all associated submissions.
    """
    # Only admins can delete missions
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete missions"
        )
    
    # Get mission
    mission = db.query(Mission).filter(Mission.id == mission_id).first()
    
    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mission not found"
        )
    
    # Delete mission (cascade will handle submissions)
    db.delete(mission)
    db.commit()


@router.post("/{mission_id}/submit", response_model=SubmissionResponse, status_code=status.HTTP_201_CREATED)
async def submit_mission(
    mission_id: int,
    submission_data: SubmissionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Submit a mission completion.
    
    Only students in a team can submit missions.
    
    - **mission_id**: Mission ID
    - **description**: Submission description
    - **photo_url**: Photo URL (required if mission requires photo)
    - **file_url**: File URL (required if mission requires file)
    """
    # Check if user is a student
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can submit missions"
        )
    
    # Find user's team
    membership = db.query(TeamMember).filter(
        TeamMember.user_id == current_user.id
    ).first()
    
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="You are not in any team"
        )
    
    # Get mission
    mission = db.query(Mission).filter(Mission.id == mission_id).first()
    
    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mission not found"
        )
    
    if not mission.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mission is not active"
        )
    
    # Validate photo requirement
    if mission.requires_photo and not submission_data.photo_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Photo is required for this mission"
        )
    
    # Validate file requirement
    if mission.requires_file and not submission_data.file_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File is required for this mission"
        )
    
    # Check if team already has a pending or approved submission for this mission
    existing_submission = db.query(MissionSubmission).filter(
        MissionSubmission.mission_id == mission_id,
        MissionSubmission.team_id == membership.team_id,
        MissionSubmission.status.in_([MissionStatus.PENDING, MissionStatus.APPROVED])
    ).first()
    
    if existing_submission:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Team already has a {existing_submission.status.value.lower()} submission for this mission"
        )
    
    # Create submission
    db_submission = MissionSubmission(
        mission_id=mission_id,
        team_id=membership.team_id,
        submitted_by=current_user.id,
        description=submission_data.description,
        photo_url=submission_data.photo_url,
        file_url=submission_data.file_url,
        status=MissionStatus.PENDING
    )
    
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    
    return db_submission


@router.get("/submissions/{submission_id}", response_model=SubmissionResponse)
async def get_submission(
    submission_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get submission details.
    
    Students can only see their team's submissions.
    Teachers and admins can see all submissions.
    """
    submission = db.query(MissionSubmission).filter(
        MissionSubmission.id == submission_id
    ).first()
    
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found"
        )
    
    # Check permissions
    if current_user.role == UserRole.STUDENT:
        # Check if submission belongs to user's team
        membership = db.query(TeamMember).filter(
            TeamMember.user_id == current_user.id,
            TeamMember.team_id == submission.team_id
        ).first()
        
        if not membership:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only view your team's submissions"
            )
    
    return submission


@router.get("/submissions", response_model=List[SubmissionResponse])
async def list_submissions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    mission_id: Optional[int] = None,
    team_id: Optional[int] = None,
    status: Optional[MissionStatus] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List mission submissions with filters.
    
    Students can only see their team's submissions.
    Teachers and admins can see all submissions.
    
    - **skip**: Number of submissions to skip
    - **limit**: Maximum number of submissions to return
    - **mission_id**: Filter by mission ID
    - **team_id**: Filter by team ID
    - **status**: Filter by status (PENDING, APPROVED, REJECTED)
    """
    query = db.query(MissionSubmission)
    
    # If student, filter to their team only
    if current_user.role == UserRole.STUDENT:
        membership = db.query(TeamMember).filter(
            TeamMember.user_id == current_user.id
        ).first()
        
        if membership:
            query = query.filter(MissionSubmission.team_id == membership.team_id)
        else:
            return []  # No team, no submissions
    
    # Apply filters
    if mission_id is not None:
        query = query.filter(MissionSubmission.mission_id == mission_id)
    
    if team_id is not None:
        query = query.filter(MissionSubmission.team_id == team_id)
    
    if status is not None:
        query = query.filter(MissionSubmission.status == status)
    
    submissions = query.order_by(
        MissionSubmission.submitted_at.desc()
    ).offset(skip).limit(limit).all()
    
    return submissions


@router.post("/submissions/{submission_id}/review", response_model=SubmissionResponse)
async def review_submission(
    submission_id: int,
    review_data: SubmissionReview,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Review a mission submission (approve or reject).
    
    Only teachers and admins can review submissions.
    Approving a submission updates the team's points and missions_completed count.
    Also awards badges and sends notifications.
    
    - **status**: APPROVED or REJECTED
    - **review_comment**: Optional comment explaining the decision
    """
    # Check if user is teacher or admin
    if current_user.role not in [UserRole.TEACHER, UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers and admins can review submissions"
        )
    
    # Get submission
    submission = db.query(MissionSubmission).filter(
        MissionSubmission.id == submission_id
    ).first()
    
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found"
        )
    
    # Check if already reviewed
    if submission.status != MissionStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Submission already {submission.status.value.lower()}"
        )
    
    # Validate status
    if review_data.status not in [MissionStatus.APPROVED, MissionStatus.REJECTED]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be APPROVED or REJECTED"
        )
    
    # Get mission and submitter
    mission = db.query(Mission).filter(Mission.id == submission.mission_id).first()
    submitter = db.query(User).filter(User.id == submission.submitted_by).first()
    
    # Update submission
    submission.status = review_data.status
    submission.review_comment = review_data.review_comment
    submission.reviewed_by = current_user.id
    submission.reviewed_at = datetime.utcnow()
    
    # Import services
    from app.services.badge_service import BadgeService
    from app.services.notification_service import NotificationService
    
    notification_service = NotificationService(db)
    badge_service = BadgeService(db)
    
    # If approved, update team points and missions count
    if review_data.status == MissionStatus.APPROVED:
        team = db.query(Team).filter(Team.id == submission.team_id).first()
        
        if mission and team:
            team.total_points += mission.points
            team.missions_completed += 1
        
        # Send approval notification
        if submitter and mission:
            notification_service.notify_mission_approved(
                user_id=submitter.id,
                mission_title=mission.title,
                points=mission.points,
                mission_id=mission.id
            )
        
        # Check and award badges
        if submitter:
            newly_awarded = await badge_service.check_and_award_badges(submitter.id)
            
            # Send badge notifications
            for badge in newly_awarded:
                notification_service.notify_badge_earned(
                    user_id=submitter.id,
                    badge_name=badge.name,
                    badge_id=badge.id
                )
    
    # If rejected, send rejection notification
    elif review_data.status == MissionStatus.REJECTED:
        if submitter and mission:
            notification_service.notify_mission_rejected(
                user_id=submitter.id,
                mission_title=mission.title,
                feedback=review_data.review_comment or "No feedback provided",
                mission_id=mission.id
            )
    
    db.commit()
    db.refresh(submission)
    
    return submission


@router.put("/submissions/{submission_id}", response_model=SubmissionResponse)
async def update_submission(
    submission_id: int,
    submission_data: SubmissionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a pending submission.
    
    Only the submitter's team members can update pending submissions.
    """
    # Check if user is a student
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can update submissions"
        )
    
    # Get submission
    submission = db.query(MissionSubmission).filter(
        MissionSubmission.id == submission_id
    ).first()
    
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found"
        )
    
    # Check if submission is pending
    if submission.status != MissionStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending submissions can be updated"
        )
    
    # Check if user is in the team
    membership = db.query(TeamMember).filter(
        TeamMember.user_id == current_user.id,
        TeamMember.team_id == submission.team_id
    ).first()
    
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your team's submissions"
        )
    
    # Update fields
    if submission_data.description is not None:
        submission.description = submission_data.description
    if submission_data.photo_url is not None:
        submission.photo_url = submission_data.photo_url
    if submission_data.file_url is not None:
        submission.file_url = submission_data.file_url
    
    db.commit()
    db.refresh(submission)
    
    return submission
