function renderNav() {
  const nav = document.getElementById('nav');
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  nav.innerHTML = `
    <a class="brand" href="/">🍽️ Food Review App</a>
    <div class="nav-links">
      ${
        token
          ? `<a class="nav-link nav-cta" href="/add-restaurant.html">+ Add Restaurant</a>
             <span class="nav-user">${username}${role === 'admin' ? ' <span class="admin-badge">admin</span>' : ''}</span>
             <button id="logout-btn">Logout</button>`
          : `<a class="nav-link" href="/login.html">Login</a><a class="nav-link nav-cta" href="/register.html">Register</a>`
      }
    </div>
  `;

  if (token) {
    document.getElementById('logout-btn').addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      window.location.href = '/';
    });
  }
}

renderNav();
