import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/boards.css";

interface Props {
  board: {
    id: number;
    name: string;
    description?: string;
  };
}

const BoardCard: React.FC<Props> = ({ board }) => {
  const navigate = useNavigate();

  return (
    <div className="board-card" onClick={() => navigate(`/boards/${board.id}`)}>
      <h3>{board.name}</h3>
      <p>{board.description || "ไม่มีคำอธิบาย"}</p>
    </div>
  );
};

export default BoardCard;
