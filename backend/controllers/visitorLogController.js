const VisitorLog = require('../models/VisitorLog');

exports.createVisitorLog = async (req, res) => {
  try {
    const { visitorName, phoneNumber, date, unit, wing, time } = req.body;

    // Debugging logs
    console.log('Request Body:', req.body);
    console.log('User from Middleware:', req.user);

    // Validate required fields
    const errors = [];
    if (!visitorName) errors.push('Visitor name is required.');
    if (!phoneNumber) errors.push('Phone number is required.');
    if (!unit) errors.push('Unit is required.');
    if (!wing) errors.push('Wing is required.');
    if (!time) errors.push('Time is required.');

    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation error', errors });
    }

    // Ensure req.user has the necessary data
    if (!req.user.societyId || !req.user._id) {
      return res.status(400).json({ message: 'User is not associated with a society or is missing security ID.' });
    }

    // Create visitor log entry
    const visitorLog = new VisitorLog({
      visitorName,
      phoneNumber,
      date: date || new Date(),
      unit,
      wing,
      time,
      societyId: req.user.societyId,
      securityId: req.user._id, // Security Guard ID
    });

    await visitorLog.save();
    res.status(201).json({ message: 'Visitor log created successfully', visitorLog });
  } catch (error) {
    console.error('Create Visitor Log Error:', error);

    if (error.name === 'ValidationError') {
      // Format validation errors for the response
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }

    res.status(500).json({ message: 'Error creating visitor log', error: error.message });
  }
};


// Get all visitor logs for a specific society
exports.getVisitorLogs = async (req, res) => {
  try {
    // Check for societyId or fallback to society
    const societyId = req.user.societyId || req.user.society;

    if (!societyId) {
      return res.status(400).json({ message: 'Society ID is missing. Please log in again.' });
    }

    const visitorLogs = await VisitorLog.find({ societyId })
      .populate('securityId', 'fullName') // Populate security guard's full name
      .sort({ date: -1 });

    res.status(200).json({ visitorLogs });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching visitor logs', error: error.message });
  }
};

// View a single visitor log
exports.viewVisitorLog = async (req, res) => {
  try {
    const visitorLog = await VisitorLog.findById(req.params.id)
      .populate('securityId', 'fullName'); // Populate security guard's name

    if (!visitorLog) return res.status(404).json({ message: 'Visitor log not found' });

    res.status(200).json({ visitorLog });
  } catch (error) {
    res.status(500).json({ message: 'Error viewing visitor log', error: error.message });
  }
};

// Delete a visitor log
exports.deleteVisitorLog = async (req, res) => {
  try {
    const visitorLog = await VisitorLog.findByIdAndDelete(req.params.id);

    if (!visitorLog) return res.status(404).json({ message: 'Visitor log not found' });

    res.status(200).json({ message: 'Visitor log deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting visitor log', error: error.message });
  }
};