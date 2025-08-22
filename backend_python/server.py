# app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000","https://portfolio-sooty-xi-67.vercel.app","https://portfolio-achinta-hazras-projects.vercel.app","https://www.achintahazra.shop"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,  # optional: if you plan to use cookies/auth
)

@app.head("/healthz")
async def health_check_head():
    return {"status": "ok"}

@app.get("/api/message")
def message():
    return {"message": "Hello from FastAPI", "time": "2025-08-22"}

@app.get("/api/user/{user_id}")
def user(user_id: int):
    return {"id": user_id, "name": "Luffy", "role": "Pirate"}
