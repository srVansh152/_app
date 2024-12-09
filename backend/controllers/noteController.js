const Note = require('../models/Note');

// Add new note
exports.addNote = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    const newNote = new Note({
      title,
      description,
      date,
      societyId: req.user.society._id,
      adminId: req.user._id
    });
    await newNote.save();

    res.status(201).json({ message: 'Note added successfully', note: newNote });
  } catch (error) {
    res.status(500).json({ message: 'Error adding note', error: error.message });
  }
};

// Update note
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date } = req.body;

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, description, date },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note updated successfully', note: updatedNote });
  } catch (error) {
    res.status(500).json({ message: 'Error updating note', error: error.message });
  }
};

// View all notes for the authenticated user
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ societyId: req.user.society._id });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes', error: error.message });
  }
};

// Delete note
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note', error: error.message });
  }
};