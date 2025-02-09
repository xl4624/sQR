from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.feedback import save_feedback, get_feedback

feedback_bp = Blueprint('feedback', __name__)

@feedback_bp.route('/submit', methods=['POST'])
@jwt_required()  
def submit_feedback():
    data = request.get_json()
    feedback_text = data.get("description")
    url = data.get("URL")
    if not feedback_text:
        return jsonify({"error": "Feedback is required"}), 400

    user_email = get_jwt_identity()
    feedback = save_feedback(user_email, url, feedback_text)

    return jsonify(feedback), 201

@feedback_bp.route('/getfeedback', methods=['GET']) 
def get_feedback():
    data = request.get_json()
    url = data.get("URL")
    feedback = get_feedback(url)
    return jsonify(feedback), 201
