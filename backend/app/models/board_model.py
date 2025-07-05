# app/models/board_model.py

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table, func
from sqlalchemy.orm import relationship
from app.database import Base

# ตารางเชื่อมระหว่าง board กับ user (สมาชิกในบอร์ด)
board_members = Table(
    "board_members",
    Base.metadata,
    Column("board_id", Integer, ForeignKey("boards.id")),
    Column("user_id", Integer, ForeignKey("users.id"))
)

class BoardModel(Base):
    __tablename__ = "boards"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("UserModel", backref="owned_boards")
    members = relationship("UserModel", secondary=board_members, backref="joined_boards")
