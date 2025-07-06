# column_route.py

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models.column_model import ColumnModel
from app.models.board_model import BoardModel
from app.models.task_model import TaskModel  # ต้อง import
from app.schemas.column_schemas import ColumnCreateSchema, ColumnUpdateSchema, ColumnOutSchema
from app.core.security import SECRET_KEY, ALGORITHM
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer

router = APIRouter(tags=["Columns"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user_id(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return int(payload.get("sub"))
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


#  GET: ดึง Columns พร้อม tasks
@router.get("/boards/{id}/columns", response_model=List[ColumnOutSchema])
def get_columns_with_tasks(id: int, db: Session = Depends(get_db)):
    columns = (
        db.query(ColumnModel)
        .options(joinedload(ColumnModel.tasks))
        .filter(ColumnModel.board_id == id)
        .all()
    )

    #  สำคัญมาก: เรียง tasks ในแต่ละ column ตาม position
    for column in columns:
        column.tasks.sort(key=lambda task: task.position)

    return columns




#  POST: สร้าง Column
@router.post("/columns", response_model=ColumnOutSchema)
def create_column(
    data: ColumnCreateSchema,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    board = db.query(BoardModel).filter(BoardModel.id == data.board_id).first()
    if not board or user_id not in [m.id for m in board.members]:
        raise HTTPException(status_code=403, detail="No permission to create column")

    column = ColumnModel(name=data.name, board_id=data.board_id)
    db.add(column)
    db.commit()
    db.refresh(column)
    return column


#  PUT: แก้ชื่อ Column
@router.put("/columns/{column_id}", response_model=ColumnOutSchema)
def update_column(
    column_id: int,
    data: ColumnUpdateSchema,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    column = db.query(ColumnModel).filter(ColumnModel.id == column_id).first()
    if not column:
        raise HTTPException(status_code=404, detail="Column not found")
    board = column.board
    if user_id not in [m.id for m in board.members]:
        raise HTTPException(status_code=403, detail="No permission to edit column")
    column.name = data.name
    db.commit()
    return column


#  DELETE: ลบ Column
@router.delete("/columns/{column_id}")
def delete_column(
    column_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    column = db.query(ColumnModel).filter(ColumnModel.id == column_id).first()
    if not column:
        raise HTTPException(status_code=404, detail="Column not found")
    board = column.board
    if user_id not in [m.id for m in board.members]:
        raise HTTPException(status_code=403, detail="No permission to delete column")
    db.delete(column)
    db.commit()
    return {"detail": "Column deleted"}
