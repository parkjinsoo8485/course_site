/**
 * scratch/test_manual_faq_clone.js
 * Automated Test Harness for dbdbschool Manual & FAQ 100% Clone Verification
 */

const http = require('http');

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3005${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('🚀 [START] Automated Test Suite: dbdbschool Manual & FAQ 100% Clone');
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

  // 1. Test /api/manual/all
  const allRes = await get('/api/manual/all');
  assert(allRes.status === 200 && allRes.body.success, '1. /api/manual/all returned 200');
  assert(allRes.body.operations.length === 23, '2. All 23 operation steps present');
  assert(allRes.body.templates.length === 3, '3. Template downloads present');
  assert(allRes.body.manuals.length === 5, '4. Manual downloads present (Admin, Teacher, Homeroom, Checklist, Monthly)');
  assert(allRes.body.faqs.length >= 12, '5. All FAQ categories present (Students, Courses, Subsidy, NEIS, Config, Surveys, etc.)');

  // 2. Test Document Viewers
  const doc1Res = await get('/api/manual/doc/1');
  assert(doc1Res.status === 200 && doc1Res.body.doc.title.includes('학교홈페이지 배너 등록'), '6. Operation 1 document content loaded');

  const doc4Res = await get('/api/manual/doc/71');
  assert(doc4Res.status === 200 && doc4Res.body.doc.title.includes('학생등록'), '7. Operation 4 (Student Reg) document loaded');

  const docFaqRes = await get('/api/manual/doc/89');
  assert(docFaqRes.status === 200 && docFaqRes.body.doc.title.includes('학생 비밀번호를 초기화'), '8. FAQ Document (Password reset) loaded');

  // 3. Test Download Endpoints
  const dlRes = await get('/api/manual/download/manual_af');
  assert(dlRes.status === 200 && dlRes.headers['content-disposition'].includes('attachment'), '9. /api/manual/download/manual_af download header verified');

  const dlBannerRes = await get('/api/manual/download/banner');
  assert(dlBannerRes.status === 200 && dlBannerRes.headers['content-disposition'].includes('dbdbschool_banner.png'), '10. /api/manual/download/banner filename verified');

  // 4. Test Official Direct Router /help/go_data/num/:num/data/:type
  const directDocRes = await get('/help/go_data/num/1/data/doc');
  assert(directDocRes.status === 302, '11. /help/go_data/num/1/data/doc redirects properly');

  // 5. Test Live SPA Route
  const spaRes = await get('/af/ad_faq/main/sn/3267');
  assert(spaRes.status === 200 && spaRes.raw.includes('디비디비스쿨'), '12. SPA route /af/ad_faq/main/sn/3267 rendered index.html');

  console.log('\n========================================');
  console.log(`🎉 TEST SUMMARY: ${passed}/${total} assertions passed (${Math.round((passed/total)*100)}%)`);
  console.log('========================================\n');
}

runTests().catch(console.error);
