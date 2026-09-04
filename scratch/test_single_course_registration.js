const http = require('http');

function request(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3005,
      path: path,
      method: method,
      headers: { 'Content-Type': 'application/json' }
    };
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function testSingleCourseRegistration() {
  console.log('=== [1] 강좌 목록 조회 (전체 구분) ===');
  const allRes = await request('GET', '/api/af/ad_lec/lists/sn/3267');
  console.log('초기 전체 강좌 수:', allRes.body.totalCount);

  console.log('\n=== [2] 신규 강좌 1건 등록 (POST /api/af/ad_lec/create) ===');
  const payload = {
    schoolId: '3267',
    category: '26년 9월',
    neulbomType: '맞춤형',
    title: '단건 등록 검증 강좌 (로봇코딩)',
    instructor: 'tea02',
    targetGrade: '1,2,3',
    capacity: 20,
    waitingCapacity: 5,
    totalHours: 16,
    period: '2026-09-01 ~ 2026-09-30',
    tuitionFee: 30000,
    costFacility: 3000,
    costInstructor: 27000,
    classroom: '본관2층 컴퓨터교실',
    dayOfWeek: '화',
    scheduleTime: '화1부 (13:00~13:40)',
    status: 'OUTPUT'
  };

  const createRes = await request('POST', '/api/af/ad_lec/create', payload);
  console.log('등록 응답 success:', createRes.body.success, 'message:', createRes.body.message);
  const newId = createRes.body.lecture.id;

  console.log('\n=== [3] 해당 구분(26년 9월) 조회 시 등록된 강좌만 정확히 반영되는지 확인 ===');
  const sepRes = await request('GET', '/api/af/ad_lec/lists/sn/3267?category=26%EB%85%84%209%EC%9B%94');
  console.log('26년 9월 강좌 목록:');
  sepRes.body.lectures.forEach((l, i) => {
    console.log(`  [${i+1}] ${l.title} (강사: ${l.teacherName}, 정원: ${l.capacity}, 상태: ${l.status})`);
  });

  const found = sepRes.body.lectures.find(l => l.id === newId);
  if (!found) {
    throw new Error('새로 등록된 강좌가 목록에 나타나지 않습니다!');
  }
  console.log('✓ 신규 등록된 단건 강좌 정상 노출 확인 완료 (ID:', newId, ')');

  // Clean up the temporary test course
  await request('DELETE', `/api/af/ad_lec/${newId}`);
  console.log('✓ 임시 검증 강좌 삭제 정리 완료');
}

testSingleCourseRegistration().catch(err => {
  console.error('테스트 실패:', err);
  process.exit(1);
});
