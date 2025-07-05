from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password_hash: str
    first_name: str = ""
    last_name: str = ""

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    first_name: str
    last_name: str

    class Config:
        orm_mode = True
