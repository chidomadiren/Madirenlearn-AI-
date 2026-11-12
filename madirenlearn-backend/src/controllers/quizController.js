const pool = require('../config/db');

const getQuizzes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM quizzes');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const submitQuizScore = async (req, res) => {
  const { userId, quizId, score, totalQuestions } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO student_results (user_id, quiz_id, score, total_questions) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, quizId, score, totalQuestions]
    );
    res.status(201).json({ message: 'Score saved', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getQuizzes, submitQuizScore };