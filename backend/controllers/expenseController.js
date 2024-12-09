const Expense = require('../models/Expense');
const cloudinary = require('cloudinary').v2;

// Add a new expense
exports.addExpense = async (req, res) => {
  try {
    const { title, description, date, amount } = req.body;

    if (!req.user || !req.user.society || !req.user._id) {
      return res.status(400).json({ message: 'societyId and adminId are required fields.' });
    }

    // Upload bill image to Cloudinary if provided
    let billImage = null;
    if (req.file) {
      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: 'expenses/bills',
      });
      billImage = uploadedImage.secure_url;
    }

    const newExpense = new Expense({
      title,
      description,
      date,
      amount,
      billImage,
      societyId: req.user.society._id,
      adminId: req.user._id,
    });

    await newExpense.save();
    res.status(201).json({ message: 'Expense added successfully', expense: newExpense });
  } catch (error) {
    res.status(500).json({ message: 'Error adding expense', error: error.message });
  }
};

// Update an existing expense
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, amount } = req.body;

    const updatedData = { title, description, date, amount };

    // Handle bill image update
    if (req.file) {
      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: 'expenses/bills',
      });
      updatedData.billImage = uploadedImage.secure_url;
    }

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, societyId: req.user.society._id, adminId: req.user._id },
      updatedData,
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found or not associated with the specified society/admin' });
    }

    res.json({ message: 'Expense updated successfully', expense: updatedExpense });
  } catch (error) {
    res.status(500).json({ message: 'Error updating expense', error: error.message });
  }
};

// View a specific expense
exports.viewExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findById(id).populate('societyId').populate('adminId');

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expense', error: error.message });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure only the admin from the same society can delete the expense
    const expense = await Expense.findOneAndDelete({
      _id: id,
      societyId: req.user.society._id,
      adminId: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found or not associated with the specified society/admin' });
    }

    // If an image is associated, delete it from Cloudinary
    if (expense.billImage) {
      const publicId = expense.billImage.split('/').pop().split('.')[0]; // Extract Cloudinary public ID
      await cloudinary.uploader.destroy(`expenses/bills/${publicId}`);
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expense', error: error.message });
  }
};

// List all expenses for a society and admin
exports.listExpensesBySocietyAndAdmin = async (req, res) => {
  try {
    const societyId = req.user.society._id;
    const adminId = req.user._id;

    const expenses = await Expense.find({ societyId, adminId })
      .populate('societyId')
      .populate('adminId');

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses', error: error.message });
  }
};