const express = require("express");
const { protect, adminOnly } = require("../middlewares/auth.middleware.js");
const { exportTaskReport, exportUsersReport } = require("../controllers/report.controller");

const router = express.Router();

router.get("/export/reports", protect, adminOnly, exportTaskReport);
router.get("/export/users", protect, adminOnly, exportUsersReport);

module.exports = router;