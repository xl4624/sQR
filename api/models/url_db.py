from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from bson import json_util
import os

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["url_db"]
url_collection = db["url_collection"]


def insert_url(url, result, reports=None):
    url_collection.insert_one(
        {
            "URL": url,
            "result": result,
            "reports": reports if reports else [],
        }
    )


def get_all_urls():
    return list(url_collection.find({}, {"_id": 0}))


def get_url(url):
    return url_collection.find_one({"URL": url}, {"_id": 0})


def update_url(url, result=None, new_report=None):
    update_fields = {}
    if result is not None:
        update_fields["result"] = result
    if new_report is not None:
        url_collection.update_one({"URL": url}, {"$push": {"reports": new_report}})
    if update_fields:
        url_collection.update_one({"URL": url}, {"$set": update_fields})


def delete_url(url):
    url_collection.delete_one({"URL": url})


def get_url_reports(url):
    result = url_collection.find_one({"URL": url}, {"reports": 1, "_id": 0})
    return result["reports"] if result else []
