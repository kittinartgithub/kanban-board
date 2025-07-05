# app/routes/tag_route.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.tag_model import TagModel
from app.models.task_model import TaskModel
from app.schemas.tag_schemas import TagCreateSchema, TagOutSchema, TagAssignSchema
from app.core.security import get_current_user_id
from typing import List

router = APIRouter(prefix="/tags", tags=["Tags"])

# ✅ สร้าง tag
@router.post("/", response_model=TagOutSchema)
def create_tag(data: TagCreateSchema, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    tag = db.query(TagModel).filter(TagModel.name == data.name).first()
    if tag:
        raise HTTPException(status_code=400, detail="Tag already exists")
    tag = TagModel(name=data.name)
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return tag

#  ดึง tag ทั้งหมด
@router.get("/", response_model=List[TagOutSchema])
def get_tags(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    return db.query(TagModel).order_by(TagModel.name).all()

#  ผูก tag กับ task
@router.post("/assign/{task_id}")
def assign_tags_to_task(task_id: int, data: TagAssignSchema, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    tags = db.query(TagModel).filter(TagModel.id.in_(data.tag_ids)).all()
    task.tags = tags
    db.commit()
    return {"detail": "Tags assigned to task"}

#  ดึง tag ของ task
@router.get("/task/{task_id}", response_model=List[TagOutSchema])
def get_tags_of_task(task_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task.tags
