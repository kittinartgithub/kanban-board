# tag_route.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.tag_model import TagModel
from app.models.task_model import TaskModel
from app.schemas.tag_schemas import TagSchema, TagOutSchema  
from app.core.security import SECRET_KEY, ALGORITHM
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer

router = APIRouter(prefix="/tags", tags=["Tags"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user_id(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return int(payload.get("sub"))
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

#  POST: สร้าง Tag
@router.post("/", response_model=TagOutSchema) 
def create_tag(
    data: TagSchema,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    tag = TagModel(**data.dict())
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return tag

#  GET: ดึง Tag ทั้งหมด
@router.get("/", response_model=List[TagOutSchema])  
def get_tags(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    return db.query(TagModel).all()

#  GET: ดึง Tag ที่ผูกกับ Task
@router.get("/tasks/{task_id}", response_model=List[TagOutSchema])  
def get_tags_for_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task.tags

#  POST: ผูก Tag กับ Task
@router.post("/tasks/{task_id}/{tag_id}")
def add_tag_to_task(task_id: int, tag_id: int, db: Session = Depends(get_db)):
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    tag = db.query(TagModel).filter(TagModel.id == tag_id).first()
    if not task or not tag:
        raise HTTPException(status_code=404, detail="Task or Tag not found")
    if tag in task.tags:
        raise HTTPException(status_code=400, detail="Tag already added")
    task.tags.append(tag)
    db.commit()
    return {"detail": "Tag added to task"}

#  DELETE: ลบ Tag ออกจาก Task
@router.delete("/tasks/{task_id}/{tag_id}")
def remove_tag_from_task(task_id: int, tag_id: int, db: Session = Depends(get_db)):
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    tag = db.query(TagModel).filter(TagModel.id == tag_id).first()
    if not task or not tag:
        raise HTTPException(status_code=404, detail="Task or Tag not found")
    if tag not in task.tags:
        raise HTTPException(status_code=400, detail="Tag not found in task")
    task.tags.remove(tag)
    db.commit()
    return {"detail": "Tag removed from task"}

# เพิ่ม endpoint นี้
@router.post("/assign/{task_id}")
def assign_tags_to_task(
    task_id: int,
    tag_data: dict,  # {"tag_ids": [1, 2, 3]}
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # ล้าง tags เก่า
    task.tags.clear()
    
    # เพิ่ม tags ใหม่
    tag_ids = tag_data.get("tag_ids", [])
    for tag_id in tag_ids:
        tag = db.query(TagModel).filter(TagModel.id == tag_id).first()
        if tag:
            task.tags.append(tag)
    
    db.commit()
    return {"detail": "Tags assigned successfully"}