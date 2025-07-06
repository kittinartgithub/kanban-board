// src/pages/RegisterPage.tsx
import { useState } from "react";
import { registerUser } from "../api/auth";
import { Link } from "react-router-dom";
import "../styles/AuthenticationForm.css";

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password_hash: "",
    first_name: "",
    last_name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      alert("Register Success!");
    } catch (err) {
      alert("Register Failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>ลงทะเบียน</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="ชื่อผู้ใช้"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="อีเมล"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password_hash"
            placeholder="รหัสผ่าน"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="first_name"
            placeholder="ชื่อจริง"
            onChange={handleChange}
          />
          <input
            type="text"
            name="last_name"
            placeholder="นามสกุล"
            onChange={handleChange}
          />
          <button type="submit">ลงทะเบียน</button>
        </form>
        <p className="auth-switch">
          มีบัญชีอยู่แล้ว? <Link to="/login">เข้าสู่ระบบ</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
