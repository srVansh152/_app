const express = require('express');
const router = express.Router();
const facilityController = require('../controllers/facilityController'); // Ensure this path is correct
const { protect }  = require('../middlewares/authMiddleware'); // Ensure this path is correct

console.log(facilityController);

// Routes for facility management
router.post('/facility', protect, facilityController.addFacility);
router.put('/facility/:id', protect, facilityController.updateFacility);
router.get('/facility/:id', protect, facilityController.viewFacility);
router.delete('/facility/:id', protect, facilityController.deleteFacility);
router.get('/facility', protect, facilityController.getFacilities);

module.exports = router;