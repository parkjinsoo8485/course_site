const fs = require('fs');
const fp = 'course_site/af/ad_lec/lists/sn/admin_lec.js';
let content = fs.readFileSync(fp, 'utf8');

const replacement = `document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  const initialKey = getSubmodelKeyFromPath(path);
  switchSubmodelView(null, initialKey, path, false);

  // ==================== 전역 사이드바 SPA 내비게이션 인터셉터 ====================
  // 사이드바의 어떤 메뉴를 클릭하더라도 브라우저 전체 새로고침을 100% 원천 차단하고
  // 사이드바 DOM과 크기는 그대로 유지한 채 본문 페이지만 번개처럼 교체합니다!
  document.addEventListener('click', (e) => {
    const link = e.target.closest('#left_menu a');
    if (!link) return;

    const href = link.getAttribute('href');
    // 로그아웃, 모달창 팝업, 자바스크립트 명령, 빈 링크는 고유 핸들러에 위임
    if (!href || href === '#' || href.startsWith('javascript:') || href.includes('/logout') || href.includes('/modify')) {
      return;
    }

    // 브라우저 페이지 전체 새로고침 100% 방지!
    e.preventDefault();
    e.stopPropagation();

    const targetKey = getSubmodelKeyFromPath(href);
    switchSubmodelView(null, targetKey, href, true);
  });

  // 브라우저 뒤로가기 / 앞으로가기 완벽 지원
  window.addEventListener('popstate', (e) => {
    const path = window.location.pathname;
    const targetKey = e.state?.key || getSubmodelKeyFromPath(path);
    switchSubmodelView(null, targetKey, path, false);
  });
});`;

content = content.replace(/document\.addEventListener\('DOMContentLoaded'[\s\S]*?switchSubmodelView\(null, initialKey, path, false\);\s*\}\);/, replacement);
fs.writeFileSync(fp, content, 'utf8');
console.log('Successfully fixed DOMContentLoaded and added Global Sidebar SPA Interceptor');
