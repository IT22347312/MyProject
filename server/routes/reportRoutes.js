const express = require('express');
const {
    createReport,
    getReports,
    getReportById,
    updateReport,
    deleteReport
} = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create Report
router.post('/', authMiddleware, createReport);

// Get all Reports for logged-in user
router.get('/', authMiddleware, getReports);

// Get specific Report by ID
router.get('/:id', authMiddleware, getReportById);

// Update a Report
router.put('/:id', authMiddleware, updateReport);

// Delete a Report
router.delete('/:id', authMiddleware, deleteReport);

module.exports = router;
