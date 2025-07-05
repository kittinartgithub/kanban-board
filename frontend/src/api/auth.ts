import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

export const loginUser = async (data: { username: string; password: string }) => {
  const response = await axios.post(`${BASE_URL}/auth/login`, data);
  return response.data;
};

export const registerUser = async (data: {
  username: string;
  email: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
}) => {
  const response = await axios.post(`${BASE_URL}/auth/register`, data);
  return response.data;
};
