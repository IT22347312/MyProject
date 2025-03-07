const express = require("express");
const router = express.Router();
const Currency = require("../models/currency_model");
const axios = require("axios"); // For real-time currency conversion API
const authMiddleware = require("../middleware/authMiddleware");

// Add a new currency
router.post("/currencies", authMiddleware, async (req, res) => {
  try {
    const { code, symbol, exchange_rate } = req.body;

    if (!code || !exchange_rate) {
      return res.status(400).json({ message: "Code and exchange rate are required." });
    }

    const currency = new Currency({
      code,
      symbol,
      exchange_rate,
    });

    await currency.save();
    res.status(201).json({ message: "Currency added successfully", currency });
  } catch (error) {
    res.status(500).json({ message: "Error adding currency", error: error.message });
  }
});

// Get all currencies
router.get("/currencies", async (req, res) => {
  try {
    const currencies = await Currency.find({});
    res.status(200).json(currencies);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving currencies", error: error.message });
  }
});

// Convert an amount from one currency to another
router.get("/convert", async (req, res) => {
  const { from, to, amount } = req.query;

  if (!from || !to || !amount) {
    return res.status(400).json({ message: "From, to, and amount are required." });
  }

  try {
    const fromCurrency = await Currency.findOne({ code: from });
    const toCurrency = await Currency.findOne({ code: to });

    if (!fromCurrency || !toCurrency) {
      return res.status(400).json({ message: "Invalid currency code(s)." });
    }

    // Convert the amount
    const convertedAmount = (amount / fromCurrency.exchange_rate) * toCurrency.exchange_rate;
    res.status(200).json({ convertedAmount });
  } catch (error) {
    res.status(500).json({ message: "Error converting currencies", error: error.message });
  }
});

module.exports = router;
