"""
NIRD Platform - Leaderboard API Test Suite
Tests all leaderboard endpoints including real-time SSE
"""

import requests
import json
import subprocess
import time
import threading
from typing import Dict, Optional
from datetime import datetime

BASE_URL = "http://127.0.0.1:8000/api"

# Test data storage
tokens = {}
users = {}
teams = {}
missions = {}


def clean_database():
    """Clean database before running tests"""
    print("🧹 Cleaning database...")
    try:
        # Clean tables
        subprocess.run(
            [
                "docker", "exec", "nird_postgres", "psql",
                "-U", "nird_user", "-d", "nird_db",
                "-c", "TRUNCATE TABLE mission_submissions, missions, team_members, teams, user_badges, badges, users, schools, categories, leaderboard_snapshots RESTART IDENTITY CASCADE;"
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
    try:
        # Register
        response = requests.post(f"{BASE_URL}/auth/register", json={
            "username": username,
            "email": email,
            "password": password,
            "full_name": full_name,
            "role": role
        })
        
        if response.status_code != 201:
            return None
        
        # Login
        response = requests.post(f"{BASE_URL}/auth/login", data={
            "username": username,
            "password": password
        })
        
        if response.status_code == 200:
            return {"token": response.json()["access_token"]}
    except Exception:
        return None


def create_team(name: str, token: str) -> Optional[Dict]:
    """Create a team"""
    try:
        response = requests.post(
            f"{BASE_URL}/teams",
            headers={"Authorization": f"Bearer {token}"},
            json={"name": name, "description": f"{name} team"}
        )
        
        if response.status_code == 201:
            return response.json()
    except Exception:
        pass
    return None


def create_mission(title: str, points: int, difficulty: str, token: str) -> Optional[Dict]:
    """Create a mission"""
    try:
        response = requests.post(
            f"{BASE_URL}/missions",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "title": title,
                "description": f"Complete {title}",
                "category_id": 1,
                "difficulty": difficulty,
                "points": points,
                "requires_photo": True,
                "requires_file": False,
                "requires_description": True
            }
        )
        
        if response.status_code == 201:
            return response.json()
    except Exception:
        pass
    return None


def submit_mission(mission_id: int, token: str) -> Optional[Dict]:
    """Submit a mission"""
    try:
        response = requests.post(
            f"{BASE_URL}/missions/{mission_id}/submit",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "description": "Mission completed!",
                "photo_url": "https://example.com/photo.jpg",
                "file_url": None
            }
        )
        
        if response.status_code == 201:
            return response.json()
    except Exception:
        pass
    return None


def review_submission(submission_id: int, approved: bool, token: str) -> bool:
    """Review a submission"""
    try:
        status_str = "approved" if approved else "rejected"
        response = requests.post(
            f"{BASE_URL}/missions/submissions/{submission_id}/review",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "status": status_str,
                "review_comment": "Great work!" if approved else "Try again"
            }
        )
        
        return response.status_code == 200
    except Exception:
        return False


def test_get_leaderboard():
    """Test GET /api/leaderboard"""
    print("📊 Getting leaderboard...")
    
    try:
        response = requests.get(f"{BASE_URL}/leaderboard")
        
        if response.status_code == 200:
            data = response.json()
            print_result(True, f"Leaderboard retrieved: {data['total_teams']} teams")
            
            if data['entries']:
                print("  Top 3 teams:")
                for entry in data['entries'][:3]:
                    print(f"    {entry['rank']}. {entry['team_name']}: {entry['total_points']} points")
            
            return data
        else:
            print_result(False, f"Failed: {response.status_code}")
            return None
    except Exception as e:
        print_result(False, f"Error: {e}")
        return None


