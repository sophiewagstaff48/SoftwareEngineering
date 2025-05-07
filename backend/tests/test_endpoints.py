import json
import pytest

def test_get_users(client, sample_users):
    """Test retrieving all users."""
    response = client.get('/users')
    data = json.loads(response.data)

    assert response.status_code == 200
    # assert response.status_code == 404
    assert len(data['users']) == 3
    assert data['users'][0]['username'] == 'John'

def test_create_user(client):
    """Test creating a new user."""
    new_user = {
        "username": "Test",
        "email": "test@example.com",
        "password": "test"
    }

    response = client.post('/create_user',
                            data=json.dumps(new_user),
                            content_type='application/json')
    
    assert response.status_code == 201

    # Verify the user was created
    get_response = client.get('/users')
    data = json.loads(get_response.data)
    emails = [user['email'] for user in data['users']]
    assert "test@example.com" in emails


