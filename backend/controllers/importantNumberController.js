const ImportantNumber = require('../models/ImportantNumber');

// Create a new important number
exports.createImportantNumber = async (req, res) => {
  try {
    const { name, phoneNumber, work } = req.body;

    const newNumber = await ImportantNumber.create({
      name,
      phoneNumber,
      work,
      createdBy: req.user._id,  // user ID from token
      society: req.user.society.id,
    });

    res.status(201).json({
      status: 'success',
      data: newNumber,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all important numbers
exports.getImportantNumbers = async (req, res) => {
  try {
    const numbers = await ImportantNumber.find({ society: req.user.society.id });
    console.log("sdasdasd",numbers);
    res.status(200).json({
      status: 'success',
      data: numbers,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an important number
exports.updateImportantNumber = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedNumber = await ImportantNumber.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedNumber) {
      return res.status(404).json({ message: 'Important number not found' });
    }

    res.status(200).json({
      status: 'success',
      data: updatedNumber,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an important number
exports.deleteImportantNumber = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNumber = await ImportantNumber.findByIdAndDelete(id);

    if (!deletedNumber) {
      return res.status(404).json({ message: 'Important number not found' });
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
