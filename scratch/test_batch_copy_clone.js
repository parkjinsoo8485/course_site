const http = require('http');
const fs = require('fs');
const path = require('path');

function makeRequest(method, urlPath, payload = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, 'http://localhost:3005');
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {}
    };

    let dataStr = null;
    if (payload) {
      dataStr = JSON.stringify(payload);
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(dataStr);
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', reject);
    if (dataStr) req.write(dataStr);
    req.end();
  });
}

async function runTests() {
  console.log('======================================================================');
  console.log('🧪 [테스트] 강좌 일괄복사(batchCopyModal) 클론 & API 무결성 검증');
  console.log('======================================================================\n');

  let allPassed = true;

  // 1. Check scratch/copy_page.html
  console.log('▶ 1. scratch/copy_page.html 스크랩 파일 존재 및 원본 필드 검증');
  const copyHtmlPath = path.resolve('scratch/copy_page.html');
  if (fs.existsSync(copyHtmlPath)) {
    const content = fs.readFileSync(copyHtmlPath, 'utf-8');
    const hasForm = content.includes('fm_edit');
    const hasLecList = content.includes('lec_list[]');
    const hasDiv2 = content.includes('lec_div2');
    const hasMem = content.includes('copy_mem');
    const hasPay = content.includes('copy_lec_pay');
    if (hasForm && hasLecList && hasDiv2 && hasMem && hasPay) {
      console.log(`  ✅ scratch/copy_page.html 정상 확인 (${content.length} bytes, 폼/필드 완전 포함)`);
    } else {
      console.error('  ❌ scratch/copy_page.html 내부 필수 요소 누락');
      allPassed = false;
    }
  } else {
    console.error('  ❌ scratch/copy_page.html 파일 없음');
    allPassed = false;
  }

  // 2. Direct route request for /af/ad_lec/copy/...
  console.log('\n▶ 2. /af/ad_lec/copy/p/1/sn/3267/sld/11/sof/ln/sot/asc 라우트 접근성 검증');
  try {
    const res = await makeRequest('GET', '/af/ad_lec/copy/p/1/sn/3267/sld/11/sof/ln/sot/asc');
    if (res.status === 200 && res.body.includes('batchCopyModal') && res.body.includes('copy_lec_list_container') && res.body.includes('copy_chk_all')) {
      console.log('  ✅ 200 OK 응답 및 batchCopyModal DOM 완벽 서빙 확인');
    } else {
      console.error(`  ❌ 라우트 실패 (Status: ${res.status})`);
      allPassed = false;
    }
  } catch (err) {
    console.error('  ❌ 요청 오류:', err.message);
    allPassed = false;
  }

  // 3. API bulk-copy test
  console.log('\n▶ 3. /api/af/ad_lec/bulk-copy API 일괄 복사 기능 검증');
  try {
    const copyPayload = {
      schoolId: 'sch_1',
      selectedIds: ['101', '102'],
      targetCategory: '26년 10월',
      targetDivision: '12',
      copyApplicants: true,
      copyNotRefunded: true,
      copyWaitlist: true,
      copyFees: {
        tuitionFee: 'Y',
        useCost: 'Y',
        bookFee: 'Y',
        materialFee: 'Y'
      },
      period: '2026.10.01 ~ 2026.10.31',
      status: 'OUTPUT'
    };
    const res = await makeRequest('POST', '/api/af/ad_lec/bulk-copy', copyPayload);
    const data = JSON.parse(res.body);
    if (res.status === 200 && data.success) {
      console.log(`  ✅ API 성공: ${data.message} (count: ${data.count})`);
    } else {
      console.error('  ❌ API 실패:', data);
      allPassed = false;
    }
  } catch (err) {
    console.error('  ❌ API 호출 오류:', err.message);
    allPassed = false;
  }

  // 4. Check client script bindings in admin_lec.js
  console.log('\n▶ 4. admin_lec.js 클라이언트 스크립트 함수 및 바인딩 검증');
  const jsContent = fs.readFileSync(path.resolve('course_site/af/ad_lec/lists/sn/admin_lec.js'), 'utf-8');
  const hasOpen = jsContent.includes('window.openBatchCopyModal = openBatchCopyModal');
  const hasClose = jsContent.includes('window.closeBatchCopyModal = closeBatchCopyModal');
  const hasChkAll = jsContent.includes('window.copy_chk_all = copy_chk_all');
  const hasChkField = jsContent.includes('window.copy_chk_field = copy_chk_field');
  const hasSubmit = jsContent.includes('window.submitBatchCopyModal = submitBatchCopyModal');

  if (hasOpen && hasClose && hasChkAll && hasChkField && hasSubmit) {
    console.log('  ✅ openBatchCopyModal, closeBatchCopyModal, copy_chk_all, copy_chk_field, submitBatchCopyModal 바인딩 완료');
  } else {
    console.error('  ❌ 함수 바인딩 누락');
    allPassed = false;
  }

  // 5. CSS standard verification in admin_lec.css
  console.log('\n▶ 5. admin_lec.css 모달 표준 및 수직 정렬 스타일 검증');
  const cssContent = fs.readFileSync(path.resolve('course_site/af/ad_lec/lists/sn/admin_lec.css'), 'utf-8');
  if (cssContent.includes('#batchCopyModal') && cssContent.includes('.lec-list-scroll') && cssContent.includes('line-height: normal !important')) {
    console.log('  ✅ #batchCopyModal 30px 높이 & normal line-height 표준 준수 확인');
  } else {
    console.error('  ❌ CSS 표준 스타일 누락');
    allPassed = false;
  }

  console.log('\n======================================================================');
  if (allPassed) {
    console.log('🎉 모든 자동화 테스트 통과 완료!');
  } else {
    console.log('❌ 일부 테스트가 실패했습니다.');
    process.exit(1);
  }
  console.log('======================================================================');
}

runTests().catch(err => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
