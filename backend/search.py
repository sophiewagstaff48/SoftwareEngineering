from flask import Blueprint, request, jsonify
from extensions import db
from models import Search
from flask_jwt_extended import jwt_required, get_jwt_identity

search = Blueprint('search', __name__)

@search.route('/search', methods=['POST'])
@jwt_required()
def save_search():
    user_id = get_jwt_identity()
    term = request.json.get('term')
    new_search = Search(term=term, user_id=user_id)
    db.session.add(new_search)
    db.session.commit()
    return jsonify({"message": "Search saved"}), 201

@search.route('/searches', methods=['GET'])
@jwt_required()
def get_searches():
    user_id = get_jwt_identity()
    searches = Search.query.filter_by(user_id=user_id).order_by(Search.timestamp.desc()).all()
    return jsonify([{"term": s.term, "timestamp": s.timestamp} for s in searches])

@search.route('/search/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_search(id):
    user_id = get_jwt_identity()
    search = Search.query.filter_by(id=id, user_id=user_id).first()
    if search:
        db.session.delete(search)
        db.session.commit()
        return jsonify({"message": "Search deleted"}), 200
    return jsonify({"error": "Not found"}), 404
