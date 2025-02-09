from flask import Blueprint, request, jsonify
from models.url_db import update_url, get_url_reports
from bson import json_util
import requests

reports_bp = Blueprint("reports", __name__)


@reports_bp.route("/reports", methods=["POST"])
def add_report():
    data = request.get_json()
    url = data["url"]
    report = data["report"]

    if not isinstance(report, str):
        return jsonify({"error": "Report must be a string"}), 400

    update_url(url, new_report=report)
    return jsonify({"message": "Report added successfully"}), 200


@reports_bp.route("/reports", methods=["GET"])
def get_reports():
    url = request.args.get("url")
    reports = get_url_reports(url)

    if reports is None:
        return jsonify({"error": "URL not found"}), 404

    return json_util.dumps({"reports": reports}), 200
