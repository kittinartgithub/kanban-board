# app/models/column_model.py

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class ColumnModel(Base):
    __tablename__ = "columns"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    board_id = Column(Integer, ForeignKey("boards.id", ondelete="CASCADE"))

    board = relationship("BoardModel", backref="columns")
