"""
FastAPI dependencies for authentication and authorization.
"""
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_token
from app.models.user import User, UserRole
from app.schemas.auth import TokenData

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login",
    scheme_name="JWT"
)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Get the current authenticated user from the JWT token.
    
    Args:
        token: The JWT token from the Authorization header
        db: Database session
    
    Returns:
        The authenticated User object
    
    Raises:
        HTTPException: If the token is invalid or the user doesn't exist
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Decode the token
    payload = decode_token(token)
    if payload is None:
        raise credentials_exception
    
    # Extract user identifier (sub is a string in JWT)
    user_id_str: Optional[str] = payload.get("sub")
    if user_id_str is None:
        raise credentials_exception
    
    try:
        user_id = int(user_id_str)
    except (ValueError, TypeError):
        raise credentials_exception
    
    # Query the user from database
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Get the current active user (additional layer of validation).
    
    Args:
        current_user: The current authenticated user
    
    Returns:
        The active User object
    
    Raises:
        HTTPException: If the user is inactive
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    return current_user


async def require_role(
    required_role: UserRole,
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency to require a specific user role.
    
    Args:
        required_role: The required user role
        current_user: The current authenticated user
    
    Returns:
        The authenticated User object if they have the required role
    
    Raises:
        HTTPException: If the user doesn't have the required role
    """
    if current_user.role != required_role:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Operation requires {required_role.value} role"
        )
    return current_user


async def require_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency to require admin role.
    
    Args:
        current_user: The current authenticated user
    
    Returns:
        The authenticated User object if they are an admin
    
    Raises:
        HTTPException: If the user is not an admin
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


async def require_teacher_or_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency to require teacher or admin role.
    
    Args:
        current_user: The current authenticated user
    
    Returns:
        The authenticated User object if they are a teacher or admin
    
    Raises:
        HTTPException: If the user is not a teacher or admin
    """
    if current_user.role not in [UserRole.TEACHER, UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Teacher or admin access required"
        )
    return current_user


def get_optional_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Get the current user if authenticated, None otherwise.
    Useful for endpoints that work both authenticated and unauthenticated.
    
    Args:
        token: Optional JWT token
        db: Database session
    
    Returns:
        User object if authenticated, None otherwise
    """
    if not token:
        return None
    
    try:
        payload = decode_token(token)
        if payload is None:
            return None
        
        user_id_str: Optional[str] = payload.get("sub")
        if user_id_str is None:
            return None
        
        try:
            user_id = int(user_id_str)
        except (ValueError, TypeError):
            return None
        
        user = db.query(User).filter(User.id == user_id).first()
        return user if user and user.is_active else None
    except Exception:
        return None
