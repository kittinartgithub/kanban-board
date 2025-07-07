import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export interface Tag {
  id: number;
  name: string;
  color?: string;
}

// Helper function สำหรับ handle errors
const handleApiError = (error: any) => {
  if (error.response?.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
  console.error("API Error:", error);
  throw error;
};

//  ดึงแท็กทั้งหมด
export const getTags = async (): Promise<Tag[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token");
    }

    const res = await axios.get(`${API_URL}/tags/`, {  // เพิ่ม / ท้าย
      headers: { Authorization: `Bearer ${token}` },
    });
    
    console.log("getTags response:", res.data);
    return res.data;
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

//  ดึงแท็กที่อยู่ใน Task
export const getTaskTags = async (taskId: number): Promise<Tag[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token");
    }

    const res = await axios.get(`${API_URL}/tags/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    console.log("getTaskTags response:", res.data);
    return res.data;
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

//  สร้างแท็กใหม่
export const createTag = async (name: string): Promise<Tag> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token");
    }

    const res = await axios.post(
      `${API_URL}/tags/`,  // เพิ่ม / ท้าย
      { name },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log("createTag response:", res.data);
    return res.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

//  ผูกหลายแท็กกับ Task
export const assignTagsToTask = async (taskId: number, tagIds: number[]): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token");
    }

    await axios.post(
      `${API_URL}/tags/assign/${taskId}`,
      { tag_ids: tagIds },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log("assignTagsToTask success");
  } catch (error) {
    handleApiError(error);
  }
};