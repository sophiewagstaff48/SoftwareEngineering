from flask import Blueprint, request, jsonify
from extensions import db
from models import User
from flask_jwt_extended import create_access_token

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['POST'])
def register():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user:
        return jsonify({"error": "User already exists"}), 409
    new_user = User(email=data['email'])
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@auth.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        token = create_access_token(identity=user.id)
        return jsonify(access_token=token), 200
    return jsonify({"error": "Invalid credentials"}), 401
