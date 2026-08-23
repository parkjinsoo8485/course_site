const http = require('http');

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== [1] 강좌등록 UI (/af/ad_lec/write/sn/3267) 페이지 응답 및 요소 검증 ===');
  
  const pageRes = await makeRequest({
    hostname: 'localhost',
    port: 3005,
    path: '/af/ad_lec/write/sn/3267',
    method: 'GET'
  });

  if (pageRes.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${pageRes.statusCode}`);
  }
  console.log('✓ Page loaded with status 200');

  const requiredElements = [
    'id="lec_name"',
    'id="lec_div"',
    'id="lec_pro_type"',
    'id="tea_id"',
    'id="tea_id1"',
    'id="check_all_grade"',
    'name="lec_grade[]"',
    'id="lec_time_"',
    'id="lec_max_sin"',
    'id="lec_max_wait"',
    'id="lec_sdate"',
    'id="lec_edate"',
    'id="lec_tot_sisu"',
    'id="lec_room_"',
    'id="lec_room"',
    'id="lec_pay"',
    'id="lec_use_cost"',
    'id="lec_tea_fee"',
    'id="lec_pay_book"',
    'id="lec_pay_item"',
    'id="lec_content"',
    'name="lec_status"',
    'class="help_box"',
    'class="new_help_manualbox'
  ];

  for (const elem of requiredElements) {
    if (!pageRes.body.includes(elem)) {
      throw new Error(`Required element missing from HTML: ${elem}`);
    }
  }
  console.log(`✓ All ${requiredElements.length} required 01_강좌등록 form elements are present in HTML!`);

  console.log('\n=== [2] 강좌등록 API (/api/af/ad_lec/create) 연동 검증 ===');
  const testPayload = JSON.stringify({
    schoolId: '3267',
    category: '26년 9월',
    neulbomType: '맞춤형',
    title: '테스트_로봇과학_2026_신규등록',
    instructor: '김혜련_강사',
    targetGrade: '1,2,3',
    capacity: 25,
    waitingCapacity: 5,
    scheduleTime: '화 14:00~15:30',
    period: '2026-09-01 ~ 2026-09-30',
    totalHours: 16,
    classroom: '본관3층 늘봄프로그램실 1',
    tuitionFee: 35000,
    costFacility: 5000,
    costInstructor: 30000,
    textbookFee: 15000,
    materialFee: 10000,
    status: 'OUTPUT'
  });

  const apiRes = await makeRequest({
    hostname: 'localhost',
    port: 3005,
    path: '/api/af/ad_lec/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(testPayload)
    }
  }, testPayload);

  if (apiRes.statusCode !== 200) {
    throw new Error(`API returned status ${apiRes.statusCode}: ${apiRes.body}`);
  }

  const json = JSON.parse(apiRes.body);
  if (!json.success || !json.lecture) {
    throw new Error(`API failed: ${apiRes.body}`);
  }
  console.log('✓ Course successfully created via API:', json.lecture.title, 'ID:', json.lecture.id);

  console.log('\n=== [3] 강좌 목록 (/api/af/ad_lec/lists/sn/3267) 반영 확인 ===');
  const listRes = await makeRequest({
    hostname: 'localhost',
    port: 3005,
    path: '/api/af/ad_lec/lists/sn/3267',
    method: 'GET'
  });

  const listJson = JSON.parse(listRes.body);
  const found = listJson.lectures.find(l => l.title === '테스트_로봇과학_2026_신규등록');
  if (!found) {
    throw new Error('Newly created course not found in lecture list!');
  }
  console.log('✓ Verified course exists in school lecture list:', found.title);

  console.log('\n=============================================');
  console.log('>>> ALL TEST HARNESS SUITES PASSED (100% OK) <<<');
  console.log('=============================================');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
