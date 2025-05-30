const mongoose = require('mongoose');

const readingSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Book',
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  pagesRead: {
    type: Number,
    required: true,
    min: 1,
  },
  xpEarned: {
    type: Number,
    required: true,
    min: 0,
  },
}, {
  timestamps: true,
});

const ReadingSession = mongoose.model('ReadingSession', readingSessionSchema);

module.exports = ReadingSession;