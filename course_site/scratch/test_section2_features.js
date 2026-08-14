const http = require('http');

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : '';
    const req = http.request({
      hostname: 'localhost',
      port: 3005,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataString)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (dataString) req.write(dataString);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 [Test Harness] Official 107-Page Manual Section 2 Features Test');

  // Test 1: 2.2 & 2.3 Staff & Service Admin
  const staffAdd = await request('POST', '/api/manual/staff', { name: '최선생', role: 'staff', permissions: ['학생관리'] });
  if (staffAdd.data && staffAdd.data.success) {
    console.log('✅ [1/7] Section 2.2~2.3 Staff & Service Admin Creation: PASS');
  } else {
    throw new Error('Staff creation failed');
  }

  // Test 2: 2.4.1 Temporary Student Rules (7학년 생월반 생일번)
  const tempStu = await request('POST', '/api/manual/temp-student', { name: '홍길동', birthDate: '2019-12-31', phone: '010-2345-6789' });
  if (tempStu.data && tempStu.data.student && tempStu.data.student.gradeClass === '7학년 12반 31번') {
    console.log(`✅ [2/7] Section 2.4.1 Temp Student Generation ('7학년 12반 31번'): PASS`);
  } else {
    throw new Error('Temp student calculation failed: ' + JSON.stringify(tempStu.data));
  }

  // Test 3: 2.4.1 Multi-Child Account Sharing
  const multiChild = await request('GET', '/api/manual/multi-child?phone=010-2345-6789');
  if (multiChild.data && multiChild.data.children && multiChild.data.children.length >= 2) {
    console.log(`✅ [3/7] Section 2.4.1 Multi-Child Quick Switch Accounts (${multiChild.data.children.length} children): PASS`);
  } else {
    throw new Error('Multi-child retrieval failed');
  }

  // Test 4: 2.5 Homeroom Teacher
  const homeroom = await request('POST', '/api/manual/homeroom', { name: '정담임', assignedClass: '3학년 2반', phone: '010-9999-1111' });
  if (homeroom.data && homeroom.data.success) {
    console.log('✅ [4/7] Section 2.5 Homeroom Teacher Management: PASS');
  } else {
    throw new Error('Homeroom teacher creation failed');
  }

  // Test 5: 2.6 Instructor Banking Groups (동일 강사 ID 스쿨뱅킹 묶음 징수)
  const bankingGroups = await request('GET', '/api/manual/instructor-banking-groups');
  if (bankingGroups.data && bankingGroups.data.groups && bankingGroups.data.groups.length > 0) {
    console.log(`✅ [5/7] Section 2.6 Instructor School Banking Grouping (${bankingGroups.data.groups.length} groups): PASS`);
  } else {
    throw new Error('Banking groups failed');
  }

  // Test 6: 2.10 SMS Config
  const sms = await request('POST', '/api/manual/sms-config', { senderNumber: '02-9999-8888', allowSendStart: '08:30', allowSendEnd: '19:30' });
  if (sms.data && sms.data.config && sms.data.config.senderNumber === '02-9999-8888') {
    console.log('✅ [6/7] Section 2.10 SMS Sender & Restrictions: PASS');
  } else {
    throw new Error('SMS config failed');
  }

  // Test 7: 2.11.3 Restriction Groups & 2.11.4 Notices
  const restr = await request('POST', '/api/manual/restriction-groups', { code: 'd', name: '토요방과후 그룹', description: '토요일 강좌 중복 차단' });
  const notices = await request('POST', '/api/manual/notice-settings', { loginTopText: '2026학년도 신학기 접수 안내' });
  if (restr.data.success && notices.data.success) {
    console.log('✅ [7/7] Section 2.11 Restriction Groups & Notice Texts: PASS');
  } else {
    throw new Error('Section 2.11 settings failed');
  }

  console.log('🎉 [Test Harness] All 7 Section 2 Features Tested & 100% Passed!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
