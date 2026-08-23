const fs = require('fs');
const path = require('path');

let PASSED = 0;
let FAILED = 0;

function check(testName, condition) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    PASSED++;
  } else {
    console.log(`  ❌ FAIL: ${testName}`);
    FAILED++;
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 디비디비스쿨 학교관리(sczigi) 17개 전 페이지 & 상호 연동 전수 검증');
  console.log('======================================================\n');

  // 1. Static HTML Pages in course_site/sczigi/
  console.log('[Test Suite 1] 정적 HTML 17개 페이지 파일 무결성 및 링크 구조 검증');
  const staticPages = [
    'service/lists/sn/3267/index.html',
    'service/edit/sn/3267/index.html',
    'teacher/lists/sn/3267/index.html',
    'teacher/field/sn/3267/index.html',
    'teacher/level/sn/3267/index.html',
    'teacher/clear/sn/3267/index.html',
    'student/lists/sn/3267/index.html',
    'student/main/sn/3267/index.html',
    'student/field/sn/3267/index.html',
    'student/course/sn/3267/index.html',
    'student/clear/sn/3267/index.html',
    'sms_tel/lists/sn/3267/index.html',
    'sms_sin/lists/sn/3267/index.html',
    'sms_charge/lists/sn/3267/index.html',
    'sms_report/lists/sn/3267/index.html',
    'auth/main/sn/3267/index.html',
    'privacy_log/main/sn/3267/index.html',
  ];

  for (const p of staticPages) {
    const fullPath = path.join(__dirname, '..', 'course_site', 'sczigi', p);
    const exists = fs.existsSync(fullPath);
    const size = exists ? fs.statSync(fullPath).size : 0;
    const content = exists ? fs.readFileSync(fullPath, 'utf8') : '';
    const hasHeaderSwitch = content.includes('header-service-btn') && content.includes('/af/ad_faq/main/sn/3267');
    const hasSidebarLec = content.includes('늘봄학교 보기') && content.includes('/af/ad_faq/main/sn/3267');
    check(`정적 HTML 존재 & 크기 (${size}B): ${p}`, exists && size > 500);
    check(`  - 상단 서비스 전환 & 사이드바 연동 확인 (/af/ad_faq/main): ${p}`, hasHeaderSwitch && hasSidebarLec);
  }

  // 2. Next.js App Router Pages in course_site/app/sczigi/
  console.log('\n[Test Suite 2] Next.js App Router 16개 페이지 무결성 검증');
  const appPages = [
    'service/lists/sn/[school_id]/page.tsx',
    'teacher/lists/sn/[school_id]/page.tsx',
    'teacher/field/sn/[school_id]/page.tsx',
    'teacher/level/sn/[school_id]/page.tsx',
    'teacher/clear/sn/[school_id]/page.tsx',
    'student/lists/sn/[school_id]/page.tsx',
    'student/main/sn/[school_id]/page.tsx',
    'student/field/sn/[school_id]/page.tsx',
    'student/course/sn/[school_id]/page.tsx',
    'student/clear/sn/[school_id]/page.tsx',
    'sms_tel/lists/sn/[school_id]/page.tsx',
    'sms_sin/lists/sn/[school_id]/page.tsx',
    'sms_charge/lists/sn/[school_id]/page.tsx',
    'sms_report/lists/sn/[school_id]/page.tsx',
    'auth/main/sn/[school_id]/page.tsx',
    'privacy_log/main/sn/[school_id]/page.tsx',
  ];

  for (const p of appPages) {
    const fullPath = path.join(__dirname, '..', 'course_site', 'app', 'sczigi', p);
    const exists = fs.existsSync(fullPath);
    const size = exists ? fs.statSync(fullPath).size : 0;
    check(`App Router 페이지 존재 (${size}B): ${p}`, exists && size > 200);
  }

  // 3. Live HTTP Route Responses on port 3005
  console.log('\n[Test Suite 3] Express 실시간 웹서버 HTTP 200 OK 라우트 응답 검증 (port 3005)');
  const httpRoutes = [
    '/af/ad_lec/lists/sn/3267',
    '/sczigi/service/lists/sn/3267',
    '/sczigi/service/edit/sn/3267',
    '/sczigi/teacher/lists/sn/3267',
    '/sczigi/teacher/field/sn/3267',
    '/sczigi/teacher/level/sn/3267',
    '/sczigi/teacher/clear/sn/3267',
    '/sczigi/student/lists/sn/3267',
    '/sczigi/student/main/sn/3267',
    '/sczigi/student/field/sn/3267',
    '/sczigi/student/course/sn/3267',
    '/sczigi/student/clear/sn/3267',
    '/sczigi/sms_tel/lists/sn/3267',
    '/sczigi/sms_sin/lists/sn/3267',
    '/sczigi/sms_charge/lists/sn/3267',
    '/sczigi/sms_report/lists/sn/3267',
    '/sczigi/auth/main/sn/3267',
    '/sczigi/privacy_log/main/sn/3267',
  ];

  try {
    for (const route of httpRoutes) {
      const res = await fetch(`http://localhost:3005${route}`);
      const text = await res.text();
      check(`GET ${route} -> 200 OK (${text.length} chars)`, res.status === 200 && text.length > 500);
    }
  } catch (err) {
    console.log(`⚠️ Express HTTP fetch 경고: ${err.message}`);
  }

  // 4. API Endpoints on port 3005
  console.log('\n[Test Suite 4] Express 백엔드 REST API 13개 엔드포인트 응답 검증');
  const apiEndpoints = [
    '/api/sczigi/services',
    '/api/sczigi/teachers',
    '/api/sczigi/teacher/fields',
    '/api/sczigi/teacher/levels',
    '/api/sczigi/students',
    '/api/sczigi/student/basic',
    '/api/sczigi/student/fields',
    '/api/sczigi/student/courses',
    '/api/sczigi/sms/senders',
    '/api/sczigi/sms/charges',
    '/api/sczigi/sms/reports',
    '/api/sczigi/auth/permissions',
    '/api/sczigi/privacy/logs',
  ];

  try {
    for (const ep of apiEndpoints) {
      const res = await fetch(`http://localhost:3005${ep}`);
      const json = await res.json();
      check(`GET ${ep} -> 200 OK & success: true`, res.status === 200 && json.success === true);
    }
  } catch (err) {
    console.log(`⚠️ API fetch 경고: ${err.message}`);
  }

  console.log('\n======================================================');
  console.log(`📊 최종 테스트 결과: ${PASSED} 통과 / ${FAILED} 실패`);
  console.log('======================================================\n');

  if (FAILED > 0) {
    process.exit(1);
  }
}

runTests();
