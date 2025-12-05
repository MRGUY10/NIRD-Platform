# Pydantic Schemas Documentation

## Overview
All request/response schemas for the NIRD Platform API.

## Schema Modules

### 1. User Schemas (`app/schemas/user.py`)
- **UserCreate**: Registration data
- **UserUpdate**: Profile updates
- **UserLogin**: Login credentials
- **UserResponse**: Full user data
- **UserSummary**: Simplified user info
- **UserStats**: User statistics
- **PasswordChange**: Password change request

### 2. Authentication Schemas (`app/schemas/auth.py`)
- **Token**: JWT token response
- **TokenData**: Token payload data
- **RefreshToken**: Token refresh request

### 3. School Schemas (`app/schemas/school.py`)
- **SchoolCreate**: New school registration
- **SchoolUpdate**: School information updates
- **SchoolResponse**: Full school data
- **SchoolSummary**: Simplified school info

### 4. Team Schemas (`app/schemas/team.py`)
- **TeamCreate**: Create new team
- **TeamUpdate**: Update team info
- **TeamMemberAdd**: Add member to team
- **TeamResponse**: Full team data
- **TeamWithMembers**: Team with member list
- **TeamSummary**: Simplified team info
- **TeamStats**: Team statistics

### 5. Category Schemas (`app/schemas/category.py`)
- **CategoryCreate**: Create category
- **CategoryUpdate**: Update category
- **CategoryResponse**: Full category data
- **CategoryWithCount**: Category with mission count

### 6. Mission Schemas (`app/schemas/mission.py`)
- **MissionCreate**: Create new mission
- **MissionUpdate**: Update mission
- **MissionResponse**: Full mission data
- **MissionWithCategory**: Mission with category
- **MissionSummary**: Simplified mission info
- **MissionSubmissionCreate**: Submit mission completion
- **MissionSubmissionUpdate**: Admin review
- **MissionSubmissionResponse**: Submission data
- **MissionSubmissionWithDetails**: Full submission details

### 7. Badge Schemas (`app/schemas/badge.py`)
- **BadgeCreate**: Create badge
- **BadgeUpdate**: Update badge
- **BadgeResponse**: Badge data
- **UserBadgeResponse**: Earned badge
- **BadgeAward**: Award badge to user

### 8. Resource Schemas (`app/schemas/resource.py`)
- **ResourceCreate**: Create resource
- **ResourceUpdate**: Update resource
- **ResourceResponse**: Full resource data
- **ResourceSummary**: Simplified resource info

### 9. Forum Schemas (`app/schemas/forum.py`)
- **ForumPostCreate**: Create post
- **ForumPostUpdate**: Update post
- **ForumPostResponse**: Post data
- **ForumPostWithAuthor**: Post with author
- **ForumPostSummary**: Simplified post
- **CommentCreate**: Create comment
- **CommentUpdate**: Update comment
- **CommentResponse**: Comment data
- **CommentWithAuthor**: Comment with author and replies

### 10. Notification Schemas (`app/schemas/notification.py`)
- **NotificationCreate**: Create notification
- **NotificationResponse**: Notification data
- **NotificationMarkRead**: Mark as read

### 11. Leaderboard Schemas (`app/schemas/leaderboard.py`)
- **LeaderboardEntry**: Single ranking entry
- **LeaderboardResponse**: Full leaderboard
- **TeamRankHistory**: Historical rankings
- **RankSnapshot**: Point-in-time ranking
- **LeaderboardStats**: Global statistics

### 12. Statistics Schemas (`app/schemas/stats.py`)
- **GlobalStats**: Platform-wide statistics
- **CategoryStats**: Category analytics
- **ImpactCalculator**: Environmental impact
- **ImpactCalculatorInput**: Impact calculation input
- **RegionalStats**: Regional analytics
- **TimeSeriesData**: Time-based data
- **ChartData**: Generic chart data

## Validation Features

### Email Validation
```python
from app.schemas import UserCreate

user = UserCreate(
    email="user@example.com",  # Validates email format
    username="johndoe",
    password="securepass123"
)
```

### Field Constraints
```python
from app.schemas import MissionCreate

mission = MissionCreate(
    title="Mission Title",  # min_length=1, max_length=255
    description="Description",
    difficulty=MissionDifficulty.MEDIUM,
    points=100,  # gt=0 (greater than 0)
    category_id=1
)
```

### Optional Fields
```python
from app.schemas import TeamCreate

team = TeamCreate(
    name="Team Name",  # Required
    description="Optional description",  # Optional
    school_id=1  # Optional
)
```

## Usage in API Endpoints

### Request Body Validation
```python
from fastapi import APIRouter
from app.schemas import UserCreate, UserResponse

router = APIRouter()

@router.post("/users", response_model=UserResponse)
async def create_user(user: UserCreate):
    # user is automatically validated
    # Invalid data returns 422 Unprocessable Entity
    return created_user
```

### Response Model
```python
@router.get("/users/{id}", response_model=UserResponse)
async def get_user(id: int):
    # Return value is automatically converted to UserResponse
    return user_from_db
```

### List Responses
```python
from typing import List

@router.get("/teams", response_model=List[TeamSummary])
async def list_teams():
    return teams_list
```

## Common Patterns

### Create/Update Pattern
Most resources have separate Create and Update schemas:
- **Create**: All required fields + optional fields
- **Update**: All fields optional (partial updates)

### Summary Pattern
Most resources have a Summary schema for list endpoints:
- Contains only essential fields
- Reduces response size
- Improves performance

### WithDetails Pattern
Some schemas have "WithDetails" variants:
- Includes related entity data
- Used for detailed view endpoints
- Example: `TeamWithMembers`, `ForumPostWithAuthor`

## Best Practices

1. **Use appropriate schemas** for each endpoint
2. **Leverage validation** - let Pydantic handle it
3. **Use Summary schemas** for list endpoints
4. **Use Response schemas** for detailed views
5. **Always set response_model** in route decorators

## Testing Schemas

Run the verification script:
```bash
python verify_schemas.py
```

This validates all schemas can be imported and instantiated correctly.
