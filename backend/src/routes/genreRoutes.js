const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getAllGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre,
  getGenreStats,
  searchGenres,
} = require('../controllers/genreController');

// Public routes
router.get('/', getAllGenres);
router.get('/search/:query', searchGenres);
router.get('/:id', getGenreById);
router.get('/:id/stats', getGenreStats);

// Admin routes
router.post('/', protect, admin, createGenre);
router.put('/:id', protect, admin, updateGenre);
router.delete('/:id', protect, admin, deleteGenre);

module.exports = router;