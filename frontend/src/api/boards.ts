import axios, { AxiosError } from "axios";

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

export const respondToInvitation = async (inviteId: number, status: "accepted" | "declined") => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token is missing or invalid.");
  }

  try {
    const res = await axios.put(
      `${API_URL}/invitations/${inviteId}/respond`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Response data: ", res.data);  // Logging response for debugging
    return res.data;
  } catch (error) {
    // การจัดการ error เมื่อเกิด AxiosError
    if (error instanceof AxiosError) {
      console.error("Error responding to invitation: ", error.response || error);

      // ตรวจสอบว่ามี `detail` ใน `data` หรือไม่
      const errorDetail = error.response?.data?.detail;
      if (errorDetail) {
        throw new Error(errorDetail);
      } else {
        // เพิ่มข้อมูลเพิ่มเติมเมื่อเกิด error
        const statusCode = error.response?.status;
        const message = error.response?.data?.message || "An error occurred while responding to invitation.";
        throw new Error(`Error: ${message}, Status: ${statusCode}`);
      }
    } else {
      console.error("An unknown error occurred", error);
      throw new Error("An unknown error occurred.");
    }
  }
};


// ฟังก์ชันดึงสมาชิกในบอร์ด
export const getBoardMembers = async (boardId: number) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/boards/${boardId}/members`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};