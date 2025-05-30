const Book = require('../models/Book');
const User = require('../models/User');

// @desc    Create a new book
// @route   POST /api/books
// @access  Private
const createBook = async (req, res) => {
  try {
    const { title, author, genre, totalPages, status } = req.body;

    const book = await Book.create({
      user: req.user._id,
      title,
      author,
      genre,
      totalPages,
      status,
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

    // Check if book is being completed
    const wasCompleted = book.status !== 'completed' && status === 'completed';

    book.title = title || book.title;
    book.author = author || book.author;
    book.genre = genre || book.genre;
    book.totalPages = totalPages || book.totalPages;
    book.currentPage = currentPage || book.currentPage;
    book.status = status || book.status;
    book.notes = notes || book.notes;
    book.rating = rating || book.rating;

    if (wasCompleted) {
      book.completedDate = new Date();

      // Update user stats
      const user = await User.findById(req.user._id);
      user.booksCompleted += 1;
      user.xp += 100; // XP bonus for completing a book
      await user.save();
    }

    const updatedBook = await book.save();
    res.json(updatedBook);
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

module.exports = {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
};