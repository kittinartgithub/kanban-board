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

    is_new_assignee = False
    if data.assignee_id is not None and data.assignee_id != task.assignee_id:
        is_new_assignee = True

    for attr, value in data.dict(exclude_unset=True).items():
        setattr(task, attr, value)

    db.commit()

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
@router.post("/{task_id}/assign", response_model=TaskAssigneeOut)
def assign_user_to_task(
    task_id: int,
    data: AssignUserSchema,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # ตรวจว่า user อยู่ในบอร์ดนี้ไหม
    board = db.query(BoardModel).join(ColumnModel).filter(ColumnModel.id == task.column_id).first()
    if not board or data.user_id not in [member.id for member in board.members]:
        raise HTTPException(status_code=403, detail="User ไม่ได้อยู่ในบอร์ดนี้")

    # ป้องกันการ assign ซ้ำ
    existing = db.query(TaskAssigneeModel).filter_by(task_id=task_id, user_id=data.user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="User นี้ได้รับมอบหมายอยู่แล้ว")

    assignment = TaskAssigneeModel(task_id=task_id, user_id=data.user_id)
    db.add(assignment)

    # 🔔 แจ้งเตือน
    assigner = db.query(UserModel).filter(UserModel.id == user_id).first()
    board_name = board.name if board else ""

    notification = NotificationModel(
        user_id=data.user_id,
        title="คุณถูกมอบหมายให้ดูแล Task",
        message=f"Task: {task.name}",
        type="task",
        related_id=task.id,
        board_name=board_name,
        inviter_name=assigner.full_name if assigner else None
    )
    db.add(notification)

    db.commit()
    db.refresh(assignment)

    return assignment

