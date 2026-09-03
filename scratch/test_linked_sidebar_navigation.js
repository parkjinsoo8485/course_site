const http = require('http');
const assert = require('assert');

function get(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data
        });
      });
    });
    req.on('error', reject);
  });
}

async function runTests() {
  console.log('=== 1. Testing /login redirect to manual FAQ page ===');
  const loginRes = await get('http://localhost:3005/login');
  assert.strictEqual(loginRes.statusCode, 302, 'Login route must redirect (302)');
  assert.strictEqual(loginRes.headers.location, '/af/ad_faq/main/sn/3267', 'Must redirect to manual FAQ page');
  console.log('✔ /login successfully redirects to /af/ad_faq/main/sn/3267');

  console.log('\n=== 2. Testing /member/login/sn/3267 redirect to manual FAQ page ===');
  const memberLoginRes = await get('http://localhost:3005/member/login/sn/3267');
  assert.strictEqual(memberLoginRes.statusCode, 302, 'Member login route must redirect (302)');
  assert.strictEqual(memberLoginRes.headers.location, '/af/ad_faq/main/sn/3267', 'Must redirect to manual FAQ page');
  console.log('✔ /member/login/sn/3267 successfully redirects to /af/ad_faq/main/sn/3267');

  console.log('\n=== 3. Testing sidebar modules on /af/ad_lec/lists/sn/3267 ===');
  const lecRes = await get('http://localhost:3005/af/ad_lec/lists/sn/3267');
  assert.strictEqual(lecRes.statusCode, 200, 'Lecture page must return 200 OK');
  assert(lecRes.data.includes('id="left_menu"'), 'Must contain dbdbschool cloned #left_menu');
  assert(lecRes.data.includes('원희자(김채원)님'), 'Must contain user name: 원희자(김채원)님');
  assert(lecRes.data.includes('/af/ad_faq/main/sn/3267'), 'Must link to manual FAQ page in sidebar');
  console.log('✔ Lecture page renders cloned dbdbschool sidebar successfully!');

  console.log('\n=== 4. Testing sidebar modules on /af/ad_app/lists/sn/3267 ===');
  const appRes = await get('http://localhost:3005/af/ad_app/lists/sn/3267');
  assert.strictEqual(appRes.statusCode, 200, 'Applicant page must return 200 OK');
  assert(appRes.data.includes('id="left_menu"'), 'Must contain dbdbschool cloned #left_menu');
  console.log('✔ Applicant page renders cloned dbdbschool sidebar successfully!');

  console.log('\n=== 5. Testing sidebar modules on /af/ad_att/stat/sn/3267 ===');
  const attRes = await get('http://localhost:3005/af/ad_att/stat/sn/3267');
  assert.strictEqual(attRes.statusCode, 200, 'Attendance page must return 200 OK');
  assert(attRes.data.includes('id="left_menu"'), 'Must contain dbdbschool cloned #left_menu');
  console.log('✔ Attendance page renders cloned dbdbschool sidebar successfully!');

  console.log('\n=== 6. Testing sidebar modules on /af/ad_wait/lists/sn/3267 ===');
  const waitRes = await get('http://localhost:3005/af/ad_wait/lists/sn/3267');
  assert.strictEqual(waitRes.statusCode, 200, 'Waitlist page must return 200 OK');
  assert(waitRes.data.includes('id="left_menu"'), 'Must contain dbdbschool cloned #left_menu');
  console.log('✔ Waitlist page renders cloned dbdbschool sidebar successfully!');

  console.log('\n🎉 ALL LINKED SIDEBAR & LOGIN REDIRECT TESTS PASSED! 🎉');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
