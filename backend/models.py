from config import db
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    id              = db.Column(db.Integer, primary_key=True)
    username        = db.Column(db.String(80), unique=True, nullable=False)
    email           = db.Column(db.String(120), unique=True, nullable=False)
    password        = db.Column(db.String(128), nullable=False)
    searchHistory = db.relationship('SearchHistory', backref='user', lazy=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_json(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
        }

class SearchHistory(db.Model):
    __tablename__ = 'search history'
    id = db.Column(db.Integer, primary_key=True)
    search_q = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    license = db.Column(db.String(50))
    source = db.Column(db.String(50))
    extension = db.Column(db.String(10))
    media_type = db.Column(db.String(10), default="image")

    def to_json(self):
        return {
            "id": self.id,
            "search_q": self.search_q,
            "user_id": self.user_id,
            "license": self.license,
            "source": self.source,
            "extension": self.extension,
            "media_type": self.media_type
        }