const express = require("express");
const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all notifications for a user
router.get("/notifications", authMiddleware, async (req, res) => {
    try {
        const notifications = await Notification.find({ user_id: req.user.id });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving notifications", error: error.message });
    }
});

// Mark a notification as read
router.put("/notifications/:id", authMiddleware, async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id, { is_read: true }, { new: true });
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        res.status(200).json({ message: "Notification marked as read", notification });
    } catch (error) {
        res.status(500).json({ message: "Error updating notification", error: error.message });
    }
});

module.exports = router;
