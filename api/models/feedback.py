from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from bson import json_util
import os

MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI)
db = client["auth_db"]
feedback_collection = db["feedback"]

def save_feedback(user_id, url, feedback_text):
    feedback = {
        "user_id": user_id,
        "URL": url,
        "description": feedback_text
    }
    feedback_collection.insert_one(feedback)
    return {"message": "Feedback submitted successfully"}

def get_feedback(url):
    return feedback_collection.find_one({'URL': url}, {'_id': 0})