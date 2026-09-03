const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

// #left_menu 시작 위치 찾기
const leftMenuIdx = content.indexOf('#left_menu {');
if (leftMenuIdx === -1) {
  console.error('Cannot find #left_menu {');
  process.exit(1);
}

const restOfContent = content.substring(leftMenuIdx);

const properHead = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>방과후학교 프로그램 관리자 시스템 | 디비디비스쿨 통합 플랫폼</title>
  <link href="/css/bootstrap.css" rel="stylesheet" type="text/css" />
  <link href="/css/default.css" rel="stylesheet" type="text/css" />
  <link href="/css/content.css" rel="stylesheet" type="text/css" />
  <link href="/css/af/content.css" rel="stylesheet" type="text/css" />
  <link href="/css/font-awesome.css" rel="stylesheet" type="text/css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <link rel="stylesheet" href="/af/ad_lec/lists/sn/admin_lec.css">
  <style>
    @font-face {
      font-family: 'FontAwesome';
      src: url('/icon/fonts/fontawesome-webfont.woff?v=4.2.0') format('woff');
      font-weight: normal;
      font-style: normal;
    }
    .fa {
      font-family: 'FontAwesome' !important;
      display: inline-block;
      font: normal normal normal 14px/1 FontAwesome;
      text-rendering: auto;
      -webkit-font-smoothing: antialiased;
    }

    /* ==================== 매뉴얼 & FAQ 본문 가독성 글꼴 확대 ==================== */
    #panel_ad_faq_main {
      font-size: 15px !important;
    }
    #panel_ad_faq_main h2 {
      font-size: 1.35rem !important;
      font-weight: 800 !important;
    }
    #panel_ad_faq_main p {
      font-size: 0.95rem !important;
    }
    /* 상단 매뉴얼 다운로드 / 동영상 매뉴얼 버튼 */
    #panel_ad_faq_main a[href*="manual_af.zip"],
    #panel_ad_faq_main a[href*="youtube.com/playlist"] {
      font-size: 0.95rem !important;
      padding: 8px 16px !important;
      font-weight: 700 !important;
    }
    /* 섹션 헤더 (수강신청 운영 절차, 양식 다운로드, 매뉴얼 다운로드, FAQ) */
    #panel_ad_faq_main div[style*="border-left:4px"] {
      font-size: 1.05rem !important;
      padding: 10px 16px !important;
      font-weight: 700 !important;
    }
    /* 수강신청 운영 절차 목록 */
    #panel_ad_faq_main #operationsListContainer > div {
      padding: 7px 4px !important;
      font-size: 0.95rem !important;
      line-height: 1.5 !important;
    }
    #panel_ad_faq_main #operationsListContainer span[style*="border-radius:50%"] {
      width: 22px !important;
      height: 22px !important;
      font-size: 0.78rem !important;
    }
    /* 양식 다운로드 및 매뉴얼 다운로드 목록 */
    #panel_ad_faq_main #templateDownloadsContainer > div,
    #panel_ad_faq_main #manualDownloadsContainer > div {
      padding: 8px 4px !important;
      font-size: 0.98rem !important;
      line-height: 1.5 !important;
    }
    /* FAQ 카테고리 헤더 및 목록 */
    #panel_ad_faq_main #faqColLeft div[style*="background:#f8fafc"],
    #panel_ad_faq_main #faqColRight div[style*="background:#f8fafc"] {
      font-size: 1.02rem !important;
      padding: 10px 14px !important;
      font-weight: 700 !important;
    }
    #panel_ad_faq_main #faqColLeft div[style*="justify-content:space-between"],
    #panel_ad_faq_main #faqColRight div[style*="justify-content:space-between"] {
      padding: 7px 4px !important;
      font-size: 0.94rem !important;
      line-height: 1.45 !important;
    }
    /* 다운로드 / 동영상 뱃지 버튼 (.manual_btn) */
    #panel_ad_faq_main .manual_btn {
      font-size: 13px !important;
      padding: 3px 9px !important;
      border-radius: 4px !important;
      line-height: 1.4 !important;
      font-weight: 600 !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 4px !important;
      border: 1px solid #d1d5db !important;
      background: #ffffff !important;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
      transition: all 0.15s ease-in-out !important;
    }
    #panel_ad_faq_main .manual_btn:hover {
      background: #f1f5f9 !important;
      border-color: #94a3b8 !important;
      text-decoration: none !important;
    }

    /* dbdbschool Original Theme Overrides - Pixel-Exact 45px Item Heights */
    #header { background: #4791d2 !important; height: 60px !important; position: relative; z-index: 1000; }
    #header #logo { background: #366d9d !important; height: 60px !important; line-height: 60px !important; padding: 0 20px; float: left; }
    #header #logo a { color: #fff; font-size: 16px; font-weight: bold; text-decoration: none; }
    #header h1 { float: left; margin: 0; padding: 0 20px; line-height: 60px; font-size: 16px; }
    #header h1 a { color: #fff; text-decoration: none; font-weight: bold; }
    
    #container { display: flex; min-height: calc(100vh - 60px); }
    `;

content = properHead + restOfContent;
fs.writeFileSync(indexPath, content, 'utf8');
console.log('Successfully reconstructed proper head and added font scaling CSS');
