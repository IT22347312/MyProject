const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["income", "expense"],
    },
    
    category: {
      type: String,
      required: true,
      default: "Uncategorized",
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
         type: String,
          enum: ["Food", "Transportation", "Entertainment", "Bills", "Salary", "Others"],
           required: true
         },
         tags: [{ type: String }],

    date: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      required: false,
    },
    is_recurring: { 
        type: Boolean,
         default: false
         },

    recurrence_pattern: {
         type: String,
          enum: ["daily", "weekly", "monthly"],
           default: null 
        },
    end_date: {
         type: Date, 
         default: null
         }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);




