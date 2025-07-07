import React, { useEffect, useState, useRef } from "react";
import "../styles/ShareBoardPopup.css";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

interface User {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
}

interface ShareBoardPopupProps {
  boardId: number;
  onClose: () => void;
}

const ShareBoardPopup: React.FC<ShareBoardPopupProps> = ({
  boardId,
  onClose,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [inviting, setInviting] = useState<number | null>(null);
  const [invitedUserIds, setInvitedUserIds] = useState<number[]>([]);
  const token = localStorage.getItem("token");

useEffect(() => {
  console.log('=== ShareBoardPopup Debug ===');
  console.log('Board ID:', boardId);
  console.log('Token:', token);

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload);
      console.log('Current user ID from token:', payload.user_id || payload.sub);
    } catch (e) {
      console.error('Cannot decode token:', e);
    }
  }

  // โหลดรายชื่อผู้ใช้ทั้งหมด
  axios
    .get(`${API_BASE_URL}/users/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      console.log("Users loaded:", res.data);
      setUsers(res.data);
    })
    .catch((err) => {
      console.error("Error loading users:", err);
    });

  // ✅ โหลดรายชื่อ user ที่ถูกเชิญไปแล้ว
  axios
    .get(`${API_BASE_URL}/invitations/board/${boardId}/invited-users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      console.log('Invited users loaded:', res.data); // ควรเป็น [user_id, ...]
      setInvitedUserIds(res.data);
    })
    .catch((err) => {
      console.error('Error loading invited users:', err);
    });

}, [boardId, token]);


  const handleInvite = async (userId: number) => {
    setInviting(userId);

    //  Debug: ดูข้อมูลก่อนส่ง request
    console.log("=== Invite Debug ===");
    console.log("Board ID:", boardId);
    console.log("User ID to invite:", userId);
    console.log("Request payload:", {
      board_id: boardId,
      invited_user_id: userId,
    });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/invitations/`,
        {
          board_id: boardId,
          invited_user_id: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Success response:", response.data);
      setInvitedUserIds((prev) => [...prev, userId]); // เพิ่มบรรทัดนี้
      alert("เชิญสำเร็จแล้ว!");
    } catch (err: any) {
      console.error("=== Error Debug ===");
      console.error("Status:", err.response?.status);
      console.error("Error detail:", err.response?.data?.detail);
      console.error("Full error response:", err.response?.data);
      console.error("Full error:", err);

      const errorMessage = err.response?.data?.detail || "Unknown error";
      alert(`เกิดข้อผิดพลาด: ${errorMessage}`);
    } finally {
      setInviting(null);
    }
  };

  return (
    <div className="share-popup">
      <h2>เชิญเข้าร่วมบอร์ด (Board ID: {boardId})</h2>
      <button className="close-btn" onClick={onClose}>
        X
      </button>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id}>
            <div className="user-info">
              <strong>
                {user.firstname} {user.lastname}
              </strong>{" "}
              ({user.username})<span className="email">{user.email}</span>
              <small>User ID: {user.id}</small>
            </div>
            <button
              className={`lux-invite-btn ${
                invitedUserIds.includes(user.id) ? "invited" : ""
              }`}
              disabled={
                inviting === user.id || invitedUserIds.includes(user.id)
              }
              onClick={() => handleInvite(user.id)}
            >
              {invitedUserIds.includes(user.id)
                ? "✅ เชิญแล้ว"
                : inviting === user.id
                ? "⏳ กำลังเชิญ..."
                : "เชิญ"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShareBoardPopup;
