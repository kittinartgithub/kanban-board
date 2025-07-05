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
├── src/
│   ├── api/                     # API เรียก backend (axios, fetch)
│   │   ├── auth.ts
│   │   ├── boards.ts
│   │   ├── columns.ts
│   │   ├── tasks.ts
│   │   ├── tags.ts
│   │   └── notifications.ts
│
│   ├── components/             # UI Components
│   │   ├── BoardCard.tsx
│   │   ├── Column.tsx
│   │   ├── TaskCard.tsx
│   │   ├── TagLabel.tsx
│   │   ├── NotificationBell.tsx
│   │   └── AuthForm.tsx
│
│   ├── pages/                  # หน้าหลัก (Page-level components)
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── BoardPage.tsx       # แสดงทุก board ที่ user เข้าร่วม
│   │   ├── KanbanPage.tsx      # แสดง columns + tasks ใน board เดียว
│   │   └── NotificationsPage.tsx
│
│   ├── styles/                 # CSS/SCSS
│   │   └── AuthenticationForm.css
│
│   ├── App.tsx                 # Routing หลักของแอป
│   ├── App.css
│   ├── index.tsx              # Entry point ReactDOM.render()
│   └── react-app-env.d.ts


### 1. ติดตั้ง dependencies

```bash
cd frontend
npm install

2. สั่งรัน development server
npm start

🌐 การเชื่อมต่อกับ Backendฃ

Endpoint หลักของ API อยู่ที่: http://localhost:8000/