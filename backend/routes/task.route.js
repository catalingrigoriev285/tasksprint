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
} = require("../controllers/task.controller");

router.get("/dashboard-data", protect, adminOnly, getDashboardData);
router.get("/user-dashboard-data", protect, adminOnly, getUserDashboardData);

router.get("/", protect, adminOnly, getTasks);
router.get("/:id", protect, adminOnly, getTaskById);
router.post("/", protect, adminOnly, createTask);
router.put("/:id", protect, adminOnly, updateTask);
router.delete("/:id", protect, adminOnly, deleteTask);
router.put("/:id/status", protect, adminOnly, updateTaskStatus);
router.put("/:id/todos", protect, adminOnly, updateTaskChecklist);

module.exports = router;