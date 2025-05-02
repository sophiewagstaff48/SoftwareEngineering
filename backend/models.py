from config import db
from datetime import datetime
from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name   = db.Column(db.String(80), unique=False, nullable=False)
    last_name    = db.Column(db.String(80), unique=False, nullable=False)
    email        = db.Column(db.String(120), unique=True, nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "firstName": self.first_name,
            "lastName": self.last_name,
            "email": self.email,
        }


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    searches = db.relationship('Search', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Search(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    term = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)