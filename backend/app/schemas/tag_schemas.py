# D:\Data\INTERNSHIP\kanban-board\backend\app\schemas\tag_schemas.py
from pydantic import BaseModel
from typing import Optional

#  สำหรับสร้าง tag
class TagSchema(BaseModel):
    name: str
    color: Optional[str] = None

#  สำหรับแสดงผล tag กลับไปยัง frontend
class TagOutSchema(BaseModel):
    id: int
    name: str
    color: Optional[str] = None

    model_config = {
        "from_attributes": True  # สำหรับ pydantic v2 ขึ้นไป
    }