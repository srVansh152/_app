const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const expenseController = require('../controllers/expenseController');
const upload = require('../config/multer');

const router = express.Router();

// Add new expense with billImage upload
router.post(
  '/add',
  protect,
  upload.single('billImage'), // Handling single file upload for bill image
  async (req, res) => {
    try {
      await expenseController.addExpense(req, res);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Update expense with billImage upload
router.put(
  '/update/:id',
  protect,
  upload.single('billImage'), // Handling single file upload for bill image
  async (req, res) => {
    try {
      await expenseController.updateExpense(req, res);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// View a single expense
router.get('/view/:id', protect, expenseController.viewExpense);

// Delete an expense
router.delete('/delete/:id', protect, expenseController.deleteExpense);

// List expenses for the authenticated user's society and admin
router.get('/list', protect, expenseController.listExpensesBySocietyAndAdmin);

module.exports = router;