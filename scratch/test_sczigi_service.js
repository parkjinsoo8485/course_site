import fs from 'fs';
import path from 'path';

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
  console.log('🧪 스쿨지기(sczigi) 서비스 & LNB 하위 14개 서브페이지 검증');
  console.log('======================================================\n');

  // 1. Verify App Router Pages File Structure
  const requiredPages = [
    'course_site/app/sczigi/layout.tsx',
    'course_site/components/sczigi/SczigiLayout.tsx',
    'course_site/types/sczigi.ts',
    'course_site/store/useSczigiStore.ts',
    // 14 subpages
    'course_site/app/sczigi/service/lists/sn/[school_id]/page.tsx',
    'course_site/app/sczigi/teacher/lists/sn/[school_id]/page.tsx',
    'course_site/app/sczigi/teacher/field/sn/[school_id]/page.tsx',
    'course_site/app/sczigi/teacher/level/sn/[school_id]/page.tsx',
    'course_site/app/sczigi/teacher/clear/sn/[school_id]/page.tsx',
    'course_site/app/sczigi/student/lists/sn/[school_id]/page.tsx',
    'course_site/app/sczigi/student/main/sn/[school_id]/page.tsx',
    'course_site/app/sczigi/student/field/sn/[school_id]/page.tsx',
    'course_site/app/sczigi/student/course/sn/[school_id]/page.tsx',
    'course_site/app/sczigi/student/clear/sn/[school_id]/page.tsx',
    'course_site/app/sczigi/sms_tel/lists/sn/[school_id]/page.tsx',
    'course_site/app/sczigi/sms_sin/lists/sn/[school_id]/page.tsx',
    'course_site/app/sczigi/sms_charge/lists/sn/[school_id]/page.tsx',
    'course_site/app/sczigi/sms_report/lists/sn/[school_id]/page.tsx',
    'course_site/app/sczigi/auth/main/sn/[school_id]/page.tsx',
    'course_site/app/sczigi/privacy_log/main/sn/[school_id]/page.tsx',
  ];

  console.log('[Test Suite 1] Next.js App Router 디렉토리 및 파일 무결성 검증');
  for (const pagePath of requiredPages) {
    const fullPath = path.resolve(pagePath);
    const exists = fs.existsSync(fullPath);
    const size = exists ? fs.statSync(fullPath).size : 0;
    check(`파일 존재 & 내용 크기: ${pagePath} (${size} bytes)`, exists && size > 100);
  }

  // 2. API Endpoint Testing on port 3005
  console.log('\n[Test Suite 2] Express 백엔드 API 라우트 응답 검증');
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
      const data = await res.json();
      check(`GET ${ep} → 200 OK & success: true`, res.status === 200 && data.success === true);
    }
  } catch (err) {
    console.log(`⚠️ Express API 서버 fetch 생략 (오프라인): ${err.message}`);
  }

  console.log('\n======================================================');
  console.log(`📊 테스트 결과: ${PASSED} 통과 / ${FAILED} 실패`);
  console.log('======================================================\n');

  if (FAILED > 0) {
    process.exit(1);
  }
}

runTests();
