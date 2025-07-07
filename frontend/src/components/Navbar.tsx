// Navbar.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import { FaBell, FaUserPlus } from "react-icons/fa";
import NotificationDropdown from "../components/NotificationDropdown";
import ShareBoardPopup from "../components/ShareBoardPopup";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hideActions = ["/login", "/register"].includes(location.pathname);

  const [showPopup, setShowPopup] = useState(false);
  const [currentBoardId, setCurrentBoardId] = useState<number | null>(null);

  //  ดึง boardId จาก URL เช่น /boards/9
  useEffect(() => {
    const match = location.pathname.match(/^\/boards\/(\d+)/);
    if (match) {
      setCurrentBoardId(parseInt(match[1], 10));
    } else {
      setCurrentBoardId(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleProfileClick = () => {
    alert("ข้อมูลบัญชี");
  };

  return (
    <nav className="navbar">
      {/* Logo / Title */}
      <div
        className={`navbar-title ${hideActions ? "disabled-logo" : ""}`}
        onClick={() => {
          if (!hideActions) navigate("/boards");
        }}
      >
        📝 Kanban Board
      </div>

      {/* Action Buttons */}
      {!hideActions && (
        <div className="navbar-actions">
          {/* ปุ่มแชร์ */}
          <div className="share-wrapper">
            <button
              className="btn share-btn"
              onClick={() => setShowPopup(!showPopup)}
            >
              <FaUserPlus className="icon-left" />
              แชร์
            </button>
          </div>

          {/* Dropdown แจ้งเตือน */}
          <NotificationDropdown />

          {/* ไอคอนโปรไฟล์ */}
          <div className="profile-icon" onClick={handleProfileClick}>
            KJ
          </div>

          {/* ปุ่มออกจากระบบ */}
          <button onClick={handleLogout} className="btn logout-btn">
            ออกจากระบบ
          </button>
        </div>
      )}

      {/* ป๊อปอัปเชิญผู้ใช้ */}
      {showPopup && currentBoardId !== null && (
        <ShareBoardPopup
          boardId={currentBoardId}
          onClose={() => setShowPopup(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
