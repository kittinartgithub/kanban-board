// src/components/TaskCard.tsx

import React, { useState } from "react";

interface Task {
  id: number;
  name: string;
  description?: string;
}

interface Props {
  task: Task;
  onEdit: (id: number, name: string, description: string) => void;
  onDelete: (id: number) => void;
}

const TaskCard: React.FC<Props> = ({ task, onEdit, onDelete }) => {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description || "");

  const handleSave = () => {
    onEdit(task.id, name, description);
    setEditMode(false);
  };

  return (
    <div className="bg-white p-2 rounded shadow mb-2">
      {editMode ? (
        <>
          <input
            className="border w-full mb-1 px-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            className="border w-full mb-1 px-1 text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex gap-2">
            <button onClick={handleSave} className="text-green-600 text-sm">
              บันทึก
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="text-gray-600 text-sm"
            >
              ยกเลิก
            </button>
          </div>
        </>
      ) : (
        <>
          <h4 className="font-medium">{task.name}</h4>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => setEditMode(true)}
              className="text-blue-600 text-xs"
            >
              แก้
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="text-red-500 text-xs"
            >
              ลบ
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskCard;
