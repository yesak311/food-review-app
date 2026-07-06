function renderNav() {
  const nav = document.getElementById('nav');
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  nav.innerHTML = `
    <a class="brand" href="/">Food Review App</a>
    <div>
      ${
        token
          ? `<span>Hi, ${username}</span><button id="logout-btn">Logout</button>`
          : `<a href="/login.html">Login</a><a href="/register.html">Register</a>`
      }
    </div>
  `;

  if (token) {
    document.getElementById('logout-btn').addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/';
    });
  }
}

renderNav();
