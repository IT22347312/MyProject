const express = require("express");
const router = express.Router();
const Goal = require("../models/goal_model");
const authMiddleware = require("../middleware/authMiddleware");

// Create a new goal
router.post("/goals", authMiddleware, async (req, res) => {
  try {
    const { title, description, target_amount, end_date } = req.body;

    if (!title || !target_amount || !end_date) {
      return res.status(400).json({ message: "Title, target amount, and end date are required." });
    }

    const user_id = req.user.id;
    const goal = new Goal({
      user_id,
      title,
      description,
      target_amount,
      end_date,
    });

    await goal.save();
    res.status(201).json({ message: "Goal created successfully", goal });
  } catch (error) {
    res.status(500).json({ message: "Error creating goal", error: error.message });
  }
});

// Get all goals for a user
router.get("/goals", authMiddleware, async (req, res) => {
  try {
    const goals = await Goal.find({ user_id: req.user.id });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving goals", error: error.message });
  }
});

// Update goal progress (e.g., when a new transaction is made)
router.put("/goals/:id", authMiddleware, async (req, res) => {
  try {
    const { current_amount } = req.body;
    const goal = await Goal.findByIdAndUpdate(
      req.params.id,
      { current_amount },
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Check if the goal is achieved
    if (goal.current_amount >= goal.target_amount) {
      goal.is_achieved = true;
    }

    await goal.save();
    res.status(200).json({ message: "Goal updated successfully", goal });
  } catch (error) {
    res.status(500).json({ message: "Error updating goal", error: error.message });
  }
});

// Delete a goal
router.delete("/goals/:id", authMiddleware, async (req, res) => {
  try {
    const goal = await Goal.findByIdAndDelete(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }
    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting goal", error: error.message });
  }
});

module.exports = router;
