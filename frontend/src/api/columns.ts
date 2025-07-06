// src/api/columns.ts
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const token = () => localStorage.getItem("token");

export const getColumns = async (boardId: number) => {
  const res = await axios.get(`${API_URL}/boards/${boardId}/columns`, {
    headers: { Authorization: `Bearer ${token()}` },
  });
  return res.data;
};

export const createColumn = async (name: string, boardId: number) => {
  const res = await axios.post(
    `${API_URL}/columns`,
    { name, board_id: boardId },
    {
      headers: { Authorization: `Bearer ${token()}` },
    }
  );
  return res.data;
};

export const updateColumn = async (columnId: number, name: string) => {
  const res = await axios.put(
    `${API_URL}/columns/${columnId}`,
    { name },
    {
      headers: { Authorization: `Bearer ${token()}` },
    }
  );
  return res.data;
};

export const deleteColumn = async (columnId: number) => {
  const res = await axios.delete(`${API_URL}/columns/${columnId}`, {
    headers: { Authorization: `Bearer ${token()}` },
  });
  return res.data;
};
