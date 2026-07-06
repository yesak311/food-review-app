# Food Review App

A JSON API for rating and reviewing restaurants, with a plain HTML/CSS/JS frontend that consumes it via `fetch()`. Users can register, log in, browse restaurants sorted by average rating, and leave one review per restaurant.

## Tech stack

- **Backend:** Node.js, Express, PostgreSQL (`pg`)
- **Auth:** JWT (`jsonwebtoken`) + password hashing (`bcrypt`)
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

## API overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create an account |
| POST | `/api/auth/login` | — | Log in, receive a JWT |
| GET | `/api/restaurants` | — | List restaurants with average rating |
| GET | `/api/restaurants/:id` | — | Restaurant details + its reviews |
| POST | `/api/restaurants` | required | Create a restaurant |
| POST | `/api/restaurants/:id/reviews` | required | Leave a review |
| PUT | `/api/reviews/:id` | required (owner) | Edit your own review |
| DELETE | `/api/reviews/:id` | required (owner) | Delete your own review |

## Extra features (beyond the base assignment)

- **Input validation** (`express-validator`) on registration and review submission — enforces username/password length and a 1-5 integer rating before it ever reaches the database.
- **Rate limiting** (`express-rate-limit`) on login — 10 attempts per 15 minutes per IP, to slow down brute-force password guessing.
- **One review per user per restaurant**, enforced at the database level with a `UNIQUE (user_id, restaurant_id)` constraint — not just checked in application code.
- **Aggregate ratings** computed live with a `LEFT JOIN` + `GROUP BY` query, so restaurants with zero reviews still appear (sorted last).
- **Role column** on `users` (`user`/`admin`), included in the JWT payload for future authorization checks.
- **Security logging** — failed login attempts are logged server-side with `console.warn`.
