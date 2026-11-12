const express = require('express');
const router = express.Router();
const { getQuizzes, submitQuizScore } = require('../controllers/quizController');

router.get('/', getQuizzes);
router.post('/submit', submitQuizScore);

module.exports = router;