"""
Authentication Schemas
Token and authentication-related schemas
"""

from pydantic import BaseModel
from typing import Optional


class Token(BaseModel):
    """JWT token response"""
    access_token: str
    token_type: str = "bearer"
    refresh_token: Optional[str] = None


class TokenData(BaseModel):
    """Data stored in JWT token"""
    user_id: int
    username: str
    role: str


class RefreshToken(BaseModel):
    """Refresh token request"""
    refresh_token: str


class RefreshTokenRequest(BaseModel):
    """Request model for token refresh endpoint"""
    refresh_token: str
