const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

const targetAnchor = '    /* ※ 버튼(.manual_btn)은 원본(default.css) 디자인 그대로 유지 */';

const borderCss = `    /* ※ 버튼(.manual_btn)은 원본(default.css) 디자인 그대로 유지 */

    /* ==================== 섹터별 또렷한 테두리(Border) & 구획 분리 강화 ==================== */
    /* 1. 상단 안내&FAQ 헤더 구분선 명확화 */
    #panel_ad_faq_main div[style*="border-bottom:2px solid #e2e8f0"] {
      border-bottom: 2.5px solid #94a3b8 !important;
      padding-bottom: 16px !important;
      margin-bottom: 22px !important;
    }

    /* 2. 각 섹터 상단 띠 헤더 (운영절차, 양식, 매뉴얼, FAQ) 테두리 */
    #panel_ad_faq_main div[style*="border-left:4px"] {
      border-top: 2px solid #94a3b8 !important;
      border-right: 2px solid #94a3b8 !important;
      border-left: 6px solid !important;
      border-bottom: 2px solid #cbd5e1 !important;
      border-radius: 8px 8px 0 0 !important;
      background: #f8fafc !important;
    }

    /* 3. 각 섹터 바디 박스 외곽 테두리 (운영절차, 양식, 매뉴얼) */
    #panel_ad_faq_main div[style*="border:1px solid #e2e8f0"] {
      border: 2px solid #94a3b8 !important;
      border-top: none !important;
      border-radius: 0 0 8px 8px !important;
      box-shadow: 0 4px 10px rgba(15, 23, 42, 0.07) !important;
      background: #ffffff !important;
    }

    /* 4. FAQ 카테고리별 개별 카드 박스 테두리 분명화 */
    #panel_ad_faq_main #faqColLeft > div,
    #panel_ad_faq_main #faqColRight > div {
      border: 2px solid #94a3b8 !important;
      border-radius: 8px !important;
      box-shadow: 0 4px 10px rgba(15, 23, 42, 0.07) !important;
      overflow: hidden !important;
      margin-bottom: 18px !important;
      background: #ffffff !important;
    }
    #panel_ad_faq_main #faqColLeft div[style*="background:#f8fafc"],
    #panel_ad_faq_main #faqColRight div[style*="background:#f8fafc"] {
      border-bottom: 2px solid #cbd5e1 !important;
    }

    /* 5. 내부 행(row) 구분선 선명화 */
    #panel_ad_faq_main #operationsListContainer > div,
    #panel_ad_faq_main #templateDownloadsContainer > div,
    #panel_ad_faq_main #manualDownloadsContainer > div,
    #panel_ad_faq_main #faqColLeft div[style*="justify-content:space-between"],
    #panel_ad_faq_main #faqColRight div[style*="justify-content:space-between"] {
      border-bottom: 1.5px solid #e2e8f0 !important;
    }`;

content = content.replace(/\r\n/g, '\n');
const normAnchor = targetAnchor.replace(/\r\n/g, '\n');

if (!content.includes(normAnchor)) {
  console.error('Target anchor not found!');
  process.exit(1);
}

content = content.replace(normAnchor, borderCss);
fs.writeFileSync(indexPath, content, 'utf8');
console.log('Successfully added distinct border styling for all manual sectors');
