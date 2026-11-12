const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const { getUsers } = require('../controllers/authController');

const router = express.Router();
router.get('/', authenticateToken, getUsers);

module.exports = router;
