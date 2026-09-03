const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'admin_lec.css');
let adminCss = fs.readFileSync(cssPath, 'utf8');

const globalScaleCss = `

/* ==================== 전 메뉴 본문 텍스트 & 버튼 가독성 일괄 상향 (매뉴얼 기준 완벽 통일) ==================== */
/* 1. 상단 타이틀 영역 */
.page-title-box h1 {
  font-size: 1.45rem !important;
  font-weight: 800 !important;
  color: #1e293b !important;
  margin: 0 0 4px 0 !important;
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
}
.page-title-box .subtitle {
  font-size: 1.02rem !important;
  color: #64748b !important;
}

/* 2. 카드 상단 바 & 섹션 제목 */
.card-top-bar {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  margin-bottom: 14px !important;
  padding-bottom: 10px !important;
  border-bottom: 1px solid #f1f5f9 !important;
}
.card-top-bar .section-title {
  font-size: 1.25rem !important;
  font-weight: 800 !important;
  color: #1e293b !important;
}

/* 3. 알림/안내 박스 가독성 */
.alert-box {
  background-color: #fffbeb !important;
  border: 1px solid #fef3c7 !important;
  color: #b45309 !important;
  padding: 12px 18px !important;
  border-radius: 4px !important;
  font-size: 1.02rem !important;
  line-height: 1.6 !important;
  margin-bottom: 14px !important;
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
}
.alert-box i {
  font-size: 1.25rem !important;
}

/* 4. 검색 필터 바 & 폼 요소 */
.filter-container {
  background: #f8fafc !important;
  border: 1px solid #e2e8f0 !important;
  padding: 10px 14px !important;
  border-radius: 4px !important;
  margin-bottom: 14px !important;
  display: flex !important;
  flex-wrap: wrap !important;
  align-items: center !important;
  gap: 8px !important;
}
.filter-container select,
.filter-container input[type="text"],
.filter-container input[type="date"],
.filter-container input[type="search"] {
  height: 32px !important;
  padding: 3px 10px !important;
  border: 1px solid #cbd5e1 !important;
  border-radius: 3px !important;
  font-size: 0.95rem !important;
  background-color: #ffffff !important;
  color: #334155 !important;
}

/* 5. 버튼 크기 및 폰트 표준화 (매뉴얼 기준 & 프로젝트 표준 규칙 일치) */
.btn-db {
  height: 32px !important;
  padding: 0 14px !important;
  font-size: 0.92rem !important;
  font-weight: 700 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  line-height: 1 !important;
  gap: 6px !important;
  border-radius: 3px !important;
  cursor: pointer !important;
  text-decoration: none !important;
}
.helper-btn {
  height: 30px !important;
  padding: 0 12px !important;
  font-size: 0.88rem !important;
  font-weight: 600 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  line-height: 1 !important;
  gap: 5px !important;
  border-radius: 3px !important;
  text-decoration: none !important;
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
  color: #475569 !important;
}
.helper-btn:hover {
  background: #f8fafc !important;
  color: #1e293b !important;
}

/* 6. 데이터 테이블 본문 텍스트 시원하게 확대 (매뉴얼 본문 1.15rem 기준 조화) */
.db-table, table.list {
  width: 100% !important;
  border-collapse: collapse !important;
  font-size: 1.02rem !important;
}
.db-table th, table.list th {
  font-size: 1.05rem !important;
  font-weight: 700 !important;
  padding: 11px 10px !important;
  background-color: #f1f5f9 !important;
  color: #1e293b !important;
  text-align: center !important;
  border: 1px solid #d1d5db !important;
}
.db-table td, table.list td {
  font-size: 1.02rem !important;
  padding: 10px 10px !important;
  line-height: 1.55 !important;
  color: #1e293b !important;
  border: 1px solid #e5e7eb !important;
  vertical-align: middle !important;
}
.db-table td a, table.list td a {
  font-size: 1.02rem !important;
  color: #1e293b !important;
  text-decoration: none !important;
}
.db-table td a:hover, table.list td a:hover {
  color: #2563eb !important;
  text-decoration: underline !important;
}

/* 7. 상태 뱃지 가독성 */
.badge-status {
  font-size: 0.88rem !important;
  padding: 3px 8px !important;
  font-weight: 700 !important;
  border-radius: 3px !important;
  display: inline-block !important;
}

/* 8. 하단 안내문 */
.bottom-notice-box {
  font-size: 0.95rem !important;
  line-height: 1.6 !important;
  padding: 14px 18px !important;
  border-left: 4px solid #ef4444 !important;
  background-color: #ffffff !important;
  margin-top: 16px !important;
  border-radius: 0 4px 4px 0 !important;
}
`;

// 중복 추가 방지
if (!adminCss.includes('전 메뉴 본문 텍스트 & 버튼 가독성 일괄 상향')) {
  adminCss += globalScaleCss;
  fs.writeFileSync(cssPath, adminCss, 'utf8');
  console.log('Successfully added global scaling CSS to admin_lec.css');
} else {
  console.log('Global scaling CSS already present in admin_lec.css');
}

// index.html의 <style> 태그 안에도 확실하게 주입
const indexPath = path.join(__dirname, '..', 'course_site', 'af', 'ad_lec', 'lists', 'sn', 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

if (!indexHtml.includes('전 메뉴 본문 텍스트 & 버튼 가독성 일괄 상향')) {
  indexHtml = indexHtml.replace('</style>', globalScaleCss + '\n  </style>');
  fs.writeFileSync(indexPath, indexHtml, 'utf8');
  console.log('Successfully injected global scaling CSS into index.html');
} else {
  console.log('Global scaling CSS already present in index.html');
}
