const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const budgetSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        category: { type: String, required: true },
        limit: { type: Number, required: true },
        spent: { type: Number, default: 0 }
    },
    { timestamps: true }
);

const Budget = mongoose.model("Budget", budgetSchema);
module.exports = Budget;
