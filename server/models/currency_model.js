const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const currencySchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    symbol: { type: String },
    exchange_rate: { type: Number, required: true }, // Rate relative to the base currency (e.g., USD)
    updated_at: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Currency = mongoose.model("Currency", currencySchema);
module.exports = Currency;
