# models/blog.py
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Any
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type: Any, _handler: Any) -> Any:
        from pydantic_core import core_schema
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(cls.validate),
                ])
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )

    @classmethod
    def validate(cls, v: Any) -> ObjectId:
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

class BlogPostCreate(BaseModel):
    """Model for creating a new blog post"""
    title: str
    slug: Optional[str] = None  # Auto-generated from title if not provided
    excerpt: str
    content: str
    date: Optional[str] = None  # Auto-generated if not provided
    readTime: Optional[str] = None  # Defaults to "5 min" if not provided
    tags: Optional[List[str]] = []

class BlogPost(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )
        
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    post_id: int
    title: str
    slug: str
    excerpt: str
    content: str
    date: str  # ISO date string
    readTime: str
    tags: List[str]

class BlogPostResponse(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: str
    content: str
    date: str
    readTime: str
    tags: List[str]