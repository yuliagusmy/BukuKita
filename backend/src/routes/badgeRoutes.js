const express = require('express');
const router = express.Router();
const {
  getBadges,
  checkAndAwardBadges,
} = require('../controllers/badgeController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getBadges);
router.post('/check', protect, checkAndAwardBadges);

module.exports = router;