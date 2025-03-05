const express = require("express");
const router = express.Router();
const Budget = require("../models/budget");
const authMiddleware = require("../middlewares/authMiddleware");

// Set a budget
router.post("/set", authMiddleware, async (req, res) => {
    try {
        const { category, limit } = req.body;

        const budget = new Budget({
            user: req.user.id,
            category,
            limit
        });

        await budget.save();
        res.status(201).json({ message: "Budget set successfully", budget });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get budgets for a user
router.get("/all", authMiddleware, async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user.id });
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
