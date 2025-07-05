from fastapi import FastAPI
from app.models import user_model
from app.database import engine
from app.routes import user_route  #  import router

# สร้างตารางตาม model
user_model.Base.metadata.create_all(bind=engine)

# FastAPI instance
app = FastAPI()

# Register router ที่แยกไว้
app.include_router(user_route.router)