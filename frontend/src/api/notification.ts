// api/notifications.ts

import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const token = () => localStorage.getItem("token");

export const getUnreadNotifications = async () => {
  const res = await axios.get(`${API_URL}/notifications/unread`, {
    headers: { Authorization: `Bearer ${token()}` },
  });
  return res.data;
};

export const markNotificationAsRead = async (id: number) => {
  const res = await axios.put(`${API_URL}/notifications/${id}/read`, {}, {
    headers: { Authorization: `Bearer ${token()}` },
  });
  return res.data;
};

export const clearNotifications = async () => {
  const res = await axios.delete(`${API_URL}/notifications/clear`, {
    headers: { Authorization: `Bearer ${token()}` },
  });
  return res.data;
};
