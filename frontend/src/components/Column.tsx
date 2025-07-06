// src/components/Column.tsx

import React, { useEffect, useState } from "react";
import { getTasks, createTask } from "../api/tasks";
import TaskCard from "./TaskCard";

interface ColumnProps {
  id: number;
  name: string;
}

interface Task {
  id: number;
  name: string;
  description?: string;
}

const Column: React.FC<ColumnProps> = ({ id, name }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState("");

  // ดึงรายการ Task
  const fetchTasks = async () => {
    try {
      const data = await getTasks(id);
      setTasks(data);
    } catch (err) {
      console.error("โหลดการ์ดไม่สำเร็จ:", err);
    }
  };

  // เพิ่มการ์ด
  const handleAddTask = async () => {
    if (!newTaskName.trim()) return;
    try {
      await createTask(id, newTaskName);
      setNewTaskName("");
      fetchTasks(); // โหลดใหม่
    } catch (err) {
      console.error("เพิ่มการ์ดไม่สำเร็จ:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [id]);

  return (
    <div className="bg-gray-100 rounded shadow p-4 w-64 flex-shrink-0">
      <h3 className="text-lg font-bold mb-2">{name}</h3>

      {/* แสดงการ์ดทั้งหมด */}
      <div>
        {tasks.map((task) => (
          <TaskCard key={task.id} title={task.name} description={task.description} />
        ))}
      </div>

      {/* เพิ่มการ์ดใหม่ */}
      <div className="mt-4">
        <input
          type="text"
          className="w-full border rounded px-2 py-1"
          placeholder="ชื่อการ์ดใหม่"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
        />
        <button
          onClick={handleAddTask}
          className="bg-green-600 text-white px-2 py-1 mt-2 w-full rounded hover:bg-green-700"
        >
          + เพิ่มการ์ด
        </button>
      </div>
    </div>
  );
};

export default Column;
