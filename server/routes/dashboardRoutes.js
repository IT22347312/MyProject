const express = require("express");
const {
    getAdminDashboard,
    getUserDashboard,
} = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Admin Dashboard Route
router.get("/admin", authMiddleware, (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access Denied" });
    }
    getAdminDashboard(req, res);
});

// User Dashboard Route
router.get("/user", authMiddleware, getUserDashboard);

module.exports = router;
