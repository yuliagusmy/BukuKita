const Statistic = require('../models/Statistic');
const ReadingSession = require('../models/ReadingSession');
const Book = require('../models/Book');
const User = require('../models/User');
const { startOfMonth, endOfMonth, eachDayOfInterval, format } = require('date-fns');

// @desc    Get current month statistics
// @route   GET /api/statistics/current
// @access  Private
const getCurrentMonthStats = async (req, res) => {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    let stats = await Statistic.findOne({
      user: req.user._id,
      year,
      month,
    });

    if (!stats) {
      stats = await Statistic.create({
        user: req.user._id,
        year,
        month,
      });
    }

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get statistics by year and month
// @route   GET /api/statistics/:year/:month
// @access  Private
const getStatsByMonth = async (req, res) => {
  try {
    const { year, month } = req.params;

    const stats = await Statistic.findOne({
      user: req.user._id,
      year: parseInt(year),
      month: parseInt(month),
    });

    if (!stats) {
      return res.status(404).json({ message: 'Statistics not found' });
    }

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update statistics
// @route   PUT /api/statistics/update
// @access  Private
const updateStatistics = async (req, res) => {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    // Get or create monthly stats
    let stats = await Statistic.findOne({
      user: req.user._id,
      year,
      month,
    });

    if (!stats) {
      stats = await Statistic.create({
        user: req.user._id,
        year,
        month,
      });
    }

    // Get all reading sessions for current month
    const sessions = await ReadingSession.find({
      user: req.user._id,
      date: {
        $gte: startOfMonth(today),
        $lte: endOfMonth(today),
      },
    }).populate('book');

    // Calculate total pages and reading time
    let totalPages = 0;
    let totalReadingTime = 0;
    const genreCounts = {};
    const dailyStats = {};

    sessions.forEach(session => {
      totalPages += session.pagesRead;
      totalReadingTime += session.readingTime || 0;

      // Update genre stats
      if (session.book && session.book.genre) {
        if (!genreCounts[session.book.genre]) {
          genreCounts[session.book.genre] = {
            pagesRead: 0,
            booksCompleted: 0,
          };
        }
        genreCounts[session.book.genre].pagesRead += session.pagesRead;
      }

      // Update daily stats
      const dateStr = format(session.date, 'yyyy-MM-dd');
      if (!dailyStats[dateStr]) {
        dailyStats[dateStr] = {
          pagesRead: 0,
          readingTime: 0,
          booksCompleted: 0,
        };
      }
      dailyStats[dateStr].pagesRead += session.pagesRead;
      dailyStats[dateStr].readingTime += session.readingTime || 0;
    });

    // Get completed books for current month
    const completedBooks = await Book.find({
      user: req.user._id,
      status: 'completed',
      completedDate: {
        $gte: startOfMonth(today),
        $lte: endOfMonth(today),
      },
    });

    // Update genre stats with completed books
    completedBooks.forEach(book => {
      if (!genreCounts[book.genre]) {
        genreCounts[book.genre] = {
          pagesRead: 0,
          booksCompleted: 0,
        };
      }
      genreCounts[book.genre].booksCompleted += 1;
    });

    // Update daily stats with completed books
    completedBooks.forEach(book => {
      const dateStr = format(book.completedDate, 'yyyy-MM-dd');
      if (!dailyStats[dateStr]) {
        dailyStats[dateStr] = {
          pagesRead: 0,
          readingTime: 0,
          booksCompleted: 0,
        };
      }
      dailyStats[dateStr].booksCompleted += 1;
    });

    // Get user's current streak
    const user = await User.findById(req.user._id);

    // Update statistics
    stats.totalPagesRead = totalPages;
    stats.totalBooksCompleted = completedBooks.length;
    stats.totalReadingTime = totalReadingTime;
    stats.averagePagesPerDay = totalPages / Object.keys(dailyStats).length || 0;
    stats.averageReadingTimePerDay = totalReadingTime / Object.keys(dailyStats).length || 0;
    stats.genreStats = Object.entries(genreCounts).map(([genre, data]) => ({
      genre,
      ...data,
    }));
    stats.dailyStats = Object.entries(dailyStats).map(([date, data]) => ({
      date: new Date(date),
      ...data,
    }));
    stats.streak = {
      current: user.readingStreak,
      longest: Math.max(user.readingStreak, stats.streak?.longest || 0),
    };
    stats.achievements = {
      badgesEarned: user.badges.length,
      levelsGained: user.level,
    };

    await stats.save();
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get yearly statistics
// @route   GET /api/statistics/year/:year
// @access  Private
const getYearlyStats = async (req, res) => {
  try {
    const year = parseInt(req.params.year);

    const stats = await Statistic.find({
      user: req.user._id,
      year,
    }).sort({ month: 1 });

    if (!stats.length) {
      return res.status(404).json({ message: 'Statistics not found' });
    }

    // Aggregate yearly statistics
    const yearlyStats = {
      year,
      totalPagesRead: 0,
      totalBooksCompleted: 0,
      totalReadingTime: 0,
      averagePagesPerMonth: 0,
      averageBooksPerMonth: 0,
      genreStats: {},
      monthlyStats: stats,
    };

    stats.forEach(monthStats => {
      yearlyStats.totalPagesRead += monthStats.totalPagesRead;
      yearlyStats.totalBooksCompleted += monthStats.totalBooksCompleted;
      yearlyStats.totalReadingTime += monthStats.totalReadingTime;

      // Aggregate genre stats
      monthStats.genreStats.forEach(genreStat => {
        if (!yearlyStats.genreStats[genreStat.genre]) {
          yearlyStats.genreStats[genreStat.genre] = {
            pagesRead: 0,
            booksCompleted: 0,
          };
        }
        yearlyStats.genreStats[genreStat.genre].pagesRead += genreStat.pagesRead;
        yearlyStats.genreStats[genreStat.genre].booksCompleted += genreStat.booksCompleted;
      });
    });

    yearlyStats.averagePagesPerMonth = yearlyStats.totalPagesRead / stats.length;
    yearlyStats.averageBooksPerMonth = yearlyStats.totalBooksCompleted / stats.length;

    res.json(yearlyStats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCurrentMonthStats,
  getStatsByMonth,
  updateStatistics,
  getYearlyStats,
};