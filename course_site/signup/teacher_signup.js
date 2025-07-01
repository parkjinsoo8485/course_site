const signupForm = document.getElementById('signupForm');
const errorMessage = document.getElementById('errorMessage');

signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const pw = document.getElementById('password').value;
    const pw2 = document.getElementById('password2').value;
    const terms = document.getElementById('terms').checked;
    if (pw !== pw2) {
        errorMessage.textContent = '비밀번호가 일치하지 않습니다.';
        return;
    }
    if (!terms) {
        errorMessage.textContent = '이용약관에 동의해야 회원가입이 가능합니다.';
        return;
    }
    errorMessage.textContent = '회원가입 기능은 구현되어 있지 않습니다.';
}); 