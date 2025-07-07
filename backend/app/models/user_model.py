from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship  # ✅ เพิ่มมาด้วย
from app.database import Base

class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    first_name = Column(String(100))
    last_name = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    #  เพิ่มความสัมพันธ์กับ task_assignees table
    tasks_assigned_link = relationship(
        "TaskAssigneeModel",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    @property
    def full_name(self):
        return f"{self.first_name or ''} {self.last_name or ''}".strip()
