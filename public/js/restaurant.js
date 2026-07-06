const restaurantId = new URLSearchParams(window.location.search).get('id');
const token = localStorage.getItem('token');
const username = localStorage.getItem('username');

function renderRestaurantInfo(restaurant) {
  document.getElementById('restaurant-info').innerHTML = `
    <h1>${restaurant.name}</h1>
    <p>${restaurant.cuisine ?? ''} — ${restaurant.location ?? ''}</p>
  `;
}

function renderReviews(reviews) {
  const container = document.getElementById('review-list');
  container.innerHTML = '';

  if (reviews.length === 0) {
    container.innerHTML = '<p>No reviews yet.</p>';
    return;
  }

  for (const review of reviews) {
    const div = document.createElement('div');
    div.className = 'review';
    const isOwner = username === review.username;

    div.innerHTML = `
      <strong>${review.title}</strong> — ⭐ ${review.rating} by ${review.username}
      <p>${review.content}</p>
      ${
        isOwner
          ? `<div class="review-actions">
               <button data-action="edit" data-id="${review.id}">Edit</button>
               <button data-action="delete" data-id="${review.id}">Delete</button>
             </div>`
          : ''
      }
    `;
    container.appendChild(div);

    if (isOwner) {
      div.querySelector('[data-action="edit"]').addEventListener('click', () => startEdit(review));
      div.querySelector('[data-action="delete"]').addEventListener('click', () => deleteReview(review.id));
    }
  }
}

async function loadRestaurant() {
  const res = await fetch(`/api/restaurants/${restaurantId}`);
  if (!res.ok) {
    document.getElementById('restaurant-info').innerHTML = '<p>Restaurant not found.</p>';
    document.getElementById('review-form').remove();
    return;
  }
  const { restaurant, reviews } = await res.json();
  renderRestaurantInfo(restaurant);
  renderReviews(reviews);
}

function startEdit(review) {
  document.getElementById('title').value = review.title;
  document.getElementById('content').value = review.content;
  document.getElementById('rating').value = review.rating;

  const form = document.getElementById('review-form');
  form.dataset.editingId = review.id;
  form.querySelector('button[type="submit"]').textContent = 'Update Review';
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
