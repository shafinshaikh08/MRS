//movies.js
const express = require('express');
const router = express.Router();
const { getMoviesBySearch, getMovieDetails, getRandomMovie, searchMovies } = require('../controllers/movieController');

router.get('/movies', getMoviesBySearch); // Path becomes /api/movies
router.get('/movies/search', searchMovies); // Path becomes /api/movies/search
router.get('/movies/random', getRandomMovie); // Path becomes /api/movies/random
router.get('/movie/:id', getMovieDetails); // Path becomes /api/movie/:id

module.exports = router;