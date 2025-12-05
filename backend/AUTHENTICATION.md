# 🔐 Authentication System Documentation

## Overview

The NIRD Platform authentication system implements JWT (JSON Web Tokens) for secure user authentication with bcrypt password hashing, OAuth2 flows, and role-based access control.

## Components

### 1. Security Utilities (`app/core/security.py`)

Core security functions for password hashing and JWT token management.

#### Password Hashing

```python
from app.core.security import get_password_hash, verify_password

# Hash a password
hashed_password = get_password_hash("user_password")

# Verify a password
is_valid = verify_password("user_password", hashed_password)
```

**Features:**
- Uses bcrypt algorithm (cost factor: 12)
- Automatic salt generation
- Secure password comparison with constant-time verification

#### JWT Token Generation

```python
from app.core.security import create_access_token, create_refresh_token

# Create access token (30 minutes expiration)
access_token = create_access_token({
    "sub": str(user.id),
    "email": user.email,
    "role": user.role.value
})

# Create refresh token (7 days expiration)
refresh_token = create_refresh_token({
    "sub": str(user.id)
})
```

**Token Payload:**
- `sub` (subject): User ID as string (JWT standard)
- `email`: User email address
- `role`: User role (student, teacher, admin)
- `exp` (expiration): Automatic expiration timestamp
- `iat` (issued at): Token creation timestamp
- `type`: "access" (default) or "refresh"

#### Token Validation

```python
from app.core.security import decode_token, verify_token_type

# Decode and verify token
payload = decode_token(token_string)
if payload:
    user_id = payload.get("sub")
    email = payload.get("email")
    
# Verify token type
is_refresh = verify_token_type(payload, "refresh")
```

### 2. Authentication Dependencies (`app/core/dependencies.py`)

FastAPI dependencies for protecting endpoints and enforcing authorization.

#### OAuth2 Scheme

```python
from app.core.dependencies import oauth2_scheme

# Automatically extracts token from Authorization header
# Format: "Bearer <token>"
```

#### Get Current User

```python
from fastapi import Depends
from app.core.dependencies import get_current_user
from app.models.user import User

@router.get("/protected")
async def protected_route(current_user: User = Depends(get_current_user)):
    return {"user": current_user.email}
```

**Functionality:**
- Extracts and validates JWT token
- Queries user from database
- Verifies user is active
- Returns User object
- Raises 401 if token invalid or user not found

#### Role-Based Access Control

##### Require Specific Role

```python
from app.core.dependencies import require_role
from app.models.user import UserRole

@router.post("/admin-only")
async def admin_only(user: User = Depends(lambda: require_role(UserRole.ADMIN))):
    return {"message": "Admin access granted"}
```

##### Require Admin

```python
from app.core.dependencies import require_admin

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    admin: User = Depends(require_admin)
):
    # Only admins can execute this
    pass
```

##### Require Teacher or Admin

```python
from app.core.dependencies import require_teacher_or_admin

@router.post("/missions/{mission_id}/approve")
async def approve_mission(
    mission_id: int,
    teacher: User = Depends(require_teacher_or_admin)
):
    # Teachers and admins can approve missions
    pass
```

##### Optional Authentication

```python
from app.core.dependencies import get_optional_user

@router.get("/public")
async def public_route(user: Optional[User] = Depends(get_optional_user)):
    # Works for both authenticated and anonymous users
    if user:
        return {"message": f"Hello, {user.email}"}
    return {"message": "Hello, guest"}
```

## Configuration

Authentication settings are defined in `app/core/config.py`:

```python
# JWT Settings
SECRET_KEY: str = "your-secret-key-change-in-production"
ALGORITHM: str = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
REFRESH_TOKEN_EXPIRE_DAYS: int = 7
```

**⚠️ Important:** Change the SECRET_KEY in production to a strong random string:

```bash
# Generate secure key with Python
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## Usage Examples

### Registration Flow

```python
from app.core.security import get_password_hash
from app.schemas.user import UserCreate
from app.models.user import User

# In your registration endpoint
def register_user(user_data: UserCreate, db: Session):
    # Hash the password
    hashed_password = get_password_hash(user_data.password)
    
    # Create user
    db_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password,
        role=user_data.role
    )
    db.add(db_user)
    db.commit()
    return db_user
```

### Login Flow

```python
from fastapi import HTTPException, status
from app.core.security import verify_password, create_access_token, create_refresh_token

def login_user(username: str, password: str, db: Session):
    # Find user
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    if not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Generate tokens
    access_token = create_access_token({
        "sub": str(user.id),
        "email": user.email,
        "role": user.role.value
    })
    
    refresh_token = create_refresh_token({
        "sub": str(user.id)
    })
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }
```

### Protected Endpoint

```python
from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user

router = APIRouter()

@router.get("/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role.value
    }
```

### Team Management (Student Only)

```python
@router.post("/teams")
async def create_team(
    team_data: TeamCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Only students can create teams
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="Only students can create teams")
    
    # Create team logic...
    pass
```

## Security Best Practices

### 1. Password Requirements

Enforce strong passwords in your registration validation:

```python
from pydantic import validator

class UserCreate(BaseModel):
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain uppercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain digit')
        return v
```

### 2. Token Storage (Frontend)

**Recommended:**
- Store access token in memory (React state)
- Store refresh token in httpOnly cookie or secure storage
- Never store tokens in localStorage (XSS vulnerability)

### 3. HTTPS Only

Always use HTTPS in production to prevent token interception.

### 4. Token Refresh

Implement token refresh endpoint:

```python
@router.post("/refresh")
async def refresh_token(
    refresh_token: str,
    db: Session = Depends(get_db)
):
    payload = decode_token(refresh_token)
    if not payload or not verify_token_type(payload, "refresh"):
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    user_id = int(payload.get("sub"))
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found")
    
    # Generate new access token
    new_access_token = create_access_token({
        "sub": str(user.id),
        "email": user.email,
        "role": user.role.value
    })
    
    return {"access_token": new_access_token, "token_type": "bearer"}
```

### 5. Rate Limiting

Implement rate limiting on login endpoints to prevent brute force attacks (use slowapi or similar).

### 6. Account Lockout

Consider implementing account lockout after N failed login attempts.

## Testing

Verify authentication with the test script:

```bash
python verify_auth.py
```

**Tests include:**
- Security utilities import
- Authentication dependencies import
- Password hashing and verification
- JWT access token generation and decoding
- JWT refresh token generation
- Invalid token handling

## Error Handling

### 401 Unauthorized

Returned when:
- No token provided
- Invalid token
- Expired token
- User not found
- User inactive

### 403 Forbidden

Returned when:
- User lacks required role
- User account suspended
- Insufficient permissions

## Dependencies

```
python-jose[cryptography]==3.3.0  # JWT handling
passlib[bcrypt]==1.7.4            # Password hashing
bcrypt==4.1.2                     # Bcrypt algorithm
python-multipart==0.0.6           # Form data support
```

## Next Steps

After implementing authentication endpoints (Step 6), you can:
1. Add social OAuth providers (Google, GitHub)
2. Implement 2FA/MFA
3. Add password reset functionality
4. Implement session management
5. Add device tracking

## Summary

✅ **Completed in Step 5:**
- Password hashing with bcrypt
- JWT token generation (access + refresh)
- Token validation and decoding
- OAuth2 scheme setup
- Current user dependency
- Role-based access control
- Optional authentication support

🎯 **Ready for Step 6:** Implement authentication endpoints (register, login, logout, refresh)
