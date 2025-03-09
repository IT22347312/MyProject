const express = require('express');
const {
    createBudget,
    getBudgets,
    updateBudget,
    deleteBudget
} = require('../controllers/budgetController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create Budget
router.post('/', authMiddleware, createBudget);

// Get all Budgets for logged-in user
router.get('/', authMiddleware, getBudgets);

// Update a Budget
router.put('/:id', authMiddleware, updateBudget);

// Delete a Budget
router.delete('/:id', authMiddleware, deleteBudget);

module.exports = router;
