const pool = require('../config/db');

const upsertVote = async (reviewId, userId, voteType) => {
  const result = await pool.query(
    `INSERT INTO review_votes (review_id, user_id, vote_type)
     VALUES ($1, $2, $3)
     ON CONFLICT (review_id, user_id)
     DO UPDATE SET vote_type = EXCLUDED.vote_type
     RETURNING *`,
    [reviewId, userId, voteType]
  );
  return result.rows[0];
};

const getVoteCounts = async (reviewId) => {
  const result = await pool.query(
    `SELECT
       COUNT(*) FILTER (WHERE vote_type = 'helpful')::int AS helpful_count,
       COUNT(*) FILTER (WHERE vote_type = 'unhelpful')::int AS unhelpful_count
     FROM review_votes
     WHERE review_id = $1`,
    [reviewId]
  );
  return result.rows[0];
};

module.exports = { upsertVote, getVoteCounts };
