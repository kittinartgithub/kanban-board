// src/components/BoardCard.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/BoardCard.css";

interface Props {
  board: {
    id: number;
    name: string;
    description?: string;
  };
  onDelete?: (boardId: number) => void;
  onUpdate?: (boardId: number, newName: string) => void;
  disabled?: boolean;
}

const BoardCard: React.FC<Props> = ({
  board,
  onDelete,
  onUpdate,
  disabled = false,
}) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(board.name);

  const handleCardClick = () => {
    if (!isEditing && !disabled) {
      navigate(`/boards/${board.id}`);
    }
  };

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditName(board.name);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditName(board.name);
  };

  const handleSaveEdit = () => {
    if (editName.trim() && editName !== board.name && onUpdate) {
      onUpdate(board.id, editName.trim());
    }
    setIsEditing(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(board.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSaveEdit();
    else if (e.key === "Escape") handleCancelEdit();
  };

  const handleNameDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdate) handleStartEdit(e);
  };

  return (
    <div className="boardcard-card" onClick={handleCardClick}>
      <div className="boardcard-header">
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSaveEdit}
            className="boardcard-name-input"
            autoFocus
            disabled={disabled}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <h3
            className="boardcard-name"
            onDoubleClick={handleNameDoubleClick}
            title={onUpdate ? "ดับเบิลคลิกเพื่อแก้ไข" : ""}
          >
            {board.name}
          </h3>
        )}
      </div>

      <p className="boardcard-description">
        {board.description || "ไม่มีคำอธิบาย"}
      </p>

      {(onDelete || onUpdate) && (
        <div className="boardcard-actions" onClick={(e) => e.stopPropagation()}>
          {isEditing ? (
            <div className="boardcard-edit-actions">
              <button
                className="boardcard-btn-save"
                onClick={handleSaveEdit}
                disabled={disabled || !editName.trim()}
              >
                บันทึก
              </button>
              <button
                className="boardcard-btn-cancel"
                onClick={handleCancelEdit}
                disabled={disabled}
              >
                ยกเลิก
              </button>
            </div>
          ) : (
            <div className="boardcard-menu">
              {onUpdate && (
                <button
                  className="boardcard-btn-edit"
                  onClick={handleStartEdit}
                  disabled={disabled}
                >
                  แก้ไข
                </button>
              )}
              {onDelete && (
                <button
                  className="boardcard-btn-delete"
                  onClick={handleDelete}
                  disabled={disabled}
                >
                  ลบ
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BoardCard;
