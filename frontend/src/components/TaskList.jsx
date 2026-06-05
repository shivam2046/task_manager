import TaskItem from "./TaskItem";

const emptyMessages = {
  all: { emoji: "📋", text: "No tasks yet. Add one above!" },
  active: { emoji: "✅", text: "No active tasks. You're all caught up!" },
  completed: { emoji: "🎯", text: "No completed tasks yet. Keep going!" },
};

const TaskList = ({ tasks, loading, filter, onToggle, onEdit, onDelete }) => {
  if (loading) {
    return <p className="loading">Loading tasks...</p>;
  }

  if (tasks.length === 0) {
    const { emoji, text } = emptyMessages[filter];
    return (
      <div className="empty-state">
        <span className="empty-emoji">{emoji}</span>
        <p>{text}</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;