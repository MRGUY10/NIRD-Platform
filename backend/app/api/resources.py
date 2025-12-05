"""
Resource Library API
Endpoints for educational resource management
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from typing import List, Optional

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_teacher_or_admin
from app.models.user import User, UserRole
from app.models.resource import Resource, ResourceType
from app.models.category import Category
from app.schemas.resource import (
    ResourceCreate, ResourceUpdate, ResourceResponse, ResourceSummary
)

router = APIRouter(tags=["Resources"])


@router.get("", response_model=List[ResourceSummary])
async def list_resources(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    resource_type: Optional[ResourceType] = None,
    category_id: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    List all published resources with optional filters.
    
    - **skip**: Pagination offset
    - **limit**: Number of resources per page
    - **resource_type**: Filter by type (video, article, tutorial, etc.)
    - **category_id**: Filter by category
    - **search**: Search in title and description
    """
    query = db.query(Resource).filter(Resource.is_published == True)
    
    # Apply filters
    if resource_type:
        query = query.filter(Resource.resource_type == resource_type)
    
    if category_id:
        query = query.filter(Resource.category_id == category_id)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Resource.title.ilike(search_term)) |
            (Resource.description.ilike(search_term))
        )
    
    # Get resources ordered by creation date
    resources = query.order_by(desc(Resource.created_at)).offset(skip).limit(limit).all()
    
    return resources


@router.post("", response_model=ResourceResponse, status_code=status.HTTP_201_CREATED)
async def create_resource(
    resource_data: ResourceCreate,
    current_user: User = Depends(require_teacher_or_admin),
    db: Session = Depends(get_db)
):
    """
    Create a new resource.
    
    Only teachers and admins can create resources.
    """
    # Verify category exists if provided
    if resource_data.category_id:
        category = db.query(Category).filter(
            Category.id == resource_data.category_id
        ).first()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found"
            )
    
    # Create resource
    db_resource = Resource(
        title=resource_data.title,
        description=resource_data.description,
        content=resource_data.content,
        resource_type=resource_data.resource_type,
        category_id=resource_data.category_id,
        file_url=resource_data.file_url,
        external_url=resource_data.external_url,
        thumbnail_url=resource_data.thumbnail_url,
        author_id=current_user.id,
        tags=resource_data.tags,
        difficulty=resource_data.difficulty,
        is_published=True,
        views=0,
        downloads=0
    )
    
    db.add(db_resource)
    db.commit()
    db.refresh(db_resource)
    
    return db_resource


@router.get("/{resource_id}", response_model=ResourceResponse)
async def get_resource(
    resource_id: int,
    db: Session = Depends(get_db)
):
    """
    Get detailed resource information.
    
    Increments view count when accessed.
    """
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )
    
    # Increment view count
    resource.views += 1
    db.commit()
    db.refresh(resource)
    
    return resource


@router.put("/{resource_id}", response_model=ResourceResponse)
async def update_resource(
    resource_id: int,
    resource_data: ResourceUpdate,
    current_user: User = Depends(require_teacher_or_admin),
    db: Session = Depends(get_db)
):
    """
    Update resource information.
    
    Only teachers, admins, or the resource author can update.
    """
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )
    
    # Check authorization (author or admin)
    if resource.author_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this resource"
        )
    
    # Update fields
    if resource_data.title is not None:
        resource.title = resource_data.title
    if resource_data.description is not None:
        resource.description = resource_data.description
    if resource_data.content is not None:
        resource.content = resource_data.content
    if resource_data.file_url is not None:
        resource.file_url = resource_data.file_url
    if resource_data.external_url is not None:
        resource.external_url = resource_data.external_url
    if resource_data.thumbnail_url is not None:
        resource.thumbnail_url = resource_data.thumbnail_url
    if resource_data.tags is not None:
        resource.tags = resource_data.tags
    if resource_data.difficulty is not None:
        resource.difficulty = resource_data.difficulty
    if resource_data.is_published is not None:
        resource.is_published = resource_data.is_published
    
    db.commit()
    db.refresh(resource)
    
    return resource


@router.delete("/{resource_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resource(
    resource_id: int,
    current_user: User = Depends(require_teacher_or_admin),
    db: Session = Depends(get_db)
):
    """
    Delete a resource.
    
    Only admins or the resource author can delete.
    """
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )
    
    # Check authorization
    if resource.author_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this resource"
        )
    
    db.delete(resource)
    db.commit()
    
    return None


@router.post("/{resource_id}/download")
async def track_download(
    resource_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Track a resource download.
    
    Increments the download counter.
    """
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )
    
    # Increment download count
    resource.downloads += 1
    db.commit()
    
    return {"message": "Download tracked", "downloads": resource.downloads}


@router.get("/stats/summary")
async def get_resource_stats(
    db: Session = Depends(get_db)
):
    """
    Get resource library statistics.
    
    Returns counts by type, most viewed, etc.
    """
    total_resources = db.query(func.count(Resource.id)).filter(
        Resource.is_published == True
    ).scalar() or 0
    
    total_views = db.query(func.sum(Resource.views)).filter(
        Resource.is_published == True
    ).scalar() or 0
    
    total_downloads = db.query(func.sum(Resource.downloads)).filter(
        Resource.is_published == True
    ).scalar() or 0
    
    # Count by type
    type_counts = db.query(
        Resource.resource_type,
        func.count(Resource.id)
    ).filter(
        Resource.is_published == True
    ).group_by(Resource.resource_type).all()
    
    # Most viewed resources
    most_viewed = db.query(Resource).filter(
        Resource.is_published == True
    ).order_by(desc(Resource.views)).limit(5).all()
    
    return {
        "total_resources": total_resources,
        "total_views": total_views,
        "total_downloads": total_downloads,
        "by_type": {str(t[0].value): t[1] for t in type_counts},
        "most_viewed": [
            {"id": r.id, "title": r.title, "views": r.views}
            for r in most_viewed
        ]
    }
