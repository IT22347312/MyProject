const mongoose = require('mongoose');
const ReportSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['income', 'expense', 'summary'], required: true },
    data: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Report', ReportSchema);