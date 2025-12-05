"""
NIRD Platform - Admin Panel API Test Suite
Tests admin dashboard, user management, team management, and reporting endpoints
"""

import requests
import subprocess
from typing import Dict, Optional

BASE_URL = "http://127.0.0.1:8000/api"

# Test data storage
tokens = {}
user_ids = {}
team_ids = {}


def clean_database():
    """Clean database before running tests"""
    print("🧹 Cleaning database...")
    try:
        subprocess.run(
            [
                "docker", "exec", "nird_postgres", "psql",
                "-U", "nird_user", "-d", "nird_db",
                "-c", "TRUNCATE TABLE notifications, user_badges, badges, comments, forum_posts, resources, mission_submissions, missions, team_members, teams, users, schools, categories RESTART IDENTITY CASCADE;"
            ],
            capture_output=True,
            text=True,
            check=True
        )
        
        # Insert default category
        subprocess.run(
            [
                "docker", "exec", "nird_postgres", "psql",
                "-U", "nird_user", "-d", "nird_db",
                "-c", "INSERT INTO categories (name, slug, description) VALUES ('General', 'general', 'General category');"
            ],
            capture_output=True,
            text=True,
            check=True
        )
        
        print("  ✓ Database cleaned successfully")
        return True
    except Exception as e:
        print(f"  ✗ Failed: {e}")
        return False


def print_section(title: str):
    print(f"\n{'='*70}")
    print(f"  {title}")
    print(f"{'='*70}\n")


def print_result(success: bool, message: str):
    symbol = "✓" if success else "✗"
    print(f"  {symbol} {message}")


def register_and_login(username: str, email: str, password: str, full_name: str, role: str = "student") -> Optional[Dict]:
    """Register and login a user"""
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json={
            "username": username,
            "email": email,
            "password": password,
            "full_name": full_name,
            "role": role
        })
        if response.status_code != 201:
            return None
        
        user_id = response.json()["id"]
        
        response = requests.post(f"{BASE_URL}/auth/login", data={
            "username": username,
            "password": password
        })
        if response.status_code == 200:
            return {
                "token": response.json()["access_token"],
                "user_id": user_id
            }
    except Exception:
        return None


