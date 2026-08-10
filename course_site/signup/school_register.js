document.addEventListener('DOMContentLoaded', () => {
  const schoolForm = document.getElementById('schoolForm');
  const errorBox = document.getElementById('errorBox');
  const planBoxes = document.querySelectorAll('.plan-box');
  const payBtns = document.querySelectorAll('.pay-btn');

  let selectedPlan = 'standard';
  let selectedPay = 'card';

  // Check URL query for default plan selection
  const urlParams = new URLSearchParams(window.location.search);
  const planFromUrl = urlParams.get('plan');
  if (planFromUrl && ['basic', 'standard', 'premium'].includes(planFromUrl)) {
    selectedPlan = planFromUrl;
    planBoxes.forEach(b => {
      if (b.dataset.plan === selectedPlan) b.classList.add('selected');
      else b.classList.remove('selected');
    });
  }

  // Plan selector click
  planBoxes.forEach(box => {
    box.addEventListener('click', () => {
      planBoxes.forEach(b => b.classList.remove('selected'));
      box.classList.add('selected');
      selectedPlan = box.dataset.plan;
    });
  });

  // Pay method click
  payBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      payBtns.forEach(p => p.classList.remove('selected'));
      btn.classList.add('selected');
      selectedPay = btn.dataset.pay;
    });
  });

  // Form submit
  schoolForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.style.display = 'none';

    const schoolName = document.getElementById('schoolName').value.trim();
    const schoolCode = document.getElementById('schoolCode').value.trim().toUpperCase();
    const adminUsername = document.getElementById('adminUsername').value.trim();
    const adminPassword = document.getElementById('adminPassword').value;
    const adminName = document.getElementById('adminName').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!schoolName || !schoolCode || !adminUsername || !adminPassword || !adminName || !email) {
      showError('모든 필수 항목을 작성해주세요.');
      return;
    }

    try {
      const response = await fetch('/api/auth/register-school', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolName,
          schoolCode,
          adminUsername,
          adminPassword,
          adminName,
          email,
          plan: selectedPlan
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`🎉 ${data.schoolName} 등록이 완료되었습니다!\n발급된 학교 코드: [ ${data.schoolCode} ]\n관리자 계정으로 로그인해주세요.`);
        window.location.href = '../login/login.html';
      } else {
        showError(data.message || '학교 가입 실패');
      }
    } catch (err) {
      showError('통신 네트워크 오류: ' + err.message);
    }
  });

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.style.display = 'block';
  }
});
