from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.board_invitation_model import BoardInvitationModel
from app.models.board_model import BoardModel, board_members
from app.models.user_model import UserModel
from app.schemas.board_invitation_schemas import InvitationCreateSchema, InvitationRespondSchema, InvitationOutSchema
from app.schemas.notification_schemas import NotificationOutSchema  # เพิ่มการ import ที่นี่
from app.core.security import get_current_user_id
from app.models.notification_model import NotificationModel
from sqlalchemy import text


router = APIRouter(prefix="/invitations", tags=["Board Invitations"])

# 🔁 ส่งคำเชิญพร้อมสร้าง Notification
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

    #  สร้างคำเชิญ
    invite = BoardInvitationModel(
        board_id=data.board_id,
        invited_user_id=data.invited_user_id,
        invited_by_user_id=user_id
    )
    db.add(invite)
    db.flush()  # ยังไม่ commit เพื่อใช้ invite.id

    #  สร้าง Notification
    inviter = db.query(UserModel).get(user_id)
    # ส่งการแจ้งเตือนหลังจากเชิญ
    notif = NotificationModel(
        user_id=data.invited_user_id,
        title="คุณได้รับคำเชิญเข้าร่วมบอร์ด",
        message=f"{inviter.full_name} ได้เชิญคุณเข้าร่วมบอร์ด '{board.name}'",
        type="invitation",
        related_id=invite.id,
        board_name=board.name,  # เพิ่มชื่อบอร์ด
        inviter_name=inviter.full_name  # เพิ่มชื่อผู้เชิญ
    )
    db.add(notif)

    db.commit()
    db.refresh(invite)
    return invite


#  ตอบรับหรือปฏิเสธคำเชิญ
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

    # ส่งข้อมูลบอร์ดและผู้เชิญกลับ
    return {
        "invite": invite,
        "board_name": board.name,
        "inviter_name": user.full_name
    }


#  ดูคำเชิญของตัวเอง
@router.get("/", response_model=List[InvitationOutSchema])
def get_my_invitations(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    invites = db.query(BoardInvitationModel).filter(BoardInvitationModel.invited_user_id == user_id).all()
    return invites

#  ดูเฉพาะคำเชิญที่ยังไม่ได้ตอบรับ
@router.get("/pending", response_model=List[InvitationOutSchema])
def get_pending_invitations(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    invites = db.query(BoardInvitationModel).filter(
        BoardInvitationModel.invited_user_id == user_id,
        BoardInvitationModel.status == "pending"
    ).all()
    return invites

#  ดึงรายชื่อ user_id ที่ถูกเชิญในบอร์ดนั้น
@router.get("/board/{board_id}/invited-users", response_model=List[int])
def get_invited_user_ids(board_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    board = db.query(BoardModel).filter(BoardModel.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")

    # ตรวจสอบว่า requester เป็นเจ้าของหรือสมาชิก
    is_owner = board.owner_id == user_id
    is_member = db.query(board_members).filter_by(board_id=board_id, user_id=user_id).first()
    if not is_owner and not is_member:
        raise HTTPException(status_code=403, detail="No access to this board")

    invited_ids = db.query(BoardInvitationModel.invited_user_id).filter(
        BoardInvitationModel.board_id == board_id,
        BoardInvitationModel.status == "pending"
    ).all()

    return [i[0] for i in invited_ids]

@router.get("/notifications", response_model=List[NotificationOutSchema])
def get_notifications(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    notifications = db.query(NotificationModel).filter(NotificationModel.user_id == user_id).all()

    # เพิ่มข้อมูลบอร์ดและผู้เชิญ
    for notif in notifications:
        if notif.type == "invitation":
            invite = db.query(BoardInvitationModel).filter(BoardInvitationModel.id == notif.related_id).first()
            board = db.query(BoardModel).filter(BoardModel.id == invite.board_id).first()
            inviter = db.query(UserModel).filter(UserModel.id == invite.invited_by_user_id).first()
            notif.board_name = board.name if board else "N/A"
            notif.inviter_name = inviter.full_name if inviter else "N/A"
    
    return notifications
