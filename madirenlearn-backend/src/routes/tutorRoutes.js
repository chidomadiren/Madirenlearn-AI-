const express = require('express');
const { getAiTutorResponse } = require('../controllers/aiController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/ask', authenticateToken, getAiTutorResponse);

module.exports = router;
