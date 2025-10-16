# app.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import time
from typing import List
import os
from dotenv import load_dotenv
from models.blog import BlogPost, BlogPostResponse, BlogPostCreate
from database import blog_collection
from datetime import datetime
from bson import ObjectId

load_dotenv()

app = FastAPI(title="Blog API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:3000",
        "https://portfolio-sooty-xi-67.vercel.app",
        "https://portfolio-achinta-hazras-projects.vercel.app",
        "https://www.achintahazra.shop"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

@app.head("/healthz")
async def health_check_head():
    return {"status": "ok"}

@app.get("/healthz")
async def health_check():
    """Add GET method for health check"""
    return {"status": "ok"}

@app.get("/api/message")
def message():
    return {"message": "Hello from FastAPI", "time": "2025-08-22"}

@app.get("/api/user/{user_id}")
def user(user_id: int):
    return {"id": user_id, "name": "Luffy", "role": "Pirate"}
if __name__ == "__main__":
    import uvicorn
    # Make sure the module name matches your file name
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)