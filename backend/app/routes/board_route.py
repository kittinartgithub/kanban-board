# app/routes/board_route.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.board_model import BoardModel, board_members
from app.models.user_model import UserModel
from app.schemas.board_schemas import BoardCreateSchema, BoardUpdateSchema, BoardOutSchema, BoardInviteSchema
from app.core.security import create_access_token
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

router = APIRouter(prefix="/boards", tags=["Boards"])

SECRET_KEY = "super-secret"
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# 🔐 ดึง user_id จาก token
def get_current_user_id(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return int(payload.get("sub"))
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ✅ สร้าง Board
@router.post("/", response_model=BoardOutSchema)
def create_board(data: BoardCreateSchema, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    board = BoardModel(name=data.name, owner_id=user_id)
    db.add(board)
    db.commit()
    db.refresh(board)
    board.members.append(db.query(UserModel).get(user_id))  # auto join
    db.commit()
    return BoardOutSchema(
        id=board.id,
        name=board.name,
        owner_id=board.owner_id,
        members=[u.id for u in board.members]
    )

# ✅ แก้ชื่อ Board
@router.put("/{board_id}", response_model=BoardOutSchema)
def rename_board(board_id: int, data: BoardUpdateSchema, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    board = db.query(BoardModel).filter(BoardModel.id == board_id).first()
    if not board or board.owner_id != user_id:
        raise HTTPException(status_code=403, detail="No permission to edit")
    board.name = data.name
    db.commit()
    return BoardOutSchema(
        id=board.id,
        name=board.name,
        owner_id=board.owner_id,
        members=[u.id for u in board.members]
    )

# ✅ ลบ Board
@router.delete("/{board_id}")
def delete_board(board_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    board = db.query(BoardModel).filter(BoardModel.id == board_id).first()
    if not board or board.owner_id != user_id:
        raise HTTPException(status_code=403, detail="No permission to delete")
    db.delete(board)
    db.commit()
    return {"detail": "Board deleted"}

# ✅ เชิญสมาชิก
@router.post("/{board_id}/invite", response_model=BoardOutSchema)
def invite_member(board_id: int, invite: BoardInviteSchema, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    board = db.query(BoardModel).filter(BoardModel.id == board_id).first()
    if not board or board.owner_id != user_id:
        raise HTTPException(status_code=403, detail="No permission to invite")
    user = db.query(UserModel).get(invite.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user in board.members:
        raise HTTPException(status_code=400, detail="User already a member")
    board.members.append(user)
    db.commit()
    return BoardOutSchema(
        id=board.id,
        name=board.name,
        owner_id=board.owner_id,
        members=[u.id for u in board.members]
    )

# ✅ ดูบอร์ดที่ตัวเองมีส่วนร่วม
@router.get("/", response_model=List[BoardOutSchema])
def get_my_boards(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    user = db.query(UserModel).get(user_id)
    boards = user.joined_boards
    return [
        BoardOutSchema(
            id=b.id,
            name=b.name,
            owner_id=b.owner_id,
            members=[u.id for u in b.members]
        ) for b in boards
    ]
