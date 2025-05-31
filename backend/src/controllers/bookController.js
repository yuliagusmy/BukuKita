const Book = require('../models/Book');
const User = require('../models/User');
const { createBookCompletedNotification } = require('../utils/notificationUtils');

// @desc    Create a new book
// @route   POST /api/books
// @access  Private
const createBook = async (req, res) => {
  try {
    const { title, author, genre, totalPages, notes, status } = req.body;

    const book = await Book.create({
      user: req.user._id,
      title,
      author,
      genre,
      totalPages,
      currentPage: 0,
      notes,
      status: status || 'to_read',
    });

    res.status(201).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all books for a user
// @route   GET /api/books
// @access  Private
const getBooks = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id });
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get book by ID
// @route   GET /api/books/:id
// @access  Private
const getBookById = async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private
const updateBook = async (req, res) => {
  try {
    const { title, author, genre, totalPages, currentPage, status, notes, rating } = req.body;

    const book = await Book.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const wasCompleted = book.status === 'completed';
    const isNowCompleted = status === 'completed';

    book.title = title || book.title;
    book.author = author || book.author;
    book.genre = genre || book.genre;
    book.totalPages = totalPages || book.totalPages;
    book.currentPage = currentPage || book.currentPage;
    book.status = status || book.status;
    book.notes = notes || book.notes;
    book.rating = rating || book.rating;

    if (isNowCompleted && !wasCompleted) {
      book.completedDate = new Date();
      const user = await User.findById(req.user._id);
      user.booksCompleted += 1;
      await user.save();
      await createBookCompletedNotification(user, book);
    }

    await book.save();
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.remove();
    res.json({ message: 'Book removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get books by status
// @route   GET /api/books/status/:status
// @access  Private
const getBooksByStatus = async (req, res) => {
  try {
    const books = await Book.find({
      user: req.user._id,
      status: req.params.status,
    });
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get books by genre
// @route   GET /api/books/genre/:genre
// @access  Private
const getBooksByGenre = async (req, res) => {
  try {
    const books = await Book.find({
      user: req.user._id,
      genre: req.params.genre,
    });
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  getBooksByStatus,
  getBooksByGenre,
};