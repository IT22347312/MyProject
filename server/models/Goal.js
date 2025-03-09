const mongoose = require('mongoose');

const SavingsSchema = new mongoose.Schema({
    amount: { type: Number, required: true }, // Amount added to goal savings
    date: { type: Date, default: Date.now }
});

const GoalSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true }, // e.g., "Saving for a car"
    targetAmount: { type: Number, required: true }, // Goal target (e.g., 20000)
    currentAmount: { type: Number, default: 0 }, // Current savings towards the goal
    deadline: { type: Date, required: true }, // Goal deadline date
    status: {
        type: String,
        enum: ['active', 'completed', 'expired'],
        default: 'active'
    },
    savings: [SavingsSchema], // Embedded array of savings associated with the goal
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Goal', GoalSchema);
