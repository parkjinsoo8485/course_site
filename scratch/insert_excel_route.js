const fs = require('fs');
const path = require('path');

const serverJsPath = path.resolve('course_site/server.js');
let content = fs.readFileSync(serverJsPath, 'utf8');

const targetMarker = "app.get(/^\\/af\\/ad_ref\\/template/";
const excelRouteCode = `
// ==================== 학적검증 엑셀 출력 (ad_verify/excel) 라우팅 매핑 ====================
app.get(/^\\/af\\/ad_verify\\/excel/, (req, res) => {
  const verifyList = [
    { id: 1, studentName: '김민준', appGrade: 3, appClass: 2, appNumber: 14, neisGrade: 3, neisClass: 1, neisNumber: 12, reason: '신청 시 반/번호 불일치 (전반 처리됨)', status: '불일치' },
    { id: 2, studentName: '이서연', appGrade: 2, appClass: 4, appNumber: 5, neisGrade: 2, neisClass: 4, neisNumber: 5, reason: '정상', status: '일치' },
    { id: 3, studentName: '박도현', appGrade: 1, appClass: 1, appNumber: 22, neisGrade: null, neisClass: null, neisNumber: null, reason: '나이스 학생명부 미등록 (전입생 확인 필요)', status: '불일치' },
    { id: 4, studentName: '최예은', appGrade: 4, appClass: 3, appNumber: 8, neisGrade: 4, neisClass: 3, neisNumber: 8, reason: '정상', status: '일치' },
    { id: 5, studentName: '정시우', appGrade: 5, appClass: 2, appNumber: 19, neisGrade: 5, neisClass: 5, neisNumber: 11, reason: '신청 학급 오류', status: '불일치' }
  ];

  const rows = verifyList.map((item, idx) => \`
    <tr style="background:\${item.status === '불일치' ? '#fef2f2' : (idx % 2 === 0 ? '#ffffff' : '#f8fafc')};">
      <td style="text-align:center; mso-number-format:'\\\\@';">\${idx + 1}</td>
      <td style="text-align:center; font-weight:bold; color:#1e3a8a;">\${item.studentName}</td>
      <td style="text-align:center;">\${item.appGrade}학년 \${item.appClass}반 \${item.appNumber}번</td>
      <td style="text-align:center; font-weight:bold; color:#047857;">\${item.neisGrade ? item.neisGrade + '학년 ' + item.neisClass + '반 ' + item.neisNumber + '번' : '미등록'}</td>
      <td style="text-align:left; color:\${item.status === '불일치' ? '#b91c1c' : '#334155'}; font-weight:\${item.status === '불일치' ? 'bold' : 'normal'};">\${item.reason}</td>
      <td style="text-align:center; font-weight:bold; color:\${item.status === '불일치' ? '#dc2626' : '#16a34a'};">\${item.status}</td>
    </tr>
  \`).join('');

  const excelHtml = \`
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <style>
    table { border-collapse: collapse; font-family: '맑은 고딕', sans-serif; font-size: 10pt; }
    th { border: 1px solid #cbd5e1; padding: 8px 10px; font-weight: bold; text-align: center; }
    td { border: 1px solid #e2e8f0; padding: 6px 10px; vertical-align: middle; }
    .hero-title { font-size: 17pt; font-weight: bold; text-align: center; color: #1e40af; padding: 14px; background: #eff6ff; border: 2px solid #bfdbfe; }
    .summary-card { background: #f8fafc; border: 1px solid #cbd5e1; font-size: 10pt; padding: 10px 14px; color: #334155; }
  </style>
</head>
<body>
  <table>
    <tr><td colspan="6" class="hero-title">광주풍향초등학교 늘봄학교 수강생 학적검증 리포트</td></tr>
    <tr><td colspan="6" class="summary-card">
      ■ 학교명: 광주풍향초등학교 늘봄학교 &nbsp;|&nbsp; ■ 출력일시: \${new Date().toLocaleString('ko-KR')} &nbsp;|&nbsp;
      ■ 총 대상: 320명 &nbsp;|&nbsp; ■ 일치: 305명 &nbsp;|&nbsp; ■ 불일치(확인필요): 15명
    </td></tr>
    <tr style="height:10px;"><td colspan="6"></td></tr>
    <thead>
      <tr style="background:#e0f2fe; color:#0369a1;">
        <th style="width:50px;">연번</th>
        <th style="width:100px;">학생명</th>
        <th style="width:130px;">신청 시 학적</th>
        <th style="width:130px;">나이스(NEIS) 정규 학적</th>
        <th style="width:250px;">검증 결과 및 사유</th>
        <th style="width:90px;">상태</th>
      </tr>
    </thead>
    <tbody>
      \${rows}
      <tr style="background:#fef3c7; border-top:2px solid #f59e0b; border-bottom:2px solid #f59e0b; font-weight:bold;">
        <td colspan="2" style="text-align:center;">합계 / 검증 총괄</td>
        <td colspan="4" style="text-align:left; color:#92400e;">총 \${verifyList.length}건 검증 중 일치 \${verifyList.filter(v=>v.status==='일치').length}건, 불일치 \${verifyList.filter(v=>v.status==='불일치').length}건</td>
      </tr>
    </tbody>
  </table>
</body>
</html>
  \`.trim();

  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="academic_verification_3267.xls"');
  return res.send(excelHtml);
});

`;

const idx = content.indexOf('app.get(/^\\/af\\/ad_ref\\/template/');
if (idx !== -1) {
  content = content.substring(0, idx) + excelRouteCode + '\n' + content.substring(idx);
  fs.writeFileSync(serverJsPath, content, 'utf8');
  console.log('✅ Successfully inserted top-level ad_verify excel route');
} else {
  console.error('❌ Marker not found');
}
