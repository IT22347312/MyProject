const Notification = require('../models/Notification');

// Create a new Notification
exports.createNotification = async (req, res) => {
    try {
        const { message, type } = req.body;
        const notification = new Notification({
            user: req.user.id,
            message,
            type,
        });
        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all Notifications for the logged-in user
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get a specific Notification by ID
exports.getNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        if (notification.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update a Notification (e.g., mark as read)
exports.updateNotification = async (req, res) => {
    try {
        const { read } = req.body;
        const notification = await Notification.findById(req.params.id);

        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        if (notification.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        notification.read = read !== undefined ? read : notification.read;

        await notification.save();
        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete a Notification
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        if (notification.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        await notification.deleteOne();
        res.json({ message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
