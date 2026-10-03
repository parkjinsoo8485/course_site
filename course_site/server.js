require('dotenv').config();
process.on('uncaughtException', (err) => {
  console.error('⚠️ [Server Error Guard] Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ [Server Error Guard] Unhandled Rejection:', reason);
});

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const db = require('./utils/db');

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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==================== 1-클릭 북마크릿 DOM 실시간 수신 개발용 API ====================
app.post('/api/dev/save-dom', (req, res) => {
  try {
    const { html, url, title, selector } = req.body;
    if (!html) {
      return res.status(400).json({ success: false, message: 'HTML 데이터가 비어있습니다.' });
    }
    const scratchDir = path.join(__dirname, '..', 'scratch');
    if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

    const targetPath = path.join(scratchDir, 'target.html');
    const metaHeader = `<!-- [Auto-captured via 1-Click Bookmarklet] -->\n<!-- Source URL: ${url || ''} -->\n<!-- Page Title: ${title || ''} -->\n<!-- Target Selector: ${selector || ''} -->\n<!-- Captured Time: ${new Date().toLocaleString()} -->\n\n`;

    fs.writeFileSync(targetPath, metaHeader + html, 'utf8');
    console.log(`[Dev Auto-Capture] DOM saved to scratch/target.html (${(html.length / 1024).toFixed(1)} KB) from ${url}`);
    return res.json({
      success: true,
      message: `scratch/target.html 에 ${(html.length / 1024).toFixed(1)} KB가 정상 저장되었습니다.`
    });
  } catch (err) {
    console.error('save-dom error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

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

// ==================== 출석부 엑셀 출력 (ad_att/excel) 라우팅 매핑 ====================
app.get(/^\/af\/ad_att\/excel/, (req, res) => {
  const excelHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <style>
    table { border-collapse: collapse; font-family: '맑은 고딕', sans-serif; font-size: 10pt; }
    th { background-color: #dff0d8; border: 1px solid #ccc; padding: 6px 10px; font-weight: bold; text-align: center; }
    td { border: 1px solid #ddd; padding: 5px 8px; vertical-align: middle; text-align: center; }
    .title-cell { font-size: 16pt; font-weight: bold; text-align: center; color: #3c763d; padding: 12px; }
  </style>
</head>
<body>
  <table>
    <tr><td colspan="8" class="title-cell">광주풍향초등학교 늘봄학교 출석부</td></tr>
    <tr><td colspan="8" style="font-size:10pt; color:#666; padding:4px;">■ 출력 일시: ${new Date().toLocaleString('ko-KR')}</td></tr>
    <tr>
      <th>연번</th>
      <th>강좌명</th>
      <th>강사명</th>
      <th>학생명</th>
      <th>학년/반/번호</th>
      <th>출석일수</th>
      <th>결석일수</th>
      <th>비고</th>
    </tr>
    <tr>
      <td>1</td>
      <td>창의로봇(초급)</td>
      <td>김선생</td>
      <td>홍길동</td>
      <td>1학년 1반 1번</td>
      <td>16</td>
      <td>0</td>
      <td>-</td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const filename = `출석부_${new Date().toISOString().split('T')[0]}.xls`;
  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
  return res.send(Buffer.from(excelHtml, 'utf-8'));
});

// ==================== 환불/취소 일괄등록 CSV 샘플 템플릿 다운로드 ====================

// ==================== 학적검증 엑셀 출력 (ad_verify/excel) 라우팅 매핑 ====================
app.get(/^\/af\/ad_verify\/excel/, (req, res) => {
  const verifyList = [
    { id: 1, studentName: '김민준', appGrade: 3, appClass: 2, appNumber: 14, neisGrade: 3, neisClass: 1, neisNumber: 12, reason: '신청 시 반/번호 불일치 (전반 처리됨)', status: '불일치' },
    { id: 2, studentName: '이서연', appGrade: 2, appClass: 4, appNumber: 5, neisGrade: 2, neisClass: 4, neisNumber: 5, reason: '정상', status: '일치' },
    { id: 3, studentName: '박도현', appGrade: 1, appClass: 1, appNumber: 22, neisGrade: null, neisClass: null, neisNumber: null, reason: '나이스 학생명부 미등록 (전입생 확인 필요)', status: '불일치' },
    { id: 4, studentName: '최예은', appGrade: 4, appClass: 3, appNumber: 8, neisGrade: 4, neisClass: 3, neisNumber: 8, reason: '정상', status: '일치' },
    { id: 5, studentName: '정시우', appGrade: 5, appClass: 2, appNumber: 19, neisGrade: 5, neisClass: 5, neisNumber: 11, reason: '신청 학급 오류', status: '불일치' }
  ];

  const rows = verifyList.map((item, idx) => `
    <tr style="background:${item.status === '불일치' ? '#fef2f2' : (idx % 2 === 0 ? '#ffffff' : '#f8fafc')};">
      <td style="text-align:center; mso-number-format:'\\@';">${idx + 1}</td>
      <td style="text-align:center; font-weight:bold; color:#1e3a8a;">${item.studentName}</td>
      <td style="text-align:center;">${item.appGrade}학년 ${item.appClass}반 ${item.appNumber}번</td>
      <td style="text-align:center; font-weight:bold; color:#047857;">${item.neisGrade ? item.neisGrade + '학년 ' + item.neisClass + '반 ' + item.neisNumber + '번' : '미등록'}</td>
      <td style="text-align:left; color:${item.status === '불일치' ? '#b91c1c' : '#334155'}; font-weight:${item.status === '불일치' ? 'bold' : 'normal'};">${item.reason}</td>
      <td style="text-align:center; font-weight:bold; color:${item.status === '불일치' ? '#dc2626' : '#16a34a'};">${item.status}</td>
    </tr>
  `).join('');

  const excelHtml = `
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
      ■ 학교명: 광주풍향초등학교 늘봄학교 &nbsp;|&nbsp; ■ 출력일시: ${new Date().toLocaleString('ko-KR')} &nbsp;|&nbsp;
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
      ${rows}
      <tr style="background:#fef3c7; border-top:2px solid #f59e0b; border-bottom:2px solid #f59e0b; font-weight:bold;">
        <td colspan="2" style="text-align:center;">합계 / 검증 총괄</td>
        <td colspan="4" style="text-align:left; color:#92400e;">총 ${verifyList.length}건 검증 중 일치 ${verifyList.filter(v=>v.status==='일치').length}건, 불일치 ${verifyList.filter(v=>v.status==='불일치').length}건</td>
      </tr>
    </tbody>
  </table>
</body>
</html>
  `.trim();

  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="academic_verification_3267.xls"');
  return res.send(excelHtml);
});


app.get(/^\/af\/ad_ref\/template/, (req, res) => {
  const sampleCsv = '\uFEFF' + [
    '학년,반,번호,이름,연락처,강좌명,최종수강일,출석시수,총시수,수강료,환불금액,사유',
    '1,1,5,김민준,010-1234-5678,놀이체육 1부,2026-08-10,3,12,25000,16660,개인사정',
    '2,3,12,이서연,010-9876-5432,창의로봇(초급),2026-08-01,0,12,30000,30000,개강전취소',
    '3,2,8,박지훈,010-5555-6666,논술 1부,2026-08-16,6,12,30000,15000,시간중복'
  ].join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="refund_batch_sample.csv"');
  return res.send(sampleCsv);
});

// ==================== 귀가일정표 (/af/ad_rsch) 엑셀 5대 원칙 프리미엄 출력 및 샘플 다운로드 ====================
app.get([/^\/af\/ad_rsch\/excel/, /^\/af\/ad_rsch\/listse/], (req, res) => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const timeStr = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

  const excelHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <!--[if gte mso 9]>
  <xml>
    <x:ExcelWorkbook>
      <x:ExcelWorksheets>
        <x:ExcelWorksheet>
          <x:Name>귀가일정표</x:Name>
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
    .header-day { background: #dbeafe; color: #1e40af; font-weight: bold; }
    .header-date { background: #f1f5f9; color: #1e293b; font-weight: bold; }
    .cell-center { text-align: center; }
    .cell-left { text-align: left; }
    .cell-zebra { background: #f8fafc; }
    .time-badge { color: #0284c7; font-weight: bold; }
    .total-row { background: #fef3c7; font-weight: bold; border-top: 2px solid #f59e0b; border-bottom: 2px solid #f59e0b; text-align: center; }
  </style>
</head>
<body>
  <table>
    <!-- 원칙 1: 대제목 타이틀 (Hero Title) -->
    <tr>
      <td colspan="10" class="hero-title">광주풍향초등학교 늘봄학교 귀가일정표</td>
    </tr>
    <!-- 원칙 2: 메타 정보 배너 (Metadata Summary Bar) -->
    <tr>
      <td colspan="10" class="meta-bar">
        ■ 출력일시: ${dateStr} ${timeStr} | ■ 관리기관: 광주풍향초등학교 늘봄학교 | ■ 총 등록 인원: 3명
      </td>
    </tr>
    <!-- 원칙 3: 헤더 영역별 파스텔 컬러 블록 -->
    <tr>
      <th style="width:45px;" class="header-basic">연번</th>
      <th style="width:50px;" class="header-basic">학년</th>
      <th style="width:50px;" class="header-basic">반</th>
      <th style="width:50px;" class="header-basic">번호</th>
      <th style="width:90px;" class="header-basic">이름</th>
      <th style="width:180px;" class="header-day">월요일</th>
      <th style="width:180px;" class="header-day">화요일</th>
      <th style="width:180px;" class="header-day">수요일</th>
      <th style="width:180px;" class="header-day">목요일</th>
      <th style="width:180px;" class="header-day">금요일</th>
    </tr>
    <!-- 원칙 4: 데이터 행 지브라 교차 및 포맷 -->
    <tr>
      <td class="cell-center">1</td>
      <td class="cell-center">1</td>
      <td class="cell-center">2</td>
      <td class="cell-center">11</td>
      <td class="cell-center" style="font-weight:bold;">유다은</td>
      <td class="cell-left"><span class="time-badge">16:10</span> 엄마 또는 외조모<br>010-9443-7348</td>
      <td class="cell-left"><span class="time-badge">15:50</span> 엄마 또는 외조모<br>010-9443-7348</td>
      <td class="cell-left"><span class="time-badge">16:10</span> 엄마 또는 외조모<br>010-9443-7348</td>
      <td class="cell-left"><span class="time-badge">15:50</span> 엄마 또는 외조모<br>010-9443-7348</td>
      <td class="cell-left"><span class="time-badge">15:50</span> 엄마 또는 외조모<br>010-9443-7348</td>
    </tr>
    <tr class="cell-zebra">
      <td class="cell-center">2</td>
      <td class="cell-center">1</td>
      <td class="cell-center">1</td>
      <td class="cell-center">5</td>
      <td class="cell-center" style="font-weight:bold;">강민준</td>
      <td class="cell-left"><span class="time-badge">15:30</span> 자율귀가<br>태권도장 차량</td>
      <td class="cell-left"><span class="time-badge">16:00</span> 엄마<br>010-1234-5678</td>
      <td class="cell-left"><span class="time-badge">15:30</span> 자율귀가<br>태권도장 차량</td>
      <td class="cell-left"><span class="time-badge">16:00</span> 엄마<br>010-1234-5678</td>
      <td class="cell-left"><span class="time-badge">15:00</span> 아빠<br>010-9876-5432</td>
    </tr>
    <tr>
      <td class="cell-center">3</td>
      <td class="cell-center">2</td>
      <td class="cell-center">3</td>
      <td class="cell-center">18</td>
      <td class="cell-center" style="font-weight:bold;">이서윤</td>
      <td class="cell-left"><span class="time-badge">16:30</span> 피아노학원<br>원장님 직접 동행</td>
      <td class="cell-left"><span class="time-badge">16:30</span> 피아노학원<br>원장님 직접 동행</td>
      <td class="cell-left"><span class="time-badge">15:40</span> 엄마<br>010-7777-8888</td>
      <td class="cell-left"><span class="time-badge">16:30</span> 피아노학원<br>원장님 직접 동행</td>
      <td class="cell-left"><span class="time-badge">15:40</span> 엄마<br>010-7777-8888</td>
    </tr>
    <!-- 원칙 5: 하단 총 결산 합계 행 (Total Summary Row) -->
    <tr class="total-row">
      <td colspan="5" style="text-align:center; padding:8px;">총 귀가 인원 집계 (합계)</td>
      <td class="cell-center">3명</td>
      <td class="cell-center">3명</td>
      <td class="cell-center">3명</td>
      <td class="cell-center">3명</td>
      <td class="cell-center">3명</td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const filename = `귀가일정표_${new Date().toISOString().split('T')[0]}.xls`;
  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
  return res.send(Buffer.from(excelHtml, 'utf-8'));
});

// 귀가일정 일괄입력 샘플 서식 다운로드 (/af/ad_rsch/sample_excel 및 S3 호환 URL)
app.get(['/af/ad_rsch/sample_excel', '/doc/after/sample/afterRtnSchedule.xlsx'], (req, res) => {
  const sampleCsv = '\uFEFF' + [
    '학년,반,번호,이름,요일,시간,귀가동행자,연락처,비고',
    '1,2,11,유다은,월,16:10,엄마 또는 외조모,010-9443-7348,외조모 010.2753.7348',
    '1,2,11,유다은,화,15:50,엄마 또는 외조모,010-9443-7348,',
    '1,1,5,강민준,월,15:30,자율귀가,010-1234-5678,태권도장 차량',
    '2,3,18,이서윤,수,15:40,엄마,010-7777-8888,'
  ].join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="afterRtnSchedule.csv"');
  return res.send(sampleCsv);
});

// ==================== 결석/귀가신청 (/af/ad_abs) 엑셀 5대 원칙 프리미엄 출력 ====================
app.get([/^\/af\/ad_abs\/excel/, /^\/af\/ad_abs\/listse/], (req, res) => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const timeStr = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

  const excelHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <!--[if gte mso 9]>
  <xml>
    <x:ExcelWorkbook>
      <x:ExcelWorksheets>
        <x:ExcelWorksheet>
          <x:Name>결석귀가신청목록</x:Name>
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
    .header-type { background: #e0f2fe; color: #0369a1; font-weight: bold; }
    .header-reason { background: #f1f5f9; color: #1e293b; font-weight: bold; }
    .cell-center { text-align: center; }
    .cell-left { text-align: left; }
    .cell-zebra { background: #f8fafc; }
    .badge-abs { color: #b91c1c; font-weight: bold; }
    .badge-early { color: #0369a1; font-weight: bold; }
    .total-row { background: #fef3c7; font-weight: bold; border-top: 2px solid #f59e0b; border-bottom: 2px solid #f59e0b; text-align: center; }
  </style>
</head>
<body>
  <table>
    <!-- 원칙 1: 대제목 타이틀 (Hero Title) -->
    <tr>
      <td colspan="10" class="hero-title">광주풍향초등학교 늘봄학교 결석/귀가신청 목록</td>
    </tr>
    <!-- 원칙 2: 메타 정보 배너 (Metadata Summary Bar) -->
    <tr>
      <td colspan="10" class="meta-bar">
        ■ 출력일시: ${dateStr} ${timeStr} | ■ 관리기관: 광주풍향초등학교 늘봄학교 | ■ 총 신청 건수: 3건 (결석 2건, 조기귀가 1건)
      </td>
    </tr>
    <!-- 원칙 3: 헤더 영역별 파스텔 컬러 블록 -->
    <tr>
      <th style="width:45px;" class="header-basic">연번</th>
      <th style="width:50px;" class="header-basic">학년</th>
      <th style="width:50px;" class="header-basic">반</th>
      <th style="width:50px;" class="header-basic">번호</th>
      <th style="width:90px;" class="header-basic">이름</th>
      <th style="width:90px;" class="header-type">신청유형</th>
      <th style="width:120px;" class="header-basic">일자(시간)</th>
      <th style="width:240px;" class="header-reason">사유</th>
      <th style="width:120px;" class="header-basic">귀가 동행자</th>
      <th style="width:130px;" class="header-basic">연락처</th>
    </tr>
    <!-- 원칙 4: 데이터 행 지브라 교차 및 포맷 -->
    <tr>
      <td class="cell-center">1</td>
      <td class="cell-center">1</td>
      <td class="cell-center">2</td>
      <td class="cell-center">11</td>
      <td class="cell-center" style="font-weight:bold;">유다은</td>
      <td class="cell-center"><span class="badge-early">조기귀가</span></td>
      <td class="cell-center">2026-10-02 (14:50)</td>
      <td class="cell-left">치과 정기 검진 및 치료로 인한 조기귀가</td>
      <td class="cell-center">엄마</td>
      <td class="cell-center">010-9443-7348</td>
    </tr>
    <tr class="cell-zebra">
      <td class="cell-center">2</td>
      <td class="cell-center">1</td>
      <td class="cell-center">1</td>
      <td class="cell-center">5</td>
      <td class="cell-center" style="font-weight:bold;">강민준</td>
      <td class="cell-center"><span class="badge-abs">결석</span></td>
      <td class="cell-center">2026-10-01</td>
      <td class="cell-left">환절기 감기 몸살로 인한 결석 신청</td>
      <td class="cell-center">-</td>
      <td class="cell-center">-</td>
    </tr>
    <tr>
      <td class="cell-center">3</td>
      <td class="cell-center">2</td>
      <td class="cell-center">3</td>
      <td class="cell-center">18</td>
      <td class="cell-center" style="font-weight:bold;">이서윤</td>
      <td class="cell-center"><span class="badge-abs">결석</span></td>
      <td class="cell-center">2026-09-28</td>
      <td class="cell-left">가족 경조사 참석으로 인한 결석</td>
      <td class="cell-center">-</td>
      <td class="cell-center">-</td>
    </tr>
    <!-- 원칙 5: 하단 총 결산 합계 행 (Total Summary Row) -->
    <tr class="total-row">
      <td colspan="5" style="text-align:center; padding:8px;">총 결석/귀가 신청 합계</td>
      <td class="cell-center">총 3건</td>
      <td class="cell-center">-</td>
      <td class="cell-left">결석 2건, 조기귀가 1건</td>
      <td class="cell-center">-</td>
      <td class="cell-center">-</td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const filename = `결석귀가신청목록_${new Date().toISOString().split('T')[0]}.xls`;
  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
  return res.send(Buffer.from(excelHtml, 'utf-8'));
});

// ==================== [Sprint 2] 강사관리 (/af/ad_tea) 엑셀 5대 원칙 프리미엄 출력 및 API ====================

let dbTeachers = [
  {
    "num": "55382",
    "seq": 18,
    "id": "강태연",
    "name": "강태연",
    "hp": "010-7222-1718",
    "lastLogin": "2026-09-29 08:53:58",
    "tempPass": "-",
    "selfAuth": "-",
    "twoFactor": "-",
    "agreeDate": "2025-05-26",
    "status": "1"
  },
  {
    "num": "55938",
    "seq": 17,
    "id": "김경아",
    "name": "김경아",
    "hp": "010-8954-5376",
    "lastLogin": "2026-10-01 16:26:44",
    "tempPass": "-",
    "selfAuth": "-",
    "twoFactor": "-",
    "agreeDate": "2025-05-23",
    "status": "1"
  },
  {
    "num": "55385",
    "seq": 16,
    "id": "김언주",
    "name": "김언주",
    "hp": "010-3062-8867",
    "lastLogin": "2026-09-30 13:35:27",
    "tempPass": "-",
    "selfAuth": "-",
    "twoFactor": "-",
    "agreeDate": "2025-05-22",
    "status": "1"
  },
  {
    "num": "55388",
    "seq": 15,
    "id": "김윤정",
    "name": "김윤정",
    "hp": "010-9607-7614",
    "lastLogin": "2026-10-01 12:20:54",
    "tempPass": "-",
    "selfAuth": "-",
    "twoFactor": "-",
    "agreeDate": "2025-05-26",
    "status": "1"
  },
  {
    "num": "55389",
    "seq": 14,
    "id": "김재표",
    "name": "김재표",
    "hp": "010-8611-9755",
    "lastLogin": "2026-10-01 21:46:23",
    "tempPass": "-",
    "selfAuth": "-",
    "twoFactor": "-",
    "agreeDate": "2025-05-26",
    "status": "1"
  },
  {
    "num": "66057",
    "seq": 13,
    "id": "김지향",
    "name": "김지향",
    "hp": "010-5573-5224",
    "lastLogin": "2026-09-29 08:51:44",
    "tempPass": "-",
    "selfAuth": "-",
    "twoFactor": "-",
    "agreeDate": "2026-02-23",
    "status": "1"
  },
  {
    "num": "55374",
    "seq": 12,
    "id": "돌봄전담사",
    "name": "돌봄전담사",
    "hp": "010-5529-6769",
    "lastLogin": "2026-10-02 09:38:50",
    "tempPass": "-",
    "selfAuth": "-",
    "twoFactor": "-",
    "agreeDate": "2025-05-21",
    "status": "1"
  },
  {
    "num": "66058",
    "seq": 11,
    "id": "박경도",
    "name": "박경도",
    "hp": "010-7174-6467",
    "lastLogin": "2026-10-02 14:53:14",
    "tempPass": "-",
    "selfAuth": "-",
    "twoFactor": "-",
    "agreeDate": "2026-02-23",
    "status": "1"
  },
  {
    "num": "55384",
    "seq": 10,
    "id": "박은화",
    "name": "박은화",
    "hp": "010-7170-0780",
    "lastLogin": "2026-09-21 14:59:49",
    "tempPass": "-",
    "selfAuth": "-",
    "twoFactor": "-",
    "agreeDate": "2025-06-01",
    "status": "1"
  },
  {
    "num": "55375",
    "seq": 9,
    "id": "박지숙",
    "name": "박지숙",
    "hp": "010-2402-9796",
    "lastLogin": "2026-10-01 08:29:30",
    "tempPass": "-",
    "selfAuth": "-",
    "twoFactor": "-",
    "agreeDate": "2025-05-26",
    "status": "1"
  },
  {
    "num": "55376",
    "seq": 8,
    "id": "박지연",
    "name": "박지연",
    "hp": "010-2104-0901",
    "lastLogin": "2026-10-02 15:06:04",
    "tempPass": "-",
    "selfAuth": "-",
    "twoFactor": "-",
    "agreeDate": "2025-05-28",
    "status": "1"
  },
  {
    "num": "66691",
    "seq": 7,
    "id": "보조강사",
    "name": "보조강사",
    "hp": "",
    "lastLogin": "2026-02-24 13:38:21",
    "tempPass": "-",
    "selfAuth": "-",
    "twoFactor": "-",
    "agreeDate": "2026-02-24",
    "status": "1"
  },
  {
    "num": "55381",
    "seq": 6,
    "id": "서인경",
    "name": "서인경",
    "hp": "010-9440-8666",
    "lastLogin": "2026-10-01 09:37:05",
    "tempPass": "-",
    "selfAuth": "-",
    "twoFactor": "-",
    "agreeDate": "2025-05-27",
    "status": "1"
  },
  {
    "num": "70922",
    "seq": 5,
    "id": "이금진",
    "name": "이금진",
    "hp": "",
    "lastLogin": "",
    "tempPass": "Y",
    "selfAuth": "-",
    "twoFactor": "-",
    "agreeDate": "-",
    "status": "1"
  },
  {
    "num": "66060",
    "seq": 4,
    "id": "임은희",
    "name": "임은희",
    "hp": "010-8024-0326",
    "lastLogin": "2026-10-01 16:11:21",
    "tempPass": "-",
    "selfAuth": "-",
    "twoFactor": "-",
    "agreeDate": "2026-02-23",
    "status": "1"
  },
  {
    "num": "66059",
    "seq": 3,
    "id": "정진화",
    "name": "정진화",
    "hp": "010-3912-1462",
    "lastLogin": "2026-09-30 13:41:40",
    "tempPass": "-",
    "selfAuth": "-",
    "twoFactor": "-",
    "agreeDate": "2026-02-23",
    "status": "1"
  },
  {
    "num": "55380",
    "seq": 2,
    "id": "천윤아",
    "name": "천윤아",
    "hp": "010-3645-1972",
    "lastLogin": "2026-10-01 22:52:13",
    "tempPass": "-",
    "selfAuth": "-",
    "twoFactor": "-",
    "agreeDate": "2025-05-26",
    "status": "1"
  },
  {
    "num": "55378",
    "seq": 1,
    "id": "최정호",
    "name": "최정호",
    "hp": "010-2629-0140",
    "lastLogin": "2026-09-30 09:58:30",
    "tempPass": "-",
    "selfAuth": "-",
    "twoFactor": "-",
    "agreeDate": "2025-05-26",
    "status": "1"
  }
];

// 1. 강사 검색결과 엑셀 출력 (5대 원칙 준수)
app.get([/^\/af\/ad_tea\/excel/, /^\/af\/ad_tea\/listse/], (req, res) => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const timeStr = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

  const totalCount = dbTeachers.length;
  const usedCount = dbTeachers.filter(t => t.status === '1').length;
  const waitCount = totalCount - usedCount;

  const rowsHtml = dbTeachers.map((t, idx) => `
    <tr class="${idx % 2 === 1 ? 'cell-zebra' : ''}">
      <td class="cell-center">${idx + 1}</td>
      <td class="cell-center" style="font-weight:bold;">${t.id}</td>
      <td class="cell-center">${t.name}</td>
      <td class="cell-center">${t.hp || '-'}</td>
      <td class="cell-center">${t.lastLogin || '-'}</td>
      <td class="cell-center">${t.tempPass || '-'}</td>
      <td class="cell-center">${t.selfAuth || '-'}</td>
      <td class="cell-center">${t.twoFactor || '-'}</td>
      <td class="cell-center">${t.agreeDate || '-'}</td>
      <td class="cell-center"><span class="${t.status === '1' ? 'badge-used' : 'badge-wait'}">${t.status === '1' ? '사용' : '대기'}</span></td>
    </tr>
  `).join('');

  const excelHtml = `
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
        ■ 출력일시: ${dateStr} ${timeStr} | ■ 관리기관: 광주풍향초등학교 늘봄학교 | ■ 총 등록 강사: ${totalCount}명 (사용: ${usedCount}명, 대기: ${waitCount}명)
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
    ${rowsHtml}
    <!-- 원칙 5: 하단 총 결산 합계 행 (Total Summary Row) -->
    <tr class="total-row">
      <td colspan="4" style="text-align:center; padding:8px;">총 등록 강사 합계 (Total)</td>
      <td class="cell-center">총 ${totalCount}명</td>
      <td colspan="4" class="cell-center">정상 사용: ${usedCount}명 / 승인 대기: ${waitCount}명</td>
      <td class="cell-center">${totalCount}명</td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const filename = `강사명부_${new Date().toISOString().split('T')[0]}.xls`;
  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
  return res.send(Buffer.from(excelHtml, 'utf-8'));
});

// 2. 강사 시간표 엑셀 출력 (5대 원칙 준수)
app.get([/^\/af\/ad_tea\/schedule_excel/, /^\/af\/ad_tea\/schedule/], (req, res) => {
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

  const rowsHtml = sampleSchedules.map((s, idx) => `
    <tr class="${idx % 2 === 1 ? 'cell-zebra' : ''}">
      <td class="cell-center">${s.seq}</td>
      <td class="cell-center" style="font-weight:bold;">${s.teaName}</td>
      <td class="cell-left">${s.course}</td>
      <td class="cell-center">${s.div}</td>
      <td class="cell-center">${s.room}</td>
      <td class="cell-center" style="font-weight:bold; color:#0284c7;">${s.time}</td>
      <td class="cell-center">${s.grade}</td>
      <td class="cell-center">${s.cap}명</td>
    </tr>
  `).join('');

  const excelHtml = `
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
    <tr><td colspan="8" class="meta-bar">■ 기준월: 26년 10월 | ■ 출력일시: ${dateStr} ${timeStr} | ■ 관리기관: 광주풍향초등학교 늘봄학교</td></tr>
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
    ${rowsHtml}
    <tr class="total-row">
      <td colspan="3" style="text-align:center; padding:8px;">총 개설 강좌 합계 (Total)</td>
      <td class="cell-center">총 7개 강좌</td>
      <td colspan="3" class="cell-center">전체 정원 집계</td>
      <td class="cell-center">138명</td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const filename = `강사시간표_${new Date().toISOString().split('T')[0]}.xls`;
  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
  return res.send(Buffer.from(excelHtml, 'utf-8'));
});

// 3. 강사 일괄입력 샘플 서식 다운로드 (/af/ad_tea/sample_excel 및 S3 호환 URL)
app.get(['/af/ad_tea/sample_excel', '/doc/after/sample/afterTeaInput.xlsx'], (req, res) => {
  const sampleCsv = '\uFEFF' + [
    '아이디,이름,비밀번호,문자발송권한,휴대폰',
    'tea_sample1,김철수,1234,Y,010-1234-5678',
    'tea_sample2,이영희,1234,N,010-9876-5432',
    'tea_sample3,박민수,1234,Y,010-5555-7777'
  ].join('\n');
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




// ==================== 지원금 대상자관리 엑셀 및 샘플 CSV 다운로드 직속 라우팅 ====================
app.get(/^\/af\/ad_free2_stu\/sample_csv/, (req, res) => {
  const sampleCsv = '\uFEFF' + [
    '학년,반,번호,이름,연락처,순위,순위구분,선지정대상자,1학년지원총액,3학년지원총액,자유수강권총액,비고',
    '1,1,5,김영희,010-1111-2222,1순위,국민기초생활수급자,Y,600000,0,600000,신입생 우선지원',
    '2,2,10,이철수,010-3333-4444,2순위,한부모가족보호대상자,N,0,0,600000,',
    '3,1,12,박지민,010-5555-7777,3순위,학교장추천,N,0,300000,300000,담임 추천'
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="subsidy_student_batch_sample.csv"');
  return res.send(sampleCsv);
});

app.get(/^\/af\/ad_free2_stu\/excel_all/, (req, res) => {
  const students = db.getSubsidyStudents('sch_1');
  const allSchoolList = [];
  for (let g = 1; g <= 6; g++) {
    for (let c = 1; c <= 3; c++) {
      for (let n = 1; n <= 10; n++) {
        const matched = students.find(s => s.grade === g && s.classNum === c && s.studentNum === n);
        allSchoolList.push({
          grade: g,
          classNum: c,
          studentNum: n,
          studentName: matched ? matched.studentName : `학생_${g}-${c}-${n}`,
          isTarget: matched ? '대상' : '일반',
          rank: matched ? matched.rank : '-',
          rankDetail: matched ? matched.rankDetail : '-',
          freeTotal: matched ? matched.free_total : 0,
          freeUsed: matched ? matched.free_used : 0,
          freeBalance: matched ? matched.free_balance : 0
        });
      }
    }
  }

  const rowsHtml = allSchoolList.map((st, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${st.grade}</td>
      <td>${st.classNum}</td>
      <td>${st.studentNum}</td>
      <td>${st.studentName}</td>
      <td style="font-weight:bold; color:${st.isTarget === '대상' ? '#d9534f' : '#666'};">${st.isTarget}</td>
      <td>${st.rank}</td>
      <td>${st.rankDetail}</td>
      <td>${st.freeTotal.toLocaleString()}</td>
      <td>${st.freeUsed.toLocaleString()}</td>
      <td>${st.freeBalance.toLocaleString()}</td>
    </tr>
  `).join('');

  const excelHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <style>
    table { border-collapse: collapse; font-family: '맑은 고딕', sans-serif; font-size: 10pt; }
    th { background-color: #d9edf7; border: 1px solid #ccc; padding: 6px 10px; font-weight: bold; text-align: center; }
    td { border: 1px solid #ddd; padding: 5px 8px; vertical-align: middle; text-align: center; }
    .title-cell { font-size: 16pt; font-weight: bold; text-align: center; color: #31708f; padding: 12px; }
  </style>
</head>
<body>
  <table>
    <tr><td colspan="11" class="title-cell">광주풍향초등학교 전교생 기준 지원금 대상자 현황표</td></tr>
    <tr><td colspan="11" style="font-size:10pt; color:#666; padding:4px;">■ 출력 일시: ${new Date().toLocaleString('ko-KR')} | 전교생: ${allSchoolList.length}명</td></tr>
    <tr>
      <th>연번</th>
      <th>학년</th>
      <th>반</th>
      <th>번호</th>
      <th>이름</th>
      <th>대상자구분</th>
      <th>순위</th>
      <th>순위구분</th>
      <th>자유수강권 총액</th>
      <th>사용액</th>
      <th>잔액</th>
    </tr>
    ${rowsHtml}
  </table>
</body>
</html>
  `.trim();

  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="subsidy_all_students_report.xls"');
  return res.send(Buffer.from(excelHtml, 'utf-8'));
});

app.get(/^\/af\/ad_free2_stu\/excel/, (req, res) => {
  const { grade, classNum, rank, rankDetail, fundType, searchName } = req.query;
  const students = db.getSubsidyStudents('sch_1', { grade, classNum, rank, rankDetail, fundType, searchName });

  const rowsHtml = students.map((s, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${s.grade}</td>
      <td>${s.classNum}</td>
      <td>${s.studentNum}</td>
      <td>${s.studentName}</td>
      <td>${(s.fund1_total || 0).toLocaleString()}</td>
      <td>${(s.fund1_used || 0).toLocaleString()}</td>
      <td>${(s.fund1_balance || 0).toLocaleString()}</td>
      <td>${s.fund1_period || '-'}</td>
      <td>${(s.fund3_total || 0).toLocaleString()}</td>
      <td>${(s.fund3_used || 0).toLocaleString()}</td>
      <td>${(s.fund3_balance || 0).toLocaleString()}</td>
      <td>${s.fund3_period || '-'}</td>
      <td>${s.rank || ''}</td>
      <td>${s.rankDetail || ''}</td>
      <td>${s.isPreDesignated || 'N'}</td>
      <td>${(s.free_total || 0).toLocaleString()}</td>
      <td>${(s.free_used || 0).toLocaleString()}</td>
      <td>${(s.free_balance || 0).toLocaleString()}</td>
    </tr>
  `).join('');

  const excelHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <style>
    table { border-collapse: collapse; font-family: '맑은 고딕', sans-serif; font-size: 10pt; }
    th { background-color: #dff0d8; border: 1px solid #ccc; padding: 6px 10px; font-weight: bold; text-align: center; }
    td { border: 1px solid #ddd; padding: 5px 8px; vertical-align: middle; text-align: center; }
    .title-cell { font-size: 16pt; font-weight: bold; text-align: center; color: #3c763d; padding: 12px; }
  </style>
</head>
<body>
  <table>
    <tr><td colspan="19" class="title-cell">광주풍향초등학교 지원금 대상자 목록 (검색 결과)</td></tr>
    <tr><td colspan="19" style="font-size:10pt; color:#666; padding:4px;">■ 출력 일시: ${new Date().toLocaleString('ko-KR')} | 총 인원: ${students.length}명</td></tr>
    <tr>
      <th rowspan="2">연번</th>
      <th rowspan="2">학년</th>
      <th rowspan="2">반</th>
      <th rowspan="2">번호</th>
      <th rowspan="2">이름</th>
      <th colspan="4" style="background:#e0f2fe; color:#0369a1;">1학년 지원금</th>
      <th colspan="4" style="background:#fef3c7; color:#92400e;">3학년 지원금</th>
      <th rowspan="2">순위</th>
      <th rowspan="2">순위구분</th>
      <th rowspan="2">선지정대상자</th>
      <th colspan="3" style="background:#dcfce7; color:#166534;">자유수강권</th>
    </tr>
    <tr>
      <th>총액</th><th>사용액</th><th>잔액</th><th>지원기간</th>
      <th>총액</th><th>사용액</th><th>잔액</th><th>지원기간</th>
      <th>총액</th><th>사용액</th><th>잔액</th>
    </tr>
    ${rowsHtml}
  </table>
</body>
</html>
  `.trim();

  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="subsidy_students_search_result.xls"');
  return res.send(Buffer.from(excelHtml, 'utf-8'));
});

// ==================== 지원금 수강자관리 (/af/ad_free2_app) 엑셀 6종 + 정산 1종 프리미엄 공식 서식 ====================

// 0. 지원금 정산 총괄표 (/af/ad_free2_app/excel_settle)
app.get(/^\/af\/ad_free2_app\/excel_settle/, (req, res) => {
  const list = db.getSubsidyApplicants('sch_1');
  const totalFee = list.reduce((a, c) => a + (c.totalFee || c.fee || 0), 0);
  const totalSub = list.reduce((a, c) => a + (c.subsidizedAmount || 0), 0);
  const totalOut = list.reduce((a, c) => a + (c.collectedAmount !== undefined ? c.collectedAmount : (c.outOfPocket || 0)), 0);

  const excelHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <style>
    body { font-family: '맑은 고딕', Arial, sans-serif; font-size: 10pt; color: #1e293b; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
    th { background-color: #dbeafe; border: 1px solid #94a3b8; padding: 8px 12px; font-weight: bold; text-align: center; font-size: 10pt; color: #1e3a8a; }
    td { border: 1px solid #cbd5e1; padding: 7px 10px; vertical-align: middle; text-align: center; font-size: 9.5pt; }
    .title-cell { font-size: 17pt; font-weight: bold; text-align: left; color: #1e40af; padding: 14px 4px 6px 4px; }
    .meta-bar { font-size: 9.5pt; color: #475569; padding: 6px 4px 12px 4px; text-align: left; border: none; }
    .num { text-align: right; mso-number-format: "#,##0"; }
    .total-row td { background-color: #fef3c7; font-weight: bold; color: #92400e; border-top: 2px solid #b45309; border-bottom: 2px solid #b45309; }
  </style>
</head>
<body>
  <table>
    <tr><td colspan="7" class="title-cell">2026학년도 방과후학교 지원금 정산 총괄표</td></tr>
    <tr>
      <td colspan="7" class="meta-bar">
        ■ 학교명: <strong>광주풍향초등학교</strong> | 출력일시: ${new Date().toLocaleString('ko-KR')} | 집계 대상: 전 강좌 지원 수강생
      </td>
    </tr>
    <tr>
      <th style="width: 20%;">구분</th>
      <th style="width: 12%;">총 신청인원</th>
      <th style="width: 17%;">총 수강료(A)</th>
      <th style="width: 17%;">지원금 차감합계(B)</th>
      <th style="width: 17%;">본인부담금 합계(A-B)</th>
      <th style="width: 17%;">정산일자</th>
      <th style="width: 17%;">비고</th>
    </tr>
    <tr>
      <td style="text-align:left; font-weight:bold;">풍향초 전 강좌 합계</td>
      <td style="font-weight:bold;">${list.length}명</td>
      <td class="num" style="font-weight:bold;">${totalFee.toLocaleString()}원</td>
      <td class="num" style="font-weight:bold; color:#1d4ed8;">${totalSub.toLocaleString()}원</td>
      <td class="num" style="font-weight:bold; color:#c2410c;">${totalOut.toLocaleString()}원</td>
      <td>${new Date().toISOString().slice(0, 10)}</td>
      <td>정상 집계 완료</td>
    </tr>
    <tr class="total-row">
      <td style="text-align:left;">총 합계</td>
      <td>${list.length}명</td>
      <td class="num">${totalFee.toLocaleString()}원</td>
      <td class="num" style="color:#1d4ed8;">${totalSub.toLocaleString()}원</td>
      <td class="num" style="color:#c2410c;">${totalOut.toLocaleString()}원</td>
      <td>-</td>
      <td>최종 결산</td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="subsidy_settlement_report.xls"');
  return res.send(Buffer.from(excelHtml, 'utf-8'));
});

// 1. 검색결과출력 (공식 BIN002D 서식 1:1 프리미엄 엑셀)
app.get(/^\/af\/ad_free2_app\/excel$/, (req, res) => {
  const { month, category, course, grade, classNum, searchName } = req.query;
  const list = db.getSubsidyApplicants('sch_1', { month, category, course, grade, classNum, searchName });

  const totalTuition = list.reduce((a, c) => a + (c.tuitionFee || 0), 0);
  const totalInstructor = list.reduce((a, c) => a + (c.instructorFee || 0), 0);
  const totalOverhead = list.reduce((a, c) => a + (c.overheadFee || 0), 0);
  const totalTextbook = list.reduce((a, c) => a + (c.textbookFee || 0), 0);
  const totalMaterial = list.reduce((a, c) => a + (c.materialFee || 0), 0);
  const totalFeeSum = list.reduce((a, c) => a + (c.totalFee || c.fee || 0), 0);
  const totalCollected = list.reduce((a, c) => a + (c.collectedAmount !== undefined ? c.collectedAmount : (c.outOfPocket || 0)), 0);
  const totalSubsidized = list.reduce((a, c) => a + (c.subsidizedAmount || 0), 0);
  const totalBalance = totalFeeSum - totalSubsidized;

  const rowsHtml = list.map((a, idx) => {
    const fee = a.totalFee || a.fee || 0;
    const sub = a.subsidizedAmount || 0;
    const col = a.collectedAmount !== undefined ? a.collectedAmount : (a.outOfPocket || 0);
    const bal = fee - sub;
    const isEven = idx % 2 === 1;
    const rowBg = isEven ? '#f8fafc' : '#ffffff';

    return `
    <tr style="background-color: ${rowBg};">
      <td style="mso-number-format:'0';">${idx + 1}</td>
      <td>${a.grade}</td>
      <td>일반</td>
      <td>${a.classNum}</td>
      <td>${a.studentNum}</td>
      <td style="font-weight:bold; color:#0f172a;">${a.studentName}</td>
      <td>1순위</td>
      <td>기초/차상위</td>
      <td>${a.month || '3월'}</td>
      <td style="text-align:left; font-weight:500;">${a.courseTitle || ''}</td>
      <td class="num">${(a.tuitionFee || 0).toLocaleString()}</td>
      <td class="num">${(a.instructorFee || 0).toLocaleString()}</td>
      <td class="num">${(a.overheadFee || 0).toLocaleString()}</td>
      <td class="num">${(a.textbookFee || 0).toLocaleString()}</td>
      <td class="num">${(a.materialFee || 0).toLocaleString()}</td>
      <td class="num" style="font-weight:bold; background-color:#f1f5f9;">${fee.toLocaleString()}</td>
      <td class="num" style="font-weight:bold; color:#c2410c; background-color:#fff7ed;">${col.toLocaleString()}</td>
      <td class="num" style="font-weight:bold; color:#1d4ed8; background-color:#eff6ff;">${sub.toLocaleString()}</td>
      <td class="num">${bal.toLocaleString()}</td>
      <td>${col === 0 ? '전액지원' : '일부지원'}</td>
    </tr>
  `;
  }).join('');

  const excelHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <style>
    body { font-family: '맑은 고딕', Arial, sans-serif; font-size: 9.5pt; color: #1e293b; }
    table { border-collapse: collapse; width: 100%; }
    th { border: 1px solid #94a3b8; padding: 7px 6px; font-weight: bold; text-align: center; vertical-align: middle; font-size: 9.5pt; }
    td { border: 1px solid #cbd5e1; padding: 6px 6px; vertical-align: middle; text-align: center; font-size: 9pt; }
    .title-cell { font-size: 16pt; font-weight: bold; text-align: left; color: #1e40af; padding: 14px 4px 4px 4px; }
    .meta-bar { font-size: 9.5pt; color: #475569; padding: 6px 4px 10px 4px; text-align: left; border: none; }
    .num { text-align: right; mso-number-format: "#,##0"; }
    .header-base { background-color: #f1f5f9; color: #334155; }
    .header-calc { background-color: #e0f2fe; color: #0369a1; }
    .header-collect { background-color: #ffedd5; color: #9a3412; }
    .header-sub { background-color: #dbeafe; color: #1e40af; }
    .total-row td { background-color: #fef3c7; font-weight: bold; color: #92400e; border-top: 2px solid #ca8a04; border-bottom: 2px solid #ca8a04; font-size: 9.5pt; }
  </style>
</head>
<body>
  <table>
    <tr><td colspan="20" class="title-cell">2026학년도 방과후학교 지원금 수강자 목록 (검색결과)</td></tr>
    <tr>
      <td colspan="20" class="meta-bar">
        ■ <strong>광주풍향초등학교</strong> | 출력일시: ${new Date().toLocaleString('ko-KR')} | 총 검색 건수: <strong>${list.length}명</strong> | 수강총액: <strong>${totalFeeSum.toLocaleString()}원</strong> | 총 지원금: <strong>${totalSubsidized.toLocaleString()}원</strong> | 총 징수금액: <strong>${totalCollected.toLocaleString()}원</strong>
      </td>
    </tr>
    <tr>
      <th rowspan="2" class="header-base" style="width:40px;">연번</th>
      <th rowspan="2" class="header-base" style="width:45px;">학년</th>
      <th rowspan="2" class="header-base" style="width:45px;">학과</th>
      <th rowspan="2" class="header-base" style="width:40px;">반</th>
      <th rowspan="2" class="header-base" style="width:40px;">번호</th>
      <th rowspan="2" class="header-base" style="width:75px;">이름</th>
      <th rowspan="2" class="header-base" style="width:55px;">순위</th>
      <th rowspan="2" class="header-base" style="width:80px;">순위 구분</th>
      <th rowspan="2" class="header-base" style="width:45px;">월</th>
      <th rowspan="2" class="header-base" style="width:160px;">강좌명</th>
      <th colspan="6" class="header-calc">신청 / 산출 내역 (A)</th>
      <th rowspan="2" class="header-collect" style="width:85px;">징수금액(A-B)</th>
      <th rowspan="2" class="header-sub" style="width:85px;">지원금액(B)</th>
      <th rowspan="2" class="header-base" style="width:85px;">지원금 잔액</th>
      <th rowspan="2" class="header-base" style="width:65px;">비고</th>
    </tr>
    <tr>
      <th class="header-calc" style="width:70px;">수강료</th>
      <th class="header-calc" style="width:70px;">강사료</th>
      <th class="header-calc" style="width:65px;">수용비</th>
      <th class="header-calc" style="width:65px;">교재비</th>
      <th class="header-calc" style="width:65px;">재료비</th>
      <th class="header-calc" style="width:75px; font-weight:bold;">합계</th>
    </tr>
    ${rowsHtml}
    <tr class="total-row">
      <td colspan="10" style="text-align:center;">총 결산 합계 (${list.length}명)</td>
      <td class="num">${totalTuition.toLocaleString()}</td>
      <td class="num">${totalInstructor.toLocaleString()}</td>
      <td class="num">${totalOverhead.toLocaleString()}</td>
      <td class="num">${totalTextbook.toLocaleString()}</td>
      <td class="num">${totalMaterial.toLocaleString()}</td>
      <td class="num" style="background-color:#fef08a;">${totalFeeSum.toLocaleString()}</td>
      <td class="num" style="color:#c2410c; background-color:#fed7aa;">${totalCollected.toLocaleString()}</td>
      <td class="num" style="color:#1d4ed8; background-color:#bfdbfe;">${totalSubsidized.toLocaleString()}</td>
      <td class="num">${totalBalance.toLocaleString()}</td>
      <td>-</td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="subsidy_applicants_search_result.xls"');
  return res.send(Buffer.from(excelHtml, 'utf-8'));
});

// 2. 전체징수현황 엑셀 (/af/ad_free2_app/excel_all_collect)
app.get(/^\/af\/ad_free2_app\/excel_all_collect/, (req, res) => {
  const list = db.getSubsidyApplicants('sch_1');
  const totalFeeSum = list.reduce((a, c) => a + (c.totalFee || c.fee || 0), 0);
  const totalSub = list.reduce((a, c) => a + (c.subsidizedAmount || 0), 0);
  const totalCol = list.reduce((a, c) => a + (c.collectedAmount !== undefined ? c.collectedAmount : (c.outOfPocket || 0)), 0);

  const rowsHtml = list.map((a, idx) => {
    const fee = a.totalFee || a.fee || 0;
    const sub = a.subsidizedAmount || 0;
    const col = a.collectedAmount !== undefined ? a.collectedAmount : (a.outOfPocket || 0);
    const isEven = idx % 2 === 1;
    const rowBg = isEven ? '#f8fafc' : '#ffffff';

    return `
    <tr style="background-color: ${rowBg};">
      <td style="mso-number-format:'0';">${idx + 1}</td>
      <td style="text-align:left; font-weight:500;">${a.courseTitle || ''}</td>
      <td>${a.grade}학년</td>
      <td>${a.classNum}반</td>
      <td>${a.studentNum}번</td>
      <td style="font-weight:bold; color:#0f172a;">${a.studentName}</td>
      <td>${a.month || '3월'}</td>
      <td class="num" style="font-weight:bold;">${fee.toLocaleString()}</td>
      <td class="num" style="color:#1d4ed8; font-weight:bold; background-color:#eff6ff;">${sub.toLocaleString()}</td>
      <td class="num" style="color:#c2410c; font-weight:bold; background-color:#fff7ed;">${col.toLocaleString()}</td>
      <td><span style="font-weight:bold; color:${col === 0 ? '#15803d' : '#0369a1'};">${col === 0 ? '전액지원' : '수납완료'}</span></td>
      <td>${a.subsidyType || '자유수강권'}</td>
    </tr>
  `;
  }).join('');

  const excelHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <style>
    body { font-family: '맑은 고딕', Arial, sans-serif; font-size: 10pt; color: #1e293b; }
    table { border-collapse: collapse; width: 100%; }
    th { background-color: #d1fae5; border: 1px solid #6ee7b7; padding: 8px 8px; font-weight: bold; text-align: center; font-size: 10pt; color: #065f46; }
    td { border: 1px solid #cbd5e1; padding: 7px 8px; vertical-align: middle; text-align: center; font-size: 9.5pt; }
    .title-cell { font-size: 16pt; font-weight: bold; text-align: left; color: #047857; padding: 14px 4px 6px 4px; }
    .meta-bar { font-size: 9.5pt; color: #475569; padding: 6px 4px 10px 4px; text-align: left; border: none; }
    .num { text-align: right; mso-number-format: "#,##0"; }
    .total-row td { background-color: #fef3c7; font-weight: bold; color: #92400e; border-top: 2px solid #b45309; border-bottom: 2px solid #b45309; font-size: 10pt; }
  </style>
</head>
<body>
  <table>
    <tr><td colspan="12" class="title-cell">2026학년도 광주풍향초등학교 지원금 전체 징수 및 지원 현황표</td></tr>
    <tr>
      <td colspan="12" class="meta-bar">
        ■ <strong>광주풍향초등학교</strong> | 출력일시: ${new Date().toLocaleString('ko-KR')} | 총 대상: <strong>${list.length}명</strong> | 수강총액: <strong>${totalFeeSum.toLocaleString()}원</strong> | 총 지원금: <strong>${totalSub.toLocaleString()}원</strong> | 실 징수총액: <strong>${totalCol.toLocaleString()}원</strong>
      </td>
    </tr>
    <tr>
      <th style="width:40px;">연번</th>
      <th style="width:200px;">강좌명</th>
      <th style="width:60px;">학년</th>
      <th style="width:50px;">반</th>
      <th style="width:50px;">번호</th>
      <th style="width:85px;">학생명</th>
      <th style="width:55px;">대상월</th>
      <th style="width:110px;">총 수강비용(A)</th>
      <th style="width:110px;">지원금 차감액(B)</th>
      <th style="width:115px;">징수(본인부담)금액(A-B)</th>
      <th style="width:85px;">수납상태</th>
      <th style="width:100px;">비고</th>
    </tr>
    ${rowsHtml}
    <tr class="total-row">
      <td colspan="7" style="text-align:center;">총 결산 합계 (${list.length}건)</td>
      <td class="num">${totalFeeSum.toLocaleString()}</td>
      <td class="num" style="color:#1d4ed8;">${totalSub.toLocaleString()}</td>
      <td class="num" style="color:#c2410c;">${totalCol.toLocaleString()}</td>
      <td>완료</td>
      <td>전액 결산</td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="subsidy_all_collection_report.xls"');
  return res.send(Buffer.from(excelHtml, 'utf-8'));
});

// 3. 월별현황 엑셀 (공식 BIN002C 서식 1:1 프리미엄 엑셀)
app.get(/^\/af\/ad_free2_app\/excel_monthly/, (req, res) => {
  const { month } = req.query;
  const list = db.getSubsidyApplicants('sch_1');
  const targetMonth = month || '3월';

  const months = ['3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월', '1월', '2월'];
  const monthSums = {};
  months.forEach(m => { monthSums[m] = 0; });

  let grandUsedTotal = 0;
  let grandTotalLimit = 0;
  let grandRemain = 0;
  let grandRecentCollect = 0;
  let grandTotalCollect = 0;

  const rowsHtml = list.map((a, idx) => {
    const sub = a.subsidizedAmount || 0;
    const col = a.collectedAmount !== undefined ? a.collectedAmount : (a.outOfPocket || 0);
    const limit = 600000;
    const remain = Math.max(0, limit - sub);
    const isEven = idx % 2 === 1;
    const rowBg = isEven ? '#f8fafc' : '#ffffff';

    grandUsedTotal += sub;
    grandTotalLimit += limit;
    grandRemain += remain;
    grandRecentCollect += col;
    grandTotalCollect += col;

    const monthCols = months.map(m => {
      const val = (a.month === m) ? sub : 0;
      monthSums[m] += val;
      return `<td class="num">${val > 0 ? val.toLocaleString() : '-'}</td>`;
    }).join('');

    return `
    <tr style="background-color: ${rowBg};">
      <td style="mso-number-format:'0';">${idx + 1}</td>
      <td>${a.grade}</td>
      <td>일반</td>
      <td>${a.classNum}</td>
      <td>${a.studentNum}</td>
      <td style="font-weight:bold; color:#0f172a;">${a.studentName}</td>
      <td>자유수강권</td>
      <td>1순위</td>
      <td>차상위</td>
      ${monthCols}
      <td class="num" style="font-weight:bold; color:#1d4ed8; background-color:#eff6ff;">${sub.toLocaleString()}</td>
      <td class="num" style="color:#047857; font-weight:bold;">${remain.toLocaleString()}</td>
      <td class="num">${limit.toLocaleString()}</td>
      <td class="num" style="color:#dc2626; font-weight:bold; background-color:#fef2f2;">${col.toLocaleString()}</td>
      <td class="num" style="color:#dc2626; font-weight:bold; background-color:#fef2f2;">${col.toLocaleString()}</td>
      <td>전체</td>
      <td>정상</td>
    </tr>
  `;
  }).join('');

  const monthTotalCols = months.map(m => `
    <td class="num">${monthSums[m] > 0 ? monthSums[m].toLocaleString() : '-'}</td>
  `).join('');

  const excelHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <style>
    body { font-family: '맑은 고딕', Arial, sans-serif; font-size: 9pt; color: #1e293b; }
    table { border-collapse: collapse; width: 100%; }
    th { background-color: #e0e7ff; border: 1px solid #94a3b8; padding: 7px 4px; font-weight: bold; text-align: center; vertical-align: middle; font-size: 9pt; color: #3730a3; }
    td { border: 1px solid #cbd5e1; padding: 5px 4px; vertical-align: middle; text-align: center; font-size: 8.5pt; }
    .title-cell { font-size: 16pt; font-weight: bold; text-align: left; color: #312e81; padding: 14px 4px 6px 4px; }
    .meta-bar { font-size: 9.5pt; color: #475569; padding: 6px 4px 10px 4px; text-align: left; border: none; }
    .num { text-align: right; mso-number-format: "#,##0"; }
    .total-row td { background-color: #fef3c7; font-weight: bold; color: #92400e; border-top: 2px solid #ca8a04; border-bottom: 2px solid #ca8a04; font-size: 9pt; }
  </style>
</head>
<body>
  <table>
    <tr><td colspan="28" class="title-cell">2026학년도 방과후 지원금 대상자 월별 지원 현황 대장</td></tr>
    <tr>
      <td colspan="28" class="meta-bar">
        ■ <strong>광주풍향초등학교</strong> | 기준 월: <strong>${targetMonth}</strong> | 출력일시: ${new Date().toLocaleString('ko-KR')} | 대상 학생: <strong>${list.length}명</strong>
      </td>
    </tr>
    <tr>
      <th style="width:35px;">연번</th><th style="width:38px;">학년</th><th style="width:38px;">학과</th><th style="width:35px;">반</th><th style="width:35px;">번호</th><th style="width:65px;">이름</th><th style="width:75px;">지원금</th><th style="width:45px;">순위</th><th style="width:65px;">순위 구분</th>
      <th style="width:55px;">3월</th><th style="width:55px;">4월</th><th style="width:55px;">5월</th><th style="width:55px;">6월</th><th style="width:55px;">7월</th><th style="width:55px;">8월</th><th style="width:55px;">9월</th><th style="width:55px;">10월</th><th style="width:55px;">11월</th><th style="width:55px;">12월</th><th style="width:55px;">1월</th><th style="width:55px;">2월</th>
      <th style="width:75px; background-color:#bfdbfe; color:#1e40af;">사용합계</th>
      <th style="width:75px;">남은금액</th>
      <th style="width:75px;">총액</th>
      <th style="width:75px; color:#b91c1c; background-color:#fee2e2;">징수(최근월)</th>
      <th style="width:75px; color:#b91c1c; background-color:#fee2e2;">징수금액</th>
      <th style="width:60px;">지원기간</th>
      <th style="width:50px;">비고</th>
    </tr>
    ${rowsHtml}
    <tr class="total-row">
      <td colspan="9" style="text-align:center;">총 결산 합계 (${list.length}명)</td>
      ${monthTotalCols}
      <td class="num" style="color:#1d4ed8;">${grandUsedTotal.toLocaleString()}</td>
      <td class="num" style="color:#047857;">${grandRemain.toLocaleString()}</td>
      <td class="num">${grandTotalLimit.toLocaleString()}</td>
      <td class="num" style="color:#dc2626;">${grandRecentCollect.toLocaleString()}</td>
      <td class="num" style="color:#dc2626;">${grandTotalCollect.toLocaleString()}</td>
      <td>-</td>
      <td>정상</td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="subsidy_monthly_status_report.xls"');
  return res.send(Buffer.from(excelHtml, 'utf-8'));
});

// 4. 스쿨뱅킹현황 엑셀 (공식 BIN002A 서식 1:1 프리미엄 엑셀)
app.get(/^\/af\/ad_free2_app\/excel_banking/, (req, res) => {
  const { month } = req.query;
  const list = db.getSubsidyApplicants('sch_1');
  const targetMonth = month || '6월';

  let totalUnitFee = 0;
  let totalFeeSum = 0;
  let totalCollectFee = 0;
  let totalSubFee = 0;

  const rowsHtml = list.map((a, idx) => {
    const fee = a.totalFee || a.fee || 0;
    const sub = a.subsidizedAmount || 0;
    const col = a.collectedAmount !== undefined ? a.collectedAmount : (a.outOfPocket || 0);
    const instFee = a.instructorFee || Math.round(fee * 0.95);
    const ovhFee = a.overheadFee || (fee - instFee);

    totalUnitFee += fee;
    totalFeeSum += fee;
    totalCollectFee += col;
    totalSubFee += sub;

    const isEven = idx % 2 === 1;
    const rowBg = isEven ? '#f8fafc' : '#ffffff';

    return `
    <tr style="background-color: ${rowBg};">
      <td style="mso-number-format:'0';">${idx + 1}</td>
      <td style="text-align:left; font-weight:500;">${a.courseTitle || ''}</td>
      <td style="text-align:left;">${a.courseTitle || ''}</td>
      <td>tea0${(idx % 4) + 1}</td>
      <td>1</td>
      <td>1</td>
      <td class="num">${fee.toLocaleString()}</td>
      <td class="num" style="font-weight:bold;">${fee.toLocaleString()}</td>
      <!-- 징수 -->
      <td>${col > 0 ? 1 : 0}</td>
      <td class="num">${col > 0 ? instFee.toLocaleString() : 0}</td>
      <td class="num">${col > 0 ? ovhFee.toLocaleString() : 0}</td>
      <td class="num" style="color:#c2410c;">${col.toLocaleString()}</td>
      <td class="num" style="color:#c2410c; font-weight:bold; background-color:#fff7ed;">${col.toLocaleString()}</td>
      <!-- 자유수강권 -->
      <td>${sub > 0 ? 1 : 0}</td>
      <td class="num">${sub > 0 ? instFee.toLocaleString() : 0}</td>
      <td class="num">${sub > 0 ? ovhFee.toLocaleString() : 0}</td>
      <td class="num" style="color:#1d4ed8;">${sub.toLocaleString()}</td>
      <td class="num" style="color:#1d4ed8; font-weight:bold; background-color:#eff6ff;">${sub.toLocaleString()}</td>
      <!-- 1학년/추가지원금 -->
      <td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
      <!-- 최종 스쿨뱅킹 출금액 -->
      <td class="num" style="font-weight:bold; color:#b45309; background-color:#fef3c7;">${col.toLocaleString()}</td>
      <td class="num">${instFee.toLocaleString()}</td>
      <td class="num">${ovhFee.toLocaleString()}</td>
      <td>수강료</td>
    </tr>
  `;
  }).join('');

  const excelHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <style>
    body { font-family: '맑은 고딕', Arial, sans-serif; font-size: 9pt; color: #1e293b; }
    table { border-collapse: collapse; width: 100%; }
    th { border: 1px solid #94a3b8; padding: 6px 4px; font-weight: bold; text-align: center; vertical-align: middle; font-size: 9pt; }
    td { border: 1px solid #cbd5e1; padding: 5px 4px; vertical-align: middle; text-align: center; font-size: 8.5pt; }
    .title-cell { font-size: 16pt; font-weight: bold; text-align: left; color: #9a3412; padding: 14px 4px 6px 4px; }
    .meta-bar { font-size: 9.5pt; color: #475569; padding: 6px 4px 10px 4px; text-align: left; border: none; }
    .num { text-align: right; mso-number-format: "#,##0"; }
    .th-base { background-color: #f1f5f9; color: #334155; }
    .th-col { background-color: #fed7aa; color: #9a3412; }
    .th-free { background-color: #fef08a; color: #854d0e; }
    .th-add { background-color: #e9d5ff; color: #6b21a8; }
    .th-final { background-color: #fde68a; color: #78350f; }
    .total-row td { background-color: #fef3c7; font-weight: bold; color: #92400e; border-top: 2px solid #ca8a04; border-bottom: 2px solid #ca8a04; font-size: 9pt; }
  </style>
</head>
<body>
  <table>
    <tr><td colspan="27" class="title-cell">2026학년도 방과후학교 지원금 스쿨뱅킹 수납 현황표 (${targetMonth})</td></tr>
    <tr>
      <td colspan="27" class="meta-bar">
        ■ <strong>광주풍향초등학교</strong> | 대상 월: <strong>${targetMonth}</strong> | 출력일시: ${new Date().toLocaleString('ko-KR')} | 총 강좌: <strong>${list.length}건</strong> | 스쿨뱅킹 총 수납액: <strong>${totalCollectFee.toLocaleString()}원</strong>
      </td>
    </tr>
    <tr>
      <th rowspan="2" class="th-base" style="width:35px;">연번</th>
      <th rowspan="2" class="th-base" style="width:140px;">강좌명</th>
      <th rowspan="2" class="th-base" style="width:140px;">나이스 강좌명</th>
      <th rowspan="2" class="th-base" style="width:60px;">강사ID</th>
      <th rowspan="2" class="th-base" style="width:45px;">학생수</th>
      <th rowspan="2" class="th-base" style="width:45px;">학생수합</th>
      <th rowspan="2" class="th-base" style="width:70px;">단가</th>
      <th rowspan="2" class="th-base" style="width:75px;">금액</th>
      <th colspan="5" class="th-col">징수(스쿨뱅킹)</th>
      <th colspan="5" class="th-free">자유수강권</th>
      <th colspan="5" class="th-add">1학년/추가지원금</th>
      <th rowspan="2" class="th-final" style="width:85px;">스쿨뱅킹출금액</th>
      <th rowspan="2" class="th-base" style="width:70px;">강사료</th>
      <th rowspan="2" class="th-base" style="width:60px;">수용비</th>
      <th rowspan="2" class="th-base" style="width:55px;">비고</th>
    </tr>
    <tr>
      <th class="th-col" style="width:40px;">학생수</th>
      <th class="th-col" style="width:60px;">강사료</th>
      <th class="th-col" style="width:55px;">수용비</th>
      <th class="th-col" style="width:65px;">징수금액</th>
      <th class="th-col" style="width:70px;">징수합계</th>
      <th class="th-free" style="width:40px;">학생수</th>
      <th class="th-free" style="width:60px;">강사료</th>
      <th class="th-free" style="width:55px;">수용비</th>
      <th class="th-free" style="width:65px;">지원금액</th>
      <th class="th-free" style="width:70px;">지원합계</th>
      <th class="th-add" style="width:40px;">학생수</th>
      <th class="th-add" style="width:60px;">강사료</th>
      <th class="th-add" style="width:55px;">수용비</th>
      <th class="th-add" style="width:65px;">지원금액</th>
      <th class="th-add" style="width:70px;">지원합계</th>
    </tr>
    ${rowsHtml}
    <tr class="total-row">
      <td colspan="6" style="text-align:center;">총 결산 합계 (${list.length}건)</td>
      <td class="num">${totalUnitFee.toLocaleString()}</td>
      <td class="num">${totalFeeSum.toLocaleString()}</td>
      <td>-</td><td>-</td><td>-</td>
      <td class="num">${totalCollectFee.toLocaleString()}</td>
      <td class="num" style="color:#c2410c;">${totalCollectFee.toLocaleString()}</td>
      <td>-</td><td>-</td><td>-</td>
      <td class="num">${totalSubFee.toLocaleString()}</td>
      <td class="num" style="color:#1d4ed8;">${totalSubFee.toLocaleString()}</td>
      <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>
      <td class="num" style="color:#b45309;">${totalCollectFee.toLocaleString()}</td>
      <td>-</td><td>-</td><td>정산완료</td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="subsidy_school_banking_${encodeURIComponent(targetMonth)}.xls"`);
  return res.send(Buffer.from(excelHtml, 'utf-8'));
});

// 5. 행정실용 엑셀 (공식 BIN0023 / BIN0027 서식 1:1 프리미엄 엑셀)
app.get(/^\/af\/ad_free2_app\/excel_admin/, (req, res) => {
  const { month } = req.query;
  const list = db.getSubsidyApplicants('sch_1');
  const targetMonth = month || '6월';

  let grandTotalFee = 0;
  let grandCollect = 0;
  let grandSub = 0;

  const rowsHtml = list.map((a, idx) => {
    const fee = a.totalFee || a.fee || 0;
    const sub = a.subsidizedAmount || 0;
    const col = a.collectedAmount !== undefined ? a.collectedAmount : (a.outOfPocket || 0);
    const isEven = idx % 2 === 1;
    const rowBg = isEven ? '#f8fafc' : '#ffffff';

    grandTotalFee += fee;
    grandCollect += col;
    grandSub += sub;

    return `
    <tr style="background-color: ${rowBg};">
      <td style="mso-number-format:'0';">${idx + 1}</td>
      <td>${a.grade}학년</td>
      <td>일반</td>
      <td>${a.classNum}반</td>
      <td>${a.studentNum}</td>
      <td style="font-weight:bold; color:#0f172a;">${a.studentName}</td>
      <!-- 수강료 -->
      <td class="num">${(a.tuitionFee || 0).toLocaleString()}</td>
      <td class="num" style="color:#c2410c;">${col.toLocaleString()}</td>
      <td class="num" style="color:#1d4ed8;">${sub.toLocaleString()}</td>
      <td class="num">0</td><td class="num">0</td>
      <!-- 교재비 -->
      <td class="num">${(a.textbookFee || 0).toLocaleString()}</td>
      <td class="num">0</td>
      <td class="num" style="color:#1d4ed8;">${(a.textbookFee || 0).toLocaleString()}</td>
      <td class="num">0</td><td class="num">0</td>
      <!-- 재료비 -->
      <td class="num">${(a.materialFee || 0).toLocaleString()}</td>
      <td class="num">0</td>
      <td class="num" style="color:#1d4ed8;">${(a.materialFee || 0).toLocaleString()}</td>
      <td class="num">0</td><td class="num">0</td>
      <!-- 총액 결산 -->
      <td class="num" style="font-weight:bold; background-color:#f1f5f9;">${fee.toLocaleString()}</td>
      <td class="num" style="color:#dc2626; font-weight:bold; background-color:#fff7ed;">${col.toLocaleString()}</td>
      <td class="num" style="color:#1d4ed8; font-weight:bold; background-color:#eff6ff;">${sub.toLocaleString()}</td>
      <td style="text-align:left; font-weight:500;">${a.courseTitle || ''}</td>
      <td>tea0${(idx % 4) + 1}</td>
      <td>에듀파인반영</td>
    </tr>
  `;
  }).join('');

  const excelHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <style>
    body { font-family: '맑은 고딕', Arial, sans-serif; font-size: 9pt; color: #1e293b; }
    table { border-collapse: collapse; width: 100%; }
    th { border: 1px solid #94a3b8; padding: 6px 4px; font-weight: bold; text-align: center; vertical-align: middle; font-size: 9pt; }
    td { border: 1px solid #cbd5e1; padding: 5px 4px; vertical-align: middle; text-align: center; font-size: 8.5pt; }
    .title-cell { font-size: 16pt; font-weight: bold; text-align: left; color: #831843; padding: 14px 4px 6px 4px; }
    .meta-bar { font-size: 9.5pt; color: #475569; padding: 6px 4px 10px 4px; text-align: left; border: none; }
    .num { text-align: right; mso-number-format: "#,##0"; }
    .th-base { background-color: #f1f5f9; color: #334155; }
    .th-tui { background-color: #bae6fd; color: #0369a1; }
    .th-book { background-color: #bbf7d0; color: #15803d; }
    .th-item { background-color: #fef08a; color: #854d0e; }
    .th-sum { background-color: #fed7aa; color: #9a3412; }
    .total-row td { background-color: #fef3c7; font-weight: bold; color: #92400e; border-top: 2px solid #ca8a04; border-bottom: 2px solid #ca8a04; font-size: 9pt; }
  </style>
</head>
<body>
  <table>
    <tr><td colspan="26" class="title-cell">에듀파인 수입관리 연계용 학생기준 강사별 지원금 감면자 목록 (${targetMonth})</td></tr>
    <tr>
      <td colspan="26" class="meta-bar">
        ■ <strong>광주풍향초등학교</strong> | 대상 월: <strong>${targetMonth}</strong> | 출력일시: ${new Date().toLocaleString('ko-KR')} | 총 감면 대상: <strong>${list.length}명</strong> | 수입총액: <strong>${grandTotalFee.toLocaleString()}원</strong> | 총 감면(지원)액: <strong>${grandSub.toLocaleString()}원</strong>
      </td>
    </tr>
    <tr>
      <th rowspan="2" class="th-base" style="width:35px;">연번</th>
      <th rowspan="2" class="th-base" style="width:50px;">학년</th>
      <th rowspan="2" class="th-base" style="width:40px;">학과</th>
      <th rowspan="2" class="th-base" style="width:40px;">반</th>
      <th rowspan="2" class="th-base" style="width:40px;">번호</th>
      <th rowspan="2" class="th-base" style="width:65px;">이름</th>
      <th colspan="5" class="th-tui">수강료</th>
      <th colspan="5" class="th-book">교재비</th>
      <th colspan="5" class="th-item">재료비</th>
      <th rowspan="2" class="th-sum" style="width:80px;">금액합계</th>
      <th rowspan="2" class="th-sum" style="width:80px; color:#c2410c;">징수금액합계</th>
      <th rowspan="2" class="th-sum" style="width:80px; color:#1d4ed8;">지원금액합계</th>
      <th rowspan="2" class="th-base" style="width:140px;">강좌</th>
      <th rowspan="2" class="th-base" style="width:60px;">강사ID</th>
      <th rowspan="2" class="th-base" style="width:65px;">비고</th>
    </tr>
    <tr>
      <th class="th-tui" style="width:65px;">금액</th>
      <th class="th-tui" style="width:65px;">징수금액</th>
      <th class="th-tui" style="width:65px;">자유수강권</th>
      <th class="th-tui" style="width:55px;">다자녀</th>
      <th class="th-tui" style="width:55px;">농어촌</th>
      <th class="th-book" style="width:65px;">금액</th>
      <th class="th-book" style="width:65px;">징수금액</th>
      <th class="th-book" style="width:65px;">자유수강권</th>
      <th class="th-book" style="width:55px;">다자녀</th>
      <th class="th-book" style="width:55px;">농어촌</th>
      <th class="th-item" style="width:65px;">금액</th>
      <th class="th-item" style="width:65px;">징수금액</th>
      <th class="th-item" style="width:65px;">자유수강권</th>
      <th class="th-item" style="width:55px;">다자녀</th>
      <th class="th-item" style="width:55px;">농어촌</th>
    </tr>
    ${rowsHtml}
    <tr class="total-row">
      <td colspan="6" style="text-align:center;">총 결산 합계 (${list.length}명)</td>
      <td colspan="5" class="num">${grandTotalFee.toLocaleString()}</td>
      <td colspan="5" class="num">0</td>
      <td colspan="5" class="num">0</td>
      <td class="num">${grandTotalFee.toLocaleString()}</td>
      <td class="num" style="color:#c2410c;">${grandCollect.toLocaleString()}</td>
      <td class="num" style="color:#1d4ed8;">${grandSub.toLocaleString()}</td>
      <td colspan="3">에듀파인 연계 완료</td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="subsidy_admin_office_report_${encodeURIComponent(targetMonth)}.xls"`);
  return res.send(Buffer.from(excelHtml, 'utf-8'));
});

// 6. 나이스용 엑셀 (/af/ad_free2_app/excel_neis)
app.get(/^\/af\/ad_free2_app\/excel_neis/, (req, res) => {
  const { month } = req.query;
  const list = db.getSubsidyApplicants('sch_1');
  const targetMonth = month || '6월';

  let grandFee = 0;
  let grandSub = 0;
  let grandCol = 0;

  const rowsHtml = list.map((a, idx) => {
    const fee = a.totalFee || a.fee || 0;
    const sub = a.subsidizedAmount || 0;
    const col = a.collectedAmount !== undefined ? a.collectedAmount : (a.outOfPocket || 0);
    const isEven = idx % 2 === 1;
    const rowBg = isEven ? '#f8fafc' : '#ffffff';

    grandFee += fee;
    grandSub += sub;
    grandCol += col;

    return `
    <tr style="background-color: ${rowBg};">
      <td style="mso-number-format:'0';">${idx + 1}</td>
      <td>${a.grade}</td>
      <td>${a.classNum}</td>
      <td>${a.studentNum}</td>
      <td style="font-weight:bold; color:#0f172a;">${a.studentName}</td>
      <td>자유수강권</td>
      <td>방과후학교</td>
      <td style="text-align:left; font-weight:500;">${a.courseTitle || ''}</td>
      <td class="num">${fee.toLocaleString()}</td>
      <td class="num" style="font-weight:bold; color:#1d4ed8; background-color:#eff6ff;">${sub.toLocaleString()}</td>
      <td class="num" style="font-weight:bold; color:#c2410c; background-color:#fff7ed;">${col.toLocaleString()}</td>
      <td>${targetMonth}</td>
      <td><span style="font-weight:bold; color:#15803d;">정상등록</span></td>
      <td>-</td>
    </tr>
  `;
  }).join('');

  const excelHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <style>
    body { font-family: '맑은 고딕', Arial, sans-serif; font-size: 9.5pt; color: #1e293b; }
    table { border-collapse: collapse; width: 100%; }
    th { background-color: #f1f5f9; border: 1px solid #94a3b8; padding: 8px 6px; font-weight: bold; text-align: center; vertical-align: middle; font-size: 9.5pt; color: #0f172a; }
    td { border: 1px solid #cbd5e1; padding: 6px 6px; vertical-align: middle; text-align: center; font-size: 9pt; }
    .title-cell { font-size: 16pt; font-weight: bold; text-align: left; color: #0f172a; padding: 14px 4px 6px 4px; }
    .meta-bar { font-size: 9.5pt; color: #475569; padding: 6px 4px 10px 4px; text-align: left; border: none; }
    .num { text-align: right; mso-number-format: "#,##0"; }
    .total-row td { background-color: #fef3c7; font-weight: bold; color: #92400e; border-top: 2px solid #ca8a04; border-bottom: 2px solid #ca8a04; font-size: 9.5pt; }
  </style>
</head>
<body>
  <table>
    <tr><td colspan="14" class="title-cell">나이스(NEIS) 학교행정업무 연계용 방과후 지원금 대상자 명단 (${targetMonth})</td></tr>
    <tr>
      <td colspan="14" class="meta-bar">
        ■ <strong>광주풍향초등학교</strong> | 대상 월: <strong>${targetMonth}</strong> | 출력일시: ${new Date().toLocaleString('ko-KR')} | 나이스 등록 대상: <strong>${list.length}명</strong> | 지원금 총액: <strong>${grandSub.toLocaleString()}원</strong>
      </td>
    </tr>
    <tr>
      <th style="width:40px;">연번</th>
      <th style="width:45px;">학년</th>
      <th style="width:40px;">반</th>
      <th style="width:40px;">번호</th>
      <th style="width:75px;">성명</th>
      <th style="width:85px;">지원영역</th>
      <th style="width:85px;">수강과정</th>
      <th style="width:170px;">강좌명</th>
      <th style="width:80px;">수강비용</th>
      <th style="width:85px; background-color:#dbeafe; color:#1e40af;">지원금액</th>
      <th style="width:85px; background-color:#ffedd5; color:#9a3412;">실징수액</th>
      <th style="width:55px;">해당월</th>
      <th style="width:70px;">처리상태</th>
      <th style="width:60px;">비고</th>
    </tr>
    ${rowsHtml}
    <tr class="total-row">
      <td colspan="8" style="text-align:center;">총 결산 합계 (${list.length}명)</td>
      <td class="num">${grandFee.toLocaleString()}</td>
      <td class="num" style="color:#1d4ed8;">${grandSub.toLocaleString()}</td>
      <td class="num" style="color:#c2410c;">${grandCol.toLocaleString()}</td>
      <td>${targetMonth}</td>
      <td>완료</td>
      <td>-</td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="subsidy_neis_upload_format.xls"`);
  return res.send(Buffer.from(excelHtml, 'utf-8'));
});




// ==================== [Sprint 2] 설문관리 (/af/ad_sur) API & 엑셀 출력 ====================

let dbSurveys = [
  {
    "num": 11977,
    "sur_type": 3,
    "title": "[2026년] 늘봄학교 강사 만족도 조사 설문지(학부모용)",
    "ans_grp_txt": "학부모",
    "que_cnt": 7,
    "ans_cnt": 129,
    "sur_sdate": "2026-06-10",
    "sur_edate": "2026-06-15"
  },
  {
    "num": 11976,
    "sur_type": 3,
    "title": "[2026년] 늘봄학교 강사 만족도 조사 설문지(학생용)",
    "ans_grp_txt": "학생",
    "que_cnt": 5,
    "ans_cnt": 86,
    "sur_sdate": "2026-06-10",
    "sur_edate": "2026-06-15"
  },
  {
    "num": 11975,
    "sur_type": 1,
    "title": "[2026년] 늘봄학교 만족도 조사 설문지(학부모용)",
    "ans_grp_txt": "학부모",
    "que_cnt": 5,
    "ans_cnt": 34,
    "sur_sdate": "2026-06-10",
    "sur_edate": "2026-06-15"
  },
  {
    "num": 11974,
    "sur_type": 1,
    "title": "[2026년] 늘봄학교 만족도 조사 설문지(학생용)",
    "ans_grp_txt": "학생",
    "que_cnt": 5,
    "ans_cnt": 22,
    "sur_sdate": "2026-06-10",
    "sur_edate": "2026-06-15"
  }
];

// 1. 설문관리 JSON API
app.get(['/api/ad_sur/list', '/api/ad_sur/list/'], (req, res) => {
  return res.json({ success: true, surveys: dbSurveys, total: dbSurveys.length });
});

// 2. 설문관리 검색결과 엑셀 출력 (5대 원칙 준수)
app.get([/^\/af\/ad_sur\/excel/, '/af/ad_sur/excel/sn/3267'], (req, res) => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('ko-KR');
  const timeStr = now.toLocaleTimeString('ko-KR');
  const totalAns = dbSurveys.reduce((s, v) => s + v.ans_cnt, 0);

  const rowsHtml = dbSurveys.map((s, idx) => `
    <tr class="${idx % 2 === 1 ? 'zebra' : ''}">
      <td class="center">${idx + 1}</td>
      <td class="center">${s.sur_type === 1 ? '종합' : '강좌(강사기준)'}</td>
      <td class="left">${s.title}</td>
      <td class="center">${s.ans_grp_txt}</td>
      <td class="right num">${s.que_cnt}</td>
      <td class="right num">${s.ans_cnt}</td>
      <td class="center">${s.sur_sdate}</td>
      <td class="center">${s.sur_edate}</td>
    </tr>
  `).join('');

  const excelHtml = `
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
        학교명: 광주풍향초등학교 | 출력일시: ${dateStr} ${timeStr} | 총 설문 수: ${dbSurveys.length}건 | 총 참여자: ${totalAns}명
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
    ${rowsHtml}
    <tr class="total-row">
      <td colspan="4" class="center">총 결산 합계 (Total)</td>
      <td class="right num">${dbSurveys.reduce((s,v)=>s+v.que_cnt,0)}</td>
      <td class="right num">${totalAns}</td>
      <td colspan="2" class="center">-</td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="survey_list.xls"');
  return res.send(Buffer.from(excelHtml, 'utf-8'));
});

// 3. 설문결과 엑셀 출력
app.get([/^\/af\/ad_sur\/ans_excel/, '/af/ad_sur/ans_excel/sn/3267'], (req, res) => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('ko-KR');

  const excelHtml = `
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
  <tr><td colspan="5" style="text-align:right;font-size:9pt;color:#666;">출력일시: ${dateStr}</td></tr>
  <tr><th>연번</th><th>설문 제목</th><th>참여구분</th><th>총 참여자</th><th>기간</th></tr>
  ${dbSurveys.map((s,i)=>`<tr><td class="center">${i+1}</td><td>${s.title}</td><td class="center">${s.ans_grp_txt}</td><td class="center num">${s.ans_cnt}</td><td class="center">${s.sur_sdate}~${s.sur_edate}</td></tr>`).join('')}
  <tr class="total-row"><td colspan="3" class="center">합계</td><td class="center num">${dbSurveys.reduce((s,v)=>s+v.ans_cnt,0)}</td><td>-</td></tr>
</table>
</body></html>
  `.trim();

  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="survey_ans_result.xls"');
  return res.send(Buffer.from(excelHtml, 'utf-8'));
});

// ==================== 강좌 일괄입력 (ad_lec/input) SPA 모달 페이지 라우팅 ====================
app.get(/^\/af\/ad_lec\/input(\/.*)?$/, (req, res, next) => {
  if (req.path && req.path.includes('.') && !req.path.endsWith('.html')) {
    return next();
  }
  // 좌측 사이드바와 레이아웃을 100% 유지하는 인페이지 모달 SPA 서빙
  return res.sendFile(path.join(__dirname, 'af', 'ad_lec', 'lists', 'sn', 'index.html'));
});

// ==================== 삭제된 출석부관리 (/af/ad_att/stat) 리다이렉트 ====================
app.get(/^\/af\/ad_att\/stat/, (req, res) => {
  return res.redirect('/af/ad_wait/lists/sn/3267');
});

app.get([
  /^\/af\/ad_lec/,
  /^\/af\/ad_app/,
  /^\/af\/ad_pay/,
  /^\/af\/ad_wait/,
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

// ==================== 로그아웃 처리 -> 로그인 페이지로 리다이렉트 ====================
app.get(['/member/logout', '/member/logout/', '/member/logout/sn/:school_id', '/member/logout/sn/:school_id/', '/logout'], (req, res) => {
  return res.redirect('/member/login/sn/3267');
});

// ==================== 29. 매뉴얼 / FAQ SPA 통합 서빙 & 다운로드/영상 라우트 ====================
app.get(['/af/ad_faq/main', '/af/ad_faq/main/', '/af/ad_faq/main/sn/:school_id', '/af/ad_faq/main/sn/:school_id/'], (req, res) => {
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
  const { courseIds, updates, filter } = req.body;
  if (!updates) {
    return res.status(400).json({ success: false, message: '변경할 업데이트 데이터를 전달하세요.' });
  }
  const updatedCount = db.bulkUpdateLectures('sch_1', courseIds, updates, filter);
  return res.json({ success: true, message: `${updatedCount}개 강좌의 정보가 일괄 수정되었습니다.`, count: updatedCount });
});

// 강좌 일괄 복사 API (/api/af/ad_lec/bulk-copy)
app.post('/api/af/ad_lec/bulk-copy', (req, res) => {
  const options = req.body || {};
  const copiedCount = db.bulkCopyLectures('sch_1', options);
  return res.json({
    success: true,
    message: `${copiedCount}개 강좌가 성공적으로 복사되었습니다.`,
    count: copiedCount
  });
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

// Deep-link routes for 1:1 authentic export & print pages
app.get([
  /^\/af\/ad_app\/excel(\/.*)?$/,
  /^\/af\/ad_app\/pdf(\/.*)?$/,
  /^\/af\/ad_app\/pdf1(\/.*)?$/,
  /^\/af\/ad_app\/pdf2(\/.*)?$/,
  /^\/af\/ad_app\/com(\/.*)?$/,
  /^\/af\/ad_app\/list1(\/.*)?$/
], (req, res) => {
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
app.get(/^\/af\/ad_verify\/excel/, (req, res) => {
  const rows = sprint4Store.verifyList.map((item, idx) => {
    const isEven = idx % 2 === 0;
    const isMismatch = item.status === '불일치';
    return `
      <tr style="background:${isMismatch ? '#fef2f2' : (isEven ? '#ffffff' : '#f8fafc')};">
        <td style="text-align:center; mso-number-format:'\\@';">${idx + 1}</td>
        <td style="text-align:center; font-weight:bold; color:#1e3a8a;">${item.studentName}</td>
        <td style="text-align:center;">${item.appGrade}학년 ${item.appClass}반 ${item.appNumber}번</td>
        <td style="text-align:center; font-weight:bold; color:#047857;">${item.neisGrade ? item.neisGrade + '학년 ' + item.neisClass + '반 ' + item.neisNumber + '번' : '미등록'}</td>
        <td style="text-align:left; color:${isMismatch ? '#b91c1c' : '#334155'}; font-weight:${isMismatch ? 'bold' : 'normal'};">${item.reason}</td>
        <td style="text-align:center; font-weight:bold; color:${isMismatch ? '#dc2626' : '#16a34a'};">${item.status}</td>
      </tr>
    `;
  }).join('');

  const excelHtml = `
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
      ■ 학교명: 광주풍향초등학교 늘봄학교 &nbsp;|&nbsp; ■ 출력일시: ${new Date().toLocaleString('ko-KR')} &nbsp;|&nbsp;
      ■ 총 대상: ${sprint4Store.verifyStats.totalApplicants}명 &nbsp;|&nbsp; ■ 일치: ${sprint4Store.verifyStats.matched}명 &nbsp;|&nbsp; ■ 불일치(확인필요): ${sprint4Store.verifyStats.mismatched}명
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
      ${rows}
      <tr style="background:#fef3c7; border-top:2px solid #f59e0b; border-bottom:2px solid #f59e0b; font-weight:bold;">
        <td colspan="2" style="text-align:center;">합계 / 검증 총괄</td>
        <td colspan="4" style="text-align:left; color:#92400e;">총 ${sprint4Store.verifyList.length}건 검증 중 일치 ${sprint4Store.verifyList.filter(v=>v.status==='일치').length}건, 불일치 ${sprint4Store.verifyList.filter(v=>v.status==='불일치').length}건</td>
      </tr>
    </tbody>
  </table>
</body>
</html>
  `;

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
  res.json({ success: true, message: `선택된 ${(targets || []).length}개 항목의 데이터가 안전하게 초기화되었습니다.` });
});
app.get('/api/ad_info/data/sn/:sn', (req, res) => {
  res.json({ success: true, data: sprint4Store.managerInfo });
});
app.post(['/api/ad_info/save', '/af/ad_info/modify/sn/:sn'], (req, res) => {
  Object.assign(sprint4Store.managerInfo, req.body);
  res.json({ success: true, message: '담당자 정보가 저장되었습니다.', data: sprint4Store.managerInfo });
});


// dbdbschool Page Routing Middleware: 관리자 사이드바 전체 경로를 통일된 SPA 마스터 파일로 서빙
app.use((req, res, next) => {
  if (req.path && (req.path.startsWith('/af/') || req.path.startsWith('/sczigi/'))) {
    // 정적 자산(js, css, 이미지 등)은 통과
    if (req.path.endsWith('.js') || req.path.endsWith('.css') || req.path.endsWith('.png') || req.path.endsWith('.ico') || req.path.endsWith('.jpg') || req.path.endsWith('.woff') || req.path.endsWith('.woff2') || req.path.endsWith('.ttf') || req.path.endsWith('.svg')) {
      return next();
    }
    // 모든 사이드바 관리자 경로는 동일한 사이드바와 레이아웃을 보장하는 통합 마스터 HTML 서빙
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
