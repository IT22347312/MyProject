const asyncHandler = require("express-async-handler");
const Transaction = require("../models/Transaction");

// Transaction Controller
const transactionController = {
  //! Add a new transaction
  create: asyncHandler(async (req, res) => {
    const { type, category, amount, date, description, tags, is_recurring, recurrence_pattern, end_date } = req.body;

    // Ensure required fields are present
    if (!amount || !type || !date) {
      return res.status(400).json({ error: "Type, amount, and date are required" });
    }

    // Create a new transaction and associate it with the logged-in user
    const transaction = await Transaction.create({
      user: req.user._id, // Automatically associate the transaction with the authenticated user
      type,
      category,
      amount,
      date,
      description,
      tags,
      is_recurring,
      recurrence_pattern,
      end_date,
    });

    // Send the response with the created transaction details
    res.status(201).json(transaction);
  }),

  //! Get all transactions (with filters)
  getFilteredTransactions: asyncHandler(async (req, res) => {
    const { startDate, endDate, type, category } = req.query;
    let filters = { user: req.user };

    if (startDate) {
      filters.date = { ...filters.date, $gte: new Date(startDate) };
    }
    if (endDate) {
      filters.date = { ...filters.date, $lte: new Date(endDate) };
    }
    if (type) {
      filters.type = type;
    }
    if (category) {
      if (category === "All") {
        // No category filter needed when filtering for 'All'
      } else if (category === "Uncategorized") {
        // Filter for transactions that are specifically categorized as 'Uncategorized'
        filters.category = "Uncategorized";
      } else {
        filters.category = category;
      }
    }

    const transactions = await Transaction.find(filters).sort({ date: -1 });
    res.json(transactions);
  }),

  //! Update a transaction
  update: asyncHandler(async (req, res) => {
    const { amount, description, tags, is_recurring, recurrence_pattern, end_date } = req.body;
    const transactionId = req.params.id; // Get the transaction ID from the URL

    // Find the transaction by ID
    const transaction = await Transaction.findById(transactionId);

    // Ensure the transaction exists
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    // Check if the user is the owner of the transaction
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You are not authorized to update this transaction" });
    }

    // Update the transaction fields
    transaction.amount = amount || transaction.amount;
    transaction.description = description || transaction.description;
    transaction.tags = tags || transaction.tags;
    transaction.is_recurring = is_recurring !== undefined ? is_recurring : transaction.is_recurring;
    transaction.recurrence_pattern = recurrence_pattern || transaction.recurrence_pattern;
    transaction.end_date = end_date || transaction.end_date;

    // Save the updated transaction
    const updatedTransaction = await transaction.save();

    // Respond with the updated transaction details
    res.json(updatedTransaction);
  }),

  //! Delete a transaction
  delete: asyncHandler(async (req, res) => {
    const transactionId = req.params.id;

    // Find the transaction by ID
    const transaction = await Transaction.findById(transactionId);

    // Ensure the transaction exists and belongs to the authenticated user
    if (!transaction || transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Transaction not found or unauthorized" });
    }

    // Delete the transaction
    await Transaction.findByIdAndDelete(transactionId);

    // Respond with success message
    res.json({ message: "Transaction removed successfully" });
  }),
};

module.exports = transactionController;
