const http = require('http');

function testEndpoint(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3005,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, headers: res.headers, data: data });
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runValidation() {
  console.log('🧪 [검증 1] 강좌 일괄입력 페이지 라우팅 테스트: /af/ad_lec/input/p/1/sn/3267/sld/11/sof/ln/sot/asc');
  const resPage = await testEndpoint('/af/ad_lec/input/p/1/sn/3267/sld/11/sof/ln/sot/asc');
  console.log(`- 응답 코드: ${resPage.statusCode}`);
  const hasBatchTitle = resPage.data.includes('일괄입력') && resPage.data.includes('엑셀 데이터 파일');
  console.log(`- 일괄입력 필수 마크업 포함 여부: ${hasBatchTitle ? '✅ PASS' : '❌ FAIL'}`);

  console.log('\n🧪 [검증 2] 일괄입력 CSV 샘플 다운로드 라우팅: /af/ad_lec/inputs');
  const resSample = await testEndpoint('/af/ad_lec/inputs');
  console.log(`- 응답 코드: ${resSample.statusCode}`);
  console.log(`- Content-Type: ${resSample.headers['content-type']}`);
  const hasSampleHeaders = resSample.data.includes('강좌구분') && resSample.data.includes('강좌명');
  console.log(`- 샘플 헤더 포함 여부: ${hasSampleHeaders ? '✅ PASS' : '❌ FAIL'}`);

  console.log('\n🧪 [검증 3] 강좌 일괄등록 API 엔드포인트: POST /api/af/ad_lec/batch-upload');
  const sampleRow = [{
    category: '26년 9월',
    programType: '방과후',
    limitGroup: '',
    name: '자동검증 테스트 일괄강좌',
    instructorId: 'tea01',
    assistantId: '',
    targetGrades: ['1', '2'],
    time: '수1부(13:00~13:40)',
    allowTimeConflict: false,
    capacity: 20,
    waitingCapacity: 5,
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    totalHours: 16,
    room: '본관2층 컴퓨터교실',
    fee: 30000,
    facilityFee: 3000,
    bookFee: 0,
    materialFee: 0,
    description: '자동 검증용 일괄입력 테스트'
  }];

  const resApi = await testEndpoint('/api/af/ad_lec/batch-upload', 'POST', {
    schoolId: '3267',
    rows: sampleRow
  });
  console.log(`- API 응답 코드: ${resApi.statusCode}`);
  console.log(`- API 응답 바디: ${resApi.data}`);
  const apiSuccess = JSON.parse(resApi.data).success === true;
  console.log(`- API 처리 성공 여부: ${apiSuccess ? '✅ PASS' : '❌ FAIL'}`);

  if (hasBatchTitle && hasSampleHeaders && apiSuccess) {
    console.log('\n🎉 [전체 검증 성공] 강좌 일괄입력 화면 및 백엔드 연동이 완벽하게 완료되었습니다!');
  } else {
    console.error('\n❌ [검증 실패]');
    process.exit(1);
  }
}

runValidation().catch(err => {
  console.error('테스트 실행 에러:', err);
  process.exit(1);
});
