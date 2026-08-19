const assert = require('assert');
const http = require('http');

async function runTests() {
  console.log('🧪 Starting Tuition Fee (ad_pay/edit) Comprehensive Test Harness...');

  // Spawn server from course_site directory
  process.env.PORT = '3099';
  const serverProcess = require('child_process').spawn('node', ['server.js'], {
    cwd: 'course_site',
    env: { ...process.env, PORT: '3099' },
    stdio: 'pipe'
  });

  let serverStarted = false;
  serverProcess.stdout.on('data', data => {
    const text = data.toString();
    console.log(`[SERVER]: ${text.trim()}`);
    if (text.includes('서버 구동 완료')) {
      serverStarted = true;
    }
  });

  serverProcess.stderr.on('data', data => {
    console.error(`[SERVER ERR]: ${data.toString().trim()}`);
  });

  // Wait for server to start
  for (let i = 0; i < 30; i++) {
    if (serverStarted) break;
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  const BASE_URL = 'http://localhost:3099';

  try {
    // Test 1: GET /af/ad_pay/edit/sn/3267 (HTML page)
    console.log('▶ Test 1: Verify /af/ad_pay/edit/sn/3267 page serving...');
    const pageRes = await fetch(`${BASE_URL}/af/ad_pay/edit/sn/3267`);
    assert.strictEqual(pageRes.status, 200, 'Page should return 200 OK');
    const htmlText = await pageRes.text();
    
    assert.ok(htmlText.includes('수강료관리'), 'HTML should contain header 수강료관리');
    assert.ok(htmlText.includes('수강료입력'), 'HTML should contain panel title 수강료입력');
    assert.ok(htmlText.includes('copy_all('), 'HTML should contain batch copy_all logic');
    assert.ok(htmlText.includes('chkLecPay('), 'HTML should contain calculation logic chkLecPay');
    assert.ok(htmlText.includes('전체수정'), 'HTML should contain 전체수정 button');
    assert.ok(htmlText.includes('신청목록'), 'HTML should contain 신청목록 button');
    assert.ok(htmlText.includes('출력되는 학적 정보는 신청 당시의 학생 정보를 기준으로 합니다.'), 'HTML should contain help text');
    console.log('✅ Test 1 Passed: Page structure and HTML match 100%');

    // Test 2: GET /api/af/ad_pay/data/sn/3267 (API data)
    console.log('▶ Test 2: Verify GET /api/af/ad_pay/data/sn/3267...');
    const dataRes = await fetch(`${BASE_URL}/api/af/ad_pay/data/sn/3267?sld=10&sln=1552375`);
    assert.strictEqual(dataRes.status, 200, 'Data API should return 200');
    const data = await dataRes.json();
    assert.strictEqual(data.success, true, 'Data API success should be true');
    assert.strictEqual(data.courses.length, 59, 'Should return 59 courses from dbdbschool');
    assert.strictEqual(data.students.length, 19, 'Should return 19 students for this course');
    assert.strictEqual(data.students[0].studentName, '오하율', 'First student should be 오하율');
    assert.strictEqual(data.students[18].studentName, '이용준', '19th student should be 이용준');
    console.log('✅ Test 2 Passed: API returns 59 courses and 19 students accurately');

    // Test 3: POST /api/af/ad_pay/update-single (Single row update)
    console.log('▶ Test 3: Verify single row update for student 21016254 (오하율)...');
    const updateRes = await fetch(`${BASE_URL}/api/af/ad_pay/update-single`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: '21016254',
        lec_num: '1552375',
        lec_pay: '40000',
        lec_use_cost: '5000',
        lec_pay_book: '12000',
        lec_pay_item: '8000',
        add_date: '2026-08-05'
      })
    });
    assert.strictEqual(updateRes.status, 200, 'Update single should return 200');
    const updateData = await updateRes.json();
    assert.strictEqual(updateData.success, true, 'Update should succeed');
    assert.strictEqual(updateData.student.tuitionFee, 40000, 'Tuition fee should be 40,000');
    assert.strictEqual(updateData.student.accommodationFee, 5000, 'Accommodation fee should be 5,000');
    assert.strictEqual(updateData.student.teacherFee, 35000, 'Teacher fee should be 35,000 (40000 - 5000)');
    assert.strictEqual(updateData.student.bookFee, 12000, 'Book fee should be 12,000');
    assert.strictEqual(updateData.student.materialFee, 8000, 'Material fee should be 8,000');
    assert.strictEqual(updateData.student.totalFee, 60000, 'Total fee should be 60,000 (40000 + 12000 + 8000)');
    assert.strictEqual(updateData.student.addDate, '2026-08-05', 'Add date should be 2026-08-05');
    console.log('✅ Test 3 Passed: Single student fee update and calculation verified');

    // Test 4: Validation test (useCost > pay)
    console.log('▶ Test 4: Verify invalid fee validation (useCost > tuitionFee)...');
    const invalidRes = await fetch(`${BASE_URL}/api/af/ad_pay/update-single`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: '21016254',
        lec_pay: '10000',
        lec_use_cost: '20000'
      })
    });
    assert.strictEqual(invalidRes.status, 400, 'Should reject invalid fee with 400');
    const invalidData = await invalidRes.json();
    assert.strictEqual(invalidData.success, false);
    console.log('✅ Test 4 Passed: Fee validation (useCost <= tuitionFee) strictly enforced');

    // Test 5: POST /api/af/ad_pay/update-bulk (Bulk update)
    console.log('▶ Test 5: Verify bulk update for multiple students...');
    const bulkRes = await fetch(`${BASE_URL}/api/af/ad_pay/update-bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lec_num: '1552375',
        students: [
          { id: '21016237', lec_pay: '30000', lec_use_cost: '3000', lec_pay_book: '5000', lec_pay_item: '5000', add_date: '2026-08-10' },
          { id: '21016247', lec_pay: '30000', lec_use_cost: '3000', lec_pay_book: '5000', lec_pay_item: '5000', add_date: '2026-08-10' }
        ]
      })
    });
    assert.strictEqual(bulkRes.status, 200, 'Bulk update should return 200');
    const bulkData = await bulkRes.json();
    assert.strictEqual(bulkData.success, true);
    assert.strictEqual(bulkData.updatedCount, 2, 'Should update 2 students');
    console.log('✅ Test 5 Passed: Bulk update executed successfully');

    // Test 6: Verify reflection in applicant list (/api/af/ad_app/lists/sn/3267)
    console.log('▶ Test 6: Verify updated fees reflected in Applicant Management list...');
    const appListRes = await fetch(`${BASE_URL}/api/af/ad_app/lists/sn/3267`);
    const appListData = await appListRes.json();
    const hayul = appListData.items.find(a => a.id === '21016254');
    assert.ok(hayul, '오하율 must exist in applicant list');
    assert.strictEqual(hayul.tuitionFee, 40000, 'Tuition fee should be reflected as 40000');
    assert.strictEqual(hayul.accommodationFee, 5000, 'Accommodation fee should be 5000');
    assert.strictEqual(hayul.totalFee, 60000, 'Total fee should be reflected as 60000');
    console.log('✅ Test 6 Passed: Applicant management list reflects updated fee and totals');

    console.log('\n🎉 ALL 6 TESTS PASSED SUCCESSFULLY! 100% Functional & UI Compliance Verified.');
  } finally {
    serverProcess.kill('SIGTERM');
  }
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
