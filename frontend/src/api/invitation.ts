import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const token = () => localStorage.getItem("token");

export const getPendingInvitations = async () => {
  const res = await axios.get(`${API_URL}/invitations/pending`, {
    headers: { Authorization: `Bearer ${token()}` },
  });
  return res.data;
};

export const respondToInvitation = async (
  invitationId: number,
  action: "accept" | "decline"
) => {
  const status = action === "accept" ? "accepted" : "declined";
  const res = await axios.put(
    `${API_URL}/invitations/${invitationId}`,
    { status },
    {
      headers: { Authorization: `Bearer ${token()}` },
    }
  );
  return res.data;
};