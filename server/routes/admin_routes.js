// routes/admin_routes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const adminMiddleware = require("../middleware/adminMiddleware");

// Get all users (Admin route)
router.get("/admin/users", adminMiddleware, async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ status: "success", data: users });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving users", error: error.message });
    }
});

// Get all transactions (Admin route)
router.get("/admin/transactions", adminMiddleware, async (req, res) => {
    try {
        const transactions = await Transaction.find({});
        res.status(200).json({ status: "success", data: transactions });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving transactions", error: error.message });
    }
});

// Update user information (Admin route)
router.put("/admin/users/:id", adminMiddleware, async (req, res) => {
    try {
        const { first_name, last_name, mobile_number, email, city, role } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { first_name, last_name, mobile_number, email, city, role },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ status: "success", data: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
});

// Delete user account (Admin route)
router.delete("/admin/users/:id", adminMiddleware, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
});

// Configure system settings (Admin route)
// This route can be extended to update categories, limits, etc.
router.put("/admin/settings", adminMiddleware, async (req, res) => {
    try {
        const { categories, limits } = req.body;

        // Example: Update system settings (this can be stored in a config model or file)
        // Assuming this is saved in a database or environment file
        const systemSettings = {
            categories,
            limits,
        };

        res.status(200).json({ status: "success", message: "System settings updated", systemSettings });
    } catch (error) {
        res.status(500).json({ message: "Error updating system settings", error: error.message });
    }
});

module.exports = router;
