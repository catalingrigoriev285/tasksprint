const express = require("express");

const { protect, adminOnly } = require("../middleware/auth.middleware");

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
} = require("../controllers/task.controller");

router.get("/dashboard-data", protect, adminOnly, getDashboardData);
router.get("/user-dashboard-data", protect, adminOnly, getUserDashboardData);

router.get("/tasks", protect, adminOnly, getTasks);
router.get("/tasks/:id", protect, adminOnly, getTaskById);
router.post("/tasks", protect, adminOnly, createTask);
router.put("/tasks/:id", protect, adminOnly, updateTask);
router.delete("/tasks/:id", protect, adminOnly, deleteTask);
router.put("/tasks/:id/status", protect, adminOnly, updateTaskStatus);
router.put("/tasks/:id/todos", protect, adminOnly, updateTaskChecklist);

module.exports = router;