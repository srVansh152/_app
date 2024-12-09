const mongoose = require('mongoose');

const financialIncomeSchema = new mongoose.Schema({
  title: { type: String},
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  description: { type: String },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  societyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Society', required: true },
  residentStatus: [{
    residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident' },
    hasPaid: { type: Boolean, default: false },
    penaltyAmount: { type: Number, default: 0 }
  }],
  penaltyRules: { 
    type: {
      penaltyAmount: { type: Number, default: 0 }, 
      penaltyAfterDays: { type: Number, default: 0 } 
    },
    required: true
  }
});

module.exports = mongoose.model('FinancialIncome', financialIncomeSchema);
