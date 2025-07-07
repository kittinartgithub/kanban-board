// src/components/Column.tsx
import React, { useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import "../styles/Column.css";

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

interface ColumnProps {
  id: number;
  name: string;
  index: number;
  tasks: Task[];
  onDelete: (id: number) => void;
  onRename: (id: number, name: string) => void;
  onAddTask: (columnId: number, taskName: string) => void;
  onEditTask: (taskId: number, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: number) => void;
  users: User[]; // เพิ่ม prop สำหรับผู้ใช้
  onAssignUser: (taskId: number, userId: number) => void;
}

const Column: React.FC<ColumnProps> = ({
  id,
  name,
  index,
  tasks,
  onDelete,
  onRename,
  onAddTask,
  onEditTask,
  onDeleteTask,
  users,
  onAssignUser,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [columnName, setColumnName] = useState(name);
  const [newTaskName, setNewTaskName] = useState("");

  return (
    <div className="column-container">
      <div className="column-header">
        {editMode ? (
          <div className="column-header-edit">
            <input
              className="column-title-input"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              autoFocus
            />
            <button
              className="column-btn column-btn-save"
              onClick={() => {
                setEditMode(false);
                if (columnName !== name) {
                  onRename(id, columnName);
                }
              }}
            >
              ✔️
            </button>
            <button
              className="column-btn column-btn-cancel"
              onClick={() => {
                setEditMode(false);
                setColumnName(name);
              }}
            >
              ยกเลิก
            </button>
          </div>
        ) : (
          <div className="column-header-display">
            <h3 className="column-title">{columnName}</h3>
            <div className="column-actions">
              <button
                className="column-btn column-btn-rename"
                onClick={() => setEditMode(true)}
                title="แก้ชื่อ"
              >
                แก้
              </button>
              <button
                className="column-btn column-btn-delete"
                onClick={() => onDelete(id)}
                title="ลบ"
              >
                ลบ
              </button>
            </div>
          </div>
        )}
      </div>

      <Droppable droppableId={id.toString()}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="column-task-list"
          >
            {tasks.map((task, index) => (
              <Draggable
                key={task.id}
                draggableId={task.id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskCard
                      task={task}
                      index={index}
                      onEdit={(id: number, name: string, desc: string) =>
                        onEditTask(id, { name, description: desc })
                      }
                      onDelete={onDeleteTask}
                      users={users} // ✅ ส่ง users ไป
                      onAssignUser={onAssignUser} // ✅ ส่งฟังก์ชัน assign ไป
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="column-add-task">
        <input
          type="text"
          className="column-input"
          placeholder="ชื่อการ์ดใหม่"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
        />
        <button
          className="column-button"
          onClick={() => {
            if (newTaskName.trim()) {
              onAddTask(id, newTaskName);
              setNewTaskName("");
            }
          }}
        >
          + เพิ่มการ์ด
        </button>
      </div>
    </div>
  );
};

export default Column;
