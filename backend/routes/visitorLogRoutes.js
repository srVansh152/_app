const express = require('express')
const router = express.Router();
const visitorLogController = require('../controllers/visitorLogController');
const { protect } = require('../middlewares/authMiddleware'); // Assuming you have an auth middleware

// Create a new visitor log
router.post('/create', protect, visitorLogController.createVisitorLog);

// Get all visitor logs for the society
router.get('/list', protect, visitorLogController.getVisitorLogs);

// View a single visitor log
router.get('/view/:id', protect, visitorLogController.viewVisitorLog);

// Delete a visitor log
router.delete('/delete/:id', protect, visitorLogController.deleteVisitorLog);

module.exports = router;