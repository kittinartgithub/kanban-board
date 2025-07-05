// src/components/Navbar.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Navbar.css";
import CreateBoardPopup from '../components/CreateBoardPopup';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <div
          className="navbar-title"
          onClick={() => navigate('/boards')}
        >
          📝 Kanban Board
        </div>
        <div className="navbar-actions">
          <button
            onClick={() => setShowPopup(true)}
            className="btn create-btn"
          >
            + สร้างบอร์ด
          </button>
          <button
            onClick={handleLogout}
            className="btn logout-btn"
          >
            ออกจากระบบ
          </button>
        </div>
      </nav>

      {showPopup && <CreateBoardPopup onClose={() => setShowPopup(false)} />}
    </>
  );
};

export default Navbar;
