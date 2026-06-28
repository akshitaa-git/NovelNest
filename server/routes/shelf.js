const express = require('express');
const router = express.Router();
const shelfController = require('../controllers/shelfController');
const auth = require('../middleware/auth');

router.post('/', auth, shelfController.addToShelf);
router.get('/', auth, shelfController.getShelf);
router.delete('/:bookId', auth, shelfController.removeFromShelf);

module.exports = router;
