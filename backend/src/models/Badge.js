const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  earnedDate: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    required: true,
    enum: ['genre', 'achievement'],
  },
  category: {
    type: String,
  },
  tier: {
    type: Number,
    min: 1,
    max: 4,
  },
}, {
  timestamps: true,
});

const Badge = mongoose.model('Badge', badgeSchema);

module.exports = Badge;