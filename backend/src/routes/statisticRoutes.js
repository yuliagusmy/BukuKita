const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getCurrentMonthStats,
  getStatsByMonth,
  updateStatistics,
  getYearlyStats,
} = require('../controllers/statisticController');

// Get current month statistics
router.get('/current', protect, getCurrentMonthStats);

// Get statistics by year and month
router.get('/:year/:month', protect, getStatsByMonth);

// Update statistics
router.put('/update', protect, updateStatistics);

// Get yearly statistics
router.get('/year/:year', protect, getYearlyStats);

module.exports = router;