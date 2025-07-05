# 📦 Kanban Board API (FastAPI + PostgreSQL)

ระบบ API สำหรับระบบจัดการ Kanban Board เช่น Trello โดยใช้ FastAPI, PostgreSQL และ SQLAlchemy

---

## 📌 เทคโนโลยีที่ใช้

- ✅ FastAPI
- ✅ SQLAlchemy (ORM)
- ✅ PostgreSQL
- ✅ Pydantic
- ✅ Uvicorn

---

## 📁 โครงสร้างไฟล์
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                  # จุดเริ่มต้น FastAPI
│
│   ├── core/                    # ตั้งค่าระบบ เช่น security, config
│   │   └── security.py          # จัดการ JWT, password hash
│
│   ├── database.py              # SQLAlchemy: engine, SessionLocal, Base
│
│   ├── models/                  # SQLAlchemy models (ตาราง)
│   │   ├── user_model.py
│   │   ├── board_model.py
│   │   └── task_model.py
│
│   ├── schemas/                 # Pydantic schemas (request/response)
│   │   ├── user_schemas.py
│   │   ├── board_schemas.py
│   │   └── task_schemas.py
│
│   ├── routes/                  # API route (endpoint)
│   │   ├── auth_route.py        # /auth/login, /auth/register
│   │   ├── user_route.py        # /users/
│   │   ├── board_route.py       # /boards/
│   │   └── task_route.py        # /tasks/
│
│   └── utils/                   # (ถ้ามี) helper function ทั่วไป เช่น email, time
│       └── __init__.py
│
├── requirements.txt             # รายชื่อไลบรารีทั้งหมด
└── README.md                    # วิธีใช้งาน + รันโปรเจกต์


---

## ⚙️ วิธีติดตั้งและใช้งาน

### 1. สร้าง Virtual Environment

```bash
cd backend
python -m venv venv
venv\Scripts\activate      # (Windows)
# หรือ
source venv/bin/activate  # (macOS/Linux)

2. ติดตั้ง dependencies
pip install -r requirements.txt

3. เตรียมฐานข้อมูล PostgreSQL
ต้องมี PostgreSQL ติดตั้งในเครื่อง และสร้างฐานข้อมูลชื่อ kanban_db

Database: kanban_db

    Username: postgres
    Password: 1234
    Host: localhost
    Port: 5432

4. รันเซิร์ฟเวอร์ FastAPI
cd backend/ uvicorn app.main:app --reload