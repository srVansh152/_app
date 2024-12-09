const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  society: { type: mongoose.Schema.Types.ObjectId, ref: 'Society', required: true },
  complaintName: { type: String, required: true },
  description: { type: String },
  wing: { type: String },
  unitNumber: { type: String, required: true },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
  status: { type: String, enum: ['Pending', 'Open', 'Solved'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', complaintSchema);           