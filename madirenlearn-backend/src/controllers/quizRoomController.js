const rooms = new Map();
const ROOM_TTL_MS = 6 * 60 * 60 * 1000;
const MAX_PLAYERS = 8;

const cleanExpiredRooms = () => {
  const cutoff = Date.now() - ROOM_TTL_MS;
  for (const [code, room] of rooms) {
    if (room.createdAt < cutoff) rooms.delete(code);
  }
};

const makeCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

const publicRoom = (room, playerId) => {
  const currentQuestion = room.status === 'playing' ? room.questions[room.questionIndex] : null;
  const ownPlayer = room.players.find((player) => player.id === playerId);
  const review = room.status === 'playing' && room.lastReview
    ? {
        question: room.lastReview.question,
        answer: room.lastReview.answer,
        selected: room.lastReview.answers[playerId]?.selected || '',
        correct: Boolean(room.lastReview.answers[playerId]?.correct),
      }
    : null;

  const rankedPlayers = [...room.players].sort((a, b) => b.score - a.score);
  const winner = room.status === 'finished' ? rankedPlayers[0] : null;

  return {
    code: room.code,
    subject: room.subject,
    status: room.status,
    questionIndex: room.questionIndex,
    totalQuestions: room.questions.length,
    question: currentQuestion ? {
      question: currentQuestion.question,
      options: currentQuestion.options,
    } : null,
    hasAnswered: Boolean(ownPlayer?.answers[room.questionIndex]),
    review,
    players: room.players.map(({ id, name, score, answers }) => ({
      id,
      name,
      score,
      answered: Boolean(answers[room.questionIndex]),
    })),
    winner: winner?.name || '',
    winnerId: winner?.id || '',
  };
};

const createRoom = (req, res) => {
  cleanExpiredRooms();
  const { subject, questions, playerName } = req.body;
  if (!subject || !Array.isArray(questions) || questions.length < 1 || questions.length > 30) {
    return res.status(400).json({ error: 'Select a subject and provide between 1 and 30 questions.' });
  }
  if (questions.some((question) => !question.question || !Array.isArray(question.options) || !question.answer)) {
    return res.status(400).json({ error: 'The question set is incomplete.' });
  }

  let code = makeCode();
  while (rooms.has(code)) code = makeCode();
  const hostId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const room = {
    code,
    subject: String(subject).slice(0, 80),
    questions: questions.map(({ question, options, answer }) => ({
      question: String(question).slice(0, 1200),
      options: options.slice(0, 6).map((option) => String(option).slice(0, 300)),
      answer: String(answer).slice(0, 300),
    })),
    players: [{ id: hostId, name: String(playerName || 'Host').trim().slice(0, 32) || 'Host', score: 0, answers: [] }],
    hostId,
    status: 'lobby',
    questionIndex: 0,
    lastReview: null,
    createdAt: Date.now(),
  };
  rooms.set(code, room);
  res.status(201).json({ playerId: hostId, room: publicRoom(room, hostId) });
};

const joinRoom = (req, res) => {
  const code = String(req.params.code || '').toUpperCase();
  const room = rooms.get(code);
  if (!room) return res.status(404).json({ error: 'Room not found. Ask the host for the current room code.' });
  if (room.status !== 'lobby') return res.status(409).json({ error: 'This quiz has already started.' });
  if (room.players.length >= MAX_PLAYERS) return res.status(409).json({ error: 'This room is full (maximum 8 players).' });

  const playerId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  room.players.push({ id: playerId, name: String(req.body.playerName || 'Player').trim().slice(0, 32) || 'Player', score: 0, answers: [] });
  res.status(201).json({ playerId, room: publicRoom(room, playerId) });
};

const getRoom = (req, res) => {
  const room = rooms.get(String(req.params.code || '').toUpperCase());
  if (!room) return res.status(404).json({ error: 'Room not found or expired.' });
  const playerId = String(req.query.playerId || '');
  if (!room.players.some((player) => player.id === playerId)) return res.status(403).json({ error: 'Join this room before viewing it.' });
  res.json(publicRoom(room, playerId));
};

const startRoom = (req, res) => {
  const room = rooms.get(String(req.params.code || '').toUpperCase());
  if (!room) return res.status(404).json({ error: 'Room not found or expired.' });
  if (req.body.playerId !== room.hostId) return res.status(403).json({ error: 'Only the host can start the quiz.' });
  if (room.players.length < 2) return res.status(409).json({ error: 'Invite at least one other player before starting.' });
  if (room.status !== 'lobby') return res.status(409).json({ error: 'This quiz has already started.' });
  room.status = 'playing';
  res.json(publicRoom(room, req.body.playerId));
};

const submitAnswer = (req, res) => {
  const room = rooms.get(String(req.params.code || '').toUpperCase());
  if (!room) return res.status(404).json({ error: 'Room not found or expired.' });
  if (room.status !== 'playing') return res.status(409).json({ error: 'This quiz is not accepting answers.' });

  const { playerId, answer, questionIndex } = req.body;
  const player = room.players.find((item) => item.id === playerId);
  if (!player) return res.status(403).json({ error: 'Join this room before answering.' });
  if (questionIndex !== room.questionIndex) return res.status(409).json({ error: 'The room has moved to another question. Refreshing the quiz.' });
  if (player.answers[room.questionIndex]) return res.status(409).json({ error: 'You already answered this question.' });

  const question = room.questions[room.questionIndex];
  const correct = String(answer) === question.answer;
  player.answers[room.questionIndex] = { selected: String(answer), correct };
  if (correct) player.score += 1;

  if (room.players.every((item) => Boolean(item.answers[room.questionIndex]))) {
    room.lastReview = {
      question: question.question,
      answer: question.answer,
      answers: Object.fromEntries(room.players.map((item) => [item.id, item.answers[room.questionIndex]])),
    };
    room.questionIndex += 1;
    if (room.questionIndex >= room.questions.length) room.status = 'finished';
  }

  res.json(publicRoom(room, playerId));
};

module.exports = { createRoom, joinRoom, getRoom, startRoom, submitAnswer };
