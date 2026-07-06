async function loadRestaurants() {
  const res = await fetch('/api/restaurants');
  const restaurants = await res.json();
  const container = document.getElementById('restaurant-list');
  container.innerHTML = '';

  if (restaurants.length === 0) {
    container.innerHTML = '<p>No restaurants yet.</p>';
    return;
  }

  for (const r of restaurants) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h2>${r.name}</h2>
      <p>${r.cuisine ?? ''} — ${r.location ?? ''}</p>
      <p>⭐ ${r.avg_rating ?? 'No ratings yet'} (${r.review_count} reviews)</p>
      <a href="/restaurant.html?id=${r.id}">View reviews</a>
    `;
    container.appendChild(card);
  }
}

loadRestaurants();
