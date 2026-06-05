import { useState } from "react";

const TaskItem = ({ task, onToggle, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [dueDate, setDueDate] = useState(
    task.dueDate ? task.dueDate.split("T")[0] : ""
  );
  const [error, setError] = useState("");

  // Check if task is overdue: due date is in past and task is not complete
  const isOverdue =
    task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Title cannot be empty.");
      return;
    }
    await onEdit(task._id, title.trim(), description.trim(), dueDate || null);
    setIsEditing(false);
    setError("");
  };

  const handleCancel = () => {
    // Reset fields back to original task values
    setTitle(task.title);
    setDescription(task.description || "");
    setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
    setIsEditing(false);
    setError("");
  };

  return (
    <div
      className={`task-item card
        ${task.completed ? "completed" : ""}
        ${isOverdue ? "overdue" : ""}
      `}
    >
      {isEditing ? (
        /* ── Edit Mode ── */
        <div className="edit-mode">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={error ? "input-error" : ""}
            autoFocus
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          {error && <p className="form-error">{error}</p>}
          <div className="edit-actions">
            <button onClick={handleSave} className="btn-primary btn-sm">
              Save
            </button>
            <button onClick={handleCancel} className="btn-ghost btn-sm">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* ── View Mode ── */
        <div className="view-mode">
          <div className="task-left">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task)}
              className="task-checkbox"
            />
            <div className="task-content">
              <p className="task-title">{task.title}</p>
              {task.description && (
                <p className="task-desc">{task.description}</p>
              )}
              {task.dueDate && (
                <p className={`task-due ${isOverdue ? "overdue-text" : ""}`}>
                  {isOverdue ? "⚠ Overdue · " : "📅 "}
                  {formatDate(task.dueDate)}
                </p>
              )}
            </div>
          </div>
          <div className="task-actions">
            <button onClick={() => setIsEditing(true)} className="btn-ghost btn-sm">
              Edit
            </button>
            <button onClick={() => onDelete(task._id)} className="btn-danger btn-sm">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;