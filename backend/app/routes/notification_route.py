# app/routes/notification_route.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.notification_model import NotificationModel
from app.schemas.notification_schemas import NotificationOutSchema
from app.core.security import SECRET_KEY, ALGORITHM
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from typing import List

router = APIRouter(prefix="/notifications", tags=["Notifications"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user_id(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return int(payload.get("sub"))
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

#  ดึงแจ้งเตือนของตัวเอง
@router.get("/me", response_model=List[NotificationOutSchema])
def get_my_notifications(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    notifications = db.query(NotificationModel)\
        .filter(NotificationModel.user_id == user_id)\
        .order_by(NotificationModel.created_at.desc()).all()
    return notifications

#  กดอ่านแจ้งเตือน
@router.put("/{notification_id}/read")
def mark_as_read(notification_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    notif = db.query(NotificationModel).filter(NotificationModel.id == notification_id).first()
    if not notif or notif.user_id != user_id:
        raise HTTPException(status_code=404, detail="Notification not found or not yours")
    notif.is_read = True
    db.commit()
    return {"detail": "Marked as read"}

#  ล้างแจ้งเตือนทั้งหมดของตัวเอง
@router.delete("/clear")
def clear_all_notifications(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    db.query(NotificationModel).filter(NotificationModel.user_id == user_id).delete()
    db.commit()
    return {"detail": "All notifications cleared"}
