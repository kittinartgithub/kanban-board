import React, { useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { updateTask, deleteTask } from "../api/tasks";

interface Task {
  id: number;
  name: string;
  description?: string;
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
}) => {
  const [editMode, setEditMode] = useState(false);
  const [columnName, setColumnName] = useState(name);
  const [newTaskName, setNewTaskName] = useState("");

  return (
    <div className="bg-gray-100 rounded shadow p-4 w-64 flex-shrink-0 relative">
      {/* หัวคอลัมน์ */}
      <div className="flex items-center justify-between mb-2">
        {editMode ? (
          <div className="flex items-center w-full">
            <input
              className="text-lg font-bold flex-grow mr-2"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              autoFocus
            />
            <button
              className="text-green-600 text-sm mr-1"
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
              className="text-gray-600 text-sm"
              onClick={() => {
                setEditMode(false);
                setColumnName(name);
              }}
            >
              ยกเลิก
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-bold cursor-pointer flex-grow">
              {columnName}
            </h3>
            <button
              className="text-blue-600 text-sm ml-1"
              onClick={() => setEditMode(true)}
              title="แก้ชื่อ"
            >
              แก้
            </button>
            <button
              className="text-red-600 text-sm ml-1"
              onClick={() => onDelete(id)}
              title="ลบ"
            >
              ลบ
            </button>
          </>
        )}
      </div>

      {/* รายการการ์ด */}
      <Droppable droppableId={id.toString()}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="task-list"
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
                      onEdit={(id, name, desc) =>
                        onEditTask(id, { name, description: desc })
                      }
                      onDelete={onDeleteTask}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

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
          onClick={() => {
            if (newTaskName.trim()) {
              onAddTask(id, newTaskName);
              setNewTaskName("");
            }
          }}
          className="bg-green-600 text-white px-2 py-1 mt-2 w-full rounded hover:bg-green-700"
        >
          + เพิ่มการ์ด
        </button>
      </div>
    </div>
  );
};

export default Column;
