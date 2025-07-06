import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "../styles/Navbar.css";
import { FaBell, FaUserPlus } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const hideActions = ["/login", "/register"].includes(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleProfileClick = () => {
    alert("ข้อมูลบัญชี");
  };

  const handleShareClick = () => {
    alert("ระบบแชร์ผู้ร่วมงานใน Task (จะเพิ่มภายหลัง)");
  };

  return (
    <nav className="navbar">
      <div
        className={`navbar-title ${hideActions ? 'disabled-logo' : ''}`}
        onClick={() => {
          if (!hideActions) navigate('/boards');
        }}
      >
        📝 Kanban Board
      </div>

      {!hideActions && (
        <div className="navbar-actions">
          {/* แชร์ผู้ร่วมงาน */}
          <button className="btn share-btn" onClick={handleShareClick}>
            <FaUserPlus className="icon-left" />
            แชร์
          </button>

          {/* แจ้งเตือน */}
          <div className="icon-button">
            <FaBell className="icon" title="การแจ้งเตือน" />
          </div>

          {/* โปรไฟล์ */}
          <div className="profile-icon" onClick={handleProfileClick} title="บัญชีผู้ใช้">
            KJ
          </div>

          {/* ออกจากระบบ */}
          <button onClick={handleLogout} className="btn logout-btn">
            ออกจากระบบ
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
