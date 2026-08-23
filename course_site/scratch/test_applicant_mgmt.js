const http = require('http');

const PORT = 3005;
const BASE_URL = `http://localhost:${PORT}`;

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const contentType = res.headers['content-type'] || '';
          if (contentType.includes('application/json')) {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } else {
            resolve({ status: res.statusCode, body: data, headers: res.headers });
          }
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runApplicantTests() {
  console.log('====================================================');
  console.log('🧪 Starting dbdbschool Applicant Management Test Suite');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. GET Applicant Lists
    console.log('--- Test 1: GET /api/af/ad_app/lists/sn/3267 ---');
    const res1 = await makeRequest('GET', '/api/af/ad_app/lists/sn/3267');
    assert(res1.status === 200, 'Status code is 200');
    assert(res1.body.success === true, 'Success flag is true');
    assert(Array.isArray(res1.body.items), 'Items is an array');
    assert(res1.body.items.length >= 5, `Found ${res1.body.items.length} applicants (>= 5)`);
    assert(res1.body.stats && res1.body.stats.totalCount > 0, 'Stats object has totalCount');

    // 2. Filter by Grade
    console.log('\n--- Test 2: Filter Applicants by Grade ---');
    const res2 = await makeRequest('GET', '/api/af/ad_app/lists/sn/3267?grade=1');
    assert(res2.status === 200, 'Status code is 200 for grade filter');
    const allGrade1 = res2.body.items.every(a => a.gradeClass.startsWith('1학년'));
    assert(allGrade1, 'All filtered items belong to 1학년');

    // 3. POST Create Applicant
    console.log('\n--- Test 3: POST /api/af/ad_app/create ---');
    const newAppPayload = {
      schoolId: '3267',
      category: '26년 8월',
      neulbomType: '방과후',
      courseId: 'c_3267_1',
      courseTitle: '[늘봄] AI 로봇 코딩 교실',
      instructorName: '한수진',
      studentName: '테스트학생',
      gradeClass: '2학년 3반',
      studentNum: '19',
      parentPhone: '010-9999-8888',
      subsidyType: '일반 자부담',
      tuitionFee: 40000,
      bookFee: 10000,
      materialFee: 15000,
      bankName: '농협',
      schoolBankingAccount: '302-9999-8888-77',
      depositorName: '테스트부',
      paymentStatus: '결제대기',
      status: '승인',
      memo: '테스트 등록 건'
    };

    const res3 = await makeRequest('POST', '/api/af/ad_app/create', newAppPayload);
    assert(res3.status === 200, 'Create status is 200');
    assert(res3.body.success === true, 'Created applicant successfully');
    const createdId = res3.body.item ? res3.body.item.id : null;
    assert(createdId !== null, `Created applicant ID: ${createdId}`);
    assert(res3.body.item.totalFee === 65000, 'Calculated total fee is 65,000원 (40,000 + 10,000 + 15,000)');

    // 4. GET View Applicant
    if (createdId) {
      console.log('\n--- Test 4: GET /api/af/ad_app/view/:id ---');
      const res4 = await makeRequest('GET', `/api/af/ad_app/view/${createdId}`);
      assert(res4.status === 200, 'View detail status is 200');
      assert(res4.body.item && res4.body.item.studentName === '테스트학생', 'View detail matches created name');

      // 5. POST Update Applicant
      console.log('\n--- Test 5: POST /api/af/ad_app/update ---');
      const res5 = await makeRequest('POST', '/api/af/ad_app/update', {
        id: createdId,
        paymentStatus: '결제완료',
        tuitionFee: 45000,
        memo: '결제 확인 완료'
      });
      assert(res5.status === 200, 'Update status is 200');
      assert(res5.body.item.paymentStatus === '결제완료', 'Payment status updated to 결제완료');
      assert(res5.body.item.tuitionFee === 45000, 'Tuition fee updated to 45,000');
    }

    // 6. Batch Upload Applicants
    console.log('\n--- Test 6: POST /api/af/ad_app/batch-upload ---');
    const batchItems = [
      { studentName: '일괄학생1', gradeClass: '1학년 1반', studentNum: '31', parentPhone: '010-1111-2222', courseId: 'crs_3', courseTitle: '[특기적성] 창의 로봇교실 A반', tuitionFee: 35000, materialFee: 15000 },
      { studentName: '일괄학생2', gradeClass: '1학년 2반', studentNum: '32', parentPhone: '010-2222-3333', courseId: 'crs_3', courseTitle: '[특기적성] 창의 로봇교실 A반', tuitionFee: 35000, materialFee: 15000 }
    ];
    const res6 = await makeRequest('POST', '/api/af/ad_app/batch-upload', { schoolId: '3267', items: batchItems });
    assert(res6.status === 200, 'Batch upload status is 200');
    assert(res6.body.count === 2, '2 applicants created via batch upload');

    // 7. Batch Update Fees
    console.log('\n--- Test 7: POST /api/af/ad_app/batch-fee ---');
    const res7 = await makeRequest('POST', '/api/af/ad_app/batch-fee', {
      schoolId: '3267',
      courseId: 'crs_3',
      tuitionFee: 38000,
      bookFee: 5000,
      materialFee: 15000
    });
    assert(res7.status === 200, 'Batch fee update status is 200');
    assert(res7.body.updatedCount > 0, `Updated fees for ${res7.body.updatedCount} applicants`);

    // 8. Batch Copy Applicants
    console.log('\n--- Test 8: POST /api/af/ad_app/copy ---');
    const res8 = await makeRequest('POST', '/api/af/ad_app/copy', {
      schoolId: '3267',
      fromCategory: '26년 8월',
      toCategory: '26년 9월'
    });
    assert(res8.status === 200, 'Copy status is 200');
    assert(res8.body.copiedCount > 0, `Copied ${res8.body.copiedCount} applicants to 26년 9월`);

    // 9. School Banking CSV Export
    console.log('\n--- Test 9: GET /api/af/ad_app/school-banking/csv/sn/3267 ---');
    const res9 = await makeRequest('GET', '/api/af/ad_app/school-banking/csv/sn/3267');
    assert(res9.status === 200, 'School Banking CSV status is 200');
    assert(typeof res9.body === 'string' && res9.body.includes('연번,학년반,번호,학생명'), 'CSV contains correct header row');

    // 10. Clean up created test student
    if (createdId) {
      console.log('\n--- Test 10: POST /api/af/ad_app/delete ---');
      const res10 = await makeRequest('POST', '/api/af/ad_app/delete', { id: createdId });
      assert(res10.status === 200, 'Delete status is 200');
      assert(res10.body.success === true, 'Deleted test applicant successfully');
    }

  } catch (err) {
    console.error('Fatal test execution error:', err);
    failed++;
  }

  console.log('\n====================================================');
  console.log(`📊 Test Summary: Total ${passed + failed} | ✅ Passed: ${passed} | ❌ Failed: ${failed}`);
  console.log('====================================================\n');

  if (failed > 0) process.exit(1);
}

runApplicantTests();
