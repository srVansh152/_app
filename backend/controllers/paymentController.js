const Payment = require('../models/Payment');
const FinancialIncome = require('../models/Financial');
const OtherIncome = require('../models/OtherIncome');
const Society = require('../models/Society');

// Create payment records for each resident in a Financial Income record
exports.createPaymentsForFinancialIncome = async (req, res) => {
  const { financialIncomeId } = req.body;

  try {
    const financialIncome = await FinancialIncome.findById(financialIncomeId).populate('societyId');
    if (!financialIncome) return res.status(404).json({ message: 'Financial Income not found' });

    const society = await Society.findById(financialIncome.societyId).populate('residents');
    const paymentPromises = society.residents.map(resident => {
      return Payment.create({
        residentId: resident._id,
        incomeId: financialIncomeId,
        paymentType: 'FinancialIncome',
        societyId: financialIncome.societyId,
        adminId: financialIncome.adminId,
        penaltyAmount: 0
      });
    });

    await Promise.all(paymentPromises);
    res.status(201).json({ message: 'Payments created for all residents in Financial Income' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create payment records for each resident in an Other Income record
exports.createPaymentsForOtherIncome = async (req, res) => {
  const { otherIncomeId } = req.body;

  try {
    const otherIncome = await OtherIncome.findById(otherIncomeId).populate('societyId');
    if (!otherIncome) return res.status(404).json({ message: 'Other Income not found' });

    const society = await Society.findById(otherIncome.societyId).populate('residents');
    const paymentPromises = society.residents.map(resident => {
      return Payment.create({
        residentId: resident._id,
        incomeId: otherIncomeId,
        paymentType: 'OtherIncome',
        societyId: otherIncome.societyId,
        adminId: otherIncome.adminId,
        penaltyAmount: 0
      });
    });

    await Promise.all(paymentPromises);
    res.status(201).json({ message: 'Payments created for all residents in Other Income' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get payment status for all residents in a specific Financial Income record
exports.getPaymentsByFinancialIncome = async (req, res) => {
  try {
    const payments = await Payment.find({ incomeId: req.params.financialIncomeId, paymentType: 'FinancialIncome' })
      .populate('residentId')
      .populate('incomeId');

    res.json(payments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get payment status for all residents in a specific Other Income record
exports.getPaymentsByOtherIncome = async (req, res) => {
  try {
    const payments = await Payment.find({ incomeId: req.params.otherIncomeId, paymentType: 'OtherIncome' })
      .populate('residentId')
      .populate('incomeId');

    res.json(payments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mark a resident's payment as complete for a Financial Income
exports.markResidentPaidInFinancialIncome = async (req, res) => {
  try {
    const { residentId } = req.body;
    const payment = await Payment.findOne({
      incomeId: req.params.financialIncomeId,
      residentId,
      paymentType: 'FinancialIncome'
    });

    if (!payment) return res.status(404).json({ message: 'Payment record not found' });

    payment.hasPaid = true;
    payment.penaltyAmount = 0;
    payment.paymentDate = new Date();
    await payment.save();

    res.json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mark a resident's payment as complete for an Other Income
exports.markResidentPaidInOtherIncome = async (req, res) => {
  try {
    const { residentId } = req.body;
    const payment = await Payment.findOne({
      incomeId: req.params.otherIncomeId,
      residentId,
      paymentType: 'OtherIncome'
    });

    if (!payment) return res.status(404).json({ message: 'Payment record not found' });

    payment.hasPaid = true;
    payment.penaltyAmount = 0;
    payment.paymentDate = new Date();
    await payment.save();

    res.json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
