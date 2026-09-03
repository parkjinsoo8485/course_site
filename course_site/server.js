require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

// Domain Routers
const authRoutes = require('./routes/auth.routes');
const coursesRoutes = require('./routes/courses.routes');
const adminRoutes = require('./routes/admin.routes');
const instructorRoutes = require('./routes/instructor.routes');
const parentRoutes = require('./routes/parent.routes');
const communityRoutes = require('./routes/community.routes');
const sczigiRoutes = require('./routes/sczigi.routes');

const app = express();

// Middleware
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== 강좌관리 (ad_lec) 페이지 라우팅 매핑 ====================
app.get(/^\/af\/ad_lec\/inputs/, (req, res) => {
  // 강좌 일괄입력 공식 CSV 샘플 파일 다운로드
  const sampleCsv = '\uFEFF' + [
    '강좌구분,늘봄과정,중복제한그룹,강좌명,강사ID,보조강사ID,대상학년,강의시간,강의시간중복허용,정원,대기정원,운영시작일,운영종료일,총시수,강의실,수강료,수용비,교재비,재료비,내용',
    '26년 9월,방과후,,창의로봇(초급),tea01,,1;2;3,월1부(13:00~13:40),N,20,5,2026-09-01,2026-09-30,16,본관2층 컴퓨터교실,30000,3000,10000,5000,로봇 기초 조립 및 코딩 수업',
    '26년 9월,맞춤형,,신나는 미술놀이,tea02,,1;2,화1부(13:00~13:40),N,15,3,2026-09-01,2026-09-30,16,본관3층 늘봄프로그램실 1,25000,2500,5000,10000,다양한 미술 재료를 활용한 감성 표현',
    '26년 9월,돌봄,,오후 돌봄교실,tea04,,1;2,월~금(13:00~17:00),Y,25,5,2026-09-01,2026-09-30,80,후관1층 돌봄교실,0,0,0,0,안전한 방과후 돌봄 및 독서 지도'
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="lecture_batch_sample.csv"');
  return res.send(sampleCsv);
});

app.get([
  /^\/af\/ad_lec/,
  /^\/af\/ad_app/,
  /^\/af\/ad_wait/,
  /^\/af\/ad_att/,
  /^\/af\/ad_ref/,
  /^\/af\/ad_free2_/,
  /^\/af\/ad_rsch/,
  /^\/af\/ad_abs/,
  /^\/af\/ad_tea/,
  /^\/af\/ad_sur/,
  /^\/af\/ad_cfg/,
  /^\/af\/ad_time/,
  /^\/af\/ad_verify/,
  /^\/af\/ad_neis_edufine/,
  /^\/af\/ad_info/,
  /^\/af\/notification/,
  /^\/af\/spush/,
  /^\/af\/ad_extension/,
  /^\/af\/qanda/
], (req, res, next) => {
  // 정적 리소스 파일(.css, .js, .png, .woff 등) 요청인 경우 다음 정적 미들웨어로 전달
  if (req.path && req.path.includes('.') && !req.path.endsWith('.html')) {
    return next();
  }
  return res.sendFile(path.join(__dirname, 'af', 'ad_lec', 'lists', 'sn', 'index.html'));
});

// ==================== 로그인 페이지 서빙 및 로그인 후 매뉴얼 페이지 연결 ====================
app.get(['/login', '/login/', '/member/login', '/member/login/', '/member/login/sn/:school_id', '/member/login/sn/:school_id/'], (req, res) => {
  const loginPath = path.join(__dirname, 'member', 'login', 'sn', '3267', 'index.html');
  if (fs.existsSync(loginPath)) {
    return res.sendFile(loginPath);
  }
  return res.redirect('/af/ad_faq/main/sn/3267');
});

app.post(['/login', '/login/', '/member/login', '/member/login/', '/member/login/sn/:school_id', '/member/login/sn/:school_id/'], (req, res) => {
  return res.redirect('/af/ad_faq/main/sn/3267');
});

// ==================== 29. 매뉴얼 / FAQ 클론 페이지 & 다운로드/영상 라우트 ====================
app.get(['/af/ad_faq/main/sn/:school_id', '/af/ad_faq/main/sn/:school_id/'], (req, res) => {
  const clonedPath = path.join(__dirname, 'af/ad_faq/main/sn/3267/index.html');
  if (fs.existsSync(clonedPath)) {
    return res.sendFile(clonedPath);
  }
  return res.sendFile(path.join(__dirname, 'af/ad_lec/lists/sn/index.html'));
});

// ==================== DBDBSCHOOL 매뉴얼 / FAQ 파일 다운로드 & 영상 연동 엔드포인트 ====================
app.get('/help/go_data/num/:num/data/:type', (req, res) => {
  const { num, type } = req.params;
  const fullUrl = `https://www.dbdbschool.kr/help/go_data/num/${num}/data/${type}`;

  const mappingPath = path.join(__dirname, 'utils/manual_faq_mapping.json');
  let mapping = {};
  if (fs.existsSync(mappingPath)) {
    try {
      mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
    } catch (e) {}
  }

  const item = mapping[fullUrl];
  if (!item) {
    return res.status(404).send('해당 매뉴얼/FAQ 항목을 찾을 수 없습니다.');
  }

  // 1) 동영상인 경우: 공식 YouTube 영상으로 즉시 리다이렉트
  if (item.isVideo && item.youtubeUrl) {
    return res.redirect(item.youtubeUrl);
  }

  // 2) 문서 파일인 경우: 구글 드라이브 설정 확인 후 로컬 또는 드라이브 서빙
  const driveConfigPath = path.join(__dirname, 'config/drive_config.json');
  let driveConfig = {};
  if (fs.existsSync(driveConfigPath)) {
    try {
      driveConfig = JSON.parse(fs.readFileSync(driveConfigPath, 'utf8'));
    } catch (e) {}
  }

  // 구글 드라이브 연동 활성화 상태인 경우
  if (driveConfig.drive_enabled && driveConfig.drive_file_base_url && item.localFile) {
    const driveUrl = `${driveConfig.drive_file_base_url.replace(/\/$/, '')}/${encodeURIComponent(item.localFile)}`;
    return res.redirect(driveUrl);
  }

  // 기본 동작: 로컬 다운로드 파일 서빙
  if (item.localFile) {
    const localFilePath = path.join(__dirname, 'public/downloads/manual_faq', item.localFile);
    if (fs.existsSync(localFilePath)) {
      return res.download(localFilePath, item.localFile);
    }
  }

  // 로컬 파일이 없고 원본 타깃 URL이 존재하는 경우 외부 리다이렉트
  if (item.targetUrl) {
    return res.redirect(item.targetUrl);
  }

  return res.status(404).send('다운로드 파일을 찾을 수 없습니다.');
});

// 전체 매뉴얼 파일 일괄 압축본 다운로드 (구글 드라이브 백업용)
app.get('/downloads/manual_faq_all_files.zip', (req, res) => {
  const zipPath = path.join(__dirname, 'public/downloads/manual_faq_all_files.zip');
  if (fs.existsSync(zipPath)) {
    return res.download(zipPath, 'dbdbschool_manual_faq_all_files.zip');
  }
  res.status(404).send('압축 파일을 찾을 수 없습니다.');
});

// 개별 다운로드 파일 정적 서빙
app.get('/downloads/manual_faq/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'public/downloads/manual_faq', filename);
  if (fs.existsSync(filePath)) {
    return res.download(filePath, filename);
  }
  res.status(404).send('파일을 찾을 수 없습니다.');
});

