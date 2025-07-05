# app/schemas/tag_schemas.py

from pydantic import BaseModel
from typing import List

class TagCreateSchema(BaseModel):
    name: str

class TagOutSchema(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class TagAssignSchema(BaseModel):
    tag_ids: List[int]
