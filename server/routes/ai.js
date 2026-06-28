const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');

router.post('/summary', auth, aiController.getBookSummary);
router.post('/recommend', auth, aiController.getAIRecommendations);
router.post('/chat', auth, aiController.chatWithLibrarian);

module.exports = router;
