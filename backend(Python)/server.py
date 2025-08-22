# app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev servers
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,  # optional: if you plan to use cookies/auth
)

@app.get("/api/message")
def message():
    return {"message": "Hello from FastAPI", "time": "2025-08-22"}

@app.get("/api/user/{user_id}")
def user(user_id: int):
    return {"id": user_id, "name": "Luffy", "role": "Pirate"}
