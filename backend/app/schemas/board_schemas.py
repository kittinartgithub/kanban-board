# app/schemas/board_schemas.py

from pydantic import BaseModel
from typing import List, Optional

class BoardCreateSchema(BaseModel):
    name: str

class BoardUpdateSchema(BaseModel):
    name: str

class BoardInviteSchema(BaseModel):
    user_id: int

class BoardOutSchema(BaseModel):
    id: int
    name: str
    owner_id: int
    members: List[int]

    class Config:
        from_attributes = True
