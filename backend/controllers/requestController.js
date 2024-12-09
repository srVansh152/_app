const Request = require('../models/Request');

// Create a new request
exports.createRequest = async (req, res) => {
  try {
    const { requestName, description, wing, unitNumber, priority, status } = req.body;

    const request = new Request({
      requestor: req.user._id,
      society: req.user.society._id,
      requestName,
      description,
      wing,
      unitNumber,
      priority,
      status: status || 'Pending',
    });

    await request.save();
    res.status(201).json({ message: 'Request created successfully', request });
  } catch (error) {
    res.status(500).json({ message: 'Error creating request', error });
  }
};

// Update a request
exports.updateRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    if (!request) return res.status(404).json({ message: 'Request not found' });

    res.status(200).json({ message: 'Request updated successfully', request });
  } catch (error) {
    res.status(500).json({ message: 'Error updating request', error });
  }
};

// View a single request with requestor profile photo
exports.viewRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('requestor', 'name profilePhoto') // Populate requestor name and photo
      .populate('society', 'name');

    if (!request) return res.status(404).json({ message: 'Request not found' });

    res.status(200).json({ request });
  } catch (error) {
    res.status(500).json({ message: 'Error viewing request', error });
  }
};

// Delete a request
exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);

    if (!request) return res.status(404).json({ message: 'Request not found' });

    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting request', error });
  }
};

// List all requests for a specific society and admin
exports.listRequestsBySocietyAndAdmin = async (req, res) => {
  try {
    const requests = await Request.find({
      society: req.user.society._id
    });

    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: 'Error listing requests', error });
  }
};