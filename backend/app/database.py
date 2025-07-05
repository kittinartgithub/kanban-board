from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# เชื่อมต่อ PostgreSQL
DATABASE_URL = "postgresql://postgres:1234@localhost:5432/kanban_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

# ✅ ใช้ร่วมในทุกไฟล์ที่ต้องการ Session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
