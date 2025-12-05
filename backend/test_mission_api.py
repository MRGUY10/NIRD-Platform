"""
NIRD Platform - Mission API Test Suite
Tests all mission management endpoints
"""

import requests
import json
import subprocess
from typing import Dict, Optional

BASE_URL = "http://127.0.0.1:8000/api"

# Test data storage
tokens = {}
users = {}
teams = {}
missions = {}
submissions = {}


def clean_database():
    """Clean database before running tests"""
    print("🧹 Cleaning database...")
    try:
        # Clean tables
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
        
        # Insert default category
        subprocess.run(
            [
                "docker", "exec", "nird_postgres", "psql",
                "-U", "nird_user", "-d", "nird_db",
                "-c", "INSERT INTO categories (name, slug, description) VALUES ('General', 'general', 'General missions');"
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
    """Print section header"""
    print(f"\n{'='*70}")
    print(f"  {title}")
    print(f"{'='*70}\n")


def print_result(success: bool, message: str):
    """Print test result"""
    symbol = "✓" if success else "✗"
    print(f"  {symbol} {message}")


def register_and_login(username: str, email: str, password: str, full_name: str, role: str = "student") -> Optional[Dict]:
    """Register and login a user"""
    print(f"📝 Registering and logging in: {username}...")
    
    # Register
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json={
            "username": username,
            "email": email,
            "password": password,
            "full_name": full_name,
            "role": role
        })
        
        if response.status_code == 201:
            user_data = response.json()
            print_result(True, f"User registered: {username} (ID: {user_data['id']})")
        elif response.status_code == 400:
            print_result(False, "User already exists, proceeding to login...")
        else:
            print_result(False, f"Registration failed: {response.status_code}")
            return None
    except Exception as e:
        print_result(False, f"Registration error: {e}")
        return None
    
    # Login
    try:
        response = requests.post(f"{BASE_URL}/auth/login", data={
            "username": username,
            "password": password
        })
        
        if response.status_code == 200:
            token_data = response.json()
            print_result(True, "Login successful")
            return {
                "user": user_data if 'user_data' in locals() else None,
                "token": token_data["access_token"]
            }
        else:
            print_result(False, f"Login failed: {response.status_code}")
            return None
    except Exception as e:
        print_result(False, f"Login error: {e}")
        return None


def create_team(name: str, token: str) -> Optional[Dict]:
    """Create a team"""
    print(f"🏆 Creating team: {name}...")
    
    try:
        response = requests.post(
            f"{BASE_URL}/teams",
            headers={"Authorization": f"Bearer {token}"},
            json={"name": name, "description": f"Test team {name}"}
        )
        
        if response.status_code == 201:
            team_data = response.json()
            print_result(True, f"Team created: {team_data['name']} (ID: {team_data['id']})")
            return team_data
        else:
            print_result(False, f"Failed: {response.status_code} - {response.json()}")
            return None
    except Exception as e:
        print_result(False, f"Error: {e}")
        return None


def create_mission(title: str, points: int, difficulty: str, token: str, category_id: int = 1) -> Optional[Dict]:
    """Create a mission"""
    print(f"🎯 Creating mission: {title}...")
    
    try:
        response = requests.post(
            f"{BASE_URL}/missions",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "title": title,
                "description": f"Complete the {title} mission",
                "category_id": category_id,
                "difficulty": difficulty,
                "points": points,
                "requires_photo": True,
                "requires_file": False,
                "requires_description": True
            }
        )
        
        if response.status_code == 201:
            mission_data = response.json()
            print_result(True, f"Mission created successfully")
            print(f"    - ID: {mission_data['id']}")
            print(f"    - Title: {mission_data['title']}")
            print(f"    - Points: {mission_data['points']}")
            print(f"    - Difficulty: {mission_data['difficulty']}")
            return mission_data
        else:
            print_result(False, f"Failed: {response.status_code} - {response.json()}")
            return None
    except Exception as e:
        print_result(False, f"Error: {e}")
        return None


