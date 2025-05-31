const mongoose = require('mongoose');

const statisticSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    year: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    totalPagesRead: {
      type: Number,
      default: 0,
    },
    totalBooksCompleted: {
      type: Number,
      default: 0,
    },
    totalReadingTime: {
      type: Number, // in minutes
      default: 0,
    },
    averagePagesPerDay: {
      type: Number,
      default: 0,
    },
    averageReadingTimePerDay: {
      type: Number, // in minutes
      default: 0,
    },
    genreStats: [{
      genre: String,
      booksCompleted: Number,
      pagesRead: Number,
    }],
    dailyStats: [{
      date: Date,
      pagesRead: Number,
      readingTime: Number, // in minutes
      booksCompleted: Number,
    }],
    streak: {
      current: Number,
      longest: Number,
    },
    achievements: {
      badgesEarned: Number,
      levelsGained: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user, year, and month
statisticSchema.index({ user: 1, year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Statistic', statisticSchema);