// login.js
document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('error');

  // Client-side validation
  if (!email || !password) {
    errorDiv.textContent = 'Please enter both email and password.';
    return;
  }
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    errorDiv.textContent = 'Invalid email format.';
    return;
  }

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      errorDiv.textContent = '';
      // Store JWT if remember me checked
      if (document.getElementById('remember').checked) {
        localStorage.setItem('token', data.token);
      }
      alert('Login successful! Welcome, ' + data.username);
      // Redirect or update UI as needed
    } else {
      errorDiv.textContent = data.message || 'Login failed.';
    }
  } catch (err) {
    errorDiv.textContent = 'Server error. Please try again.';
  }
}); 