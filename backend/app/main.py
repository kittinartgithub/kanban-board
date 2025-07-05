from fastapi import FastAPI
from app.database import engine
from app.models import user_model
from app.routes import auth_route, user_route

# สร้างตารางตาม model
user_model.Base.metadata.create_all(bind=engine)

# FastAPI instance
app = FastAPI()

# Register router ที่แยกไว้
app.include_router(user_route.router)
app.include_router(auth_route.router)