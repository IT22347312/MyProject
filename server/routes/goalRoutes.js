const express = require('express');
const {
    createGoal,
    getGoals,
    addSavings,
} = require('../controllers/goalController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new Goal
router.post('/', authMiddleware, createGoal);

// Get all Goals for logged-in user with savings included
router.get('/', authMiddleware, getGoals);

// Add savings to a goal
router.post('/savings', authMiddleware, addSavings);

module.exports = router;
