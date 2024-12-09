const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const securityProtocolController = require('../controllers/securityProtocolController');

// Routes for security protocol management
router.post('/security-protocol', protect, securityProtocolController.addProtocol);
router.put('/security-protocol/:id', protect, securityProtocolController.updateProtocol);
router.get('/security-protocol/:id', protect, securityProtocolController.viewProtocol);
router.delete('/security-protocol/:id', protect, securityProtocolController.deleteProtocol);
router.get('/security-protocols', protect, securityProtocolController.getProtocols);

module.exports = router;