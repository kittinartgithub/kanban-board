import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

// ฟังก์ชันที่ใช้ในการมอบหมายผู้ใช้ให้กับ task
export const assignUserToTask = async (taskId: number, userId: number) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }

  try {
    const response = await axios.post(
      `${API_URL}/tasks/${taskId}/assign`, // API endpoint สำหรับมอบหมาย
      { user_id: userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // คืนค่าผลลัพธ์จากการมอบหมาย
  } catch (error) {
    console.error("Error assigning user to task:", error);
    throw error;
  }
};

// ฟังก์ชันดึง tasks ตาม columnId
export const getTasks = async (columnId: number) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }

  try {
    const response = await axios.get(`${API_URL}/tasks/columns/${columnId}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// ฟังก์ชันสร้าง task ใหม่
export const createTask = async (columnId: number, name: string) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }

  try {
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
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

// ฟังก์ชันอัปเดต task
export const updateTask = async (taskId: number, updates: any) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }

  try {
    const res = await axios.put(`${API_URL}/tasks/${taskId}`, updates, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// ฟังก์ชันลบ task
export const deleteTask = async (taskId: number) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }

  try {
    const res = await axios.delete(`${API_URL}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
