const http = require('http');

function testEndpoint(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

async function run() {
  console.log('=== [1] 고객지원 게시판 페이지 응답 검증 ===');
  const rPage = await testEndpoint('http://localhost:3005/af/qanda/lists/sn/3267');
  console.log('- 상태 코드:', rPage.status);
  const hasCard = rPage.body.includes('id="panel_qanda_lists"');
  const hasQaTbody = rPage.body.includes('id="qaTbody"');
  const hasFilter = rPage.body.includes('id="qaStatusFilter"');
  console.log('- 패널 존재:', hasCard, ', tbody 존재:', hasQaTbody, ', 필터 존재:', hasFilter);

  if (rPage.status === 200 && hasCard && hasQaTbody && hasFilter) {
    console.log('✔ 고객지원 게시판 정상 렌더링 확인!');
  } else {
    console.error('❌ 고객지원 게시판 응답 실패');
    process.exit(1);
  }

  console.log('\n=== [2] 고객지원 Q&A API 검증 ===');
  const rApi = await testEndpoint('http://localhost:3005/api/af/qanda/lists/sn/3267');
  console.log('- API 상태 코드:', rApi.status);
  const json = JSON.parse(rApi.body);
  console.log('- API 반환 아이템 수:', (json.items || json).length);
  if (rApi.status === 200) {
    console.log('✔ Q&A API 엔드포인트 정상 작동!');
  } else {
    console.error('❌ Q&A API 실패');
    process.exit(1);
  }

  console.log('\n========================================');
  console.log('🎉 고객지원 게시판 정렬 및 연동 검증 완료!');
  console.log('========================================');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
