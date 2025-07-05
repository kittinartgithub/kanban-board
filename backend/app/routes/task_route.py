# app/routes/task_route.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.task_model import TaskModel
from app.models.column_model import ColumnModel
from app.models.user_model import UserModel
from app.schemas.task_schemas import TaskCreateSchema, TaskUpdateSchema, TaskOutSchema
from app.core.security import ALGORITHM, SECRET_KEY
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer

router = APIRouter(prefix="/tasks", tags=["Tasks"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user_id(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return int(payload.get("sub"))
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ✅ สร้าง Task
@router.post("/", response_model=TaskOutSchema)
def create_task(data: TaskCreateSchema, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    column = db.query(ColumnModel).filter(ColumnModel.id == data.column_id).first()
    if not column:
        raise HTTPException(status_code=404, detail="Column not found")
    
    task = TaskModel(
        name=data.name,
        description=data.description,
        column_id=data.column_id,
        position=len(column.tasks)  # ใส่ท้ายสุด
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

# ✅ แก้ไข Task
@router.put("/{task_id}", response_model=TaskOutSchema)
def update_task(task_id: int, data: TaskUpdateSchema, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    for attr, value in data.dict(exclude_unset=True).items():
        setattr(task, attr, value)

    db.commit()
    return task

# ✅ ลบ Task
@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"detail": "Task deleted"}
