// src/api/boards.ts
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const getBoards = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/boards`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createBoard = async (name: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${API_URL}/boards`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updateBoard = async (boardId: number, name: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    `${API_URL}/boards/${boardId}`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const deleteBoard = async (boardId: number) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${API_URL}/boards/${boardId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};