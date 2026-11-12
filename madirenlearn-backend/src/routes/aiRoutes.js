const express = require('express');
const router = express.Router();
const { getAiTutorResponse, generateStudyNotes } = require('../controllers/aiController');

router.post('/tutor', getAiTutorResponse);
router.post('/notes', generateStudyNotes);

module.exports = router;