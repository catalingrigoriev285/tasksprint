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
        const inProgressTasks = await Task.countDocuments({
            status: "in-progress",
        });

        res.json({ totalTasks, completedTasks, pendingTasks, inProgressTasks });
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
        const inProgressTasks = await Task.countDocuments({
            assignedTo: userId,
            status: "in-progress",
        });

        res.json({ totalTasks, completedTasks, pendingTasks, inProgressTasks });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private/Admin
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate("assignedTo", "name email")
            .populate("createdBy", "name email");

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
        const task = await Task.findById(req.params.id)
            .populate("assignedTo", "name email")
            .populate("createdBy", "name email");

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error", details: error.message });
    }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private/Admin
const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            assignedTo,
            priority,
            dueDate,
            attachments,
            todoCheckList,
        } = req.body;

        const createdBy = req.user && req.user._id;
        if (!createdBy)
            return res.status(401).json({ message: "Unauthorized" });

        if (!dueDate)
            return res.status(400).json({ message: "dueDate is required" });

        const task = new Task({
            title,
            description,
            assignedTo,
            priority,
            dueDate,
            attachments,
            todoCheckList,
            createdBy,
        });
        await task.save();

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error", details: error.message });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private/Admin
const updateTask = async (req, res) => {
    try {
        const {
            title,
            description,
            assignedTo,
            priority,
            dueDate,
            attachments,
            todoCheckList,
        } = req.body;

        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.assignedTo = assignedTo || task.assignedTo;
        task.priority = priority || task.priority;
        task.dueDate = dueDate || task.dueDate;
        task.attachments = attachments || task.attachments;
        if (todoCheckList !== undefined) task.todoCheckList = todoCheckList;

        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error", details: error.message });
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

        await task.deleteOne();
        res.json({ message: "Task removed" });
    } catch (error) {
        res.status(500).json({ message: "Server error", details: error.message });
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
        res.status(500).json({ message: "Server error", details: error.message });
    }
};

// @desc    Update task checklist
// @route   PUT /api/tasks/:id/todos
// @access  Private/Admin
const updateTaskChecklist = async (req, res) => {
    try {
        const { todoCheckList } = req.body;

        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        task.todoCheckList = todoCheckList;

        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error", details: error.message });
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
