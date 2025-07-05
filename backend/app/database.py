from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# ใช้ค่าเชื่อมต่อโดยตรง หรือใช้ dotenv ก็ได้
DATABASE_URL = "postgresql://postgres:1234@localhost:5432/kanban_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()