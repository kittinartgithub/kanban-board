import React, { useEffect, useState } from "react";
import { getBoards, createBoard } from "../api/boards";
import BoardCard from "../components/BoardCard";
import "../styles/boards.css";

interface Board {
  id: number;
  name: string;
  description?: string;
}

function BoardPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [newBoardName, setNewBoardName] = useState("");

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    const data = await getBoards();
    setBoards(data);
  };

  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return;
    const newBoard = await createBoard(newBoardName);
    setBoards([...boards, newBoard]);
    setNewBoardName("");
  };

  return (
    <div className="board-page">
      <h1 className="title">กระดานของฉัน</h1>
      <div className="board-create">
        <input
          type="text"
          placeholder="ชื่อกระดานใหม่"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
        />
        <button onClick={handleCreateBoard}>สร้างกระดาน</button>
      </div>
      <div className="board-list">
        {boards.map((board) => (
          <BoardCard key={board.id} board={board} />
        ))}
      </div>
    </div>
  );
}

export default BoardPage;
