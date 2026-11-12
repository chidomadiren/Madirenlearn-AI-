const express = require('express');
const {
  createRoom,
  joinRoom,
  getRoom,
  startRoom,
  submitAnswer,
} = require('../controllers/quizRoomController');

const router = express.Router();

router.post('/', createRoom);
router.post('/:code/join', joinRoom);
router.get('/:code', getRoom);
router.post('/:code/start', startRoom);
router.post('/:code/answer', submitAnswer);

module.exports = router;
