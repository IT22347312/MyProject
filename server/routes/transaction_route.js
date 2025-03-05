const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const authMiddleware = require("../middlewares/authMiddleware");

// Add a transaction
router.post("/add", authMiddleware, async (req, res) => {
    try {
        const { type, amount, category, description } = req.body;

        const transaction = new Transaction({
            user: req.user.id,
            type,
            amount,
            category,
            description
        });

        await transaction.save();
        res.status(201).json({ message: "Transaction added successfully", transaction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Edit a transaction
router.put("/edit/:id", authMiddleware, async (req, res) => {
    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTransaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a transaction
router.delete("/delete/:id", authMiddleware, async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all transactions for a user
router.get("/all", authMiddleware, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
