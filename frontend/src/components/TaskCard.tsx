// D:\Data\INTERNSHIP\kanban-board\frontend\src\components\TaskCard.tsx
import React, { useState, useEffect } from "react";
// import { Tag, getTaskTags, getTags, assignTagsToTask, createTag } from "../api/tags"; // ปิดการใช้งาน tag
import "../styles/TaskCard.css"; 

interface Task {
  id: number;
  name: string;
  description?: string;
}

interface Props {
  task: Task;
  onEdit: (id: number, name: string, description: string) => void;
  onDelete: (id: number) => void;
}

const TaskCard: React.FC<Props> = ({ task, onEdit, onDelete }) => {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description || "");

  // const [tags, setTags] = useState<Tag[]>([]);
  // const [allTags, setAllTags] = useState<Tag[]>([]);
  // const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  // const [newTagName, setNewTagName] = useState("");

  useEffect(() => {
    // loadData(); // 🔒 ปิดการโหลด tag
  }, [task.id]);

  /*
  const loadData = async () => {
    try {
      const [taskTags, allTagsData] = await Promise.all([
        getTaskTags(task.id),
        getTags()
      ]);

      setTags(taskTags);
      setAllTags(allTagsData);
      setSelectedTagIds(taskTags.map(tag => tag.id));
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };
  */

  const handleSave = async () => {
    try {
      onEdit(task.id, name, description);
      // await assignTagsToTask(task.id, selectedTagIds); // 🔒 ปิดการผูก tag
      // await loadData();
      setEditMode(false);
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  /*
  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const newTag = await createTag(newTagName);
      setAllTags([...allTags, newTag]);
      setSelectedTagIds([...selectedTagIds, newTag.id]);
      setNewTagName("");
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  };

  const toggleTag = (tagId: number) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };
  */

  if (editMode) {
    return (
      <div className="taskcard-container">
        <input
          className="taskcard-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ชื่อ task"
        />
        <textarea
          className="taskcard-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="รายละเอียด"
        />

        {/* 🔒 แท็ก */}
        {/* ... */}

        <div className="taskcard-btn-group">
          <button onClick={handleSave} className="taskcard-btn-save">บันทึก</button>
          <button onClick={() => setEditMode(false)} className="taskcard-btn-cancel">ยกเลิก</button>
        </div>
      </div>
    );
  }

  return (
    <div className="taskcard-container">
      <h4 className="taskcard-title">{task.name}</h4>
      {description && <p className="taskcard-desc">{description}</p>}

      {/* 🔒 แสดงแท็ก */}
      {/* ... */}

      <div className="taskcard-btn-group">
        <button onClick={() => setEditMode(true)} className="taskcard-btn-edit">แก้ไข</button>
        <button onClick={() => onDelete(task.id)} className="taskcard-btn-delete">ลบ</button>
      </div>
    </div>
  );
};

export default TaskCard;