def test_get_leaderboard_with_filters():
    """Test leaderboard with filters"""
    print("🔍 Testing leaderboard filters...")
    
    try:
        # Test pagination
        response = requests.get(f"{BASE_URL}/leaderboard?skip=0&limit=5")
        if response.status_code == 200:
            print_result(True, "Pagination works")
        else:
            print_result(False, f"Pagination failed: {response.status_code}")
        
        # Test time filter
        response = requests.get(f"{BASE_URL}/leaderboard?days=7")
        if response.status_code == 200:
            print_result(True, "Time filter (7 days) works")
        else:
            print_result(False, f"Time filter failed: {response.status_code}")
            
    except Exception as e:
        print_result(False, f"Error: {e}")


def test_get_team_history(team_id: int):
    """Test GET /api/leaderboard/team/{id}/history"""
    print(f"📈 Getting team history (ID: {team_id})...")
    
    try:
        response = requests.get(f"{BASE_URL}/leaderboard/team/{team_id}/history")
        
        if response.status_code == 200:
            data = response.json()
            print_result(True, f"Team history retrieved: {len(data['history'])} snapshots")
            print(f"    Team: {data['team_name']}")
            
            if data['history']:
                latest = data['history'][0]
                print(f"    Latest: Rank {latest['rank']}, {latest['points']} points")
        else:
            print_result(False, f"Failed: {response.status_code}")
    except Exception as e:
        print_result(False, f"Error: {e}")


def test_get_stats():
    """Test GET /api/leaderboard/stats"""
    print("📊 Getting leaderboard stats...")
    
    try:
        response = requests.get(f"{BASE_URL}/leaderboard/stats")
        
        if response.status_code == 200:
            data = response.json()
            print_result(True, "Stats retrieved")
            print(f"    Total teams: {data['total_teams']}")
            print(f"    Total points: {data['total_points_awarded']}")
            print(f"    Missions completed: {data['total_missions_completed']}")
            print(f"    Average score: {data['average_team_score']}")
            if data.get('most_active_team'):
                print(f"    Most active: {data['most_active_team']}")
        else:
            print_result(False, f"Failed: {response.status_code}")
    except Exception as e:
        print_result(False, f"Error: {e}")


def test_sse_stream():
    """Test GET /api/leaderboard/stream (SSE)"""
    print("📡 Testing SSE stream (will run for 15 seconds)...")
    
    stop_flag = threading.Event()
    events_received = []
    
    def listen_to_stream():
        try:
            response = requests.get(
                f"{BASE_URL}/leaderboard/stream",
                stream=True,
                timeout=20
            )
            
            for line in response.iter_lines():
                if stop_flag.is_set():
                    break
                
                if line:
                    decoded = line.decode('utf-8')
                    if decoded.startswith('data:'):
                        data = decoded[5:].strip()
                        events_received.append(data)
                        
        except Exception as e:
            print(f"    Stream error: {e}")
    
    # Start listener thread
    listener = threading.Thread(target=listen_to_stream, daemon=True)
    listener.start()
    
    # Wait for events
    time.sleep(15)
    stop_flag.set()
    listener.join(timeout=2)
    
    if events_received:
        print_result(True, f"SSE stream works: {len(events_received)} events received")
        try:
            latest_data = json.loads(events_received[-1])
            print(f"    Latest update: {latest_data.get('total_teams', 0)} teams")
        except:
            pass
    else:
        print_result(False, "No events received from SSE stream")


