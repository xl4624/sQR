from flask import Flask
from routes.scan import scan_bp

app = Flask(__name__)

app.register_blueprint(scan_bp)


@app.route("/")
def home():
    return "Hello World"


if __name__ == "__main__":
    app.run(debug=True, port=5000)
