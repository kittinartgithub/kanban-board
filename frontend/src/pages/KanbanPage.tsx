import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getColumns, createColumn, updateColumn, deleteColumn } from "../api/columns";
import { createTask, deleteTask, updateTask } from "../api/tasks";
import Column from "../components/Column";
import "../styles/kanban.css";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";

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

const gradientOptions = [
  { label: "ม่วง-น้ำเงิน", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { label: "ชมพู-แดง", value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { label: "เขียว-ฟ้า", value: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
  { label: "ฟ้า-น้ำเงินเข้ม", value: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)" },

  { label: "พาสเทล ฟ้า-ชมพู", value: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)" },
  { label: "พาสเทล เหลือง-ส้ม", value: "linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)" },
  { label: "พาสเทล เขียว-ฟ้า", value: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)" },
  { label: "พาสเทล ชมพู-ม่วง", value: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)" },
  { label: "พาสเทล ม่วง-ฟ้า", value: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)" },
];

const KanbanPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const boardId = Number(id);
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [loading, setLoading] = useState(true);
  const [newColumnName, setNewColumnName] = useState("");
  const [boardName, setBoardName] = useState("");
  const [backgroundGradient, setBackgroundGradient] = useState(
    localStorage.getItem("kanbanGradient") || gradientOptions[0].value
  );

  const token = localStorage.getItem("token");

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

  const fetchBoardName = async () => {
    if (!token) {
      console.warn("ไม่พบ token — ข้ามการโหลดชื่อบอร์ด");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8000/boards/${boardId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const board = response.data;
      if (board?.name) {
        setBoardName(board.name);
      } else {
        console.warn("ไม่พบชื่อบอร์ดในข้อมูลที่ได้รับ");
      }
    } catch (error: any) {
      console.error("❌ โหลดชื่อบอร์ดไม่สำเร็จ:", error?.response?.data || error.message);
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

  const handleAddTask = async (columnId: number, taskName: string) => {
    try {
      await createTask(columnId, taskName);
      fetchColumns();
    } catch (err) {
      console.error("เพิ่มการ์ดไม่สำเร็จ:", err);
    }
  };

  const handleEditTask = async (taskId: number, updates: Partial<Task>) => {
    try {
      await updateTask(taskId, updates);
      fetchColumns();
    } catch (err) {
      console.error("แก้ไขการ์ดไม่สำเร็จ:", err);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      fetchColumns();
    } catch (err) {
      console.error("ลบการ์ดไม่สำเร็จ:", err);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const taskId = parseInt(draggableId.replace("task-", ""));
    const sourceColId = parseInt(source.droppableId.replace("column-", ""));
    const destColId = parseInt(destination.droppableId.replace("column-", ""));

    if (sourceColId === destColId && source.index === destination.index) return;

    const updatedColumns = [...columns];
    const sourceCol = updatedColumns.find((col) => col.id === sourceColId);
    const destCol = updatedColumns.find((col) => col.id === destColId);
    if (!sourceCol || !destCol) return;

    const sourceTasks = [...(sourceCol.tasks || [])];
    const destTasks = sourceColId === destColId ? sourceTasks : [...(destCol.tasks || [])];

    const [movedTask] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, movedTask);

    try {
      await updateTask(taskId, {
        column_id: destColId,
        position: destination.index,
      });
      fetchColumns();
    } catch (err) {
      console.error("อัปเดต Task ไม่สำเร็จ:", err);
    }
  };

  const handleGradientChange = (value: string) => {
    setBackgroundGradient(value);
    localStorage.setItem("kanbanGradient", value);
  };

  useEffect(() => {
    fetchColumns();
    fetchBoardName();
  }, [boardId]);

  return (
    <div className="kanban-page" style={{ background: backgroundGradient }}>
      <h2 className="kanban-header">{boardName ? `บอร์ด: ${boardName}` : `บอร์ด #${boardId}`}</h2>

      <div className="gradient-selector">
  <label htmlFor="gradientSelect" className="gradient-label">
    🎨 พื้นหลัง:
  </label>
  <select
    id="gradientSelect"
    value={backgroundGradient}
    onChange={(e) => handleGradientChange(e.target.value)}
    className="gradient-dropdown"
  >
    {gradientOptions.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
</div>

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
                tasks={col.tasks}
                onDelete={handleDeleteColumn}
                onRename={handleRenameColumn}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            ))}

            <div className="add-column-box">
              <h3 className="column-title">เพิ่มคอลัมน์ใหม่</h3>
              <input
                type="text"
                className="kanban-input"
                placeholder="ชื่อคอลัมน์ใหม่"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
              />
              <button onClick={handleAddColumn} className="kanban-button">
                + เพิ่มคอลัมน์
              </button>
            </div>
          </div>
        </DragDropContext>
      )}
    </div>
  );
};

export default KanbanPage;
