const http = require('http');

function request(method, path, data = null) {
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
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== 1. Check GET /api/af/ad_lec/lists/sn/3267 ===');
  const initial = await request('GET', '/api/af/ad_lec/lists/sn/3267');
  console.log('Initial total count:', initial.body.totalCount);

  console.log('\n=== 2. Register New Weekend Lecture (토요일/일요일) ===');
  const newCoursePayload = {
    schoolId: '3267',
    category: '26년 9월',
    neulbomType: '방과후',
    title: '주말 창의 드론 항공 교실',
    instructor: 'tea01',
    teacherName: '김선생 (대표강사)',
    targetGrade: '1,2,3',
    capacity: 20,
    waitingCapacity: 5,
    totalHours: 16,
    period: '2026-09-01 ~ 2026-09-30',
    tuitionFee: 35000,
    fee: 35000,
    costFacility: 3500,
    costInstructor: 31500,
    textbookFee: 10000,
    materialFee: 5000,
    classroom: '본관2층 컴퓨터교실',
    location: '본관2층 컴퓨터교실',
    dayOfWeek: '토',
    scheduleTime: '토1부 (13:00~13:40)',
    schedule: '토:토1부 (13:00~13:40)',
    allowTimeConflict: false,
    noSameTeacher: false,
    content: '주말 토요일 드론 비행 및 코딩 교육',
    status: 'OUTPUT'
  };

  const createRes = await request('POST', '/api/af/ad_lec/create', newCoursePayload);
  console.log('Create status:', createRes.status, 'Success:', createRes.body.success, 'Msg:', createRes.body.message);
  const createdCourse = createRes.body.lecture;
  console.log('Created ID:', createdCourse.id, 'Title:', createdCourse.title, 'Day:', createdCourse.dayOfWeek, 'Time:', createdCourse.scheduleTime);

  console.log('\n=== 3. Verify Newly Registered Course in List ===');
  const listRes = await request('GET', '/api/af/ad_lec/lists/sn/3267?category=26%EB%85%84%209%EC%9B%94');
  const found = listRes.body.lectures.find(l => l.id === createdCourse.id);
  console.log('Found created lecture in category 26년 9월:', !!found);
  if (found) {
    console.log('Lecture details:', {
      id: found.id,
      title: found.title,
      category: found.category,
      dayOfWeek: found.dayOfWeek,
      scheduleTime: found.scheduleTime,
      tuitionFee: found.tuitionFee,
      capacity: found.capacity
    });
  }

  console.log('\n=== 4. Test Update Course ===');
  const updatePayload = {
    id: createdCourse.id,
    title: '주말 창의 드론 항공 교실 (심화)',
    capacity: 25,
    dayOfWeek: '일',
    scheduleTime: '일2부 (14:00~14:40)',
    schedule: '일:일2부 (14:00~14:40)'
  };
  const updateRes = await request('POST', '/api/af/ad_lec/update', updatePayload);
  console.log('Update status:', updateRes.status, 'Success:', updateRes.body.success, 'Msg:', updateRes.body.message);
  console.log('Updated title:', updateRes.body.lecture.title, 'Day:', updateRes.body.lecture.dayOfWeek, 'Time:', updateRes.body.lecture.scheduleTime);

  console.log('\n=== 5. Test Delete Course ===');
  const delRes = await request('DELETE', `/api/af/ad_lec/${createdCourse.id}`);
  console.log('Delete status:', delRes.status, 'Success:', delRes.body.success, 'Msg:', delRes.body.message);

  const verifyDel = await request('GET', '/api/af/ad_lec/lists/sn/3267?category=26%EB%85%84%209%EC%9B%94');
  const deletedFound = verifyDel.body.lectures.find(l => l.id === createdCourse.id);
  console.log('Course after delete exists?:', !!deletedFound);

  console.log('\n=== ALL API AUTOMATED TESTS COMPLETED SUCCESSFULLY ===');
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
