const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

const targetBlock = `    /* ==================== 매뉴얼 & FAQ 본문 가독성 글꼴 확대 ==================== */
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
    }`;

const newBlock = `    /* ==================== 매뉴얼 & FAQ 본문 가독성 글꼴 확대 ==================== */
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

content = content.replace(/\r\n/g, '\n');
const normTarget = targetBlock.replace(/\r\n/g, '\n');

if (!content.includes(normTarget)) {
  console.error('Target block not found!');
  process.exit(1);
}

content = content.replace(normTarget, newBlock);
fs.writeFileSync(indexPath, content, 'utf8');
console.log('Successfully updated font sizes and restored original button styles');
