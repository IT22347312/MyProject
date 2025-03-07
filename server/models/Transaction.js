const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const transactionSchema = new Schema(
    {
        id: ObjectId,
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        type: { type: String, enum: ["income", "expense"], required: true }, 
        amount: { type: Number, required: true },
        category: { type: String, enum: ["Food", "Transportation", "Entertainment", "Bills", "Salary", "Others"], required: true },
        tags: [{ type: String }], // Example: ["#vacation", "#rent"]
        description: { type: String },
        date: { type: Date, default: Date.now },
        is_recurring: { type: Boolean, default: false },
        recurrence_pattern: { type: String, enum: ["daily", "weekly", "monthly"], default: null },
        end_date: { type: Date, default: null }
    },
    { timestamps: true } // Adds createdAt and updatedAt timestamps
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
