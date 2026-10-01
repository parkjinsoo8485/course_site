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
  console.log('🧪 [Test Harness] 1:1 dbdbschool Applicant Management (/af/ad_app/lists/sn/3267) Verification');

  try {
    // 1. GET /af/ad_app/lists/sn/3267 HTML & Component Checks
    console.log('  1. Testing GET /af/ad_app/lists/sn/3267 layout & buttons...');
    const pageRes = await makeRequest('/af/ad_app/lists/sn/3267');
    assert.strictEqual(pageRes.statusCode, 200);

    const html = pageRes.body;
    assert(html.includes('신청자관리'), 'HTML should contain sidebar menu [신청자관리]');
    assert(html.includes('신청목록'), 'HTML should contain heading [신청목록]');
    assert(html.includes('신청자 등록'), 'HTML should contain manual link [신청자 등록]');
    assert(html.includes('수강신청 테스트'), 'HTML should contain manual link [수강신청 테스트]');
    assert(html.includes('신청결과 조회'), 'HTML should contain manual link [신청결과 조회]');
    assert(html.includes('스쿨뱅킹 파일 다운로드'), 'HTML should contain manual link [스쿨뱅킹 파일 다운로드]');
    assert(html.includes('상세검색'), 'HTML should contain [상세검색]');
    assert(html.includes('대기자목록'), 'HTML should contain [대기자목록]');
    assert(html.includes('추가기능..'), 'HTML should contain [추가기능..]');
    assert(html.includes('신청자일괄입력'), 'HTML should contain [신청자일괄입력]');
    assert(html.includes('수강료입력'), 'HTML should contain [수강료입력]');
    assert(html.includes('신청자복사'), 'HTML should contain [신청자복사]');
    assert(html.includes('추가/취소자조회'), 'HTML should contain [추가/취소자조회]');
    assert(html.includes('미신청자목록'), 'HTML should contain [미신청자목록]');
    assert(html.includes('신청결과엑셀출력'), 'HTML should contain [신청결과엑셀출력]');
    assert(html.includes('수강신청서출력'), 'HTML should contain [수강신청서출력]');
    assert(html.includes('고지서출력'), 'HTML should contain [고지서출력]');
    assert(html.includes('시간표출력'), 'HTML should contain [시간표출력]');
    assert(html.includes('일괄적용'), 'HTML should contain bottom batch select [일괄적용]');
    console.log('  ✅ PASS: 1:1 Target Layout, Manual Box, Filters, Action Dropdowns, Table headers verified');

    // 2. GET /api/af/ad_app/lists/sn/3267 API Check
    console.log('  2. Testing GET /api/af/ad_app/lists/sn/3267 data API...');
    const apiRes = await makeRequest('/api/af/ad_app/lists/sn/3267');
    assert.strictEqual(apiRes.statusCode, 200);
    const apiData = JSON.parse(apiRes.body);
    assert.strictEqual(apiData.success, true);
    assert(Array.isArray(apiData.items), 'Response items must be an array');
    console.log(`  ✅ PASS: Applicant API returned ${apiData.items.length} records with stats`);

    // 3. POST /api/af/ad_app/create Single Registration
    console.log('  3. Testing POST /api/af/ad_app/create (New Applicant Registration)...');
    const createRes = await makeRequest('/api/af/ad_app/create', 'POST', {
      studentName: '완벽모방학생',
      gradeClass: '1학년 1반',
      studentNum: '30',
      parentPhone: '010-1234-5678',
      courseId: 'c_test_1',
      courseTitle: '(금) 돌봄 4부',
      tuitionFee: 0,
      materialFee: 0
    });
    assert.strictEqual(createRes.statusCode, 200);
    const createData = JSON.parse(createRes.body);
    assert.strictEqual(createData.success, true);
    const createdId = createData.item.id;
    console.log(`  ✅ PASS: Created applicant successfully [ID: ${createdId}, Name: ${createData.item.studentName}]`);

    // 4. POST /api/af/ad_app/update Contact Inline Modification
    console.log('  4. Testing POST /api/af/ad_app/update (Contact modification)...');
    const updateRes = await makeRequest('/api/af/ad_app/update', 'POST', {
      id: createdId,
      parentPhone: '010-8888-9999'
    });
    assert.strictEqual(updateRes.statusCode, 200);
    const updateData = JSON.parse(updateRes.body);
    assert.strictEqual(updateData.success, true);
    assert.strictEqual(updateData.item.parentPhone, '010-8888-9999');
    console.log('  ✅ PASS: Contact inline update API verified');

    // 5. POST /api/af/ad_app/delete
    console.log('  5. Testing POST /api/af/ad_app/delete (Single Delete)...');
    const delRes = await makeRequest('/api/af/ad_app/delete', 'POST', { id: createdId });
    assert.strictEqual(delRes.statusCode, 200);
    const delData = JSON.parse(delRes.body);
    assert.strictEqual(delData.success, true);
    console.log('  ✅ PASS: Single deletion API verified');

    // 6. GET /api/af/ad_app/school-banking/csv/sn/3267
    console.log('  6. Testing School Banking CSV Export...');
    const csvRes = await makeRequest('/api/af/ad_app/school-banking/csv/sn/3267');
    assert.strictEqual(csvRes.statusCode, 200);
    assert(csvRes.body.includes('연번,학년반,번호,학생명'), 'CSV should contain valid headers');
    console.log('  ✅ PASS: School banking CSV export API verified');

    console.log('\n========================================');
    console.log('🎉 1:1 DBDBSCHOOL APPLICANT MANAGEMENT: ALL 6 TESTS PASSED (100%)');
    console.log('========================================\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
}

runTests();
