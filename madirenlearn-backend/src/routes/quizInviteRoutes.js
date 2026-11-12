const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const { listInvites, createInvite, respondToInvite } = require('../controllers/quizInviteController');

const router = express.Router();
router.use(authenticateToken);
router.get('/', listInvites);
router.post('/', createInvite);
router.post('/:inviteId/respond', respondToInvite);

module.exports = router;
