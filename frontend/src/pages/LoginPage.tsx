// src/pages/LoginPage.tsx
import { useState, useEffect } from "react";
import { loginUser } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import "../styles/AuthenticationForm.css";

function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) navigate("/boards");
  // }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      localStorage.setItem("token", response.access_token);
      navigate("/boards");
    } catch (err) {
      alert("Login Failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>เข้าสู่ระบบ</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="ชื่อผู้ใช้"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="รหัสผ่าน"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">เข้าสู่ระบบ</button>
        </form>
        <p className="auth-switch">
          ยังไม่มีบัญชี? <Link to="/register">ลงทะเบียน</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
