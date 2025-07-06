# app/schemas/column_schemas.py

from pydantic import BaseModel
from typing import List
from app.schemas.task_schemas import TaskOutSchema  

class ColumnCreateSchema(BaseModel):
    name: str
    board_id: int

class ColumnUpdateSchema(BaseModel):
    name: str

class ColumnOutSchema(BaseModel):
    id: int
    name: str
    board_id: int
    tasks: List[TaskOutSchema] = []  

    class Config:
        from_attributes = True

