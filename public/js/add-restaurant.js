const token = localStorage.getItem('token');

if (!token) {
  window.location.href = '/login.html';
}

document.getElementById('add-restaurant-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errorEl = document.getElementById('error');
  errorEl.textContent = '';

  const formData = new FormData();
  formData.append('name', document.getElementById('name').value);
  formData.append('cuisine', document.getElementById('cuisine').value);
  formData.append('location', document.getElementById('location').value);

  const photoFile = document.getElementById('photo').files[0];
  if (photoFile) {
    formData.append('photo', photoFile);
  }

  const res = await fetch('/api/restaurants', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await res.json();

  if (!res.ok) {
    errorEl.textContent = data.errors ? data.errors.map((e) => e.msg).join(', ') : data.error;
    return;
  }

  window.location.href = `/restaurant.html?id=${data.id}`;
});
