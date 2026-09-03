const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

const targetBlock = `    /* ==================== 매뉴얼 & FAQ 본문 가독성 글꼴 확대 ==================== */
    /* 1. 수강신청 운영 절차 (1~23번): 조금 더 확대 (1.06rem) */
    #panel_ad_faq_main #operationsListContainer > div {
      padding: 8px 4px !important;
      font-size: 1.06rem !important;
      line-height: 1.55 !important;
    }
    /* 2. 순번 원형 뱃지: 지름 25px / 글자 0.85rem 로 확대 */
    #panel_ad_faq_main #operationsListContainer span[style*="border-radius:50%"] {
      width: 25px !important;
      height: 25px !important;
      font-size: 0.85rem !important;
    }
    /* 3. 양식 및 매뉴얼 다운로드 항목: 조금 더 확대 (1.08rem) */
    #panel_ad_faq_main #templateDownloadsContainer > div,
    #panel_ad_faq_main #manualDownloadsContainer > div {
      padding: 9px 4px !important;
      font-size: 1.08rem !important;
      line-height: 1.55 !important;
    }
    /* 4. FAQ 카테고리 질의응답 목록: 조금 더 확대 (1.03rem) */
    #panel_ad_faq_main #faqColLeft div[style*="justify-content:space-between"],
    #panel_ad_faq_main #faqColRight div[style*="justify-content:space-between"] {
      padding: 8px 4px !important;
      font-size: 1.03rem !important;
      line-height: 1.5 !important;
    }
    /* 섹션 띠 헤더 및 카테고리 타이틀 */
    #panel_ad_faq_main div[style*="border-left:4px"] {
      font-size: 1.08rem !important;
      padding: 10px 16px !important;
      font-weight: 700 !important;
    }
    #panel_ad_faq_main #faqColLeft div[style*="background:#f8fafc"],
    #panel_ad_faq_main #faqColRight div[style*="background:#f8fafc"] {
      font-size: 1.05rem !important;
      padding: 10px 14px !important;
      font-weight: 700 !important;
    }
    /* ※ 버튼(.manual_btn)은 원본(default.css) 디자인 그대로 유지/복구 (오버라이드 제거) */`;

const newBlock = `    /* ==================== 매뉴얼 & FAQ 본문 가독성 글꼴 확대 ==================== */
    /* 1. 수강신청 운영 절차 (1~23번): 시원한 크기로 추가 확대 (1.18rem, 약 19px) */
    #panel_ad_faq_main #operationsListContainer > div {
      padding: 10px 4px !important;
      font-size: 1.18rem !important;
      line-height: 1.6 !important;
    }
    /* 2. 순번 원형 뱃지: 지름 28px / 글자 0.92rem 로 선명하게 확대 */
    #panel_ad_faq_main #operationsListContainer span[style*="border-radius:50%"] {
      width: 28px !important;
      height: 28px !important;
      font-size: 0.92rem !important;
      font-weight: 800 !important;
    }
    /* 3. 양식 및 매뉴얼 다운로드 항목: 시원한 크기로 추가 확대 (1.20rem, 약 19.2px) */
    #panel_ad_faq_main #templateDownloadsContainer > div,
    #panel_ad_faq_main #manualDownloadsContainer > div {
      padding: 11px 4px !important;
      font-size: 1.20rem !important;
      line-height: 1.6 !important;
    }
    /* 4. FAQ 카테고리 질의응답 목록: 시원한 크기로 추가 확대 (1.15rem, 약 18.4px) */
    #panel_ad_faq_main #faqColLeft div[style*="justify-content:space-between"],
    #panel_ad_faq_main #faqColRight div[style*="justify-content:space-between"] {
      padding: 9px 4px !important;
      font-size: 1.15rem !important;
      line-height: 1.55 !important;
    }
    /* 섹션 띠 헤더 및 카테고리 타이틀 */
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

content = content.replace(/\r\n/g, '\n');
const normTarget = targetBlock.replace(/\r\n/g, '\n');

if (!content.includes(normTarget)) {
  console.error('Target block not found!');
  process.exit(1);
}

content = content.replace(normTarget, newBlock);
fs.writeFileSync(indexPath, content, 'utf8');
console.log('Successfully applied extra font scaling for maximum readability');
