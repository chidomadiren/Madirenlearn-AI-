const express = require('express');
const router = express.Router();
const { getCommunityFeed } = require('../controllers/communityController');

router.get('/', getCommunityFeed);

module.exports = router;
