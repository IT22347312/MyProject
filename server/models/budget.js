const mongoose = require('mongoose');
const BudgetSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    limit: { type: Number, required: true },
    spent: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Budget', BudgetSchema);