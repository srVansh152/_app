const Complaint = require('../models/Complaint');
const User = require('../models/User');

// Create a new complaint
exports.createComplaint = async (req, res) => {
  try {
    const { complaintName, description, wing, unitNumber, priority, status } = req.body;

    const complaint = new Complaint({
      complainer: req.user._id,
      society: req.user.society._id,
      complaintName,
      description,
      wing,
      unitNumber,
      priority,
      status: status || 'Pending',
    });

    await complaint.save();
    res.status(201).json({ message: 'Complaint created successfully', complaint });
  } catch (error) {
    res.status(500).json({ message: 'Error creating complaint', error });
  }
};

// Update a complaint
exports.updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    res.status(200).json({ message: 'Complaint updated successfully', complaint });
  } catch (error) {
    res.status(500).json({ message: 'Error updating complaint', error });
  }
};

// View a single complaint with complainer profile photo
exports.viewComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('complainer', 'name profilePhoto')  // Populate complainer name and photo
      .populate('society', 'name');

    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    res.status(200).json({ complaint });
  } catch (error) {
    res.status(500).json({ message: 'Error viewing complaint', error });
  }
};

// Delete a complaint
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);

    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    res.status(200).json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting complaint', error });
  }
};

// List all complaints for a specific society and admin
exports.listComplaintsBySocietyAndAdmin = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      society: req.user.society._id
    });

    res.status(200).json({ complaints });
  } catch (error) {
    res.status(500).json({ message: 'Error listing complaints', error });
  }
};