from flask import Flask
from config import Config
from extensions import db, jwt
from auth import auth
from search import search

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
jwt.init_app(app)

app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(search, url_prefix='/api')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
