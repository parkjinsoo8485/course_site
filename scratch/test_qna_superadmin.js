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

async function runSuperAdminQnaTests() {
  console.log('🧪 [Test Harness] Super Admin Multi-School Q&A Workflow Verification');
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

  // 1. Verify Super Admin page component existence
  const superAdminPageExists = fs.existsSync(
    path.join(__dirname, '../course_site/superadmin/index.html')
  );
  assert(superAdminPageExists, '1. course_site/superadmin/index.html Dashboard exists');

  const schoolsPageExists = fs.existsSync(
    path.join(__dirname, '../course_site/superadmin/schools.html')
  );
  assert(schoolsPageExists, '2. course_site/superadmin/schools.html (전체 학교 관리) file exists');

  const qnaPageExists = fs.existsSync(
    path.join(__dirname, '../course_site/superadmin/qna.html')
  );
  assert(qnaPageExists, '3. course_site/superadmin/qna.html (고객지원 문의 게시판) file exists');

  const schoolsPageContent = fs.readFileSync(
    path.join(__dirname, '../course_site/superadmin/schools.html'),
    'utf8'
  );
  assert(
    schoolsPageContent.includes('/superadmin/schools') && schoolsPageContent.includes('SaaS 테넌트 학교'),
    '4. schools.html contains SaaS Tenant Schools Management UI & routes'
  );

  // 2. Verify School Admin view has REMOVED "답변 저장하기" form
  const schoolAdminPageContent = fs.readFileSync(
    path.join(__dirname, '../course_site/app/af/qanda/lists/sn/[school_id]/page.tsx'),
    'utf8'
  );
  assert(
    !schoolAdminPageContent.includes('답변 저장하기'),
    '3. School Admin view detail modal does NOT contain editable "답변 저장하기" button'
  );
  assert(
    schoolAdminPageContent.includes('최고 관리자 답변'),
    '4. School Admin view detail modal contains read-only Super Admin reply display'
  );

  // 3. API Test: Fetch Q&A list
  const listRes = await request('GET', '/api/af/qanda/lists');
  assert(
    listRes.status === 200 && Array.isArray(listRes.body.qnas),
    '5. GET /api/af/qanda/lists returned Q&A array'
  );

  // 4. API Test: School Admin registers new inquiry
  const writeRes = await request('POST', '/api/af/qanda/write', {
    title: '자동화 테스트 학교 문의건',
    author: '이교무',
    content: '늘봄학교 관련 수강 신청 문의드립니다.',
    schoolId: '3267',
    schoolName: '광주풍향초등학교',
  });
  assert(
    writeRes.status === 200 && writeRes.body.success && writeRes.body.qna.status === '접수',
    '6. POST /api/af/qanda/write registered inquiry with initial status "접수"'
  );

  const newQnaId = writeRes.body.qna.id;

  // 5. API Test: Super Admin replies to inquiry
  const replyRes = await request('POST', '/api/af/qanda/reply', {
    id: newQnaId,
    answerContent: '안녕하세요. 최고 관리자입니다. 요청하신 문의건 처리가 완료되었습니다.',
    status: '완료',
  });
  assert(
    replyRes.status === 200 &&
      replyRes.body.success &&
      replyRes.body.qna.status === '완료' &&
      replyRes.body.qna.answerContent.includes('최고 관리자입니다'),
    '7. POST /api/af/qanda/reply updated inquiry status to "완료" and saved reply content'
  );

  // 6. API Test: Re-fetch Q&A list and verify reply exists
  const updatedListRes = await request('GET', '/api/af/qanda/lists');
  const updatedItem = updatedListRes.body.qnas.find((q) => q.id === newQnaId);
  assert(
    updatedItem && updatedItem.status === '완료' && updatedItem.answerDate !== null,
    '8. Re-fetched Q&A list shows updated item with status "완료" and valid answerDate'
  );

  // 7. API Test: Tenant School Isolation Test (e.g. schoolId=1001 must NOT see schoolId=3267)
  const isolatedListRes = await request('GET', '/api/af/qanda/lists?schoolId=1001');
  const hasOtherSchool = isolatedListRes.body.qnas.some((q) => q.schoolId !== '1001');
  assert(
    isolatedListRes.status === 200 && !hasOtherSchool && isolatedListRes.body.qnas.length > 0,
    '9. Tenant School Isolation verified: School 1001 cannot see inquiries of other schools'
  );

  console.log('\n========================================');
  console.log(`🎉 SUPER ADMIN Q&A VERIFICATION: ${passed}/${total} passed (${Math.round((passed / total) * 100)}%)`);
  console.log('========================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runSuperAdminQnaTests().catch((err) => {
  console.error('❌ Super Admin Q&A Test failed:', err);
  process.exit(1);
});
