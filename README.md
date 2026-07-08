# Food Review App

A JSON API for rating and reviewing restaurants, with a plain HTML/CSS/JS frontend that consumes it via `fetch()`. Users can register, log in, browse and filter restaurants by cuisine/location, sort by rating or newest, leave one review per restaurant with an optional photo, vote reviews helpful/unhelpful, and — for admins — moderate content across the platform.

## Tech stack

- **Backend:** Node.js, Express, PostgreSQL (`pg`)
- **Auth:** JWT (`jsonwebtoken`) + password hashing (`bcrypt`)
- **Authorization:** role-based access control (`user` / `admin`)
- **File uploads:** `multer` (restaurant photos)
- **Validation:** `express-validator`
- **Rate limiting:** `express-rate-limit`
- **Logging:** `morgan`
- **Frontend:** static HTML/CSS/JS served from `public/`, calling the API with `fetch()` — no server-side rendering

## Setup

1. Clone the repo and install dependencies:
   ```
   git clone https://github.com/yesak311/food-review-app.git
   cd food-review-app
   npm install
   ```
2. Create the database:
   ```
   psql -U postgres -c "CREATE DATABASE food_review_db;"
   ```
3. Load the schema (see [db/schema.sql](db/schema.sql) for the full DDL):
   ```
   psql -U postgres -d food_review_db -f db/schema.sql
   ```
4. Copy the env template and fill in your own values:
   ```
   cp .env.example .env
   ```
5. Start the dev server:
   ```
   npm run dev
   ```
6. Visit `http://localhost:3000` (or whichever `PORT` you set in `.env`).
7. New accounts default to the `user` role. To test admin-only features (moderating any restaurant or review), promote an account manually:
   ```sql
   UPDATE users SET role = 'admin' WHERE username = 'your_username';
   ```

> If you already had a database running before the photos/voting features were added, apply [db/migration_add_photos_and_votes.sql](db/migration_add_photos_and_votes.sql) instead of re-running the full schema — it adds the new column/table without touching existing data.

## API overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create an account |
| POST | `/api/auth/login` | — | Log in, receive a JWT |
| GET | `/api/restaurants` | — | List restaurants; supports `?cuisine=`, `?location=`, `?sort=rating\|name\|newest`, `?page=`, `?limit=` |
| GET | `/api/restaurants/:id` | — | Restaurant details + its reviews (with helpful/unhelpful vote counts) |
| POST | `/api/restaurants` | required | Create a restaurant (`multipart/form-data`, optional `photo` file) |
| DELETE | `/api/restaurants/:id` | required (admin) | Delete any restaurant |
| POST | `/api/restaurants/:id/reviews` | required | Leave a review |
| PUT | `/api/reviews/:id` | required (owner) | Edit your own review |
| DELETE | `/api/reviews/:id` | required (owner or admin) | Delete your own review, or any review as an admin |
| POST | `/api/reviews/:id/vote` | required | Vote a review `helpful` or `unhelpful` (one vote per user per review, changeable) |

## Extra features (beyond the base assignment)

- **Role-based access control** — the `role` column (`user`/`admin`) is enforced by a `requireAdmin` middleware, not just stored decoratively: admins can delete any restaurant and moderate (delete) any review, while regular users are limited to their own content.
- **Restaurant search, filtering, and pagination** — `GET /api/restaurants` supports filtering by cuisine/location and sorting by rating, name, or newest, with safe parameterized queries (filter values are parameterized; sort options are matched against a fixed whitelist, never interpolated directly, to avoid SQL injection through `ORDER BY`).
- **Review helpfulness voting** — a `review_votes` table lets any authenticated user mark a review helpful or unhelpful (one vote per user per review, upsertable), aggregated with the same `LEFT JOIN` + `GROUP BY` pattern used for restaurant ratings.
- **Photo uploads** (`multer`) — restaurants can include a photo, validated for file type and size, stored on disk and served as a static asset.
- **Input validation** (`express-validator`) on registration, restaurant creation, and review submission — enforces field lengths and a 1-5 integer rating before anything reaches the database.
- **Rate limiting** (`express-rate-limit`) on login — 10 attempts per 15 minutes per IP, to slow down brute-force password guessing.
- **One review per user per restaurant**, enforced at the database level with a `UNIQUE (user_id, restaurant_id)` constraint — not just checked in application code.
- **Aggregate ratings** computed live with a `LEFT JOIN` + `GROUP BY` query, so restaurants with zero reviews still appear (sorted last).
- **Security logging** — failed login attempts are logged server-side with `console.warn`.
