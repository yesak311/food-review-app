ALTER TABLE restaurants ADD COLUMN image_url VARCHAR(255);

CREATE TABLE review_votes (
  id SERIAL PRIMARY KEY,
  review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('helpful', 'unhelpful')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (review_id, user_id)
);
