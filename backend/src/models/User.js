const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: function() {
      return !this.isGoogleUser;
    },
  },
  avatar: {
    type: String,
    default: '',
  },
  googleId: {
    type: String,
    sparse: true,
  },
  isGoogleUser: {
    type: Boolean,
    default: false,
  },
  level: {
    type: Number,
    default: 1,
  },
  xp: {
    type: Number,
    default: 0,
  },
  xpToNextLevel: {
    type: Number,
    default: 100,
  },
  title: {
    type: String,
    default: 'Novice Reader',
  },
  booksCompleted: {
    type: Number,
    default: 0,
  },
  totalPagesRead: {
    type: Number,
    default: 0,
  },
  readingStreak: {
    type: Number,
    default: 0,
  },
  lastReadDate: {
    type: Date,
  },
  badges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge',
  }],
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.isGoogleUser) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;