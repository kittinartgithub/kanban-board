# app/schemas/notification_schemas.py

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NotificationOutSchema(BaseModel):
    id: int
    title: str
    message: Optional[str]
    type: str
    related_id: Optional[int]
    is_read: bool
    created_at: datetime
    board_name: Optional[str]  # เพิ่มฟิลด์ board_name
    inviter_name: Optional[str]  # เพิ่มฟิลด์ inviter_name

    class Config:
        from_attributes = True