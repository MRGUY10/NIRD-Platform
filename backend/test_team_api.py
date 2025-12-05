"""
Test script for Team Management API endpoints.
Tests team CRUD operations, member management, and team statistics.
"""
import requests
import sys
import subprocess
from typing import Dict, Optional

# Base URL for the API
BASE_URL = "http://127.0.0.1:8000"

# Store test data
test_tokens = {}
test_users = {}
test_teams = {}


def clean_database():
    """Clean database before running tests"""
    print("🧹 Cleaning database...")
    try:
        result = subprocess.run(
            [
                "docker", "exec", "nird_postgres", "psql",
                "-U", "nird_user", "-d", "nird_db",
                "-c", "TRUNCATE TABLE mission_submissions, missions, team_members, teams, user_badges, badges, users, schools, categories RESTART IDENTITY CASCADE;"
            ],
            capture_output=True,
            text=True,
            check=True
        )
        print("  ✓ Database cleaned successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"  ✗ Failed to clean database: {e.stderr}")
        return False
    except FileNotFoundError:
        print("  ✗ Docker not found. Please ensure Docker is installed and running.")
        return False


def print_section(title: str):
    """Print a formatted section header"""
    print(f"\n{'='*70}")
    print(f"  {title}")
    print(f"{'='*70}\n")


def register_and_login(username: str, password: str, role: str = "student") -> Optional[Dict]:
    """Register and login a user, return tokens"""
    print(f"📝 Registering and logging in: {username}...")
    
    # Register
    register_data = {
        "username": username,
        "email": f"{username}@example.com",
        "password": password,
        "full_name": username.title(),
        "role": role
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/register", json=register_data)
        if response.status_code == 201:
            user_data = response.json()
            print(f"  ✓ User registered: {user_data['username']} (ID: {user_data['id']})")
            test_users[username] = user_data
        elif response.status_code == 400:
            print(f"  ⚠️  User already exists, proceeding to login...")
        else:
            print(f"  ✗ Registration failed: {response.status_code}")
            return None
    except Exception as e:
        print(f"  ✗ Registration error: {e}")
        return None
    
    # Login
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            data={"username": username, "password": password}
        )
        if response.status_code == 200:
            tokens = response.json()
            print(f"  ✓ Login successful")
            test_tokens[username] = tokens
            return tokens
        else:
            print(f"  ✗ Login failed: {response.status_code}")
            return None
    except Exception as e:
        print(f"  ✗ Login error: {e}")
        return None


def create_team(team_name: str, access_token: str) -> Optional[Dict]:
    """Create a new team"""
    print(f"🏆 Creating team: {team_name}...")
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/teams",
            json={"name": team_name, "description": f"Test team {team_name}"},
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        if response.status_code == 201:
            team_data = response.json()
            print(f"  ✓ Team created successfully")
            print(f"    - ID: {team_data['id']}")
            print(f"    - Name: {team_data['name']}")
            print(f"    - Points: {team_data['total_points']}")
            test_teams[team_name] = team_data
            return team_data
        else:
            print(f"  ✗ Team creation failed: {response.status_code}")
            print(f"    {response.text}")
            return None
    except Exception as e:
        print(f"  ✗ Team creation error: {e}")
        return None


def list_teams() -> Optional[list]:
    """List all teams"""
    print("📋 Listing all teams...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/teams")
        
        if response.status_code == 200:
            teams = response.json()
            print(f"  ✓ Found {len(teams)} teams")
            for team in teams[:5]:  # Show first 5
                print(f"    - {team['name']}: {team['total_points']} points (Rank: {team.get('current_rank', 'N/A')})")
            return teams
        else:
            print(f"  ✗ Failed to list teams: {response.status_code}")
            return None
    except Exception as e:
        print(f"  ✗ List teams error: {e}")
        return None


def get_team(team_id: int) -> Optional[Dict]:
    """Get team details with members"""
    print(f"🔍 Getting team details (ID: {team_id})...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/teams/{team_id}")
        
        if response.status_code == 200:
            team = response.json()
            print(f"  ✓ Team: {team['name']}")
            print(f"    - Total Points: {team['total_points']}")
            print(f"    - Missions Completed: {team['missions_completed']}")
            print(f"    - Members: {len(team.get('members', []))}")
            for member in team.get('members', []):
                print(f"      • {member['username']} ({member['role']})")
            return team
        else:
            print(f"  ✗ Failed to get team: {response.status_code}")
            return None
    except Exception as e:
        print(f"  ✗ Get team error: {e}")
        return None


def update_team(team_id: int, access_token: str, new_name: str) -> bool:
    """Update team information"""
    print(f"✏️  Updating team (ID: {team_id})...")
    
    try:
        response = requests.put(
            f"{BASE_URL}/api/teams/{team_id}",
            json={"name": new_name, "description": "Updated description"},
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        if response.status_code == 200:
            team = response.json()
            print(f"  ✓ Team updated successfully")
            print(f"    - New name: {team['name']}")
            print(f"    - Description: {team['description']}")
            return True
        else:
            print(f"  ✗ Failed to update team: {response.status_code}")
            print(f"    {response.text}")
            return False
    except Exception as e:
        print(f"  ✗ Update team error: {e}")
        return False


def add_team_member(team_id: int, user_id: int, captain_token: str) -> bool:
    """Add a member to the team"""
    print(f"➕ Adding member (User ID: {user_id}) to team {team_id}...")
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/teams/{team_id}/members",
            json={"user_id": user_id, "is_captain": False},
            headers={"Authorization": f"Bearer {captain_token}"}
        )
        
        if response.status_code == 201:
            result = response.json()
            print(f"  ✓ Member added successfully")
            print(f"    - Message: {result['message']}")
            return True
        else:
            print(f"  ✗ Failed to add member: {response.status_code}")
            print(f"    {response.text}")
            return False
    except Exception as e:
        print(f"  ✗ Add member error: {e}")
        return False


def get_team_stats(team_id: int) -> Optional[Dict]:
    """Get team statistics"""
    print(f"📊 Getting team statistics (ID: {team_id})...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/teams/{team_id}/stats")
        
        if response.status_code == 200:
            stats = response.json()
            print(f"  ✓ Team Statistics:")
            print(f"    - Total Points: {stats['total_points']}")
            print(f"    - Missions Completed: {stats['missions_completed']}")
            print(f"    - Current Rank: {stats.get('current_rank', 'N/A')}")
            print(f"    - Members: {stats['members_count']}")
            print(f"    - Pending Submissions: {stats['pending_submissions']}")
            print(f"    - Approved Submissions: {stats['approved_submissions']}")
            return stats
        else:
            print(f"  ✗ Failed to get stats: {response.status_code}")
            return None
    except Exception as e:
        print(f"  ✗ Get stats error: {e}")
        return None


def get_my_team(access_token: str) -> Optional[Dict]:
    """Get current user's team"""
    print(f"👥 Getting my team...")
    
    try:
        response = requests.get(
            f"{BASE_URL}/api/teams/my-team",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        if response.status_code == 200:
            team = response.json()
            print(f"  ✓ Your team: {team['name']}")
            print(f"    - Points: {team['total_points']}")
            print(f"    - Members: {len(team.get('members', []))}")
            return team
        elif response.status_code == 404:
            print(f"  ⚠️  You are not in any team")
            return None
        else:
            print(f"  ✗ Failed to get my team: {response.status_code}")
            return None
    except Exception as e:
        print(f"  ✗ Get my team error: {e}")
        return None


def main():
    """Main test execution"""
    print_section("🏆 NIRD Platform Team Management API Tests")
    
    # Test 1: Setup - Register users
    print_section("Test 1: User Registration & Login")
    student1_tokens = register_and_login("student1", "TestPass123", "student")
    student2_tokens = register_and_login("student2", "TestPass123", "student")
    student3_tokens = register_and_login("student3", "TestPass123", "student")
    
    if not all([student1_tokens, student2_tokens, student3_tokens]):
        print("\n❌ Failed to setup test users")
        sys.exit(1)
    
    student1_token = student1_tokens["access_token"]
    student2_token = student2_tokens["access_token"]
    student3_token = student3_tokens["access_token"]
    
    # Test 2: Create teams
    print_section("Test 2: Create Teams")
    team1 = create_team("Team Alpha", student1_token)
    team2 = create_team("Team Beta", student2_token)
    
    if not all([team1, team2]):
        print("\n❌ Failed to create teams")
        sys.exit(1)
    
    team1_id = team1["id"]
    team2_id = team2["id"]
    
    # Test 3: List teams
    print_section("Test 3: List All Teams")
    teams_list = list_teams()
    
    if not teams_list:
        print("\n❌ Failed to list teams")
        sys.exit(1)
    
    # Test 4: Get team details
    print_section("Test 4: Get Team Details")
    team_details = get_team(team1_id)
    
    if not team_details:
        print("\n❌ Failed to get team details")
        sys.exit(1)
    
    # Test 5: Update team
    print_section("Test 5: Update Team Information")
    if not update_team(team1_id, student1_token, "Team Alpha Updated"):
        print("\n❌ Failed to update team")
        sys.exit(1)
    
    # Test 6: Get my team
    print_section("Test 6: Get My Team")
    my_team = get_my_team(student1_token)
    
    if not my_team:
        print("\n❌ Failed to get my team")
        sys.exit(1)
    
    # Test 7: Add team member
    print_section("Test 7: Add Team Member")
    
    # Get student3's user ID
    if "student3" in test_users:
        student3_id = test_users["student3"]["id"]
    else:
        # Try to get it from login response
        me_response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {student3_token}"}
        )
        if me_response.status_code == 200:
            student3_id = me_response.json()["id"]
        else:
            print("\n❌ Cannot get student3 ID")
            sys.exit(1)
    
    if not add_team_member(team1_id, student3_id, student1_token):
        print("\n❌ Failed to add team member")
        sys.exit(1)
    
    # Test 8: Get team stats
    print_section("Test 8: Get Team Statistics")
    if not get_team_stats(team1_id):
        print("\n❌ Failed to get team stats")
        sys.exit(1)
    
    # Test 9: Verify updated team has 2 members
    print_section("Test 9: Verify Team Members")
    updated_team = get_team(team1_id)
    
    if updated_team and len(updated_team.get('members', [])) == 2:
        print(f"  ✓ Team now has 2 members as expected")
    else:
        print(f"  ✗ Team member count mismatch")
        sys.exit(1)
    
    # Summary
    print_section("✅ Test Summary")
    print("All team management tests completed successfully!")
    print("\n📊 Tested endpoints:")
    print("  ✓ POST   /api/teams                    - Create team")
    print("  ✓ GET    /api/teams                    - List teams")
    print("  ✓ GET    /api/teams/{id}               - Get team details")
    print("  ✓ PUT    /api/teams/{id}               - Update team")
    print("  ✓ GET    /api/teams/my-team            - Get my team")
    print("  ✓ POST   /api/teams/{id}/members       - Add team member")
    print("  ✓ GET    /api/teams/{id}/stats         - Get team stats")
    print("\n🎉 Team Management API is fully functional!")


if __name__ == "__main__":
    main()
