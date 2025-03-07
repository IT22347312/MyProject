const express = require("express");
const Budget = require("../models/budget");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new budget
router.post("/budgets", authMiddleware, async (req, res) => {
    try {
        const { category, amount, end_date } = req.body;
        const user_id = req.user.id;

        if (!category || !amount || !end_date) {
            return res.status(400).json({ message: "Category, amount, and end date are required." });
        }

        const budget = new Budget({
            user_id,
            category,
            amount,
            end_date
        });

        await budget.save();
        res.status(201).json({ message: "Budget created successfully", budget });
    } catch (error) {
        res.status(500).json({ message: "Error creating budget", error: error.message });
    }
});

// Get all budgets for a user
router.get("/budgets", authMiddleware, async (req, res) => {
    try {
        const budgets = await Budget.find({ user_id: req.user.id });
        res.status(200).json(budgets);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving budgets", error: error.message });
    }
});

// Update a budget
router.put("/budgets/:id", authMiddleware, async (req, res) => {
    try {
        const budget = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }

        res.status(200).json({ message: "Budget updated successfully", budget });
    } catch (error) {
        res.status(500).json({ message: "Error updating budget", error: error.message });
    }
});

// Delete a budget
router.delete("/budgets/:id", authMiddleware, async (req, res) => {
    try {
        const budget = await Budget.findByIdAndDelete(req.params.id);

        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }

        res.status(200).json({ message: "Budget deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting budget", error: error.message });
    }
});

module.exports = router;
