const role = localStorage.getItem('role');
const token = localStorage.getItem('token');

let currentPage = 1;
const PAGE_SIZE = 9;

function buildQuery() {
  const cuisine = document.getElementById('filter-cuisine').value.trim();
  const location = document.getElementById('filter-location').value.trim();
  const sort = document.getElementById('filter-sort').value;

  const params = new URLSearchParams({ sort, page: currentPage, limit: PAGE_SIZE });
  if (cuisine) params.set('cuisine', cuisine);
  if (location) params.set('location', location);
  return params.toString();
}

function renderCard(r) {
  const photo = r.image_url
    ? `<img class="card-photo" src="${escapeHtml(r.image_url)}" alt="${escapeHtml(r.name)}" />`
    : `<div class="card-photo placeholder">🍽️</div>`;

  return `
    <div class="card">
      ${photo}
      <div class="card-body">
        <h2>${escapeHtml(r.name)}</h2>
        <p class="card-meta">${escapeHtml(r.cuisine)}${r.cuisine && r.location ? ' — ' : ''}${escapeHtml(r.location)}</p>
        ${renderStars(r.avg_rating)} <span class="card-meta">(${r.review_count} reviews)</span>
        <div class="card-actions">
          <a href="/restaurant.html?id=${r.id}">View reviews</a>
          ${role === 'admin' ? `<button class="btn-danger" data-delete-id="${r.id}">Delete</button>` : ''}
        </div>
      </div>
    </div>
  `;
}

async function deleteRestaurant(id) {
  if (!confirm('Delete this restaurant? This cannot be undone.')) return;
  await fetch(`/api/restaurants/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  loadRestaurants();
}

function renderPagination(total) {
  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);
  const container = document.getElementById('pagination');

  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <button class="btn-secondary" id="prev-page" ${currentPage <= 1 ? 'disabled' : ''}>Previous</button>
    <span>Page ${currentPage} of ${totalPages}</span>
    <button class="btn-secondary" id="next-page" ${currentPage >= totalPages ? 'disabled' : ''}>Next</button>
  `;

  document.getElementById('prev-page').addEventListener('click', () => {
    currentPage -= 1;
    loadRestaurants();
  });
  document.getElementById('next-page').addEventListener('click', () => {
    currentPage += 1;
    loadRestaurants();
  });
}

async function loadRestaurants() {
  const res = await fetch(`/api/restaurants?${buildQuery()}`);
  const { restaurants, total } = await res.json();
  const container = document.getElementById('restaurant-list');

  if (restaurants.length === 0) {
    container.innerHTML = '<p class="empty-state">No restaurants match your filters.</p>';
    document.getElementById('pagination').innerHTML = '';
    return;
  }

  container.innerHTML = restaurants.map(renderCard).join('');
  renderPagination(total);

  if (role === 'admin') {
    container.querySelectorAll('[data-delete-id]').forEach((btn) => {
      btn.addEventListener('click', () => deleteRestaurant(btn.dataset.deleteId));
    });
  }
}

document.getElementById('filter-form').addEventListener('submit', (e) => {
  e.preventDefault();
  currentPage = 1;
  loadRestaurants();
});

loadRestaurants();
