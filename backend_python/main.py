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

def transform_blog_post(post_data):
    """Transform MongoDB document to frontend format"""
    if not post_data:
        return None
    
    # Handle ObjectId conversion for _id field if it exists
    post_id = post_data.get("post_id") or str(post_data.get("_id", ""))
    
    return {
        "id": post_id,
        "title": post_data.get("title", ""),
        "slug": post_data.get("slug", ""),
        "excerpt": post_data.get("excerpt", ""),
        "content": post_data.get("content", ""),
        "date": post_data.get("date", ""),
        "readTime": post_data.get("readTime", 0),
        "tags": post_data.get("tags", [])
    }

def generate_slug(title: str) -> str:
    """Generate a URL-friendly slug from title"""
    import re
    # Convert to lowercase, replace spaces with hyphens, remove special chars
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    return slug.strip('-')

async def get_next_post_id() -> int:
    """Generate next sequential post ID"""
    try:
        # Find the highest post_id
        last_post = await blog_collection.find_one({}, sort=[("post_id", -1)])
        if last_post and "post_id" in last_post:
            return last_post["post_id"] + 1
        return 1
    except Exception:
        return 1

@app.post("/api/blog/posts", response_model=BlogPostResponse)
async def create_blog_post(post_data: BlogPostCreate):
    """Create a new blog post"""
    try:
        # Generate post_id and slug if not provided
        post_id = await get_next_post_id()
        slug = post_data.slug or generate_slug(post_data.title)
        
        # Check if slug already exists
        existing_post = await blog_collection.find_one({"slug": slug})
        if existing_post:
            # Append post_id to make slug unique
            slug = f"{slug}-{post_id}"
        
        # Create the document
        blog_doc = {
            "post_id": post_id,
            "title": post_data.title,
            "slug": slug,
            "excerpt": post_data.excerpt,
            "content": post_data.content,
            "date": post_data.date or datetime.utcnow().isoformat(),
            "readTime": post_data.readTime or "5 min",
            "tags": post_data.tags or [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert into database
        result = await blog_collection.insert_one(blog_doc)
        
        if result.inserted_id:
            # Retrieve the inserted document
            created_post = await blog_collection.find_one({"_id": result.inserted_id})
            print(f"Successfully created post with ID: {post_id}")
            return transform_blog_post(created_post)
        else:
            raise HTTPException(status_code=500, detail="Failed to create blog post")
            
    except Exception as e:
        print(f"Error creating blog post: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating blog post: {str(e)}")

@app.post("/api/blog/posts/bulk", response_model=List[BlogPostResponse])
async def create_multiple_blog_posts(posts_data: List[BlogPostCreate]):
    """Create multiple blog posts at once"""
    try:
        created_posts = []
        
        for post_data in posts_data:
            # Generate post_id and slug
            post_id = await get_next_post_id()
            slug = post_data.slug or generate_slug(post_data.title)
            
            # Ensure unique slug
            existing_post = await blog_collection.find_one({"slug": slug})
            if existing_post:
                slug = f"{slug}-{post_id}"
            
            blog_doc = {
                "post_id": post_id,
                "title": post_data.title,
                "slug": slug,
                "excerpt": post_data.excerpt,
                "content": post_data.content,
                "date": post_data.date or datetime.utcnow().isoformat(),
                "readTime": post_data.readTime or "5 min",
                "tags": post_data.tags or [],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            result = await blog_collection.insert_one(blog_doc)
            if result.inserted_id:
                created_post = await blog_collection.find_one({"_id": result.inserted_id})
                created_posts.append(transform_blog_post(created_post))
        
        print(f"Successfully created {len(created_posts)} blog posts")
        return created_posts
        
    except Exception as e:
        print(f"Error creating multiple blog posts: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating blog posts: {str(e)}")

@app.get("/api/blog/posts", response_model=List[BlogPostResponse])
async def get_all_posts():
    """Get all blog posts sorted by date (newest first)"""
    try:
        # Debug: Check if collection exists and has data
        count = await blog_collection.count_documents({})
        print(f"Total documents in collection: {count}")
        
        if count == 0:
            print("No documents found in blog collection")
            return []
        
        cursor = blog_collection.find({}).sort("date", -1)
        posts = await cursor.to_list(length=None)
        
        print(f"Retrieved {len(posts)} posts from database")
        
        # Debug: Print first post structure
        if posts:
            print(f"First post structure: {posts[0].keys()}")
        
        transformed_posts = []
        for post in posts:
            transformed_post = transform_blog_post(post)
            if transformed_post:
                transformed_posts.append(transformed_post)
        
        print(f"Returning {len(transformed_posts)} transformed posts")
        return transformed_posts
        
    except Exception as e:
        print(f"Error in get_all_posts: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching posts: {str(e)}")
    
@app.get("/api/blog/posts/{slug}", response_model=BlogPostResponse)
async def get_post_by_slug(slug: str):
    """Get a single blog post by slug"""
    try:
        print(f"Looking for post with slug: {slug}")
        post = await blog_collection.find_one({"slug": slug})
        
        if not post:
            print(f"No post found with slug: {slug}")
            raise HTTPException(status_code=404, detail="Post not found")
        
        print(f"Found post: {post.get('title', 'No title')}")
        return transform_blog_post(post)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_post_by_slug: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching post: {str(e)}")

@app.get("/api/blog/posts/tag/{tag}", response_model=List[BlogPostResponse])
async def get_posts_by_tag(tag: str):
    """Get blog posts by tag"""
    try:
        print(f"Looking for posts with tag: {tag}")
        cursor = blog_collection.find({"tags": {"$in": [tag]}}).sort("date", -1)
        posts = await cursor.to_list(length=None)
        
        print(f"Found {len(posts)} posts with tag: {tag}")
        transformed_posts = [transform_blog_post(post) for post in posts]
        return transformed_posts
        
    except Exception as e:
        print(f"Error in get_posts_by_tag: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching posts by tag: {str(e)}")

# Add a test endpoint to check database connection
@app.get("/api/blog/test")
async def test_database_connection():
    """Test database connection and show collection stats"""
    try:
        # Test basic connection
        count = await blog_collection.count_documents({})
        
        # Get a sample document
        sample_doc = await blog_collection.find_one({})
        
        return {
            "status": "connected",
            "collection_name": blog_collection.name,
            "document_count": count,
            "sample_document_keys": list(sample_doc.keys()) if sample_doc else [],
            "sample_document": sample_doc
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    # Make sure the module name matches your file name
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)