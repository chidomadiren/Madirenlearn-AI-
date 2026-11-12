const pool = require('../config/db');

const listInvites = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT i.id, i.room_code AS "roomCode", i.subject, i.status,
              i.created_at AS "createdAt", u.name AS "hostName"
       FROM "QuizInvite" i
       JOIN "User" u ON u.id = i.host_id
       WHERE i.invitee_id = $1 AND i.status = 'PENDING'
       ORDER BY i.created_at DESC
       LIMIT 50`,
      [req.user.id],
    );
    return res.json({ invites: result.rows });
  } catch (error) {
    console.error('Could not list quiz invites:', error.message);
    return res.status(500).json({ error: 'Could not load quiz invitations.' });
  }
};

const createInvite = async (req, res) => {
  const inviteeId = String(req.body.inviteeId || '');
  const roomCode = String(req.body.roomCode || '').trim().toUpperCase();
  const subject = String(req.body.subject || '').trim().slice(0, 100);
  if (!inviteeId || !roomCode || !subject) {
    return res.status(400).json({ error: 'A classmate, quiz room, and subject are required.' });
  }
  if (inviteeId === req.user.id) return res.status(400).json({ error: 'You cannot invite yourself.' });

  try {
    const invitee = await pool.query('SELECT id FROM "User" WHERE id = $1', [inviteeId]);
    if (!invitee.rows.length) return res.status(404).json({ error: 'That student account was not found.' });

    const result = await pool.query(
      `INSERT INTO "QuizInvite" (id, host_id, invitee_id, room_code, subject)
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4)
       ON CONFLICT (host_id, invitee_id, room_code)
       DO UPDATE SET status = 'PENDING', created_at = CURRENT_TIMESTAMP
       RETURNING id, room_code AS "roomCode", subject, status, created_at AS "createdAt"`,
      [req.user.id, inviteeId, roomCode, subject],
    );
    return res.status(201).json({ invite: result.rows[0] });
  } catch (error) {
    console.error('Could not create quiz invite:', error.message);
    return res.status(500).json({ error: 'Could not send this quiz invitation.' });
  }
};

const respondToInvite = async (req, res) => {
  const status = req.body.accept ? 'ACCEPTED' : 'DECLINED';
  try {
    const result = await pool.query(
      `UPDATE "QuizInvite"
       SET status = $1, responded_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND invitee_id = $3 AND status = 'PENDING'
       RETURNING id, room_code AS "roomCode", subject, status`,
      [status, req.params.inviteId, req.user.id],
    );
    if (!result.rows.length) return res.status(404).json({ error: 'This invitation is no longer available.' });
    return res.json({ invite: result.rows[0] });
  } catch (error) {
    console.error('Could not respond to quiz invite:', error.message);
    return res.status(500).json({ error: 'Could not update this invitation.' });
  }
};

module.exports = { listInvites, createInvite, respondToInvite };
