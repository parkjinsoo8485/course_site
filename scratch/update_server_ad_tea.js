const fs = require('fs');

const serverJsPath = 'course_site/server.js';
let content = fs.readFileSync(serverJsPath, 'utf8');

const seedTeachers = JSON.parse(fs.readFileSync('scratch/teachers_seed.json', 'utf8'));

const serverAddition = `
// ==================== [Sprint 2] 강사관리 (/af/ad_tea) 엑셀 5대 원칙 프리미엄 출력 및 API ====================

let dbTeachers = ${JSON.stringify(seedTeachers, null, 2)};

// 1. 강사 검색결과 엑셀 출력 (5대 원칙 준수)
app.get([/^\\/af\\/ad_tea\\/excel/, /^\\/af\\/ad_tea\\/listse/], (req, res) => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const timeStr = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

  const totalCount = dbTeachers.length;
  const usedCount = dbTeachers.filter(t => t.status === '1').length;
  const waitCount = totalCount - usedCount;

  const rowsHtml = dbTeachers.map((t, idx) => \`
    <tr class="\${idx % 2 === 1 ? 'cell-zebra' : ''}">
      <td class="cell-center">\${idx + 1}</td>
      <td class="cell-center" style="font-weight:bold;">\${t.id}</td>
      <td class="cell-center">\${t.name}</td>
      <td class="cell-center">\${t.hp || '-'}</td>
      <td class="cell-center">\${t.lastLogin || '-'}</td>
      <td class="cell-center">\${t.tempPass || '-'}</td>
      <td class="cell-center">\${t.selfAuth || '-'}</td>
      <td class="cell-center">\${t.twoFactor || '-'}</td>
      <td class="cell-center">\${t.agreeDate || '-'}</td>
      <td class="cell-center"><span class="\${t.status === '1' ? 'badge-used' : 'badge-wait'}">\${t.status === '1' ? '사용' : '대기'}</span></td>
    </tr>
  \`).join('');

  const excelHtml = \`
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <!--[if gte mso 9]>
  <xml>
    <x:ExcelWorkbook>
      <x:ExcelWorksheets>
        <x:ExcelWorksheet>
          <x:Name>강사명부</x:Name>
          <x:WorksheetOptions>
            <x:DisplayGridlines/>
          </x:WorksheetOptions>
        </x:ExcelWorksheet>
      </x:ExcelWorksheets>
    </x:ExcelWorkbook>
  </xml>
  <![endif]-->
  <style>
    table { border-collapse: collapse; font-family: '맑은 고딕', Malgun Gothic, sans-serif; font-size: 10pt; }
    th { border: 1px solid #cbd5e1; padding: 8px 10px; font-weight: bold; text-align: center; }
    td { border: 1px solid #cbd5e1; padding: 6px 10px; vertical-align: middle; }
    .hero-title { font-size: 17pt; font-weight: bold; color: #1e40af; text-align: center; height: 45px; vertical-align: middle; background: #ffffff; }
    .meta-bar { background: #f8fafc; font-size: 10pt; color: #475569; padding: 6px 10px; border-bottom: 2px solid #3b82f6; }
    .header-basic { background: #f1f5f9; color: #1e293b; font-weight: bold; }
    .header-status { background: #e0f2fe; color: #0369a1; font-weight: bold; }
    .cell-center { text-align: center; }
    .cell-left { text-align: left; }
    .cell-zebra { background: #f8fafc; }
    .badge-used { color: #1e40af; font-weight: bold; }
    .badge-wait { color: #d97706; font-weight: bold; }
    .total-row { background: #fef3c7; font-weight: bold; border-top: 2px solid #f59e0b; border-bottom: 2px solid #f59e0b; text-align: center; }
  </style>
</head>
<body>
  <table>
    <!-- 원칙 1: 대제목 타이틀 (Hero Title) -->
    <tr>
      <td colspan="10" class="hero-title">광주풍향초등학교 늘봄학교 강사 명부</td>
    </tr>
    <!-- 원칙 2: 메타 정보 배너 (Metadata Summary Bar) -->
    <tr>
      <td colspan="10" class="meta-bar">
        ■ 출력일시: \${dateStr} \${timeStr} | ■ 관리기관: 광주풍향초등학교 늘봄학교 | ■ 총 등록 강사: \${totalCount}명 (사용: \${usedCount}명, 대기: \${waitCount}명)
      </td>
    </tr>
    <!-- 원칙 3: 헤더 영역별 파스텔 컬러 블록 -->
    <tr>
      <th style="width:50px;" class="header-basic">연번</th>
      <th style="width:100px;" class="header-basic">아이디</th>
      <th style="width:90px;" class="header-basic">이름</th>
      <th style="width:130px;" class="header-basic">휴대폰</th>
      <th style="width:160px;" class="header-basic">마지막 로그인</th>
      <th style="width:70px;" class="header-basic">임시비번</th>
      <th style="width:70px;" class="header-basic">본인인증</th>
      <th style="width:70px;" class="header-basic">2단계인증</th>
      <th style="width:100px;" class="header-basic">약관동의</th>
      <th style="width:80px;" class="header-status">상태</th>
    </tr>
    <!-- 원칙 4: 데이터 행 지브라 교차 및 포맷 -->
    \${rowsHtml}
    <!-- 원칙 5: 하단 총 결산 합계 행 (Total Summary Row) -->
    <tr class="total-row">
      <td colspan="4" style="text-align:center; padding:8px;">총 등록 강사 합계 (Total)</td>
      <td class="cell-center">총 \${totalCount}명</td>
      <td colspan="4" class="cell-center">정상 사용: \${usedCount}명 / 승인 대기: \${waitCount}명</td>
      <td class="cell-center">\${totalCount}명</td>
    </tr>
  </table>
</body>
</html>
  \`.trim();

  const filename = \`강사명부_\${new Date().toISOString().split('T')[0]}.xls\`;
  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', \`attachment; filename="\${encodeURIComponent(filename)}"; filename*=UTF-8''\${encodeURIComponent(filename)}\`);
  return res.send(Buffer.from(excelHtml, 'utf-8'));
});

// 2. 강사 시간표 엑셀 출력 (5대 원칙 준수)
app.get([/^\\/af\\/ad_tea\\/schedule_excel/, /^\\/af\\/ad_tea\\/schedule/], (req, res) => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const timeStr = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

  const sampleSchedules = [
    { seq: 1, teaName: '강태연', course: '창의로봇(초급)', div: '방과후', room: '컴퓨터1실', time: '월/수 13:00~14:30', grade: '1~3학년', cap: 20 },
    { seq: 2, teaName: '김경아', course: '신나는 미술놀이', div: '맞춤형', room: '미술실', time: '화/목 14:00~15:30', grade: '1~2학년', cap: 15 },
    { seq: 3, teaName: '김언주', course: '오후 돌봄교실 A', div: '돌봄', room: '돌봄1실', time: '월~금 13:00~17:00', grade: '1학년', cap: 25 },
    { seq: 4, teaName: '김윤정', course: '생명과학 탐구', div: '방과후', room: '과학실', time: '수/금 15:00~16:30', grade: '3~6학년', cap: 20 },
    { seq: 5, teaName: '박경도', course: 'K-POP 댄스교실', div: '맞춤형', room: '무용실', time: '화/목 15:00~16:00', grade: '1~4학년', cap: 25 },
    { seq: 6, teaName: '박은화', course: '주포만 바둑교실', div: '방과후', room: '2학년1반', time: '월/수 15:00~16:30', grade: '2~6학년', cap: 15 },
    { seq: 7, teaName: '박지숙', course: '원어민 영어회화', div: '방과후', room: '영어체험실', time: '화/금 13:30~14:30', grade: '1~4학년', cap: 18 }
  ];

  const rowsHtml = sampleSchedules.map((s, idx) => \`
    <tr class="\${idx % 2 === 1 ? 'cell-zebra' : ''}">
      <td class="cell-center">\${s.seq}</td>
      <td class="cell-center" style="font-weight:bold;">\${s.teaName}</td>
      <td class="cell-left">\${s.course}</td>
      <td class="cell-center">\${s.div}</td>
      <td class="cell-center">\${s.room}</td>
      <td class="cell-center" style="font-weight:bold; color:#0284c7;">\${s.time}</td>
      <td class="cell-center">\${s.grade}</td>
      <td class="cell-center">\${s.cap}명</td>
    </tr>
  \`).join('');

  const excelHtml = \`
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <style>
    table { border-collapse: collapse; font-family: '맑은 고딕', Malgun Gothic, sans-serif; font-size: 10pt; }
    th { border: 1px solid #cbd5e1; padding: 8px 10px; font-weight: bold; text-align: center; }
    td { border: 1px solid #cbd5e1; padding: 6px 10px; vertical-align: middle; }
    .hero-title { font-size: 17pt; font-weight: bold; color: #1e40af; text-align: center; height: 45px; vertical-align: middle; background: #ffffff; }
    .meta-bar { background: #f8fafc; font-size: 10pt; color: #475569; padding: 6px 10px; border-bottom: 2px solid #3b82f6; }
    .header-basic { background: #f1f5f9; color: #1e293b; font-weight: bold; }
    .header-time { background: #e0f2fe; color: #0369a1; font-weight: bold; }
    .cell-center { text-align: center; }
    .cell-left { text-align: left; }
    .cell-zebra { background: #f8fafc; }
    .total-row { background: #fef3c7; font-weight: bold; border-top: 2px solid #f59e0b; border-bottom: 2px solid #f59e0b; text-align: center; }
  </style>
</head>
<body>
  <table>
    <tr><td colspan="8" class="hero-title">광주풍향초등학교 늘봄학교 강사별 강의 시간표</td></tr>
    <tr><td colspan="8" class="meta-bar">■ 기준월: 26년 10월 | ■ 출력일시: \${dateStr} \${timeStr} | ■ 관리기관: 광주풍향초등학교 늘봄학교</td></tr>
    <tr>
      <th style="width:45px;" class="header-basic">연번</th>
      <th style="width:90px;" class="header-basic">강사명</th>
      <th style="width:180px;" class="header-basic">강좌명</th>
      <th style="width:80px;" class="header-basic">강좌구분</th>
      <th style="width:120px;" class="header-basic">강의실</th>
      <th style="width:160px;" class="header-time">강의시간</th>
      <th style="width:90px;" class="header-basic">대상학년</th>
      <th style="width:70px;" class="header-basic">정원</th>
    </tr>
    \${rowsHtml}
    <tr class="total-row">
      <td colspan="3" style="text-align:center; padding:8px;">총 개설 강좌 합계 (Total)</td>
      <td class="cell-center">총 7개 강좌</td>
      <td colspan="3" class="cell-center">전체 정원 집계</td>
      <td class="cell-center">138명</td>
    </tr>
  </table>
</body>
</html>
  \`.trim();

  const filename = \`강사시간표_\${new Date().toISOString().split('T')[0]}.xls\`;
  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', \`attachment; filename="\${encodeURIComponent(filename)}"; filename*=UTF-8''\${encodeURIComponent(filename)}\`);
  return res.send(Buffer.from(excelHtml, 'utf-8'));
});

// 3. 강사 일괄입력 샘플 서식 다운로드 (/af/ad_tea/sample_excel 및 S3 호환 URL)
app.get(['/af/ad_tea/sample_excel', '/doc/after/sample/afterTeaInput.xlsx'], (req, res) => {
  const sampleCsv = '\\uFEFF' + [
    '아이디,이름,비밀번호,문자발송권한,휴대폰',
    'tea_sample1,김철수,1234,Y,010-1234-5678',
    'tea_sample2,이영희,1234,N,010-9876-5432',
    'tea_sample3,박민수,1234,Y,010-5555-7777'
  ].join('\\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="afterTeaInput.csv"');
  return res.send(sampleCsv);
});

// 4. 강사 JSON API 엔드포인트
app.get('/api/ad_tea/list', (req, res) => {
  const { st, sw } = req.query;
  let result = [...dbTeachers];
  if (sw) {
    if (st === 'mem_id') {
      result = result.filter(t => t.id && t.id.includes(sw));
    } else {
      result = result.filter(t => t.name && t.name.includes(sw));
    }
  }
  return res.json({ success: true, count: result.length, teachers: result });
});

app.post('/api/ad_tea/save', (req, res) => {
  const tea = req.body;
  if (!tea || !tea.name) {
    return res.status(400).json({ success: false, message: '이름을 입력하세요.' });
  }
  const idx = dbTeachers.findIndex(t => String(t.num) === String(tea.num));
  if (idx !== -1) {
    dbTeachers[idx] = { ...dbTeachers[idx], ...tea };
  } else {
    tea.num = tea.num || String(Date.now());
    tea.seq = dbTeachers.length + 1;
    dbTeachers.unshift(tea);
  }
  return res.json({ success: true, teacher: tea });
});

app.post('/api/ad_tea/status', (req, res) => {
  const { num, nums, status } = req.body;
  const targetNums = nums || (num ? [num] : []);
  dbTeachers.forEach(t => {
    if (targetNums.includes(String(t.num))) {
      t.status = String(status);
    }
  });
  return res.json({ success: true, updated: targetNums.length });
});

app.post('/api/ad_tea/delete', (req, res) => {
  const { num, nums } = req.body;
  const targetNums = nums || (num ? [num] : []);
  dbTeachers = dbTeachers.filter(t => !targetNums.includes(String(t.num)));
  return res.json({ success: true, deleted: targetNums.length });
});

app.post('/api/ad_tea/chk_id', (req, res) => {
  const { chk_mem_id } = req.body;
  const exists = dbTeachers.some(t => t.id === chk_mem_id);
  return res.json({ success: !exists, exists });
});
`;

if (!content.includes('/api/ad_tea/list')) {
  const middlewareMarker = '// dbdbschool Page Routing Middleware: 관리자 사이드바 전체 경로를 통일된 SPA 마스터 파일로 서빙';
  if (content.includes(middlewareMarker)) {
    content = content.replace(middlewareMarker, serverAddition + '\n' + middlewareMarker);
    fs.writeFileSync(serverJsPath, content, 'utf8');
    console.log('Successfully added ad_tea routes and APIs to server.js!');
  } else {
    console.error('Could not find middlewareMarker in server.js!');
  }
} else {
  console.log('ad_tea routes already present in server.js!');
}
