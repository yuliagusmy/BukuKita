const Badge = require('../models/Badge');
const User = require('../models/User');
const Book = require('../models/Book');
const ReadingSession = require('../models/ReadingSession');
const {
  createBadgeNotification,
  createLevelUpNotification,
} = require('../utils/notificationUtils');

// @desc    Get all badges
// @route   GET /api/badges
// @access  Private
const getBadges = async (req, res) => {
  try {
    const badges = await Badge.find();
    res.json(badges);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's badges
// @route   GET /api/badges/user
// @access  Private
const getUserBadges = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('badges');
    res.json(user.badges);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Check and award badges
// @route   POST /api/badges/check
// @access  Private
const checkAndAwardBadges = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const badges = await Badge.find();
    const newBadges = [];
    let levelUp = false;

    // Check each badge criteria
    for (const badge of badges) {
      // Skip if user already has this badge
      if (user.badges.includes(badge._id)) continue;

      let shouldAward = false;

      switch (badge.type) {
        case 'pages_read':
          shouldAward = user.totalPagesRead >= badge.requirement;
          break;

        case 'books_completed':
          const completedBooks = await Book.countDocuments({
            user: req.user._id,
            status: 'completed',
          });
          shouldAward = completedBooks >= badge.requirement;
          break;

        case 'reading_streak':
          shouldAward = user.readingStreak >= badge.requirement;
          break;

        case 'genre_master':
          const genreBooks = await Book.countDocuments({
            user: req.user._id,
            genre: badge.requirement,
            status: 'completed',
          });
          shouldAward = genreBooks >= 5; // Complete 5 books in a genre
          break;

        case 'level_reached':
          shouldAward = user.level >= badge.requirement;
          break;
      }

      if (shouldAward) {
        user.badges.push(badge._id);
        newBadges.push(badge);
        await createBadgeNotification(user, badge);
      }
    }

    // Check for level up
    if (user.xp >= user.xpToNextLevel) {
      user.level += 1;
      user.xp -= user.xpToNextLevel;
      user.xpToNextLevel = Math.floor(user.xpToNextLevel * 1.5);
      user.title = `Pustakawan Level ${user.level}`;
      levelUp = true;
      await createLevelUpNotification(user);
    }

    if (newBadges.length > 0 || levelUp) {
      await user.save();
    }

    res.json({
      newBadges,
      totalBadges: user.badges.length,
      levelUp,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get badge progress
// @route   GET /api/badges/progress
// @access  Private
const getBadgeProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const badges = await Badge.find();
    const progress = [];

    for (const badge of badges) {
      let current = 0;
      let requirement = badge.requirement;

      switch (badge.type) {
        case 'pages_read':
          current = user.totalPagesRead;
          break;

        case 'books_completed':
          current = await Book.countDocuments({
            user: req.user._id,
            status: 'completed',
          });
          break;

        case 'reading_streak':
          current = user.readingStreak;
          break;

        case 'genre_master':
          current = await Book.countDocuments({
            user: req.user._id,
            genre: badge.requirement,
            status: 'completed',
          });
          requirement = 5; // Complete 5 books in a genre
          break;

        case 'level_reached':
          current = user.level;
          break;
      }

      progress.push({
        badge,
        current,
        requirement,
        progress: Math.min((current / requirement) * 100, 100),
        earned: user.badges.includes(badge._id),
      });
    }

    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getBadges,
  getUserBadges,
  checkAndAwardBadges,
  getBadgeProgress,
};