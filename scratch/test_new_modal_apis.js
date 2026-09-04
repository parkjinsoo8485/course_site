const http = require('http');
const fs = require('fs');
const path = require('path');

function request(method, path, data = null, isMultipart = false, boundary = '') {
  return new Promise((resolve, reject) => {
    const headers = {};
    if (isMultipart) {
      headers['Content-Type'] = `multipart/form-data; boundary=${boundary}`;
    } else if (data) {
      headers['Content-Type'] = 'application/json';
    }

    const options = {
      hostname: 'localhost',
      port: 3005,
      path: path,
      method: method,
      headers: headers
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
    if (data) {
      if (Buffer.isBuffer(data)) {
        req.write(data);
      } else {
        req.write(typeof data === 'string' ? data : JSON.stringify(data));
      }
    }
    req.end();
  });
}

async function runTests() {
  console.log('=============================================');
  console.log('🚀 강좌등록 신규 API & 기능 검증 테스트 시작');
  console.log('=============================================');

  let passed = 0;
  let total = 0;

  // 1. 강좌 구분 동적 조회 API 검증
  total++;
  try {
    const res = await request('GET', '/api/af/ad_lec/divisions?sn=3267');
    console.log(`[Test 1] GET /api/af/ad_lec/divisions: status=${res.status}, divisionsCount=${res.body.divisions?.length}`);
    if (res.status === 200 && res.body.success && Array.isArray(res.body.divisions) && res.body.divisions.length > 0) {
      console.log('  -> PASS: 강좌구분 목록 반환 정상');
      passed++;
    } else {
      console.error('  -> FAIL:', res.body);
    }
  } catch (err) {
    console.error('  -> FAIL with exception:', err.message);
  }

  // 2. 강의시간 슬롯 목록 API 검증
  total++;
  try {
    const res = await request('GET', '/api/af/ad_lec/time-slots?sn=3267');
    console.log(`[Test 2] GET /api/af/ad_lec/time-slots: status=${res.status}, slotsCount=${res.body.slots?.length}`);
    if (res.status === 200 && res.body.success && Array.isArray(res.body.slots) && res.body.slots.length > 0) {
      console.log('  -> PASS: 강의시간 슬롯 목록 반환 정상 (예: ' + res.body.slots[0].value + ')');
      passed++;
    } else {
      console.error('  -> FAIL:', res.body);
    }
  } catch (err) {
    console.error('  -> FAIL with exception:', err.message);
  }

  // 3. 강사 중복 배정 실시간 체크 API 검증
  total++;
  try {
    const res = await request('GET', '/api/af/ad_lec/check-instructor?teaId=tea01');
    console.log(`[Test 3] GET /api/af/ad_lec/check-instructor: status=${res.status}, conflict=${res.body.conflict}`);
    if (res.status === 200 && res.body.success !== undefined) {
      console.log('  -> PASS: 강사 배정 충돌 검사 API 응답 정상');
      passed++;
    } else {
      console.error('  -> FAIL:', res.body);
    }
  } catch (err) {
    console.error('  -> FAIL with exception:', err.message);
  }

  // 4. 강의시간 충돌 감지 API 검증
  total++;
  try {
    const res = await request('GET', '/api/af/ad_lec/check-time-conflict?scheduleTime=' + encodeURIComponent('월1부'));
    console.log(`[Test 4] GET /api/af/ad_lec/check-time-conflict: status=${res.status}, conflict=${res.body.conflict}`);
    if (res.status === 200 && res.body.success !== undefined) {
      console.log('  -> PASS: 강의시간 충돌 검사 API 응답 정상');
      passed++;
    } else {
      console.error('  -> FAIL:', res.body);
    }
  } catch (err) {
    console.error('  -> FAIL with exception:', err.message);
  }

  // 5. 첨부파일 업로드 API 검증
  total++;
  try {
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    const filename = 'test_plan.txt';
    const content = '강의계획서 테스트 내용입니다.';
    const bodyStr = 
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="file[]"; filename="${filename}"\r\n` +
      `Content-Type: text/plain\r\n\r\n` +
      `${content}\r\n` +
      `--${boundary}--\r\n`;

    const res = await request('POST', '/api/af/ad_lec/upload-file', Buffer.from(bodyStr, 'utf-8'), true, boundary);
    console.log(`[Test 5] POST /api/af/ad_lec/upload-file: status=${res.status}, msg=${res.body.message}`);
    if (res.status === 200 && res.body.success && res.body.files?.length > 0) {
      console.log('  -> PASS: 파일 업로드 정상 처리됨 (저장 파일명: ' + res.body.files[0].filename + ')');
      passed++;
    } else {
      console.error('  -> FAIL:', res.body);
    }
  } catch (err) {
    console.error('  -> FAIL with exception:', err.message);
  }

  // 6. 강좌 등록 및 목록 반영 종합 검증
  total++;
  try {
    const newCoursePayload = {
      schoolId: '3267',
      category: '26년 9월',
      neulbomType: '방과후',
      title: `[자동테스트] 코딩 드론 교실 (${Date.now().toString().slice(-4)})`,
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
      scheduleTime: '토1부 (13:00~13:40)',
      scheduleDay: '토',
      status: '접수중'
    };

    const addRes = await request('POST', '/api/af/ad_lec/create', newCoursePayload);
    console.log(`[Test 6] POST /api/af/ad_lec/create: status=${addRes.status}, id=${addRes.body.lecture?.id}`);
    if (addRes.status === 200 && addRes.body.success) {
      console.log('  -> PASS: 강좌 생성 성공');
      passed++;
    } else {
      console.error('  -> FAIL:', addRes.body);
    }
  } catch (err) {
    console.error('  -> FAIL with exception:', err.message);
  }

  console.log('=============================================');
  console.log(`🎉 최종 검증 결과: ${passed} / ${total} 통과 (${(passed / total * 100).toFixed(1)}%)`);
  console.log('=============================================');

  process.exit(passed === total ? 0 : 1);
}

runTests();
