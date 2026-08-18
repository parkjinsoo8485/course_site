import http from 'http';
import assert from 'assert';

const PORT = process.env.PORT || 3005;
const BASE_URL = `http://localhost:${PORT}`;

function makeRequest(path, method = 'GET', bodyData = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: { 'Content-Type': 'application/json' }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    });

    req.on('error', reject);
    if (bodyData) req.write(JSON.stringify(bodyData));
    req.end();
  });
}

async function runTests() {
  console.log('🧪 [Test Harness] Applicant Management UI & Popups Verification');

  try {
    // 1. GET /af/ad_app/lists/sn/3267
    console.log('  1. Testing GET /af/ad_app/lists/sn/3267...');
    const pageRes = await makeRequest('/af/ad_app/lists/sn/3267');
    assert.strictEqual(pageRes.statusCode, 200);
    assert(pageRes.body.includes('신청자관리'), 'HTML should contain 신청자관리');
    assert(pageRes.body.includes('신청불가 조회'), 'HTML should contain 신청불가 조회');
    assert(pageRes.body.includes('수강신청 테스트'), 'HTML should contain 수강신청 테스트');
    console.log('  ✅ PASS: Applicant Management HTML & exact buttons loaded');

    // 2. GET /api/af/ad_app/lists/sn/3267
    console.log('  2. Testing GET /api/af/ad_app/lists/sn/3267...');
    const apiRes = await makeRequest('/api/af/ad_app/lists/sn/3267');
    assert.strictEqual(apiRes.statusCode, 200);
    const apiData = JSON.parse(apiRes.body);
    assert.strictEqual(apiData.success, true);
    console.log(`  ✅ PASS: Applicant API returned ${apiData.items.length} items`);

    // 3. POST /api/af/ad_app/create
    console.log('  3. Testing POST /api/af/ad_app/create (New Applicant Registration)...');
    const createRes = await makeRequest('/api/af/ad_app/create', 'POST', {
      studentName: '테스트학생',
      gradeClass: '1학년 1반',
      studentNum: '25',
      parentPhone: '010-9999-8888',
      courseId: 'c_1',
      courseTitle: '(금) 돌봄 4부',
      tuitionFee: 0,
      materialFee: 0
    });
    assert.strictEqual(createRes.statusCode, 200);
    const createData = JSON.parse(createRes.body);
    assert.strictEqual(createData.success, true);
    console.log(`  ✅ PASS: Created applicant: ${createData.item.studentName}`);

    // 4. GET /api/af/ad_app/school-banking/csv/sn/3267
    console.log('  4. Testing School Banking CSV Export...');
    const csvRes = await makeRequest('/api/af/ad_app/school-banking/csv/sn/3267');
    assert.strictEqual(csvRes.statusCode, 200);
    assert(csvRes.body.includes('연번,학년반,번호,학생명'), 'CSV should contain valid headers');
    console.log('  ✅ PASS: CSV Download API verified');

    console.log('\n========================================');
    console.log('🎉 APPLICANT MANAGEMENT VERIFICATION: ALL 4 PASSED (100%)');
    console.log('========================================\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
}

runTests();
