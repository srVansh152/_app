const express = require('express');
const {
  createImportantNumber,
  getImportantNumbers,
  updateImportantNumber,
  deleteImportantNumber,
} = require('../controllers/importantNumberController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes are protected, meaning the user must be logged in
router.use(protect);

router
  .route('/')
  .post(createImportantNumber)  // Add a new contact
  .get(getImportantNumbers);    // Get all contacts

router
  .route('/:id')
  .put(updateImportantNumber)   // Update contact by ID
  .delete(deleteImportantNumber); // Delete contact by ID

module.exports = router;
