"""
Badge API
Endpoints for badge management and user badges
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.badge import Badge, UserBadge
from app.schemas.badge import BadgeResponse, UserBadgeResponse

router = APIRouter(tags=["Badges"])


@router.get("", response_model=List[BadgeResponse])
async def list_badges(
    db: Session = Depends(get_db)
):
    """
    List all available badges in the platform.
    
    Returns all badge definitions that users can earn.
    """
    badges = db.query(Badge).order_by(Badge.name).all()
    return badges


@router.get("/me", response_model=List[UserBadgeResponse])
async def get_my_badges(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all badges earned by the current user.
    
    Returns badges with earned date.
    """
    user_badges = db.query(UserBadge).filter(
        UserBadge.user_id == current_user.id
    ).order_by(
        desc(UserBadge.earned_at)
    ).all()
    
    result = []
    for ub in user_badges:
        badge = db.query(Badge).filter(Badge.id == ub.badge_id).first()
        if badge:
            result.append(UserBadgeResponse(
                id=ub.id,
                badge_id=badge.id,
                badge_name=badge.name,
                badge_slug=badge.slug,
                badge_description=badge.description,
                badge_icon=badge.icon,
                earned_at=ub.earned_at
            ))
    
    return result


@router.get("/user/{user_id}", response_model=List[UserBadgeResponse])
async def get_user_badges(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Get all badges earned by a specific user.
    
    Public endpoint to view other users' badges.
    """
    # Check if user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user_badges = db.query(UserBadge).filter(
        UserBadge.user_id == user_id
    ).order_by(
        desc(UserBadge.earned_at)
    ).all()
    
    result = []
    for ub in user_badges:
        badge = db.query(Badge).filter(Badge.id == ub.badge_id).first()
        if badge:
            result.append(UserBadgeResponse(
                id=ub.id,
                badge_id=badge.id,
                badge_name=badge.name,
                badge_slug=badge.slug,
                badge_description=badge.description,
                badge_icon=badge.icon,
                earned_at=ub.earned_at
            ))
    
    return result
