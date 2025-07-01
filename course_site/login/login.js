// 비밀번호 표시/숨기기
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const eyeIcon = document.getElementById('eyeIcon');

const eyeOpenSVG = '<ellipse cx="12" cy="12" rx="8" ry="5"/><circle cx="12" cy="12" r="2.5"/>';
const eyeClosedSVG = '<ellipse cx="12" cy="12" rx="8" ry="5"/><path d="M4 4l16 16" stroke="#b0b8c1" stroke-width="2"/>';

togglePassword.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    if (type === 'password') {
        eyeIcon.innerHTML = eyeOpenSVG;
    } else {
        eyeIcon.innerHTML = eyeClosedSVG;
    }
});

// 로그인 폼 제출 시 에러 메시지 표시
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const userId = document.getElementById('userId').value.trim();
    const password = passwordInput.value.trim();
    if (!userId || !password) {
        errorMessage.textContent = '아이디와 비밀번호를 모두 입력해주세요.';
        return;
    }
    // 실제 인증 로직 없음 (예시)
    errorMessage.textContent = '로그인 기능은 구현되어 있지 않습니다.';
});

// 로그인 역할 탭
const tabs = document.querySelectorAll('.login-tab');
let selectedRole = 'teacher';
tabs.forEach(tab => {
    tab.addEventListener('click', function() {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        selectedRole = this.dataset.role;
    });
}); 