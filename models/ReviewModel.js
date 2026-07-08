const pool = require('../config/db');

const create = async (restaurantId, userId, title, content, rating) => {
  const result = await pool.query(
    `INSERT INTO reviews (restaurant_id, user_id, title, content, rating)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [restaurantId, userId, title, content, rating]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await pool.query('SELECT * FROM reviews WHERE id = $1', [id]);
  return result.rows[0];
};

const update = async (id, title, content, rating) => {
  const result = await pool.query(
    'UPDATE reviews SET title = $1, content = $2, rating = $3 WHERE id = $4 RETURNING *',
    [title, content, rating, id]
  );
  return result.rows[0];
};

const remove = async (id) => {
  await pool.query('DELETE FROM reviews WHERE id = $1', [id]);
};

const findByRestaurantId = async (restaurantId) => {
  const result = await pool.query(
    `SELECT rev.*, u.username,
            COUNT(*) FILTER (WHERE rv.vote_type = 'helpful')::int AS helpful_count,
            COUNT(*) FILTER (WHERE rv.vote_type = 'unhelpful')::int AS unhelpful_count
     FROM reviews rev
     JOIN users u ON u.id = rev.user_id
     LEFT JOIN review_votes rv ON rv.review_id = rev.id
     WHERE rev.restaurant_id = $1
     GROUP BY rev.id, u.username
     ORDER BY rev.created_at DESC`,
    [restaurantId]
  );
  return result.rows;
};

module.exports = { create, findById, update, remove, findByRestaurantId };
