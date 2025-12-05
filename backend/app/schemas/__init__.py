"""
Pydantic Schemas Package
Request/Response models for API endpoints
"""

# User schemas
from app.schemas.user import (
    UserBase, UserCreate, UserUpdate, UserLogin, PasswordChange,
    UserResponse, UserSummary, UserStats
)

# Auth schemas
from app.schemas.auth import Token, TokenData, RefreshToken

# School schemas
from app.schemas.school import (
    SchoolBase, SchoolCreate, SchoolUpdate,
    SchoolResponse, SchoolSummary
)

# Team schemas
from app.schemas.team import (
    TeamBase, TeamCreate, TeamUpdate, TeamMemberAdd,
    TeamResponse, TeamWithMembers, TeamSummary, TeamStats
)

# Category schemas
from app.schemas.category import (
    CategoryBase, CategoryCreate, CategoryUpdate,
    CategoryResponse, CategoryWithCount
)

# Mission schemas
from app.schemas.mission import (
    MissionBase, MissionCreate, MissionUpdate,
    MissionResponse, MissionWithCategory, MissionSummary,
    MissionSubmissionCreate, MissionSubmissionUpdate,
    MissionSubmissionResponse, MissionSubmissionWithDetails
)

# Badge schemas
from app.schemas.badge import (
    BadgeBase, BadgeCreate, BadgeUpdate,
    BadgeResponse, UserBadgeResponse, BadgeAward
)

# Resource schemas
from app.schemas.resource import (
    ResourceBase, ResourceCreate, ResourceUpdate,
    ResourceResponse, ResourceSummary
)

# Forum schemas
from app.schemas.forum import (
    ForumPostBase, ForumPostCreate, ForumPostUpdate,
    ForumPostResponse, ForumPostWithAuthor, ForumPostSummary,
    CommentBase, CommentCreate, CommentUpdate,
    CommentResponse, CommentWithAuthor
)

# Notification schemas
from app.schemas.notification import (
    NotificationCreate, NotificationResponse, NotificationMarkRead
)

# Leaderboard schemas
from app.schemas.leaderboard import (
    LeaderboardEntry, LeaderboardResponse,
    TeamRankHistory, RankSnapshot, LeaderboardStats
)

# Statistics schemas
from app.schemas.stats import (
    GlobalStats, CategoryStats, ImpactCalculator,
    ImpactCalculatorInput, RegionalStats, TimeSeriesData, ChartData
)

__all__ = [
    # User
    "UserBase", "UserCreate", "UserUpdate", "UserLogin", "PasswordChange",
    "UserResponse", "UserSummary", "UserStats",
    # Auth
    "Token", "TokenData", "RefreshToken",
    # School
    "SchoolBase", "SchoolCreate", "SchoolUpdate",
    "SchoolResponse", "SchoolSummary",
    # Team
    "TeamBase", "TeamCreate", "TeamUpdate", "TeamMemberAdd",
    "TeamResponse", "TeamWithMembers", "TeamSummary", "TeamStats",
    # Category
    "CategoryBase", "CategoryCreate", "CategoryUpdate",
    "CategoryResponse", "CategoryWithCount",
    # Mission
    "MissionBase", "MissionCreate", "MissionUpdate",
    "MissionResponse", "MissionWithCategory", "MissionSummary",
    "MissionSubmissionCreate", "MissionSubmissionUpdate",
    "MissionSubmissionResponse", "MissionSubmissionWithDetails",
    # Badge
    "BadgeBase", "BadgeCreate", "BadgeUpdate",
    "BadgeResponse", "UserBadgeResponse", "BadgeAward",
    # Resource
    "ResourceBase", "ResourceCreate", "ResourceUpdate",
    "ResourceResponse", "ResourceSummary",
    # Forum
    "ForumPostBase", "ForumPostCreate", "ForumPostUpdate",
    "ForumPostResponse", "ForumPostWithAuthor", "ForumPostSummary",
    "CommentBase", "CommentCreate", "CommentUpdate",
    "CommentResponse", "CommentWithAuthor",
    # Notification
    "NotificationCreate", "NotificationResponse", "NotificationMarkRead",
    # Leaderboard
    "LeaderboardEntry", "LeaderboardResponse",
    "TeamRankHistory", "RankSnapshot", "LeaderboardStats",
    # Stats
    "GlobalStats", "CategoryStats", "ImpactCalculator",
    "ImpactCalculatorInput", "RegionalStats", "TimeSeriesData", "ChartData",
]
