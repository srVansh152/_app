const express = require('express');
const {
  createCommunity,
  joinCommunity,
  getCommunityMessages,
  sendCommunityMessage,
} = require('../controllers/communityController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to create a community (admin or resident can create)
router.post('/create', protect, createCommunity);

// Route to join a community (only residents of the same society can join)
router.post('/join/:communityId', protect, joinCommunity);

// Route to get messages of a community (accessible to community members only)
router.get('/:communityId/messages', protect, getCommunityMessages);

// Route to send a message to a community (only members of the community)
router.post('/:communityId/message', protect, sendCommunityMessage);

module.exports = router;


       
  