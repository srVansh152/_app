const mongoose = require('mongoose');

const otherIncomeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  societyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Society', required: true },
  paidByResidents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }], // List of payments made by residents
});

module.exports = mongoose.model('OtherIncome', otherIncomeSchema);
