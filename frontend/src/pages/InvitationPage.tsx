import React, { useEffect, useState } from "react";
import { getPendingInvitations, respondToInvitation } from "../api/invitation";
import "../styles/InvitationPage.css";


interface Invitation {
  id: number;
  board_id: number;
  invited_by_user_id: number;
  created_at: string;
}

const InvitationPage: React.FC = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    try {
      const data = await getPendingInvitations();
      setInvitations(data);
    } catch (err) {
      console.error("Error loading invitations", err);
    }
  };

  const handleResponse = async (id: number, action: "accept" | "decline") => {
    try {
      await respondToInvitation(id, action);
      await loadInvitations(); // refresh list
    } catch (err) {
      console.error(`Failed to ${action} invitation`, err);
    }
  };

  return (
    <div className="invitation-page-container">
      <h2>Pending Invitations</h2>
      {invitations.length === 0 ? (
        <p>No pending invitations.</p>
      ) : (
        <ul className="invitation-list">
          {invitations.map((inv) => (
            <li key={inv.id} className="invitation-item">
              📩 Board ID: {inv.board_id} | Invited by User ID: {inv.invited_by_user_id}
              <div className="invitation-buttons">
                <button onClick={() => handleResponse(inv.id, "accept")}>✅ Accept</button>
                <button onClick={() => handleResponse(inv.id, "decline")}>❌ Decline</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InvitationPage;
