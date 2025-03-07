const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const authMiddleware = require("../middleware/authMiddleware");

// Add a new transaction (Income/Expense)
router.post("/transactions", authMiddleware, async (req, res) => {
    try {
        const {
            type,
            amount,
            category,
            tags,
            description,
            is_recurring,
            recurrence_pattern,
            end_date,
            date
        } = req.body;

        const user_id = req.user.id;  // This will come from the middleware

        // Validate required fields
        if (!type || !amount || !category) {
            return res.status(400).json({ message: "Type, amount, and category are required." });
        }

        // Validate the recurrence pattern only if the transaction is recurring
        if (is_recurring && !recurrence_pattern) {
            return res.status(400).json({ message: "Recurrence pattern is required for recurring transactions." });
        }

        // Validate end_date if is_recurring is true
        if (is_recurring && !end_date) {
            return res.status(400).json({ message: "End date is required for recurring transactions." });
        }

        // Set the date to the current date if not provided
        const transactionDate = date || Date.now();

        const transaction = new Transaction({
            user_id, // This user_id is taken from the JWT token
            type,
            amount,
            category,
            tags,
            description,
            date: transactionDate,
            is_recurring,
            recurrence_pattern,
            end_date
        });

        await transaction.save();
        res.status(201).json({ message: "Transaction added successfully", transaction });
    } catch (error) {
        res.status(500).json({ message: "Error adding transaction", error: error.message });
    }
});


// Get all transactions for a user
router.get("/transactions", authMiddleware, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user_id: req.user.id }).sort({ date: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving transactions", error: error.message });
    }
});

// Filter transactions by category or tags
router.get("/transactions/filter", authMiddleware, async (req, res) => {
    try {
        const { category, tags } = req.query;
        let filter = { user_id: req.user.id };

        if (category) filter.category = category;
        if (tags) filter.tags = { $in: tags.split(",") };

        const transactions = await Transaction.find(filter);
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Error filtering transactions", error: error.message });
    }
});

// Edit a transaction
router.put("/transactions/:id", authMiddleware, async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({ message: "Transaction updated successfully", transaction });
    } catch (error) {
        res.status(500).json({ message: "Error updating transaction", error: error.message });
    }
});

// Delete a transaction
router.delete("/transactions/:id", authMiddleware, async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting transaction", error: error.message });
    }
});

module.exports = router;
