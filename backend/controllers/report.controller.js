const Task = require("../models/task.model.js");
const User = require("../models/user.model.js");

const excelJS = require("exceljs");

// @desc    Export task report to Excel
// @route   GET /api/reports/export/reports
// @access  Private/Admin
const exportTaskReport = async (req, res) => {
    try {
        const tasks = await Task.find().populate("assignedTo", "name email");
        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("Task Report");
        worksheet.columns = [
            { header: "ID", key: "_id", width: 10 },
            { header: "Title", key: "title", width: 30 },
            { header: "Description", key: "description", width: 50 },
            { header: "Priority", key: "priority", width: 10 },
            { header: "Status", key: "status", width: 15 },
            { header: "Due Date", key: "dueDate", width: 20 },
            { header: "Assigned To", key: "assignedTo", width: 30 },
        ];
        tasks.forEach((task) => {
            worksheet.addRow({
                _id: task._id.toString(),
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate.toLocaleDateString(),
                assignedTo: task.assignedTo
                    ? `${task.assignedTo.name} (${task.assignedTo.email})`
                    : "Unassigned",
            });
        });
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=task_report.xlsx",
        );
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({
            message: "Error generating report",
            details: error.message,
        });
    }
};

// @desc    Export user report to Excel
// @route   GET /api/reports/export/users
// @access  Private/Admin
const exportUsersReport = async (req, res) => {
    try {
        const users = await User.find();
        const tasks = await Task.find();

        const userTaskMap = {};
        users.forEach((user) => {
            userTaskMap[user._id.toString()] = {
                name: user.name,
                email: user.email,
                taskCount: 0,
                pendingTasks: 0,
                inProgressTasks: 0,
                completedTasks: 0,
            };
        });

        tasks.forEach((task) => {
            if (task.assignedTo) {
                const assignedId = task.assignedTo.toString();
                if (userTaskMap[assignedId]) {
                    userTaskMap[assignedId].taskCount += 1;
                    if (task.status === "Pending")
                        userTaskMap[assignedId].pendingTasks += 1;
                    else if (task.status === "In Progress")
                        userTaskMap[assignedId].inProgressTasks += 1;
                    else if (task.status === "Completed")
                        userTaskMap[assignedId].completedTasks += 1;
                }
            }
        });

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("User Report");
        worksheet.columns = [
            { header: "Name", key: "name", width: 30 },
            { header: "Email", key: "email", width: 30 },
            { header: "Role", key: "role", width: 15 },
            { header: "Created At", key: "createdAt", width: 20 },
            { header: "Task Count", key: "taskCount", width: 12 },
            { header: "Pending Tasks", key: "pendingTasks", width: 14 },
            { header: "In Progress", key: "inProgressTasks", width: 14 },
            { header: "Completed", key: "completedTasks", width: 14 },
        ];

        users.forEach((user) => {
            const stats = userTaskMap[user._id.toString()] || {
                taskCount: 0,
                pendingTasks: 0,
                inProgressTasks: 0,
                completedTasks: 0,
            };
            worksheet.addRow({
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
                    ? user.createdAt.toLocaleDateString()
                    : "",
                taskCount: stats.taskCount,
                pendingTasks: stats.pendingTasks,
                inProgressTasks: stats.inProgressTasks,
                completedTasks: stats.completedTasks,
            });
        });
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=user_report.xlsx",
        );
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({
            message: "Error generating report",
            details: error.message,
        });
    }
};

module.exports = {
    exportTaskReport,
    exportUsersReport,
};
