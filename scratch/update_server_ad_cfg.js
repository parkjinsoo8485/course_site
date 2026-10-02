const fs = require('fs');

const serverJsPath = 'course_site/server.js';
let content = fs.readFileSync(serverJsPath, 'utf8');

if (content.includes('api/ad_cfg/save')) {
  console.log('이미 ad_cfg 라우트가 존재합니다.');
  process.exit(0);
}

const cfgRoutes = `
// ==================== [Sprint 3] 환경설정 파트 A (/af/ad_cfg) API 및 저장 엔드포인트 ====================
let dbdbschoolConfigStore = {
  schoolName: "광주풍향초등학교",
  servicePeriod: "2025-05-09 ~ 2027-02-28",
  titleNum: "1", // 1: 늘봄학교
  adminList: ["박진수"],
  div1_sel: "26년 8월",
  div2_sel: "",
  absSinUse: "1", // 1: 사용
  absEarlyUse: "0", // 0: 가능
  rschMin: "10",
  absMin: "10",
  // 강사권한
  allowViWaitLec: "Y",
  allowWrLec: "Y",
  allowViAllLec: "N",
  allowWrSin: "Y",
  allowWrSin1: "N",
  allowWrSin2: "N",
  allowDelSin: "Y",
  allowMoveSin: "Y",
  allowPayModify: "Y",
  allowHpView: "Y",
  allowHpEdit: "Y",
  // 출석부옵션
  attApp1: "",
  attApp2: "",
  attApp3: "",
  attApp4: "",
  signData1: "",
  signData2: "",
  signData3: "",
  signData4: "",
  // 문자설정
  smsUse: "N",
  smsBoTxt: "광주풍향초등학교",
  smsDefNum: "",
  smsAmHour: "09",
  smsPmHour: "18",
  smsAlTeaAt: "N",
  smsAlTeaSi: "N"
};

// 설정 데이터 조회 API
app.get('/api/ad_cfg/data/sn/:sn', (req, res) => {
  return res.json({
    success: true,
    data: dbdbschoolConfigStore
  });
});

// 기본설정 저장 API
app.post(['/api/ad_cfg/save/main', '/af/ad_cfg/main/sn/:sn'], (req, res) => {
  const b = req.body;
  if (b.titleNum !== undefined) dbdbschoolConfigStore.titleNum = b.titleNum;
  if (b.addAdminList !== undefined) dbdbschoolConfigStore.adminList = b.addAdminList.split(',').filter(Boolean);
  if (b.div1_sel !== undefined) dbdbschoolConfigStore.div1_sel = b.div1_sel;
  if (b.div2_sel !== undefined) dbdbschoolConfigStore.div2_sel = b.div2_sel;
  if (b.abs_sin_use !== undefined) dbdbschoolConfigStore.absSinUse = b.abs_sin_use;
  if (b.rsch_min !== undefined) dbdbschoolConfigStore.rschMin = b.rsch_min;
  if (b.abs_min !== undefined) dbdbschoolConfigStore.absMin = b.abs_min;

  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.json({ success: true, tabName: '기본설정', message: '기본설정이 성공적으로 저장되었습니다.' });
  }
  return res.redirect('/af/ad_cfg/main/sn/3267');
});

// 강사권한 저장 API
app.post(['/api/ad_cfg/save/tea', '/af/ad_cfg/tea/sn/:sn'], (req, res) => {
  const b = req.body;
  if (b.allowViWaitLec !== undefined) dbdbschoolConfigStore.allowViWaitLec = b.allowViWaitLec;
  if (b.allowWrLec !== undefined) dbdbschoolConfigStore.allowWrLec = b.allowWrLec;
  if (b.allowViAllLec !== undefined) dbdbschoolConfigStore.allowViAllLec = b.allowViAllLec;
  if (b.allowWrSin !== undefined) dbdbschoolConfigStore.allowWrSin = b.allowWrSin;
  if (b.allowWrSin1 !== undefined) dbdbschoolConfigStore.allowWrSin1 = b.allowWrSin1;
  if (b.allowWrSin2 !== undefined) dbdbschoolConfigStore.allowWrSin2 = b.allowWrSin2;
  if (b.allowDelSin !== undefined) dbdbschoolConfigStore.allowDelSin = b.allowDelSin;
  if (b.allowMoveSin !== undefined) dbdbschoolConfigStore.allowMoveSin = b.allowMoveSin;
  if (b.allowPayModify !== undefined) dbdbschoolConfigStore.allowPayModify = b.allowPayModify;
  if (b.allowHpView !== undefined) dbdbschoolConfigStore.allowHpView = b.allowHpView;
  if (b.allowHpEdit !== undefined) dbdbschoolConfigStore.allowHpEdit = b.allowHpEdit;

  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.json({ success: true, tabName: '강사권한', message: '강사권한 설정이 성공적으로 저장되었습니다.' });
  }
  return res.redirect('/af/ad_cfg/tea/sn/3267');
});

// 출석부옵션 저장 API
app.post(['/api/ad_cfg/save/att', '/af/ad_cfg/att/sn/:sn'], (req, res) => {
  const b = req.body;
  if (b.attApp1 !== undefined) dbdbschoolConfigStore.attApp1 = b.attApp1;
  if (b.attApp2 !== undefined) dbdbschoolConfigStore.attApp2 = b.attApp2;
  if (b.attApp3 !== undefined) dbdbschoolConfigStore.attApp3 = b.attApp3;
  if (b.attApp4 !== undefined) dbdbschoolConfigStore.attApp4 = b.attApp4;
  if (b.sign_data1 !== undefined) dbdbschoolConfigStore.signData1 = b.sign_data1;
  if (b.sign_data2 !== undefined) dbdbschoolConfigStore.signData2 = b.sign_data2;
  if (b.sign_data3 !== undefined) dbdbschoolConfigStore.signData3 = b.sign_data3;
  if (b.sign_data4 !== undefined) dbdbschoolConfigStore.signData4 = b.sign_data4;

  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.json({ success: true, tabName: '출석부옵션', message: '출석부옵션 설정이 성공적으로 저장되었습니다.' });
  }
  return res.redirect('/af/ad_cfg/att/sn/3267');
});

// 문자설정 저장 API
app.post(['/api/ad_cfg/save/sms', '/af/ad_cfg/sms/sn/:sn'], (req, res) => {
  const b = req.body;
  if (b.smsUse !== undefined) dbdbschoolConfigStore.smsUse = b.smsUse;
  if (b.smsBoTxt !== undefined) dbdbschoolConfigStore.smsBoTxt = b.smsBoTxt;
  if (b.smsDefNum !== undefined) dbdbschoolConfigStore.smsDefNum = b.smsDefNum;
  if (b.smsAmHour !== undefined) dbdbschoolConfigStore.smsAmHour = b.smsAmHour;
  if (b.smsPmHour !== undefined) dbdbschoolConfigStore.smsPmHour = b.smsPmHour;
  if (b.smsAlTeaAt !== undefined) dbdbschoolConfigStore.smsAlTeaAt = b.smsAlTeaAt;
  if (b.smsAlTeaSi !== undefined) dbdbschoolConfigStore.smsAlTeaSi = b.smsAlTeaSi;

  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.json({ success: true, tabName: '문자설정', message: '문자설정이 성공적으로 저장되었습니다.' });
  }
  return res.redirect('/af/ad_cfg/sms/sn/3267');
});
`;

// 포트 리슨 또는 사이드바 미들웨어 직전에 삽입
const targetMarker = '// dbdbschool Page Routing Middleware: 관리자 사이드바 전체 경로를 통일된 SPA 마스터 파일로 서빙';
if (!content.includes(targetMarker)) {
  console.error('타깃 마커를 찾을 수 없습니다.');
  process.exit(1);
}

content = content.replace(targetMarker, cfgRoutes + '\n' + targetMarker);
fs.writeFileSync(serverJsPath, content, 'utf8');
console.log('✅ server.js에 Sprint 3 환경설정 API 엔드포인트 추가 완료!');
