const http = require('http');
const assert = require('assert');

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, data }));
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('=== [1] 매뉴얼 메인 페이지 응답 검증 ===');
  const page = await get('http://localhost:3005/af/ad_faq/main/sn/3267');
  assert.strictEqual(page.status, 200, 'Page status must be 200');
  
  // 1. 패널 및 컨테이너 존재 확인
  assert(page.data.includes('id="panel_ad_faq_main"'), 'FAQ main panel must exist');
  assert(page.data.includes('id="operationsListContainer"'), 'Operations container must exist');
  assert(page.data.includes('id="templateDownloadsContainer"'), 'Template downloads container must exist');
  assert(page.data.includes('id="manualDownloadsContainer"'), 'Manual downloads container must exist');
  assert(page.data.includes('id="faqColLeft"'), 'FAQ Col Left must exist');
  assert(page.data.includes('id="faqColRight"'), 'FAQ Col Right must exist');

  // 2. '로딩 중' 잔재 여부 확인
  const loadingCount = (page.data.match(/로딩 중/g) || []).length;
  assert.strictEqual(loadingCount, 0, 'No "로딩 중" placeholder should remain');

  // 3. 링크 개수 및 사이드바 버튼 onclick 확인
  const helpLinks = (page.data.match(/\/help\/go_data\/num\//g) || []).length;
  console.log(`- /help/go_data/num/ 링크 수: ${helpLinks}개`);
  assert(helpLinks >= 50, 'Should have at least 50 help links');

  assert(page.data.includes('switchSubmodelView(event, \'ad_faq_main\', \'/af/ad_faq/main/sn/3267\')'), 'Sidebar manual button must have onclick handler');
  console.log('✔ 매뉴얼 메인 페이지 정적 렌더링 및 SPA 링크 연결 성공');

  console.log('\n=== [2] 문서 다운로드 엔드포인트 검증 ===');
  const docRes = await get('http://localhost:3005/help/go_data/num/239/data/link2');
  console.log(`- 상태 코드: ${docRes.status}`);
  assert([200, 302].includes(docRes.status), 'Doc route should return 200 or 302');
  console.log('✔ 문서 다운로드 엔드포인트 정상 작동');

  console.log('\n=== [3] 동영상 바로가기 엔드포인트 검증 ===');
  const vidRes = await get('http://localhost:3005/help/go_data/num/71/data/link1');
  console.log(`- 상태 코드: ${vidRes.status}`);
  console.log(`- 리다이렉트 위치: ${vidRes.headers.location}`);
  assert.strictEqual(vidRes.status, 302, 'Video route should redirect (302)');
  assert(vidRes.headers.location && vidRes.headers.location.includes('youtu'), 'Redirect location should be YouTube');
  console.log('✔ 동영상 YouTube 리다이렉트 정상 작동');

  console.log('\n========================================');
  console.log('🎉 모든 매뉴얼 & FAQ 복구 검증 통과!');
  console.log('========================================');
}

runTests().catch(err => {
  console.error('❌ 테스트 실패:', err);
  process.exit(1);
});
