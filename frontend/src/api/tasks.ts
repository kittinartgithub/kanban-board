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
