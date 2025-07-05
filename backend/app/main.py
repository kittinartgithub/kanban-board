from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine
from app.models import user_model
from app.routes import auth_route, user_route

from app.models import user_model, board_model  # ⬅️ เพิ่ม board_model
from app.routes import auth_route, user_route, board_route  # ⬅️ เพิ่ม board_route

from app.models import column_model
from app.routes import column_route

from app.models import task_model
from app.routes import task_route

from app.models import notification_model


# สร้างตารางตาม model
user_model.Base.metadata.create_all(bind=engine)
board_model.Base.metadata.create_all(bind=engine)
column_model.Base.metadata.create_all(bind=engine)
task_model.Base.metadata.create_all(bind=engine)
notification_model.Base.metadata.create_all(bind=engine)

# ✅ สร้าง FastAPI instance
app = FastAPI()

# ✅ เพิ่ม CORS middleware ให้ frontend (React) เรียกได้
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Register routers
app.include_router(auth_route.router)
app.include_router(user_route.router)
app.include_router(board_route.router) 
app.include_router(column_route.router) 
app.include_router(task_route.router)


