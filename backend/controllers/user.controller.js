const Task = require("../models/task.model.js");
const User = require("../models/user.model.js");

const bcrypt = require("bcryptjs");

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        // Calculate global task stats
        const [pendingTasks, inProgressTasks, completedTasks] = await Promise.all([
            Task.countDocuments({ status: "pending" }),
            Task.countDocuments({ status: "in progress" }),
            Task.countDocuments({ status: "completed" }),
        ]);

        const userWithTaskCount = await Promise.all(
            users.map(async (user) => {
                const taskCount = await Task.countDocuments({ assignedTo: user._id });
                const userPendingTasks = await Task.countDocuments({ assignedTo: user._id, status: "pending" });
                const userInProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: "in progress" });
                const userCompletedTasks = await Task.countDocuments({ assignedTo: user._id, status: "completed" });

                return {
                    ...user.toObject(),
                    taskCount,
                    pendingTasks: userPendingTasks,
                    inProgressTasks: userInProgressTasks,
                    completedTasks: userCompletedTasks
                };
            })
        );

        res.json({
            users: userWithTaskCount,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            details: error.message,
        });
    }
};

// @desc    Get user by ID (admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            details: error.message,
        });
    }
};

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await user.deleteOne();
        res.json({ message: "User removed" });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            details: error.message,
        });
    }
};

// @desc    Create user (admin only)
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'member'
        });

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            details: error.message,
        });
    }
};

// @desc    Update user (admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (role) user.role = role;
        
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            details: error.message,
        });
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
