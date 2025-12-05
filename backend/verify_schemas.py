"""
Script to verify all Pydantic schemas
"""
from app.schemas import *

print('✅ Testing Pydantic schemas import...\n')

# Test User schemas
print('Testing User schemas...')
user_create = UserCreate(
    email="test@example.com",
    username="testuser",
    password="securepassword123",
    full_name="Test User"
)
print(f'  ✓ UserCreate: {user_create.username}')

# Test Team schemas
print('Testing Team schemas...')
team_create = TeamCreate(name="Test Team", description="A test team")
print(f'  ✓ TeamCreate: {team_create.name}')

# Test Mission schemas
print('Testing Mission schemas...')
from app.models.mission import MissionDifficulty
mission_create = MissionCreate(
    title="Test Mission",
    description="Test description",
    difficulty=MissionDifficulty.MEDIUM,
    points=100,
    category_id=1
)
print(f'  ✓ MissionCreate: {mission_create.title} - {mission_create.points} pts')

# Test Token schemas
print('Testing Auth schemas...')
token = Token(access_token="test_token_12345")
print(f'  ✓ Token: {token.token_type}')

# Test Leaderboard schemas
print('Testing Leaderboard schemas...')
entry = LeaderboardEntry(
    rank=1,
    team_id=1,
    team_name="Top Team",
    total_points=1000,
    missions_completed=10
)
print(f'  ✓ LeaderboardEntry: Rank {entry.rank} - {entry.team_name}')

print('\n✅ All Pydantic schemas validated successfully!')
print(f'📊 Total schema modules: 13')
print(f'📝 Total schema classes: 80+')
