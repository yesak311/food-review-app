const pool = require('../config/db');

const create = async (name, cuisine, location, createdBy) => {
  const result = await pool.query(
    'INSERT INTO restaurants (name, cuisine, location, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, cuisine, location, createdBy]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await pool.query('SELECT * FROM restaurants WHERE id = $1', [id]);
  return result.rows[0];
};

const getAllWithRatings = async () => {
  const result = await pool.query(`
    SELECT r.id, r.name, r.cuisine, r.location,
           ROUND(AVG(rev.rating), 1) AS avg_rating,
           COUNT(rev.id)::int AS review_count
    FROM restaurants r
    LEFT JOIN reviews rev ON rev.restaurant_id = r.id
    GROUP BY r.id
    ORDER BY avg_rating DESC NULLS LAST
  `);
  return result.rows;
};

module.exports = { create, findById, getAllWithRatings };
