const EmergencyAlert = require('../models/EmergencyAlert');
const User = require('../models/User');
const Resident = require('../models/Resident');
const Security = require('../models/SecurityGuardModel');
const notificationService = require('../socket/notificationService');

// Create a new emergency alert
exports.createEmergencyAlert = async (req, res) => {
  try {
    const { alertType, description } = req.body;

    // Get societyId from req.user
    const societyId = req.user.society._id;

    if (!alertType || !description) {
      return res.status(400).json({ message: 'Both alert type and description are required.' });
    }

    const emergencyAlert = new EmergencyAlert({
      alertType,
      description,
      societyId,
    });

    await emergencyAlert.save();
    
    // Fetch all users in the society
    const usersInSociety = await User.find({
      society: req.user.society._id
    }).select('_id');
    
    console.log("notification sent");
    // Fetch all residents in the society
    const residentsInSociety = await Resident.find({
      society: req.user.society._id
    }).select('_id');

    // Fetch all security guards in the society
    const securityInSociety = await Security.find({
      societyId: req.user.society._id 
    }).select('_id');

    // Combine all user IDs
    const targetUserIds = [
      ...usersInSociety.map(user => user._id),
      ...residentsInSociety.map(resident => resident._id),
      ...securityInSociety.map(security => security._id)
    ];

    await notificationService.sendNotification({
      type: 'emergency',
      message: `New emergency alert created: ${emergencyAlert.description}`,
      societyId: req.user.society._id,
      targetUsers: targetUserIds,
    });
    res.status(201).json({ message: 'Emergency alert created successfully', alert: emergencyAlert });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all emergency alerts for the society
exports.getEmergencyAlerts = async (req, res) => {
  try {
    const alerts = await EmergencyAlert.find({ societyId: req.user.society });
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single emergency alert
exports.getEmergencyAlert = async (req, res) => {
  try {
    const alert = await EmergencyAlert.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    res.status(200).json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an emergency alert
exports.updateEmergencyAlert = async (req, res) => {
  try {
    const { alertType, description } = req.body;
    const alert = await EmergencyAlert.findByIdAndUpdate(
      req.params.id,
      { alertType, description },
      { new: true }
    );
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    res.status(200).json({ message: 'Alert updated successfully', alert });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an emergency alert
exports.deleteEmergencyAlert = async (req, res) => {
  try {
    const alert = await EmergencyAlert.findByIdAndDelete(req.params.id);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    res.status(200).json({ message: 'Alert deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};