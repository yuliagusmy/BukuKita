const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['pages_read', 'books_completed', 'reading_streak', 'genre_master', 'level_reached'],
    },
    requirement: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ['achievement', 'genre', 'special'],
      default: 'achievement',
    },
    tier: {
      type: Number,
      min: 1,
      max: 4,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Badge', badgeSchema);