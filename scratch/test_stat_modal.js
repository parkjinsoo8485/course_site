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
  console.log('🧪 [테스트] 강좌통계 (statModal) 클론 및 연동 무결성 검증');
  console.log('======================================================================\n');

  let allPassed = true;

  // 1. Check scratch/target.html
  console.log('▶ 1. scratch/target.html 스크랩 파일 존재 및 원본 통계 테이블 검증');
  const targetHtmlPath = path.resolve('scratch/target.html');
  if (fs.existsSync(targetHtmlPath)) {
    const content = fs.readFileSync(targetHtmlPath, 'utf-8');
    const hasTable = content.includes('<table') && content.includes('구분') && content.includes('강좌통계');
    const hasTotal = content.includes('합계') && content.includes('8,999');
    if (hasTable && hasTotal) {
      console.log(`  ✅ scratch/target.html 정상 확인 (${content.length} bytes, 통계 테이블/합계 포함)`);
    } else {
      console.error('  ❌ scratch/target.html 에 테이블 또는 합계 누락');
      allPassed = false;
    }
  } else {
    console.error('  ❌ scratch/target.html 파일 없음');
    allPassed = false;
  }

  // 2. Check index.html & 3267/index.html for #statModal
  console.log('\n▶ 2. index.html 및 3267/index.html 모달(#statModal) 구조 검증');
  const indexFiles = [
    path.resolve('course_site/af/ad_lec/lists/sn/index.html'),
    path.resolve('course_site/af/ad_lec/lists/sn/3267/index.html')
  ];

  for (const f of indexFiles) {
    const fname = path.relative('.', f);
    if (!fs.existsSync(f)) {
      console.error(`  ❌ ${fname} 파일 없음`);
      allPassed = false;
      continue;
    }
    const html = fs.readFileSync(f, 'utf-8');
    const hasModal = html.includes('id="statModal"');
    const hasCenterStyle = html.includes('position: fixed !important;') && html.includes('justify-content: center !important;');
    const hasTable = html.includes('id="stat_table_tbody"') && html.includes('구분') && html.includes('합계');
    const hasManualBtn = html.includes('강좌 통계') && html.includes('매뉴얼');
    const hasBtnActionStat = html.includes('id="btn_action_stat"') && html.includes('openStatModal');

    if (hasModal && hasCenterStyle && hasTable && hasManualBtn && hasBtnActionStat) {
      console.log(`  ✅ ${fname}: #statModal 정중앙 모달, 테이블, [강좌통계] 버튼 바인딩 완벽 일치`);
    } else {
      console.error(`  ❌ ${fname} 검증 실패:`, { hasModal, hasCenterStyle, hasTable, hasManualBtn, hasBtnActionStat });
      allPassed = false;
    }
  }

  // 3. Check admin_lec.js for functions and exports
  console.log('\n▶ 3. admin_lec.js JS 함수 및 전역 window 바인딩 검증');
  const jsPath = path.resolve('course_site/af/ad_lec/lists/sn/admin_lec.js');
  if (fs.existsSync(jsPath)) {
    const js = fs.readFileSync(jsPath, 'utf-8');
    const hasOpen = js.includes('function openStatModal()');
    const hasClose = js.includes('function closeStatModal()');
    const hasLoad = js.includes('async function loadStatData()');
    const hasFilter = js.includes('function filterByStatCategory(');
    const hasExpOpen = js.includes('window.openStatModal = openStatModal');
    const hasExpClose = js.includes('window.closeStatModal = closeStatModal');
    const hasRoute = js.includes("path.includes('/af/ad_lec/stat')");

    if (hasOpen && hasClose && hasLoad && hasFilter && hasExpOpen && hasExpClose && hasRoute) {
      console.log('  ✅ admin_lec.js: openStatModal, closeStatModal, loadStatData, filterByStatCategory, 라우트 핸들러 정상');
    } else {
      console.error('  ❌ admin_lec.js 함수 누락:', { hasOpen, hasClose, hasLoad, hasFilter, hasExpOpen, hasExpClose, hasRoute });
      allPassed = false;
    }
  }

  // 4. Check admin_lec.css for #statModal
  console.log('\n▶ 4. admin_lec.css 모달 스타일 검증');
  const cssPath = path.resolve('course_site/af/ad_lec/lists/sn/admin_lec.css');
  if (fs.existsSync(cssPath)) {
    const css = fs.readFileSync(cssPath, 'utf-8');
    const hasModalCss = css.includes('#statModal .modal-box') && css.includes('#statModal table.list');
    if (hasModalCss) {
      console.log('  ✅ admin_lec.css: #statModal 스타일 정상 등록');
    } else {
      console.error('  ❌ admin_lec.css: #statModal 스타일 누락');
      allPassed = false;
    }
  }

  // 5. Check live HTTP endpoints
  console.log('\n▶ 5. HTTP 실시간 엔드포인트 검증');
  try {
    const resPage = await makeRequest('GET', '/af/ad_lec/lists/sn/3267');
    if (resPage.status === 200 && resPage.body.includes('id="statModal"')) {
      console.log('  ✅ GET /af/ad_lec/lists/sn/3267: 200 OK (statModal DOM 포함)');
    } else {
      console.error('  ❌ GET /af/ad_lec/lists/sn/3267 응답 오류:', resPage.status);
      allPassed = false;
    }

    const resStatPage = await makeRequest('GET', '/af/ad_lec/stat/sn/3267');
    if (resStatPage.status === 200 && resStatPage.body.includes('id="statModal"')) {
      console.log('  ✅ GET /af/ad_lec/stat/sn/3267: 200 OK (stat URL SPA 서빙 정상)');
    } else {
      console.error('  ❌ GET /af/ad_lec/stat/sn/3267 응답 오류:', resStatPage.status);
      allPassed = false;
    }

    const resStatsApi = await makeRequest('GET', '/api/af/ad_lec/stats');
    const apiJson = JSON.parse(resStatsApi.body);
    if (resStatsApi.status === 200 && apiJson.success && Array.isArray(apiJson.stats)) {
      console.log(`  ✅ GET /api/af/ad_lec/stats: 200 OK (과정별 통계 ${apiJson.stats.length}개 반환)`);
    } else {
      console.error('  ❌ GET /api/af/ad_lec/stats API 응답 오류:', resStatsApi.status, apiJson);
      allPassed = false;
    }
  } catch (err) {
    console.error('  ❌ HTTP 요청 실패:', err.message);
    allPassed = false;
  }

  console.log('\n----------------------------------------------------------------------');
  if (allPassed) {
    console.log('🎉 모든 강좌통계(statModal) 클론 검증 테스트를 100% 통과했습니다!');
  } else {
    console.log('❌ 일부 검증 항목에 실패했습니다.');
  }
  console.log('----------------------------------------------------------------------\n');
}

runTests();
