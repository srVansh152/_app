const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const { protect } = require('../middlewares/authMiddleware'); // Import protect middleware

// Add a new note
router.post('/notes', protect, noteController.addNote);

// Update an existing note
router.put('/notes/:id', protect, noteController.updateNote);

// Get all notes for the authenticated user
router.get('/notes', protect, noteController.getNotes);

// Delete a note
router.delete('/notes/:id', protect, noteController.deleteNote);

module.exports = router;