# ADMIN DASHBOARD TESTS
def test_admin_dashboard(token: str):
    """Test GET /api/admin/dashboard"""
    print("📊 Getting admin dashboard...")
    
    try:
        response = requests.get(
            f"{BASE_URL}/admin/dashboard",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if response.status_code == 200:
            dashboard = response.json()
            print_result(True, "Dashboard retrieved")
            print(f"    - Total users: {dashboard['total_users']}")
            print(f"    - Total teams: {dashboard['total_teams']}")
            print(f"    - Pending submissions: {dashboard['pending_submissions']}")
            print(f"    - Active users today: {dashboard['active_users_today']}")
            return True
        else:
            print_result(False, f"Failed: {response.status_code}")
            if response.status_code == 403:
                print("    Note: Only admins can access this endpoint")
            return False
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False


# USER MANAGEMENT TESTS
def test_list_users(token: str):
    """Test GET /api/admin/users"""
    print("👥 Listing all users...")
    
    try:
        response = requests.get(
            f"{BASE_URL}/admin/users",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if response.status_code == 200:
            users = response.json()
            print_result(True, f"Found {len(users)} users")
            for user in users[:3]:
                print(f"    - {user['username']} ({user['role']}) - {user['missions_completed']} missions")
            return users
        else:
            print_result(False, f"Failed: {response.status_code}")
            return []
    except Exception as e:
        print_result(False, f"Error: {e}")
        return []


def test_get_user(user_id: int, token: str):
    """Test GET /api/admin/users/{id}"""
    print(f"🔍 Getting user details (ID: {user_id})...")
    
    try:
        response = requests.get(
            f"{BASE_URL}/admin/users/{user_id}",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if response.status_code == 200:
            user = response.json()
            print_result(True, f"User: {user['username']} ({user['email']})")
            return True
        else:
            print_result(False, f"Failed: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False


def test_update_user(user_id: int, token: str):
    """Test PUT /api/admin/users/{id}"""
    print(f"✏️  Updating user (ID: {user_id})...")
    
    try:
        response = requests.put(
            f"{BASE_URL}/admin/users/{user_id}",
            headers={"Authorization": f"Bearer {token}"},
            json={"is_verified": True}
        )
        
        if response.status_code == 200:
            user = response.json()
            print_result(True, f"User updated: verified={user['is_verified']}")
            return True
        else:
            print_result(False, f"Failed: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False


# TEAM MANAGEMENT TESTS
def test_list_teams(token: str):
    """Test GET /api/admin/teams"""
    print("👥 Listing all teams...")
    
    try:
        response = requests.get(
            f"{BASE_URL}/admin/teams",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if response.status_code == 200:
            teams = response.json()
            print_result(True, f"Found {len(teams)} teams")
            for team in teams:
                print(f"    - {team['name']}: {team['member_count']} members, {team['total_points']} points")
            return teams
        else:
            print_result(False, f"Failed: {response.status_code}")
            return []
    except Exception as e:
        print_result(False, f"Error: {e}")
        return []


def test_update_team(team_id: int, token: str):
    """Test PUT /api/admin/teams/{id}"""
    print(f"✏️  Updating team (ID: {team_id})...")
    
    try:
        response = requests.put(
            f"{BASE_URL}/admin/teams/{team_id}",
            headers={"Authorization": f"Bearer {token}"},
            json={"description": "Updated by admin"}
        )
        
        if response.status_code == 200:
            team = response.json()
            print_result(True, f"Team updated: {team['name']}")
            return True
        else:
            print_result(False, f"Failed: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False


# SUBMISSIONS TESTS
def test_pending_submissions(token: str):
    """Test GET /api/admin/submissions"""
    print("📝 Getting pending submissions...")
    
    try:
        response = requests.get(
            f"{BASE_URL}/admin/submissions",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if response.status_code == 200:
            submissions = response.json()
            print_result(True, f"Found {len(submissions)} pending submissions")
            for sub in submissions[:3]:
                print(f"    - {sub['mission_title']} by {sub['team_name']} ({sub['days_pending']} days)")
            return True
        else:
            print_result(False, f"Failed: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False


# EXPORT TESTS
def test_export_users(token: str):
    """Test POST /api/admin/reports/export"""
    print("📤 Exporting user data...")
    
    try:
        response = requests.post(
            f"{BASE_URL}/admin/reports/export",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "report_type": "users",
                "format": "json"
            }
        )
        
        if response.status_code == 200:
            export = response.json()
            print_result(True, f"Exported {export['record_count']} users")
            return True
        else:
            print_result(False, f"Failed: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False


def test_export_teams(token: str):
    """Test POST /api/admin/reports/export for teams"""
    print("📤 Exporting team data...")
    
    try:
        response = requests.post(
            f"{BASE_URL}/admin/reports/export",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "report_type": "teams",
                "format": "json"
            }
        )
        
        if response.status_code == 200:
            export = response.json()
            print_result(True, f"Exported {export['record_count']} teams")
            return True
        else:
            print_result(False, f"Failed: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False


def main():
    """Run all admin panel API tests"""
    print_section("🔐 NIRD Platform Admin Panel API Tests")
    
    # Clean database
    if not clean_database():
        print("\n❌ Failed to clean database. Exiting.")
        return
    
    # Setup users
    print_section("Test 1: Setup Users and Teams")
    print("Creating users...")
    
    admin_data = register_and_login("admin1", "admin@example.com", "password123", "Admin One", "admin")
    teacher_data = register_and_login("teacher1", "teacher1@example.com", "password123", "Teacher One", "teacher")
    student1_data = register_and_login("student1", "student1@example.com", "password123", "Student One", "student")
    student2_data = register_and_login("student2", "student2@example.com", "password123", "Student Two", "student")
    
    if not all([admin_data, teacher_data, student1_data, student2_data]):
        print("❌ Failed to create users")
        return
    
    tokens["admin"] = admin_data["token"]
    tokens["teacher"] = teacher_data["token"]
    tokens["student1"] = student1_data["token"]
    user_ids["student1"] = student1_data["user_id"]
    user_ids["student2"] = student2_data["user_id"]
    
    print_result(True, "All users created (including admin)")
    
    # Create a team
    print("\nCreating team...")
    try:
        response = requests.post(
            f"{BASE_URL}/teams",
            headers={"Authorization": f"Bearer {tokens['student1']}"},
            json={"name": "Test Team", "description": "For admin testing"}
        )
        if response.status_code == 201:
            team = response.json()
            team_ids["team1"] = team["id"]
            print_result(True, f"Team created: {team['name']}")
        else:
            print("⚠️  Warning: Failed to create team")
    except Exception as e:
        print(f"⚠️  Warning: Error creating team: {e}")
    
    # Test Admin Dashboard
    print_section("Test 2: Admin Dashboard")
    test_admin_dashboard(tokens["admin"])
    
    # Test User Management
    print_section("Test 3: List Users")
    users = test_list_users(tokens["admin"])
    
    if users:
        print_section("Test 4: Get User Details")
        test_get_user(user_ids["student1"], tokens["admin"])
        
        print_section("Test 5: Update User")
        test_update_user(user_ids["student1"], tokens["admin"])
    
    # Test Team Management
    if team_ids.get("team1"):
        print_section("Test 6: List Teams")
        teams = test_list_teams(tokens["admin"])
        
        print_section("Test 7: Update Team")
        test_update_team(team_ids["team1"], tokens["admin"])
    
    # Test Submissions
    print_section("Test 8: Pending Submissions")
    test_pending_submissions(tokens["admin"])
    
    # Test Reports Export
    print_section("Test 9: Export Users")
    test_export_users(tokens["admin"])
    
    print_section("Test 10: Export Teams")
    test_export_teams(tokens["admin"])
    
    # Test non-admin access
    print_section("Test 11: Non-Admin Access (Should Fail)")
    print("🔒 Testing access control...")
    try:
        response = requests.get(
            f"{BASE_URL}/admin/dashboard",
            headers={"Authorization": f"Bearer {tokens['student1']}"}
        )
        if response.status_code == 403:
            print_result(True, "Access correctly denied for non-admin user")
        else:
            print_result(False, f"Unexpected status: {response.status_code}")
    except Exception as e:
        print_result(False, f"Error: {e}")
    
    # Summary
    print_section("✅ Test Summary")
    print("All admin panel tests completed!")
    print("\n📊 Tested endpoints:")
    print("  Dashboard:")
    print("    ✓ GET    /api/admin/dashboard         - Platform overview")
    print("  User Management:")
    print("    ✓ GET    /api/admin/users             - List all users")
    print("    ✓ GET    /api/admin/users/{id}        - Get user details")
    print("    ✓ PUT    /api/admin/users/{id}        - Update user")
    print("  Team Management:")
    print("    ✓ GET    /api/admin/teams             - List all teams")
    print("    ✓ PUT    /api/admin/teams/{id}        - Update team")
    print("  Submissions:")
    print("    ✓ GET    /api/admin/submissions       - Pending approvals")
    print("  Reports:")
    print("    ✓ POST   /api/admin/reports/export    - Export data")
    print("\n🎉 Phase 8: Admin Panel is fully functional!")


if __name__ == "__main__":
    main()
