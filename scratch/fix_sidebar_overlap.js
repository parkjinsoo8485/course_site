const fs = require('fs');
const path = require('path');

// 1. index.html 수정
const indexPath = path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// 기존 #container, #left_menu, .main-content 스타일 찾기
const oldLayoutCss = `    #container { display: flex; min-height: calc(100vh - 60px); }
    #left_menu {
      position: fixed;
      width: 240px;
      height: calc(100vh - 60px);
      top: 60px;
      left: 0;
      background: #f4f4f4;
      z-index: 100;
      overflow-y: auto;
      border-right: 1px #dddddd solid;
    }`;

const newLayoutCss = `    /* ==================== 사이드바와 본문 영역 물리적 완전 격리 레이아웃 ==================== */
    #container {
      display: flex !important;
      flex-direction: row !important;
      align-items: stretch !important;
      width: 100% !important;
      min-height: calc(100vh - 60px) !important;
      position: relative !important;
      box-sizing: border-box !important;
      overflow: hidden !important;
    }
    #left_menu {
      position: sticky !important;
      top: 60px !important;
      flex: 0 0 240px !important;
      width: 240px !important;
      min-width: 240px !important;
      max-width: 240px !important;
      height: calc(100vh - 60px) !important;
      background: #f4f4f4 !important;
      z-index: 50 !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
      border-right: 1px solid #dddddd !important;
      box-sizing: border-box !important;
      margin: 0 !important;
      left: auto !important;
    }`;

indexHtml = indexHtml.replace(/\r\n/g, '\n');
const normOldLayout = oldLayoutCss.replace(/\r\n/g, '\n');

if (indexHtml.includes(normOldLayout)) {
  indexHtml = indexHtml.replace(normOldLayout, newLayoutCss);
  console.log('index.html #container and #left_menu layout replaced');
} else {
  console.warn('normOldLayout not matched in index.html, checking regex');
  indexHtml = indexHtml.replace(/#container\s*\{[^}]+\}\s*#left_menu\s*\{[^}]+\}/s, newLayoutCss);
}

// .main-content 스타일도 완벽 교체
const oldMainContentCss = `    .main-content {
      margin-left: 240px;
      flex: 1;
      width: calc(100% - 240px);
      min-width: 0;
      background: #f8fafc;
    }`;

const newMainContentCss = `    .main-content {
      flex: 1 1 0% !important;
      min-width: 0 !important;
      width: calc(100% - 240px) !important;
      max-width: calc(100% - 240px) !important;
      margin-left: 0 !important;
      padding: 18px 24px !important;
      background: #f8fafc !important;
      height: calc(100vh - 60px) !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
      box-sizing: border-box !important;
      position: relative !important;
    }
    /* 본문 패널 및 테이블 폭 제어로 사이드바 침범 원천 차단 */
    .submodel-panel {
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
    }
    .content-card {
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
    }
    .table-responsive, .table-responsive-container {
      max-width: 100% !important;
      overflow-x: auto !important;
      box-sizing: border-box !important;
    }`;

const normOldMain = oldMainContentCss.replace(/\r\n/g, '\n');
if (indexHtml.includes(normOldMain)) {
  indexHtml = indexHtml.replace(normOldMain, newMainContentCss);
  console.log('index.html .main-content layout replaced');
} else {
  indexHtml = indexHtml.replace(/\.main-content\s*\{[^}]+\}/s, newMainContentCss);
}

fs.writeFileSync(indexPath, indexHtml, 'utf8');
console.log('Successfully updated index.html layout');

// 2. admin_lec.css 수정
const cssPath = path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'admin_lec.css');
let adminCss = fs.readFileSync(cssPath, 'utf8');

const oldCssMainContent = `/* 3. MAIN CONTENT CONTAINER */
.main-content {
  flex: 1;
  padding: 18px 24px;
  background-color: #f8fafc;
  overflow-y: auto;
}`;

const newCssMainContent = `/* 3. MAIN CONTENT CONTAINER (완전 분리형 2-Column Flexbox Layout) */
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

adminCss = adminCss.replace(/\r\n/g, '\n');
const normCssMain = oldCssMainContent.replace(/\r\n/g, '\n');

if (adminCss.includes(normCssMain)) {
  adminCss = adminCss.replace(normCssMain, newCssMainContent);
  fs.writeFileSync(cssPath, adminCss, 'utf8');
  console.log('Successfully updated admin_lec.css .main-content');
} else {
  console.warn('normCssMain not matched directly in admin_lec.css');
}
