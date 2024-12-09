const mongoose = require('mongoose');

const emergencyAlertSchema = new mongoose.Schema({
  alertType: {
    type: String,
    required: true,
    enum: ['Fire', 'Earthquake', 'Flooding', 'Medical', 'Power Outage', 'Intruder', 'Other'], 
  },
  description: {
    type: String,
    required: true,
  },
    societyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Society', 
    required: true 
  },
});

module.exports = mongoose.model('EmergencyAlert', emergencyAlertSchema);