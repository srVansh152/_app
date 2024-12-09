const express = require('express');
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyOtp,
  getProfile,
  updateMe
} = require('../controllers/authController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const upload = require('../config/multer'); // Use Cloudinary storage configuration
const router = express.Router();

router.post('/register', upload.single('userPhoto'), register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp); 
router.post('/reset-password', resetPassword);

// Routes for individual user profile management
router.get("/profile", protect, getProfile);
router.put('/profile', protect, upload.single('userPhoto'), updateMe);

// Protect route and restrict access to admin only
router.get('/admin', protect, restrictTo('admin'), (req, res) => {
  res.send('This is admin-only content');
});

module.exports = router;
