const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

const startTag = '    /* ==================== 매뉴얼 & FAQ 본문 가독성 글꼴 확대 ==================== */';
const endTag = '    /* dbdbschool Original Theme Overrides - Pixel-Exact 45px Item Heights */';

const startIdx = content.indexOf(startTag);
const endIdx = content.indexOf(endTag);

if (startIdx === -1 || endIdx === -1) {
  console.error('Cannot find style section');
  process.exit(1);
}

const siteAlignedCss = `    /* ==================== 매뉴얼 & FAQ (전체 사이트 톤앤매너 완벽 동기화) ==================== */
    /* 1. 상단 타이틀 영역: 사이트 표준 파란색(#4791d2) 포인트 라인 */
    #panel_ad_faq_main .content-card {
      background: #ffffff !important;
      border: 1px solid #d1d5db !important;
      border-radius: 4px !important;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03) !important;
      padding: 18px 22px !important;
    }
    #panel_ad_faq_main div[style*="border-bottom:2px"] {
      border-bottom: 2px solid #4791d2 !important;
      padding-bottom: 12px !important;
      margin-bottom: 16px !important;
    }
    #panel_ad_faq_main h2 {
      font-size: 1.25rem !important;
      font-weight: 700 !important;
      color: #1e293b !important;
    }
    #panel_ad_faq_main p {
      font-size: 0.88rem !important;
      color: #64748b !important;
      margin-top: 4px !important;
    }

    /* 2. 각 섹터 상단 띠 헤더 (사이트 표준 회색 배경 + 좌측 포인트 바 + 1px 테두리) */
    #panel_ad_faq_main div[style*="border-left:4px"] {
      border: 1px solid #cbd5e1 !important;
      border-bottom: 1px solid #e2e8f0 !important;
      border-left: 4px solid !important;
      border-radius: 4px 4px 0 0 !important;
      background: #f8fafc !important;
      padding: 8px 14px !important;
      font-size: 0.98rem !important;
      font-weight: 700 !important;
      color: #1e293b !important;
      display: flex !important;
      align-items: center !important;
      gap: 6px !important;
    }

    /* 3. 각 섹터 바디 박스 (수강신청 운영절차, 양식, 매뉴얼) */
    #panel_ad_faq_main div[style*="border:1px solid #e2e8f0"] {
      border: 1px solid #cbd5e1 !important;
      border-top: none !important;
      border-radius: 0 0 4px 4px !important;
      background: #ffffff !important;
      box-shadow: 0 1px 2px rgba(0,0,0,0.02) !important;
      padding: 8px 14px !important;
    }

    /* 4. 수강신청 운영 절차 (1~23번) 목록 및 순번 뱃지 */
    #panel_ad_faq_main #operationsListContainer > div {
      padding: 6px 2px !important;
      font-size: 0.95rem !important;
      border-bottom: 1px solid #f1f5f9 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
    }
    #panel_ad_faq_main #operationsListContainer span[style*="border-radius:50%"] {
      width: 21px !important;
      height: 21px !important;
      background: #4791d2 !important;
      color: #ffffff !important;
      border-radius: 50% !important;
      font-size: 0.72rem !important;
      font-weight: 700 !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex-shrink: 0 !important;
    }

    /* 5. 양식 다운로드 및 매뉴얼 다운로드 목록 */
    #panel_ad_faq_main #templateDownloadsContainer > div,
    #panel_ad_faq_main #manualDownloadsContainer > div {
      padding: 7px 0 !important;
      font-size: 0.96rem !important;
      border-bottom: 1px solid #f1f5f9 !important;
    }

    /* 6. FAQ 카테고리별 개별 카드 박스 (학생관리, 교직원관리 등 사이트 통일 디자인) */
    #panel_ad_faq_main #faqColLeft > div,
    #panel_ad_faq_main #faqColRight > div {
      border: 1px solid #cbd5e1 !important;
      border-radius: 4px !important;
      background: #ffffff !important;
      box-shadow: 0 1px 2px rgba(0,0,0,0.02) !important;
      overflow: hidden !important;
      margin-bottom: 12px !important;
    }
    #panel_ad_faq_main #faqColLeft div[style*="background:#f8fafc"],
    #panel_ad_faq_main #faqColRight div[style*="background:#f8fafc"] {
      background: #f8fafc !important;
      border-bottom: 1px solid #e2e8f0 !important;
      padding: 7px 12px !important;
      font-size: 0.94rem !important;
      font-weight: 700 !important;
      color: #1e293b !important;
    }
    #panel_ad_faq_main #faqColLeft div[style*="justify-content:space-between"],
    #panel_ad_faq_main #faqColRight div[style*="justify-content:space-between"] {
      padding: 6px 0 !important;
      font-size: 0.93rem !important;
      border-bottom: 1px solid #f8fafc !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
    }

    /* 7. 버튼 (.manual_btn) 원본 규격 완벽 보존 */
    #panel_ad_faq_main .manual_btn {
      font-size: 9pt !important;
      border: 1px solid #CCCCCC !important;
      background: #FFF !important;
      border-radius: 3px !important;
      padding: 1px 5px !important;
      color: #555555 !important;
      margin: 2px 2px !important;
      line-height: 140% !important;
      display: inline-block !important;
      text-decoration: none !important;
      transition: all 0.15s ease !important;
    }
    #panel_ad_faq_main .manual_btn:hover {
      background: #f4f4f4 !important;
      border-color: #999999 !important;
    }
    #panel_ad_faq_main .manual_btn .fa-youtube-play {
      color: #CB5F5F !important;
    }
    #panel_ad_faq_main .manual_btn .txt {
      color: #555555 !important;
    }

`;

content = content.substring(0, startIdx) + siteAlignedCss + content.substring(endIdx);
fs.writeFileSync(indexPath, content, 'utf8');
console.log('Successfully aligned manual FAQ styling with the whole site design system');
