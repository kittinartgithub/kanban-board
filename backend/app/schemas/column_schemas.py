# app/schemas/column_schemas.py

from pydantic import BaseModel

class ColumnCreateSchema(BaseModel):
    name: str
    board_id: int

class ColumnUpdateSchema(BaseModel):
    name: str

class ColumnOutSchema(BaseModel):
    id: int
    name: str
    board_id: int

    class Config:
        from_attributes = True
