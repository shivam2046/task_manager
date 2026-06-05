import { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

// ─── Backend URL ────────────────────────────────────────────
// Change this URL after deploying backend on Render
const BASE_URL = "https://task-manager-backend-fa46.onrender.com";
// ────────────────────────────────────────────────────────────

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

  // ── Fetch all tasks ──────────────────────────────────────
  const loadTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const url =
        filter === "all"
          ? `${BASE_URL}/api/tasks`
          : `${BASE_URL}/api/tasks?status=${filter}`;

      const res = await fetch(url);
      const data = await res.json();
      setTasks(data.data);
      setSummary(data.summary);
    } catch (err) {
      setError("Failed to load tasks. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // ── Add new task ─────────────────────────────────────────
  const addTask = async (title, description, dueDate) => {
    try {
      const res = await fetch(`${BASE_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, dueDate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setTasks((prev) => [data.data, ...prev]);
      setSummary((prev) => ({ ...prev, active: prev.active + 1 }));
    } catch (err) {
      alert(err.message);
    }
  };

  // ── Toggle complete / incomplete ─────────────────────────
  const toggleTask = async (task) => {
    try {
      const res = await fetch(`${BASE_URL}/api/tasks/${task._id}/toggle`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Update summary count based on new completed status
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

      // Remove from list if it no longer matches active filter
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

  // ── Edit a task ──────────────────────────────────────────
  const editTask = async (id, title, description, dueDate) => {
    try {
      const res = await fetch(`${BASE_URL}/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, dueDate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setTasks((prev) => prev.map((t) => (t._id === id ? data.data : t)));
    } catch (err) {
      alert(err.message);
    }
  };

  // ── Delete a task ────────────────────────────────────────
  const deleteTask = async (id) => {
    const confirmed = window.confirm("Delete this task? This cannot be undone.");
    if (!confirmed) return;
    try {
      const res = await fetch(`${BASE_URL}/api/tasks/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const task = tasks.find((t) => t._id === id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      setSummary((prev) => ({
        active: task.completed ? prev.active : prev.active - 1,
        completed: task.completed ? prev.completed - 1 : prev.completed,
      }));
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

        {/* Error Banner */}
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