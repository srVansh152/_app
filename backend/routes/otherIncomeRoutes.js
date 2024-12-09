const express = require('express');
const otherIncomeController = require('../controllers/otherIncomeController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/other-income', protect, otherIncomeController.createOtherIncome);
router.get('/other-income', protect, otherIncomeController.getOtherIncomes);
router.get('/other-income/:id', protect, otherIncomeController.getOtherIncomeById);
router.patch('/other-income/:id', protect, otherIncomeController.editOtherIncome);
router.delete('/other-income/expired', protect, otherIncomeController.deleteExpiredOtherIncome);
router.patch('/other-income/:id/mark-paid', protect, otherIncomeController.markResidentPaid);

module.exports = router;
