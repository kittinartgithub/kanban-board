// src/pages/KanbanPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getColumns, createColumn } from "../api/columns";
import Column from "../components/Column";
import "../styles/kanban.css";
import { updateColumn, deleteColumn } from "../api/columns";
import { updateTask } from "../api/tasks";
import { createTask, deleteTask } from "../api/tasks";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

interface Task {
  id: number;
  name: string;
  description?: string;
  column_id: number;
  position: number;
}
interface ColumnType {
  id: number;
  name: string;
  tasks: Task[];
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

  const handleRenameColumn = async (columnId: number, newName: string) => {
    try {
      await updateColumn(columnId, newName);
      fetchColumns();
    } catch (err) {
      console.error("แก้ชื่อคอลัมน์ไม่สำเร็จ:", err);
    }
  };

  const handleDeleteColumn = async (columnId: number) => {
    if (!window.confirm("คุณแน่ใจว่าต้องการลบคอลัมน์นี้?")) return;
    try {
      await deleteColumn(columnId);
      fetchColumns();
    } catch (err) {
      console.error("ลบคอลัมน์ไม่สำเร็จ:", err);
    }
  };

  useEffect(() => {
    fetchColumns();
  }, [boardId]);

  const handleDragEnd = async (result: DropResult) => {
  const { source, destination, draggableId } = result;
  if (!destination) return;

  const taskId = parseInt(draggableId.replace("task-", ""));
  const sourceColId = parseInt(source.droppableId.replace("column-", ""));
  const destColId = parseInt(destination.droppableId.replace("column-", ""));

  if (sourceColId === destColId && source.index === destination.index) return;

  // Update position logic in frontend
  const updatedColumns = [...columns]; // clone columns
  const sourceCol = updatedColumns.find((col) => col.id === sourceColId);
  const destCol = updatedColumns.find((col) => col.id === destColId);
  if (!sourceCol || !destCol) return;

  // ทำให้แต่ละคอลัมน์มี tasks ในตัว (สมมติคุณเก็บ tasks ใน state)
  const sourceTasks = [...(sourceCol.tasks || [])];
  const destTasks = sourceColId === destColId ? sourceTasks : [...(destCol.tasks || [])];

  const [movedTask] = sourceTasks.splice(source.index, 1);
  destTasks.splice(destination.index, 0, movedTask);

  // update task object ให้รู้ว่ามันอยู่คอลัมน์ใหม่และตำแหน่งใหม่
  try {
    await updateTask(taskId, {
      column_id: destColId,
      position: destination.index,
    });

    // 🔁 โหลดใหม่หรืออัปเดต tasks ใน state ด้วย
    fetchColumns(); // หรือ fetchTasks() ถ้ามีแยก
  } catch (err) {
    console.error("อัปเดต Task ไม่สำเร็จ:", err);
  }
};


const handleAddTask = async (columnId: number, taskName: string) => {
  try {
    // สมมุติว่าคุณมี createTask(columnId, taskName)
    await createTask(columnId, taskName);
    fetchColumns(); // โหลดใหม่
  } catch (err) {
    console.error("เพิ่มการ์ดไม่สำเร็จ:", err);
  }
};

const handleEditTask = async (
  taskId: number,
  updates: Partial<Task>
) => {
  try {
    await updateTask(taskId, updates);
    fetchColumns(); // โหลดใหม่
  } catch (err) {
    console.error("แก้ไขการ์ดไม่สำเร็จ:", err);
  }
};

const handleDeleteTask = async (taskId: number) => {
  try {
    await deleteTask(taskId);
    fetchColumns(); // โหลดใหม่
  } catch (err) {
    console.error("ลบการ์ดไม่สำเร็จ:", err);
  }
};


  return (
  <div className="kanban-container">
    <h2 className="kanban-header">บอร์ด #{boardId}</h2>

    {loading ? (
      <p className="kanban-loading">กำลังโหลด...</p>
    ) : (
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-columns">
          {columns.map((col, index) => (
            <Column
              key={col.id}
              id={col.id}
              name={col.name}
              index={index}
              tasks={col.tasks} //  ส่ง tasks เข้าไป
              onDelete={handleDeleteColumn}
              onRename={handleRenameColumn}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}

          {/*  กล่องเพิ่มคอลัมน์ใหม่ */}
          <div className="add-column-box">
            <h3 className="add-column-title">เพิ่มคอลัมน์ใหม่</h3>
            <input
              type="text"
              className="add-column-input"
              placeholder="ชื่อคอลัมน์ใหม่"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
            />
            <button onClick={handleAddColumn} className="add-column-button">
              + เพิ่มคอลัมน์
            </button>
          </div>
        </div>
      </DragDropContext>
    )}
  </div>
);

}

export default KanbanPage;
