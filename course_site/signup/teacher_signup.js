const signupForm = document.getElementById('signupForm');
const errorMessage = document.getElementById('errorMessage');

signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    errorMessage.style.color = 'red';
    errorMessage.textContent = '';

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

    const data = {
        name: document.getElementById('name').value,
        userid: document.getElementById('userid').value,
        password: pw,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        school: document.getElementById('school').value
    };

    const scriptURL = 'https://script.google.com/macros/s/AKfycbxcbf87ZJitEu1e0Hhw4q1aO7IC_MaRGWMNXaEOZI3UZC_9oIGNlGV6OOKqtEkvO2E/exec';
    fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors'
    })
    .then(() => {
        window.location.href = 'signup_success.html';
    })
    .catch((err) => {
        errorMessage.textContent = '서버와 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    });
}); 