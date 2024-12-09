const express = require('express');
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Create payment records for all residents in a financial income
router.post('/financial-income', protect, paymentController.createPaymentsForFinancialIncome);

// Get payment status for each resident in a specific financial income
router.get('/financial-income/:financialIncomeId', protect, paymentController.getPaymentsByFinancialIncome);

// Mark a resident as paid in a specific financial income
router.patch('/financial-income/:financialIncomeId/mark-paid', protect, paymentController.markResidentPaidInFinancialIncome);

// Create payment records for all residents in an other income
router.post('/other-income', protect, paymentController.createPaymentsForOtherIncome);

// Get payment status for each resident in a specific other income
router.get('/other-income/:otherIncomeId', protect, paymentController.getPaymentsByOtherIncome);

// Mark a resident as paid in a specific other income
router.patch('/other-income/:otherIncomeId/mark-paid', protect, paymentController.markResidentPaidInOtherIncome);

module.exports = router;
