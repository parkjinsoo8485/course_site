const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// index.html의 스타일 태그 내 레이아웃 정의를 가장 안정적인 표준 fixed sidebar + margin-left main 레이아웃으로 교체
const startMarker = '    /* ==================== 사이드바와 본문 영역 물리적 완전 격리 레이아웃 ==================== */';
const endMarker = '    /* dbdbschool Original Theme Overrides - Pixel-Exact 45px Item Heights */';

const sIdx = html.indexOf(startMarker);
const eIdx = html.indexOf(endMarker);

if (sIdx === -1 || eIdx === -1) {
  console.error('Cannot find markers in index.html');
  process.exit(1);
}

const robustLayoutCss = `    /* ==================== 사이드바와 본문 영역 물리적 완전 격리 레이아웃 ==================== */
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      overflow-x: hidden !important;
      background: #f8fafc !important;
    }

    /* 1. 상단 글로벌 헤더: 화면 상단 완전 고정 */
    #header {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 60px !important;
      background: #4791d2 !important;
      z-index: 2000 !important;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
    }

    /* 2. 전체 컨테이너: 헤더 아래에서 시작 */
    #container {
      display: block !important;
      position: relative !important;
      width: 100% !important;
      min-height: calc(100vh - 60px) !important;
      margin-top: 60px !important;
      padding: 0 !important;
      float: none !important;
      clear: both !important;
      box-sizing: border-box !important;
    }

    /* 3. 사이드바: 좌측 고정 (Fixed) & 독립 스크롤 (절대 본문과 겹치지 않음) */
    #left_menu {
      position: fixed !important;
      top: 60px !important;
      left: 0 !important;
      width: 240px !important;
      height: calc(100vh - 60px) !important;
      background: #f4f4f4 !important;
      border-right: 1px solid #dddddd !important;
      z-index: 1000 !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
      box-sizing: border-box !important;
      margin: 0 !important;
      float: none !important;
    }

    /* 4. 본문 컨텐츠 영역: 사이드바 우측에서 상단부터 즉시 시작 (Drop 현상 완벽 방지) */
    .main-content, #contents_box {
      display: block !important;
      float: none !important;
      clear: none !important;
      position: relative !important;
      margin-left: 240px !important;
      margin-top: 0 !important;
      margin-right: 0 !important;
      margin-bottom: 0 !important;
      width: calc(100% - 240px) !important;
      max-width: calc(100% - 240px) !important;
      min-width: 0 !important;
      min-height: calc(100vh - 60px) !important;
      padding: 20px 24px !important;
      background: #f8fafc !important;
      box-sizing: border-box !important;
      z-index: 1 !important;
    }

    /* 5. 본문 내부 패널 및 카드: 상단 정렬 및 100% 너비 유지 */
    .submodel-panel {
      display: none;
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      box-sizing: border-box !important;
      clear: both !important;
    }
    .submodel-panel.active {
      display: block !important;
    }
    .content-card {
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
      margin-bottom: 20px !important;
    }
    .table-responsive, .table-responsive-container {
      width: 100% !important;
      max-width: 100% !important;
      overflow-x: auto !important;
      box-sizing: border-box !important;
    }

`;

html = html.substring(0, sIdx) + robustLayoutCss + html.substring(eIdx);
fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully applied robust Fixed Sidebar + Margin Left Layout to index.html');

// admin_lec.css 도 동기화
const cssPath = path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'admin_lec.css');
let css = fs.readFileSync(cssPath, 'utf8');

const oldCss = `/* 3. MAIN CONTENT CONTAINER (완전 분리형 2-Column Flexbox Layout) */
.main-content {
  flex: 1 1 0% !important;
  min-width: 0 !important;
  width: calc(100% - 240px) !important;
  max-width: calc(100% - 240px) !important;
  margin-left: 0 !important;
  padding: 18px 24px !important;
  background-color: #f8fafc !important;
  height: calc(100vh - 60px) !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  box-sizing: border-box !important;
  position: relative !important;
}`;

const newCss = `/* 3. MAIN CONTENT CONTAINER (Robust Fixed Sidebar + Margin Left Layout) */
.main-content {
  display: block !important;
  float: none !important;
  clear: none !important;
  position: relative !important;
  margin-left: 240px !important;
  margin-top: 0 !important;
  width: calc(100% - 240px) !important;
  max-width: calc(100% - 240px) !important;
  min-height: calc(100vh - 60px) !important;
  padding: 20px 24px !important;
  background-color: #f8fafc !important;
  box-sizing: border-box !important;
}`;

css = css.replace(/\r\n/g, '\n');
const normOldCss = oldCss.replace(/\r\n/g, '\n');
if (css.includes(normOldCss)) {
  css = css.replace(normOldCss, newCss);
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('Successfully updated admin_lec.css');
} else {
  console.warn('normOldCss not found in admin_lec.css, replacing .main-content block');
  css = css.replace(/\.main-content\s*\{[^}]+\}/s, newCss);
  fs.writeFileSync(cssPath, css, 'utf8');
}
