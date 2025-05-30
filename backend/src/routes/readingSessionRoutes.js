const express = require('express');
const router = express.Router();
const {
  createReadingSession,
  getReadingSessions,
  getReadingSessionsByRange,
} = require('../controllers/readingSessionController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createReadingSession)
  .get(protect, getReadingSessions);

router.get('/range', protect, getReadingSessionsByRange);

module.exports = router;