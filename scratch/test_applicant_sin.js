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
  console.log('🧪 [Test Harness] Applicant Direct Registration (af/ad_app/sin/sn/3267) Verification');

  try {
    // 1. GET /af/ad_app/sin/sn/3267
    console.log('  1. Testing GET /af/ad_app/sin/sn/3267 page rendering...');
    const pageRes = await makeRequest('/af/ad_app/sin/sn/3267');
    assert.strictEqual(pageRes.statusCode, 200);
    assert(pageRes.body.includes('신청자 등록'), 'HTML should contain 신청자 등록');
    assert(pageRes.body.includes('학생정보'), 'HTML should contain 학생정보');
    assert(pageRes.body.includes('미신청자목록'), 'HTML should contain 미신청자목록');
    assert(pageRes.body.includes('수강신청 등록 &amp; 테스트') || pageRes.body.includes('수강신청 등록 & 테스트'), 'HTML should contain manual link');
    console.log('  ✅ PASS: Applicant Registration HTML and dbdbschool UI elements verified');

    // 2. GET /api/student/search
    console.log('  2. Testing GET /api/student/search (Student Lookup API)...');
    const stuRes = await makeRequest('/api/student/search?grade=1');
    assert.strictEqual(stuRes.statusCode, 200);
    const stuData = JSON.parse(stuRes.body);
    assert.strictEqual(stuData.success, true);
    assert(stuData.students.length > 0, 'Should find 1st grade students');
    console.log(`  ✅ PASS: Found ${stuData.students.length} students in grade 1`);

    // 3. GET /api/af/ad_app/sin-courses
    console.log('  3. Testing GET /api/af/ad_app/sin-courses (Course Evaluation API)...');
    const targetStudent = stuData.students[0];
    const targetGC = `${targetStudent.grade}학년 ${targetStudent.classNum}반`;
    const coursesRes = await makeRequest(`/api/af/ad_app/sin-courses?studentName=${encodeURIComponent(targetStudent.studentName)}&gradeClass=${encodeURIComponent(targetGC)}&period=26년 8월`);
    assert.strictEqual(coursesRes.statusCode, 200);
    const coursesData = JSON.parse(coursesRes.body);
    assert.strictEqual(coursesData.success, true);
    assert(Array.isArray(coursesData.courses), 'Should return list of courses');
    console.log(`  ✅ PASS: Evaluated ${coursesData.courses.length} courses for student ${targetStudent.studentName}`);

    // 4. POST /api/af/ad_app/direct-apply
    console.log('  4. Testing POST /api/af/ad_app/direct-apply (Direct Course Application)...');
    const targetCourse = coursesData.courses.find(c => c.status === 'available') || coursesData.courses[0];
    const applyRes = await makeRequest('/api/af/ad_app/direct-apply', 'POST', {
      studentName: targetStudent.studentName,
      gradeClass: targetGC,
      studentNum: targetStudent.studentNum,
      parentPhone: targetStudent.parentPhone,
      courseId: targetCourse.id
    });
    assert.strictEqual(applyRes.statusCode, 200);
    const applyData = JSON.parse(applyRes.body);
    assert.strictEqual(applyData.success, true);
    console.log(`  ✅ PASS: Directly registered student ${targetStudent.studentName} to course: ${targetCourse.title}`);

    // 5. Verify status changed to 'applied'
    console.log('  5. Verifying course status is now applied...');
    const reEvalRes = await makeRequest(`/api/af/ad_app/sin-courses?studentName=${encodeURIComponent(targetStudent.studentName)}&gradeClass=${encodeURIComponent(targetGC)}&period=26년 8월`);
    const reEvalData = JSON.parse(reEvalRes.body);
    const reCheckedCourse = reEvalData.courses.find(c => c.id === targetCourse.id);
    assert.strictEqual(reCheckedCourse.status, 'applied');
    assert.strictEqual(reCheckedCourse.statusText, '신청완료');
    console.log(`  ✅ PASS: Course correctly marked as 'applied' and appliedCount = ${reEvalData.appliedCount}`);

    // 6. POST /api/af/ad_app/direct-cancel
    console.log('  6. Testing POST /api/af/ad_app/direct-cancel (Direct Course Cancellation)...');
    const cancelRes = await makeRequest('/api/af/ad_app/direct-cancel', 'POST', {
      studentName: targetStudent.studentName,
      gradeClass: targetGC,
      courseId: targetCourse.id
    });
    assert.strictEqual(cancelRes.statusCode, 200);
    const cancelData = JSON.parse(cancelRes.body);
    assert.strictEqual(cancelData.success, true);
    console.log(`  ✅ PASS: Course registration cancelled successfully for ${targetStudent.studentName}`);

    console.log('\n======================================================');
    console.log('🎉 APPLICANT DIRECT REGISTRATION (SIN) VERIFICATION: 100% PASSED');
    console.log('======================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
}

runTests();
