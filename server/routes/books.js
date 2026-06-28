const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

const auth = require('../middleware/auth');

router.get('/recommendations', auth, bookController.getPersonalizedRecommendations);
router.get('/search', bookController.searchBooks);
router.get('/trending', bookController.getTrendingBooks);
router.get('/:id', bookController.getBookDetails);

module.exports = router;
