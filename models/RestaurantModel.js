const pool = require('../config/db');

const create = async (name, cuisine, location, createdBy, imageUrl) => {
  const result = await pool.query(
    `INSERT INTO restaurants (name, cuisine, location, created_by, image_url)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, cuisine, location, createdBy, imageUrl]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await pool.query('SELECT * FROM restaurants WHERE id = $1', [id]);
  return result.rows[0];
};

const remove = async (id) => {
  await pool.query('DELETE FROM restaurants WHERE id = $1', [id]);
};

const SORT_OPTIONS = {
  rating: 'avg_rating DESC NULLS LAST',
  name: 'r.name ASC',
  newest: 'r.created_at DESC',
};

const buildFilters = ({ cuisine, location }) => {
  const conditions = [];
  const values = [];

  if (cuisine) {
    values.push(`%${cuisine}%`);
    conditions.push(`r.cuisine ILIKE $${values.length}`);
  }
  if (location) {
    values.push(`%${location}%`);
    conditions.push(`r.location ILIKE $${values.length}`);
  }

  return {
    whereClause: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '',
    values,
  };
};

const getAllWithRatings = async ({ cuisine, location, sort = 'rating', page = 1, limit = 10 } = {}) => {
  const { whereClause, values } = buildFilters({ cuisine, location });
  const orderBy = SORT_OPTIONS[sort] || SORT_OPTIONS.rating;

  const limitNum = Math.min(Math.max(Number(limit) || 10, 1), 50);
  const pageNum = Math.max(Number(page) || 1, 1);
  const offset = (pageNum - 1) * limitNum;

  values.push(limitNum, offset);
  const limitIndex = values.length - 1;
  const offsetIndex = values.length;

  const result = await pool.query(
    `SELECT r.id, r.name, r.cuisine, r.location, r.image_url,
            ROUND(AVG(rev.rating), 1) AS avg_rating,
            COUNT(rev.id)::int AS review_count
     FROM restaurants r
     LEFT JOIN reviews rev ON rev.restaurant_id = r.id
     ${whereClause}
     GROUP BY r.id
     ORDER BY ${orderBy}
     LIMIT $${limitIndex} OFFSET $${offsetIndex}`,
    values
  );
  return result.rows;
};

const countAll = async ({ cuisine, location }) => {
  const { whereClause, values } = buildFilters({ cuisine, location });
  const result = await pool.query(
    `SELECT COUNT(*)::int AS total FROM restaurants r ${whereClause}`,
    values
  );
  return result.rows[0].total;
};

module.exports = { create, findById, remove, getAllWithRatings, countAll };
