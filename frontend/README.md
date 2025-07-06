# 🖥️ Kanban Board Frontend (React + TypeScript)

ระบบ Frontend สำหรับระบบจัดการ Kanban Board (เช่น Trello) พัฒนาโดยใช้ React, TypeScript และเชื่อมต่อกับ API FastAPI

---

## 📌 เทคโนโลยีที่ใช้

- ✅ React 18
- ✅ TypeScript
- ✅ React Router v6
- ✅ Axios (เชื่อม API)
- ✅ Context API หรือ Zustand (จัดการสถานะ)
- ✅ CSS Modules หรือ Tailwind (กำหนดเอง)

## 📁 โครงสร้างไฟล์
frontend/
├── public/
│   └── ...                     # ไฟล์ static เช่น index.html, icons
│
├── src/
│   ├── api/                   # API เรียก backend (axios, fetch)
│   │   ├── auth.ts
│   │   ├── boards.ts
│   │   ├── columns.ts
│   │   ├── tasks.ts
│   │   └── tags.ts
│
│   ├── components/            # ส่วนประกอบ UI (Component-level)
│   │   ├── AddColumnButton.tsx
│   │   ├── BoardCard.tsx
│   │   ├── Column.tsx
│   │   ├── ConfirmationDialog.tsx
│   │   ├── CreateBoardPopup.tsx
│   │   ├── Navbar.tsx
│   │   └── TaskCard.tsx
│
│   ├── pages/                 # หน้า Page-level components
│   │   ├── BoardPage.tsx
│   │   ├── KanbanPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│
│   ├── styles/                # ไฟล์ CSS เฉพาะแต่ละ component/page
│   │   ├── AddColumnButton.css
│   │   ├── AuthenticationForm.css
│   │   ├── BoardCard.css
│   │   ├── BoardPage.css
│   │   ├── boards.css
│   │   ├── Column.css
│   │   ├── confirmation-dialog.css
│   │   ├── CreateBoardPopup.css
│   │   ├── kanban.css
│   │   ├── LoginPage.css
│   │   ├── Navbar.css
│   │   ├── RegisterPage.css
│   │   └── TaskCard.css
│
│   ├── App.tsx                # Routing หลักของแอป
│   ├── App.css
│   ├── index.tsx             # Entry point
│   └── react-app-env.d.ts
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json



### 1. ติดตั้ง dependencies

```bash
cd frontend
npm install

2. สั่งรัน development server
npm start

🌐 การเชื่อมต่อกับ Backendฃ

Endpoint หลักของ API อยู่ที่: http://localhost:8000/