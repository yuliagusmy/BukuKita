const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  genre: {
    type: String,
    required: true,
    enum: [
      'Fiction', 'Fantasy', 'Science Fiction', 'Mystery', 'Thriller', 'Romance',
      'Non-fiction', 'Biography', 'History', 'Self-help', 'Philosophy', 'Science', 'Business', 'Other'
    ],
  },
  totalPages: {
    type: Number,
    required: true,
    min: 1,
  },
  currentPage: {
    type: Number,
    default: 0,
    min: 0,
  },
  status: {
    type: String,
    required: true,
    enum: ['wishlist', 'reading', 'completed'],
    default: 'wishlist',
  },
  addedDate: {
    type: Date,
    default: Date.now,
  },
  completedDate: {
    type: Date,
  },
  notes: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
}, {
  timestamps: true,
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;