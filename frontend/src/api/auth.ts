// D:\Data\INTERNSHIP\kanban-board\frontend\src\api\auth.ts

import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const loginUser = async (data: { username: string; password: string }) => {
  const response = await axios.post(`${API_URL}/auth/login`, data);
  return response.data;
};




export const registerUser = async (data: {
  username: string;
  email: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
}) => {
  const response = await axios.post(`${API_URL}/auth/register`, data);
  return response.data;
};
