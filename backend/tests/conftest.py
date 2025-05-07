import pytest
from config import app, db
from models import User
import main

@pytest.fixture
def client():
    """Create a test client for the app with an in-memory database."""
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'

    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()

@pytest.fixture
def sample_users():
    """Create sample users for testing."""
    users = [
        User(username="John", email="john@example.com", password="1234")
    ]

    with app.app_context():
        for user in users:
            db.session.add(user)
        db.session.commit()
    return users
