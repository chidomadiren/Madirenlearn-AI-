const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not set. Add JWT_SECRET to the backend .env file and restart the server.');
}

const signToken = (user) => {
  try {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
    );
  } catch (signError) {
    console.error('[madirenlearn auth] JWT sign failed:', signError.message);
    throw new Error('Could not issue authentication token.');
  }
};

const register = async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const role = String(req.body.role || 'student').trim() || 'student';
    const grade = req.body.grade ? String(req.body.grade).trim() || null : null;

    if (!name || !email || password.length < 8) {
      return res.status(400).json({ error: 'Name, a valid email address, and a password of at least 8 characters are required.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, role]
    );
    const user = result.rows[0];
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );
    if (!token || !user.id || !user.email) {
      console.error('[madirenlearn auth] register produced invalid session:', { user, token: Boolean(token) });
      return res.status(500).json({ error: 'Account created but the sign-in session could not be issued. Please try logging in.' });
    }
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Register detailed error:', error);
    const isDuplicateEmail =
      error.code === '23505' || // PostgreSQL unique violation (raw pg)
      error.code === 'P2002' || // Prisma unique constraint
      (error.meta && error.meta.target && error.meta.target.includes('email')) ||
      /users_email_key|email.*unique|duplicate.*email/i.test(error.message || '');
    if (isDuplicateEmail) {
      return res.status(400).json({ error: 'An account with this email already exists. Please sign in.' });
    }
    return res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) return res.status(401).json({ error: 'Email or password is incorrect.' });

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ error: 'Email or password is incorrect.' });

    const token = signToken(user);
    if (!token || !user.id || !user.email) {
      console.error('[madirenlearn auth] login produced invalid session:', { user: { id: user.id, email: user.email }, token: Boolean(token) });
      return res.status(500).json({ error: 'Credentials verified but the sign-in session could not be issued. Please try again.' });
    }
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [req.user.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Account no longer exists.' });
    return res.json({ user: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: 'Could not load the account profile.' });
  }
};

const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email FROM users WHERE id <> $1 ORDER BY name LIMIT 100',
      [req.user.id],
    );
    return res.json({ users: result.rows });
  } catch (error) {
    return res.status(500).json({ error: 'Could not load classmates.' });
  }
};

module.exports = { register, login, getMe, getUsers };