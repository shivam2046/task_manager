const Task = require("../models/Task");

// @desc    Get all tasks (sorted newest first)
// @route   GET /api/tasks
// @access  Public
const getTasks = async (req, res) => {
  try {
    const { status } = req.query; // "active" | "completed" | undefined

    let filter = {};
    if (status === "active") filter.completed = false;
    else if (status === "completed") filter.completed = true;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    // Count summary
    const totalActive = await Task.countDocuments({ completed: false });
    const totalCompleted = await Task.countDocuments({ completed: true });

    res.status(200).json({
      success: true,
      count: tasks.length,
      summary: { active: totalActive, completed: totalCompleted },
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Public
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title || title.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }

    const task = await Task.create({ title, description, dueDate });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a task (title, description, dueDate, or completed)
// @route   PUT /api/tasks/:id
// @access  Public
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    const { title, description, dueDate, completed } = req.body;

    // Only update fields that are provided
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (completed !== undefined) task.completed = completed;

    const updatedTask = await task.save();

    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle task completion status
// @route   PATCH /api/tasks/:id/toggle
// @access  Public
const toggleTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    task.completed = !task.completed;
    const updatedTask = await task.save();

    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Public
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    await task.deleteOne();

    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, toggleTask, deleteTask };