"""
Notification Service
Logic for creating and managing user notifications
"""

from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from fastapi import Depends

from app.core.database import get_db
from app.models.user import User
from app.models.notification import Notification, NotificationType


class NotificationService:
    """Service for managing notifications"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_notification(
        self,
        user_id: int,
        notification_type: NotificationType,
        title: str,
        message: str,
        related_id: Optional[int] = None,
        related_type: Optional[str] = None,
        action_url: Optional[str] = None
    ) -> Notification:
        """Create a new notification for a user"""
        notification = Notification(
            user_id=user_id,
            type=notification_type,
            title=title,
            message=message,
            related_id=related_id,
            related_type=related_type,
            action_url=action_url,
            is_read=False
        )
        self.db.add(notification)
        self.db.commit()
        self.db.refresh(notification)
        return notification
    
    def notify_mission_approved(
        self,
        user_id: int,
        mission_title: str,
        points: int,
        mission_id: int
    ):
        """Notify user that their mission was approved"""
        return self.create_notification(
            user_id=user_id,
            notification_type=NotificationType.MISSION_APPROVED,
            title="Mission Approved! 🎉",
            message=f"Your submission for '{mission_title}' was approved. You earned {points} points!",
            related_id=mission_id,
            related_type="mission",
            action_url=f"/missions/{mission_id}"
        )
    
    def notify_mission_rejected(
        self,
        user_id: int,
        mission_title: str,
        feedback: str,
        mission_id: int
    ):
        """Notify user that their mission was rejected"""
        return self.create_notification(
            user_id=user_id,
            notification_type=NotificationType.MISSION_REJECTED,
            title="Mission Needs Improvement",
            message=f"Your submission for '{mission_title}' needs revision. Feedback: {feedback}",
            related_id=mission_id,
            related_type="mission",
            action_url=f"/missions/{mission_id}"
        )
    
    def notify_badge_earned(
        self,
        user_id: int,
        badge_name: str,
        badge_id: int
    ):
        """Notify user they earned a new badge"""
        return self.create_notification(
            user_id=user_id,
            notification_type=NotificationType.BADGE_EARNED,
            title=f"New Badge Earned: {badge_name}! 🏆",
            message=f"Congratulations! You've earned the '{badge_name}' badge.",
            related_id=badge_id,
            related_type="badge",
            action_url="/profile/badges"
        )
    
    def notify_team_invite(
        self,
        user_id: int,
        team_name: str,
        team_id: int
    ):
        """Notify user they were invited to a team"""
        return self.create_notification(
            user_id=user_id,
            notification_type=NotificationType.TEAM_INVITE,
            title="Team Invitation",
            message=f"You've been invited to join '{team_name}'!",
            related_id=team_id,
            related_type="team",
            action_url=f"/teams/{team_id}"
        )
    
    def notify_new_resource(
        self,
        user_ids: List[int],
        resource_title: str,
        resource_id: int
    ):
        """Notify users about a new resource"""
        notifications = []
        for user_id in user_ids:
            notif = self.create_notification(
                user_id=user_id,
                notification_type=NotificationType.NEW_RESOURCE,
                title="New Resource Available 📚",
                message=f"Check out the new resource: '{resource_title}'",
                related_id=resource_id,
                related_type="resource",
                action_url=f"/resources/{resource_id}"
            )
            notifications.append(notif)
        return notifications
    
    def notify_forum_reply(
        self,
        user_id: int,
        post_title: str,
        commenter_name: str,
        post_id: int
    ):
        """Notify user someone replied to their forum post"""
        return self.create_notification(
            user_id=user_id,
            notification_type=NotificationType.FORUM_REPLY,
            title="New Reply to Your Post 💬",
            message=f"{commenter_name} replied to your post '{post_title}'",
            related_id=post_id,
            related_type="forum_post",
            action_url=f"/forum/posts/{post_id}"
        )
    
    def notify_level_up(
        self,
        user_id: int,
        new_level: int
    ):
        """Notify user they leveled up"""
        return self.create_notification(
            user_id=user_id,
            notification_type=NotificationType.LEVEL_UP,
            title=f"Level Up! You're now Level {new_level}! ⭐",
            message=f"Congratulations on reaching Level {new_level}!",
            related_id=new_level,
            related_type="level",
            action_url="/profile"
        )
    
    def notify_leaderboard_rank(
        self,
        user_id: int,
        rank: int,
        team_name: str
    ):
        """Notify user their team moved up in rankings"""
        return self.create_notification(
            user_id=user_id,
            notification_type=NotificationType.LEADERBOARD_UPDATE,
            title=f"Your Team is Rank #{rank}! 🏆",
            message=f"'{team_name}' has moved up to position #{rank} on the leaderboard!",
            related_type="leaderboard",
            action_url="/leaderboard"
        )
    
    def mark_as_read(self, notification_id: int, user_id: int) -> bool:
        """Mark a notification as read"""
        notification = self.db.query(Notification).filter(
            Notification.id == notification_id,
            Notification.user_id == user_id
        ).first()
        
        if not notification:
            return False
        
        notification.is_read = True
        notification.read_at = datetime.utcnow()
        self.db.commit()
        return True
    
    def mark_all_as_read(self, user_id: int) -> int:
        """Mark all notifications as read for a user"""
        count = self.db.query(Notification).filter(
            Notification.user_id == user_id,
            Notification.is_read == False
        ).update({
            "is_read": True,
            "read_at": datetime.utcnow()
        })
        self.db.commit()
        return count
    
    def get_unread_count(self, user_id: int) -> int:
        """Get count of unread notifications"""
        from sqlalchemy import func
        return self.db.query(func.count(Notification.id)).filter(
            Notification.user_id == user_id,
            Notification.is_read == False
        ).scalar() or 0


def get_notification_service(db: Session = Depends(get_db)) -> NotificationService:
    """Dependency for getting notification service"""
    return NotificationService(db)
