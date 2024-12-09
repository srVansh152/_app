const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');
const upload = require('../config/multer');
const { protect } = require('../middlewares/authMiddleware');

// Routes for resident management
router.post(
    '/',
    protect,
    upload.fields([
      { name: 'photo', maxCount: 1 },
      { name: 'aadhaarFront', maxCount: 1 },
      { name: 'aadhaarBack', maxCount: 1 },
      { name: 'addressProof', maxCount: 1 },
      { name: 'rentAgreement', maxCount: 1 },
    ]),
    async (req, res) => {
      try {
        await residentController.createResident(req, res);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    }
  );

router.put('/:id', 
    protect,
    upload.fields([
      { name: 'photo', maxCount: 1 },
      { name: 'aadhaarFront', maxCount: 1 },
      { name: 'aadhaarBack', maxCount: 1 },
      { name: 'addressProof', maxCount: 1 },
      { name: 'rentAgreement', maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            await residentController.updateResident(req, res);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
);

router.delete('/:id', protect, async (req, res) => { // Protect the route
    try {
        await residentController.deleteResident(req, res);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', protect, async (req, res) => { // Protect the route
    try {
        await residentController.getResidents(req, res);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/:id', protect, async (req, res) => { // Protect the route
    try {
        await residentController.getResidentDetails(req, res);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
