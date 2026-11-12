require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const aiRoutes = require('./routes/aiRoutes');
const communityRoutes = require('./routes/communityRoutes');
const quizRoomRoutes = require('./routes/quizRoomRoutes');
const userRoutes = require('./routes/userRoutes');
const tutorRoutes = require('./routes/tutorRoutes');
const quizInviteRoutes = require('./routes/quizInviteRoutes');

const app = express();
const PORT = process.env.PORT || 5000;


const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/quiz-rooms', quizRoomRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tutor', tutorRoutes);
app.use('/api/quiz/invites', quizInviteRoutes);

app.get('/', (req, res) => {
  res.send('MadirenLearn AI API Server is Running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});