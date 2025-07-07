import React, { useState, useEffect } from "react";
import "../styles/TaskCard.css";

interface User {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
}

interface Task {
  id: number;
  name: string;
  description?: string;
  assignees?: User[];
}

interface Props {
  task: Task;
  index: number;
  onEdit: (id: number, name: string, description: string) => void;
  onDelete: (id: number) => void;
  users: User[];
  onAssignUser: (taskId: number, userId: number) => void;
}

const TaskCard: React.FC<Props> = ({ task, onEdit, onDelete, users, onAssignUser }) => {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description || "");

  useEffect(() => {
    // loadData(); // 🔒 ปิดการโหลด tag
  }, [task.id]);

  const handleSave = async () => {
    try {
      onEdit(task.id, name, description);
      setEditMode(false);
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  if (editMode) {
    return (
      <div className="taskcard-container">
        <input
          className="taskcard-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ชื่อ task"
        />
        <textarea
          className="taskcard-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="รายละเอียด"
        />

        {task.assignees && task.assignees.length > 0 && (
          <div className="taskcard-assignees">
            <strong>👥 ผู้รับผิดชอบ:</strong>
            <ul className="taskcard-assignees-list">
              {task.assignees.map(user => (
                <li key={user.id} className="taskcard-assignee">
                  {user.first_name || ""} {user.last_name || ""} ({user.username})
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="taskcard-btn-group">
          <button onClick={handleSave} className="taskcard-btn-save">บันทึก</button>
          <button onClick={() => setEditMode(false)} className="taskcard-btn-cancel">ยกเลิก</button>
        </div>
      </div>
    );
  }

  return (
    <div className="taskcard-container">
      <h4 className="taskcard-title">{task.name}</h4>
      {description && <p className="taskcard-desc">{description}</p>}

      {task.assignees && task.assignees.length > 0 && (
        <div className="taskcard-assignees">
          <strong>👥 ผู้รับผิดชอบ:</strong>
          <ul className="taskcard-assignees-list">
            {task.assignees.map((user) => (
              <li key={user.id} className="taskcard-assignee">
                {user.first_name || ""} {user.last_name || ""} ({user.username})
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="taskcard-assign-control">
        <label htmlFor={`assign-user-${task.id}`} className="taskcard-assign-label">
          <strong>มอบหมายผู้ใช้:</strong>
        </label>
        <select
          id={`assign-user-${task.id}`}
          defaultValue=""
          onChange={(e) => {
            const userId = Number(e.target.value);
            if (userId) {
              onAssignUser(task.id, userId);
            }
          }}
          className="taskcard-user-dropdown"
        >
          <option value="" disabled>เลือกผู้ใช้</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.first_name || ""} {user.last_name || ""} ({user.username})
            </option>
          ))}
        </select>
      </div>

      <div className="taskcard-btn-group">
        <button onClick={() => setEditMode(true)} className="taskcard-btn-edit">แก้ไข</button>
        <button onClick={() => onDelete(task.id)} className="taskcard-btn-delete">ลบ</button>
      </div>
    </div>
  );
}

export default TaskCard;