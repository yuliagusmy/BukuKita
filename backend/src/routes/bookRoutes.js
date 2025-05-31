const express = require('express');
const router = express.Router();
const {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  getBooksByStatus,
  getBooksByGenre,
} = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Book routes
router.route('/')
  .post(createBook)
  .get(getBooks);

router.route('/:id')
  .get(getBookById)
  .put(updateBook)
  .delete(deleteBook);

// Additional routes
router.get('/status/:status', getBooksByStatus);
router.get('/genre/:genre', getBooksByGenre);

module.exports = router;