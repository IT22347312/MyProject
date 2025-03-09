const Report = require('../models/Report');

// Create a new Report
exports.createReport = async (req, res) => {
    try {
        const { type, data } = req.body;
        const report = new Report({
            user: req.user.id,
            type,
            data,
        });
        await report.save();
        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all Reports for the logged-in user
exports.getReports = async (req, res) => {
    try {
        const reports = await Report.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get a specific Report by ID
exports.getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ message: 'Report not found' });
        if (report.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update a Report
exports.updateReport = async (req, res) => {
    try {
        const { type, data } = req.body;
        const report = await Report.findById(req.params.id);

        if (!report) return res.status(404).json({ message: 'Report not found' });

        if (report.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        report.type = type || report.type;
        report.data = data || report.data;

        await report.save();
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete a Report
exports.deleteReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);

        if (!report) return res.status(404).json({ message: 'Report not found' });

        if (report.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        await report.deleteOne();
        res.json({ message: 'Report deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
