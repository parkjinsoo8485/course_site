const fs = require('fs');

const serverJsPath = 'course_site/server.js';
let content = fs.readFileSync(serverJsPath, 'utf8');

// 이미 추가되었는지 확인
if (content.includes('ad_sur/excel') || content.includes('api/ad_sur/list')) {
  console.log('✅ 설문관리 서버 엔드포인트가 이미 존재합니다.');
  process.exit(0);
}

const SUR_SEED = JSON.stringify([
  { num: 11977, sur_type: 3, title: '[2026년] 늘봄학교 강사 만족도 조사 설문지(학부모용)', ans_grp_txt: '학부모', que_cnt: 7, ans_cnt: 129, sur_sdate: '2026-06-10', sur_edate: '2026-06-15' },
  { num: 11976, sur_type: 3, title: '[2026년] 늘봄학교 강사 만족도 조사 설문지(학생용)', ans_grp_txt: '학생', que_cnt: 5, ans_cnt: 86, sur_sdate: '2026-06-10', sur_edate: '2026-06-15' },
  { num: 11975, sur_type: 1, title: '[2026년] 늘봄학교 만족도 조사 설문지(학부모용)', ans_grp_txt: '학부모', que_cnt: 5, ans_cnt: 34, sur_sdate: '2026-06-10', sur_edate: '2026-06-15' },
  { num: 11974, sur_type: 1, title: '[2026년] 늘봄학교 만족도 조사 설문지(학생용)', ans_grp_txt: '학생', que_cnt: 5, ans_cnt: 22, sur_sdate: '2026-06-10', sur_edate: '2026-06-15' }
], null, 2);

