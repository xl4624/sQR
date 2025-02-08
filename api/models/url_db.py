from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from bson import json_util
import os

MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI)
db = client['url_db']
url_collection = db['url_collection']


def insert_url(url, result):
    url_collection.insert_one({'URL': url, 'result': result})

def get_all_urls():
    return list(url_collection.find({}, {'_id': 0}))

def get_url(url):
    return url_collection.find_one({'URL': url}, {'_id': 0})

def update_url(url, result):
    url_collection.update_one({'URL': url}, {'$set': {'result': result}})

def delete_url(url):
    url_collection.delete_one({'URL': url})










