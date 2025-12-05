"""
Forum and Comment Models
Community discussion features
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class ForumPost(Base):
    __tablename__ = "forum_posts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    content = Column(Text, nullable=False)
    
    # Author
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Category (optional)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    
    # Status
    is_pinned = Column(Boolean, default=False)
    is_locked = Column(Boolean, default=False)
    
    # Stats
    views = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    author = relationship("User", back_populates="forum_posts")
    category = relationship("Category")
    comments = relationship("Comment", back_populates="forum_post", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<ForumPost {self.title}>"


class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    
    # Author
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Parent (can be forum post or another comment for threading)
    forum_post_id = Column(Integer, ForeignKey("forum_posts.id"), nullable=True)
    parent_comment_id = Column(Integer, ForeignKey("comments.id"), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    author = relationship("User", back_populates="comments")
    forum_post = relationship("ForumPost", back_populates="comments")
    parent_comment = relationship("Comment", remote_side=[id], backref="replies")
    
    def __repr__(self):
        return f"<Comment by user_id={self.author_id}>"
