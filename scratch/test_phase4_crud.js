import http from 'http';
import assert from 'assert';

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3005,
        path,
        method: options.method || 'GET',
        headers: options.headers || {},
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, json: JSON.parse(data), raw: data });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      }
    );
    req.on('error', reject);
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Phase 4 CRUD & Course Management Test Suite...');

  // 1. GET Course List API
  console.log('1️⃣ Testing GET /api/af/ad_lec/lists/sn/3267 ...');
  const listRes = await request('/api/af/ad_lec/lists/sn/3267');
  assert.strictEqual(listRes.status, 200, 'Course list status should be 200');
  assert(listRes.json.success === true, 'Course list response success should be true');
  assert(Array.isArray(listRes.json.lectures), 'Lectures should be an array');
  console.log(`   ✅ Fetched ${listRes.json.lectures.length} courses`);

  // 2. POST Course Create API
  console.log('2️⃣ Testing POST /api/af/ad_lec/create ...');
  const createRes = await request('/api/af/ad_lec/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      schoolId: '3267',
      category: '2026년 1분기',
      title: '[자동테스트] 코딩 드론 교실',
      instructor: '테스트강사',
      targetGrade: '1,2,3',
      capacity: 15,
      waitingCapacity: 5,
      tuitionFee: 40000,
      materialFee: 10000,
      dayOfWeek: '화',
      scheduleTime: '15:00~15:50',
    },
  });
  assert.strictEqual(createRes.status, 200, 'Course create status should be 200');
  assert(createRes.json.success === true, 'Course create success should be true');
  const createdId = createRes.json.lecture?.id;
  console.log(`   ✅ Created Course ID: ${createdId}`);

  // 3. PATCH Toggle Instructor Lock
  console.log('3️⃣ Testing PATCH /api/af/ad_lec/instructor-close ...');
  const lockRes = await request('/api/af/ad_lec/instructor-close', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: { schoolId: '3267', courseId: createdId },
  });
  assert.strictEqual(lockRes.status, 200, 'Toggle instructor close status should be 200');
  console.log(`   ✅ Instructor Closed Status: ${lockRes.json.instructorClosed}`);

  // 4. POST Single Course Copy
  console.log('4️⃣ Testing POST /api/af/ad_lec/copy ...');
  const copyRes = await request('/api/af/ad_lec/copy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      schoolId: '3267',
      courseId: createdId,
      overrides: { title: '[자동테스트] 코딩 드론 교실 (2분기)', category: '2026년 2분기' },
    },
  });
  assert.strictEqual(copyRes.status, 200, 'Course copy status should be 200');
  console.log(`   ✅ Copied Course: ${copyRes.json.course?.title}`);

  // 5. GET Course Stats
  console.log('5️⃣ Testing GET /api/af/ad_lec/stats ...');
  const statsRes = await request('/api/af/ad_lec/stats?schoolId=3267');
  assert.strictEqual(statsRes.status, 200, 'Stats status should be 200');
  assert(statsRes.json.success === true, 'Stats response should be true');
  console.log(`   ✅ Total Courses in Stats: ${statsRes.json.stats?.overview?.totalCourses}`);

  console.log('\n🎉 ALL 5/5 CRUD & COURSE MANAGEMENT TESTS PASSED PERFECTLY!\n');
}

runTests().catch((e) => {
  console.error('❌ Test failed:', e);
  process.exit(1);
});
