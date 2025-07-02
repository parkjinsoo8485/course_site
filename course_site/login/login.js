// login.js
(() => {
    const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzxT9aYnXMfHGi7jmqmtvICGFBbYHyPKfmDDEfGJt3N97OVoBqs0Mga0Pf8JaeAmLM/exec';
  
    // DOM 캐싱
    const form          = document.getElementById('loginForm');
    const userIdInput   = document.getElementById('userId');
    const pwInput       = document.getElementById('password');
    const errBox        = document.getElementById('errorMessage');
    const toggleBtn     = document.getElementById('togglePassword');
    const eyeIcon       = document.getElementById('eyeIcon');
    const saveIdChk     = document.getElementById('saveId');
  
    /** 페이지 초기화 */
    window.addEventListener('DOMContentLoaded', () => {
      // 저장된 아이디 불러오기
      const savedId = localStorage.getItem('savedUserId');
      if (savedId) {
        userIdInput.value = savedId;
        saveIdChk.checked = true;
      }
    });
  
    /** 비밀번호 표시/숨기기 토글 */
    toggleBtn.addEventListener('click', () => {
      const type = pwInput.type === 'password' ? 'text' : 'password';
      pwInput.type = type;
      // 눈 아이콘 외형 변경(선택)
      eyeIcon.setAttribute('stroke', type === 'text' ? '#2c80ff' : '#b0b8c1');
    });
  
    /** 로그인 제출 */
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errBox.textContent = '';               // 에러 초기화
  
      const userId = userIdInput.value.trim();
      const password = pwInput.value;
  
      if (!userId || !password) {
        errBox.textContent = '아이디와 비밀번호를 모두 입력하세요.';
        return;
      }
  
      try {
        const res = await fetch(WEB_APP_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, password })
        });
        const data = await res.json();
  
        if (data.success) {
          // 아이디 저장 체크
          if (saveIdChk.checked) localStorage.setItem('savedUserId', userId);
          else                   localStorage.removeItem('savedUserId');
  
          alert(`${data.name}님, 환영합니다!`);
          // TODO: 홈으로 이동 or 토큰 저장
          // location.href = '/dashboard.html';
        } else {
          errBox.textContent = data.message || '로그인 실패';
        }
      } catch (err) {
        errBox.textContent = '서버 통신 오류: ' + err.message;
      }
    });
  })();
  