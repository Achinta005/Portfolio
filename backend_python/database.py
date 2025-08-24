import os
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection
MONGO_URL = "mongodb+srv://achintahazra8515:PmC7vQD1HGittlUa@cluster0.czz5hpe.mongodb.net"
DATABASE_NAME = "Portfolio"
COLLECTION_NAME = "Blog_data"

# Async client for FastAPI
client = AsyncIOMotorClient(MONGO_URL)
database = client[DATABASE_NAME]
blog_collection = database[COLLECTION_NAME]

# Sync client for initial setup
sync_client = MongoClient(MONGO_URL)
sync_database = sync_client[DATABASE_NAME]
sync_blog_collection = sync_database[COLLECTION_NAME]