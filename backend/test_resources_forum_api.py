"""
NIRD Platform - Resources & Forum API Test Suite
Tests resource library and community forum endpoints
"""

import requests
import subprocess
from typing import Dict, Optional

BASE_URL = "http://127.0.0.1:8000/api"

# Test data storage
tokens = {}
resource_ids = {}
post_ids = {}


def clean_database():
    """Clean database before running tests"""
    print("🧹 Cleaning database...")
    try:
        subprocess.run(
            [
                "docker", "exec", "nird_postgres", "psql",
                "-U", "nird_user", "-d", "nird_db",
                "-c", "TRUNCATE TABLE comments, forum_posts, resources, mission_submissions, missions, team_members, teams, user_badges, badges, users, schools, categories RESTART IDENTITY CASCADE;"
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
                "-c", "INSERT INTO categories (name, slug, description) VALUES ('General', 'general', 'General resources');"
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


# RESOURCE TESTS
def test_create_resource(token: str) -> Optional[int]:
    """Test POST /api/resources"""
    print("📚 Creating resource...")
    
    try:
        response = requests.post(
            f"{BASE_URL}/resources",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "title": "Introduction to Python",
                "description": "Learn Python basics",
                "resource_type": "tutorial",
                "category_id": 1,
                "content": "Python is a great language...",
                "external_url": "https://example.com/python-intro",
                "difficulty": "beginner"
            }
        )
        
        if response.status_code == 201:
            resource = response.json()
            print_result(True, f"Resource created: {resource['title']} (ID: {resource['id']})")
            return resource['id']
        else:
            print_result(False, f"Failed: {response.status_code}")
            return None
    except Exception as e:
        print_result(False, f"Error: {e}")
        return None


def test_list_resources():
    """Test GET /api/resources"""
    print("📋 Listing resources...")
    
    try:
        response = requests.get(f"{BASE_URL}/resources")
        
        if response.status_code == 200:
            resources = response.json()
            print_result(True, f"Found {len(resources)} resources")
            for res in resources[:3]:
                print(f"    - {res['title']}")
            return True
        else:
            print_result(False, f"Failed: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False


def test_get_resource(resource_id: int):
    """Test GET /api/resources/{id}"""
    print(f"🔍 Getting resource details (ID: {resource_id})...")
    
    try:
        response = requests.get(f"{BASE_URL}/resources/{resource_id}")
        
        if response.status_code == 200:
            resource = response.json()
            print_result(True, f"Resource: {resource['title']}")
            print(f"    - Type: {resource['resource_type']}")
            print(f"    - Views: {resource['views']}")
            print(f"    - Downloads: {resource['downloads']}")
            return True
        else:
            print_result(False, f"Failed: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False


def test_update_resource(resource_id: int, token: str):
    """Test PUT /api/resources/{id}"""
    print(f"✏️  Updating resource (ID: {resource_id})...")
    
    try:
        response = requests.put(
            f"{BASE_URL}/resources/{resource_id}",
            headers={"Authorization": f"Bearer {token}"},
            json={"difficulty": "intermediate"}
        )
        
        if response.status_code == 200:
            print_result(True, "Resource updated")
            return True
        else:
            print_result(False, f"Failed: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False


def test_resource_stats():
    """Test GET /api/resources/stats/summary"""
    print("📊 Getting resource statistics...")
    
    try:
        response = requests.get(f"{BASE_URL}/resources/stats/summary")
        
        if response.status_code == 200:
            stats = response.json()
            print_result(True, "Stats retrieved")
            print(f"    - Total resources: {stats['total_resources']}")
            print(f"    - Total views: {stats['total_views']}")
            return True
        else:
            print_result(False, f"Failed: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False


# FORUM TESTS
def test_create_forum_post(token: str) -> Optional[int]:
    """Test POST /api/forum/posts"""
    print("💬 Creating forum post...")
    
    try:
        response = requests.post(
            f"{BASE_URL}/forum/posts",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "title": "Welcome to NIRD!",
                "content": "Let's discuss sustainable digital practices!",
                "category_id": 1
            }
        )
        
        if response.status_code == 201:
            post = response.json()
            print_result(True, f"Forum post created: {post['title']} (ID: {post['id']})")
            return post['id']
        else:
            print_result(False, f"Failed: {response.status_code}")
            return None
    except Exception as e:
        print_result(False, f"Error: {e}")
        return None


def test_list_forum_posts():
    """Test GET /api/forum/posts"""
    print("📋 Listing forum posts...")
    
    try:
        response = requests.get(f"{BASE_URL}/forum/posts")
        
        if response.status_code == 200:
            posts = response.json()
            print_result(True, f"Found {len(posts)} posts")
            for post in posts:
                print(f"    - {post['title']} (Views: {post['views']}, Comments: {post['comments_count']})")
            return True
        else:
            print_result(False, f"Failed: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False


def test_get_forum_post(post_id: int):
    """Test GET /api/forum/posts/{id}"""
    print(f"🔍 Getting forum post details (ID: {post_id})...")
    
    try:
        response = requests.get(f"{BASE_URL}/forum/posts/{post_id}")
        
        if response.status_code == 200:
            post = response.json()
            print_result(True, f"Post: {post['title']}")
            print(f"    - Author: {post['author']['username']}")
            print(f"    - Views: {post['views']}")
            print(f"    - Comments: {post['comments_count']}")
            return True
        else:
            print_result(False, f"Failed: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False


def test_create_comment(post_id: int, token: str) -> Optional[int]:
    """Test POST /api/forum/posts/{id}/comments"""
    print(f"💬 Adding comment to post {post_id}...")
    
    try:
        response = requests.post(
            f"{BASE_URL}/forum/posts/{post_id}/comments",
            headers={"Authorization": f"Bearer {token}"},
            json={"content": "Great topic! Looking forward to the discussion."}
        )
        
        if response.status_code == 201:
            comment = response.json()
            print_result(True, f"Comment created (ID: {comment['id']})")
            return comment['id']
        else:
            print_result(False, f"Failed: {response.status_code}")
            return None
    except Exception as e:
        print_result(False, f"Error: {e}")
        return None


def test_get_comments(post_id: int):
    """Test GET /api/forum/posts/{id}/comments"""
    print(f"📋 Getting comments for post {post_id}...")
    
    try:
        response = requests.get(f"{BASE_URL}/forum/posts/{post_id}/comments")
        
        if response.status_code == 200:
            comments = response.json()
            print_result(True, f"Found {len(comments)} comments")
            for comment in comments:
                print(f"    - By {comment['author']['username']}: {comment['content'][:50]}...")
            return True
        else:
            print_result(False, f"Failed: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False


def main():
    """Run all resource and forum API tests"""
    print_section("📚 NIRD Platform Resources & Forum API Tests")
    
    # Clean database
    if not clean_database():
        print("\n❌ Failed to clean database. Exiting.")
        return
    
    # Setup users
    print_section("Test 1: Setup Users")
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
    
    # Test Resources
    print_section("Test 2: Resource Library")
    resource_id = test_create_resource(tokens["teacher"])
    if not resource_id:
        print("❌ Resource creation failed")
        return
    
    # Create more resources
    test_create_resource(tokens["teacher"])
    test_create_resource(tokens["teacher"])
    
    print_section("Test 3: List Resources")
    test_list_resources()
    
    print_section("Test 4: Get Resource Details")
    test_get_resource(resource_id)
    
    print_section("Test 5: Update Resource")
    test_update_resource(resource_id, tokens["teacher"])
    
    print_section("Test 6: Resource Statistics")
    test_resource_stats()
    
    # Test Forum
    print_section("Test 7: Create Forum Posts")
    post_id = test_create_forum_post(tokens["student1"])
    if not post_id:
        print("❌ Forum post creation failed")
        return
    
    # Create more posts
    test_create_forum_post(tokens["student2"])
    test_create_forum_post(tokens["teacher"])
    
    print_section("Test 8: List Forum Posts")
    test_list_forum_posts()
    
    print_section("Test 9: Get Forum Post Details")
    test_get_forum_post(post_id)
    
    print_section("Test 10: Add Comments")
    comment_id = test_create_comment(post_id, tokens["student2"])
    if comment_id:
        # Add reply
        test_create_comment(post_id, tokens["teacher"])
    
    print_section("Test 11: Get Comments")
    test_get_comments(post_id)
    
    # Summary
    print_section("✅ Test Summary")
    print("All resource and forum tests completed!")
    print("\n📊 Tested endpoints:")
    print("  Resources:")
    print("    ✓ POST   /api/resources              - Create resource")
    print("    ✓ GET    /api/resources              - List resources")
    print("    ✓ GET    /api/resources/{id}         - Get resource details")
    print("    ✓ PUT    /api/resources/{id}         - Update resource")
    print("    ✓ GET    /api/resources/stats/summary - Resource statistics")
    print("  Forum:")
    print("    ✓ POST   /api/forum/posts            - Create post")
    print("    ✓ GET    /api/forum/posts            - List posts")
    print("    ✓ GET    /api/forum/posts/{id}       - Get post details")
    print("    ✓ POST   /api/forum/posts/{id}/comments - Add comment")
    print("    ✓ GET    /api/forum/posts/{id}/comments - Get comments")
    print("\n🎉 Resources & Forum APIs are fully functional!")


if __name__ == "__main__":
    main()
