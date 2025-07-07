from sqlalchemy import Column, Integer, String, Text, ForeignKey, Table, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.tag_model import task_tags

# 🔁 Many-to-Many ระหว่าง Task ↔ User (assignees)
class TaskAssigneeModel(Base):
    __tablename__ = "task_assignees"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    assigned_at = Column(DateTime(timezone=True), server_default=func.now())

    # Optional: สำหรับ relationship กลับ (ไม่บังคับ)
    task = relationship("TaskModel", back_populates="assignees_link")
    user = relationship("UserModel", back_populates="tasks_assigned_link")

    __table_args__ = (
        # ป้องกันการ assign คนเดิมซ้ำ
        {"sqlite_autoincrement": True},
    )

# 🔧 Model หลักของ Task
class TaskModel(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, default="")
    column_id = Column(Integer, ForeignKey("columns.id", ondelete="CASCADE"))
    position = Column(Integer, default=0)

    # ⛓️ ความสัมพันธ์
    column = relationship("ColumnModel", backref="tasks")
    tags = relationship("TagModel", secondary=task_tags, back_populates="tasks")

    # 👤 ผู้รับผิดชอบแบบหลายคน
    assignees_link = relationship("TaskAssigneeModel", back_populates="task", cascade="all, delete-orphan")
    assignees = relationship("UserModel", secondary="task_assignees", viewonly=True)

# ✅ ในฝั่ง UserModel (models/user_model.py) ต้องเพิ่ม:
# tasks_assigned_link = relationship("TaskAssigneeModel", back_populates="user", cascade="all, delete-orphan")
