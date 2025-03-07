const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const goalSchema = new Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    target_amount: { type: Number, required: true },
    current_amount: { type: Number, default: 0 }, // Keeps track of how much has been saved
    end_date: { type: Date, required: true },
    is_achieved: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Goal = mongoose.model("Goal", goalSchema);
module.exports = Goal;
