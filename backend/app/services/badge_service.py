"""
Badge Service
Logic for automatic badge awards based on user achievements
"""

from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import List, Optional
from datetime import datetime

from app.models.user import User
from app.models.badge import Badge, UserBadge
from app.models.mission import MissionSubmission
from app.models.resource import Resource
from app.models.forum import ForumPost, Comment


class BadgeService:
    """Service for checking and awarding badges"""
    
    # Badge criteria definitions
    BADGE_CRITERIA = {
        "first_mission": {
            "name": "First Steps",
            "description": "Complete your first mission",
            "icon": "🎯",
            "check": "check_first_mission"
        },
        "mission_streak_7": {
            "name": "Week Warrior",
            "description": "Complete missions for 7 days in a row",
            "icon": "🔥",
            "check": "check_mission_streak"
        },
        "missions_10": {
            "name": "Mission Master",
            "description": "Complete 10 missions",
            "icon": "⭐",
            "check": "check_mission_count"
        },
        "missions_50": {
            "name": "Mission Legend",
            "description": "Complete 50 missions",
            "icon": "👑",
            "check": "check_mission_count"
        },
        "points_100": {
            "name": "Century Maker",
            "description": "Earn 100 points",
            "icon": "💯",
            "check": "check_points"
        },
        "points_500": {
            "name": "Point Champion",
            "description": "Earn 500 points",
            "icon": "🏆",
            "check": "check_points"
        },
        "team_player": {
            "name": "Team Player",
            "description": "Help your team reach top 3",
            "icon": "🤝",
            "check": "check_team_rank"
        },
        "eco_warrior": {
            "name": "Eco Warrior",
            "description": "Save 10 devices from e-waste",
            "icon": "🌱",
            "check": "check_devices_saved"
        },
        "knowledge_sharer": {
            "name": "Knowledge Sharer",
            "description": "Create 3 resources",
            "icon": "📚",
            "check": "check_resources_created"
        },
        "community_helper": {
            "name": "Community Helper",
            "description": "Post 10 helpful forum comments",
            "icon": "💬",
            "check": "check_forum_participation"
        }
    }
    
    def __init__(self, db: Session):
        self.db = db
    
    async def check_and_award_badges(self, user_id: int) -> List[Badge]:
        """
        Check all badge criteria for a user and award new badges.
        Returns list of newly awarded badges.
        """
        newly_awarded = []
        
        # Get user
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return []
        
        # Get already awarded badges
        awarded_badge_ids = [
            ub.badge_id for ub in 
            self.db.query(UserBadge).filter(UserBadge.user_id == user_id).all()
        ]
        
        # Check each badge criteria
        for badge_slug, criteria in self.BADGE_CRITERIA.items():
            # Get or create badge
            badge = self.db.query(Badge).filter(Badge.slug == badge_slug).first()
            if not badge:
                badge = Badge(
                    name=criteria["name"],
                    slug=badge_slug,
                    description=criteria["description"],
                    icon=criteria["icon"]
                )
                self.db.add(badge)
                self.db.commit()
                self.db.refresh(badge)
            
            # Skip if already awarded
            if badge.id in awarded_badge_ids:
                continue
            
            # Check criteria
            check_method = getattr(self, criteria["check"], None)
            if check_method and await check_method(user, badge_slug):
                # Award badge
                user_badge = UserBadge(
                    user_id=user_id,
                    badge_id=badge.id
                )
                self.db.add(user_badge)
                newly_awarded.append(badge)
        
        if newly_awarded:
            self.db.commit()
        
        return newly_awarded
    
    async def check_first_mission(self, user: User, badge_slug: str) -> bool:
        """Check if user completed their first mission"""
        count = self.db.query(func.count(MissionSubmission.id)).filter(
            and_(
                MissionSubmission.submitted_by == user.id,
                MissionSubmission.status == "approved"
            )
        ).scalar()
        return count >= 1
    
    async def check_mission_count(self, user: User, badge_slug: str) -> bool:
        """Check if user reached mission count threshold"""
        thresholds = {
            "missions_10": 10,
            "missions_50": 50
        }
        threshold = thresholds.get(badge_slug, 0)
        
        count = self.db.query(func.count(MissionSubmission.id)).filter(
            and_(
                MissionSubmission.submitted_by == user.id,
                MissionSubmission.status == "approved"
            )
        ).scalar()
        return count >= threshold
    
    async def check_points(self, user: User, badge_slug: str) -> bool:
        """Check if user earned enough points"""
        from app.models.mission import Mission
        
        thresholds = {
            "points_100": 100,
            "points_500": 500
        }
        threshold = thresholds.get(badge_slug, 0)
        
        total_points = self.db.query(func.sum(Mission.points)).join(
            MissionSubmission
        ).filter(
            and_(
                MissionSubmission.submitted_by == user.id,
                MissionSubmission.status == "approved"
            )
        ).scalar() or 0
        
        return total_points >= threshold
    
    async def check_mission_streak(self, user: User, badge_slug: str) -> bool:
        """Check if user has a 7-day mission streak"""
        # Simplified: Check if user has submissions on 7 different days
        from sqlalchemy import distinct
        
        distinct_days = self.db.query(
            func.count(distinct(func.date(MissionSubmission.submitted_at)))
        ).filter(
            and_(
                MissionSubmission.submitted_by == user.id,
                MissionSubmission.status == "approved"
            )
        ).scalar() or 0
        
        return distinct_days >= 7
    
    async def check_team_rank(self, user: User, badge_slug: str) -> bool:
        """Check if user's team is in top 3"""
        from app.models.team import Team, TeamMember
        from app.models.mission import Mission
        
        # Get user's team
        team_member = self.db.query(TeamMember).filter(
            TeamMember.user_id == user.id
        ).first()
        
        if not team_member:
            return False
        
        # Calculate team rankings
        rankings = self.db.query(
            Team.id,
            func.sum(Mission.points).label("total_points")
        ).join(
            MissionSubmission, Team.id == MissionSubmission.team_id
        ).join(
            Mission, MissionSubmission.mission_id == Mission.id
        ).filter(
            MissionSubmission.status == "approved"
        ).group_by(
            Team.id
        ).order_by(
            func.sum(Mission.points).desc()
        ).limit(3).all()
        
        top_team_ids = [r.id for r in rankings]
        return team_member.team_id in top_team_ids
    
    async def check_devices_saved(self, user: User, badge_slug: str) -> bool:
        """Check if user saved 10 devices (estimate: 3 missions = 1 device)"""
        count = self.db.query(func.count(MissionSubmission.id)).filter(
            and_(
                MissionSubmission.submitted_by == user.id,
                MissionSubmission.status == "approved"
            )
        ).scalar() or 0
        
        devices_saved = count // 3
        return devices_saved >= 10
    
    async def check_resources_created(self, user: User, badge_slug: str) -> bool:
        """Check if user created 3 resources"""
        count = self.db.query(func.count(Resource.id)).filter(
            and_(
                Resource.author_id == user.id,
                Resource.is_published == True
            )
        ).scalar() or 0
        
        return count >= 3
    
    async def check_forum_participation(self, user: User, badge_slug: str) -> bool:
        """Check if user posted 10 comments"""
        count = self.db.query(func.count(Comment.id)).filter(
            Comment.author_id == user.id
        ).scalar() or 0
        
        return count >= 10


def get_badge_service(db: Session) -> BadgeService:
    """Dependency for getting badge service"""
    return BadgeService(db)
