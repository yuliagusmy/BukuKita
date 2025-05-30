const express = require('express');
const router = express.Router();
const {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require('../controllers/bookController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createBook)
  .get(protect, getBooks);

router.route('/:id')
  .get(protect, getBookById)
  .put(protect, updateBook)
  .delete(protect, deleteBook);

module.exports = router;