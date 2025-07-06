// src/api/tasks.ts
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const getTasks = async (columnId: number) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/tasks/columns/${columnId}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createTask = async (columnId: number, name: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${API_URL}/tasks`,
    {
      name,
      column_id: columnId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updateTask = async (taskId: number, updates: any) => {
  const token = localStorage.getItem("token");
  const res = await axios.put(`${API_URL}/tasks/${taskId}`, updates, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteTask = async (taskId: number) => {
  const token = localStorage.getItem("token");
  const res = await axios.delete(`${API_URL}/tasks/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
