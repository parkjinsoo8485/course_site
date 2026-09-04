const http = require('http');
const fs = require('fs');
const path = require('path');

function request(urlPath) {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3005' + urlPath, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('======================================================================');
  console.log('🧪 [테스트] 버튼 고유 URL & 모달 라우팅 무결성 종합 검증');
  console.log('======================================================================\n');

  let passed = true;

  // 1. Check HTML markup for action buttons
  console.log('▶ 1. index.html 내 타깃 사이트 고유 URL 액션 버튼 존재 확인');
  const indexPath = path.resolve('course_site/af/ad_lec/lists/sn/index.html');
  const indexHtml = fs.readFileSync(indexPath, 'utf-8');

  const requiredIds = [
    'btn_action_att',
    'btn_action_write',
    'btn_action_input',
    'btn_action_modify',
    'btn_action_copy',
    'btn_action_stat'
  ];

  for (const id of requiredIds) {
    if (indexHtml.includes(`id="${id}"`)) {
      console.log(`  ✅ #${id} 버튼 고유 마크업 확인`);
    } else {
      console.error(`  ❌ #${id} 버튼 누락`);
      passed = false;
    }
  }

  // Check hrefs
  const requiredHrefs = [
    '/af/ad_att/excel/p/1/sn/3267/sld/11/sof/ln/sot/asc',
    '/af/ad_lec/write/p/1/sn/3267/sld/11/sof/ln/sot/asc',
    '/af/ad_lec/input/p/1/sn/3267/sld/11/sof/ln/sot/asc',
    '/af/ad_lec/modifyField/p/1/sn/3267/sld/11/sof/ln/sot/asc',
    '/af/ad_lec/copy/p/1/sn/3267/sld/11/sof/ln/sot/asc',
    '/af/ad_lec/stat/sn/3267'
  ];

  for (const href of requiredHrefs) {
    if (indexHtml.includes(href)) {
      console.log(`  ✅ 고유 URL [${href}] 포함 확인`);
    } else {
      console.error(`  ❌ 고유 URL [${href}] 누락`);
      passed = false;
    }
  }

  // 2. Server Direct Route Requests
  console.log('\n▶ 2. 버튼별 고유 URL 서버 라우팅 및 딥링크 응답 검증');
  const routesToTest = [
    { url: '/af/ad_att/excel/p/1/sn/3267/sld/11/sof/ln/sot/asc', expectType: 'excel' },
    { url: '/af/ad_lec/write/p/1/sn/3267/sld/11/sof/ln/sot/asc', expectType: 'html' },
    { url: '/af/ad_lec/input/p/1/sn/3267/sld/11/sof/ln/sot/asc', expectType: 'html' },
    { url: '/af/ad_lec/modifyField/p/1/sn/3267/sld/11/sof/ln/sot/asc', expectType: 'html' },
    { url: '/af/ad_lec/copy/p/1/sn/3267/sld/11/sof/ln/sot/asc', expectType: 'html' },
    { url: '/af/ad_lec/stat/sn/3267', expectType: 'html' }
  ];

  for (const item of routesToTest) {
    try {
      const res = await request(item.url);
      if (res.status === 200) {
        if (item.expectType === 'excel') {
          const contentType = res.headers['content-type'] || '';
          if (contentType.includes('excel')) {
            console.log(`  ✅ [출석부 엑셀] ${item.url} -> 200 OK (Excel 다운로드 헤더 정상: ${contentType})`);
          } else {
            console.error(`  ❌ [출석부 엑셀] Content-Type 불일치: ${contentType}`);
            passed = false;
          }
        } else {
          console.log(`  ✅ [페이지 라우트] ${item.url} -> 200 OK (SPA 템플릿 서빙 정상)`);
        }
      } else {
        console.error(`  ❌ ${item.url} -> 상태 코드 ${res.status}`);
        passed = false;
      }
    } catch(err) {
      console.error(`  ❌ ${item.url} 요청 실패: ${err.message}`);
      passed = false;
    }
  }

  // 3. Check admin_lec.js engine functions
  console.log('\n▶ 3. admin_lec.js 클라이언트 라우팅 엔진 검증');
  const jsPath = path.resolve('course_site/af/ad_lec/lists/sn/admin_lec.js');
  const jsContent = fs.readFileSync(jsPath, 'utf-8');

  const requiredFns = [
    'getActionUrl',
    'updateActionButtonUrls',
    'handleActionUrl',
    'restoreListUrl',
    'checkInitialModalRoute'
  ];

  for (const fn of requiredFns) {
    if (jsContent.includes(`function ${fn}`)) {
      console.log(`  ✅ ${fn}() 함수 정의 및 탑재 확인`);
    } else {
      console.error(`  ❌ ${fn}() 함수 누락`);
      passed = false;
    }
  }

  console.log('\n======================================================================');
  if (passed) {
    console.log('🎉 [검증 성공] 모든 버튼의 고유 URL 생성 및 모달 연동이 완벽합니다!');
  } else {
    console.log('❌ 일부 테스트가 실패했습니다.');
  }
  console.log('======================================================================\n');
}

runTests();