const serverAddition = `

// ==================== [Sprint 2] 설문관리 (/af/ad_sur) API & 엑셀 출력 ====================

let dbSurveys = ${SUR_SEED};

// 1. 설문관리 JSON API
app.get(['/api/ad_sur/list', '/api/ad_sur/list/'], (req, res) => {
  return res.json({ success: true, surveys: dbSurveys, total: dbSurveys.length });
});

// 2. 설문관리 검색결과 엑셀 출력 (5대 원칙 준수)
app.get([/^\\/af\\/ad_sur\\/excel/, '/af/ad_sur/excel/sn/3267'], (req, res) => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('ko-KR');
  const timeStr = now.toLocaleTimeString('ko-KR');
  const totalAns = dbSurveys.reduce((s, v) => s + v.ans_cnt, 0);

  const rowsHtml = dbSurveys.map((s, idx) => \`
    <tr class="\${idx % 2 === 1 ? 'zebra' : ''}">
      <td class="center">\${idx + 1}</td>
      <td class="center">\${s.sur_type === 1 ? '종합' : '강좌(강사기준)'}</td>
      <td class="left">\${s.title}</td>
      <td class="center">\${s.ans_grp_txt}</td>
      <td class="right num">\${s.que_cnt}</td>
      <td class="right num">\${s.ans_cnt}</td>
      <td class="center">\${s.sur_sdate}</td>
      <td class="center">\${s.sur_edate}</td>
    </tr>
  \`).join('');

  const excelHtml = \`
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
    <x:Name>설문관리</x:Name>
    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
  </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
  <style>
    body { font-family: '맑은 고딕', Malgun Gothic, sans-serif; font-size: 10pt; }
    table { border-collapse: collapse; width: 100%; }
    th { border: 1px solid #93c5fd; padding: 8px 10px; font-weight: bold; text-align: center; background: #dbeafe; color: #1e3a8a; }
    td { border: 1px solid #cbd5e1; padding: 6px 10px; vertical-align: middle; }
    .hero-title { font-size: 17pt; font-weight: bold; color: #1e40af; text-align: center; height: 45px; background: #fff; }
    .meta-bar td { background: #f1f5f9; font-size: 9pt; border: none; padding: 4px 8px; }
    .total-row { background: #fef3c7 !important; font-weight: bold; border-top: 2px solid #f59e0b; border-bottom: 2px solid #f59e0b; }
    .center { text-align: center; }
    .left { text-align: left; }
    .right { text-align: right; }
    .num { mso-number-format: "#,##0"; }
    .zebra { background: #f8fafc; }
  </style>
</head>
<body>
  <table>
    <tr>
      <td colspan="8" class="hero-title">설문관리 명부</td>
    </tr>
    <tr class="meta-bar">
      <td colspan="8" style="text-align:right; font-size:9pt; color:#666;">
        학교명: 광주풍향초등학교 | 출력일시: \${dateStr} \${timeStr} | 총 설문 수: \${dbSurveys.length}건 | 총 참여자: \${totalAns}명
      </td>
    </tr>
    <tr>
      <th width="40">연번</th>
      <th width="100">설문구분</th>
      <th width="320">설문 제목</th>
      <th width="80">참여구분</th>
      <th width="60">문항 수</th>
      <th width="80">참여자 수</th>
      <th width="100">설문 시작일</th>
      <th width="100">설문 종료일</th>
    </tr>
    \${rowsHtml}
    <tr class="total-row">
      <td colspan="4" class="center">총 결산 합계 (Total)</td>
      <td class="right num">\${dbSurveys.reduce((s,v)=>s+v.que_cnt,0)}</td>
      <td class="right num">\${totalAns}</td>
      <td colspan="2" class="center">-</td>
    </tr>
  </table>
</body>
</html>
  \`.trim();

  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="survey_list.xls"');
  return res.send(Buffer.from(excelHtml, 'utf-8'));
});

// 3. 설문결과 엑셀 출력
app.get([/^\\/af\\/ad_sur\\/ans_excel/, '/af/ad_sur/ans_excel/sn/3267'], (req, res) => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('ko-KR');

  const excelHtml = \`
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<style>
  body{font-family:'맑은 고딕',Malgun Gothic,sans-serif;font-size:10pt;}
  table{border-collapse:collapse;width:100%;}
  th{border:1px solid #93c5fd;padding:8px 10px;font-weight:bold;text-align:center;background:#dbeafe;color:#1e3a8a;}
  td{border:1px solid #cbd5e1;padding:6px 10px;vertical-align:middle;}
  .hero-title{font-size:17pt;font-weight:bold;color:#047857;text-align:center;height:45px;}
  .total-row{background:#fef3c7!important;font-weight:bold;}
  .center{text-align:center;} .num{mso-number-format:"#,##0";}
</style></head>
<body>
<table>
  <tr><td colspan="5" class="hero-title">설문 참여 결과 현황</td></tr>
  <tr><td colspan="5" style="text-align:right;font-size:9pt;color:#666;">출력일시: \${dateStr}</td></tr>
  <tr><th>연번</th><th>설문 제목</th><th>참여구분</th><th>총 참여자</th><th>기간</th></tr>
  \${dbSurveys.map((s,i)=>\`<tr><td class="center">\${i+1}</td><td>\${s.title}</td><td class="center">\${s.ans_grp_txt}</td><td class="center num">\${s.ans_cnt}</td><td class="center">\${s.sur_sdate}~\${s.sur_edate}</td></tr>\`).join('')}
  <tr class="total-row"><td colspan="3" class="center">합계</td><td class="center num">\${dbSurveys.reduce((s,v)=>s+v.ans_cnt,0)}</td><td>-</td></tr>
</table>
</body></html>
  \`.trim();

  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="survey_ans_result.xls"');
  return res.send(Buffer.from(excelHtml, 'utf-8'));
});

`;

// 삽입 위치: 강좌 일괄입력 라우트 직전
const insertBefore = '// ==================== 강좌 일괄입력 (ad_lec/input) SPA 모달 페이지 라우팅 ====================';
if (!content.includes(insertBefore)) {
  console.error('❌ 삽입 위치를 찾을 수 없습니다!');
  process.exit(1);
}

content = content.replace(insertBefore, serverAddition + insertBefore);
fs.writeFileSync(serverJsPath, content, 'utf8');
console.log('✅ 설문관리 서버 엔드포인트 추가 완료!');
console.log('  - GET /api/ad_sur/list');
console.log('  - GET /af/ad_sur/excel/sn/3267');
console.log('  - GET /af/ad_sur/ans_excel/sn/3267');

// 검증
const newContent = fs.readFileSync(serverJsPath, 'utf8');
const checks = ['api/ad_sur/list', 'ad_sur/excel', 'ad_sur/ans_excel', 'hero-title', 'total-row', 'meta-bar', 'survey_list.xls'];
const missing = checks.filter(c => !newContent.includes(c));
if (missing.length === 0) {
  console.log('✅ 서버 코드 전수 검증 완료! (missing: [])');
} else {
  console.error('❌ 누락:', missing);
}
