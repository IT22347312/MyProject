const express = require("express");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");  

const router = express.Router();

// Create Transaction (Income/Expense)
router.post("/transactions", verifyToken, async (req, res) => {
    try {
        const { type, amount, category, tags, description, is_recurring, recurrence_pattern, end_date } = req.body;
        
        // Validate required fields
        if (!type || !amount || !category) {
            return res.status(400).json({ message: "Type, amount, and category are required." });
        }

        // Create new transaction
        const transaction = new Transaction({
            user_id: req.user.id,  // Assign the user_id from the token
            type,
            amount,
            category,
            tags,
            description,
            is_recurring: is_recurring || false,
            recurrence_pattern,
            end_date: end_date || null,
        });

        // Save transaction to DB
        await transaction.save();
        res.status(201).json({ message: "Transaction created successfully", transaction });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create transaction. Please try again later." });
    }
});

// Get all Transactions (Filter by category/tag, Sort by date)
router.get("/transactions", verifyToken, async (req, res) => {
    try {
        const { category, tag, sortByDate = "desc" } = req.query;
        
        // Build query object
        let query = { user_id: req.user.id };

        if (category) query.category = category;
        if (tag) query.tags = { $in: [tag] };

        const transactions = await Transaction.find(query)
            .sort({ date: sortByDate === "asc" ? 1 : -1 })  // Sort by date, default descending

        res.status(200).json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to retrieve transactions. Please try again later." });
    }
});

// Update Transaction (e.g., edit details, change recurrence)
router.put("/transactions/:id", verifyToken, async (req, res) => {
    try {
        const transactionId = req.params.id;
        const { type, amount, category, tags, description, is_recurring, recurrence_pattern, end_date } = req.body;

        const transaction = await Transaction.findOne({ _id: transactionId, user_id: req.user.userId });

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found or you're not authorized." });
        }

        // Update transaction fields
        transaction.type = type || transaction.type;
        transaction.amount = amount || transaction.amount;
        transaction.category = category || transaction.category;
        transaction.tags = tags || transaction.tags;
        transaction.description = description || transaction.description;
        transaction.is_recurring = is_recurring !== undefined ? is_recurring : transaction.is_recurring;
        transaction.recurrence_pattern = recurrence_pattern || transaction.recurrence_pattern;
        transaction.end_date = end_date || transaction.end_date;

        // Save updated transaction
        await transaction.save();
        res.status(200).json({ message: "Transaction updated successfully", transaction });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update transaction. Please try again later." });
    }
});

// Delete Transaction
router.delete("/transactions/:id", verifyToken, async (req, res) => {
    try {
        const transactionId = req.params.id;

        const transaction = await Transaction.findOneAndDelete({ _id: transactionId, user_id: req.user.userId });

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found or you're not authorized." });
        }

        res.status(200).json({ message: "Transaction deleted successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete transaction. Please try again later." });
    }
});

// Handle Recurring Transactions
const handleRecurringTransactions = async () => {
    try {
        // Get all recurring transactions that haven't ended
        const recurringTransactions = await Transaction.find({
            is_recurring: true,
            end_date: { $gt: new Date() },
        });

        recurringTransactions.forEach(async (transaction) => {
            // Logic to create the next occurrence based on recurrence pattern
            const nextTransaction = { ...transaction._doc, _id: undefined };  // Remove existing _id for new transaction
            const today = new Date();

            if (transaction.recurrence_pattern === "daily") {
                nextTransaction.date = new Date(today.setDate(today.getDate() + 1));  // Set next date to tomorrow
            } else if (transaction.recurrence_pattern === "weekly") {
                nextTransaction.date = new Date(today.setDate(today.getDate() + 7));  // Set next date to one week later
            } else if (transaction.recurrence_pattern === "monthly") {
                nextTransaction.date = new Date(today.setMonth(today.getMonth() + 1));  // Set next date to one month later
            }

            // Create new recurring transaction entry
            await new Transaction(nextTransaction).save();
        });
    } catch (err) {
        console.error("Error handling recurring transactions: ", err);
    }
};

// Call the handleRecurringTransactions periodically (e.g., daily at midnight)
setInterval(handleRecurringTransactions, 24 * 60 * 60 * 1000);  // Every 24 hours

module.exports = router;
