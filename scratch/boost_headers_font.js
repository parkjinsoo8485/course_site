const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

const targetBlock = `    /* 섹션 띠 헤더 및 카테고리 타이틀 */
    #panel_ad_faq_main div[style*="border-left:4px"] {
      font-size: 1.16rem !important;
      padding: 11px 18px !important;
      font-weight: 700 !important;
    }
    #panel_ad_faq_main #faqColLeft div[style*="background:#f8fafc"],
    #panel_ad_faq_main #faqColRight div[style*="background:#f8fafc"] {
      font-size: 1.12rem !important;
      padding: 11px 16px !important;
      font-weight: 700 !important;
    }
    /* ※ 버튼(.manual_btn)은 원본(default.css) 디자인 그대로 유지 */`;

const newBlock = `    /* ==================== 섹션 헤더 & 타이틀 가독성 대폭 강화 ==================== */
    /* 1. 상단 대제목 ("안내 & FAQ") */
    #panel_ad_faq_main h2 {
      font-size: 1.55rem !important;
      font-weight: 800 !important;
      color: #0f172a !important;
      margin-bottom: 4px !important;
    }
    /* 2. 안내 설명 문구 ("※ 아래 내용을 먼저 확인 후...") */
    #panel_ad_faq_main p {
      font-size: 1.10rem !important;
      color: #475569 !important;
      line-height: 1.5 !important;
    }
    /* 3. 각 섹션 띠 헤더 (수강신청 운영 절차, 양식 다운로드, 매뉴얼 다운로드, FAQ) */
    #panel_ad_faq_main div[style*="border-left:4px"] {
      font-size: 1.25rem !important;
      padding: 12px 18px !important;
      font-weight: 700 !important;
      letter-spacing: -0.3px !important;
    }
    /* 4. FAQ 카테고리 헤더 ("학생관리 (8)", "강사관리 (5)" 등) */
    #panel_ad_faq_main #faqColLeft div[style*="background:#f8fafc"],
    #panel_ad_faq_main #faqColRight div[style*="background:#f8fafc"] {
      font-size: 1.20rem !important;
      padding: 12px 16px !important;
      font-weight: 700 !important;
      letter-spacing: -0.2px !important;
    }
    #panel_ad_faq_main #faqColLeft div[style*="background:#f8fafc"] span,
    #panel_ad_faq_main #faqColRight div[style*="background:#f8fafc"] span {
      font-size: 0.95rem !important;
    }
    /* ※ 버튼(.manual_btn)은 원본(default.css) 디자인 그대로 유지 */`;

content = content.replace(/\r\n/g, '\n');
const normTarget = targetBlock.replace(/\r\n/g, '\n');

if (!content.includes(normTarget)) {
  console.error('Target block not found!');
  process.exit(1);
}

content = content.replace(normTarget, newBlock);
fs.writeFileSync(indexPath, content, 'utf8');
console.log('Successfully scaled up section headers and title');
