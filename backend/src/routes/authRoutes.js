const express = require('express');
const router = express.Router();
const passport = require('passport');
const { protect } = require('../middleware/auth');
const {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  googleCallback,
} = require('../controllers/authController');

// Public routes
router.post('/login', loginUser);
router.post('/register', registerUser);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  googleCallback
);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router;