from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from bson import json_util
import os
import bcrypt

MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI)
db = client['auth_db']
users_collection = db['user_collection']
JWT_SECRET_KEY=os.getenv("JWT_SECRET_KEY")

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

def check_password(password, hashed_password):
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password)

def create_user(username, email, password):
    if users_collection.find_one({"email": email}):
        return {"error": "User already exists"}, 400

    hashed_password = hash_password(password)
    user = {"username": username, "email": email, "password": hashed_password}
    users_collection.insert_one(user)
    return {"message": "User created successfully"}, 201

def find_user_by_email(email):
    return users_collection.find_one({"email": email})

