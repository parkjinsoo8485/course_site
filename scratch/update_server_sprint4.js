const fs = require('fs');
const path = require('path');

const serverJsPath = path.resolve('course_site/server.js');
let serverContent = fs.readFileSync(serverJsPath, 'utf8');

const sprint4Code = `
// =========================================================================================
// [Sprint 4] 환경설정 파트 B (운영 규칙 및 연동) 1:1 Live Backend API Store & Endpoints
// =========================================================================================

const sprint4Store = {
  timeConfig: {
    semester: '2026-1',
    appStart: '2026-08-20 09:00',
    appEnd: '2026-08-25 18:00',
    cancelStart: '2026-08-26 09:00',
    cancelEnd: '2026-08-28 18:00',
    waitStart: '2026-08-20 09:00',
    waitEnd: '2026-08-25 18:00',
    maxApplyCount: 3,
    useTimeLimit: 'Y',
    allowModAfterEnd: 'N',
    gradeTimes: {
      1: { useIndiv: 'N', start: '2026-08-20 09:00', end: '2026-08-25 18:00' },
      2: { useIndiv: 'N', start: '2026-08-20 09:00', end: '2026-08-25 18:00' },
      3: { useIndiv: 'N', start: '2026-08-20 09:00', end: '2026-08-25 18:00' },
      4: { useIndiv: 'N', start: '2026-08-20 09:00', end: '2026-08-25 18:00' },
      5: { useIndiv: 'N', start: '2026-08-20 09:00', end: '2026-08-25 18:00' },
      6: { useIndiv: 'N', start: '2026-08-20 09:00', end: '2026-08-25 18:00' }
    }
  },
  periods: [
    { id: 1, name: '1교시', startTime: '13:00', endTime: '13:40', durationMinutes: 40, isUsed: 'Y', memo: '방과후 1차시' },
    { id: 2, name: '2교시', startTime: '13:50', endTime: '14:30', durationMinutes: 40, isUsed: 'Y', memo: '방과후 2차시' },
    { id: 3, name: '3교시', startTime: '14:40', endTime: '15:20', durationMinutes: 40, isUsed: 'Y', memo: '방과후 3차시' },
    { id: 4, name: '4교시', startTime: '15:30', endTime: '16:10', durationMinutes: 40, isUsed: 'Y', memo: '방과후 4차시' },
    { id: 5, name: '5교시', startTime: '16:20', endTime: '17:00', durationMinutes: 40, isUsed: 'Y', memo: '늘봄/돌봄 통합교시' }
  ],
  afDivs: [
    { id: 1, code: '01', name: '방과후학교 (특기적성)', isUsed: 'Y', memo: '일반 유료/지원금 방과후 강좌' },
    { id: 2, code: '02', name: '늘봄학교 (맞춤형)', isUsed: 'Y', memo: '1~2학년 무상 맞춤형 프로그램' },
    { id: 3, code: '03', name: '초등돌봄교실 (오후돌봄)', isUsed: 'Y', memo: '정규 돌봄교실' },
    { id: 4, code: '04', name: '토요방과후 프로그램', isUsed: 'N', memo: '토요 특별 개설 강좌' }
  ],
  appLiGrps: [
    { id: 1, code: 'GRP_01', name: '컴퓨터/코딩 IT 중복제한', maxAllowed: 1, courseIds: [101, 102], isUsed: 'Y', memo: 'IT계열 강좌 중 택1' },
    { id: 2, code: 'GRP_02', name: '예체능 실기 중복제한', maxAllowed: 2, courseIds: [103, 104, 105], isUsed: 'Y', memo: '예체능 실기 2개 한도' }
  ],
  verifyStats: { totalStudents: 450, totalApplicants: 320, matched: 305, mismatched: 15 },
  verifyList: [
    { id: 1, studentName: '김민준', appGrade: 3, appClass: 2, appNumber: 14, neisGrade: 3, neisClass: 1, neisNumber: 12, reason: '신청 시 반/번호 불일치 (전반 처리됨)', status: '불일치' },
    { id: 2, studentName: '이서연', appGrade: 2, appClass: 4, appNumber: 5, neisGrade: 2, neisClass: 4, neisNumber: 5, reason: '정상', status: '일치' },
    { id: 3, studentName: '박도현', appGrade: 1, appClass: 1, appNumber: 22, neisGrade: null, neisClass: null, neisNumber: null, reason: '나이스 학생명부 미등록 (전입생 확인 필요)', status: '불일치' },
    { id: 4, studentName: '최예은', appGrade: 4, appClass: 3, appNumber: 8, neisGrade: 4, neisClass: 3, neisNumber: 8, reason: '정상', status: '일치' },
    { id: 5, studentName: '정시우', appGrade: 5, appClass: 2, appNumber: 19, neisGrade: 5, neisClass: 5, neisNumber: 11, reason: '신청 학급 오류', status: '불일치' }
  ],
  neisMappings: [
    { id: 101, courseCode: 'C_101', courseName: '창의로봇(초급)', teacherName: '김로봇', neisCode: 'NEIS_2026_01', neisName: '창의과학(로봇)' },
    { id: 102, courseCode: 'C_102', courseName: '신나는 미술놀이', teacherName: '이미술', neisCode: 'NEIS_2026_02', neisName: '조형미술' },
    { id: 103, courseCode: 'C_103', courseName: '음악줄넘기 & 성장체조', teacherName: '박체육', neisCode: 'NEIS_2026_03', neisName: '체육활동(줄넘기)' },
    { id: 104, courseCode: 'C_104', courseName: '원어민 기초영어', teacherName: 'John Smith', neisCode: 'NEIS_2026_04', neisName: '실용영어회화' },
    { id: 105, courseCode: 'C_105', courseName: '주산암산 수리셈', teacherName: '정수학', neisCode: 'NEIS_2026_05', neisName: '기초수학탐구' }
  ],
  edufineCfg: {
    fiscalYear: '2026',
    orgCode: 'G100003267',
    incomeCode: 'INC_AFTER_SCHOOL_01',
    bankCode: '004',
    termRound: '2026학년도 1학기 1회차 정기수납',
    memo: '광주풍향초등학교 늘봄학교 스쿨뱅킹 수납 연계'
  },
  messages: {
    applyTop: '2026학년도 1학기 늘봄·방과후학교 수강신청 안내입니다. 신청 기간과 시간을 확인하신 후 정확히 신청해 주시기 바랍니다.',
    refundGuide: '수강 시작 전 전액 환불 가능하며, 수강 시작 후에는 남은 차시 비율(일할 계산)에 따라 안전하게 환불 처리됩니다.',
    absGuide: '수업 결석 및 안심귀가 변경 시 수업 시작 1시간 전까지 본 시스템을 통해 신청서를 제출해 주시기 바랍니다.',
    mobilePush: '[광주풍향초 늘봄학교] 학생의 방과후·늘봄 수강 관련 주요 안내사항을 전달해 드립니다.'
  },
  managerInfo: {
    deptName: '방과후·늘봄지원센터',
    managerName: '박진수',
    telOffice: '062-609-1100',
    telHp: '010-2494-1479',
    email: 'parkjinsoo8485@gmail.com',
    workHours: '평일 09:00 ~ 17:00 (점심시간 12:00~13:00 제외)',
    memo: '늘봄학교 운영 및 수강신청 관련 문의사항은 위 번호로 연락주시면 친절히 안내해 드리겠습니다.'
  }
};

// 1. 신청기간 API
app.get('/api/ad_time/data/sn/:sn', (req, res) => {
  res.json({ success: true, data: sprint4Store.timeConfig });
});
app.post(['/api/ad_time/save', '/af/ad_time/lists/sn/:sn'], (req, res) => {
  Object.assign(sprint4Store.timeConfig, req.body);
  res.json({ success: true, message: '신청기간 설정이 저장되었습니다.', data: sprint4Store.timeConfig });
});

// 2. 강의시간(교시) API
app.get('/api/ad_cfg/period/data/sn/:sn', (req, res) => {
  res.json({ success: true, data: sprint4Store.periods });
});
app.post(['/api/ad_cfg/period/save', '/af/ad_cfg/period/sn/:sn'], (req, res) => {
  const b = req.body;
  if (b.id) {
    const idx = sprint4Store.periods.findIndex(p => p.id === parseInt(b.id, 10));
    if (idx !== -1) sprint4Store.periods[idx] = { ...sprint4Store.periods[idx], ...b };
  } else {
    const newId = sprint4Store.periods.length ? Math.max(...sprint4Store.periods.map(p => p.id)) + 1 : 1;
    sprint4Store.periods.push({ id: newId, ...b });
  }
  res.json({ success: true, message: '강의시간이 저장되었습니다.', data: sprint4Store.periods });
});
app.post('/api/ad_cfg/period/delete', (req, res) => {
  sprint4Store.periods = sprint4Store.periods.filter(p => p.id !== parseInt(req.body.id, 10));
  res.json({ success: true, message: '강의시간이 삭제되었습니다.' });
});
app.post('/api/ad_cfg/period/reorder', (req, res) => {
  const { ids } = req.body;
  if (Array.isArray(ids)) {
    sprint4Store.periods.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
  }
  res.json({ success: true, message: '순서가 저장되었습니다.' });
});
app.post('/api/ad_cfg/period/batch', (req, res) => {
  sprint4Store.periods = [
    { id: 1, name: '1교시', startTime: '13:00', endTime: '13:40', durationMinutes: 40, isUsed: 'Y', memo: '표준 1차시' },
    { id: 2, name: '2교시', startTime: '13:50', endTime: '14:30', durationMinutes: 40, isUsed: 'Y', memo: '표준 2차시' },
    { id: 3, name: '3교시', startTime: '14:40', endTime: '15:20', durationMinutes: 40, isUsed: 'Y', memo: '표준 3차시' },
    { id: 4, name: '4교시', startTime: '15:30', endTime: '16:10', durationMinutes: 40, isUsed: 'Y', memo: '표준 4차시' },
    { id: 5, name: '5교시', startTime: '16:20', endTime: '17:00', durationMinutes: 40, isUsed: 'Y', memo: '표준 5차시' }
  ];
  res.json({ success: true, message: '표준 교시가 생성되었습니다.', data: sprint4Store.periods });
});

// 3. 강좌구분 API
app.get('/api/ad_cfg/afdiv/data/sn/:sn', (req, res) => {
  res.json({ success: true, data: sprint4Store.afDivs });
});
app.post(['/api/ad_cfg/afdiv/save', '/af/ad_cfg/afDiv/sn/:sn'], (req, res) => {
  const b = req.body;
  if (b.id) {
    const idx = sprint4Store.afDivs.findIndex(d => d.id === parseInt(b.id, 10));
    if (idx !== -1) sprint4Store.afDivs[idx] = { ...sprint4Store.afDivs[idx], ...b };
  } else {
    const newId = sprint4Store.afDivs.length ? Math.max(...sprint4Store.afDivs.map(d => d.id)) + 1 : 1;
    sprint4Store.afDivs.push({ id: newId, ...b });
  }
  res.json({ success: true, message: '강좌구분이 저장되었습니다.', data: sprint4Store.afDivs });
});
app.post('/api/ad_cfg/afdiv/delete', (req, res) => {
  sprint4Store.afDivs = sprint4Store.afDivs.filter(d => d.id !== parseInt(req.body.id, 10));
  res.json({ success: true, message: '강좌구분이 삭제되었습니다.' });
});

// 4. 중복제한그룹 API
app.get('/api/ad_cfg/appligrp/data/sn/:sn', (req, res) => {
  res.json({ success: true, data: sprint4Store.appLiGrps });
});
app.post(['/api/ad_cfg/appligrp/save', '/af/ad_cfg/appLiGrp/sn/:sn'], (req, res) => {
  const b = req.body;
  if (b.id) {
    const idx = sprint4Store.appLiGrps.findIndex(g => g.id === parseInt(b.id, 10));
    if (idx !== -1) sprint4Store.appLiGrps[idx] = { ...sprint4Store.appLiGrps[idx], ...b };
  } else {
    const newId = sprint4Store.appLiGrps.length ? Math.max(...sprint4Store.appLiGrps.map(g => g.id)) + 1 : 1;
    sprint4Store.appLiGrps.push({ id: newId, courseIds: [], ...b });
  }
  res.json({ success: true, message: '중복제한그룹이 저장되었습니다.', data: sprint4Store.appLiGrps });
});
app.post('/api/ad_cfg/appligrp/delete', (req, res) => {
  sprint4Store.appLiGrps = sprint4Store.appLiGrps.filter(g => g.id !== parseInt(req.body.id, 10));
  res.json({ success: true, message: '중복제한그룹이 삭제되었습니다.' });
});
app.post('/api/ad_cfg/appligrp/assign_courses', (req, res) => {
  const { grpId, courseIds } = req.body;
  const grp = sprint4Store.appLiGrps.find(g => g.id === parseInt(grpId, 10));
  if (grp) grp.courseIds = courseIds || [];
  res.json({ success: true, message: '소속 강좌 매핑이 저장되었습니다.', data: grp });
});

// 5. 학적검증 API & 엑셀 내보내기
app.get('/api/ad_verify/data/sn/:sn', (req, res) => {
  res.json({ success: true, stats: sprint4Store.verifyStats, data: sprint4Store.verifyList });
});
app.post('/api/ad_verify/run', (req, res) => {
  res.json({ success: true, checkedCount: 320, mismatchedCount: sprint4Store.verifyList.filter(v => v.status === '불일치').length, message: '학적검증이 완료되었습니다.' });
});
app.post('/api/ad_verify/sync', (req, res) => {
  const { ids } = req.body;
  sprint4Store.verifyList.forEach(v => {
    if (ids && ids.includes(v.id)) {
      if (v.neisGrade) {
        v.appGrade = v.neisGrade;
        v.appClass = v.neisClass;
        v.appNumber = v.neisNumber;
      }
      v.status = '일치';
      v.reason = '나이스 정규 학적으로 동기화 완료';
    }
  });
  res.json({ success: true, message: '선택한 학생의 학적이 동기화되었습니다.' });
});

// 학적검증 프리미엄 엑셀 내보내기 (Excel 1:1 Mapping 5대 원칙 준수)
app.get(['/af/ad_verify/excel', '/af/ad_verify/excel/sn/:sn'], (req, res) => {
  const rows = sprint4Store.verifyList.map((item, idx) => {
    const isEven = idx % 2 === 0;
    const isMismatch = item.status === '불일치';
    return \`
      <tr style="background:\${isMismatch ? '#fef2f2' : (isEven ? '#ffffff' : '#f8fafc')};">
        <td style="text-align:center; mso-number-format:'\\\\@';">\${idx + 1}</td>
        <td style="text-align:center; font-weight:bold; color:#1e3a8a;">\${item.studentName}</td>
        <td style="text-align:center;">\${item.appGrade}학년 \${item.appClass}반 \${item.appNumber}번</td>
        <td style="text-align:center; font-weight:bold; color:#047857;">\${item.neisGrade ? item.neisGrade + '학년 ' + item.neisClass + '반 ' + item.neisNumber + '번' : '미등록'}</td>
        <td style="text-align:left; color:\${isMismatch ? '#b91c1c' : '#334155'}; font-weight:\${isMismatch ? 'bold' : 'normal'};">\${item.reason}</td>
        <td style="text-align:center; font-weight:bold; color:\${isMismatch ? '#dc2626' : '#16a34a'};">\${item.status}</td>
      </tr>
    \`;
  }).join('');

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
      ■ 총 대상: \${sprint4Store.verifyStats.totalApplicants}명 &nbsp;|&nbsp; ■ 일치: \${sprint4Store.verifyStats.matched}명 &nbsp;|&nbsp; ■ 불일치(확인필요): \${sprint4Store.verifyStats.mismatched}명
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
        <td colspan="4" style="text-align:left; color:#92400e;">총 \${sprint4Store.verifyList.length}건 검증 중 일치 \${sprint4Store.verifyList.filter(v=>v.status==='일치').length}건, 불일치 \${sprint4Store.verifyList.filter(v=>v.status==='불일치').length}건</td>
      </tr>
    </tbody>
  </table>
</body>
</html>
  \`;

  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="academic_verification_3267.xls"');
  return res.send(excelHtml);
});

// 6. 나이스/에듀파인 설정 API
app.get('/api/ad_neis_edufine/data/sn/:sn', (req, res) => {
  res.json({ success: true, data: { neisList: sprint4Store.neisMappings, edufineCfg: sprint4Store.edufineCfg } });
});
app.post('/api/ad_neis_edufine/save_mapping', (req, res) => {
  const { mappings } = req.body;
  if (Array.isArray(mappings)) {
    mappings.forEach(m => {
      const item = sprint4Store.neisMappings.find(n => n.id === m.id);
      if (item) {
        item.neisCode = m.neisCode;
        item.neisName = m.neisName;
      }
    });
  }
  res.json({ success: true, message: '나이스 과목 매핑이 저장되었습니다.', data: sprint4Store.neisMappings });
});
app.post('/api/ad_neis_edufine/save_edufine', (req, res) => {
  Object.assign(sprint4Store.edufineCfg, req.body);
  res.json({ success: true, message: '에듀파인 회계 연계 설정이 저장되었습니다.', data: sprint4Store.edufineCfg });
});

// 7. 안내글설정, 데이터 초기화, 담당자정보 API
app.get('/api/ad_cfg/message/data/sn/:sn', (req, res) => {
  res.json({ success: true, data: sprint4Store.messages });
});
app.post(['/api/ad_cfg/message/save', '/af/ad_cfg/message/sn/:sn'], (req, res) => {
  Object.assign(sprint4Store.messages, req.body);
  res.json({ success: true, message: '안내글이 저장되었습니다.', data: sprint4Store.messages });
});
app.post('/api/ad_cfg/clear/execute', (req, res) => {
  const { targets, confirmText } = req.body;
  if (confirmText !== '광주풍향초등학교 늘봄학교 초기화') {
    return res.status(400).json({ success: false, message: '확인 문구가 일치하지 않습니다.' });
  }
  res.json({ success: true, message: \`선택된 \${(targets || []).length}개 항목의 데이터가 안전하게 초기화되었습니다.\` });
});
app.get('/api/ad_info/data/sn/:sn', (req, res) => {
  res.json({ success: true, data: sprint4Store.managerInfo });
});
app.post(['/api/ad_info/save', '/af/ad_info/modify/sn/:sn'], (req, res) => {
  Object.assign(sprint4Store.managerInfo, req.body);
  res.json({ success: true, message: '담당자 정보가 저장되었습니다.', data: sprint4Store.managerInfo });
});
`;

// server.js의 app.use(Page Routing Middleware) 바로 전에 sprint4Code 삽입
const insertMarker = '// dbdbschool Page Routing Middleware:';
const insertIdx = serverContent.indexOf(insertMarker);

if (insertIdx !== -1) {
  serverContent = serverContent.substring(0, insertIdx) + sprint4Code + '\n\n' + serverContent.substring(insertIdx);
  fs.writeFileSync(serverJsPath, serverContent, 'utf8');
  console.log('✅ Successfully injected Sprint 4 APIs into server.js');
} else {
  console.error('❌ Could not find insertion marker in server.js');
}
