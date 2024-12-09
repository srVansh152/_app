const mongoose = require('mongoose');

const visitorLogSchema = new mongoose.Schema({
  visitorName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
  unit: { type: String, required: true },
  wing: { type: String, required: true },
  time: { type: String, required: true },
  societyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Society', required: true },
  securityId: { type: mongoose.Schema.Types.ObjectId, ref: 'SecurityGuard', required: true },
});


module.exports = mongoose.model('VisitorLog', visitorLogSchema);