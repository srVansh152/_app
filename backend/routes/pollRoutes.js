const express = require("express");
const router = express.Router();
const pollController = require("../controllers/pollController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/create", protect, pollController.createPoll);
router.get("/get", protect, pollController.getPolls); // Query params: ?filter=Own/New/Previous
router.post("/respond", protect, pollController.submitResponse);
router.put("/close/:id", protect, pollController.closePoll);

module.exports = router;