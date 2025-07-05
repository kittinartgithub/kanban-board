# app/schemas/task_schemas.py

from pydantic import BaseModel
from typing import Optional

class TaskCreateSchema(BaseModel):
    name: str
    description: Optional[str] = ""
    column_id: int

class TaskUpdateSchema(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    column_id: Optional[int] = None
    position: Optional[int] = None
    assignee_id: Optional[int] = None

class TaskOutSchema(BaseModel):
    id: int
    name: str
    description: Optional[str]
    column_id: int
    position: int
    assignee_id: Optional[int]

    class Config:
        from_attributes = True
