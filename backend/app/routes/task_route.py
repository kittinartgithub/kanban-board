# app/routes/task_route.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.task_model import TaskModel
from app.models.column_model import ColumnModel
from app.models.user_model import UserModel
from app.models.board_model import BoardModel
from app.models.notification_model import NotificationModel

from app.schemas.task_schemas import TaskCreateSchema, TaskUpdateSchema, TaskOutSchema

from app.core.security import ALGORITHM, SECRET_KEY
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer

from app.models.task_model import TaskModel, TaskAssigneeModel
from app.schemas.task_schemas import AssignUserSchema, TaskAssigneeOut

from app.schemas.user_schemas import UserOutSchema


router = APIRouter(prefix="/tasks", tags=["Tasks"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


#  ดึง user_id จาก token
def get_current_user_id(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return int(payload.get("sub"))
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


#  สร้าง Task ใหม่
@router.post("/", response_model=TaskOutSchema)
def create_task(
    data: TaskCreateSchema,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    column = db.query(ColumnModel).filter(ColumnModel.id == data.column_id).first()
    if not column:
        raise HTTPException(status_code=404, detail="Column not found")

    task = TaskModel(
        name=data.name,
        description=data.description,
        column_id=data.column_id,
        position=len(column.tasks),
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


#  แก้ไข Task
@router.put("/{task_id}", response_model=TaskOutSchema)
def update_task(
    task_id: int,
    data: TaskUpdateSchema,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # ตรวจสอบว่ามีการเปลี่ยนแปลง assignee หรือไม่
    is_new_assignee = False
    if data.assignee_id is not None:
        # ตรวจสอบว่ายังไม่มี assignee นี้อยู่
        existing = db.query(TaskAssigneeModel).filter_by(
            task_id=task_id, 
            user_id=data.assignee_id
        ).first()
        if not existing:
            is_new_assignee = True
            # สร้าง assignment ใหม่
            assignment = TaskAssigneeModel(
                task_id=task_id,
                user_id=data.assignee_id
            )
            db.add(assignment)

    # อัพเดท fields อื่นๆ
    for attr, value in data.dict(exclude_unset=True, exclude={"assignee_id"}).items():
        setattr(task, attr, value)

    db.commit()
    db.refresh(task)

    if is_new_assignee:
        notification = NotificationModel(
            user_id=data.assignee_id,
            title="คุณได้รับมอบหมายงานใหม่",
            message=f"Task: {task.name}",
            type="task",
            related_id=task.id,
        )
        db.add(notification)
        db.commit()

    return task


#  ลบ Task
@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"detail": "Task deleted"}


#  ดึง Task แบบรายตัว
@router.get("/{task_id}", response_model=TaskOutSchema)
def get_task_by_id(
    task_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


#  ดึง Task ทั้งหมดใน Column
@router.get("/columns/{column_id}/tasks", response_model=List[TaskOutSchema])
def get_tasks_by_column(
    column_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    column = db.query(ColumnModel).filter(ColumnModel.id == column_id).first()
    if not column:
        raise HTTPException(status_code=404, detail="Column not found")

    board = db.query(BoardModel).filter(BoardModel.id == column.board_id).first()
    if not board or user_id not in [m.id for m in board.members]:
        raise HTTPException(status_code=403, detail="No permission")

    return column.tasks

from app.models.task_model import TaskModel, TaskAssigneeModel
from app.schemas.task_schemas import AssignUserSchema, TaskAssigneeOut

# ✅ Assign user to task
@router.post("/tasks/{task_id}/assign")
def assign_user_to_task(task_id: int, user_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # ตรวจสอบว่า user นี้ถูกมอบหมายงานแล้วหรือยัง
    if user in task.assignees:
        raise HTTPException(status_code=400, detail="User already assigned to this task")
    
    task.assignees.append(user)  # เพิ่มผู้ใช้เข้าไปใน assignees

    # บันทึกข้อมูลในฐานข้อมูล
    db.commit()
    db.refresh(task)  # รีเฟรชข้อมูล task เพื่อให้แน่ใจว่าได้ข้อมูลล่าสุด

    return task


@router.post("/tasks/{task_id}/assign", response_model=UserOutSchema)
def assign_user(task_id: int, assign_data: AssignUserSchema, db: Session = Depends(get_db)):
    # ... logic assign user ...
    # ตรวจสอบว่าผู้ใช้ถูก assign แล้วหรือยัง

    # สร้าง TaskAssigneeModel และบันทึก db

    # ดึง user ที่ถูก assign
    user = db.query(UserModel).filter(UserModel.id == assign_data.user_id).first()
    return user
