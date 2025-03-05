const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        type: { type: String, enum: ["income", "expense"], required: true },
        amount: { type: Number, required: true },
        category: { type: String, required: true },
        date: { type: Date, default: Date.now },
        description: { type: String }
    },
    { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
