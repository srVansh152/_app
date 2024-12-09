const SecurityProtocol = require('../models/SecurityProtocol');

// Create a new security protocol
exports.addProtocol = async (req, res) => {
  try {
    const { title, description, date, time} = req.body;

    if (!title || !description || !date || !time) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const protocol = new SecurityProtocol({
      title,
      description,
      date,
      time,
      societyId: req.user.society._id,
      adminId: req.user._id
    });

    await protocol.save();
    res.status(201).json({ message: 'Protocol created successfully', protocol });
  } catch (error) {
    res.status(500).json({ message: 'Error creating protocol', error: error.message });
  }
};

// Update a security protocol
exports.updateProtocol = async (req, res) => {
  try {
    const { title, description, date, time } = req.body;

    // Validate required fields
    if (!title || !description || !date || !time) {
      return res.status(400).json({ message: 'All fields are required for update' });
    }

    const protocol = await SecurityProtocol.findByIdAndUpdate(
      req.params.id,
      { title, description, date, time },
      { new: true, runValidators: true } 
    );

    if (!protocol) return res.status(404).json({ message: 'Protocol not found' });

    res.status(200).json({ message: 'Protocol updated successfully', protocol });
  } catch (error) {
    res.status(500).json({ message: 'Error updating protocol', error: error.message });
  }
};

// View a single protocol
exports.viewProtocol = async (req, res) => {
  try {
    const protocol = await SecurityProtocol.findById(req.params.id);

    if (!protocol) return res.status(404).json({ message: 'Protocol not found' });

    res.status(200).json({ protocol });
  } catch (error) {
    res.status(500).json({ message: 'Error viewing protocol', error: error.message });
  }
};

// Delete a protocol
exports.deleteProtocol = async (req, res) => {
  try {
    const protocol = await SecurityProtocol.findByIdAndDelete(req.params.id);

    if (!protocol) return res.status(404).json({ message: 'Protocol not found' });

    res.status(200).json({ message: 'Protocol deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting protocol', error: error.message });
  }
};

// List all protocols
exports.getProtocols = async (req, res) => {
  try {
    
    const protocols = await SecurityProtocol.find({ societyId: req.user.society._id })
      .sort({ createdAt: -1 });

    if (!protocols.length) {
      return res.status(404).json({ message: 'No protocols found for this society' });
    }

    res.status(200).json({ protocols });
  } catch (error) {
    res.status(500).json({ message: 'Error listing protocols', error: error.message });
  }
};