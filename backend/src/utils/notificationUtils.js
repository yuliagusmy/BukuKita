const Notification = require('../models/Notification');

// Create badge earned notification
const createBadgeNotification = async (user, badge) => {
  await Notification.create({
    user: user._id,
    type: 'badge_earned',
    title: 'Badge Baru! 🎉',
    message: `Selamat! Anda mendapatkan badge "${badge.name}"`,
    data: {
      badgeId: badge._id,
      badgeName: badge.name,
      badgeImage: badge.imageUrl,
    },
  });
};

// Create level up notification
const createLevelUpNotification = async (user) => {
  await Notification.create({
    user: user._id,
    type: 'level_up',
    title: 'Level Up! ⭐',
    message: `Selamat! Anda naik ke level ${user.level}`,
    data: {
      level: user.level,
      title: user.title,
    },
  });
};

// Create streak milestone notification
const createStreakNotification = async (user, days) => {
  await Notification.create({
    user: user._id,
    type: 'streak_milestone',
    title: 'Reading Streak! 🔥',
    message: `Hebat! Anda telah membaca selama ${days} hari berturut-turut`,
    data: {
      streak: days,
    },
  });
};

// Create book completed notification
const createBookCompletedNotification = async (user, book) => {
  await Notification.create({
    user: user._id,
    type: 'book_completed',
    title: 'Buku Selesai! 📚',
    message: `Selamat! Anda telah menyelesaikan buku "${book.title}"`,
    data: {
      bookId: book._id,
      bookTitle: book.title,
      bookAuthor: book.author,
    },
  });
};

module.exports = {
  createBadgeNotification,
  createLevelUpNotification,
  createStreakNotification,
  createBookCompletedNotification,
};