const http = require('http');
const assert = require('assert');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(body) });
        } catch (_) {
          resolve({ status: res.statusCode, headers: res.headers, body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTest() {
  console.log('=== [1] Q&A 고객지원 게시판 목록 조회 ===');
  const res1 = await request({
    hostname: 'localhost',
    port: 3005,
    path: '/api/af/qanda/lists/sn/3267',
    method: 'GET'
  });
  assert.strictEqual(res1.status, 200, 'Q&A List API should return 200');
  assert.strictEqual(res1.body.success, true, 'Q&A List should be successful');
  console.log('✓ Initial items count:', res1.body.items ? res1.body.items.length : 0);

  console.log('\n=== [2] 신규 고객지원 문의 등록 ===');
  const newQa = {
    school_id: '3267',
    authorName: '원희자(김채원)',
    hp1: '010',
    hp2: '2494',
    hp3: '1479',
    phone: '062-609-1182',
    email: 'khh147979@naver.com',
    subject: '2026학년도 1학기 늘봄학교 도서구입비 정산 문의',
    contents: '도서구입비 지원금 정산 영수증 첨부 및 승인 요청드립니다.'
  };
  const res2 = await request({
    hostname: 'localhost',
    port: 3005,
    path: '/api/af/qanda/create',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, newQa);
  assert.strictEqual(res2.status, 200, 'Create QA should return 200');
  assert.strictEqual(res2.body.success, true, 'Create QA should succeed');
  const createdId = res2.body.item.id;
  console.log('✓ Successfully created Q&A with ID:', createdId);

  console.log('\n=== [3] 등록된 문의글 상세 조회 ===');
  const res3 = await request({
    hostname: 'localhost',
    port: 3005,
    path: `/api/af/qanda/view/${createdId}`,
    method: 'GET'
  });
  assert.strictEqual(res3.status, 200, 'View QA should return 200');
  assert.strictEqual(res3.body.item.subject, newQa.subject, 'Subject should match');
  console.log('✓ Successfully fetched detail view for:', res3.body.item.subject);

  console.log('\n=== [4] 관리자 답변 등록 ===');
  const replyData = {
    id: createdId,
    replyContent: '안녕하세요. 고객지원팀입니다. 접수해주신 도서구입비 정산 내역 확인 완료되었습니다.',
    status: '2'
  };
  const res4 = await request({
    hostname: 'localhost',
    port: 3005,
    path: '/api/af/qanda/reply',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, replyData);
  assert.strictEqual(res4.status, 200, 'Reply QA should return 200');
  assert.strictEqual(res4.body.item.status, '2', 'Status should be completed (2)');
  console.log('✓ Successfully replied to Q&A');

  console.log('\n=== [5] 문의글 삭제 ===');
  const res5 = await request({
    hostname: 'localhost',
    port: 3005,
    path: '/api/af/qanda/delete',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { id: createdId });
  assert.strictEqual(res5.status, 200, 'Delete QA should return 200');
  console.log('✓ Successfully cleaned up test Q&A');

  console.log('\n🎉 ALL Q&A CUSTOMER SUPPORT BACKEND TESTS PASSED!');
}

runTest().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
