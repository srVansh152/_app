const express = require('express');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const {
  createAnnouncement,
  getAnnouncements,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require('../controllers/announcementController');

const router = express.Router();


router.post('/create', protect, restrictTo('admin'), createAnnouncement);

// Route to get all announcements (accessible to all authenticated users)
router.get('/get', protect, getAnnouncements);

// Route to get a specific announcement by ID (accessible to all authenticated users)
router.get('/:id', protect, getAnnouncement);

// Route to update a specific announcement by ID (admin only)
router.put('/:id', protect, restrictTo('admin'), updateAnnouncement);

// Route to delete a specific announcement by ID (admin only)
router.delete('/:id', protect, restrictTo('admin'), deleteAnnouncement);

module.exports = router;