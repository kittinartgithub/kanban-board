// src/api/columns.ts
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const createColumn = async (name: string, boardId: number) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${API_URL}/columns`,
    { name, board_id: boardId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getColumns = async (boardId: number) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/boards/${boardId}/columns`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
