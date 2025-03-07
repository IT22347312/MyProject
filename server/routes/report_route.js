const express = require("express");
const Transaction = require("../models/Transaction");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get income vs expenses report for a specific period
router.get("/reports", authMiddleware, async (req, res) => {
    try {
        const { start_date, end_date, category } = req.query;
        const user_id = req.user.id;

        const filter = { user_id };
        if (start_date && end_date) {
            filter.date = { $gte: new Date(start_date), $lte: new Date(end_date) };
        }
        if (category) {
            filter.category = category;
        }

        const transactions = await Transaction.find(filter);
        const income = transactions.filter(t => t.type === "income").reduce((total, t) => total + t.amount, 0);
        const expense = transactions.filter(t => t.type === "expense").reduce((total, t) => total + t.amount, 0);

        res.status(200).json({
            income,
            expense,
            balance: income - expense
        });
    } catch (error) {
        res.status(500).json({ message: "Error generating report", error: error.message });
    }
});

module.exports = router;
