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
  console.log('=== 1. Testing /af/ad_faq/main/sn/3267 page rendering ===');
  const pageRes = await get('http://localhost:3005/af/ad_faq/main/sn/3267');
  assert.strictEqual(pageRes.statusCode, 200, 'Page must return 200 OK');
  assert(pageRes.data.includes('안내 & FAQ - 매뉴얼 - 늘봄학교'), 'Title must match dbdbschool');
  assert(pageRes.data.includes('원희자(김채원)님'), 'User name must match screenshot');
  assert(pageRes.data.includes('id="left_menu"'), 'Sidebar #left_menu must be present');
  assert(pageRes.data.includes('수강신청 운영 절차'), 'Manual operations list must be present');
  assert(pageRes.data.includes('양식 다운로드'), 'Template downloads section must be present');
  console.log('✔ Page HTML and dbdbschool cloned sidebar verified successfully!');

  console.log('\n=== 2. Testing Video redirect (/help/go_data/num/71/data/link1) ===');
  const videoRes = await get('http://localhost:3005/help/go_data/num/71/data/link1');
  assert.strictEqual(videoRes.statusCode, 302, 'Video endpoint must redirect (302)');
  assert(videoRes.headers.location && videoRes.headers.location.includes('youtu'), 'Location must point to YouTube');
  console.log('✔ Video redirect to YouTube verified successfully! Target:', videoRes.headers.location);

  console.log('\n=== 3. Testing Document file download (/help/go_data/num/239/data/link2) ===');
  const docRes = await get('http://localhost:3005/help/go_data/num/239/data/link2');
  assert.strictEqual(docRes.statusCode, 200, 'Document download must return 200 OK');
  assert(docRes.headers['content-disposition'], 'Must have Content-Disposition header');
  console.log('✔ Document download verified! Content-Disposition:', docRes.headers['content-disposition']);

  console.log('\n=== 4. Testing Master zip archive (/downloads/manual_faq_all_files.zip) ===');
  const zipRes = await get('http://localhost:3005/downloads/manual_faq_all_files.zip');
  assert.strictEqual(zipRes.statusCode, 200, 'All-files zip download must return 200 OK');
  const zipSizeMb = (parseInt(zipRes.headers['content-length'] || 0) / 1024 / 1024).toFixed(2);
  console.log(`✔ All-files zip download verified! Size: ${zipSizeMb} MB`);

  console.log('\n🎉 ALL AUTOMATED HARNESS TESTS PASSED SUCCESSFULLY! 🎉');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
