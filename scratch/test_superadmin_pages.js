const http = require('http');
const fs = require('fs');
const path = require('path');

function request(method, urlPath, bodyData = null) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlPath, 'http://127.0.0.1:3005');
    const options = {
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({ status: res.statusCode, headers: res.headers, body: json, text: data });
      });
    });

    req.on('error', reject);

    if (bodyData) {
      req.write(JSON.stringify(bodyData));
    }
    req.end();
  });
}

async function runSuperAdminPagesVerification() {
  console.log('🧪 [Test Harness] Super Admin Dedicated SaaS Pages Verification');
  let passed = 0;
  let total = 0;

  function assert(cond, msg) {
    total++;
    if (cond) {
      console.log(`  ✅ PASS: ${msg}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${msg}`);
    }
  }

  // 1. HTTP GET /superadmin
  const dashRes = await request('GET', '/superadmin');
  assert(
    dashRes.status === 200 && dashRes.text.includes('다중 학교 관제센터') && dashRes.text.includes('/superadmin/schools'),
    '1. GET /superadmin loads Dashboard page with correct sidebar links'
  );

  // 2. HTTP GET /superadmin/schools
  const schoolsRes = await request('GET', '/superadmin/schools');
  assert(
    schoolsRes.status === 200 && schoolsRes.text.includes('전체 학교 관리') && schoolsRes.text.includes('SaaS 테넌트 학교'),
    '2. GET /superadmin/schools loads dedicated All Schools Management page'
  );

  // 3. HTTP GET /superadmin/qna
  const qnaRes = await request('GET', '/superadmin/qna');
  assert(
    qnaRes.status === 200 && qnaRes.text.includes('고객지원 문의 게시판') && qnaRes.text.includes('답변 작성'),
    '3. GET /superadmin/qna loads dedicated Multi-School Customer Support Q&A page'
  );

  // 4. API GET /api/schools/all
  const schoolsApiRes = await request('GET', '/api/schools/all');
  assert(
    schoolsApiRes.status === 200 && schoolsApiRes.body.success && Array.isArray(schoolsApiRes.body.schools),
    '4. GET /api/schools/all returns tenant schools list'
  );

  // 5. API POST /api/schools/update-plan
  const updatePlanRes = await request('POST', '/api/schools/update-plan', {
    id: '3267',
    plan: 'Premium',
    status: '정상운영',
    expireDate: '2027-12-31'
  });
  assert(
    updatePlanRes.status === 200 && updatePlanRes.body.success && updatePlanRes.body.school.expireDate === '2027-12-31',
    '5. POST /api/schools/update-plan updates tenant school plan & expiration date'
  );

  // 6. API POST /api/af/qanda/reply
  const qnaReplyRes = await request('POST', '/api/af/qanda/reply', {
    id: 2,
    answerContent: '테스트 최고 관리자 답변입니다.',
    status: '완료'
  });
  assert(
    qnaReplyRes.status === 200 && qnaReplyRes.body.success && qnaReplyRes.body.qna.status === '완료',
    '6. POST /api/af/qanda/reply saves Super Admin reply for tenant school inquiry'
  );

  console.log('\n========================================');
  console.log(`🎉 SUPER ADMIN PAGES VERIFICATION: ${passed}/${total} passed (${Math.round((passed / total) * 100)}%)`);
  console.log('========================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runSuperAdminPagesVerification().catch((err) => {
  console.error('❌ Super Admin Pages Verification failed:', err);
  process.exit(1);
});
