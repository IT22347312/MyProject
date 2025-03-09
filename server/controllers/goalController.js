const Goal = require('../models/Goal');

// Create a new Goal
exports.createGoal = async (req, res) => {
    try {
        const { name, targetAmount, deadline } = req.body;
        const goal = new Goal({
            user: req.user.id,
            name,
            targetAmount,
            deadline,
        });
        await goal.save();
        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all Goals for logged-in user with savings included
exports.getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Add savings to an existing goal
exports.addSavings = async (req, res) => {
    try {
        const { goalId, amount } = req.body;
        const goal = await Goal.findById(goalId);
        if (!goal) return res.status(404).json({ message: 'Goal not found' });

        // Create a new savings entry
        const savings = {
            amount,
            date: new Date(),
        };

        // Add savings to the goal's savings array and update the current amount
        goal.savings.push(savings);
        goal.currentAmount += amount;

        // Save the updated goal
        await goal.save();
        res.status(201).json(goal); // Return the updated goal with savings
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
