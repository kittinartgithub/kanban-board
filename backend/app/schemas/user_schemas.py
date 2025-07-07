# D:\Data\INTERNSHIP\kanban-board\backend\app\schemas\user_schemas.py
from pydantic import BaseModel, EmailStr

class UserCreateSchema(BaseModel):
    username: str
    email: EmailStr
    password_hash: str
    first_name: str = ""
    last_name: str = ""

class UserOutSchema(BaseModel):
    id: int
    username: str
    email: str
    first_name: str
    last_name: str

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}".strip()

    class Config:
        from_attributes = True

class LoginFormSchema(BaseModel):
    username: str
    password: str
