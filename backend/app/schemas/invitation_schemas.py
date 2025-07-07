# app/schemas/invitation_schemas.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class InvitationCreateSchema(BaseModel):
    board_id: int
    invited_user_id: int

class InvitationRespondSchema(BaseModel):
    status: str  # "accepted" หรือ "declined"

class InvitationOutSchema(BaseModel):
    id: int
    board_id: int
    invited_user_id: int
    invited_by_user_id: int
    status: str
    created_at: datetime
    responded_at: Optional[datetime]

    class Config:
        orm_mode = True
