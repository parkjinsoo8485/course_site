document.addEventListener('DOMContentLoaded', () => {
  const teacherForm = document.getElementById('teacherForm');
  const schoolCodeInput = document.getElementById('schoolCode');
  const verifyBtn = document.getElementById('verifyBtn');
  const schoolBadge = document.getElementById('schoolBadge');
  const errorBox = document.getElementById('errorBox');

  let isSchoolVerified = false;

  async function checkSchoolCode() {
    const code = schoolCodeInput.value.trim().toUpperCase();
    if (!code) {
      showBadge('학교 코드를 입력하세요.', false);
      isSchoolVerified = false;
      return;
    }

    try {
      const res = await fetch(`/api/schools/verify-code?code=${encodeURIComponent(code)}`);
      const data = await res.json();

      if (data.success) {
        showBadge(`✅ [${data.school.name}] 소속 확인 완료`, true);
        isSchoolVerified = true;
      } else {
        showBadge(`❌ ${data.message}`, false);
        isSchoolVerified = false;
      }
    } catch (err) {
      showBadge('학교 코드 확인 실패', false);
      isSchoolVerified = false;
    }
  }

  verifyBtn.addEventListener('click', checkSchoolCode);
  schoolCodeInput.addEventListener('blur', checkSchoolCode);

  teacherForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.style.display = 'none';

    const schoolCode = schoolCodeInput.value.trim().toUpperCase();
    const name = document.getElementById('name').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (password !== passwordConfirm) {
      showError('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    if (!isSchoolVerified) {
      await checkSchoolCode();
      if (!isSchoolVerified) {
        showError('유효한 학교 코드를 확인해주세요.');
        return;
      }
    }

    try {
      const response = await fetch('/api/auth/register-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolCode, name, username, password, email, phone })
      });

      const data = await response.json();

      if (data.success) {
        alert('🎉 교사 회원가입이 성공적으로 완료되었습니다! 로그인 해주세요.');
        window.location.href = '../login/login.html';
      } else {
        showError(data.message || '가입에 실패했습니다.');
      }
    } catch (err) {
      showError('서버 통신 오류가 발생했습니다.');
    }
  });

  function showBadge(text, isSuccess) {
    schoolBadge.textContent = text;
    schoolBadge.style.color = isSuccess ? '#16a34a' : '#dc2626';
    schoolBadge.style.display = 'block';
  }

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.style.display = 'block';
  }
});