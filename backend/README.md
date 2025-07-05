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
│ ├── init.py
│ ├── main.py # จุดเริ่มต้น API
│ ├── models.py # ตารางตาม ERD (User, Board, Task, ...)
│ ├── database.py # เชื่อมต่อ PostgreSQL
│ └── schemas.py # Pydantic models
├── requirements.txt # ไลบรารีที่ใช้
└── README.md # 

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