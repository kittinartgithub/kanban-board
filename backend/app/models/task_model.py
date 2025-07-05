# app/models/task_model.py

from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class TaskModel(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, default="")
    column_id = Column(Integer, ForeignKey("columns.id", ondelete="CASCADE"))
    assignee_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    position = Column(Integer, default=0)  # ตำแหน่งใน column

    column = relationship("ColumnModel", backref="tasks")
    assignee = relationship("UserModel", backref="assigned_tasks")
