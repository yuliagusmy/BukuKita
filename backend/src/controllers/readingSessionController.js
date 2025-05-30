const ReadingSession = require('../models/ReadingSession');
const Book = require('../models/Book');
const User = require('../models/User');
const { addDays, format, isToday, parseISO } = require('date-fns');

// @desc    Create a new reading session
// @route   POST /api/reading-sessions
// @access  Private
const createReadingSession = async (req, res) => {
  try {
    const { bookId, pagesRead } = req.body;

    // Find the book
    const book = await Book.findOne({
      _id: bookId,
      user: req.user._id,
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.status !== 'reading') {
      return res.status(400).json({ message: 'Book is not in reading status' });
    }

    // Calculate XP (5 XP per page)
    const xpEarned = pagesRead * 5;

    // Create reading session
    const readingSession = await ReadingSession.create({
      user: req.user._id,
      book: bookId,
      pagesRead,
      xpEarned,
    });

    // Update book progress
    const newCurrentPage = Math.min(book.currentPage + pagesRead, book.totalPages);
    book.currentPage = newCurrentPage;

    if (newCurrentPage >= book.totalPages) {
      book.status = 'completed';
      book.completedDate = new Date();
    }

    await book.save();

    // Update user stats
    const user = await User.findById(req.user._id);
    user.totalPagesRead += pagesRead;
    user.xp += xpEarned;

    // Update reading streak
    const today = new Date();
    const lastReadDate = user.lastReadDate ? parseISO(user.lastReadDate) : null;

    if (!lastReadDate || isToday(lastReadDate) || isToday(addDays(lastReadDate, 1))) {
      user.readingStreak += 1;
    } else {
      user.readingStreak = 1;
    }

    user.lastReadDate = format(today, 'yyyy-MM-dd');
    await user.save();

    res.status(201).json(readingSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all reading sessions for a user
// @route   GET /api/reading-sessions
// @access  Private
const getReadingSessions = async (req, res) => {
  try {
    const readingSessions = await ReadingSession.find({ user: req.user._id })
      .populate('book', 'title author')
      .sort({ date: -1 });
    res.json(readingSessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get reading sessions by date range
// @route   GET /api/reading-sessions/range
// @access  Private
const getReadingSessionsByRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const readingSessions = await ReadingSession.find({
      user: req.user._id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    })
      .populate('book', 'title author')
      .sort({ date: -1 });

    res.json(readingSessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createReadingSession,
  getReadingSessions,
  getReadingSessionsByRange,
};