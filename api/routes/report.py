from flask import Blueprint, request, jsonify
from models.url_db import update_url, get_url_reports
from bson import json_util
from google import genai
import os

reports_bp = Blueprint("reports", __name__)

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


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

    analysis = ""
    if len(reports) >= 2:
        client = genai.Client(api_key=GOOGLE_API_KEY)
        prompt = f"""
<Context>
Analyze these user reports about a potentially malicious URL.
</Context>

<URL>
{url}
</URL>

<Reports>
{"\n".join(f"- {report}" for report in reports)}
</Reports>

<Task>
Provide at most 3 short bullet points (max 8 words each) identifying possible security threats, make sure to either reference a report if applicable or point out typos and/or the fact that the URL starts with numbers.
</Task>

<Formatting>
Start each point with * and nothing else.
* First short security threat
* Second short security threat
* Third short security threat
</Formatting>
        """
        response = client.models.generate_content(
            model="gemini-2.0-flash-lite-preview-02-05",
            contents=prompt,
        )

        analysis = "\n".join(
            [
                line.strip().strip("*")
                for line in response.text.split("\n")
                if line.strip().startswith("*")
            ]
        )

    return json_util.dumps({"analysis": analysis}), 200
