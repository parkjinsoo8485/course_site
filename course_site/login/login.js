document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const errorBox = document.getElementById('errorBox');
  const togglePwBtn = document.getElementById('togglePwBtn');
  const saveIdChk = document.getElementById('saveId');
  const roleTabs = document.querySelectorAll('.role-tab');

  let currentRole = 'teacher';

  // Role Tab Switch
  roleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      roleTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentRole = tab.dataset.role;

      // Update placeholder for demo guidance
      if (currentRole === 'school_admin') {
        usernameInput.placeholder = '관리자 아이디 (데모: schadmin)';
        passwordInput.placeholder = '비밀번호 (데모: admin1234)';
      } else if (currentRole === 'teacher') {
        usernameInput.placeholder = '교사 아이디 (데모: teacher)';
        passwordInput.placeholder = '비밀번호 (데모: 12341234)';
      } else {
        usernameInput.placeholder = '아이디 입력';
        passwordInput.placeholder = '비밀번호 입력';
      }
    });
  });

  // Load Saved Username
  const savedUser = localStorage.getItem('savedUsername');
  if (savedUser) {
    usernameInput.value = savedUser;
    saveIdChk.checked = true;
  }

  // Toggle Password
  togglePwBtn.addEventListener('click', () => {
    const isPw = passwordInput.type === 'password';
    passwordInput.type = isPw ? 'text' : 'password';
    togglePwBtn.textContent = isPw ? '🔒' : '👁️';
  });

  // Form Submit
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.style.display = 'none';
    errorBox.textContent = '';

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
      showError('아이디와 비밀번호를 모두 입력하세요.');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role: currentRole })
      });

      const data = await response.json();

      if (data.success) {
        // Save ID Check
        if (saveIdChk.checked) {
          localStorage.setItem('savedUsername', username);
        } else {
          localStorage.removeItem('savedUsername');
        }

        // Store JWT token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect to dashboard
        window.location.href = '../dashboard/teacher_dashboard.html';
      } else {
        showError(data.message || '로그인에 실패했습니다.');
      }
    } catch (err) {
      showError('서버와의 통신에 실패했습니다: ' + err.message);
    }
  });

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.style.display = 'block';
  }
});