const Review = require('../models/Review');
const Book = require('../models/Book');
const User = require('../models/User');

// @desc    Get all reviews for a book
// @route   GET /api/reviews/book/:bookId
// @access  Public
const getBookReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      book: req.params.bookId,
      isHidden: false,
    })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's reviews
// @route   GET /api/reviews/user
// @access  Private
const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      user: req.user._id,
      isHidden: false,
    })
      .populate('book', 'title author coverImage')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { bookId, rating, title, content } = req.body;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user has already reviewed this book
    const existingReview = await Review.findOne({
      user: req.user._id,
      book: bookId,
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    // Create review
    const review = await Review.create({
      user: req.user._id,
      book: bookId,
      rating,
      title,
      content,
    });

    // Update book's average rating
    const bookReviews = await Review.find({ book: bookId });
    const averageRating =
      bookReviews.reduce((sum, review) => sum + review.rating, 0) / bookReviews.length;
    book.rating = averageRating;
    await book.save();

    // Populate user data
    await review.populate('user', 'name avatar');

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
  try {
    const { rating, title, content } = req.body;

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update review
    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.content = content || review.content;
    review.isEdited = true;

    await review.save();

    // Update book's average rating
    const book = await Book.findById(review.book);
    const bookReviews = await Review.find({ book: review.book });
    const averageRating =
      bookReviews.reduce((sum, review) => sum + review.rating, 0) / bookReviews.length;
    book.rating = averageRating;
    await book.save();

    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await review.remove();

    // Update book's average rating
    const book = await Book.findById(review.book);
    const bookReviews = await Review.find({ book: review.book });
    const averageRating =
      bookReviews.reduce((sum, review) => sum + review.rating, 0) / bookReviews.length || 0;
    book.rating = averageRating;
    await book.save();

    res.json({ message: 'Review removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Like/Unlike review
// @route   PUT /api/reviews/:id/like
// @access  Private
const toggleLikeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const likeIndex = review.likes.indexOf(req.user._id);
    if (likeIndex === -1) {
      // Like review
      review.likes.push(req.user._id);
    } else {
      // Unlike review
      review.likes.splice(likeIndex, 1);
    }

    await review.save();
    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get review statistics
// @route   GET /api/reviews/stats/:bookId
// @access  Public
const getReviewStats = async (req, res) => {
  try {
    const reviews = await Review.find({
      book: req.params.bookId,
      isHidden: false,
    });

    const stats = {
      totalReviews: reviews.length,
      averageRating: 0,
      ratingDistribution: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
    };

    if (reviews.length > 0) {
      stats.averageRating =
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

      reviews.forEach(review => {
        stats.ratingDistribution[review.rating]++;
      });
    }

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getBookReviews,
  getUserReviews,
  createReview,
  updateReview,
  deleteReview,
  toggleLikeReview,
  getReviewStats,
};