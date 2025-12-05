"""
Test script to verify authentication system functionality.
"""
import sys
from pathlib import Path

# Add the parent directory to the Python path
sys.path.insert(0, str(Path(__file__).parent))

print("🔐 Testing Authentication System...")
print("=" * 60)

# Test 1: Import security utilities
print("\n✅ Test 1: Importing security utilities...")
try:
    from app.core.security import (
        verify_password,
        get_password_hash,
        create_access_token,
        create_refresh_token,
        decode_token,
        verify_token_type
    )
    print("  ✓ All security functions imported successfully")
except ImportError as e:
    print(f"  ✗ Failed to import security utilities: {e}")
    sys.exit(1)

# Test 2: Import dependencies
print("\n✅ Test 2: Importing authentication dependencies...")
try:
    from app.core.dependencies import (
        get_current_user,
        get_current_active_user,
        require_role,
        require_admin,
        require_teacher_or_admin,
        get_optional_user,
        oauth2_scheme
    )
    print("  ✓ All authentication dependencies imported successfully")
except ImportError as e:
    print(f"  ✗ Failed to import dependencies: {e}")
    sys.exit(1)

# Test 3: Password hashing
print("\n✅ Test 3: Testing password hashing...")
try:
    password = "SecurePass123"
    hashed = get_password_hash(password)
    print(f"  ✓ Password hashed: {hashed[:50]}...")
    
    # Verify correct password
    if verify_password(password, hashed):
        print("  ✓ Password verification successful")
    else:
        print("  ✗ Password verification failed")
        sys.exit(1)
    
    # Verify wrong password
    if not verify_password("WrongPassword", hashed):
        print("  ✓ Wrong password correctly rejected")
    else:
        print("  ✗ Wrong password incorrectly accepted")
        sys.exit(1)
except Exception as e:
    print(f"  ✗ Password hashing test failed: {e}")
    sys.exit(1)

# Test 4: JWT token creation and decoding
print("\n✅ Test 4: Testing JWT token generation...")
try:
    # Create access token
    token_data = {
        "sub": 123,
        "email": "test@example.com",
        "role": "student"
    }
    access_token = create_access_token(token_data)
    print(f"  ✓ Access token created: {access_token[:50]}...")
    
    # Decode access token
    decoded = decode_token(access_token)
    if decoded:
        print(f"  ✓ Token decoded successfully")
        print(f"    - User ID: {decoded.get('sub')}")
        print(f"    - Email: {decoded.get('email')}")
        print(f"    - Role: {decoded.get('role')}")
        print(f"    - Expires: {decoded.get('exp')}")
    else:
        print("  ✗ Token decoding failed")
        sys.exit(1)
    
    # Verify token data (sub is converted to string in JWT)
    if decoded.get("sub") == "123" and decoded.get("email") == "test@example.com":
        print("  ✓ Token data matches original payload")
    else:
        print("  ✗ Token data mismatch")
        sys.exit(1)
except Exception as e:
    print(f"  ✗ JWT token test failed: {e}")
    sys.exit(1)

# Test 5: Refresh token
print("\n✅ Test 5: Testing refresh token generation...")
try:
    refresh_token = create_refresh_token(token_data)
    print(f"  ✓ Refresh token created: {refresh_token[:50]}...")
    
    decoded_refresh = decode_token(refresh_token)
    if decoded_refresh and decoded_refresh.get("type") == "refresh":
        print("  ✓ Refresh token decoded with correct type")
    else:
        print("  ✗ Refresh token type verification failed")
        sys.exit(1)
    
    # Verify token type helper
    if verify_token_type(decoded_refresh, "refresh"):
        print("  ✓ Token type verification function works")
    else:
        print("  ✗ Token type verification function failed")
        sys.exit(1)
except Exception as e:
    print(f"  ✗ Refresh token test failed: {e}")
    sys.exit(1)

# Test 6: Invalid token handling
print("\n✅ Test 6: Testing invalid token handling...")
try:
    invalid_token = "invalid.token.string"
    decoded_invalid = decode_token(invalid_token)
    if decoded_invalid is None:
        print("  ✓ Invalid token correctly rejected")
    else:
        print("  ✗ Invalid token was accepted")
        sys.exit(1)
except Exception as e:
    print(f"  ✗ Invalid token test failed: {e}")
    sys.exit(1)

print("\n" + "=" * 60)
print("✅ All authentication tests passed successfully!")
print("\n📊 Summary:")
print("  - Security utilities: ✓")
print("  - Authentication dependencies: ✓")
print("  - Password hashing & verification: ✓")
print("  - JWT access tokens: ✓")
print("  - JWT refresh tokens: ✓")
print("  - Invalid token handling: ✓")
print("\n🎉 Authentication system is ready to use!")
