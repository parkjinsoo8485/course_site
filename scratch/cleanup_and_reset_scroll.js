const fs = require('fs');
const path = require('path');

// 1. index.html에서 중복된 두 번째 panel_ad_faq_main 삭제
const indexPath = path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

const dupFaqStart = '<!-- ==================== 29. 매뉴얼 (FAQ) (/af/ad_faq/main) ==================== -->';
const dupFaqEnd = '<!-- FOOTER -->';

const dSIdx = indexHtml.indexOf(dupFaqStart);
const dEIdx = indexHtml.indexOf(dupFaqEnd);

if (dSIdx !== -1 && dEIdx !== -1) {
  indexHtml = indexHtml.substring(0, dSIdx) + indexHtml.substring(dEIdx);
  fs.writeFileSync(indexPath, indexHtml, 'utf8');
  console.log('Successfully removed duplicate panel_ad_faq_main block from index.html');
} else {
  console.log('Duplicate FAQ block not found or already cleaned up');
}

// 2. admin_lec.js switchSubmodelView에 스크롤 최상단 리셋 추가
const jsPath = path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'admin_lec.js');
let jsContent = fs.readFileSync(jsPath, 'utf8');

const targetFunctionLine = 'function switchSubmodelView(event, key, url, pushState = true) {';
const replacementFunction = `function switchSubmodelView(event, key, url, pushState = true) {
  if (event) event.preventDefault();

  // 모든 메뉴 클릭 및 화면 전환 시 최상단 스크롤 강제 (하단 배치 및 겹침 방지)
  try {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const mc = document.querySelector('.main-content');
    if (mc) mc.scrollTop = 0;
  } catch(e) {}`;

if (jsContent.includes(targetFunctionLine)) {
  jsContent = jsContent.replace(
    /function switchSubmodelView\(event, key, url, pushState = true\) \{\s*(if \(event\) event\.preventDefault\(\);)?/,
    replacementFunction
  );
  fs.writeFileSync(jsPath, jsContent, 'utf8');
  console.log('Successfully added scroll reset to switchSubmodelView in admin_lec.js');
} else {
  console.warn('targetFunctionLine not found in admin_lec.js');
}
