import pytest
from models import User

def test_user_model():
    """Test User model creation and conversion to JSON."""
    user = User(username="Test", email="test@test.com", password="test")
    
    # Test that the properties are set correctly
    assert user.username == "Test"
    assert user.email == "test@test.com"
    assert user.password == "test"
    
    # Test the to_json method
    user_json = user.to_json()
    assert user_json["username"] == "Test"
    assert user_json["email"] == "test@test.com"
    assert user_json["password"] == "test"