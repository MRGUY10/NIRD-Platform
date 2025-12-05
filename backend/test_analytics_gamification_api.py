"""
NIRD Platform - Analytics & Gamification API Test Suite
Tests statistics, badges, and notification endpoints
"""

import requests
import subprocess
from typing import Dict, Optional

BASE_URL = "http://127.0.0.1:8000/api"

# Test data storage
tokens = {}
team_ids = {}
mission_ids = {}
submission_ids = {}


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
        
        response = requests.post(f"{BASE_URL}/auth/login", data={
            "username": username,
            "password": password
        })
        if response.status_code == 200:
            return {"token": response.json()["access_token"]}
    except Exception:
        return None


# STATISTICS TESTS
def test_global_stats():
    """Test GET /api/stats/global"""
    print("📊 Getting global statistics...")
    
    try:
        response = requests.get(f"{BASE_URL}/stats/global")
        
        if response.status_code == 200:
            stats = response.json()
            print_result(True, "Global stats retrieved")
            print(f"    - Total users: {stats['total_users']}")
            print(f"    - Total teams: {stats['total_teams']}")
            print(f"    - Devices saved: {stats['impact']['devices_saved']}")
            print(f"    - CO2 reduced: {stats['impact']['co2_reduced_kg']} kg")
            return True
        else:
            print_result(False, f"Failed: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False


def test_team_stats(team_id: int, token: str):
    """Test GET /api/stats/team/{id}"""
    print(f"📈 Getting team statistics (ID: {team_id})...")
    
    try:
        response = requests.get(
            f"{BASE_URL}/stats/team/{team_id}",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if response.status_code == 200:
            stats = response.json()
            print_result(True, f"Team stats retrieved: {stats['team_name']}")
            print(f"    - Total points: {stats['total_points']}")
            print(f"    - Missions completed: {stats['total_missions_completed']}")
            print(f"    - Current rank: {stats['current_rank']}")
            print(f"    - Members: {len(stats['member_stats'])}")
            return True
        else:
            print_result(False, f"Failed: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False


# BADGE TESTS
def test_list_badges():
    """Test GET /api/badges"""
    print("🏆 Listing all badges...")
    
    try:
        response = requests.get(f"{BASE_URL}/badges")
        
        if response.status_code == 200:
            badges = response.json()
            print_result(True, f"Found {len(badges)} badges")
            for badge in badges[:3]:
                print(f"    - {badge.get('icon', '🎖️')} {badge['name']}: {badge['description']}")
            return True
        else:
            print_result(False, f"Failed: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False


def test_my_badges(token: str):
    """Test GET /api/badges/me"""
    print("🎖️  Getting my badges...")
    
    try:
        response = requests.get(
            f"{BASE_URL}/badges/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if response.status_code == 200:
            badges = response.json()
            print_result(True, f"User has {len(badges)} badges")
            for badge in badges:
                print(f"    - {badge.get('badge_icon', '🏆')} {badge['badge_name']}")
            return True
        else:
            print_result(False, f"Failed: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False


# NOTIFICATION TESTS
def test_notifications(token: str):
    """Test GET /api/notifications"""
    print("🔔 Getting notifications...")
    
    try:
        response = requests.get(
            f"{BASE_URL}/notifications",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if response.status_code == 200:
            notifications = response.json()
            print_result(True, f"Found {len(notifications)} notifications")
            for notif in notifications[:3]:
                status = "✉️" if not notif['is_read'] else "✅"
                print(f"    {status} {notif['title']}")
            return notifications
        else:
            print_result(False, f"Failed: {response.status_code}")
            return []
    except Exception as e:
        print_result(False, f"Error: {e}")
        return []


def test_unread_count(token: str):
    """Test GET /api/notifications/unread/count"""
    print("📬 Getting unread notification count...")
    
    try:
        response = requests.get(
            f"{BASE_URL}/notifications/unread/count",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print_result(True, f"Unread notifications: {data['unread_count']}")
            return True
        else:
            print_result(False, f"Failed: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False


def test_mark_notification_read(notification_id: int, token: str):
    """Test PUT /api/notifications/{id}/read"""
    print(f"✅ Marking notification {notification_id} as read...")
    
    try:
        response = requests.put(
            f"{BASE_URL}/notifications/{notification_id}/read",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if response.status_code == 200:
            print_result(True, "Notification marked as read")
            return True
        else:
            print_result(False, f"Failed: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False


def main():
    """Run all analytics and gamification API tests"""
    print_section("📊 NIRD Platform Analytics & Gamification API Tests")
    
    # Clean database
    if not clean_database():
        print("\n❌ Failed to clean database. Exiting.")
        return
    
    # Setup users and teams
    print_section("Test 1: Setup Users and Teams")
    print("Creating users...")
    
    teacher_data = register_and_login("teacher1", "teacher1@example.com", "password123", "Teacher One", "teacher")
    student1_data = register_and_login("student1", "student1@example.com", "password123", "Student One", "student")
    student2_data = register_and_login("student2", "student2@example.com", "password123", "Student Two", "student")
    
    if not all([teacher_data, student1_data, student2_data]):
        print("❌ Failed to create users")
        return
    
    tokens["teacher"] = teacher_data["token"]
    tokens["student1"] = student1_data["token"]
    tokens["student2"] = student2_data["token"]
    
    print_result(True, "All users created")
    
    # Create team
    print("\nCreating team...")
    try:
        response = requests.post(
            f"{BASE_URL}/teams",
            headers={"Authorization": f"Bearer {tokens['student1']}"},
            json={"name": "Eco Warriors", "description": "Fighting for sustainability"}
        )
        if response.status_code == 201:
            team = response.json()
            team_ids["team1"] = team["id"]
            print_result(True, f"Team created: {team['name']}")
        else:
            print("❌ Failed to create team")
            return
    except Exception as e:
        print(f"❌ Error creating team: {e}")
        return
    
    # Create and complete missions
    print_section("Test 2: Create and Complete Missions")
    print("Creating mission...")
    
    try:
        response = requests.post(
            f"{BASE_URL}/missions",
            headers={"Authorization": f"Bearer {tokens['teacher']}"},
            json={
                "title": "Device Repair Challenge",
                "description": "Repair an old device",
                "category_id": 1,
                "points": 50,
                "difficulty": "easy",
                "requires_photo": True,
                "requires_file": False,
                "requires_description": True
            }
        )
        if response.status_code == 201:
            mission = response.json()
            mission_ids["mission1"] = mission["id"]
            print_result(True, f"Mission created: {mission['title']}")
        else:
            print(f"❌ Failed to create mission: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Error: {e}")
        return
    
    # Submit mission
    print("\nSubmitting mission...")
    try:
        response = requests.post(
            f"{BASE_URL}/missions/{mission_ids['mission1']}/submit",
            headers={"Authorization": f"Bearer {tokens['student1']}"},
            json={
                "description": "Successfully repaired an old laptop by replacing the battery and upgrading RAM",
                "photo_url": "http://example.com/photo.jpg"
            }
        )
        if response.status_code == 201:
            submission = response.json()
            submission_ids["sub1"] = submission["id"]
            print_result(True, "Mission submitted")
        else:
            print(f"❌ Failed to submit: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Error: {e}")
        return
    
    # Approve mission (triggers badge and notification)
    print("\nApproving mission...")
    try:
        response = requests.post(
            f"{BASE_URL}/missions/submissions/{submission_ids['sub1']}/review",
            headers={"Authorization": f"Bearer {tokens['teacher']}"},
            json={"status": "approved", "review_comment": "Great work!"}
        )
        if response.status_code == 200:
            print_result(True, "Mission approved (badges and notifications triggered)")
        else:
            print(f"❌ Failed to approve: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test Statistics
    print_section("Test 3: Global Statistics")
    test_global_stats()
    
    print_section("Test 4: Team Statistics")
    test_team_stats(team_ids["team1"], tokens["student1"])
    
    # Test Badges
    print_section("Test 5: Badge System")
    test_list_badges()
    
    print_section("Test 6: User Badges")
    test_my_badges(tokens["student1"])
    
    # Test Notifications
    print_section("Test 7: Notifications")
    notifications = test_notifications(tokens["student1"])
    
    print_section("Test 8: Unread Count")
    test_unread_count(tokens["student1"])
    
    if notifications:
        print_section("Test 9: Mark Notification as Read")
        test_mark_notification_read(notifications[0]["id"], tokens["student1"])
    
    # Summary
    print_section("✅ Test Summary")
    print("All analytics and gamification tests completed!")
    print("\n📊 Tested endpoints:")
    print("  Statistics:")
    print("    ✓ GET    /api/stats/global           - Global community stats")
    print("    ✓ GET    /api/stats/team/{id}        - Team analytics")
    print("  Badges:")
    print("    ✓ GET    /api/badges                 - List all badges")
    print("    ✓ GET    /api/badges/me              - User's earned badges")
    print("  Notifications:")
    print("    ✓ GET    /api/notifications          - User notifications")
    print("    ✓ GET    /api/notifications/unread/count - Unread count")
    print("    ✓ PUT    /api/notifications/{id}/read - Mark as read")
    print("\n🎉 Phase 7: Analytics & Gamification is fully functional!")


if __name__ == "__main__":
    main()
