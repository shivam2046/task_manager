import { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [summary, setSummary] = useState({ active: 0, completed: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load tasks whenever filter changes
  useEffect(() => {
    loadTasks();
  }, [filter]);

  const loadTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const url =
        filter === "all" ? "/api/tasks" : `/api/tasks?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      setTasks(data.data);
      setSummary(data.summary);
    } catch (err) {
      setError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (title, description, dueDate) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, dueDate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      // Add new task to top of list and update summary
      setTasks((prev) => [data.data, ...prev]);
      setSummary((prev) => ({ ...prev, active: prev.active + 1 }));
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleTask = async (task) => {
    try {
      const res = await fetch(`/api/tasks/${task._id}/toggle`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Update summary count
      if (data.data.completed) {
        setSummary((prev) => ({
          active: prev.active - 1,
          completed: prev.completed + 1,
        }));
      } else {
        setSummary((prev) => ({
          active: prev.active + 1,
          completed: prev.completed - 1,
        }));
      }

      // If filter is active/completed, remove task that no longer matches
      if (filter !== "all") {
        setTasks((prev) => prev.filter((t) => t._id !== task._id));
      } else {
        setTasks((prev) =>
          prev.map((t) => (t._id === task._id ? data.data : t))
        );
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const editTask = async (id, title, description, dueDate) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, dueDate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      // Replace old task with updated task in list
      setTasks((prev) => prev.map((t) => (t._id === id ? data.data : t)));
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteTask = async (id) => {
    const confirmed = window.confirm("Delete this task? This cannot be undone.");
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/tasks/${id}`,
        { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      // Find task to update summary correctly
      const task = tasks.find((t) => t._id === id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      
      if (task.completed) {
        setSummary({
          active: summary.active,
          completed: summary.completed - 1,
        });
      } else {
        setSummary({
          active: summary.active - 1,
          completed: summary.completed,
        });
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="app">
      <div className="container">

        {/* Header */}
        <div className="header">
          <h1>Task Manager</h1>
          <div className="summary">
            <span className="active-count">{summary.active} active</span>
            <span className="dot">·</span>
            <span className="completed-count">{summary.completed} completed</span>
          </div>
        </div>

        {/* Add Task Form */}
        <TaskForm onAdd={addTask} />

        {/* Filter Buttons */}
        <div className="filters">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={filter === f ? "filter-btn active" : "filter-btn"}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && <p className="error-banner">{error}</p>}

        {/* Task List */}
        <TaskList
          tasks={tasks}
          loading={loading}
          filter={filter}
          onToggle={toggleTask}
          onEdit={editTask}
          onDelete={deleteTask}
        />

      </div>
    </div>
  );
};

export default App;