const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const budgetSchema = new Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        category: { type: String, enum: ["Food", "Transportation", "Entertainment", "Bills", "Others"], required: true },
        amount: { type: Number, required: true },
        start_date: { type: Date, default: Date.now },
        end_date: { type: Date, required: true },
        is_active: { type: Boolean, default: true }
    },
    { timestamps: true }
);

const Budget = mongoose.model("Budget", budgetSchema);
module.exports = Budget;
