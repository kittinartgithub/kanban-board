import React, { useEffect, useState, useRef } from "react";
import { getUnreadNotifications } from "../api/notification";
import { respondToInvitation } from "../api/boards"; // เพิ่มการนำเข้า
import "../styles/NotificationDropdown.css";

interface Notification {
  id: number;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
  related_id: number; // เพิ่มเพื่อเก็บ invite_id
  board_name: string; // ชื่อบอร์ด
  inviter_name: string; // ชื่อผู้เชิญ
}

const NotificationDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      // ดึงการแจ้งเตือนจาก API
      getUnreadNotifications().then((data) => {
        // แสดงข้อมูลเมื่อดึงมาได้
        setNotifications(data);
        console.log("Notifications loaded:", data); // ดูข้อมูลที่ดึงมา
      }).catch((error) => {
        console.error("Error fetching notifications:", error);
      });
    }
  }, [open]);

  // ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRespondInvitation = (inviteId: number, status: "accepted" | "declined") => {
    console.log("Responding to invitation:", { inviteId, status });  // เพิ่ม log
    respondToInvitation(inviteId, status)
      .then((response) => {
        console.log("Invitation responded:", response);
        // ปรับปรุงสถานะ notification หลังตอบรับ
        setNotifications((prevNotifications) =>
          prevNotifications.filter((n) => n.id !== inviteId) // ลบ notification หลังตอบรับ
        );
      })
      .catch((error) => {
        console.error("Error responding to invitation:", error);
      });
  };

  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <div className="icon-wrapper" onClick={() => setOpen(!open)} title="การแจ้งเตือน">
        🔔
        {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
      </div>
      {open && (
        <div className="dropdown-content">
          {notifications.length === 0 ? (
            <div className="empty">
              <img src="/images/no-noti.png" alt="no notifications" />
              <p>ไม่มีการแจ้งเตือนที่ยังไม่ได้อ่าน</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="noti-item">
                <strong>{n.title}</strong>
                <p>{n.message}</p>
                <span>{new Date(n.created_at).toLocaleString()}</span>
                <div>
                  <strong>บอร์ด: </strong>{n.board_name}
                </div>
                <div>
                  <strong>เชิญโดย: </strong>{n.inviter_name}
                </div>
                <div className="noti-actions">
                  {n.is_read ? (
                    <span>✅ การตอบรับแล้ว</span>
                  ) : (
                    <>
                      <button onClick={() => handleRespondInvitation(n.related_id, "accepted")}>
                        ตอบรับ
                      </button>
                      <button onClick={() => handleRespondInvitation(n.related_id, "declined")}>
                        ปฏิเสธ
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
