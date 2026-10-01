const http = require('http');

function request(method, path, body = null) {
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
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
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

async function run() {
  console.log('=== STARTING AUTHENTIC MODALS TEST HARNESS ===\n');

  // Test 1: Student Search API
  console.log('[Test 1] Student Search API');
  const r1 = await request('GET', '/api/student/search?grade=1');
  console.log('  Status:', r1.status);
  console.log('  Found students:', r1.body.totalCount);
  if (!r1.body.success || r1.body.totalCount === 0) throw new Error('Student search failed');
  const targetStudent = r1.body.students[0];
  console.log(`  Selected test student: ${targetStudent.grade}학년 ${targetStudent.classNum}반 ${targetStudent.studentName}`);

  // Test 2: Sin Course Evaluation API (Before Apply)
  console.log('\n[Test 2] Sin Course Evaluation API (Before Apply)');
  const gc = encodeURIComponent(`${targetStudent.grade}학년 ${targetStudent.classNum}반`);
  const sn = encodeURIComponent(targetStudent.studentName);
  const r2 = await request('GET', `/api/af/ad_app/sin-courses?studentName=${sn}&gradeClass=${gc}&period=26%EB%85%84%208%EC%9B%94&schoolId=3267`);
  console.log('  Status:', r2.status);
  console.log('  Total courses evaluated:', r2.body.totalCount);
  console.log('  Currently applied count:', r2.body.appliedCount);
  if (!r2.body.success || r2.body.courses.length === 0) throw new Error('Course evaluation failed');
  const targetCourse = r2.body.courses[0];
  console.log(`  Target course: ${targetCourse.title} (Status: ${targetCourse.status})`);

  // Test 3: Direct Apply API
  console.log('\n[Test 3] Direct Apply API');
  const r3 = await request('POST', '/api/af/ad_app/direct-apply', {
    studentName: targetStudent.studentName,
    gradeClass: `${targetStudent.grade}학년 ${targetStudent.classNum}반`,
    studentNum: targetStudent.studentNum,
    parentPhone: targetStudent.parentPhone,
    courseId: targetCourse.id,
    schoolId: 3267
  });
  console.log('  Status:', r3.status);
  console.log('  Message:', r3.body.message);
  if (!r3.body.success) throw new Error('Direct apply failed');

  // Test 4: Sin Course Evaluation API (After Apply)
  console.log('\n[Test 4] Sin Course Evaluation API (After Apply)');
  const r4 = await request('GET', `/api/af/ad_app/sin-courses?studentName=${sn}&gradeClass=${gc}&period=26%EB%85%84%208%EC%9B%94&schoolId=3267`);
  console.log('  Applied count now:', r4.body.appliedCount);
  const evaluatedTarget = r4.body.courses.find(c => String(c.id) === String(targetCourse.id));
  console.log(`  Target course status after apply: ${evaluatedTarget.status} (Should be applied)`);
  if (evaluatedTarget.status !== 'applied') throw new Error('Course status not updated to applied');

  // Test 5: Direct Cancel API
  console.log('\n[Test 5] Direct Cancel API');
  const r5 = await request('POST', '/api/af/ad_app/direct-cancel', {
    studentName: targetStudent.studentName,
    gradeClass: `${targetStudent.grade}학년 ${targetStudent.classNum}반`,
    courseId: targetCourse.id,
    schoolId: 3267
  });
  console.log('  Status:', r5.status);
  console.log('  Message:', r5.body.message);
  if (!r5.body.success) throw new Error('Direct cancel failed');

  // Test 6: Fee Management Data API
  console.log('\n[Test 6] Fee Management Data API');
  const r6 = await request('GET', `/api/af/ad_pay/edit-data?courseId=${targetCourse.id}&schoolId=3267`);
  console.log('  Status:', r6.status);
  console.log('  Applicants for fee edit:', r6.body.totalCount);
  if (!r6.body.success || r6.body.totalCount === 0) throw new Error('Fee data fetch failed');
  const firstApp = r6.body.applicants[0];
  console.log(`  Sample fee row: ${firstApp.studentName} - Tuition: ${firstApp.tuitionFee}, Material: ${firstApp.materialFee}`);

  // Test 7: Fee Management Save API
  console.log('\n[Test 7] Fee Management Save API');
  const r7 = await request('POST', '/api/af/ad_pay/save-edit-data', {
    items: [
      {
        id: firstApp.id,
        tuitionFee: 42000,
        facilityFee: 7500,
        instructorFee: 30000,
        bookFee: 5000,
        materialFee: 18000
      }
    ]
  });
  console.log('  Status:', r7.status);
  console.log('  Message:', r7.body.message);
  if (!r7.body.success) throw new Error('Fee save failed');

  // Test 8: Copy Course API
  console.log('\n[Test 8] Copy Course API');
  const course2 = r2.body.courses[1] || r2.body.courses[0];
  const r8 = await request('POST', '/api/af/ad_app/copy-course', {
    courseId1: targetCourse.id,
    courseId2: course2.id,
    inputType: 'add',
    schoolId: 3267
  });
  console.log('  Status:', r8.status);
  console.log('  Message:', r8.body.message);
  if (!r8.body.success) throw new Error('Copy course failed');

  // Test 9: Unapplied Students API
  console.log('\n[Test 9] Unapplied Students API');
  const r9 = await request('GET', '/api/af/ad_app/unapplied-students?schoolId=3267');
  console.log('  Status:', r9.status);
  console.log('  Unapplied students count:', r9.body.totalCount);
  if (!r9.body.success) throw new Error('Unapplied students failed');

  console.log('\n========================================');
  console.log('ALL 9 AUTHENTIC MODAL TESTS PASSED 100%!');
  console.log('========================================');
}

run().catch(err => {
  console.error('\nTEST FAILED:', err);
  process.exit(1);
});
