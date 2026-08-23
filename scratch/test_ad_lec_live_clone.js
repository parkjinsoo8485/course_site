const http = require('http');

function request(method, urlPath, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`http://localhost:3005${urlPath}`);
    const req = http.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data), raw: data });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('================================================================');
  console.log('  [자동 검증] 강좌관리(/af/ad_lec/lists/sn/3267) UI 및 API 테스트');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
    }
  }

  try {
    // 1. 강좌관리 HTML 서빙 확인
    const rHtml = await request('GET', '/af/ad_lec/lists/sn/3267');
    assert(rHtml.status === 200 && rHtml.raw.includes('main_control_box_btn01'), '1. 강좌관리 HTML 페이지 서빙 및 상세검색 토글 DOM 확인');
    assert(rHtml.raw.includes('bottom_batch_action'), '2. 하단 33종 일괄적용 셀렉트 박스 DOM 확인');
    assert(rHtml.raw.includes('new_help_manualbox'), '3. 실서비스 매뉴얼 헤더 박스 DOM 확인');

    // 2. 강좌 목록 API 조회
    const rList = await request('GET', '/api/af/ad_lec/lists/sn/3267');
    assert(rList.status === 200 && rList.data.success === true, '4. 강좌 목록 API 200 OK 응답');
    assert(Array.isArray(rList.data.lectures) && rList.data.lectures.length > 0, `5. 강좌 데이터 바인딩 확인 (총 ${rList.data.lectures.length}개 강좌)`);

    // 3. 강좌 필터링 API 테스트 (구분/키워드)
    const rFilter = await request('GET', '/api/af/ad_lec/lists/sn/3267?keyword=돌봄');
    assert(rFilter.status === 200 && rFilter.data.lectures.every(l => l.title.includes('돌봄') || (l.instructor && l.instructor.includes('돌봄'))), '6. 키워드 필터링(돌봄) 정상 작동');

    // 4. 강좌 속성 업데이트 테스트
    const firstCourse = rList.data.lectures[0];
    const origStatus = firstCourse.status;
    const rUpdate = await request('PUT', `/api/af/ad_lec/update/${firstCourse.id}`, {
      ...firstCourse,
      status: origStatus === 'OUTPUT' ? 'CLOSED' : 'OUTPUT'
    });
    assert(rUpdate.status === 200 && rUpdate.data.success === true, '7. 강좌 속성(상태) 단일 토글 업데이트 API 성공');

    // 5. 원복
    await request('PUT', `/api/af/ad_lec/update/${firstCourse.id}`, { ...firstCourse, status: origStatus });

    console.log(`\n================================================================`);
    console.log(`  검증 결과: ${passed}/${total} 통과 (${passed === total ? 'ALL PASS' : 'SOME FAILED'})`);
    console.log(`================================================================`);
  } catch (err) {
    console.error('Test Execution Error:', err);
  }
}

runTests();
