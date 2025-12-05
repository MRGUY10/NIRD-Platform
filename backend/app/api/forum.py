"""
Forum API
Community discussion forum endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.models.user import User
from app.models.forum import ForumPost, Comment
from app.models.category import Category
from app.schemas.forum import (
    ForumPostCreate, ForumPostUpdate, ForumPostResponse, ForumPostWithAuthor,
    CommentCreate, CommentUpdate, CommentResponse, CommentWithAuthor
)
from app.schemas.user import UserSummary

router = APIRouter(tags=["Forum"])


@router.get("/posts", response_model=List[ForumPostWithAuthor])
async def list_forum_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category_id: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    List all forum posts with optional filters.
    
    - **skip**: Pagination offset
    - **limit**: Number of posts per page
    - **category_id**: Filter by category
    - **search**: Search in title and content
    """
    query = db.query(ForumPost)
    
    # Apply filters
    if category_id:
        query = query.filter(ForumPost.category_id == category_id)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (ForumPost.title.ilike(search_term)) |
            (ForumPost.content.ilike(search_term))
        )
    
    # Order: pinned first, then by creation date
    posts = query.order_by(
        desc(ForumPost.is_pinned),
        desc(ForumPost.created_at)
    ).offset(skip).limit(limit).all()
    
    # Build response with author info and comment count
    result = []
    for post in posts:
        # Get author
        author = db.query(User).filter(User.id == post.author_id).first()
        author_summary = UserSummary(
            id=author.id,
            username=author.username,
            full_name=author.full_name,
            avatar_url=author.avatar_url,
            role=author.role
        ) if author else None
        
        # Count comments
        comment_count = db.query(Comment).filter(
            Comment.forum_post_id == post.id
        ).count()
        
        result.append(ForumPostWithAuthor(
            id=post.id,
            title=post.title,
            content=post.content,
            category_id=post.category_id,
            author_id=post.author_id,
            is_pinned=post.is_pinned,
            is_locked=post.is_locked,
            views=post.views,
            created_at=post.created_at,
            updated_at=post.updated_at,
            author=author_summary,
            comments_count=comment_count
        ))
    
    return result


@router.post("/posts", response_model=ForumPostResponse, status_code=status.HTTP_201_CREATED)
async def create_forum_post(
    post_data: ForumPostCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new forum post.
    
    All authenticated users can create posts.
    """
    # Verify category if provided
    if post_data.category_id:
        category = db.query(Category).filter(
            Category.id == post_data.category_id
        ).first()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found"
            )
    
    # Create post
    db_post = ForumPost(
        title=post_data.title,
        content=post_data.content,
        category_id=post_data.category_id,
        author_id=current_user.id,
        is_pinned=False,
        is_locked=False,
        views=0
    )
    
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    
    return db_post


@router.get("/posts/{post_id}", response_model=ForumPostWithAuthor)
async def get_forum_post(
    post_id: int,
    db: Session = Depends(get_db)
):
    """
    Get detailed forum post information.
    
    Increments view count when accessed.
    """
    post = db.query(ForumPost).filter(ForumPost.id == post_id).first()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Forum post not found"
        )
    
    # Increment view count
    post.views += 1
    db.commit()
    
    # Get author
    author = db.query(User).filter(User.id == post.author_id).first()
    author_summary = UserSummary(
        id=author.id,
        username=author.username,
        full_name=author.full_name,
        avatar_url=author.avatar_url,
        role=author.role
    ) if author else None
    
    # Count comments
    comment_count = db.query(Comment).filter(
        Comment.forum_post_id == post.id
    ).count()
    
    return ForumPostWithAuthor(
        id=post.id,
        title=post.title,
        content=post.content,
        category_id=post.category_id,
        author_id=post.author_id,
        is_pinned=post.is_pinned,
        is_locked=post.is_locked,
        views=post.views,
        created_at=post.created_at,
        updated_at=post.updated_at,
        author=author_summary,
        comments_count=comment_count
    )


@router.put("/posts/{post_id}", response_model=ForumPostResponse)
async def update_forum_post(
    post_id: int,
    post_data: ForumPostUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a forum post.
    
    Only the author or admins can update posts.
    Admins can pin/lock posts.
    """
    post = db.query(ForumPost).filter(ForumPost.id == post_id).first()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Forum post not found"
        )
    
    # Check if locked
    if post.is_locked and post.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Post is locked"
        )
    
    # Check authorization
    from app.models.user import UserRole
    is_author = post.author_id == current_user.id
    is_admin = current_user.role == UserRole.ADMIN
    
    if not is_author and not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this post"
        )
    
    # Update fields
    if post_data.title is not None and is_author:
        post.title = post_data.title
    if post_data.content is not None and is_author:
        post.content = post_data.content
    if post_data.is_pinned is not None and is_admin:
        post.is_pinned = post_data.is_pinned
    if post_data.is_locked is not None and is_admin:
        post.is_locked = post_data.is_locked
    
    db.commit()
    db.refresh(post)
    
    return post