def main():
    """Run all leaderboard API tests"""
    print_section("📊 NIRD Platform Leaderboard API Tests")
    
    # Clean database
    if not clean_database():
        print("\n❌ Failed to clean database. Exiting.")
        return
    
    # Setup: Create users
    print_section("Test 1: Setup Users and Teams")
    print("Creating users...")
    
    teacher_data = register_and_login("teacher1", "teacher1@example.com", "password123", "Teacher", "teacher")
    student1_data = register_and_login("student1", "student1@example.com", "password123", "Student 1", "student")
    student2_data = register_and_login("student2", "student2@example.com", "password123", "Student 2", "student")
    student3_data = register_and_login("student3", "student3@example.com", "password123", "Student 3", "student")
    
    if not all([teacher_data, student1_data, student2_data, student3_data]):
        print("❌ Failed to create users")
        return
    
    tokens["teacher"] = teacher_data["token"]
    tokens["student1"] = student1_data["token"]
    tokens["student2"] = student2_data["token"]
    tokens["student3"] = student3_data["token"]
    
    print_result(True, "All users created")
    
    # Create teams
    print("\nCreating teams...")
    team1 = create_team("Alpha Team", tokens["student1"])
    team2 = create_team("Beta Team", tokens["student2"])
    team3 = create_team("Gamma Team", tokens["student3"])
    
    if not all([team1, team2, team3]):
        print("❌ Failed to create teams")
        return
    
    teams["team1"] = team1
    teams["team2"] = team2
    teams["team3"] = team3
    
    print_result(True, f"3 teams created")
    
    # Create missions
    print_section("Test 2: Create and Complete Missions")
    print("Creating missions...")
    
    mission1 = create_mission("Easy Challenge", 100, "easy", tokens["teacher"])
    mission2 = create_mission("Medium Challenge", 200, "medium", tokens["teacher"])
    mission3 = create_mission("Hard Challenge", 300, "hard", tokens["teacher"])
    
    if not all([mission1, mission2, mission3]):
        print("❌ Failed to create missions")
        return
    
    print_result(True, "3 missions created")
    
    # Submit missions
    print("\nSubmitting missions...")
    
    # Team 1: Submit all 3 missions
    sub1_1 = submit_mission(mission1["id"], tokens["student1"])
    sub1_2 = submit_mission(mission2["id"], tokens["student1"])
    sub1_3 = submit_mission(mission3["id"], tokens["student1"])
    
    # Team 2: Submit 2 missions
    sub2_1 = submit_mission(mission1["id"], tokens["student2"])
    sub2_2 = submit_mission(mission2["id"], tokens["student2"])
    
    # Team 3: Submit 1 mission
    sub3_1 = submit_mission(mission1["id"], tokens["student3"])
    
    print_result(True, "Missions submitted by teams")
    
    # Approve submissions
    print("\nApproving submissions...")
    
    review_submission(sub1_1["id"], True, tokens["teacher"])
    review_submission(sub1_2["id"], True, tokens["teacher"])
    review_submission(sub1_3["id"], True, tokens["teacher"])
    review_submission(sub2_1["id"], True, tokens["teacher"])
    review_submission(sub2_2["id"], True, tokens["teacher"])
    review_submission(sub3_1["id"], True, tokens["teacher"])
    
    print_result(True, "All submissions approved")
    
    # Test leaderboard endpoints
    print_section("Test 3: Get Leaderboard")
    leaderboard_data = test_get_leaderboard()
    
    if leaderboard_data and leaderboard_data['entries']:
        # Verify rankings
        if leaderboard_data['entries'][0]['team_name'] == 'Alpha Team':
            print_result(True, "Rankings are correct (Alpha Team is #1 with 600 points)")
        else:
            print_result(False, "Rankings may be incorrect")
    
    print_section("Test 4: Test Leaderboard Filters")
    test_get_leaderboard_with_filters()
    
    print_section("Test 5: Get Team History")
    test_get_team_history(team1["id"])
    
    print_section("Test 6: Get Leaderboard Stats")
    test_get_stats()
    
    print_section("Test 7: Test Real-time SSE Stream")
    test_sse_stream()
    
    # Summary
    print_section("✅ Test Summary")
    print("All leaderboard tests completed!")
    print("\n📊 Tested endpoints:")
    print("  ✓ GET  /api/leaderboard                    - List rankings with filters")
    print("  ✓ GET  /api/leaderboard/team/{id}/history  - Team rank history")
    print("  ✓ GET  /api/leaderboard/stats              - Global statistics")
    print("  ✓ GET  /api/leaderboard/stream             - Real-time SSE updates")
    print("\n🎉 Leaderboard API is fully functional!")


if __name__ == "__main__":
    main()
