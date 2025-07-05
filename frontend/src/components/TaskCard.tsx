// src/components/TaskCard.tsx
import React from "react";
import "../styles/TaskCard.css";

interface Props {
  title: string;
  description?: string;
}

const TaskCard: React.FC<Props> = ({ title, description }) => {
  return (
    <div className="bg-white p-2 rounded shadow mb-2">
      <h4 className="font-medium">{title}</h4>
      {description && <p className="text-sm text-gray-600">{description}</p>}
    </div>
  );
};

export default TaskCard;