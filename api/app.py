from flask import Flask
from routes.scan import scan_bp
from routes.auth import auth_bp
from routes.feedback import feedback_bp
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
import os


load_dotenv()


app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

app.register_blueprint(scan_bp)
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(feedback_bp, url_prefix="/feedback")


@app.route("/")
def home():
    return "Hello World"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
