from flask import Blueprint, request, jsonify
from models.db import insert_url, get_all_urls, get_url, update_url, delete_url
import requests
import os
from dotenv import load_dotenv

load_dotenv()

scan_bp = Blueprint('scan', __name__)

SAFE_BROWSING_API_KEY = os.getenv('API_KEY')
print(SAFE_BROWSING_API_KEY)
if not SAFE_BROWSING_API_KEY:
    raise ValueError("API_KEY is not set")
SAFE_BROWSING_URL = "https://safebrowsing.googleapis.com/v4/threatMatches:find?key=" + SAFE_BROWSING_API_KEY

@scan_bp.route('/scan', methods=['POST'])
def scan():
    data = request.get_json()
    url = data.get('URL')
    if not url:
        return jsonify({"error": "URL is required"}), 400
    
    check_url_db = get_url(url)
    print(check_url_db)
    if not check_url_db:
        result = check_url_safety(url)
        insert_url(url, result)
        return jsonify({"URL": url, "result": result})
    ## subject, description, reports
    return jsonify({"URL": url, "result": check_url_db['result']})


    
    
    
def check_url_safety(url):
    payload = {
        "client": {
            "clientId": "your-client-id",
            "clientVersion": "1.0"
        },
        "threatInfo": {
            "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
            "platformTypes": ["ANY_PLATFORM"],
            "threatEntryTypes": ["URL"],
            "threatEntries": [{"url": url}]
        }
    }

    response = requests.post(SAFE_BROWSING_URL, json=payload)
    data = response.json()
    return "safe" if "matches" not in data else "malicious"