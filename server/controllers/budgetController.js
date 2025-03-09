const Budget = require('../models/Budget');

// Create a new Budget
exports.createBudget = async (req, res) => {
    try {
        const { category, limit, date } = req.body;
        const budget = new Budget({
            user: req.user.id,
            category,
            limit,
            spent: 0, // Initialize spent to 0
            date
        });
        await budget.save();
        res.status(201).json(budget);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all Budgets for the logged-in user
exports.getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user.id }).sort({ date: -1 });
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update a Budget
exports.updateBudget = async (req, res) => {
    try {
        const { category, limit, date } = req.body;
        const budget = await Budget.findById(req.params.id);

        if (!budget) return res.status(404).json({ message: 'Budget not found' });

        if (budget.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        budget.category = category || budget.category;
        budget.limit = limit || budget.limit;
        budget.date = date || budget.date;

        await budget.save();
        res.json(budget);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete a Budget
exports.deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);

        if (!budget) return res.status(404).json({ message: 'Budget not found' });

        if (budget.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        await budget.deleteOne();
        res.json({ message: 'Budget deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
