const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createReadingSession,
  getReadingSessions,
  getReadingSessionsByDate,
  getReadingSessionsByBook,
  getReadingStats,
} = require('../controllers/readingSessionController');

// All routes are protected
router.use(protect);

// Create new reading session
router.post('/', createReadingSession);

// Get all reading sessions
router.get('/', getReadingSessions);

// Get reading sessions by date
router.get('/date/:date', getReadingSessionsByDate);

// Get reading sessions by book
router.get('/book/:bookId', getReadingSessionsByBook);

// Get reading statistics
router.get('/stats', getReadingStats);

module.exports = router;