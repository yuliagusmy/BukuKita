const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      default: '#4A90E2', // Default blue color
    },
    icon: {
      type: String,
      default: 'book', // Default icon
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    bookCount: {
      type: Number,
      default: 0,
    },
    userCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for search functionality
genreSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Genre', genreSchema);