@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_forum_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a forum post.
    
    Only the author or admins can delete posts.
    """
    post = db.query(ForumPost).filter(ForumPost.id == post_id).first()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Forum post not found"
        )
    
    # Check authorization
    from app.models.user import UserRole
    if post.author_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this post"
        )
    
    db.delete(post)
    db.commit()
    
    return None


# Comment endpoints
@router.get("/posts/{post_id}/comments", response_model=List[CommentWithAuthor])
async def get_post_comments(
    post_id: int,
    db: Session = Depends(get_db)
):
    """
    Get all comments for a forum post.
    
    Returns comments with author information and nested replies.
    """
    # Verify post exists
    post = db.query(ForumPost).filter(ForumPost.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Forum post not found"
        )
    
    # Get top-level comments (no parent)
    comments = db.query(Comment).filter(
        Comment.forum_post_id == post_id,
        Comment.parent_comment_id == None
    ).order_by(Comment.created_at).all()
    
    result = []
    for comment in comments:
        author = db.query(User).filter(User.id == comment.author_id).first()
        author_summary = UserSummary(
            id=author.id,
            username=author.username,
            full_name=author.full_name,
            avatar_url=author.avatar_url,
            role=author.role
        ) if author else None
        
        # Get replies
        replies = get_comment_replies(comment.id, db)
        
        result.append(CommentWithAuthor(
            id=comment.id,
            content=comment.content,
            author_id=comment.author_id,
            forum_post_id=comment.forum_post_id,
            parent_comment_id=comment.parent_comment_id,
            created_at=comment.created_at,
            updated_at=comment.updated_at,
            author=author_summary,
            replies=replies
        ))
    
    return result


def get_comment_replies(comment_id: int, db: Session) -> List[CommentWithAuthor]:
    """Helper function to recursively get comment replies"""
    replies = db.query(Comment).filter(
        Comment.parent_comment_id == comment_id
    ).order_by(Comment.created_at).all()
    
    result = []
    for reply in replies:
        author = db.query(User).filter(User.id == reply.author_id).first()
        author_summary = UserSummary(
            id=author.id,
            username=author.username,
            full_name=author.full_name,
            avatar_url=author.avatar_url,
            role=author.role
        ) if author else None
        
        nested_replies = get_comment_replies(reply.id, db)
        
        result.append(CommentWithAuthor(
            id=reply.id,
            content=reply.content,
            author_id=reply.author_id,
            forum_post_id=reply.forum_post_id,
            parent_comment_id=reply.parent_comment_id,
            created_at=reply.created_at,
            updated_at=reply.updated_at,
            author=author_summary,
            replies=nested_replies
        ))
    
    return result


@router.post("/posts/{post_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def create_comment(
    post_id: int,
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add a comment to a forum post.
    
    Can also reply to another comment by setting parent_comment_id.
    """
    # Verify post exists and is not locked
    post = db.query(ForumPost).filter(ForumPost.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Forum post not found"
        )
    
    if post.is_locked:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Post is locked for comments"
        )
    
    # Verify parent comment if replying
    if comment_data.parent_comment_id:
        parent = db.query(Comment).filter(
            Comment.id == comment_data.parent_comment_id
        ).first()
        if not parent or parent.forum_post_id != post_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Parent comment not found"
            )
    
    # Create comment
    db_comment = Comment(
        content=comment_data.content,
        author_id=current_user.id,
        forum_post_id=post_id,
        parent_comment_id=comment_data.parent_comment_id
    )
    
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    
    return db_comment


@router.put("/comments/{comment_id}", response_model=CommentResponse)
async def update_comment(
    comment_id: int,
    comment_data: CommentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a comment.
    
    Only the author can update their comment.
    """
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    # Check authorization
    if comment.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this comment"
        )
    
    comment.content = comment_data.content
    db.commit()
    db.refresh(comment)
    
    return comment


@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    comment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a comment.
    
    Only the author or admins can delete comments.
    """
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    # Check authorization
    from app.models.user import UserRole
    if comment.author_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this comment"
        )
    
    db.delete(comment)
    db.commit()
    
    return None
