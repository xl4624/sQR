from flask import Flask
from routes.scan import scan_bp
from routes.auth import auth_bp
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os


load_dotenv()


app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

app.register_blueprint(scan_bp)
app.register_blueprint(auth_bp, url_prefix='/auth')


@app.route("/")
def home():
    return "Hello World"


if __name__ == "__main__":
    app.run(debug=True, port=5000)
