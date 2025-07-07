from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List  
from app.models import user_model
from app.schemas import user_schemas
from app.database import get_db
from app.core.security import get_current_user_id  

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.post("/", response_model=user_schemas.UserOutSchema)
def create_user(user: user_schemas.UserCreateSchema, db: Session = Depends(get_db)):
    db_user = db.query(user_model.UserModel).filter(
        (user_model.UserModel.email == user.email) | (user_model.UserModel.username == user.username)
    ).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")

    new_user = user_model.UserModel(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.get("/all", response_model=List[user_schemas.UserOutSchema])
def get_all_users(db: Session = Depends(get_db), current_user_id: int = Depends(get_current_user_id)):
    """ดึงรายชื่อผู้ใช้งานทั้งหมด (สำหรับเชิญเข้าบอร์ด)"""
    users = db.query(user_model.UserModel).all() 
    return users