const ReadingSession = require('../models/ReadingSession');
const Book = require('../models/Book');
const User = require('../models/User');
const { startOfDay, endOfDay, subDays, format } = require('date-fns');
const { createStreakNotification } = require('../utils/notificationUtils');

// @desc    Create a new reading session
// @route   POST /api/reading-sessions
// @access  Private
const createReadingSession = async (req, res) => {
  try {
    const { bookId, pagesRead } = req.body;

    // Validate book exists and belongs to user
    const book = await Book.findOne({
      _id: bookId,
      user: req.user._id,
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if book is in reading status
    if (book.status !== 'reading') {
      return res.status(400).json({ message: 'Book is not in reading status' });
    }

    // Calculate XP earned (0.5 XP per page)
    const xpEarned = Math.floor(pagesRead * 0.5);

    // Create reading session
    const readingSession = await ReadingSession.create({
      user: req.user._id,
      book: bookId,
      pagesRead,
      xpEarned,
    });

    // Update book progress
    book.currentPage += pagesRead;
    if (book.currentPage >= book.totalPages) {
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
    const yesterday = subDays(today, 1);

    // Check if user read yesterday
    const yesterdaySession = await ReadingSession.findOne({
      user: req.user._id,
      date: {
        $gte: startOfDay(yesterday),
        $lte: endOfDay(yesterday),
      },
    });

    if (yesterdaySession) {
      user.readingStreak += 1;
      // Check for streak milestones
      if ([3, 7, 14, 30].includes(user.readingStreak)) {
        await createStreakNotification(user, user.readingStreak);
      }
    } else {
      user.readingStreak = 1;
    }

    // Check for level up
    if (user.xp >= user.xpToNextLevel) {
      user.level += 1;
      user.xp -= user.xpToNextLevel;
      user.xpToNextLevel = Math.floor(user.xpToNextLevel * 1.5);
      user.title = `Pustakawan Level ${user.level}`;
    }

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
    const sessions = await ReadingSession.find({ user: req.user._id })
      .populate('book', 'title author')
      .sort({ date: -1 });
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get reading sessions for a specific date
// @route   GET /api/reading-sessions/date/:date
// @access  Private
const getReadingSessionsByDate = async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const sessions = await ReadingSession.find({
      user: req.user._id,
      date: {
        $gte: startOfDay(date),
        $lte: endOfDay(date),
      },
    }).populate('book', 'title author');
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get reading sessions for a specific book
// @route   GET /api/reading-sessions/book/:bookId
// @access  Private
const getReadingSessionsByBook = async (req, res) => {
  try {
    const sessions = await ReadingSession.find({
      user: req.user._id,
      book: req.params.bookId,
    }).sort({ date: -1 });
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get reading statistics
// @route   GET /api/reading-sessions/stats
// @access  Private
const getReadingStats = async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 30);

    // Get total pages read in last 30 days
    const totalPages = await ReadingSession.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$pagesRead' },
        },
      },
    ]);

    // Get daily reading data for chart
    const dailyReading = await ReadingSession.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          pages: { $sum: '$pagesRead' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.json({
      totalPages: totalPages[0]?.total || 0,
      dailyReading,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createReadingSession,
  getReadingSessions,
  getReadingSessionsByDate,
  getReadingSessionsByBook,
  getReadingStats,
};