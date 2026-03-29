const express = require("express");

const { protect, adminOnly } = require("../middlewares/auth.middleware.js");

const router = express.Router();

const {
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
} = require("../controllers/task.controller");

// Admin routes
router.get("/dashboard-data", protect, adminOnly, getDashboardData);
router.get("/user-dashboard-data", protect, adminOnly, getUserDashboardData);

// User routes (must come before /:id to avoid conflicts)
router.get("/my-dashboard", protect, getMyDashboard);
router.get("/my-tasks", protect, getMyTasks);

// Admin task management
router.get("/", protect, adminOnly, getTasks);
router.post("/", protect, adminOnly, createTask);
router.put("/:id", protect, adminOnly, updateTask);
router.delete("/:id", protect, adminOnly, deleteTask);

// Shared routes (accessible by both admin and regular users)
router.get("/:id", protect, getTaskById);
router.put("/:id/status", protect, updateTaskStatus);
router.put("/:id/todos", protect, updateTaskChecklist);

module.exports = router;