const Badge = require('../models/Badge');
const Book = require('../models/Book');
const User = require('../models/User');

// @desc    Get all badges for a user
// @route   GET /api/badges
// @access  Private
const getBadges = async (req, res) => {
  try {
    const badges = await Badge.find({ user: req.user._id }).sort({ earnedDate: -1 });
    res.json(badges);
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
    const books = await Book.find({ user: req.user._id, status: 'completed' });

    // Check genre badges
    const genreCounts = {};
    books.forEach(book => {
      genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
    });

    for (const [genre, count] of Object.entries(genreCounts)) {
      let tier = 0;
      if (count >= 30) tier = 4;
      else if (count >= 15) tier = 3;
      else if (count >= 5) tier = 2;
      else if (count >= 1) tier = 1;

      if (tier > 0) {
        const badgeName = getGenreBadgeName(genre, tier);
        const badgeDescription = getGenreBadgeDescription(genre, tier);

        // Check if badge already exists
        const existingBadge = await Badge.findOne({
          user: req.user._id,
          name: badgeName,
        });

        if (!existingBadge) {
          await Badge.create({
            user: req.user._id,
            name: badgeName,
            description: badgeDescription,
            imageUrl: `/badges/${genre.toLowerCase()}-${tier}.svg`,
            type: 'genre',
            category: genre,
            tier,
          });
        }
      }
    }

    // Check achievement badges
    // Marathon Reader - 7 day streak
    if (user.readingStreak >= 7) {
      const existingBadge = await Badge.findOne({
        user: req.user._id,
        name: 'Marathon Reader',
      });

      if (!existingBadge) {
        await Badge.create({
          user: req.user._id,
          name: 'Marathon Reader',
          description: 'Read books for 7 consecutive days',
          imageUrl: '/badges/marathon-reader.svg',
          type: 'achievement',
        });
      }
    }

    // 1000 Pages
    if (user.totalPagesRead >= 1000) {
      const existingBadge = await Badge.findOne({
        user: req.user._id,
        name: '1000 Pages!',
      });

      if (!existingBadge) {
        await Badge.create({
          user: req.user._id,
          name: '1000 Pages!',
          description: 'Read a total of 1000 pages',
          imageUrl: '/badges/1000-pages.svg',
          type: 'achievement',
        });
      }
    }

    // Multi-genre Master
    const completedGenres = new Set(books.map(book => book.genre));
    if (completedGenres.size >= 5) {
      const existingBadge = await Badge.findOne({
        user: req.user._id,
        name: 'Multi-genre Master',
      });

      if (!existingBadge) {
        await Badge.create({
          user: req.user._id,
          name: 'Multi-genre Master',
          description: 'Completed books from 5 different genres',
          imageUrl: '/badges/multigenre-master.svg',
          type: 'achievement',
        });
      }
    }

    // Level Up Maniac
    if (user.level >= 10) {
      const existingBadge = await Badge.findOne({
        user: req.user._id,
        name: 'Level Up Maniac',
      });

      if (!existingBadge) {
        await Badge.create({
          user: req.user._id,
          name: 'Level Up Maniac',
          description: 'Reached level 10',
          imageUrl: '/badges/level-up-maniac.svg',
          type: 'achievement',
        });
      }
    }

    const updatedBadges = await Badge.find({ user: req.user._id }).sort({ earnedDate: -1 });
    res.json(updatedBadges);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper functions for badge names and descriptions
const getGenreBadgeName = (genre, tier) => {
  const names = {
    Fantasy: ['Penjelajah Dunia Fantasi', 'Pendekar Legenda Fantasi', 'Penguasa Alam Magis', 'Arsitek Dunia Khayalan'],
    Philosophy: ['Perenung Sunyi', 'Penjelajah Akal', 'Filsuf Sejati', 'Arsitek Pemikiran Abadi'],
    // Add more genres as needed
  };

  return names[genre]?.[tier - 1] || `${genre} Reader Tier ${tier}`;
};

const getGenreBadgeDescription = (genre, tier) => {
  const descriptions = {
    Fantasy: [
      'Completed your first fantasy book',
      'Completed 5 fantasy books',
      'Completed 15 fantasy books',
      'Completed 30 fantasy books',
    ],
    Philosophy: [
      'Completed your first philosophy book',
      'Completed 5 philosophy books',
      'Completed 15 philosophy books',
      'Completed 30 philosophy books',
    ],
    // Add more genres as needed
  };

  return descriptions[genre]?.[tier - 1] || `Completed ${tier * 5} ${genre} books`;
};

module.exports = {
  getBadges,
  checkAndAwardBadges,
};