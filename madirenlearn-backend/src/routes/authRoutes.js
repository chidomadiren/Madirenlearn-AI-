const express = require('express');
const router = express.Router();
const { register, login, getMe, signout } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.post('/signout', signout);

module.exports = router;