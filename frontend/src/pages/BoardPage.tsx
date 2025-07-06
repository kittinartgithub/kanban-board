import React, { useEffect, useState } from "react";
import { getBoards, createBoard, deleteBoard, updateBoard } from "../api/boards";
import BoardCard from "../components/BoardCard";
import ConfirmationDialog from "../components/ConfirmationDialog";
import "../styles/BoardPage.css";

interface Board {
  id: number;
  name: string;
  owner_id: number;
  members: number[];
}

function BoardPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [newBoardName, setNewBoardName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    boardId: null as number | null,
    boardName: "",
  });

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      const data = await getBoards();
      setBoards(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching boards:", error);
      setError("ไม่สามารถโหลดกระดานได้");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) {
      setError("กรุณากรอกชื่อกระดาน");
      return;
    }

    try {
      setLoading(true);
      const newBoard = await createBoard(newBoardName);
      setBoards([...boards, newBoard]);
      setNewBoardName("");
      setError(null);
    } catch (error) {
      console.error("Error creating board:", error);
      setError("ไม่สามารถสร้างกระดานได้");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBoard = (boardId: number) => {
    const board = boards.find((b) => b.id === boardId);
    if (!board) return;

    setConfirmDialog({
      isOpen: true,
      boardId,
      boardName: board.name,
    });
  };

  const confirmDelete = async () => {
    if (!confirmDialog.boardId) return;

    try {
      setLoading(true);
      await deleteBoard(confirmDialog.boardId);
      setBoards(boards.filter((board) => board.id !== confirmDialog.boardId));
      setError(null);
    } catch (error) {
      console.error("Error deleting board:", error);
      setError("ไม่สามารถลบกระดานได้");
    } finally {
      setLoading(false);
      setConfirmDialog({ isOpen: false, boardId: null, boardName: "" });
    }
  };

  const cancelDelete = () => {
    setConfirmDialog({ isOpen: false, boardId: null, boardName: "" });
  };

  const handleUpdateBoard = async (boardId: number, newName: string) => {
    if (!newName.trim()) {
      setError("กรุณากรอกชื่อกระดาน");
      return;
    }

    try {
      setLoading(true);
      const updatedBoard = await updateBoard(boardId, newName);
      setBoards(
        boards.map((board) =>
          board.id === boardId ? updatedBoard : board
        )
      );
      setError(null);
    } catch (error) {
      console.error("Error updating board:", error);
      setError("ไม่สามารถแก้ไขชื่อกระดานได้");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreateBoard();
    }
  };

  return (
    <div className="board-page-container">
      <h1 className="board-title">กระดานของฉัน</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="board-create">
        <input
          className="board-input"
          type="text"
          placeholder="ชื่อกระดานใหม่"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          className="board-create-button"
          onClick={handleCreateBoard}
          disabled={loading || !newBoardName.trim()}
        >
          {loading ? "กำลังสร้าง..." : "สร้างกระดาน"}
        </button>
      </div>

      <div className="board-list">
        {loading && boards.length === 0 ? (
          <div className="loading">กำลังโหลด...</div>
        ) : boards.length > 0 ? (
          boards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              onDelete={handleDeleteBoard}
              onUpdate={handleUpdateBoard}
              disabled={loading}
            />
          ))
        ) : (
          <div className="board-empty-state">
            <h3>ยังไม่มีบอร์ด</h3>
            <p>เริ่มต้นด้วยการสร้างกระดานใหม่ด้านบน</p>
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        title="ยืนยันการลบกระดาน"
        message={`คุณแน่ใจหรือไม่ว่าต้องการลบกระดาน "${confirmDialog.boardName}" ? การกระทำนี้ไม่สามารถย้อนกลับได้`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText="ลบ"
        cancelText="ยกเลิก"
      />
    </div>
  );
}

export default BoardPage;
