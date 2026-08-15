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
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    });

    req.on('error', reject);
    if (bodyData) {
      req.write(JSON.stringify(bodyData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Automated Test Harness for Interactive dbdbschool Clone...');

  try {
    // Test 1: Main School Portal Page
    console.log('1️⃣ Testing GET /af/ad_lec/lists/sn/3267/...');
    const pageRes = await makeRequest('/af/ad_lec/lists/sn/3267/');
    assert.strictEqual(pageRes.statusCode, 200, 'Page should return status 200');
    assert(pageRes.body.includes('광주풍향초등학교'), 'HTML should contain 광주풍향초등학교');
    console.log('   ✅ Main School Portal HTML verified.');

    // Test 2: Find Password Page
    console.log('2️⃣ Testing GET /member/findpw/sn/3267/...');
    const findPwRes = await makeRequest('/member/findpw/sn/3267/');
    assert.strictEqual(findPwRes.statusCode, 200, 'FindPw page should return status 200');
    assert(findPwRes.body.includes('비밀번호찾기'), 'FindPw HTML should contain 비밀번호찾기');
    console.log('   ✅ Find Password HTML verified.');

    // Test 3: FAQ Page
    console.log('3️⃣ Testing GET /member/faq/sn/3267/...');
    const faqRes = await makeRequest('/member/faq/sn/3267/');
    assert.strictEqual(faqRes.statusCode, 200, 'FAQ page should return status 200');
    assert(faqRes.body.includes('FAQ'), 'FAQ HTML should contain FAQ');
    console.log('   ✅ FAQ Page HTML verified.');

    // Test 4: Courses API
    console.log('4️⃣ Testing GET /api/dbdbschool/3267/courses...');
    const coursesRes = await makeRequest('/api/dbdbschool/3267/courses');
    assert.strictEqual(coursesRes.statusCode, 200);
    const coursesJson = JSON.parse(coursesRes.body);
    assert.strictEqual(coursesJson.success, true);
    assert(coursesJson.courses.length > 0);
    console.log(`   ✅ Courses API returned ${coursesJson.courses.length} active courses.`);

    // Test 5: Interactive Course Enrollment
    console.log('5️⃣ Testing POST /api/dbdbschool/3267/enroll (Course Application)...');
    const enrollRes = await makeRequest('/api/dbdbschool/3267/enroll', 'POST', {
      courseId: 'c_3267_2',
      studentName: '김민준',
      isWaitlist: false
    });
    assert.strictEqual(enrollRes.statusCode, 200);
    const enrollJson = JSON.parse(enrollRes.body);
    assert.strictEqual(enrollJson.success, true);
    assert(enrollJson.message.includes('수강 신청 완료'));
    console.log(`   ✅ Interactive Enrollment verified: ${enrollJson.message}`);

    console.log('🎉 ALL AUTOMATED TESTS PASSED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
}

runTests();
