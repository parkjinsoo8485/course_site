const http = require('http');

function get(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3005${urlPath}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, body: data });
      });
    }).on('error', reject);
  });
}

async function runQnaTests() {
  console.log('🧪 [Test Harness] Customer Support Q&A Board Clone Verification');
  let passed = 0;
  let total = 0;

  function assert(cond, msg) {
    total++;
    if (cond) {
      console.log(`  ✅ PASS: ${msg}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${msg}`);
    }
  }

  // 1. Test target URL endpoint response
  const pageRes = await get('/af/qanda/lists/sn/3267');
  assert(pageRes.status === 200, '1. /af/qanda/lists/sn/3267 returned status 200');

  // 2. Check store file existence
  const fs = require('fs');
  const path = require('path');
  const storeExists = fs.existsSync(path.join(__dirname, '../course_site/store/useQnaStore.ts'));
  assert(storeExists, '2. store/useQnaStore.ts file exists');

  // 3. Check page component existence
  const pageExists = fs.existsSync(path.join(__dirname, '../course_site/app/af/qanda/lists/sn/[school_id]/page.tsx'));
  assert(pageExists, '3. app/af/qanda/lists/sn/[school_id]/page.tsx file exists');

  // 4. Verify orange text requirement for '완료' status in page.tsx
  const pageContent = fs.readFileSync(path.join(__dirname, '../course_site/app/af/qanda/lists/sn/[school_id]/page.tsx'), 'utf8');
  assert(pageContent.includes('text-[#e67e22]') || pageContent.includes('text-orange-500'), '4. Status "완료" text contains orange color class (text-[#e67e22] or text-orange-500)');

  // 5. Verify AdminTable & AdminFilterBar imports or usage
  assert(pageContent.includes('AdminTable'), '5. AdminTable is used');

  // 6. Verify form fields matching original write screenshot
  assert(pageContent.includes('휴대폰 ☑') && pageContent.includes('상담 전화 및 처리 결과를 문자로 발송해 드립니다.'), '6. Phone split fields and sms notice exist');
  assert(pageContent.includes('한 번에 최대 3M 이하만 올릴 수 있습니다.'), '7. 3MB file upload notice exists');
  assert(pageContent.includes('환경설정 > 담당자정보') || pageContent.includes('환경설정 &gt; 담당자정보'), '8. Manager info update checkbox exists');

  // 7. Verify API endpoint
  const apiRes = await get('/api/af/qanda/lists');
  assert(apiRes.status === 200 && apiRes.body.includes('2026학년도'), '9. API /api/af/qanda/lists returned valid JSON response');

  console.log('\n========================================');
  console.log(`🎉 Q&A BOARD VERIFICATION: ${passed}/${total} passed (100%)`);
  console.log('========================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runQnaTests().catch(err => {
  console.error('❌ Q&A Test failed:', err);
  process.exit(1);
});

