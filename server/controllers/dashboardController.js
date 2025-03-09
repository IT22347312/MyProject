const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const Goal = require("../models/Goal");
const User = require("../models/User");

// Admin Dashboard - Overview of all users, system activity, and financial summaries
exports.getAdminDashboard = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalTransactions = await Transaction.countDocuments();
        const totalIncome = await Transaction.aggregate([
            { $match: { type: "income" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalExpenses = await Transaction.aggregate([
            { $match: { type: "expense" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        res.json({
            totalUsers,
            totalTransactions,
            totalIncome: totalIncome[0]?.total || 0,
            totalExpenses: totalExpenses[0]?.total || 0,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Regular User Dashboard - Personalized summary of transactions, budgets, and goals
exports.getUserDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        const transactions = await Transaction.find({ user: userId }).sort({ date: -1 }).limit(5);  // Latest 5 transactions
        const budgets = await Budget.find({ user: userId });
        const goals = await Goal.find({ user: userId });

        // Summarize the user's financial data
        const totalIncome = await Transaction.aggregate([
            { $match: { user: userId, type: "income" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalExpenses = await Transaction.aggregate([
            { $match: { user: userId, type: "expense" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        res.json({
            transactions,
            budgets,
            goals,
            totalIncome: totalIncome[0]?.total || 0,
            totalExpenses: totalExpenses[0]?.total || 0,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
