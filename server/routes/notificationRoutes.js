const express = require('express');
const {
    createNotification,
    getNotifications,
    getNotificationById,
    updateNotification,
    deleteNotification
} = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create Notification
router.post('/', authMiddleware, createNotification);

// Get all Notifications for logged-in user
router.get('/', authMiddleware, getNotifications);

// Get specific Notification by ID
router.get('/:id', authMiddleware, getNotificationById);

// Update a Notification (e.g., mark as read)
router.put('/:id', authMiddleware, updateNotification);

// Delete a Notification
router.delete('/:id', authMiddleware, deleteNotification);

module.exports = router;
