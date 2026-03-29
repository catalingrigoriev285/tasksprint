const Task = require("../models/task.model");

// @desc    Get dashboard data
// @route   GET /api/tasks/dashboard-data
// @access  Private/Admin
const getDashboardData = async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments();
        const completedTasks = await Task.countDocuments({ status: "completed" });
        const pendingTasks = await Task.countDocuments({ status: "pending" });
        const overdueTasks = await Task.countDocuments({ status: "in-progress" });

        const taskStatuses = ["pending", "in-progress", "completed"];
        const taskDistributionRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, "").toLowerCase();
            acc[formattedKey] =
                taskDistributionRaw.find((item) => item._id === status)
                    ?.count || 0;
            return acc;
        }, {});

        taskDistribution["All"] = totalTasks;

        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelsRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 },
                },
            },
        ]);

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            const formattedKey = priority.replace(/\s+/g, "").toLowerCase();
            acc[formattedKey] =
                taskPriorityLevelsRaw.find(
                    (item) => item._id === priority.toLowerCase(),
                )?.count || 0;
            return acc;
        }, {});

        const recentTasks = await Task.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("title status priority dueDate createdAt");

        res.json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            details: error.message,
        });
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
        const overdueTasks = await Task.countDocuments({
            assignedTo: userId,
            status: "in-progress",
        });

        const taskStatuses = ["pending", "in-progress", "completed"];
        const taskDistributionRaw = await Task.aggregate([
            {
                $match: { assignedTo: userId },
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, "").toLowerCase();
            acc[formattedKey] =
                taskDistributionRaw.find((item) => item._id === status)
                    ?.count || 0;
            return acc;
        }, {});

        taskDistribution["All"] = totalTasks;

        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevlesRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 },
                },
            },
        ]);

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            const formattedKey = priority.replace(/\s+/g, "").toLowerCase();
            acc[formattedKey] =
                taskPriorityLevlesRaw.find(
                    (item) => item._id === priority.toLowerCase(),
                )?.count || 0;
            return acc;
        }, {});

        const recentTasks = await Task.find({ assignedTo: userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("title status priority dueDate createdAt");

        res.json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            details: error.message,
        });
    }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private/Admin
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate("assignedTo", "username email")
            .populate("createdBy", "username email");

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
            .populate("assignedTo", "username email")
            .populate("createdBy", "username email");

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            details: error.message,
        });
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
        res.status(500).json({
            message: "Server error",
            details: error.message,
        });
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
        res.status(500).json({
            message: "Server error",
            details: error.message,
        });
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
        res.status(500).json({
            message: "Server error",
            details: error.message,
        });
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
        res.status(500).json({
            message: "Server error",
            details: error.message,
        });
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

        const completedCounts = todoCheckList.filter(
            (item) => item.completed,
        ).length;
        const progress = Math.round(
            (completedCounts / todoCheckList.length) * 100,
        );
        task.progress = progress;

        if (progress === 100) {
            task.status = "completed";
        } else if (progress > 0) {
            task.status = "in-progress";
        } else {
            task.status = "pending";
        }

        await task.save();

        res.json(task);
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            details: error.message,
        });
    }
};

// @desc    Get my tasks (for regular users)
// @route   GET /api/tasks/my-tasks
// @access  Private
const getMyTasks = async (req, res) => {
    try {
        const userId = req.user._id;
        const tasks = await Task.find({ assignedTo: userId })
            .populate("createdBy", "username email")
            .sort({ createdAt: -1 });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            details: error.message,
        });
    }
};

// @desc    Get my dashboard data (for regular users)
// @route   GET /api/tasks/my-dashboard
// @access  Private
const getMyDashboard = async (req, res) => {
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

        const recentTasks = await Task.find({ assignedTo: userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("createdBy", "username email")
            .select("title status priority dueDate createdAt progress");

        res.json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                inProgressTasks,
            },
            recentTasks,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            details: error.message,
        });
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
    getMyTasks,
    getMyDashboard,
};
