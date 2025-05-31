const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getBadges,
  getUserBadges,
  checkAndAwardBadges,
  getBadgeProgress,
} = require('../controllers/badgeController');

// All routes are protected
router.use(protect);

// Get all available badges
router.get('/', getBadges);

// Get user's earned badges
router.get('/user', getUserBadges);

// Check and award new badges
router.post('/check', checkAndAwardBadges);

// Get badge progress
router.get('/progress', getBadgeProgress);

module.exports = router;