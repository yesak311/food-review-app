const restaurantId = new URLSearchParams(window.location.search).get('id');
const token = localStorage.getItem('token');
const username = localStorage.getItem('username');
const role = localStorage.getItem('role');

function renderRestaurantInfo(restaurant) {
  const photo = restaurant.image_url
    ? `<img src="${restaurant.image_url}" alt="${restaurant.name}" />`
    : '';

  document.getElementById('restaurant-info').innerHTML = `
    <div class="restaurant-banner">
      ${photo}
      <div class="banner-info">
        <h1>${restaurant.name}</h1>
        <p class="card-meta">${restaurant.cuisine ?? ''}${restaurant.cuisine && restaurant.location ? ' — ' : ''}${restaurant.location ?? ''}</p>
      </div>
    </div>
  `;
}

function renderReviews(reviews) {
  const container = document.getElementById('review-list');

  if (reviews.length === 0) {
    container.innerHTML = '<p class="empty-state">No reviews yet.</p>';
    return;
  }

  container.innerHTML = reviews
    .map(
      (review) => `
    <div class="review" data-review-id="${review.id}">
      <div class="review-header">
        <strong>${review.title}</strong>
        ${renderStars(review.rating)}
      </div>
      <p class="review-meta">by ${review.username}</p>
      <p>${review.content}</p>
      <div class="review-footer">
        <div class="vote-group">
          <button class="btn-vote" data-vote="helpful">👍 Helpful (${review.helpful_count})</button>
          <button class="btn-vote" data-vote="unhelpful">👎 Not helpful (${review.unhelpful_count})</button>
        </div>
        <div class="review-actions">
          ${username === review.username ? `<button class="btn-secondary" data-action="edit">Edit</button>` : ''}
          ${
            username === review.username || role === 'admin'
              ? `<button class="btn-danger" data-action="delete">${role === 'admin' && username !== review.username ? 'Remove (admin)' : 'Delete'}</button>`
              : ''
          }
        </div>
      </div>
    </div>
  `
    )
    .join('');

  container.querySelectorAll('.review').forEach((div) => {
    const id = div.dataset.reviewId;
    const review = reviews.find((r) => String(r.id) === id);

    div.querySelectorAll('[data-vote]').forEach((btn) => {
      btn.addEventListener('click', () => vote(id, btn.dataset.vote));
    });

    const editBtn = div.querySelector('[data-action="edit"]');
    if (editBtn) editBtn.addEventListener('click', () => startEdit(review));

    const deleteBtn = div.querySelector('[data-action="delete"]');
    if (deleteBtn) deleteBtn.addEventListener('click', () => deleteReview(id));
  });
}

async function loadRestaurant() {
  const res = await fetch(`/api/restaurants/${restaurantId}`);
  if (!res.ok) {
    document.getElementById('restaurant-info').innerHTML = '<p class="empty-state">Restaurant not found.</p>';
    document.getElementById('review-form').remove();
    return;
  }
  const { restaurant, reviews } = await res.json();
  renderRestaurantInfo(restaurant);
  renderReviews(reviews);
}

async function vote(reviewId, voteType) {
  if (!token) {
    window.location.href = '/login.html';
    return;
  }
  await fetch(`/api/reviews/${reviewId}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ voteType }),
  });
  loadRestaurant();
}

function startEdit(review) {
  document.getElementById('title').value = review.title;
  document.getElementById('content').value = review.content;
  document.getElementById('rating').value = review.rating;

  const form = document.getElementById('review-form');
  form.dataset.editingId = review.id;
  form.querySelector('button[type="submit"]').textContent = 'Update Review';
  form.scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
  const form = document.getElementById('review-form');
  form.reset();
  delete form.dataset.editingId;
  form.querySelector('button[type="submit"]').textContent = 'Submit Review';
}

async function deleteReview(id) {
  if (!confirm('Delete this review?')) return;
  await fetch(`/api/reviews/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  loadRestaurant();
}

if (!token) {
  document.getElementById('review-form').remove();
} else {
  document.getElementById('review-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById('review-error');
    errorEl.textContent = '';

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const rating = Number(document.getElementById('rating').value);
    const form = e.target;
    const editingId = form.dataset.editingId;

    const url = editingId ? `/api/reviews/${editingId}` : `/api/restaurants/${restaurantId}/reviews`;
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content, rating }),
    });
    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = res.status === 409 ? 'You already reviewed this restaurant' : data.error;
      return;
    }

    resetForm();
    loadRestaurant();
  });
}

loadRestaurant();
