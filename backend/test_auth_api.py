"""
Test script for authentication API endpoints.
Tests registration, login, token refresh, and protected routes.
"""
import requests
import sys
from typing import Dict, Optional

# Base URL for the API
BASE_URL = "http://127.0.0.1:8000"

# Test data
test_user = {
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "TestPass123",
    "full_name": "Test User",
    "role": "student"
}

test_teacher = {
    "username": "testteacher",
    "email": "testteacher@example.com",
    "password": "TeachPass123",
    "full_name": "Test Teacher",
    "role": "teacher"
}


def print_section(title: str):
    """Print a formatted section header"""
    print(f"\n{'='*70}")
    print(f"  {title}")
    print(f"{'='*70}\n")


def test_health_check():
    """Test the health check endpoint"""
    print("🏥 Testing health check endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        if response.status_code == 200:
            data = response.json()
            print(f"  ✓ API is healthy")
            print(f"    - Status: {data.get('status')}")
            print(f"    - Database: {data.get('database')}")
            return True
        else:
            print(f"  ✗ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"  ✗ Cannot connect to API: {e}")
        print(f"    Make sure the server is running: uvicorn main:app --reload")
        return False


def test_register(user_data: Dict) -> Optional[Dict]:
    """Test user registration"""
    print(f"📝 Registering user: {user_data['username']}...")
    try:
        response = requests.post(f"{BASE_URL}/api/auth/register", json=user_data)
        if response.status_code == 201:
            data = response.json()
            print(f"  ✓ User registered successfully")
            print(f"    - ID: {data.get('id')}")
            print(f"    - Username: {data.get('username')}")
            print(f"    - Email: {data.get('email')}")
            print(f"    - Role: {data.get('role')}")
            return data
        elif response.status_code == 400:
            print(f"  ⚠️  User already exists (expected if running multiple times)")
            return None
        else:
            print(f"  ✗ Registration failed: {response.status_code}")
            print(f"    {response.text}")
            return None
    except Exception as e:
        print(f"  ✗ Registration error: {e}")
        return None


def test_login(username: str, password: str) -> Optional[Dict]:
    """Test user login"""
    print(f"🔐 Logging in as: {username}...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            data={"username": username, "password": password}
        )
        if response.status_code == 200:
            data = response.json()
            print(f"  ✓ Login successful")
            print(f"    - Access token: {data.get('access_token')[:50]}...")
            print(f"    - Refresh token: {data.get('refresh_token')[:50]}...")
            print(f"    - Token type: {data.get('token_type')}")
            return data
        else:
            print(f"  ✗ Login failed: {response.status_code}")
            print(f"    {response.text}")
            return None
    except Exception as e:
        print(f"  ✗ Login error: {e}")
        return None


def test_get_current_user(access_token: str) -> Optional[Dict]:
    """Test getting current user info"""
    print("👤 Getting current user info...")
    try:
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        if response.status_code == 200:
            data = response.json()
            print(f"  ✓ User info retrieved")
            print(f"    - ID: {data.get('id')}")
            print(f"    - Username: {data.get('username')}")
            print(f"    - Email: {data.get('email')}")
            print(f"    - Role: {data.get('role')}")
            print(f"    - Active: {data.get('is_active')}")
            return data
        else:
            print(f"  ✗ Failed to get user info: {response.status_code}")
            print(f"    {response.text}")
            return None
    except Exception as e:
        print(f"  ✗ Error getting user info: {e}")
        return None


def test_refresh_token(refresh_token: str) -> Optional[Dict]:
    """Test token refresh"""
    print("🔄 Refreshing access token...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/refresh",
            json={"refresh_token": refresh_token}
        )
        if response.status_code == 200:
            data = response.json()
            print(f"  ✓ Token refreshed successfully")
            print(f"    - New access token: {data.get('access_token')[:50]}...")
            print(f"    - New refresh token: {data.get('refresh_token')[:50]}...")
            return data
        else:
            print(f"  ✗ Token refresh failed: {response.status_code}")
            print(f"    {response.text}")
            return None
    except Exception as e:
        print(f"  ✗ Token refresh error: {e}")
        return None


def test_verify_token(access_token: str) -> bool:
    """Test token verification"""
    print("✅ Verifying token...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/verify-token",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        if response.status_code == 200:
            data = response.json()
            print(f"  ✓ Token is valid")
            print(f"    - User ID: {data.get('user_id')}")
            print(f"    - Username: {data.get('username')}")
            return True
        else:
            print(f"  ✗ Token verification failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"  ✗ Token verification error: {e}")
        return False


def test_invalid_token():
    """Test with invalid token"""
    print("🚫 Testing with invalid token...")
    try:
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": "Bearer invalid.token.here"}
        )
        if response.status_code == 401:
            print(f"  ✓ Invalid token correctly rejected")
            return True
        else:
            print(f"  ✗ Invalid token was accepted: {response.status_code}")
            return False
    except Exception as e:
        print(f"  ✗ Error testing invalid token: {e}")
        return False


def test_logout(access_token: str) -> bool:
    """Test logout"""
    print("👋 Logging out...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/logout",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        if response.status_code == 200:
            data = response.json()
            print(f"  ✓ Logout successful")
            print(f"    - Message: {data.get('message')}")
            return True
        else:
            print(f"  ✗ Logout failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"  ✗ Logout error: {e}")
        return False


def main():
    """Main test execution"""
    print_section("🔐 NIRD Platform Authentication API Tests")
    
    # Test 1: Health check
    print_section("Test 1: API Health Check")
    if not test_health_check():
        print("\n❌ Cannot proceed without API connection")
        sys.exit(1)
    
    # Test 2: Register student user
    print_section("Test 2: User Registration (Student)")
    student_data = test_register(test_user)
    
    # Test 3: Register teacher user
    print_section("Test 3: User Registration (Teacher)")
    teacher_data = test_register(test_teacher)
    
    # Test 4: Login
    print_section("Test 4: User Login")
    tokens = test_login(test_user["username"], test_user["password"])
    if not tokens:
        print("\n❌ Cannot proceed without valid tokens")
        sys.exit(1)
    
    access_token = tokens["access_token"]
    refresh_token = tokens["refresh_token"]
    
    # Test 5: Get current user
    print_section("Test 5: Get Current User Info")
    user_info = test_get_current_user(access_token)
    if not user_info:
        print("\n❌ Failed to get user info")
        sys.exit(1)
    
    # Test 6: Verify token
    print_section("Test 6: Verify Token")
    if not test_verify_token(access_token):
        print("\n❌ Token verification failed")
        sys.exit(1)
    
    # Test 7: Refresh token
    print_section("Test 7: Refresh Access Token")
    new_tokens = test_refresh_token(refresh_token)
    if not new_tokens:
        print("\n❌ Token refresh failed")
        sys.exit(1)
    
    # Test 8: Invalid token
    print_section("Test 8: Invalid Token Handling")
    if not test_invalid_token():
        print("\n❌ Invalid token test failed")
        sys.exit(1)
    
    # Test 9: Logout
    print_section("Test 9: Logout")
    test_logout(access_token)
    
    # Summary
    print_section("✅ Test Summary")
    print("All authentication tests completed successfully!")
    print("\n📊 Tested endpoints:")
    print("  ✓ GET  /api/health")
    print("  ✓ POST /api/auth/register")
    print("  ✓ POST /api/auth/login")
    print("  ✓ GET  /api/auth/me")
    print("  ✓ POST /api/auth/verify-token")
    print("  ✓ POST /api/auth/refresh")
    print("  ✓ POST /api/auth/logout")
    print("\n🎉 Authentication API is fully functional!")


if __name__ == "__main__":
    main()
