# app/models/invitation_model.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base

class BoardInvitationModel(Base):
    __tablename__ = "board_invitations"

    id = Column(Integer, primary_key=True, index=True)
    board_id = Column(Integer, ForeignKey("boards.id", ondelete="CASCADE"))
    invited_user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    invited_by_user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    status = Column(String(20), default="pending")  # "pending", "accepted", "declined"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    responded_at = Column(DateTime(timezone=True), nullable=True)
    
    board = relationship("BoardModel", back_populates="invitations")
    invited_user = relationship("UserModel", foreign_keys=[invited_user_id])
    inviter = relationship("UserModel", foreign_keys=[invited_by_user_id])
