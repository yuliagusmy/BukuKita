const Genre = require('../models/Genre');
const Book = require('../models/Book');
const User = require('../models/User');

// @desc    Get all genres
// @route   GET /api/genres
// @access  Public
const getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.find({ isActive: true }).sort({ name: 1 });
    res.json(genres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get genre by ID
// @route   GET /api/genres/:id
// @access  Public
const getGenreById = async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) {
      return res.status(404).json({ message: 'Genre not found' });
    }
    res.json(genre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new genre
// @route   POST /api/genres
// @access  Private/Admin
const createGenre = async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;

    // Check if genre already exists
    const existingGenre = await Genre.findOne({ name });
    if (existingGenre) {
      return res.status(400).json({ message: 'Genre already exists' });
    }

    const genre = await Genre.create({
      name,
      description,
      color,
      icon,
    });

    res.status(201).json(genre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update genre
// @route   PUT /api/genres/:id
// @access  Private/Admin
const updateGenre = async (req, res) => {
  try {
    const { name, description, color, icon, isActive } = req.body;

    // Check if genre exists
    const genre = await Genre.findById(req.params.id);
    if (!genre) {
      return res.status(404).json({ message: 'Genre not found' });
    }

    // Check if new name conflicts with existing genre
    if (name && name !== genre.name) {
      const existingGenre = await Genre.findOne({ name });
      if (existingGenre) {
        return res.status(400).json({ message: 'Genre name already exists' });
      }
    }

    // Update genre
    genre.name = name || genre.name;
    genre.description = description || genre.description;
    genre.color = color || genre.color;
    genre.icon = icon || genre.icon;
    genre.isActive = isActive !== undefined ? isActive : genre.isActive;

    await genre.save();
    res.json(genre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete genre
// @route   DELETE /api/genres/:id
// @access  Private/Admin
const deleteGenre = async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) {
      return res.status(404).json({ message: 'Genre not found' });
    }

    // Check if genre is in use
    const booksWithGenre = await Book.countDocuments({ genre: genre.name });
    if (booksWithGenre > 0) {
      return res.status(400).json({
        message: 'Cannot delete genre that is in use by books',
        booksCount: booksWithGenre,
      });
    }

    await genre.remove();
    res.json({ message: 'Genre removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get genre statistics
// @route   GET /api/genres/:id/stats
// @access  Public
const getGenreStats = async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) {
      return res.status(404).json({ message: 'Genre not found' });
    }

    // Get books count
    const booksCount = await Book.countDocuments({ genre: genre.name });

    // Get users count (users who have books in this genre)
    const usersCount = await User.countDocuments({
      'books.genre': genre.name,
    });

    // Get total pages read for this genre
    const books = await Book.find({ genre: genre.name });
    const totalPages = books.reduce((sum, book) => sum + book.totalPages, 0);

    // Get average rating
    const ratedBooks = books.filter(book => book.rating > 0);
    const averageRating =
      ratedBooks.reduce((sum, book) => sum + book.rating, 0) / ratedBooks.length || 0;

    res.json({
      genre: genre.name,
      booksCount,
      usersCount,
      totalPages,
      averageRating,
      popularBooks: books
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5)
        .map(book => ({
          id: book._id,
          title: book.title,
          author: book.author,
          rating: book.rating,
        })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Search genres
// @route   GET /api/genres/search/:query
// @access  Public
const searchGenres = async (req, res) => {
  try {
    const query = req.params.query;
    const genres = await Genre.find({
      $text: { $search: query },
      isActive: true,
    }).sort({ score: { $meta: 'textScore' } });

    res.json(genres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre,
  getGenreStats,
  searchGenres,
};