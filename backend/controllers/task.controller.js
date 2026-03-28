const Task = require("../models/task.model");

// @desc    Get dashboard data
// @route   GET /api/tasks/dashboard-data
// @access  Private/Admin
const getDashboardData = async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments();
        const completedTasks = await Task.countDocuments({
            status: "completed",
        });
        const pendingTasks = await Task.countDocuments({ status: "pending" });
        res.json({ totalTasks, completedTasks, pendingTasks });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get user dashboard data
// @route   GET /api/tasks/user-dashboard-data
// @access  Private/Admin
const getUserDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;
        const totalTasks = await Task.countDocuments({ assignedTo: userId });
        const completedTasks = await Task.countDocuments({
            assignedTo: userId,
            status: "completed",
        });
        const pendingTasks = await Task.countDocuments({
            assignedTo: userId,
            status: "pending",
        });
        res.json({ totalTasks, completedTasks, pendingTasks });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private/Admin
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate("assignedTo", "name email");
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private/Admin
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email",
        );
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private/Admin
const createTask = async (req, res) => {
    try {
        const { title, description, assignedTo } = req.body;
        const task = new Task({ title, description, assignedTo });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private/Admin
const updateTask = async (req, res) => {
    try {
        const { title, description, assignedTo } = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        task.title = title || task.title;
        task.description = description || task.description;
        task.assignedTo = assignedTo || task.assignedTo;
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        await task.remove();
        res.json({ message: "Task removed" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private/Admin
const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        task.status = status;
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Update task checklist
// @route   PUT /api/tasks/:id/todos
// @access  Private/Admin
const updateTaskChecklist = async (req, res) => {
    try {
        const { todos } = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        task.todos = todos;
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getDashboardData,
    getUserDashboardData,
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist,
};