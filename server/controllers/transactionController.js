const Transaction = require("../models/Transaction");

// Create Transaction
exports.createTransaction = async (req, res) => {
    try {
        const { type, category, amount, date, description } = req.body;
        const transaction = new Transaction({ 
            user: req.user.id, 
            type, 
            category, 
            amount, 
            date, 
            description 
        });
        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Get All Transactions for Logged-in User
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Update Transaction
exports.updateTransaction = async (req, res) => {
    try {
        const { type, category, amount, date, description } = req.body;
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) return res.status(404).json({ message: "Transaction not found" });

        if (transaction.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        transaction.type = type || transaction.type;
        transaction.category = category || transaction.category;
        transaction.amount = amount || transaction.amount;
        transaction.date = date || transaction.date;
        transaction.description = description || transaction.description;

        await transaction.save();
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Delete Transaction
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });

        if (transaction.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await transaction.deleteOne();
        res.json({ message: "Transaction deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
