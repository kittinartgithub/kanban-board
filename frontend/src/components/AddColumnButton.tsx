import React, { useState } from "react";
import { createColumn } from "../api/columns";
import { useParams } from "react-router-dom";
import "../styles/AddColumnButton.css";

const AddColumnButton: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [showPopup, setShowPopup] = useState(false);
  const [columnName, setColumnName] = useState("");

  const handleAddColumn = async () => {
    if (!columnName.trim()) {
      alert("กรุณากรอกชื่อคอลัมน์");
      return;
    }
    try {
      await createColumn(columnName, Number(id)); // API call
      setColumnName(""); // Clear input after successful add
      setShowPopup(false); // Close popup
      // Refresh columns (optional: trigger a state update in KanbanPage)
    } catch (err) {
      alert("เพิ่มคอลัมน์ไม่สำเร็จ");
    }
  };

  return (
    <div>
      <button
        className="add-column-btn"
        onClick={() => setShowPopup(true)}
      >
        + เพิ่มคอลัมน์
      </button>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>เพิ่มคอลัมน์ใหม่</h3>
            <input
              type="text"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              placeholder="ชื่อคอลัมน์"
            />
            <div className="popup-actions">
              <button onClick={handleAddColumn} className="btn-submit">เพิ่ม</button>
              <button onClick={() => setShowPopup(false)} className="btn-cancel">ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddColumnButton;
