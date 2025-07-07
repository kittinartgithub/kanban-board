# app/schemas/task_schemas.py

from pydantic import BaseModel, field_validator
from typing import List, Optional
from datetime import datetime
from app.schemas.tag_schemas import TagOutSchema
from app.schemas.user_schemas import UserOutSchema

# สำหรับ assign user ไปยัง task
class AssignUserSchema(BaseModel):
    user_id: int

class TaskAssigneeOut(BaseModel):
    id: int
    user_id: int
    assigned_at: datetime

    class Config:
        from_attributes = True

class TaskCreateSchema(BaseModel):
    name: str
    description: Optional[str] = ""
    column_id: int

class TaskUpdateSchema(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    column_id: Optional[int] = None
    position: Optional[int] = None

# สำหรับแสดง Task + assignees
class TaskOutSchema(BaseModel):
    id: int
    name: str
    description: Optional[str]
    column_id: int
    position: int
    tags: List[TagOutSchema] = []
    assignees: List[UserOutSchema] = []

    class Config:
        from_attributes = True

    @field_validator("assignees", mode="before")
    def process_assignees(cls, value):
        """แปลง assignees ให้เป็น UserOutSchema objects"""
        if not value:
            return []
        
        result = []
        for item in value:
            if isinstance(item, dict):
                # ถ้าเป็น dict แล้ว ใช้ได้เลย
                result.append(item)
            elif hasattr(item, '__dict__'):
                # ถ้าเป็น SQLAlchemy object ให้แปลงเป็น dict
                if hasattr(item, 'user'):
                    # ถ้าเป็น TaskAssignee object ที่มี relationship user
                    result.append(item.user)
                else:
                    # ถ้าเป็น User object โดยตรง
                    result.append(item)
            elif isinstance(item, int):
                # ถ้าเป็น ID เฉยๆ ให้สร้าง object พื้นฐาน (ไม่แนะนำ)
                result.append({"id": item, "username": f"user_{item}", "email": ""})
        
        return result

# หรือถ้าต้องการแค่ ID ก็สร้าง schema แยก
class TaskOutSchemaWithIDs(BaseModel):
    id: int
    name: str
    description: Optional[str]
    column_id: int
    position: int
    tags: List[TagOutSchema] = []
    assignee_ids: List[int] = []  # ใช้ assignee_ids แทน assignees

    class Config:
        from_attributes = True

    @field_validator("assignee_ids", mode="before")
    def extract_assignee_ids(cls, value):
        """แปลง assignees เป็น list ของ IDs"""
        if not value:
            return []
        
        if isinstance(value, list):
            result = []
            for item in value:
                if isinstance(item, int):
                    result.append(item)
                elif isinstance(item, dict) and 'id' in item:
                    result.append(item['id'])
                elif hasattr(item, 'id'):
                    result.append(item.id)
                elif hasattr(item, 'user_id'):
                    result.append(item.user_id)
            return result
        
        return value