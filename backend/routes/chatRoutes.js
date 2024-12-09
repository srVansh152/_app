const express = require('express');
const { getChats, createChat, sendMessage, getChatMessages } = require('../controllers/chatController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/get', protect, getChats);
router.post('/create', protect, createChat);
router.post('/:chatId/message', protect, sendMessage);
router.get('/:chatId/messages', protect, getChatMessages);

module.exports = router;