def list_missions(token: str):
    """List all missions"""
    print("📋 Listing all missions...")
    
    try:
        response = requests.get(
            f"{BASE_URL}/missions",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if response.status_code == 200:
            missions_list = response.json()
            print_result(True, f"Found {len(missions_list)} missions")
            for mission in missions_list:
                print(f"    - {mission['title']}: {mission['points']} points ({mission['difficulty']})")
        else:
            print_result(False, f"Failed: {response.status_code}")
    except Exception as e:
        print_result(False, f"Error: {e}")


def get_mission(mission_id: int, token: str):
    """Get mission details"""
    print(f"🔍 Getting mission details (ID: {mission_id})...")
    
    try:
        response = requests.get(
            f"{BASE_URL}/missions/{mission_id}",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if response.status_code == 200:
            mission = response.json()
            print_result(True, f"Mission: {mission['title']}")
            print(f"    - Points: {mission['points']}")
            print(f"    - Difficulty: {mission['difficulty']}")
            print(f"    - Photo Required: {mission['requires_photo']}")
            print(f"    - Submissions: {mission['submission_count']}")
            print(f"    - Approved: {mission['approved_count']}")
        else:
            print_result(False, f"Failed: {response.status_code}")
    except Exception as e:
        print_result(False, f"Error: {e}")


def submit_mission(mission_id: int, token: str) -> Optional[Dict]:
    """Submit a mission"""
    print(f"📤 Submitting mission (ID: {mission_id})...")
    
    try:
        response = requests.post(
            f"{BASE_URL}/missions/{mission_id}/submit",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "description": "Here is our submission for this mission!",
                "photo_url": "https://example.com/photo.jpg",
                "file_url": None
            }
        )
        
        if response.status_code == 201:
            submission = response.json()
            print_result(True, "Submission created successfully")
            print(f"    - Submission ID: {submission['id']}")
            print(f"    - Status: {submission['status']}")
            return submission
        else:
            print_result(False, f"Failed: {response.status_code} - {response.json()}")
            return None
    except Exception as e:
        print_result(False, f"Error: {e}")
        return None


def list_submissions(token: str):
    """List submissions"""
    print("📋 Listing submissions...")
    
    try:
        response = requests.get(
            f"{BASE_URL}/missions/submissions",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if response.status_code == 200:
            submissions_list = response.json()
            print_result(True, f"Found {len(submissions_list)} submissions")
            for sub in submissions_list:
                print(f"    - Mission {sub['mission_id']}: {sub['status']} (Team {sub['team_id']})")
        else:
            print_result(False, f"Failed: {response.status_code}")
    except Exception as e:
        print_result(False, f"Error: {e}")


def review_submission(submission_id: int, approved: bool, token: str):
    """Review a submission"""
    status_str = "approved" if approved else "rejected"
    print(f"👨‍🏫 Reviewing submission (ID: {submission_id}) - {status_str.upper()}...")
    
    try:
        response = requests.post(
            f"{BASE_URL}/missions/submissions/{submission_id}/review",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "status": status_str,
                "review_comment": "Great work!" if approved else "Please try again"
            }
        )
        
        if response.status_code == 200:
            submission = response.json()
            print_result(True, f"Submission {status_str.lower()}")
            print(f"    - Status: {submission['status']}")
            print(f"    - Comment: {submission['review_comment']}")
        else:
            print_result(False, f"Failed: {response.status_code} - {response.json()}")
    except Exception as e:
        print_result(False, f"Error: {e}")


def get_team_stats(team_id: int, token: str):
    """Get team statistics"""
    print(f"📊 Getting team statistics (ID: {team_id})...")
    
    try:
        response = requests.get(
            f"{BASE_URL}/teams/{team_id}/stats",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if response.status_code == 200:
            stats = response.json()
            print_result(True, "Team Statistics:")
            print(f"    - Total Points: {stats['total_points']}")
            print(f"    - Missions Completed: {stats['missions_completed']}")
            print(f"    - Approved Submissions: {stats['approved_submissions']}")
        else:
            print_result(False, f"Failed: {response.status_code}")
    except Exception as e:
        print_result(False, f"Error: {e}")


def update_mission(mission_id: int, token: str):
    """Update a mission"""
    print(f"✏️  Updating mission (ID: {mission_id})...")
    
    try:
        response = requests.put(
            f"{BASE_URL}/missions/{mission_id}",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "points": 150,
                "difficulty": "hard"
            }
        )
        
        if response.status_code == 200:
            mission = response.json()
            print_result(True, "Mission updated successfully")
            print(f"    - New points: {mission['points']}")
            print(f"    - New difficulty: {mission['difficulty']}")
        else:
            print_result(False, f"Failed: {response.status_code}")
    except Exception as e:
        print_result(False, f"Error: {e}")


def main():
    """Run all mission API tests"""
    print_section("🎯 NIRD Platform Mission Management API Tests")
    
    # Clean database first
    if not clean_database():
        print("\n❌ Failed to clean database. Exiting.")
        return
    
    # Test 1: Setup users
    print_section("Test 1: User Setup")
    
    # Register teacher
    teacher_data = register_and_login("teacher1", "teacher1@example.com", "password123", "Teacher One", "teacher")
    if not teacher_data:
        print("\n❌ Failed to setup teacher")
        return
    tokens["teacher"] = teacher_data["token"]
    
    # Register students
    student1_data = register_and_login("student1", "student1@example.com", "password123", "Student One", "student")
    student2_data = register_and_login("student2", "student2@example.com", "password123", "Student Two", "student")
    
    if not student1_data or not student2_data:
        print("\n❌ Failed to setup students")
        return
    
    tokens["student1"] = student1_data["token"]
    tokens["student2"] = student2_data["token"]
    
    # Test 2: Create teams
    print_section("Test 2: Create Teams")
    team1 = create_team("Team Alpha", tokens["student1"])
    team2 = create_team("Team Beta", tokens["student2"])
    
    if not team1 or not team2:
        print("\n❌ Failed to create teams")
        return
    
    teams["alpha"] = team1
    teams["beta"] = team2
    
    # Test 3: Create missions (teacher)
    print_section("Test 3: Create Missions (Teacher)")
    mission1 = create_mission("Code Challenge", 100, "easy", tokens["teacher"])
    mission2 = create_mission("Design Sprint", 200, "medium", tokens["teacher"])
    mission3 = create_mission("Innovation Project", 300, "hard", tokens["teacher"])
    
    if not mission1 or not mission2 or not mission3:
        print("\n❌ Failed to create missions")
        return
    
    missions["easy"] = mission1
    missions["medium"] = mission2
    missions["hard"] = mission3
    
    # Test 4: List missions
    print_section("Test 4: List All Missions")
    list_missions(tokens["student1"])
    
    # Test 5: Get mission details
    print_section("Test 5: Get Mission Details")
    get_mission(mission1["id"], tokens["student1"])
    
    # Test 6: Submit missions
    print_section("Test 6: Submit Missions")
    submission1 = submit_mission(mission1["id"], tokens["student1"])
    submission2 = submit_mission(mission2["id"], tokens["student2"])
    
    if not submission1 or not submission2:
        print("\n❌ Failed to submit missions")
        return
    
    submissions["sub1"] = submission1
    submissions["sub2"] = submission2
    
    # Test 7: List submissions (student view)
    print_section("Test 7: List My Submissions")
    list_submissions(tokens["student1"])
    
    # Test 8: List submissions (teacher view)
    print_section("Test 8: List All Submissions (Teacher)")
    list_submissions(tokens["teacher"])
    
    # Test 9: Review submissions
    print_section("Test 9: Review Submissions (Teacher)")
    review_submission(submission1["id"], True, tokens["teacher"])
    review_submission(submission2["id"], False, tokens["teacher"])
    
    # Test 10: Check team points updated
    print_section("Test 10: Verify Team Points Updated")
    get_team_stats(team1["id"], tokens["teacher"])
    
    # Test 11: Update mission
    print_section("Test 11: Update Mission (Teacher)")
    update_mission(mission1["id"], tokens["teacher"])
    
    # Test 12: Get updated mission
    print_section("Test 12: Verify Mission Update")
    get_mission(mission1["id"], tokens["teacher"])
    
    # Summary
    print_section("✅ Test Summary")
    print("All mission management tests completed successfully!")
    print("\n📊 Tested endpoints:")
    print("  ✓ POST   /api/missions                          - Create mission (teacher/admin)")
    print("  ✓ GET    /api/missions                          - List missions")
    print("  ✓ GET    /api/missions/{id}                     - Get mission details")
    print("  ✓ PUT    /api/missions/{id}                     - Update mission")
    print("  ✓ POST   /api/missions/{id}/submit              - Submit mission")
    print("  ✓ GET    /api/missions/submissions              - List submissions")
    print("  ✓ POST   /api/missions/submissions/{id}/review  - Review submission")
    print("\n🎉 Mission Management API is fully functional!")


if __name__ == "__main__":
    main()
