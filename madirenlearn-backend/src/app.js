require('dotenv').config();

const express = require('express');

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


const cors = require("cors");

const allowedOrigins = [
  "https://madirenlearn-ai-lov.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

const corsOptions = {
  origin(origin, cb) {
    if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      return cb(null, true);
    }
    return cb(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions)); // also answers OPTIONS preflight automatically
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