# app/models/notification_model.py
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, func
from app.database import Base
from sqlalchemy.dialects.postgresql import JSON


class NotificationModel(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String(255), nullable=False)
    message = Column(String(500), nullable=True)
    type = Column(String(50), default="task")
    related_id = Column(Integer)  # เช่น task_id
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    read_at = Column(DateTime(timezone=True), nullable=True)

    # เพิ่มฟิลด์ใหม่
    board_name = Column(String(255), nullable=True)  # ชื่อบอร์ด
    inviter_name = Column(String(255), nullable=True)  # ชื่อผู้เชิญ
    
    extra_data = Column(JSON, nullable=True)