app.use(express.static(__dirname));

// 강좌관리 검색결과 엑셀 출력 (/af/ad_lec/listse/*)
app.get(/^\/af\/ad_lec\/listse/, (req, res) => {
  const lectures = db.getLecturesBySchool('sch_1', {});
  let tableRows = '';
  lectures.forEach((lec, idx) => {
    tableRows += `
      <tr>
        <td style="text-align:center;">${idx + 1}</td>
        <td style="text-align:center;">${lec.category || ''} (${lec.neulbomType || ''})</td>
        <td style="text-align:left;">${lec.title || ''}</td>
        <td style="text-align:center;">${lec.teacherName || ''}</td>
        <td style="text-align:center;">${lec.applied || 0} / ${lec.capacity || 20}</td>
        <td style="text-align:center;">${lec.waiting || 0} / ${lec.waitingCapacity || 5}</td>
        <td style="text-align:center;">${lec.grade || '전학년'}</td>
        <td style="text-align:center;">${lec.period || ''}</td>
        <td style="text-align:center;">${lec.schedule || ''}</td>
        <td style="text-align:right; mso-number-format:'\\#,##0';">${(lec.fee || 0).toLocaleString()}</td>
        <td style="text-align:center;">${lec.status === 'OUTPUT' ? '출력' : (lec.status === 'WAITING' ? '대기' : '종료')}</td>
      </tr>
    `;
  });

  const excelHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <style>
    table { border-collapse: collapse; font-family: '맑은 고딕', sans-serif; font-size: 10pt; }
    th { background-color: #f2f4f7; border: 1px solid #ccc; padding: 6px 10px; font-weight: bold; text-align: center; }
    td { border: 1px solid #ddd; padding: 5px 8px; vertical-align: middle; }
    .title-cell { font-size: 16pt; font-weight: bold; text-align: center; color: #204d74; padding: 12px; }
  </style>
</head>
<body>
  <table>
    <tr><td colspan="11" class="title-cell">광주풍향초등학교 늘봄학교 강좌 목록</td></tr>
    <tr><td colspan="11" style="font-size:10pt; color:#666; padding:4px;">■ 출력 일시: ${new Date().toLocaleString('ko-KR')} | 총 강좌수: ${lectures.length}개</td></tr>
    <tr>
      <th>연번</th>
      <th>구분(늘봄과정)</th>
      <th>강좌명</th>
      <th>강사ID</th>
      <th>신청/정원</th>
      <th>대기자/정원</th>
      <th>학년</th>
      <th>운영기간</th>
      <th>강의시간</th>
      <th>수강료(원)</th>
      <th>상태</th>
    </tr>
    ${tableRows}
  </table>
</body>
</html>
  `.trim();

  const filename = `강좌목록_${new Date().toISOString().split('T')[0]}.xls`;
  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
  return res.send(Buffer.from(excelHtml, 'utf-8'));
});

// 강좌 정원 단건 인라인 수정 API (/api/af/ad_lec/capacity)
app.patch('/api/af/ad_lec/capacity', (req, res) => {
  const { id, capacity } = req.body;
  if (!id || typeof capacity === 'undefined') {
    return res.status(400).json({ success: false, message: '강좌 ID와 정원을 입력하세요.' });
  }
  const updated = db.updateLectureCapacity('sch_1', id, parseInt(capacity, 10));
  if (updated) {
    return res.json({ success: true, message: '정원이 성공적으로 수정되었습니다.', lecture: updated });
  }
  return res.status(404).json({ success: false, message: '강좌를 찾을 수 없습니다.' });
});

// 강좌 일괄 수정 API (/api/af/ad_lec/bulk-update)
app.post('/api/af/ad_lec/bulk-update', (req, res) => {
  const { courseIds, updates } = req.body;
  if (!courseIds || !Array.isArray(courseIds) || !updates) {
    return res.status(400).json({ success: false, message: '수정할 강좌 목록과 변경 데이터를 전달하세요.' });
  }
  const updatedCount = db.bulkUpdateLectures('sch_1', courseIds, updates);
  return res.json({ success: true, message: `${updatedCount}개 강좌의 정보가 일괄 수정되었습니다.`, count: updatedCount });
});

// 강좌 통계 조회 API (/api/af/ad_lec/stats)
app.get('/api/af/ad_lec/stats', (req, res) => {
  const stats = db.getLectureStats('sch_1');
  return res.json({ success: true, stats });
});

// Tuition Pay Entry Page (/af/ad_pay/edit/...)
app.get(/^\/af\/ad_pay\/edit/, (req, res) => {
  return res.sendFile(path.join(__dirname, 'af', 'ad_pay', 'edit', 'sn', '3267', 'index.html'));
});

// GET /api/af/ad_pay/data/sn/3267
app.get('/api/af/ad_pay/data/sn/:sn', (req, res) => {
  const { sld, sln } = req.query;
  const currentSld = sld || '10';
  const currentSln = sln || '1552375';

  let students = applicantDb.filter(a => String(a.courseId) === String(currentSln));
  if (students.length === 0) {
    students = applicantDb;
  }

  return res.json({
    success: true,
    schoolName: '광주풍향초등학교',
    currentSld,
    currentSln,
    courses: payCoursesList,
    students
  });
});

// POST /api/af/ad_pay/update-single
app.post('/api/af/ad_pay/update-single', (req, res) => {
  const { applicantId, tuitionFee, accommodationFee, bookFee, materialFee } = req.body;
  const applicant = applicantDb.find(a => a.id === applicantId);
  if (!applicant) {
    return res.status(404).json({ success: false, message: '학생을 찾을 수 없습니다.' });
  }

  applicant.tuitionFee = Number(tuitionFee) || 0;
  applicant.accommodationFee = Number(accommodationFee) || 0;
  applicant.bookFee = Number(bookFee) || 0;
  applicant.materialFee = Number(materialFee) || 0;
  applicant.totalFee = applicant.tuitionFee + applicant.accommodationFee + applicant.bookFee + applicant.materialFee;
  applicant.teacherFee = Math.floor(applicant.tuitionFee * 0.7);

  return res.json({ success: true, applicant });
});

// POST /api/af/ad_pay/update-bulk
app.post('/api/af/ad_pay/update-bulk', (req, res) => {
  const { lec_num, students } = req.body;
  
  if (!students || !Array.isArray(students)) {
    return res.status(400).json({ success: false, message: '잘못된 요청입니다.' });
  }

  students.forEach(updateData => {
    const applicant = applicantDb.find(a => a.id === updateData.id);
    if (applicant) {
      applicant.tuitionFee = Number(updateData.tuitionFee) || 0;
      applicant.accommodationFee = Number(updateData.accommodationFee) || 0;
      applicant.bookFee = Number(updateData.bookFee) || 0;
      applicant.materialFee = Number(updateData.materialFee) || 0;
      applicant.totalFee = applicant.tuitionFee + applicant.accommodationFee + applicant.bookFee + applicant.materialFee;
      applicant.teacherFee = Math.floor(applicant.tuitionFee * 0.7);
    }
  });

  return res.json({ success: true, message: '일괄 저장되었습니다.' });
});

// Mount Domain API Routes
app.use('/api/auth', authRoutes);
app.use('/api', coursesRoutes);
app.use('/api', adminRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api', instructorRoutes); // Backwards compatibility for /api/attendance, /api/settlements
app.use('/api/parent', parentRoutes);
app.use('/api/refunds', parentRoutes); // Backwards compatibility for /api/refunds/calculate
app.use('/api', communityRoutes);
app.use('/api', sczigiRoutes);

// Official dbdbschool URL direct handler: /help/go_data/num/:num/data/:type
app.get('/help/go_data/num/:num/data/:type', (req, res) => {
  const { num, type } = req.params;
  if (type === 'video' || type === 'mov') {
    return res.redirect(`https://www.youtube.com/results?search_query=dbdbschool+manual+${num}`);
  }
  return res.redirect(`/api/manual/doc/${num}`);
});

// 메인 페이지
app.get(['/', '/main', '/index.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ==================== SUPER ADMIN (MASTER) ROUTES ====================
// 대시보드
app.get(['/admin', '/admin/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// 통합 Q&A 목록
app.get(['/admin/qanda', '/admin/qanda/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'qanda', 'index.html'));
});

// Q&A 답변 작성 상세 (?id=xxx)
app.get(['/admin/qanda/view', '/admin/qanda/view/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'qanda', 'view.html'));
});

// 학교 목록 관리
app.get(['/admin/schools', '/admin/schools/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'schools', 'index.html'));
});

// Serve static files BEFORE HTML route patterns (prevents CSS/JS from being intercepted by :school_id param routes)
app.use(express.static(path.join(__dirname)));

// ==================== DBDBSCHOOL CLONE ROUTES ====================
app.get(['/af/ad_lec/lists/sn/:school_id', '/af/ad_lec/lists/sn/:school_id/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'af/ad_lec/lists/sn/index.html'));
});

app.get(['/af/ad_app/lists/sn/:school_id', '/af/ad_app/lists/sn/:school_id/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'af/ad_lec/lists/sn/index.html'));
});



app.get(['/af/qanda/lists/sn/:school_id', '/af/qanda/lists/sn/:school_id/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'af/ad_lec/lists/sn/index.html'));
});

app.get(['/member/findpw/sn/3267', '/member/findpw/sn/3267/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'member/findpw/sn/3267/index.html'));
});

app.get(['/member/faq/sn/3267', '/member/faq/sn/3267/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'member/faq/sn/3267/index.html'));
});

// (express.static has been moved above to before DBDBSCHOOL CLONE ROUTES)

// Dynamic store for school 3267 courses
let dbdbschool3267Courses = [
  {
    id: "c_3267_1",
    category: "늘봄",
    title: "[늘봄] AI 로봇 코딩 교실",
    targetGrade: "1~2학년",
    schedule: "월/수 14:00~15:30",
    instructor: "한수진",
    location: "컴퓨터1실",
    capacity: 20,
    enrolled: 20,
    waitlist: 3,
    fee: "무상 지원",
    materialFee: "15,000원",
    edufineCode: "EDU-2026-AI01"
  },
  {
    id: "c_3267_2",
    category: "방과후",
    title: "[방과후] 창의 미술과 드로잉",
    targetGrade: "1~6학년",
    schedule: "화/목 15:00~16:30",
    instructor: "이유리",
    location: "미술실",
    capacity: 20,
    enrolled: 18,
    waitlist: 0,
    fee: "30,000원",
    materialFee: "10,000원",
    edufineCode: "EDU-2026-ART02"
  },
  {
    id: "c_3267_3",
    category: "늘봄",
    title: "[늘봄] 신나는 K-POP 댄스",
    targetGrade: "1~3학년",
    schedule: "월/금 15:00~16:00",
    instructor: "박지민",
    location: "무용실",
    capacity: 25,
    enrolled: 25,
    waitlist: 5,
    fee: "무상 지원",
    materialFee: "0원",
    edufineCode: "EDU-2026-DAN03"
  },
  {
    id: "c_3267_4",
    category: "방과후",
    title: "[방과후] 주포만 바둑교실",
    targetGrade: "2~6학년",
    schedule: "수 15:00~16:40",
    instructor: "최성호",
    location: "2학년 1반",
    capacity: 15,
    enrolled: 12,
    waitlist: 0,
    fee: "25,000원",
    materialFee: "5,000원",
    edufineCode: "EDU-2026-GO04"
  },
  {
    id: "c_3267_5",
    category: "늘봄",
    title: "[늘봄] 생명과학 실험 탐구",
    targetGrade: "3~6학년",
    schedule: "목 15:00~16:30",
    instructor: "김도현",
    location: "과학2실",
    capacity: 20,
    enrolled: 20,
    waitlist: 2,
    fee: "무상 지원",
    materialFee: "12,000원",
    edufineCode: "EDU-2026-SCI05"
  },
  {
    id: "c_3267_6",
    category: "방과후",
    title: "[방과후] 원어민 영어회화 (초급)",
    targetGrade: "1~4학년",
    schedule: "화/금 14:00~15:00",
    instructor: "John Smith",
    location: "영어체험실",
    capacity: 18,
    enrolled: 16,
    waitlist: 0,
    fee: "35,000원",
    materialFee: "15,000원",
    edufineCode: "EDU-2026-ENG06"
  }
];

app.get('/api/dbdbschool/3267/courses', (req, res) => {
  return res.json({
    success: true,
    schoolName: "광주풍향초등학교",
    serviceName: "늘봄학교",
    courses: dbdbschool3267Courses
  });
});

app.post('/api/dbdbschool/3267/enroll', (req, res) => {
  const { courseId, studentName, isWaitlist } = req.body;
  if (!courseId || !studentName) {
    return res.status(400).json({ success: false, message: '강좌 ID와 학생명을 입력하세요.' });
  }

  const course = dbdbschool3267Courses.find(c => c.id === courseId);
  if (!course) {
    return res.status(404).json({ success: false, message: '강좌를 찾을 수 없습니다.' });
  }

  if (isWaitlist) {
    course.waitlist += 1;
    return res.json({
      success: true,
      message: `[대기 신청 완료] ${studentName} 학생의 ${course.title} 대기자 ${course.waitlist}순위 신청이 완료되었습니다.`
    });
  } else {
    if (course.enrolled >= course.capacity) {
      return res.status(400).json({ success: false, message: '정원이 초과되었습니다. 대기 신청을 이용해 주세요.' });
    }
    course.enrolled += 1;
    return res.json({
      success: true,
      message: `[수강 신청 완료] ${studentName} 학생의 ${course.title} 수강 신청이 완료되었습니다.`
    });
  }
});

// dbdbschool Page Routing Middleware (Serves individual sczigi static pages or falls back to master SPA)
app.use((req, res, next) => {
  const fs = require('fs');
  if (req.path && req.path.startsWith('/sczigi/')) {
    const cleanPath = req.path.replace(/^\/sczigi\//, '').replace(/\/$/, '');
    const directIndexPath = path.join(__dirname, 'sczigi', cleanPath, 'index.html');
    const directHtmlPath = path.join(__dirname, 'sczigi', `${cleanPath}.html`);
    const fallbackSnPath = path.join(__dirname, 'sczigi', cleanPath, 'sn', '3267', 'index.html');
    if (fs.existsSync(directIndexPath)) {
      return res.sendFile(directIndexPath);
    }
    if (fs.existsSync(directHtmlPath)) {
      return res.sendFile(directHtmlPath);
    }
    if (fs.existsSync(fallbackSnPath)) {
      return res.sendFile(fallbackSnPath);
    }
  }

  if (req.path && (req.path.startsWith('/af/') || req.path.startsWith('/sczigi/'))) {
    if (req.path.endsWith('.js') || req.path.endsWith('.css') || req.path.endsWith('.png') || req.path.endsWith('.ico') || req.path.endsWith('.jpg')) {
      return next();
    }
    return res.sendFile(path.join(__dirname, 'af', 'ad_lec', 'lists', 'sn', 'index.html'));
  }
  // Super Admin fallback: /admin/* 하위 미등록 경로는 대시보드로
  if (req.path && req.path.startsWith('/admin/') && !req.path.includes('.')) {
    return res.sendFile(path.join(__dirname, 'admin', 'index.html'));
  }
  next();
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`🚀 [늘봄학교 SaaS 플랫폼] 서버 구동 완료: http://localhost:${PORT}`);
});
