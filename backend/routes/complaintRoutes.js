// routes/complaintRoutes.js
const express = require('express');
const router = express.Router();
const {protect} = require('../middlewares/authMiddleware'); // Ensure this middleware protects routes
const complaintController = require('../controllers/complaintController');

// Define routes and attach the controller functions
router.post('/createComplaint', protect, complaintController.createComplaint);
router.put('/update/:id', protect, complaintController.updateComplaint);
router.get('/view/:id', protect, complaintController.viewComplaint);
router.delete('/delete/:id', protect, complaintController.deleteComplaint);
router.get('/list', protect, complaintController.listComplaintsBySocietyAndAdmin);

module.exports = router;