const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident', required: true },
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date, default: Date.now },
  paymentType: { type: String, enum: ['FinancialIncome', 'OtherIncome'], required: true },
  incomeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'paymentType'
  },
  societyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Society', required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hasPaid: { type: Boolean, default: false },
  penaltyAmount: { type: Number, default: 0, min: 0 },
  paymentDate: { type: Date },
  paymentMethod: { type: String, enum: ['cash', 'online'], required: true } 

});

module.exports = mongoose.model('Payment', paymentSchema);
