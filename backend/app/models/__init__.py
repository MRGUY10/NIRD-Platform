"""
Database Models Package
Import all models here to ensure they are registered with SQLAlchemy
"""

from app.models.user import User, UserRole
from app.models.school import School
from app.models.team import Team, TeamMember
from app.models.category import Category
from app.models.mission import Mission, MissionSubmission, MissionDifficulty, MissionStatus
from app.models.badge import Badge, UserBadge
from app.models.resource import Resource, ResourceType
from app.models.forum import ForumPost, Comment
from app.models.notification import Notification, NotificationType
from app.models.leaderboard import LeaderboardSnapshot

__all__ = [
    "User",
    "UserRole",
    "School",
    "Team",
    "TeamMember",
    "Category",
    "Mission",
    "MissionSubmission",
    "MissionDifficulty",
    "MissionStatus",
    "Badge",
    "UserBadge",
    "Resource",
    "ResourceType",
    "ForumPost",
    "Comment",
    "Notification",
    "NotificationType",
    "LeaderboardSnapshot",
]
