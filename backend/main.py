from flask import request, jsonify, session
from config import app, db
from models import User, SearchHistory
from werkzeug.security import generate_password_hash, check_password_hash
from OpenverseAPIClient import OpenverseClient
from flask_cors import CORS

CORS(app, supports_credentials=True, origins=["http://localhost:5173"])  # Enable CORS for all routes

ov_client = OpenverseClient()

#image search
# @app.route("/search_images", methods=["GET"])
# def search_images():
#     """
#     Endpoint to search for images using the OpenVerse API
#     Query parameters:
#     - q: Search query (required)
#     - page: Page number (default: 1)
#     - page_size: Results per page (default: 20)
#     - license: Filter by license type
#     - creator: Filter by creator
#     - tags: Comma-separated list of tags
#     """
#     query = request.args.get("q")
#     if not query:
#         return jsonify({"error": "Search query is required"}), 400

#     page = request.args.get("page", 1, type=int)
#     page_size = request.args.get("page_size", 20, type=int)
#     license_type = request.args.get("license")
#     creator = request.args.get("creator")
#     source = request.args.get("source")
#     extension = request.args.get("extension")
#     # Handle tags as a comma-separated list
#     tags = request.args.get("tags")
#     if tags:
#         tags = tags.split(",")

#     results = ov_client.search_images(
#         query=query,
#         page=page,
#         page_size=page_size,
#         license_type=license_type,
#         source=source,
#         extension=extension,
#         creator=creator,
#         tags=tags
#     )

#     return jsonify(results)
@app.route("/search_images", methods=["GET"])
def search_images():
    """
    Endpoint to search for images using the OpenVerse API
    Query parameters:
    - q: Search query (required)
    - page: Page number (default: 1)
    - page_size: Results per page (default: 20)
    - license: Filter by license type
    - creator: Filter by creator
    - tags: Comma-separated list of tags
    """
    query = request.args.get("q")
    if not query:
        return jsonify({"error": "Search query is required"}), 400

    page = request.args.get("page", 1, type=int)
    page_size = request.args.get("page_size", 20, type=int)
    license_type = request.args.get("license")
    creator = request.args.get("creator")

    # Handle tags as a comma-separated list
    tags = request.args.get("tags")
    if tags:
        tags = tags.split(",")

    results = ov_client.search_images(
        query=query,
        page=page,
        page_size=page_size,
        license_type=license_type,
        creator=creator,
        tags=tags
    )

    return jsonify(results)


#create user
@app.route("/register", methods=["POST"])
def create_user():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"message": "Username, email, and password are required."}), 400
    
    if User.query.filter((User.username ==username) | (User.email == email)).first():
        return jsonify({"message": "User with that name or email already exists."}), 409
    
    hashed_password = generate_password_hash(password)
    new_user = User(username=username, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created."}), 201

@app.route("/currentUser", methods=["GET"])
def get_current_user():
    if "user_id" not in session:
        return jsonify({"message": "Not logged in."}), 401
    
    user = User.query.get(session["user_id"])
    return jsonify(user.to_json()), 200



#login a user
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"message": "Please provide a username and password"}), 400
    
    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password, password):
        session["user_id"] = user.id
        print("Logged in user session:", session)
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 401
    
#logout a user
@app.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out"}), 200


@app.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify({"users": [u.to_json() for u in users]})

#search history management
@app.route("/searchHistory", methods=["GET", "POST", "DELETE"])
def search_history():
    if "user_id" not in session:
        return jsonify({"message": "User not logged in."}), 401
    
    if request.method == "POST":
        data = request.get_json()
        search_q = data.get("search_q")

        if not search_q:
            return jsonify({"message": "No search query provided"}), 400
        
        new_entry = SearchHistory(
            search_q=search_q,
            license=data.get("license"),
            source=data.get("source"),
            extension=data.get("extension"), 
            media_type=media_type,
            user_id=session["user_id"]
        )
        
        db.session.add(new_entry)
        db.session.commit()
        return jsonify({"message": "Saved to search history"}), 201
    
    elif request.method == "GET":
        history = SearchHistory.query.filter_by(user_id=session["user_id"]).all()
        return jsonify([h.to_json() for h in history])
    
    elif request.method == "DELETE":
        media_type = request.args.get("media_type")
        query = SearchHistory.query.filter_by(user_id=session["user_id"])
        if media_type:
            query = query.filter_by(media_type= data.get("media_type"))
        
        query.delete()
        db.session.commit()
        return jsonify({"message": "All history entries deleted"}), 200

#history search
@app.route("/searchHistory/search", methods=["GET"])
def search_history_filter():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401
    
    q = request.args.get("q", "")
    user_id = session["user_id"]

    if not q:
        return jsonify([])
    
    results = SearchHistory.query.filter(
        SearchHistory.user_id == user_id,
        SearchHistory.search_q.ilike(f"%{q}%")
    ).all()
    return jsonify([h.to_json() for h in results])

#delete search history
@app.route("/searchHistory/<int:entry_id>", methods=["DELETE"])
def delete_history_entry(entry_id):
    if "user_id" not in session:
        return jsonify({"message": "User not logged in."}), 401
    
    entry = SearchHistory.query.filter_by(id=entry_id, user_id=session["user_id"]).first()
    if not entry:
        return jsonify({"message": "History entry not found."}), 404
    
    db.session.delete(entry)
    db.session.commit()
    return jsonify({"message": "Entry deleted"}), 200

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(host="0.0.0.0", port=5000, debug=True)
