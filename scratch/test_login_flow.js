const http = require('http');
const assert = require('assert');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, body });
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function testLoginFlow() {
  console.log('=== [1] GET /member/login/sn/3267 로그인 페이지 조회 ===');
  const resGet = await request({
    hostname: 'localhost',
    port: 3005,
    path: '/member/login/sn/3267',
    method: 'GET'
  });
  assert.strictEqual(resGet.status, 200, 'Login page should return HTTP 200');
  assert(resGet.body.includes('늘봄학교 - 로그인'), 'HTML should contain login page title');
  assert(resGet.body.includes('btn_submit'), 'HTML should contain login submit button');
  console.log('✓ Login page served successfully (HTTP 200 OK)');

  console.log('\n=== [2] POST /member/login/sn/3267 로그인 서브밋 시 매뉴얼 리다이렉트 ===');
  const resPost = await request({
    hostname: 'localhost',
    port: 3005,
    path: '/member/login/sn/3267',
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }, 'login_id=admin&login_passwd=1234&login_user_grp=1');
  assert.strictEqual(resPost.status, 302, 'Login submit should return HTTP 302 Redirect');
  assert.strictEqual(resPost.headers.location, '/af/ad_faq/main/sn/3267', 'Redirect target should be /af/ad_faq/main/sn/3267');
  console.log('✓ Successfully redirects to:', resPost.headers.location);

  console.log('\n=== [3] 리다이렉트 타깃 매뉴얼 페이지 GET 검증 ===');
  const resTarget = await request({
    hostname: 'localhost',
    port: 3005,
    path: '/af/ad_faq/main/sn/3267',
    method: 'GET'
  });
  assert.strictEqual(resTarget.status, 200, 'Manual FAQ page should return HTTP 200');
  assert(resTarget.body.includes('매뉴얼') || resTarget.body.includes('FAQ'), 'Manual page content verified');
  console.log('✓ Target manual page loaded successfully (HTTP 200 OK)');

  console.log('\n🎉 ALL LOGIN-TO-MANUAL REDIRECT TESTS PASSED!');
}

testLoginFlow().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
