# app/routes/invitation_route.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.board_invitation_model import BoardInvitationModel
from app.models.board_model import BoardModel
from app.models.user_model import UserModel
from app.schemas.board_invitation_schemas import InvitationCreateSchema, InvitationRespondSchema, InvitationOutSchema
from app.models.notification_model import NotificationModel
from app.core.security import get_current_user_id

router = APIRouter(prefix="/invitations", tags=["Board Invitations"])

# ส่งคำเชิญพร้อมสร้าง Notification
@router.post("/", response_model=InvitationOutSchema)
def send_invitation(data: InvitationCreateSchema, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    board = db.query(BoardModel).filter(BoardModel.id == data.board_id).first()
    if not board or board.owner_id != user_id:
        raise HTTPException(status_code=403, detail="No permission to invite")

    existing = db.query(BoardInvitationModel).filter_by(
        board_id=data.board_id, invited_user_id=data.invited_user_id, status="pending"
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already invited")

    # สร้างคำเชิญ
    invite = BoardInvitationModel(
        board_id=data.board_id,
        invited_user_id=data.invited_user_id,
        invited_by_user_id=user_id
    )
    db.add(invite)
    db.commit()
    
    # สร้าง Notification
    inviter = db.query(UserModel).get(user_id)
    notif = NotificationModel(
        user_id=data.invited_user_id,
        title="คุณได้รับคำเชิญเข้าร่วมบอร์ด",
        message=f"{inviter.full_name} ได้เชิญคุณเข้าร่วมบอร์ด '{board.name}'",
        type="invitation",
        related_id=invite.id
    )
    db.add(notif)
    db.commit()
    
    return invite

# ตอบรับหรือปฏิเสธคำเชิญ
@router.put("/{invite_id}/respond", response_model=InvitationOutSchema)
def respond_to_invitation(invite_id: int, data: InvitationRespondSchema, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    invite = db.query(BoardInvitationModel).filter(BoardInvitationModel.id == invite_id).first()
    if not invite or invite.invited_user_id != user_id:
        raise HTTPException(status_code=403, detail="No permission to respond")

    if invite.status != "pending":
        raise HTTPException(status_code=400, detail="Already responded")

    invite.status = data.status
    invite.responded_at = db.execute(text("SELECT NOW()")).scalar()

    if data.status == "accepted":
        # เพิ่มเข้าเป็นสมาชิก
        board = db.query(BoardModel).filter(BoardModel.id == invite.board_id).first()
        user = db.query(UserModel).get(user_id)
        if board and user and user not in board.members:
            board.members.append(user)

    db.commit()
    return invite
