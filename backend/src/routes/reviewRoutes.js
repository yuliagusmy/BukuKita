const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getBookReviews,
  getUserReviews,
  createReview,
  updateReview,
  deleteReview,
  toggleLikeReview,
  getReviewStats,
} = require('../controllers/reviewController');

// Public routes
router.get('/book/:bookId', getBookReviews);
router.get('/stats/:bookId', getReviewStats);

// Private routes
router.get('/user', protect, getUserReviews);
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.put('/:id/like', protect, toggleLikeReview);

module.exports = router;