// src/pages/KanbanPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getColumns, createColumn } from "../api/columns";
import Column from "../components/Column";
import "../styles/kanban.css";

interface ColumnType {
  id: number;
  name: string;
}

const KanbanPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const boardId = Number(id);
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [loading, setLoading] = useState(true);
  const [newColumnName, setNewColumnName] = useState("");

  const fetchColumns = async () => {
    try {
      const data = await getColumns(boardId);
      setColumns(data);
    } catch (err) {
      console.error("โหลด column ไม่สำเร็จ:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddColumn = async () => {
    if (!newColumnName.trim()) return;
    try {
      await createColumn(newColumnName, boardId);
      setNewColumnName("");
      fetchColumns();
    } catch (err) {
      console.error("สร้างคอลัมน์ไม่สำเร็จ:", err);
    }
  };

  useEffect(() => {
    fetchColumns();
  }, [boardId]);

  return (
  <div className="kanban-container">
    <h2 className="kanban-header">บอร์ด #{boardId}</h2>

    {loading ? (
      <p className="kanban-loading">กำลังโหลด...</p>
    ) : (
      <div className="kanban-columns">
        {columns.map((col) => (
          <Column key={col.id} id={col.id} name={col.name} />
        ))}

        {/* ✅ กล่องเพิ่มคอลัมน์ใหม่ */}
        <div className="add-column-box">
          <h3 className="add-column-title">เพิ่มคอลัมน์ใหม่</h3>
          <input
            type="text"
            className="add-column-input"
            placeholder="ชื่อคอลัมน์ใหม่"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
          />
          <button
            onClick={handleAddColumn}
            className="add-column-button"
          >
            + เพิ่มคอลัมน์
          </button>
        </div>
      </div>
    )}
  </div>
);
}

export default KanbanPage;
