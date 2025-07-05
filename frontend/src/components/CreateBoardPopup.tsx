import React, { useState } from 'react';
import { createBoard } from '../api/boards';
import { useNavigate } from 'react-router-dom';
import "../styles/CreateBoardPopup.css";


interface Props {
  onClose: () => void;
}

const CreateBoardPopup: React.FC<Props> = ({ onClose }) => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const newBoard = await createBoard(name);
      onClose();
      navigate(`/boards/${newBoard.id}`);
    } catch (err) {
      alert('สร้างบอร์ดไม่สำเร็จ');
    }
  };

  return (
  <div className="create-board-overlay">
    <div className="create-board-box">
      <h3>สร้างบอร์ดใหม่</h3>
      <form onSubmit={handleSubmit}>
        <input
          className="create-board-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ชื่อบอร์ด"
          required
        />
        <div className="create-board-actions">
          <button type="submit" className="create-board-submit-btn">สร้าง</button>
          <button type="button" onClick={onClose} className="create-board-cancel-btn">ยกเลิก</button>
        </div>
      </form>
    </div>
  </div>
);
}

export default CreateBoardPopup;
