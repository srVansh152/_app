const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const securityGuardController = require('../controllers/SecurityGuardController');
const upload = require('../config/multer');

const router = express.Router();

router.post(
    '/add',
    protect,
    upload.fields([
        { name: 'profilePhoto', maxCount: 1 },
        { name: 'aadhaarCardImage', maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            await securityGuardController.addSecurityGuard(req, res);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
);

// Route for updating a security guard
router.put(
    '/update/:id',
    protect,
    upload.fields([
        { name: 'profilePhoto', maxCount: 1 },
        { name: 'aadhaarCardImage', maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            await securityGuardController.updateSecurityGuard(req, res);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
);

router.get('/view/:id', protect, securityGuardController.viewSecurityGuard);
router.delete('/delete/:id', protect, securityGuardController.deleteSecurityGuard);
router.get('/list', protect, securityGuardController.listSecurityGuards);

module.exports = router;